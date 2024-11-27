<?php

namespace Database\Seeders;

use App\Models\Akun;
use Illuminate\Database\Seeder;

class AkunSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Akun::create(['id' =>'1', 'kelompokakun_id' => '1', 'nama_akun'=>'Kas', 'kode_akun'=>'101001','slug'=> 'kas']);
        Akun::create(['id' =>'2', 'kelompokakun_id' => '1', 'nama_akun'=>'Bank BNI', 'kode_akun'=>'101006','slug'=> 'bank-bni']);
        Akun::create(['id' =>'3', 'kelompokakun_id' => '1', 'nama_akun'=>'Bank BCA', 'kode_akun'=>'101005','slug'=> 'bank-bca']);
        Akun::create(['id' =>'4', 'kelompokakun_id' => '1', 'nama_akun'=>'Bank Mandiri', 'kode_akun'=>'101007','slug'=> 'bank-mandiri']);
        Akun::create(['id' =>'5', 'kelompokakun_id' => '1', 'nama_akun'=>'Piutang', 'kode_akun'=>'101003','slug'=> 'piutang']);
        Akun::create(['id' =>'6', 'kelompokakun_id' => '2', 'nama_akun'=>'Peralatan Kantor', 'kode_akun'=>'102001','slug'=> 'peralatan-kantor']);
        Akun::create(['id' =>'7', 'kelompokakun_id' => '1', 'nama_akun'=>'Akumulasi Penyusutan Peralatan', 'kode_akun'=>'101004','slug'=> 'akumulasi-penyusutan-peralatan']);
        Akun::create(['id' =>'8', 'kelompokakun_id' => '3', 'nama_akun'=>'Hutang', 'kode_akun'=>'201001','slug'=> 'hutang']);
        Akun::create(['id' =>'9', 'kelompokakun_id' => '4', 'nama_akun'=>'Asuransi', 'kode_akun'=>'202001','slug'=> 'asuransi']);
        Akun::create(['id' =>'10', 'kelompokakun_id' => '5', 'nama_akun'=>'Pendapatan Operasional', 'kode_akun'=>'401001','slug'=> 'pendapatan-operasional']);
        Akun::create(['id' =>'11', 'kelompokakun_id' => '6', 'nama_akun'=>'Pendapatan Non Operasional', 'kode_akun'=>'402001','slug'=> 'pendapatan-non-operasional']);
        Akun::create(['id' =>'12', 'kelompokakun_id' => '7', 'nama_akun'=>'Pendapatan Lainnya', 'kode_akun'=>'403001','slug'=> 'pendapatan-lainnya']);
        Akun::create(['id' =>'13', 'kelompokakun_id' => '8', 'nama_akun'=>'Biaya Operasional', 'kode_akun'=>'501001','slug'=> 'biaya-operasional']);
        Akun::create(['id' =>'14', 'kelompokakun_id' => '9', 'nama_akun'=>'Biaya Non Operasional', 'kode_akun'=>'502001','slug'=> 'biaya-non-operasional']);
        Akun::create(['id' =>'15', 'kelompokakun_id' => '5', 'nama_akun'=>'Pengeluaran Staf', 'kode_akun'=>'401003','slug'=> 'pengeluaran-staf']);
        Akun::create(['id' =>'16', 'kelompokakun_id' => '10', 'nama_akun'=>'Modal Kantor', 'kode_akun'=>'301001','slug'=> 'modal-kantor']);
    }
}
