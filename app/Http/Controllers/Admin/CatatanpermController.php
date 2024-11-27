<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Api\BaseController;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\CatatanpermCollection;
use App\Http\Resources\Admin\KeluarbiayapermCollection;
use App\Models\Catatanperm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class CatatanpermController extends BaseController
{
    public function store(Request $request)
    {
    $validated =  request()->validate([
        'fieldcatatan_id' => ['required'],
        'isi_catatanperm' => ['required'],
        'image_catatanperm' => ['nullable'],
        'transpermohonan_id' => ['required'],
    ]);

    $permohonan = Catatanperm::create(
        $validated
    );
    // return $this->sendResponse(['status'=>'sukses'],'Sukses');
    return redirect()->back()->with('success', 'catatan baru telah ditambahkan');

    }
    public function list()
    {
        $transpermohonan_id = request('transpermohonan_id');
        $keluarbiayaperms = Catatanperm::query();
        $keluarbiayaperms = $keluarbiayaperms->with(['fieldcatatan'])->where('transpermohonan_id', '=', $transpermohonan_id)
        ->cursorPaginate(10)->withQueryString();
        return CatatanpermCollection::collection($keluarbiayaperms);
    }
    public function destroy(Catatanperm $catatanperm)
    {
        $catatanperm->delete();
        return Redirect::back()->with('success', 'Catatan telah dihapus.');
    }

}
