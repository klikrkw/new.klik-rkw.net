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
        width: 500px;
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
                <td>{{ $rincianbiayaperm['id'] }}</td>
            </tr>
            <tr>
                <td>Tgl Transaksi</td>
                <td>:</td>
                <td>{{ $rincianbiayaperm['tanggal'] }}</td>
            </tr>
            <tr>
                <td>Keterangan</td>
                <td>:</td>
                <td>{{ $rincianbiayaperm['ket_rincianbiayaperm'] }}</td>
            </tr>
            <tr>
                <td>Petugas</td>
                <td>:</td>
                <td>{{ $rincianbiayaperm['user']->name }}</td>
            </tr>
            <tr>
                <td>Permohonan</td>
                <td>:</td>
                <td>{{ $rincianbiayaperm['permohonan'] }}</td>
            </tr>
        </table>
    </div>
    <table class="detail-isi-lap">
        <thead>
            <tr style="background-color: rgb(212, 207, 207); font-weight: bold;">
                <td>No.</td>
                <td>Nama Kegiatan</td>
                <td>Keterangan</td>
                <td align="right">Jumlah</td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td colspan="4" style="background-color: rgb(240, 233, 233); font-weight: bold;">PEMASUKAN</td>
            </tr>
            @forelse ($drincianbiayaperms as $item)
                @if ($item['itemrincianbiayaperm']['jenis_itemrincianbiayaperm'] === 'pemasukan')
                    <tr>
                        <td>{{ $loop->index + 1 }}</td>
                        <td>{{ $item['itemrincianbiayaperm']['nama_itemrincianbiayaperm'] }}</td>
                        <td>{{ $item['ket_biaya'] }}</td>
                        <td align="right">{{ number_format($item['jumlah_biaya']) }}</td>
                    </tr>
                @endif
            @empty
                <tr>
                    <td colspan="5">Data Kosong</td>
                </tr>
            @endforelse
            <tr>
                <td colspan="4" style="background-color: rgb(240, 233, 233); font-weight: bold;">PENGELUARAN</td>
            </tr>
            @forelse ($drincianbiayaperms as $item)
                @if ($item['itemrincianbiayaperm']['jenis_itemrincianbiayaperm'] === 'pengeluaran')
                    <tr>
                        <td>{{ $loop->index + 1 }}</td>
                        <td>{{ $item['itemrincianbiayaperm']['nama_itemrincianbiayaperm'] }}</td>
                        <td>{{ $item['ket_biaya'] }}</td>
                        <td align="right">{{ number_format($item['jumlah_biaya']) }}</td>
                    </tr>
                @endif
            @empty
                <tr>
                    <td colspan="5">Data Kosong</td>
                </tr>
            @endforelse
            <tr>
                <td colspan="4" style="background-color: rgb(240, 233, 233); font-weight: bold;">PIUTANG</td>
            </tr>
            @forelse ($drincianbiayaperms as $item)
                @if ($item['itemrincianbiayaperm']['jenis_itemrincianbiayaperm'] === 'piutang')
                    <tr>
                        <td>{{ $loop->index + 1 }}</td>
                        <td>{{ $item['itemrincianbiayaperm']['nama_itemrincianbiayaperm'] }}</td>
                        <td>{{ $item['ket_biaya'] }}</td>
                        <td align="right">{{ number_format($item['jumlah_biaya']) }}</td>
                    </tr>
                @endif
            @empty
                <tr>
                    <td colspan="5">Data Kosong</td>
                </tr>
            @endforelse
        </tbody>
        <tfoot>
            <tr>
                <td colspan="2"></td>
                <td align="right" style="font-weight: bold;">Total Pemasukan</td>
                <td align="right">{{ $rincianbiayaperm['total_pemasukan'] }}</td>
            </tr>
            <tr>
                <td colspan="2"></td>
                <td align="right" style="font-weight: bold;">Total Pengeluaran</td>
                <td align="right">{{ $rincianbiayaperm['total_pengeluaran'] }}</td>
            </tr>
            <tr>
                <td colspan="2"></td>
                <td align="right" style="font-weight: bold;">Total Piutang</td>
                <td align="right">{{ $rincianbiayaperm['total_pengeluaran'] }}</td>
            </tr>
            <tr>
                <td colspan="2"></td>
                <td align="right" style="font-weight: bold;">Total Setor</td>
                <td align="right">{{ $rincianbiayaperm['sisa_saldo'] }}</td>
            </tr>
        </tfoot>
    </table>
    <table style="width: 700px; margin-left: 5px;">
        <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>Pati, {{ $tanggal }}</td>
        </tr>
        <tr>
            <td colspan=>Notaris dan PPAT</td>
            <td colspan=>Bendahara</td>
            <td colspan=>Petugas</td>
        </tr>
        <tr>
            <td style="padding-top: 40px;" colspan="2">&nbsp;</td>
        </tr>
        <tr>
            <td>REKOWARNO, S.H., M.H.</td>
            <td>BAHTIAR</td>
            <td>{{ strtoupper($rincianbiayaperm['user']['name']) }}</td>
        </tr>
    </table>

</body>

</html>
