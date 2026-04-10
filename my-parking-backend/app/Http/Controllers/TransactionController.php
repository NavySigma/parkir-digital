<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Services\MidtransConfig;

class TransactionController extends Controller
{
    public function create(Request $request)
    {
        $request->validate([
            'tmdb_id' => 'required',
            'tmdb_username' => 'required',
            'amount' => 'required|integer|min:1',
        ]);

        MidtransConfig::set();

        $txId = 'TX-' . Str::upper(Str::random(8)) . '-' . time();

        $tx = Transaction::create([
            'tx_id' => $txId,
            'tmdb_id' => $request->tmdb_id,
            'tmdb_username' => $request->tmdb_username,
            'amount' => $request->amount,
            'status' => 'pending',
        ]);

        // Prepare Midtrans params (Snap) - using Snap token to generate payment page/QR
        $params = [
            'transaction_details' => [
                'order_id' => $tx->tx_id,
                'gross_amount' => (int) $tx->amount,
            ],
            'customer_details' => [
                'first_name' => $tx->tmdb_username,
            ]
        ];

        try {
            $snapToken = \Midtrans\Snap::getSnapToken($params);
            $paymentUrl = 'https://app.sandbox.midtrans.com/snap/v2/vtweb/' . $snapToken;

            $tx->update([
                'snap_token' => $snapToken,
                'payment_url' => $paymentUrl,
            ]);
        } catch (\Exception $e) {
            // handle error but still return tx
            return response()->json([
                'success' => false,
                'message' => 'Midtrans error: ' . $e->getMessage()
            ], 500);
        }

        return response()->json([
            'success' => true,
            'transaction' => $tx,
        ]);
    }

    public function status($txId)
    {
        $tx = Transaction::where('tx_id', $txId)->first();
        if (! $tx) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }

        // auto-expire after 5 minutes if still pending
        if ($tx->status === 'pending' && $tx->created_at->addMinutes(5)->isPast()) {
            $tx->status = 'expired';
            $tx->save();
        }

        return response()->json(['success' => true, 'transaction' => $tx]);
    }

    public function verify($txId)
    {
        $tx = Transaction::where('tx_id', $txId)->first();
        if (! $tx) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }

        if ($tx->status !== 'pending') {
            return response()->json(['success' => false, 'message' => 'Already processed', 'transaction' => $tx]);
        }

        $tx->update([
            'status' => 'paid',
            'paid_at' => Carbon::now(),
        ]);

        return response()->json(['success' => true, 'transaction' => $tx]);
    }

    // Midtrans webhook callback
    public function midtransCallback(Request $request)
    {
        MidtransConfig::set();
        $notif = new \Midtrans\Notification();

        $orderId = $notif->order_id ?? $request->input('order_id');
        $transactionStatus = $notif->transaction_status ?? $request->input('transaction_status');

        $tx = Transaction::where('tx_id', $orderId)->first();
        if (! $tx) {
            return response()->json(['success' => false, 'message' => 'tx not found'], 404);
        }

        if ($transactionStatus === 'settlement' || $transactionStatus === 'capture') {
            $tx->update([
                'status' => 'paid',
                'paid_at' => Carbon::now(),
            ]);
        }

        return response()->json(['success' => true]);
    }
}
