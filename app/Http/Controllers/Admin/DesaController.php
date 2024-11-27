<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Desa;
use Illuminate\Http\Request;

class DesaController extends Controller
{
    public function desaList(Request $request)
    {
        $query = $request->input('query', '');
        $expr = '/^[0-9]*$/';
        $results = [];
        if (preg_match($expr, $query) && filter_var($query, FILTER_VALIDATE_INT)) {
            $id = $query;
            $results = Desa::join('kecamatans', 'kecamatans.id', '=', 'desas.kecamatan_id')
                ->select('desas.id as value', 'nama_desa', 'kecamatans.nama_kecamatan')
                ->where('desas.id', '=', $id)->skip(0)->take(10)->get();
        } else {
            $id = "%$query%";
            $results = Desa::join('kecamatans', 'kecamatans.id', '=', 'desas.kecamatan_id')
                ->select('desas.id', 'nama_desa', 'kecamatans.nama_kecamatan')
                ->where('nama_desa', 'like', $id)->skip(0)->take(10)->get();
        }
        return Response()->json($results);
    }
}
