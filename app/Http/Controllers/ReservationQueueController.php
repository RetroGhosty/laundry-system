<?php

namespace App\Http\Controllers;

use App\Events\CustomerTrackReservationStatusEvent;
use App\Events\MakeTransactionEvent;
use App\Models\Transaction;
use App\Models\User;
use App\Selections\TransactionStatus;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationQueueController extends Controller
{
    //
    public function index(){
        $currentOrders = Transaction::orderBy('updated_at', 'desc')->whereNot('status', TransactionStatus::COMPLETE->value)->whereNot('status', TransactionStatus::UNPAID->value)->get();
        $payload = [
            'currentOrders' => $currentOrders
        ];

        return Inertia::render('Admin/ReservationQueue', $payload);
    }

    public function changeStatus(Request $request){
        $request->validate([
            'id' => 'required|string',
            'status' => 'required|string'
        ]);
        
        $transaction = Transaction::find($request->id);
        if (!$transaction){
            return redirect()->back()->with('error', 'Transaction not found!');
        }

        $oldStatus = $transaction->status;

        $transaction->status = $request->status;
        $transaction->save();
        try {
            broadcast(new CustomerTrackReservationStatusEvent($transaction->user_id, $oldStatus, $transaction->status))->toOthers();
            return redirect()->back()->with('success', 'Transaction status updated!');
        } catch (\Throwable $th) {
            return redirect()->back()->with('success', 'Transaction status updated!');
        }

    }

}
