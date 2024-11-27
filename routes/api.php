<?php

use App\Http\Controllers\Api\Admin\BayarbiayapermApiController;
use App\Http\Controllers\Api\Admin\BiayapermApiController;
use App\Http\Controllers\Api\Admin\KasbonApiController;
use App\Http\Controllers\Api\Admin\KeluarbiayaApiController;
use App\Http\Controllers\Api\Admin\KeluarbiayapermuserApiController;
use App\Http\Controllers\Api\Admin\LapKeuanganAdminApiController;
use App\Http\Controllers\Api\Admin\ProsespermohonanApiController;
use App\Http\Controllers\Api\Admin\RincianbiayapermApiController;
use App\Http\Controllers\Api\Admin\TranspermohonanApiController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FirebaseApiController;
use App\Http\Controllers\Api\UserApiController;
use App\Models\Keluarbiayapermuser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
// signup and login
Route::post('/signup', [AuthController::class, 'sign_up']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/users/test',[UserApiController::class, 'test'])->name('users.test');

Route::group(['middleware' => ['auth:sanctum']], function () {
    // logout
    // Route::get('/user', function (Request $request) {

    //         return $request->user();
    Route::get('/user',[UserApiController::class, 'show'])->name('users.show');

    Route::post('/logout', function(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->noContent();
    });

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::patch('/update_fcmtoken', [FirebaseApiController::class, 'updateFcmtoken'])->name('update.fcmtoken');
    Route::post('/send_message', [FirebaseApiController::class, 'sendMessage'])->name('send.message');
    Route::get('/users',[UserApiController::class, 'index'])->name('users.index');
    Route::get('/users/listoptions',[UserApiController::class, 'listOptions'])->name('users.listoptions');
    Route::get('/test', function (Request $request) {
        return response()->json(['data'=>"data"]);
    });
    Route::get('/kasbons',[KasbonApiController::class, 'index'])->name('kasbons.index');
    Route::get('/kasbons/status_kasbons/{kasbon}',[KasbonApiController::class, 'statusKasbons'])->name('kasbons.status_kasbons');
    Route::patch('/kasbons/update_status/{kasbon}', [KasbonApiController::class, 'updateStatus'])->name('kasbons.update_status');
    Route::get('/kasbons/test',[KasbonApiController::class, 'test'])->name('kasbons.test');
    Route::get('/transpermohonans',[TranspermohonanApiController::class, 'index'])->name('transpermohonans.index');
    Route::get('/transpermohonans/show',[TranspermohonanApiController::class, 'show'])->name('transpermohonans.show');
    Route::get('/prosespermohonans/getoptions',[ProsespermohonanApiController::class, 'getOptions'])->name('prosespermohonans.getoptions');
    Route::get('/prosespermohonans/bypermohonan',[ProsespermohonanApiController::class, 'byPermohonan'])->name('prosespermohonans.bypermohonan');
    Route::get('/prosespermohonans/bystatus',[ProsespermohonanApiController::class, 'byStatus'])->name('prosespermohonans.bystatus');
    Route::post('/prosespermohonans/store',[ProsespermohonanApiController::class, 'store'])->name('prosespermohonans.store');
    Route::post('/prosespermohonans/statusprosesperms/update/{prosespermohonan}',[ProsespermohonanApiController::class, 'updateStatusprosesperm'])->name('prosespermohonans.statusprosesperms.update');
    Route::get('/biayaperms',[BiayapermApiController::class, 'index'])->name('biayaperms.index');
    Route::post('/biayaperms/store',[BiayapermApiController::class, 'store'])->name('biayaperms.store');
    Route::delete('/biayaperms/destroy/{biayaperm}',[BiayapermApiController::class, 'destroy'])->name('biayaperms.destroy');
    Route::get('/bayarbiayaperms',[BayarbiayapermApiController::class, 'index'])->name('bayarbiayaperms.index');
    Route::get('/biayaperms/show/{biayaperm}',[BiayapermApiController::class, 'show'])->name('biayaperms.show');
    Route::get('/bayarbiayaperms/metodebayaropts',[BayarbiayapermApiController::class, 'metodebayarOpts'])->name('bayarbiayaperms.metodebayaropts');
    Route::get('/bayarbiayaperms/rekeningopts',[BayarbiayapermApiController::class, 'rekeningOpts'])->name('bayarbiayaperms.rekeningopts');
    Route::post('/bayarbiayaperms/store',[BayarbiayapermApiController::class, 'store'])->name('bayarbiayaperms.store');
    Route::get('/rincianbiayaperms/options',[RincianbiayapermApiController::class, 'options'])->name('biayaperms.options');
    Route::get('/keuangans/bukubesars/pageparams',[LapKeuanganAdminApiController::class, 'pageParams'])->name('keuangans.bukubesars.pageparams');
    Route::get('/keuangans/bukubesars',[LapKeuanganAdminApiController::class, 'bukuBesar'])->name('keuangans.bukubesars.index');
    Route::get('/keluarbiayapermusers',[KeluarbiayapermuserApiController::class, 'index'])->name('keluarbiayapermusers.index');
    Route::get('/keluarbiayapermusers/status_keluarbiayapermusers/{keluarbiayapermuser?}',[KeluarbiayapermuserApiController::class, 'statusKeluarbiayapermusers'])->name('keluarbiayapermusers.status_keluarbiayapermusers');
    Route::patch('/keluarbiayapermusers/update_status/{keluarbiayapermuser}', [KeluarbiayapermuserApiController::class, 'updateStatus'])->name('keluarbiayapermusers.update_status');
    Route::get('/keluarbiayapermusers/getoptions',[KeluarbiayapermuserApiController::class, 'getOptions'])->name('keluarbiayapermusers.getoptions');
    Route::get('/keluarbiayas/getoptions',[KeluarbiayaApiController::class, 'getOptions'])->name('keluarbiayas.getoptions');
    Route::get('/keluarbiayas',[KeluarbiayaApiController::class, 'index'])->name('keluarbiayas.index');
    Route::get('/keluarbiayas/status_keluarbiayas/{keluarbiaya?}',[KeluarbiayaApiController::class, 'statusKeluarbiayas'])->name('keluarbiayas.status_keluarbiayas');
    Route::patch('/keluarbiayas/update_status/{keluarbiaya}', [KeluarbiayaApiController::class, 'updateStatus'])->name('keluarbiayas.update_status');
    Route::get('/dkeluarbiayas/listbykeluarbiayaid', [KeluarbiayaApiController::class, 'listByKeluarbiayaId'])->name('dkeluarbiayas.api.listbykeluarbiayaid');
    Route::get('/rincianbiayaperms/list', [RincianbiayapermApiController::class, 'list'])->name('rincianbiayaperms.api.list');
    Route::get('/dkeluarbiayapermusers/list', [KeluarbiayapermuserApiController::class, 'list'])->name('dkeluarbiayapermusers.api.list');
    Route::get('/dkeluarbiayapermusers/listbykeluarbiayapermuserid', [KeluarbiayapermuserApiController::class, 'listByKeluarbiayapermuserId'])->name('dkeluarbiayapermusers.api.listbykeluarbiayapermuserid');
    Route::get('/keuangans/bukubesarperms',[LapKeuanganAdminApiController::class, 'bukuBesarperm'])->name('keuangans.bukubesarperms.index');
    Route::post('/keluarbiayapermusers/store',[KeluarbiayapermuserApiController::class, 'store'])->name('keluarbiayapermusers.store');
    Route::post('/keluarbiayas/store',[KeluarbiayaApiController::class, 'store'])->name('keluarbiayas.store');
    Route::get('/keuangans/neracas/pageparams',[LapKeuanganAdminApiController::class, 'neracaPageParams'])->name('keuangans.neracas.pageparams');
    Route::get('/keuangans/neracas',[LapKeuanganAdminApiController::class, 'neraca'])->name('keuangans.neracas.index');
    Route::get('/dkeluarbiayas', [KeluarbiayaApiController::class, 'list'])->name('dkeluarbiayas.api.list');
    Route::get('/kasbons/statuskasbonopts',[KasbonApiController::class, 'statusKasbonOpts'])->name('kasbons.statuskasbonopts');
    Route::get('/transpermohonans/tempatarsips/show',[TranspermohonanApiController::class, 'showTempatarsip'])->name('transpermohonans.tempatarsips.show');
    Route::get('/transpermohonans/tempatarsips/showbykode',[TranspermohonanApiController::class, 'showTempatarsipbykode'])->name('transpermohonans.tempatarsips.showbykode');
    Route::post('/transpermohonans/tempatarsips/store',[TranspermohonanApiController::class, 'storeTempatarsip'])->name('transpermohonans.tempatarsips.store');
    Route::get('/transpermohonans/tempatarsips/list',[TranspermohonanApiController::class, 'listTempatarsip'])->name('transpermohonans.tempatarsips.list');
});

