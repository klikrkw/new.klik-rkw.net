<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AkunController;
use App\Http\Controllers\Admin\AnggarankeluarbiayapermController;
use App\Http\Controllers\Admin\BayarbiayapermController;
use App\Http\Controllers\Admin\BiayapermController;
use App\Http\Controllers\Admin\CatatanpermController;
use App\Http\Controllers\Admin\DesaController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Staf\EventStafController;
use App\Http\Controllers\Admin\FirebaseController;
use App\Http\Controllers\Admin\ItemkegiatanController;
use App\Http\Controllers\Admin\ItemprosespermController;
use App\Http\Controllers\Admin\ItemrincianbiayapermController;
use App\Http\Controllers\Admin\JenispermohonanController;
use App\Http\Controllers\Admin\JurnalumumController;
use App\Http\Controllers\Admin\KantorController;
use App\Http\Controllers\Admin\KasbonController;
use App\Http\Controllers\Admin\KeluarbiayaController;
use App\Http\Controllers\Admin\KeluarbiayapermController;
use App\Http\Controllers\Admin\KeluarbiayapermuserController;
use App\Http\Controllers\Admin\LapKeuanganAdminController;
use App\Http\Controllers\Admin\PemohonController;
use App\Http\Controllers\Admin\PengaturanController;
use App\Http\Controllers\Admin\PermohonanController;
use App\Http\Controllers\Admin\PostingjurnalController;
use App\Http\Controllers\Admin\ProsespermohonanController;
use App\Http\Controllers\Admin\RekeningController;
use App\Http\Controllers\Admin\RincianbiayapermController;
use App\Http\Controllers\Admin\RuangController;
use App\Http\Controllers\Admin\StatusprosespermController;
use App\Http\Controllers\Admin\TempatarsipController;
use App\Http\Controllers\Admin\TempatarsipStafController;
use App\Http\Controllers\Admin\TempatberkasController;
use App\Http\Controllers\Admin\TransPermohonanController;
use App\Http\Controllers\NotifikasiController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\Staf\AnggarankeluarbiayapermStafController;
use App\Http\Controllers\Staf\BiayapermStafController;
use App\Http\Controllers\Staf\KasbonStafController;
use App\Http\Controllers\Staf\KeluarbiayapermuserStafController;
use App\Http\Controllers\Staf\KeluarbiayaStafController;
use App\Http\Controllers\Staf\PermohonanStafController;
use App\Http\Controllers\Staf\ProsespermohonanStafController;
use App\Http\Controllers\Staf\RincianbiayapermStafController;
use App\Http\Controllers\Staf\StafController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\TwoFactorController;
use App\Http\Controllers\User\UserMainController;
use App\Http\Controllers\UserController;
use App\Models\Rincianbiayaperm;
use App\Models\Transpermohonan;
use Illuminate\Support\Facades\Route;

use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    if (request()->user()) {
        return redirect()->intended(request()->user()->getRedirectRoute());
    }
    // return Inertia::render('Welcome', [
    //     'canLogin' => Route::has('login'),
    //     'canRegister' => Route::has('register'),
    //     'laravelVersion' => Application::VERSION,
    //     'phpVersion' => PHP_VERSION,
    // ]);
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    // return Inertia::render('Dashboard');
    return redirect()->intended(request()->user()->getRedirectRoute());
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware(['auth','twofactor'])->group(function () {
    // Route::get('/testapp/{transpermohonan}', [BiayapermController::class,'RincianbiayaOpts'])->name('testapp');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/test', [TestController::class, 'index'])->name('test.index');
    Route::get('/test/show', [TestController::class, 'show'])->name('test.show');
    Route::patch('/update_fcmtoken', [FirebaseController::class, 'updateFcmtoken'])->name('update.fcmtoken');
    Route::post('/send_message', [FirebaseController::class, 'sendMessage'])->name('send.message');
    Route::post('/send_message_mobile', [FirebaseController::class, 'sendMessageMobile'])->name('send.message.mobile');
    Route::get('/rincianbiayaperms/lap/{rincianbiayaperm}/staf', [RincianbiayapermStafController::class, 'lapRincianbiayaperm'])->name('lap.rincianbiayaperms.staf');
    Route::get('/keluarbiayapermusers/lap/staf/{keluarbiayapermuser}', [KeluarbiayapermuserStafController::class, 'lapKeluarbiayapermstaf'])->name('keluarbiayapermusers.lap.staf');
    Route::get('/keluarbiayas/lap/staf/{keluarbiaya}', [KeluarbiayaStafController::class, 'lapKeluarbiayastaf'])->name('keluarbiayas.lap.staf');
    Route::get('/rincianbiayaperms/lap/staf/{rincianbiayaperm}', [RincianbiayapermController::class, 'lapRincianbiayaperm'])->name('rincianbiayaperms.lap.staf');
    Route::get('/tempatarsips/listbyruang/{ruang}', [TempatarsipController::class,'listByRuang'])->name('tempatarsips.listbyruang');
    Route::get('/posisiberkas/listbytempatberkas/{tempatberkas}', [TempatberkasController::class,'listByTempatberkas'])->name('posisiberkas.listbytempatberkas');
});
// Users
Route::middleware(['auth', 'role:admin|staf','twofactor'])->prefix('/admin')->name('admin.')->group(function () {
    Route::get('/users/api/list', [UserController::class, 'userList'])->name('users.api.list');
    Route::get('/desas/api/list', [DesaController::class, 'desaList'])->name('desas.api.list');
    Route::get('/permohonans/api/list', [PermohonanController::class, 'List'])->name('permohonans.api.list');
    Route::get('/permohonans/api/show/{id}', [PermohonanController::class, 'show'])->name('permohonans.api.show');
    Route::get('/permohonans/api/list', [PermohonanController::class, 'List'])->name('permohonans.api.list');
    Route::get('/transpermohonans/api/list', [TransPermohonanController::class, 'List'])->name('transpermohonans.api.list');
    Route::post('/messages/api/sendmessagetomobile', [FirebaseController::class, 'sendMessageToMobile'])->name('messages.api.sendmessagetomobile');
    Route::post('/messages/api/sendmessagetomobilerole', [FirebaseController::class, 'sendMessageToMobileRole'])->name('messages.api.sendmessagetomobilerole');
    Route::post('/messages/api/senddatatomobilerole', [FirebaseController::class, 'sendDataToMobileRole'])->name('messages.api.senddatatomobilerole');
    Route::post('/messages/api/senddatatomobileruser', [FirebaseController::class, 'sendDataToMobileUser'])->name('messages.api.senddatatomobileruser');
    Route::post('/messages/api/senddatatowebuser', [FirebaseController::class, 'sendDataToWebUser'])->name('messages.api.senddatatowebuser');
    Route::get('/tempatarsips/api/list', [TempatarsipController::class, 'list'])->name('tempatarsips.api.list');
    Route::get('/tempatberkas/api/list', [TempatarsipController::class, 'list'])->name('tempatberkas.api.list');
    Route::get('/transpermohonans/api/{transpermohonan}/show', [TransPermohonanController::class, 'show'])->name('transpermohonans.api.show');
    Route::get('/catatanperms/api/list', [CatatanpermController::class, 'list'])->name('catatanperms.api.list');
    Route::post('/catatanperms/store', [CatatanpermController::class, 'store'])->name('catatanperms.store');
    Route::delete('/catatanperms/{catatanperm}/destroy', [CatatanpermController::class, 'destroy'])->name('catatanperms.destroy');
    Route::post('/notifikasis/api/sendwhatsapp', [NotifikasiController::class, 'sendWhatsapp'])->name('notifikasis.api.sendwhatsapp');
});

Route::middleware(['auth', 'role:staf', 'twofactor'])->prefix('/staf')->name('staf.')->group(function () {
    Route::get('/', [StafController::class, 'index'])->name('index');
    Route::resource('/permohonans', PermohonanStafController::class);
    Route::get('/permohonans/modal/create', [PermohonanStafController::class,'modalCreate'])->name('permohonans.modal.create');
    Route::post('/permohonans/modal/store', [PermohonanStafController::class,'modalStore'])->name('permohonans.modal.store');
    Route::get('/permohonans/modal/{permohonan}/edit', [PermohonanStafController::class,'modalEdit'])->name('permohonans.modal.edit');
    Route::put('/permohonans/modal/update/{permohonan}', [PermohonanStafController::class,'modalUpdate'])->name('permohonans.modal.update');
    Route::get('/permohonans/api/show/{id}', [PermohonanStafController::class, 'show'])->name('permohonans.api.show');
    Route::get('/permohonans/qrcode/create', [PermohonanStafController::class,'createQrcode'])->name('permohonans.qrcode.create');
    Route::get('/permohonans/qrcode/{transpermohonan}/cetak', [PermohonanStafController::class, 'cetakQrcode'])->name('permohonans.qrcode.cetak');
    Route::get('/permohonans/labelberkas/{transpermohonan}/cetak', [PermohonanStafController::class, 'printLabelberkas'])->name('permohonans.labelberkas.cetak');
    Route::get('/tempatarsips/qrcode/{tempatarsip}/cetak', [TempatarsipStafController::class, 'cetakQrcode'])->name('tempatarsips.qrcode.cetak');

});
Route::middleware(['auth', 'role:user','twofactor'])->prefix('/user')->name('user.')->group(function () {
    Route::get('/', [UserMainController::class, 'index'])->name('index');
});

Route::middleware(['auth', 'role:admin','twofactor'])->prefix('/admin')->name('admin.')->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('index');
    Route::resource('/users', UserController::class);
    Route::resource('/permissions', PermissionController::class);
    Route::resource('/roles', RoleController::class);
    Route::resource('/pemohons', PemohonController::class);
    Route::resource('/permohonans', PermohonanController::class);
    Route::resource('/jenispermohonans', JenispermohonanController::class);
    Route::resource('/itemprosesperms', ItemprosespermController::class);
    Route::resource('/statusprosesperms', StatusprosespermController::class);
    Route::resource('/akuns', AkunController::class);
    Route::resource('/itemkegiatans', ItemkegiatanController::class);
    Route::resource('/rekenings', RekeningController::class);
    Route::resource('/kantors', KantorController::class);
    Route::resource('/pengaturans', PengaturanController::class);
    Route::resource('/ruangs', RuangController::class);
    Route::resource('/tempatarsips', TempatarsipController::class);
    Route::get('/users/extra/pesan/{user}', [UserController::class, 'pesan'])->name('user.extra.pesan');
    Route::get('/permohonans/modal/create', [PermohonanController::class,'modalCreate'])->name('permohonans.modal.create');
    Route::post('/permohonans/modal/store', [PermohonanController::class,'modalStore'])->name('permohonans.modal.store');
    Route::get('/permohonans/modal/{permohonan}/edit', [PermohonanController::class,'modalEdit'])->name('permohonans.modal.edit');
    Route::put('/permohonans/modal/update/{permohonan}', [PermohonanController::class,'modalUpdate'])->name('permohonans.modal.update');
    Route::resource('/itemrincianbiayaperms', ItemrincianbiayapermController::class);
    Route::get('/permohonans/qrcode/create', [PermohonanController::class,'createQrcode'])->name('permohonans.qrcode.create');
    Route::get('/permohonans/qrcode/{transpermohonan}/cetak', [PermohonanController::class, 'cetakQrcode'])->name('permohonans.qrcode.cetak');
    Route::get('/tempatarsips/qrcode/{tempatarsip}/cetak', [TempatarsipController::class, 'cetakQrcode'])->name('tempatarsips.qrcode.cetak');

    Route::resource('/tempatberkas', TempatberkasController::class);
    Route::get('/permohonans/labelberkas/{transpermohonan}/cetak', [PermohonanController::class, 'printLabelberkas'])->name('permohonans.labelberkas.cetak');
    Route::get('/tempatarsips/qrcode/{tempatberkas}/cetak', [TempatberkasController::class, 'cetakQrcode'])->name('tempatberkas.qrcode.cetak');
    Route::get('/utils/backupdb', [AdminController::class, 'backupDb'])->name('utils.backupdb');
    Route::get('/utils/backupdb/{filename}/download', [AdminController::class, 'downloadFile'])->name('utils.backupdb.download');
    // Route::get('/permohonans/labelberkas/{transpermohonan}/print', [PermohonanController::class, 'printLabelberkas'])->name('permohonans.labelberkas.print');

    // Route::get('/transpermohonans/api/list', [TransPermohonanController::class, 'List'])->name('transpermohonans.api.list');

});
Route::middleware(['auth', 'role:admin|staf','twofactor'])->prefix('/transaksi')->name('transaksi.')->group(function () {
    Route::get('/prosespermohonans/api/listbypermohonanid', [ProsespermohonanController::class, 'listByPermohonanId'])->name('prosespermohonans.api.listbypermohonanid');
    Route::get('/transpermohonans/api/list', [TransPermohonanController::class, 'List'])->name('transpermohonans.api.list');
    Route::get('/biayaperms/create', [BiayapermController::class, 'create'])->name('biayaperms.create');
    Route::post('/biayaperms/store', [BiayapermController::class, 'store'])->name('biayaperms.store');
    Route::put('/biayaperms/update/{biayaperm}', [BiayapermController::class, 'update'])->name('biayaperms.update');
    Route::delete('/biayaperms/{biayaperm}/destroy', [BiayapermController::class, 'destroy'])->name('biayaperms.destroy');
    Route::resource('/bayarbiayaperms', BayarbiayapermController::class);
    Route::resource('/jurnalumums', JurnalumumController::class);
    Route::resource('/keluarbiayaperms', KeluarbiayapermController::class);
    Route::resource('/kasbons', KasbonController::class);
    Route::get('/bayarbiayaperms/api/list', [BayarbiayapermController::class, 'list'])->name('bayarbiayaperms.api.list');
    Route::get('/keluarbiayaperms/api/list', [KeluarbiayapermController::class, 'list'])->name('keluarbiayaperms.api.list');
    Route::get('/keluarbiayaperms/api/totalpengeluaran', [KeluarbiayapermController::class, 'getTotalPengeluaran'])->name('keluarbiayaperms.api.totalpengeluaran');
    Route::get('/jurnalumums/api/neracapermohonan', [JurnalumumController::class, 'NeracaPermohonan'])->name('jurnalumums.api.neracapermohonan');
    Route::get('/dkeluarbiayapermusers/api/list', [KeluarbiayapermuserStafController::class, 'list'])->name('dkeluarbiayapermusers.api.list');
    Route::get('/dkeluarbiayapermusers/api/totalpengeluaran', [KeluarbiayapermuserStafController::class, 'getTotalPengeluaran'])->name('dkeluarbiayapermusers.api.totalpengeluaran');
    Route::delete('/dkeluarbiayapermusers/{dkeluarbiayapermuser}/destroy', [KeluarbiayapermuserStafController::class, 'destroyDkeluarbiayapermuser'])->name('dkeluarbiayapermusers.destroy');
    Route::get('/keluarbiayapermusers/api/updatekasbon/{id}', [KeluarbiayapermuserStafController::class, 'updateKasbon'])->name('keluarbiayapermusers.api.updatekasbon');
    Route::get('/rincianbiayaperms/api/list', [RincianbiayapermController::class, 'list'])->name('rincianbiayaperms.api.list');
    Route::get('/biayaperms/{transpermohonan}/api/rincianbiayapermopts', [BiayapermController::class,'RincianbiayaOpts'])->name('biayaperms.api.rincianbiayapermopts');
    Route::get('/dkasbons/api/list', [KasbonController::class, 'list'])->name('dkasbons.api.list');
    Route::get('/dkasbons/api/totalpengeluaran', [KasbonController::class, 'getTotalKasbon'])->name('dkasbons.api.totalkasbon');
    Route::delete('/dkasbons/{dkasbon}/destroy', [KasbonController::class, 'destroyDkasbon'])->name('dkasbons.destroy');
    Route::get('/jurnalumums/neracapermohonan/{transpermohonan}/cetak', [JurnalumumController::class, 'NeracaPermohonanPdf'])->name('jurnalumums.neracapermohonan.cetak');
});

Route::middleware(['auth', 'role:staf', 'twofactor'])->prefix('/staf/transaksi')->name('staf.transaksi.')->group(function () {
    Route::get('/keluarbiayapermusers', [KeluarbiayapermuserStafController::class, 'index'])->name('keluarbiayapermusers.index');
    Route::get('/keluarbiayapermusers/create', [KeluarbiayapermuserStafController::class, 'create'])->name('keluarbiayapermusers.create');
    Route::get('/keluarbiayapermusers/{keluarbiayapermuser}/edit', [KeluarbiayapermuserStafController::class, 'edit'])->name('keluarbiayapermusers.edit');
    Route::post('/keluarbiayapermusers/store', [KeluarbiayapermuserStafController::class, 'store'])->name('keluarbiayapermusers.store');
    Route::put('/keluarbiayapermusers/update/{keluarbiayapermuser}', [KeluarbiayapermuserStafController::class, 'update'])->name('keluarbiayapermusers.update');
    Route::delete('/dkeluarbiayapermusers/{dkeluarbiayapermuser}/destroy', [KeluarbiayapermuserStafController::class, 'destroyDkeluarbiayapermuser'])->name('dkeluarbiayapermusers.destroy');
    Route::get('/keluarbiayapermusers/api/updatekasbon/{id}', [KeluarbiayapermuserStafController::class, 'updateKasbon'])->name('keluarbiayapermusers.api.updatekasbon');
    Route::put('/keluarbiayapermusers/status/update/{keluarbiayapermuser}', [KeluarbiayapermuserStafController::class, 'updateStatus'])->name('keluarbiayapermusers.status.update');
    Route::get('/keluarbiayapermusers/lap/staf/{keluarbiayapermuser}', [KeluarbiayapermuserStafController::class, 'lapKeluarbiayapermstaf'])->name('keluarbiayapermusers.lap.staf');
    Route::get('/biayaperms/create', [BiayapermStafController::class, 'create'])->name('biayaperms.create');
    Route::post('/biayaperms/store', [BiayapermStafController::class, 'store'])->name('biayaperms.store');
    Route::put('/biayaperms/update/{biayaperm}', [BiayapermStafController::class, 'update'])->name('biayaperms.update');
    Route::delete('/biayaperms/{biayaperm}/destroy', [BiayapermStafController::class, 'destroy'])->name('biayaperms.destroy');
    Route::resource('/kasbons', KasbonStafController::class);
    Route::get('/prosespermohonans/create', [ProsespermohonanStafController::class, 'create'])->name('prosespermohonans.create');
    Route::post('/prosespermohonans/store', [ProsespermohonanStafController::class, 'store'])->name('prosespermohonans.store');
    Route::post('/prosespermohonans/statusprosesperms/{prosespermohonan}/store', [ProsespermohonanStafController::class, 'statuspermStore'])->name('prosespermohonans.statusprosesperms.store');
    Route::delete('/prosespermohonans/statusprosesperms/{prosespermohonan}/{id}/destroy', [ProsespermohonanStafController::class, 'statuspermDestroy'])->name('prosespermohonans.statusprosesperms.destroy');
    Route::get('/prosespermohonans/api/listbypermohonanid', [ProsespermohonanStafController::class, 'listByPermohonanId'])->name('prosespermohonans.api.listbypermohonanid');
    // keluar biaya umums
    Route::get('/keluarbiayas', [KeluarbiayaStafController::class, 'index'])->name('keluarbiayas.index');
    Route::get('/keluarbiayas/create', [KeluarbiayaStafController::class, 'create'])->name('keluarbiayas.create');
    Route::get('/keluarbiayas/{keluarbiaya}/edit', [KeluarbiayaStafController::class, 'edit'])->name('keluarbiayas.edit');
    Route::post('/keluarbiayas/store', [KeluarbiayaStafController::class, 'store'])->name('keluarbiayas.store');
    Route::put('/keluarbiayas/update/{keluarbiaya}', [KeluarbiayaStafController::class, 'update'])->name('keluarbiayas.update');
    Route::delete('/dkeluarbiayas/{dkeluarbiaya}/destroy', [KeluarbiayaStafController::class, 'destroyDkeluarbiaya'])->name('dkeluarbiayas.destroy');
    Route::get('/keluarbiayas/api/updatekasbon/{id}', [KeluarbiayaStafController::class, 'updateKasbon'])->name('keluarbiayas.api.updatekasbon');
    Route::put('/keluarbiayas/status/update/{keluarbiaya}', [KeluarbiayaStafController::class, 'updateStatus'])->name('keluarbiayas.status.update');
    Route::get('/keluarbiayas/lap/staf/{keluarbiaya}', [KeluarbiayaStafController::class, 'lapKeluarbiayastaf'])->name('keluarbiayas.lap.staf');
    Route::get('/kasbons/lap/{kasbon}', [KasbonStafController::class, 'lapKasbon'])->name('kasbons.lap.kasbon');
    Route::get('/anggarankeluarbiayaperms/create/{kasbon}', [AnggarankeluarbiayapermStafController::class,'create'])->name('anggarankeluarbiayaperms.create');
    Route::post('/anggarankeluarbiayaperms/store/', [AnggarankeluarbiayapermStafController::class,'store'])->name('anggarankeluarbiayaperms.store');
    Route::delete('/anggarankeluarbiayaperms/{anggarankeluarbiayaperm}/destroy', [AnggarankeluarbiayapermStafController::class, 'destroy'])->name('anggarankeluarbiayaperms.destroy');
    Route::resource('/rincianbiayaperms', RincianbiayapermStafController::class);
    Route::delete('/drincianbiayaperms/{drincianbiayaperm}/destroy', [RincianbiayapermStafController::class, 'destroyDrincianbiayaperm'])->name('drincianbiayaperms.destroy');
    Route::get('/rincianbiayaperms/lap/staf/{rincianbiayaperm}', [RincianbiayapermStafController::class, 'lapRincianbiayaperm'])->name('rincianbiayaperms.lap.staf');
    Route::get('/kasbons/lap/staf/{kasbon}', [KasbonStafController::class, 'lapKasbonstaf'])->name('kasbons.lap.staf');
    Route::get('/transpermohonans/tempatarsips/create', [TransPermohonanController::class, 'createTempatarsip'])->name('transpermohonans.tempatarsips.create');
    Route::put('/transpermohonans/tempatarsips/{transpermohonan}/store', [TransPermohonanController::class, 'storeTempatarsip'])->name('transpermohonans.tempatarsips.store');
    Route::resource('/events', EventStafController::class);
    Route::delete('/dkasbons/{dkasbon}/destroy', [KasbonStafController::class, 'destroyDkasbon'])->name('dkasbons.destroy');
    Route::delete('/dkasbonnoperms/{dkasbonnoperm}/destroy', [KasbonStafController::class, 'destroyDkasbonnoperm'])->name('dkasbonnoperms.destroy');

    Route::get('/transpermohonans/posisiberkas/create', [TransPermohonanController::class, 'createPosisiberkas'])->name('transpermohonans.posisiberkas.create');
    Route::put('/transpermohonans/posisiberkas/{transpermohonan}/store', [TransPermohonanController::class, 'storePosisiberkas'])->name('transpermohonans.posisiberkas.store');
});
Route::middleware(['auth', 'role:admin','twofactor'])->prefix('/admin/transaksi')->name('admin.transaksi.')->group(function () {
    Route::get('/keluarbiayapermusers', [KeluarbiayapermuserController::class, 'index'])->name('keluarbiayapermusers.index');
    Route::get('/keluarbiayapermusers/create', [KeluarbiayapermuserController::class, 'create'])->name('keluarbiayapermusers.create');
    Route::get('/keluarbiayapermusers/{keluarbiayapermuser}/edit', [KeluarbiayapermuserController::class, 'edit'])->name('keluarbiayapermusers.edit');
    Route::post('/keluarbiayapermusers/store', [KeluarbiayapermuserController::class, 'store'])->name('keluarbiayapermusers.store');
    Route::put('/keluarbiayapermusers/update/{keluarbiayapermuser}', [KeluarbiayapermuserController::class, 'update'])->name('keluarbiayapermusers.update');
    Route::delete('/dkeluarbiayapermusers/{dkeluarbiayapermuser}/destroy', [KeluarbiayapermuserController::class, 'destroyDkeluarbiayapermuser'])->name('dkeluarbiayapermusers.destroy');
    Route::get('/keluarbiayapermusers/api/updatekasbon/{id}', [KeluarbiayapermuserController::class, 'updateKasbon'])->name('keluarbiayapermusers.api.updatekasbon');
    Route::put('/keluarbiayapermusers/status/update/{keluarbiayapermuser}', [KeluarbiayapermuserController::class, 'updateStatus'])->name('keluarbiayapermusers.status.update');
    Route::get('/keluarbiayapermusers/lap/staf/{keluarbiayapermuser}', [KeluarbiayapermuserController::class, 'lapKeluarbiayapermstaf'])->name('keluarbiayapermusers.lap.staf');
    Route::get('/biayaperms/create', [BiayapermController::class, 'create'])->name('biayaperms.create');
    Route::post('/biayaperms/store', [BiayapermController::class, 'store'])->name('biayaperms.store');
    Route::put('/biayaperms/update/{biayaperm}', [BiayapermController::class, 'update'])->name('biayaperms.update');
    Route::delete('/biayaperms/{biayaperm}/destroy', [BiayapermController::class, 'destroy'])->name('biayaperms.destroy');
    // Route::resource('/kasbons', KasbonController::class);
    Route::get('/prosespermohonans/create', [ProsespermohonanController::class, 'create'])->name('prosespermohonans.create');
    Route::post('/prosespermohonans/store', [ProsespermohonanController::class, 'store'])->name('prosespermohonans.store');
    Route::post('/prosespermohonans/statusprosesperms/{prosespermohonan}/store', [ProsespermohonanController::class, 'statuspermStore'])->name('prosespermohonans.statusprosesperms.store');
    Route::delete('/prosespermohonans/statusprosesperms/{prosespermohonan}/{id}/destroy', [ProsespermohonanController::class, 'statuspermDestroy'])->name('prosespermohonans.statusprosesperms.destroy');
    Route::get('/prosespermohonans/api/listbypermohonanid', [ProsespermohonanController::class, 'listByPermohonanId'])->name('prosespermohonans.api.listbypermohonanid');

    Route::get('/kasbons', [KasbonController::class, 'index'])->name('kasbons.index');
    Route::get('/kasbons/create', [KasbonController::class, 'create'])->name('kasbons.create');
    Route::delete('/kasbons/{kasbon}/destroy', [KasbonController::class, 'destroy'])->name('kasbons.destroy');
    Route::get('/kasbons/{kasbon}/edit', [KasbonController::class, 'edit'])->name('kasbons.edit');
    Route::post('/kasbons/store', [KasbonController::class, 'store'])->name('kasbons.store');
    Route::put('/kasbons/update/{kasbon}', [KasbonController::class, 'update'])->name('kasbons.update');
    Route::put('/kasbons/status/update/{kasbon}', [KasbonController::class, 'updateStatus'])->name('kasbons.status.update');
    Route::get('/transpermohonans/tempatarsips/create', [TransPermohonanController::class, 'createTempatarsip'])->name('transpermohonans.tempatarsips.create');
    Route::put('/transpermohonans/tempatarsips/{transpermohonan}/store', [TransPermohonanController::class, 'storeTempatarsip'])->name('transpermohonans.tempatarsips.store');

    Route::get('/transpermohonans/posisiberkas/create', [TransPermohonanController::class, 'createPosisiberkas'])->name('transpermohonans.posisiberkas.create');
    Route::put('/transpermohonans/posisiberkas/{transpermohonan}/store', [TransPermohonanController::class, 'storePosisiberkas'])->name('transpermohonans.posisiberkas.store');

    // keluar biaya umums
    Route::get('/keluarbiayas', [KeluarbiayaController::class, 'index'])->name('keluarbiayas.index');
    Route::get('/keluarbiayas/create', [KeluarbiayaController::class, 'create'])->name('keluarbiayas.create');
    Route::get('/keluarbiayas/{keluarbiaya}/edit', [KeluarbiayaController::class, 'edit'])->name('keluarbiayas.edit');
    Route::post('/keluarbiayas/store', [KeluarbiayaController::class, 'store'])->name('keluarbiayas.store');
    Route::put('/keluarbiayas/update/{keluarbiaya}', [KeluarbiayaController::class, 'update'])->name('keluarbiayas.update');
    Route::delete('/dkeluarbiayas/{dkeluarbiaya}/destroy', [KeluarbiayaController::class, 'destroyDkeluarbiaya'])->name('dkeluarbiayas.destroy');
    Route::get('/keluarbiayas/api/updatekasbon/{id}', [KeluarbiayaController::class, 'updateKasbon'])->name('keluarbiayas.api.updatekasbon');
    Route::put('/keluarbiayas/status/update/{keluarbiaya}', [KeluarbiayaController::class, 'updateStatus'])->name('keluarbiayas.status.update');
    Route::get('/keluarbiayas/lap/staf/{keluarbiaya}', [KeluarbiayaController::class, 'lapKeluarbiayastaf'])->name('keluarbiayas.lap.staf');
    Route::resource('/postingjurnals', PostingjurnalController::class);
    Route::get('/kasbons/lap/{kasbon}', [KasbonController::class, 'lapKasbon'])->name('kasbons.lap.kasbon');
    Route::get('/anggarankeluarbiayaperms/create/{kasbon}', [AnggarankeluarbiayapermController::class,'create'])->name('anggarankeluarbiayaperms.create');
    Route::post('/anggarankeluarbiayaperms/store/', [AnggarankeluarbiayapermController::class,'store'])->name('anggarankeluarbiayaperms.store');
    Route::delete('/anggarankeluarbiayaperms/{anggarankeluarbiayaperm}/destroy', [AnggarankeluarbiayapermController::class, 'destroy'])->name('anggarankeluarbiayaperms.destroy');
    Route::resource('/rincianbiayaperms', RincianbiayapermController::class);
    Route::delete('/drincianbiayaperms/{drincianbiayaperm}/destroy', [RincianbiayapermController::class, 'destroyDrincianbiayaperm'])->name('drincianbiayaperms.destroy');
    Route::get('/rincianbiayaperms/lap/admin/{rincianbiayaperm}', [RincianbiayapermController::class, 'lapRincianbiayaperm'])->name('rincianbiayaperms.lap.admin');
    Route::resource('/events', EventController::class);
    Route::delete('/dkasbons/{dkasbon}/destroy', [KasbonController::class, 'destroyDkasbon'])->name('dkasbons.destroy');
    Route::delete('/dkasbonnoperms/{dkasbonnoperm}/destroy', [KasbonController::class, 'destroyDkasbonnoperm'])->name('dkasbonnoperms.destroy');
    Route::get('/kasbons/lap/staf/{kasbon}', [KasbonController::class, 'lapKasbonstaf'])->name('kasbons.lap.staf');
    Route::put('/rincianbiayaperms/biayaperms/update/{rincianbiayaperm}', [RincianbiayapermController::class, 'updateBiayaperm'])->name('rincianbiayaperms.biayaperms.update');

});

Route::middleware(['auth', 'role:admin','twofactor'])->prefix('/admin/informasi')->name('admin.informasi.')->group(function () {
    Route::get('/prosespermohonans', [ProsespermohonanController::class, 'index'])->name('prosespermohonans.index');
    Route::get('/prosespermohonans/bypermohonan', [ProsespermohonanController::class, 'byPermohonan'])->name('prosespermohonans.bypermohonan');
    Route::get('/transpermohonans/api/list', [TransPermohonanController::class, 'List'])->name('transpermohonans.api.list');
    Route::get('/keuangans/bukubesar', [LapKeuanganAdminController::class, 'bukuBesar'])->name('keuangans.bukubesar');
    Route::get('/keuangans/neraca', [LapKeuanganAdminController::class, 'neraca'])->name('keuangans.neraca');
    Route::get('/statusbiayaperms', [BiayapermController::class,'statusBiayaperm'])->name('statusbiayaperms');
    Route::get('/keluarbiayas', [KeluarbiayaController::class,'infoKeluarbiaya'])->name('keuangans.keluarbiayas');
    Route::get('/keluarbiayapermusers', [KeluarbiayapermuserController::class,'infoKeluarbiayapermuser'])->name('keuangans.keluarbiayapermusers');
});
Route::middleware(['auth', 'role:staf', 'twofactor'])->prefix('/staf/informasi')->name('staf.informasi.')->group(function () {
    Route::get('/prosespermohonans', [ProsespermohonanStafController::class, 'index'])->name('prosespermohonans.index');
    Route::get('/prosespermohonans/bypermohonan', [ProsespermohonanStafController::class, 'byPermohonan'])->name('prosespermohonans.bypermohonan');
    Route::get('/transpermohonans/api/list', [TransPermohonanController::class, 'List'])->name('transpermohonans.api.list');
    Route::get('/keluarbiayas', [KeluarbiayaStafController::class,'infoKeluarbiayaStaf'])->name('keuangans.keluarbiayas');
    Route::get('/keluarbiayapermusers', [KeluarbiayapermuserStafController::class,'infoKeluarbiayapermuser'])->name('keuangans.keluarbiayapermusers');
});

Route::middleware('auth')->group(function () {
    Route::get('/two-factor', [TwoFactorController::class, 'index' ])->name('two-factor.index');
    Route::post ('/two-factor', [TwoFactorController::class, 'verify' ])->name('two-factor.verify');
    Route::get ('/two-factor/logout', [TwoFactorController::class, 'logout' ])->name('two-factor.logout');
});

require __DIR__ . '/auth.php';
