<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Contact;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
  public function store(Request $request)
  {
    

    $validator = Validator::make($request->all(), [
      'name' => 'required|string|max:255',
      'email' => 'required|email|max:255',
      'message' => 'required|string|max:2000',
    ]);

    if ($validator->fails()) {
      return response()->json(['errors' => $validator->errors()], 422);
    }

    $contact = Contact::create([
      'name' => $request->name,
      'email' => $request->email,
      'message' => $request->message,
      'ip' => $request->ip(),
    ]);

    // optional: dispatch notification/email queue here

    return response()->json($request->all());
  }
}
