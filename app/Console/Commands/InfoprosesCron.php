<?php

namespace App\Console\Commands;

use App\Models\Prosespermohonan;
use App\Services\MessageBuilder;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class InfoprosesCron extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'infoproses:cron';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $datas = '';
        $now = Carbon::now();
        $today = $now->toDateString();
        $prosespermohonans = Prosespermohonan::query();
        $prosespermohonans = $prosespermohonans->where('is_alert',true)
        ->whereRaw('? >= date(prosespermohonans.start) and ?<= date(prosespermohonans.end)',  [$today, $today]);


        $prosespermohonans = $prosespermohonans
            ->with('statusprosesperms', function ($q) {
                $q->where('active', true);
            })
            ->with('itemprosesperm')
            ->with('transpermohonan.jenispermohonan')
            ->with('transpermohonan.permohonan', function ($query) {
                $query->select('id', 'nama_pelepas', 'nama_penerima', 'atas_nama', 'jenishak_id', 'desa_id', 'nomor_hak', 'persil', 'klas', 'luas_tanah')
                    ->with('users:id,name')
                    ->with('jenishak')
                    ->with('desa', function ($query) {
                        $query->select('id', 'nama_desa', 'kecamatan_id')->with('kecamatan:id,nama_kecamatan');
                    });

            });
            $prosespermohonans = $prosespermohonans->orderBy('id', 'desc')->skip(0)->take(20)->get();
        $data=[];
        $wa_api_url = config('onesender.base_api_url','');
        $wa_api_key = config('onesender.api_key','');

        $client = new MessageBuilder([
           'api_url' => 'https://wa514-client.cloudwa.my.id/api/v1/messages',
           'api_key' => 'uFKhAiefD4ioyaIO.ZF66Vc0kQPbux78t0cVcALcXR2VhOiNG'
        ]);

        $sdata='==== INFO PROSES ==== ';
        if(count($prosespermohonans)>0){
            foreach ($prosespermohonans as $i => $v) {
                $sdata .= "\n".sprintf('%s. *%s*, %s',$i+1, $v->itemprosesperm->nama_itemprosesperm.' - '.$v->catatan_prosesperm.' tgl.'.Carbon::parse($v->created_at)->format('d-m-Y'), ' '.'('. $v->transpermohonan->nodaftar . ') '
                .$v->transpermohonan->permohonan->nama_penerima.', '.
                ''. $v->transpermohonan->permohonan->alas_hak ." ". $v->transpermohonan->permohonan->letak_obyek.', '.
                'Staf : '. collect($v->transpermohonan->permohonan->users)->implode('name', ','));
            }

            // $client->to('6281325367857')
            $client->to('120363199077733366@g.us')
            ->content($sdata)
            ->send();
            // Log::info($sdata);
        }
}
}
