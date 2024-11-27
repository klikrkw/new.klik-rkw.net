<?php

namespace App\Traits;
use App\Models\UserFirebase;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Kreait\Firebase\Messaging\CloudMessage;

trait PeriodetimeTrait {

    public function getPeriodTimes($period = 'today')
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
    public function getNextPeriodTimes($period = 'today')
    {
        $dt1 = Carbon::now();
        $dt2 = Carbon::now();
        $dt3 = Carbon::now();
        $dt4 = Carbon::now()->addDays(7);
        $dt5 = Carbon::now()->setDay(1);
        $dt6 = Carbon::now()->endOfMonth();
        $dt7 = Carbon::now()->setMonth(1)->setDay(1);
        $dt8 = Carbon::now()->endOfMonth();
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

public function getPeriodOpts()
{
    $period_opts = [
        ['value' => 'today', 'label' => 'Hari ini'],
        ['value' => 'this_week', 'label' => 'Minggu ini'],
        ['value' => 'this_month', 'label' => 'Bulan ini'],
        ['value' => 'this_year', 'label' => 'Tahun ini'],
        ['value' => 'tanggal', 'label' => 'Tanggal'],
    ];
    return $period_opts;
}
}
