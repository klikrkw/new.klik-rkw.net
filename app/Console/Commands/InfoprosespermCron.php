<?php

namespace App\Console\Commands;

use App\Models\Dkeluarbiayapermuser;
use App\Models\Prosespermohonan;
use App\Services\MessageBuilder;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class InfoprosespermCron extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'infoprosesperm:cron';

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
        $now = Carbon::now();
        $keluarbiayapermusers = Dkeluarbiayapermuser::query();
        $keluarbiayapermusers = $keluarbiayapermusers->with('itemkegiatan');
        $keluarbiayapermusers = $keluarbiayapermusers->with('transpermohonan.permohonan.users');
        $keluarbiayapermusers = $keluarbiayapermusers->whereHas('itemkegiatan',function ($query) {
            $query->where('is_alert', '=', true);
        });
        $keluarbiayapermusers = $keluarbiayapermusers->whereRaw('date(dkeluarbiayapermusers.date_alert) = ?',  [$now->format('Y-m-d')]);
        $keluarbiayapermusers = $keluarbiayapermusers->orderBy('id', 'desc')->skip(0)->take(20)->get();
        $nu=0;
        $data=[];
        foreach ($keluarbiayapermusers as $k => $v) {
                    $nu++;
                    $users = $v->transpermohonan->permohonan->users->pluck('name')->toArray();
                    $susers = implode(", ",$users);
                    $data[] = [
                        'title'=>sprintf('%s - %s',$v->itemkegiatan->nama_itemkegiatan,Carbon::parse($v->created_at)->format('d-m-Y')),
                        'body'=>sprintf("%s - %s, %s %s, Staf:%s",$v->transpermohonan->no_daftar, $v->transpermohonan->permohonan->nama_penerima, $v->transpermohonan->permohonan->alas_hak,$v->transpermohonan->permohonan->desa->nama_desa, $susers)
                    ];
                }
        // $wa_api_url = config('onesender.base_api_url','');
        // $wa_api_key = config('onesender.api_key','');

        $client = new MessageBuilder([
            'api_url' => 'https://wa514-client.cloudwa.my.id/api/v1/messages',
            'api_key' => 'uFKhAiefD4ioyaIO.ZF66Vc0kQPbux78t0cVcALcXR2VhOiNG'
        ]);
        $sdata='== INFO PROSES PERMOHONAN ==';
        if(count($data)>0){
            for ($i=0; $i < count($data) ; $i++) {
                $sdata .= "\n".sprintf('%s. *%s*, %s  ',$i+1, $data[$i]['title'], $data[$i]['body'])."\n";
            }
            // $client->to('120363199077733366@g.us')
            $client->to('120363199077733366@g.us')
            ->content($sdata)
            ->send();
            // Log::info('Send Message WA Berhasil');
        }
            // Log::info('Send Message WA');
    }
}
