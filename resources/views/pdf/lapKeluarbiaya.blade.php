<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Laporan Pengeluaran Biaya User</title>
</head>
<style>
    body {
        box-sizing: border-box;
        padding: 0px;
        font-family: Arial, Helvetica, sans-serif;
    }

    .container {
        padding-left: 1.5px;
        padding-right: 1px;
        padding-top: 0.5px;
        padding-bottom: 1px;
        font-size: 12px;
    }

    .judul-kopsurat {
        font-size: 14px;
        margin-bottom: 2px;
        font-weight: bold;
    }

    .subjudul-kopsurat {
        font-size: 18px;
        margin-bottom: 2px;
        font-weight: bold;
    }

    .ketjudul-kopsurat {
        font-size: 12px;
        margin-bottom: 2px;
        text-align: left;
        width: 500px;
        padding-bottom: 4px;
        border-bottom: 2px solid rgb(29, 28, 28);
        margin-bottom: 20px;
    }

    .judul-lap {
        font-size: 21px;
        margin-bottom: 2px;
        vertical-align: middle;
        font-weight: bold;
    }

    .subjudul-lap {
        font-size: 11px;
        margin-bottom: 2px;
        width: 250px;
        display: flex;
        flex-direction: row;
    }

    .isi-subjudul-lap {
        font-size: 11px;
        margin-bottom: 2px;
        width: 300px;
        display: flex;
        flex-direction: row;
        background-color: gray;
    }

    .ket-judul {
        width: 90px;
        background-color: burlywood;
    }

    .detail-isi-lap {
        width: 700px;
        /* border: 1px solid gray; */
        color: black;
    }

    table {
        border-collapse: collapse;
    }

    table.detail-isi-lap {
        margin-bottom: 10px;
    }

    table.detail-isi-lap thead td {
        padding: 5px;
        border: 1px solid black
    }

    table.detail-isi-lap tbody td {
        padding: 5px;
        border: 1px solid black
    }

    table.detail-isi-lap tfoot td {
        padding: 5px;
        border: 1px solid black
    }
</style>

<body>
    <div class="container">
        <div class="judul-kopsurat">NOTARIS DAN PEJABAT PEMBUAT AKTA TANAH</div>
        <div class="subjudul-kopsurat">REKOWARNO, S.H., M.H.</div>
        <div class="ketjudul-kopsurat">Jalan dokter Susanto No 59 Pati - 59111, Telp: (0295) 383582 email:
            rekowarno@gmail.com</div>
    </div>
    <div class="judul-lap">{{ $judul_lap }}</div>
    <div class="subjudul-lap">
        <table style="margin-bottom: 10px;">
            <tr>
                <td>No Transaksi</td>
                <td>:</td>
                <td>{{ $keluarbiaya->id }}</td>
            </tr>
            <tr>
                <td>Tgl Transaksi</td>
                <td>:</td>
                <td>{{ $keluarbiaya->tanggal }}</td>
            </tr>
            <tr>
                <td>Instansi</td>
                <td>:</td>
                <td>{{ $keluarbiaya->instansi->nama_instansi }}</td>
            </tr>
            <tr>
                <td>Metode Bayar</td>
                <td>:</td>
                <td>{{ $keluarbiaya->metodebayar->nama_metodebayar }}</td>
            </tr>
            <tr>
                <td>Petugas</td>
                <td>:</td>
                <td>{{ $keluarbiaya->user->name }}</td>
            </tr>
        </table>
        <table class="detail-isi-lap">
            <thead>
                <tr style="background-color: rgb(233, 232, 232); font-weight: bold;">
                    <td>No.</td>
                    <td>Item Kegiatan</td>
                    <td>Keterangan</td>
                    <td align="right">Jumlah</td>
                </tr>
            </thead>
            <tbody>
                @forelse ($dkeluarbiayas as $item)
                    <tr>
                        <td>{{ $item['nourut'] }}</td>
                        <td>{{ $item['nama_itemkegiatan'] }}</td>
                        <td>{{ $item['ket_biaya'] }}</td>
                        <td align="right">{{ $item['jumlah_biaya'] }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5">Data Kosong</td>
                    </tr>
                @endforelse
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="2"></td>
                    <td align="right">Total Biaya</td>
                    <td align="right">{{ number_format($keluarbiaya->jumlah_biaya) }}</td>
                </tr>
                <tr>
                    <td colspan="2"></td>
                    <td align="right">Kasbon</td>
                    <td align="right">{{ number_format($keluarbiaya->saldo_awal) }}</td>
                </tr>
                <tr>
                    <td colspan="2"></td>
                    <td align="right">Sisa Saldo</td>
                    <td align="right">{{ number_format($keluarbiaya->saldo_akhir) }}</td>
                </tr>
            </tfoot>
        </table>
        <table style="width: 700px; margin-left: 5px;">
            <tr>
                <td>&nbsp;</td>
                <td style="text-align: center;">Pati, {{ $tanggal }}</td>
                <td>&nbsp;</td>
            </tr>
            <tr>
                <td style="text-align: center;">Notaris dan PPAT</td>
                <td style="text-align: center;">Bendahara</td>
                <td style="text-align: center;">Petugas</td>
            </tr>
            <tr>
                {{-- <td style="padding-top: 40px;" colspan="2">&nbsp;</td> --}}
                <td></td>
                <td style="text-align:center;vertical-align: middle; padding: 2px;" align="center">
                    @if ($keluarbiaya->status_keluarbiaya == 'wait_approval')
                        <h2>menunggu persetujuan</h2>
                    @else
                        <img src="{{ $qrcode }}" width="100" height="100" />
                        <div style="margin-top:5px;">{{ $keluarbiaya->id }}</div>
                    @endif
                </td>
                <td></td>
            </tr>
            <tr>
                <td style="text-align: center;">REKOWARNO, S.H., M.H.</td>
                <td style="text-align: center;">BAHTIAR</td>
                <td style="text-align: center;">{{ strtoupper($keluarbiaya['user']['name']) }}</td>
            </tr>
        </table>
    </div>
</body>

</html>
