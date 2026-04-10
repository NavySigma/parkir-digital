<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Api\TransactionController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ContactController;

Route::middleware('api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::middleware('api')->post('/contact', [ContactController::class, 'store']);

Route::post('/transaction/create', [TransactionController::class, 'create']);
Route::get('/transaction/status/{txId}', [TransactionController::class, 'status']);
Route::get('/transaction/verify/{txId}', [TransactionController::class, 'verify']); // optional
Route::post('/midtrans/callback', [TransactionController::class, 'midtransCallback']);
