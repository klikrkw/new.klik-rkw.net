<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Prosespermohonan;
use App\Models\Transpermohonan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserMainController extends Controller
{
    private function random_hex_color()
    {
        $r = rand(0, 255);
        $g = rand(0, 255);
        $b = rand(0, 255);
        return sprintf('#%02x%02x%02x', $r, $g, $b);
    }

    public function index()
    {
        $query = Transpermohonan::selectRaw('jenispermohonans.nama_jenispermohonan, count(jenispermohonan_id) as jumlah')
            ->join('jenispermohonans', 'transpermohonans.jenispermohonan_id', 'jenispermohonans.id')
            ->groupBy('jenispermohonan_id')
            ->get();
        $collection = collect($query);
        $data = [];
        if (count($query) > 0) {
            $total = $collection->reduce(function ($carry, $item) {
                return $carry + $item['jumlah'];
            }, 0);
            $procentages = $collection->map(function ($item) use ($total) {
                $perc = $item['jumlah'] / $total * 100;
                $item['percentage'] = $perc;
                $item['bg_color'] = trim($this->random_hex_color());
                return $item;
            });
            $data = $procentages;
        }
        $query = Prosespermohonan::selectRaw('permohonans.nama_penerima,desas.nama_desa, jenishaks.singkatan, permohonans.nomor_hak, permohonans.persil, permohonans.klas, prosespermohonans.catatan_prosesperm, prosespermohonans.created_at, itemprosesperms.nama_itemprosesperm')
            ->join('itemprosesperms', 'prosespermohonans.itemprosesperm_id', 'itemprosesperms.id')
            ->join('transpermohonans', 'prosespermohonans.transpermohonan_id', 'transpermohonans.id')
            ->join('permohonans', 'transpermohonans.permohonan_id', 'permohonans.id')
            ->join('desas', 'permohonans.desa_id', 'desas.id')
            ->join('jenishaks', 'permohonans.jenishak_id', 'jenishaks.id')
            ->orderBy('prosespermohonans.created_at', 'desc')
            ->take(5)->skip(0)->get();
        $collection = collect($query);
        $prosesperms = $collection->map(function ($item) use ($total) {
            $identitas = $item['singkatan'] . $item['nomor_hak'] . ', Desa ' . $item['nama_desa'];
            if ($item['singkatan'] == 'C') {
                $identitas = $item['singkatan'] . $item['nomor_hak'] . ', Ps' . $item['persil'] . ',' . $item['klas'] . ', Desa ' . $item['nama_desa'];
            }
            $item['identitas'] = $identitas;
            $item['tanggal'] = Carbon::parse($item['created_at'])->format('d F Y H:i:s');
            return $item;
        });

        return Inertia::render('UserDashboard', ['traffics' => $data, 'recentActivities' => $prosesperms]);
    }
}
