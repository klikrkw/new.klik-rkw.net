<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\EventCollection;
use App\Models\Event;
use App\Models\Jenispermohonan;
use App\Models\Permohonan;
use App\Models\Prosespermohonan;
use App\Models\Transpermohonan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use PhpParser\Node\Stmt\TryCatch;

class AdminController extends Controller
{
    private $base_route = null;
    private $is_admin = null;
    private $user = null;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->base_route = 'staf.';
            $user = request()->user();
            $this->user = $user;
            $role = $user->hasRole('admin');
            $this->is_admin = false;
            if ($role == 'admin') {
                $this->is_admin = true;
                $this->base_route = 'admin.';
            }
            return $next($request);
        });
    }

    // private function random_rgb_color()
    // {
    //     $r = rand(0, 255);
    //     $g = rand(0, 255);
    //     $b = rand(0, 255);
    //     return "rgb($r, $g, $b)";
    // }
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
            ->groupBy('jenispermohonan_id', 'jenispermohonans.nama_jenispermohonan')
            ->get();
        $collection = collect($query);
        $data = [];
        if (count($query) > 0) {
            $total = $collection->reduce(function ($carry, $item) {
                return $carry + $item['jumlah'];
            }, 0);
            $procentages = $collection->map(function ($item) use ($total) {
                $perc = round($item['jumlah'] / $total * 100);
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
        $prosesperms=[];
        if(count($collection)>0){
            $prosesperms = $collection->map(function ($item) use ($total) {
                $identitas = $item['singkatan'] . $item['nomor_hak'] . ', Desa ' . $item['nama_desa'];
                if ($item['singkatan'] == 'C') {
                    $identitas = $item['singkatan'] . $item['nomor_hak'] . ', Ps' . $item['persil'] . ',' . $item['klas'] . ', Desa ' . $item['nama_desa'];
                }
                $item['identitas'] = $identitas;
                $item['tanggal'] = Carbon::parse($item['created_at'])->format('d M Y H:i:s');
                return $item;
            });
        }

        $now = Carbon::now();
        $prev = $now->subMonths(1);
        $now = Carbon::now();
        $next = $now->addMonth(6);

        $events = Event::with(['user','kategorievent'])->
        whereRaw('events.start >= ? and events.end <= ?',  [$prev, $next])
        ->skip(0)->take(500)->get();

        return Inertia::render('Dashboard', [
            'traffics' => $data, 'recentActivities' => $prosesperms,
            'events'=>EventCollection::collection($events),
            'baseRoute' =>$this->base_route,
        ]);
    }
    public function backupDb(){
    $directory = 'backup'; // e.g., 'public', 'storage/app/uploads'
    $files = Storage::files($directory);
    return Inertia::render('Admin/Utilities/Backupdb', [
            'files' => $files,
        ]);

    }
    public function downloadFile(String $filename)
{
    try {
    if (file_exists(storage_path("app/backup/" . $filename))) {
       return Storage::download(sprintf("backup/%s",$filename), $filename); // File path relative to the disk
    }
    else{
        return abort(404);
    }
    } catch (\Throwable $th) {
        throw $th;
    }
}
public function deleteFilesByDate($date, $dir="app/backup")
{
    // Define the directory where files are stored
    $directory = $dir;

    // Get all files in the directory
    $files = Storage::files($directory);

    foreach ($files as $file) {
        // Extract the file's last modified time
        $lastModified = Storage::lastModified($file);

        // Convert the specific date to a timestamp
        $specificDate = strtotime($date);

        // Compare and delete if the file matches the specific date
        if (date('Y-m-d', $lastModified) === date('Y-m-d', $specificDate)) {
            Storage::delete($file);
        }
    }
}

}
