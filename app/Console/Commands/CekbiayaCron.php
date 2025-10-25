<?php

namespace App\Console\Commands;

use App\Models\Permohonan;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CekbiayaCron extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cekbiaya:cron';

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
        $datas = Permohonan::where('cek_biaya', 0)->where('period_cekbiaya', 'limited')->where('date_cekbiaya', '=', Carbon::now()->format('Y-m-d'))
        ->skip(0)->take(100)->get();
        if(count($datas)>0){
            for ($i=0; $i < count($datas) ; $i++) {
                $row = $datas[$i];
                $row->update([
                    'cek_biaya' => 1,
                ]);
            }
        }
            // Log::info($sdata);
    }
}
