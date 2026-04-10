<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Services\MidtransConfig;
use Illuminate\Support\Str;
use Carbon\Carbon;

class TransactionController extends Controller
{
    // create transaction and generate midtrans snap token
    public function create(Request $request)
    {
        $data = $request->validate([
            'customer_name' => 'nullable|string|max:255',
            'amount' => 'nullable|integer|min:1' // default 2000 if not provided
        ]);

        $amount = $data['amount'] ?? 2000;

        // set midtrans config
        MidtransConfig::set();

        // create tx
        $txId = 'TX-' . Str::upper(Str::random(8)) . '-' . time();

        $tx = Transaction::create([
            'tx_id' => $txId,
            'customer_name' => $request->customer_name,
            'amount' => $amount,
            'status' => 'pending',
        ]);

        // prepare midtrans params (Snap)
        $params = [
            'transaction_details' => [
                'order_id' => $tx->tx_id,
                'gross_amount' => (int) $tx->amount,
            ],
            'customer_details' => [
                'first_name' => $tx->customer_name ?? 'Guest',
                'phone' => $tx->customer_phone ?? ''
            ],
            // you can add 'item_details' if necessary
        ];

        try {
            $snapToken = \Midtrans\Snap::getSnapToken($params);
            // For VT Web redirect (vtweb), the payment page is created via Snap token.
            // We can build payment_url for redirect to Midtrans VT-Web:
            $paymentUrl = "https://app.sandbox.midtrans.com/snap/v2/vtweb/{$snapToken}";
            if (env('MIDTRANS_IS_PRODUCTION') === true || env('MIDTRANS_IS_PRODUCTION') === 'true') {
                $paymentUrl = "https://app.midtrans.com/snap/v2/vtweb/{$snapToken}";
            }

            $tx->update([
                'snap_token' => $snapToken,
                'payment_url' => $paymentUrl,
            ]);
        } catch (\Exception $e) {
            // return error to frontend
            return response()->json(['success'=>false,'message'=>'Midtrans error: '.$e->getMessage()],500);
        }

        // return transaction & payment info
        return response()->json([
            'success' => true,
            'transaction' => $tx,
            // frontend will render QR pointing to your frontend pay route for tx
            'qr_payload' => url('/') . "/pay/{$tx->tx_id}" // see note below about route name
        ]);
    }

    // return transaction status & payment_url
    public function status($txId)
    {
        $tx = Transaction::where('tx_id',$txId)->first();
        if (!$tx) return response()->json(['success'=>false,'message'=>'Not found'],404);

        // expire auto after 5 minutes
        if ($tx->status === 'pending' && $tx->created_at->addMinutes(5)->isPast()) {
            $tx->update(['status'=>'expired']);
        }

        return response()->json(['success'=>true,'transaction'=>$tx]);
    }

    // optional verify endpoint to mark paid manually (not used with Midtrans)
    public function verify($txId)
    {
        $tx = Transaction::where('tx_id',$txId)->first();
        if (!$tx) return response()->json(['success'=>false,'message'=>'Not found'],404);
        if ($tx->status !== 'pending') return response()->json(['success'=>false,'message'=>'Already processed','transaction'=>$tx]);

        $tx->update(['status'=>'paid','paid_at'=>now()]);
        return response()->json(['success'=>true,'transaction'=>$tx]);
    }

    // Midtrans webhook / callback
    public function midtransCallback(Request $request)
    {
        MidtransConfig::set();

        // Use Midtrans Notification helper to parse
        try {
            $notification = new \Midtrans\Notification();
        } catch (\Exception $e) {
            // fallback: try to parse request body
            $notificationData = $request->all();
            // you can compute signature here if needed
            // but prefer Midtrans Notification class
            return response()->json(['success'=>false,'message'=>$e->getMessage()],500);
        }

        $orderId = $notification->order_id ?? $notificationData['order_id'] ?? null;
        $transactionStatus = $notification->transaction_status ?? $notificationData['transaction_status'] ?? null;
        $fraudStatus = $notification->fraud_status ?? null;

        $tx = Transaction::where('tx_id',$orderId)->first();
        if (!$tx) return response()->json(['success'=>false,'message'=>'tx not found'],404);

        // handle status
        if ($transactionStatus === 'capture') {
            // capture (credit card) -> check fraud
            if ($fraudStatus === 'challenge') {
                // set to pending / challenge
                $tx->update(['status'=>'pending']);
            } else {
                $tx->update(['status'=>'paid','paid_at'=>now()]);
            }
        } elseif ($transactionStatus === 'settlement') {
            $tx->update(['status'=>'paid','paid_at'=>now()]);
        } elseif (in_array($transactionStatus, ['cancel','deny','expire'])) {
            $tx->update(['status'=>'failed']);
        }

        return response()->json(['success'=>true]);
    }
}
