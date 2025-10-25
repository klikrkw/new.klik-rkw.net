<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Akun;
use App\Models\Jurnalumum;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class LapKeuanganAdminController extends Controller
{
    private function getPeriodTimes($period = 'today')
    {
        $dt1 = Carbon::now();
        $dt2 = Carbon::now();
        $dt3 = Carbon::now()->subDays(7);
        $dt4 = Carbon::now();
        $dt5 = Carbon::now()->setDay(1);
        $dt6 = Carbon::now();
        $dt7 = Carbon::now()->setMonth(1)->setDay(1);
        $dt8 = Carbon::now();
        $dt9 = request('date1')?Carbon::parse(request('date1')):Carbon::now();
        $dt10 = request('date2')?Carbon::parse(request('date2')):Carbon::now();
        $periods = [
            'today' => [$dt1->setTime(0, 0, 1)->format('Y-m-d H:i:s'), $dt2->setTime(24, 0, 0)->format('Y-m-d H:i:s')],
            'this_week' => [$dt3->setTime(0, 0, 1)->format('Y-m-d H:i:s'), $dt4->setTime(24, 0, 0)->format('Y-m-d H:i:s')],
            'this_month' => [$dt5->setTime(0, 0, 1)->format('Y-m-d H:i:s'), $dt6->setTime(24, 0, 0)->format('Y-m-d H:i:s')],
            'this_year' => [$dt7->setTime(0, 0, 1)->format('Y-m-d H:i:s'), $dt8->setTime(24, 0, 0)->format('Y-m-d H:i:s')],
            'tanggal' => [$dt9->setTime(0, 0, 1)->format('Y-m-d H:i:s'), $dt10->setTime(24, 0, 0)->format('Y-m-d H:i:s')],
        ];
        if (key_exists($period, $periods)) {
            return $periods[$period];
        }
        return $periods['today'];
    }
    public function bukuBesar()
    {
        $akuns = Akun::all();
        $media = request('media', 'screen');
        $cyear = Carbon::now()->year;
        $year = request('year', $cyear);

        $date1 = Carbon::now();
        $date2 = Carbon::now();
        // $last_day = $date2->daysInMonth;
        $now = Carbon::now();
        $prev = $date1->subDays(7);
        // $prev = $date1->setDay(1);

        if (request()->has(['date1']) && request()->has(['date2'])) {
            $now = Carbon::parse(request('date2'));
            $prev = Carbon::parse(request('date1'));
            $year = $prev->year;
        }

        // ->selectRaw('price * ? as price_with_tax', [1.0825])
        // ->selectRaw('akuns.kode_akun,akuns.nama_akun,if(jenisakuns.kode_jenisakun=1 or jenisakuns.kode_jenisakun=5,
        // if(sum(debet)>sum(kredit),sum(debet)-sum(kredit),sum(kredit)-sum(debet)),0) as debet,
        // if(jenisakuns.kode_jenisakun >1 and jenisakuns.kode_jenisakun<5,
        // if(sum(debet)>sum(kredit),sum(debet)-sum(kredit),sum(kredit)-sum(debet)),0) as kredit')
        $period_opts = [
            ['value' => 'today', 'label' => 'Hari ini'],
            ['value' => 'this_week', 'label' => 'Minggu ini'],
            ['value' => 'this_month', 'label' => 'Bulan ini'],
            ['value' => 'this_year', 'label' => 'Tahun ini'],
            ['value' => 'tanggal', 'label' => 'Tanggal'],
        ];
        $period = request('period', 'today');
        $periods = $this->getPeriodTimes($period);

        $akun_id = request('akun_id', 1);
        $page = request('page', 1);
        $pre = Jurnalumum::whereRaw('YEAR(jurnalumums.created_at)=?', $year)
            ->where('jurnalumums.akun_id', $akun_id)
            ->whereRaw('jurnalumums.debet+jurnalumums.kredit>0')
            ->whereRaw('jurnalumums.created_at >= ? and jurnalumums.created_at <= ?',  [$periods])
            ->selectRaw('jurnalumums.id, jurnalumums.created_at, jenisakuns.kode_jenisakun, akuns.kode_akun,akuns.nama_akun,jurnalumums.uraian, jurnalumums.debet, jurnalumums.kredit, jurnalumums.no_urut')
            ->join('akuns', 'jurnalumums.akun_id', 'akuns.id')
            ->join('kelompokakuns', 'akuns.kelompokakun_id', 'kelompokakuns.id')
            ->join('jenisakuns', 'kelompokakuns.jenisakun_id', 'jenisakuns.id')
            ->orderBy('jurnalumums.no_urut', 'asc');

        $result = $pre->simplePaginate(20)->withQueryString();

        $saldo = 0;
        $prev_saldo = 0;
        if (count($result) > 0) {
            $prev_q = Jurnalumum::whereRaw('YEAR(jurnalumums.created_at)=?', $year)
                ->where('jurnalumums.akun_id', $akun_id)
                ->whereRaw('jurnalumums.no_urut < ?',  [$result[0]->no_urut])->selectRaw('if(jenisakuns.kode_jenisakun>1 and jenisakuns.kode_jenisakun<5,
            sum(kredit)-sum(debet),sum(debet)-sum(kredit)) as saldo')
                ->join('akuns', 'jurnalumums.akun_id', 'akuns.id')
                ->join('kelompokakuns', 'akuns.kelompokakun_id', 'kelompokakuns.id')
                ->join('jenisakuns', 'kelompokakuns.jenisakun_id', 'jenisakuns.id')
                ->groupBy('jenisakuns.kode_jenisakun')
                ->first();
            if ($prev_q) {
                $prev_saldo = $prev_q->saldo;
            }
        }
        $saldo = $prev_saldo;

        for ($i = 0; $i < count($result); $i++) {
            $value = $result[$i];
            if ($value->kode_jenisakun > 1 && $value->kode_jenisakun < 5) {
                $saldo += ($value->kredit - $value->debet);
            } else {
                $saldo += ($value->debet - $value->kredit);
            }
            $result[$i]->nourut = ($page - 1) * 20 + $i + 1;
            $result[$i]->tanggal = Carbon::parse($value->created_at)->format('d-m-Y H:i:s');
            $result[$i]->saldo = number_format($saldo);
            $value->debet = number_format($value->debet);
            $value->kredit = number_format($value->kredit);
        }

        if ($media == 'print') {
            $tanggal = Carbon::now()->format('d M Y');
            $pdf = Pdf::loadView('pdf.lapBukubesar', [
                'media' => $media,
                'judul_lap' => 'BUKU BESAR',
                'bukubesars' => $result,
                'akunopts' => collect($akuns)->map(fn ($o) => ['label' => $o->nama_akun, 'value' => $o->id])->toArray(),
                'periodOpts' => $period_opts,
                'akun_id' => $akun_id,
                'period' => $period,
                'tanggal' => $tanggal,
            ])->setPaper(array(0, 0, 609.4488, 935.433), 'portrait');
            return 'data:application/pdf;base64,' . base64_encode($pdf->stream());
        }
        return Inertia::render(
            'Admin/Informasi/Keuangan/BukuBesar',
            [
                'media' => $media,
                'bukubesars' => $result,
                'akunopts' => collect($akuns)->map(fn ($o) => ['label' => $o->nama_akun, 'value' => $o->id])->toArray(),
                'periodOpts' => $period_opts,
                'akun_id' => $akun_id,
                'period' => $period,
                'date1' => $prev->format('Y-m-d'),
                'date2' => $now->format('Y-m-d'),
            ]
        );
    }
    public function neraca()
    {
        $media = request('media', 'screen');
        $year_opts = [];
        $cyear = Carbon::now()->year;
        $year = request('year', $cyear);

        for ($i = 0; $i < 5; $i++) {
            array_push($year_opts, ['value' => ($cyear - $i), 'label' => ($cyear - $i)]);
        }

        $pre = Jurnalumum::whereRaw('YEAR(jurnalumums.created_at)=?', $year)
            ->selectRaw('akuns.kode_akun, akuns.nama_akun,jenisakuns.nama_jenisakun, jenisakuns.kode_jenisakun, if(jenisakuns.kode_jenisakun=1 or jenisakuns.kode_jenisakun=5,
            sum(debet)-sum(kredit),0) as debet,
            if(jenisakuns.kode_jenisakun >1 and jenisakuns.kode_jenisakun<5,
            sum(kredit)-sum(debet),0) as kredit')
            ->join('akuns', 'jurnalumums.akun_id', 'akuns.id')
            ->join('kelompokakuns', 'akuns.kelompokakun_id', 'kelompokakuns.id')
            ->join('jenisakuns', 'kelompokakuns.jenisakun_id', 'jenisakuns.id')
            ->orderBy('akuns.kode_akun')
            ->groupBy('akuns.kode_akun')
            ->groupBy('akuns.nama_akun')
            ->groupBy('jenisakuns.nama_jenisakun')
            ->groupBy('jenisakuns.kode_jenisakun');
        $result = $pre->get();

        $tot_debet = 0;
        $tot_kredit = 0;
        $neracas = [];
        $modal = 0;
        $pendapatan = 0;
        $biaya = 0;

        for ($i = 0; $i < count($result); $i++) {
            $value = $result[$i];
            if($value->kode_jenisakun == '1'){
                $aktiva = $value;
                array_push($neracas,['kode_akun' =>$value->kode_akun,'nama_akun'=>$value->nama_akun,'debet'=>number_format($value->debet),'kredit'=> number_format($value->kredit)]);
                $tot_debet += $value->debet;
                $tot_kredit += $value->kredit;
                }
            elseif($value->kode_jenisakun == '2'){
                $pasiva = $value;
                array_push($neracas,['kode_akun' =>$value->kode_akun,'nama_akun'=>$value->nama_akun,'debet'=>number_format($value->debet),'kredit'=> number_format($value->kredit)]);
                $tot_debet += $value->debet;
                $tot_kredit += $value->kredit;
                }
            elseif($value->kode_jenisakun == '3'){
                $modal = $value->kredit;
            }
            elseif($value->kode_jenisakun == '4'){
                $pendapatan = $value->kredit;
            }
            elseif($value->kode_jenisakun == '5'){
                $biaya = $value->debet;
            }
            // $value->debet = number_format($value->debet);
            // $value->kredit = number_format($value->kredit);
        }
            $kode_modal = Akun::where('slug','modal-kantor')->first();
            $tot_kredit += $modal+($pendapatan - $biaya);
            $modal = ['kode_akun' =>$kode_modal?$kode_modal->kode_akun:'','nama_akun'=>'Modal','debet'=>0,'kredit'=> number_format($tot_kredit)];
            array_push($neracas,$modal);

            if ($media == 'print') {
            $tanggal = Carbon::now()->format('d M Y');
            $pdf = Pdf::loadView('pdf.lapNeraca', [
                'judul_lap' => 'NERACA',
                'media' => $media,
                'neracas' => $neracas,
                'totDebet' => number_format($tot_debet),
                'totKredit' => number_format($tot_kredit),
                'yearOpts' => $year_opts,
                'year' => $year,
                'tanggal' => $tanggal,
            ])->setPaper(array(0, 0, 609.4488, 935.433), 'portrait');
            return 'data:application/pdf;base64,' . base64_encode($pdf->stream());
        }

        return Inertia::render(
            'Admin/Informasi/Keuangan/Neraca',
            [
                'neracas' => $neracas,
                'totDebet' => number_format($tot_debet),
                'totKredit' => number_format($tot_kredit),
                'yearOpts' => $year_opts,
                'year' => $year,
            ]
        );
    }
    public function neraca1()
    {
        $media = request('media', 'screen');
        $year_opts = [];
        $cyear = Carbon::now()->year;
        $year = request('year', $cyear);

        for ($i = 0; $i < 5; $i++) {
            array_push($year_opts, ['value' => ($cyear - $i), 'label' => ($cyear - $i)]);
        }
        $pre = Jurnalumum::whereRaw('YEAR(jurnalumums.created_at)=?', $year)
            ->selectRaw('akuns.kode_akun, akuns.nama_akun, if(jenisakuns.kode_jenisakun=1 or jenisakuns.kode_jenisakun=5,
            sum(debet)-sum(kredit),0) as debet,
            if(jenisakuns.kode_jenisakun >1 and jenisakuns.kode_jenisakun<5,
            sum(kredit)-sum(debet),0) as kredit')
            ->join('akuns', 'jurnalumums.akun_id', 'akuns.id')
            ->join('kelompokakuns', 'akuns.kelompokakun_id', 'kelompokakuns.id')
            ->join('jenisakuns', 'kelompokakuns.jenisakun_id', 'jenisakuns.id')
            ->orderBy('akuns.kode_akun')
            ->groupBy('akuns.kode_akun')
            ->groupBy('akuns.nama_akun');
        $result = $pre->get();
        $tot_debet = 0;
        $tot_kredit = 0;
        for ($i = 0; $i < count($result); $i++) {
            $value = $result[$i];
            $tot_debet += $value->debet;
            $tot_kredit += $value->kredit;
            $value->debet = number_format($value->debet);
            $value->kredit = number_format($value->kredit);
        }
        if ($media == 'print') {
            $tanggal = Carbon::now()->format('d M Y');
            $pdf = Pdf::loadView('pdf.lapNeraca', [
                'judul_lap' => 'NERACA',
                'media' => $media,
                'neracas' => $result,
                'totDebet' => number_format($tot_debet),
                'totKredit' => number_format($tot_kredit),
                'yearOpts' => $year_opts,
                'year' => $year,
                'tanggal' => $tanggal,
            ])->setPaper(array(0, 0, 609.4488, 935.433), 'portrait');
            return 'data:application/pdf;base64,' . base64_encode($pdf->stream());
        }

        return Inertia::render(
            'Admin/Informasi/Keuangan/Neraca',
            [
                'neracas' => $result,
                'totDebet' => number_format($tot_debet),
                'totKredit' => number_format($tot_kredit),
                'yearOpts' => $year_opts,
                'year' => $year,
            ]
        );
    }

}
