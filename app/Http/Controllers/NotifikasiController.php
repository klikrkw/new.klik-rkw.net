<?php

namespace App\Http\Controllers;

use App\Models\Pengaturan;
use App\Models\User;
use App\Services\MessageBuilder;
use Illuminate\Http\Request;

class NotifikasiController extends Controller
{
    public function sendWhatsapp()
    {
         $validated =  request()->validate([
            'title' => ['required', 'max:50'],
            'body' => ['required'],
            'user_ids' => ['required'],
            'alluser' => ['nullable'],
            'datas' => ['required'],
            'pesan' => ['nullable'],
        ]);

        // $wa_api_url = config('onesender.base_api_url','');
        // $wa_api_key = config('onesender.api_key','');

        $client = new MessageBuilder([
            'api_url' => 'https://wa514-client.cloudwa.my.id/api/v1/messages',
            'api_key' => 'uFKhAiefD4ioyaIO.ZF66Vc0kQPbux78t0cVcALcXR2VhOiNG'
        ]);
        if($validated['alluser'] && $validated['alluser'] == true){
            $no_grup_wa = Pengaturan::getNilai('no_grup_wa');
            $sdata ='== INFORMASI ==';
                        $sdata .= "\n".sprintf('*%s*, %s  ', $validated['title'], $validated['body'])."\n";
                        if($validated['pesan']){
                          $sdata .= "Pesan : ". $validated['pesan']."\n";
                        }
                    // $client->to('120363199077733366@g.us')
                $client->to($no_grup_wa)
                ->content($sdata)
                ->send();
        }else{
            for ($i=0; $i < count($validated['user_ids']); $i++) {
                $user  = User::find($validated['user_ids'][$i]);
                if($user && $user->telp_user){
                $sdata ='== INFORMASI ==';
                        $sdata .= "\n".sprintf('*%s*, %s  ', $validated['title'], $validated['body'])."\n";
                        if($validated['pesan']){
                          $sdata .= "Pesan : ". $validated['pesan']."\n";
                        }
                    // $client->to('120363199077733366@g.us')
                $client->to($user->telp_user)
                ->content($sdata)
                ->send();
                }
            }
        }
        return response()->json([
            'message' => 'success'
        ], 200);
    }
}
