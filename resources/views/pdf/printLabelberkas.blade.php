<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Cetak Qr Code</title>
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
        width: 100%;
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
        padding-bottom: 2px;
        padding-top: 2px;
        padding-left: 5px;
        padding-right: 5px;
        border: 1px solid black
    }

    table.detail-isi-lap tfoot td {
        padding: 5px;
        border: 1px solid black
    }

    table.table-posisiberkas {
        margin-bottom: 10px;
        width: 200px;
    }

    table.table-posisiberkas tr td {
        padding: 4px;
        text-align: center
    }

    table.table-posisiberkas tr td.selected {
        background-color: #d0c9c9;
    }

    table.table-itemprosesperms {
        width: 100%;
    }

    table.table-itemprosesperms tr td {
        vertical-align: top;
    }

    table.table-itemprosesperms tr td ul {
        list-style-type: circle;
        margin: 0;
        padding-left: 10px;
    }
</style>

<body>
    <div class="container">
        <table class="detail-isi-lap" style="width: 702px;">
            <tbody>
                <tr>
                    <td colspan="1" style="font-weight:bold;font-size:24px; text-align:left" width="400"
                        align="center">
                        {{ $transpermohonan->permohonan->nama_penerima }}</td>
                    <td rowspan="3" style="bold;text-align:center">
                        <img src="{{ $qrcode }}" width="100" height="100" />
                        <span style="margin-top:5px;">{{ $transpermohonan->id }}</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="1" style="bold;font-size:18px; ">
                        {{ $transpermohonan->permohonan->jenishak->singkatan }}.{{ $transpermohonan->permohonan->nomor_hak }},
                        {{ $transpermohonan->permohonan->persil ? ', ' . $transpermohonan->permohonan->persil . ', ' . $transpermohonan->permohonan->klas : '' }}
                        L.{{ $transpermohonan->permohonan->luas_tanah }} M2
                        Desa {{ $transpermohonan->permohonan->desa->nama_desa }},
                        {{ $transpermohonan->permohonan->desa->kecamatan->nama_kecamatan }}
                    </td>
                </tr>
                <tr>
                    <td style="font-size:18px;">
                        {{ $transpermohonan->nodaftar }}
                        -
                        {{ $transpermohonan->jenispermohonan->nama_jenispermohonan }}
                    </td>
                </tr>
            </tbody>
        </table>
        <div style="border:1px solid;height:73%;width: 700px;">
            <table class="detail-isi-lap">
                <tbody>
                    <tr width="100">
                        <td style="font-size:16px;padding:5px;">
                            NO/TGL BERKAS
                        </td>
                        <td style="font-size:16px;padding:5px;">
                            {{ $transpermohonan->nodaftar }} -
                            {{ $transpermohonan->tgl_daftar }}
                        </td>
                    </tr>
                    <tr width="100">
                        <td style="font-size:16px;padding:5px;">
                            PELEPAS
                        </td>
                        <td style="font-size:16px;padding:5px;">
                            {{ $transpermohonan->permohonan->nama_pelepas }}
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size:16px;padding:5px;">
                            PENERIMA
                        </td>
                        <td style="font-size:16px;padding:5px;">
                            {{ $transpermohonan->permohonan->nama_penerima }}
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size:16px;padding:5px;">
                            IDENTITAS TANAH
                        </td>
                        <td style="font-size:16px;padding:5px;">
                            {{ $transpermohonan->permohonan->jenishak->singkatan }}.{{ $transpermohonan->permohonan->nomor_hak }}
                            {{ $transpermohonan->permohonan->persil ? ', ' . $transpermohonan->permohonan->persil . ', ' . $transpermohonan->permohonan->klas : '' }}
                            , L.{{ $transpermohonan->permohonan->luas_tanah }} M2
                            Desa {{ $transpermohonan->permohonan->desa->nama_desa }},
                            {{ $transpermohonan->permohonan->desa->kecamatan->nama_kecamatan }}
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size:16px;padding:5px;">
                            STAF
                        </td>
                        <td style="font-size:16px;">
                            @forelse ($transpermohonan->permohonan->users as $usr)
                                <span
                                    style="background-color: #d0c9c9; margin-right: 4px; border-radius: 20; padding:4px;">{{ $usr->name }}</span>
                            @empty
                                <span></span>
                            @endforelse
                        </td>
                    </tr>
                    @isset($posisiberkas)
                        <tr>
                            <td colspan="2">
                                <ul style="list-style-type: none;margin: 0;padding: 0;">
                                    <li style="width: 100%;">
                                        <div style="margin-bottom: 4px;margin-top: 4px;font-weight: bold;">LOKASI BERKAS
                                        </div>
                                    </li>
                                    <li style="width: 100%;">
                                        <div>
                                            <div style="font-weight: bold;margin-bottom: 4px;margin-top: 4px;">
                                                {{ $posisiberkas->tempatberkas->nama_tempatberkas }} -
                                                {{ $posisiberkas->tempatberkas->ruang->nama_ruang }}</div>
                                            {!! $posisiberkas_table !!}
                                        </div>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    @endisset
                    <tr>
                        <td colspan="2" style="border: none;">
                            <ul style="list-style-type: none;margin: 0;padding: 0;">
                                @forelse ($biayaperms as $bya)
                                    <li style="width: 100%;">
                                        <ul style="width:100%; list-style-type: none;margin: 0; padding: 0;">
                                            <div style="margin-bottom: 4px;margin-top: 4px;font-weight: bold;">BIAYA
                                                PERMOHONAN - {{ $bya->id }}</div>
                                            <li style="width: 100%;">
                                                <table style="width: 100%;">
                                                    <tr>
                                                        <td style="width: 20%;">Tanggal</td>
                                                        <td style="width: 30%;">Keterangan</td>
                                                        <td style="width: 15%;">Jumlah Biaya</td>
                                                        <td style="width: 15%;">Jumlah bayar</td>
                                                        <td style="width: 15%;">Kurang Bayar</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{{ $bya->tgl_biayaperm }}</td>
                                                        <td>{{ $bya->catatan_biayaperm }}</td>
                                                        <td>{{ number_format($bya->jumlah_biayaperm) }}</td>
                                                        <td>{{ number_format($bya->jumlah_bayar) }}</td>
                                                        <td>{{ number_format($bya->kurang_bayar) }}</td>
                                                    </tr>
                                                </table>
                                            </li>
                                        </ul>
                                        <ul style="list-style-type: none;margin: 0;padding: 0;">
                                            <div style="margin-bottom: 4px;margin-top: 4px; font-weight: bold;">
                                                PEMBAYARAN
                                            </div>
                                            <table style="width: 100%;">
                                                <thead>
                                                    <tr>
                                                        <td style="width: 20%;">Tanggal</td>
                                                        <td style="width: 30%;">Keterangan</td>
                                                        <td style="width: 15%;">Saldo Awal</td>
                                                        <td style="width: 15%;">Jumlah bayar</td>
                                                        <td style="width: 15%;">Saldo Akhir</td>
                                                    </tr>

                                                </thead>
                                                <tbody>
                                                    @forelse ($bya->bayarbiayaperms as $by)
                                                        <tr>
                                                            <td>{{ $by->tgl_bayarbiayaperm }}</td>
                                                            <td>{{ $by->catatan_bayarbiayaperm }}</td>
                                                            <td>{{ number_format($by->saldo_awal) }}</td>
                                                            <td>{{ number_format($by->jumlah_bayar) }}</td>
                                                            <td>{{ number_format($by->saldo_akhir) }}</td>
                                                        </tr>
                                                    @empty
                                                        <span></span>
                                                    @endforelse
                                                </tbody>
                                            </table>
                                        </ul>

                                    </li>
                                @empty
                                    <span></span>
                                @endforelse
                                @if (count($dkeluarbiayapermusers) > 0)
                                    <ul style="list-style-type: none;margin: 0;padding: 0;">
                                        <div style="margin-bottom: 4px;margin-top: 4px; font-weight: bold;">PENGELUARAN
                                        </div>
                                        <table style="width: 100%;">
                                            <thead>
                                                <tr>
                                                    <td style="width: 20%;">Tanggal</td>
                                                    <td style="width: 30%;">Kegiatan</td>
                                                    <td style="width: 30%;">Keterangan</td>
                                                    <td style="width: 20%; text-align: right;">Jumlah</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                @forelse ($dkeluarbiayapermusers as $klbya)
                                                    <tr>
                                                        <td>{{ $klbya->tgl_dkeluarbiayapermuser }}</td>
                                                        <td>{{ $klbya->itemkegiatan->nama_itemkegiatan }}</td>
                                                        <td>{{ $klbya->ket_biaya }}</td>
                                                        <td style="text-align: right;">
                                                            {{ number_format($klbya->jumlah_biaya) }}</td>
                                                    </tr>
                                                @empty
                                                    <span></span>
                                                @endforelse
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colspan="2"></td>
                                                    <td style="text-align: right;font-weight: bold;">TOTAL</td>
                                                    <td style="text-align: right;font-weight: bold;">
                                                        {{ number_format($total_pengeluaran) }}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </ul>
                                @endif
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="border: none;">
                            <div style="margin-bottom: 4px;margin-top: 4px; font-weight: bold;">DAFTAR KEGIATAN</div>
                            {!! $itemprosesperms_table !!}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <table class="detail-isi-lap" style="width: 702px;margin-top: 10px;">
            <tbody>
                <tr>
                    <td colspan="1" style="font-weight:bold;font-size:24px; text-align:left" width="400"
                        align="center">
                        {{ $transpermohonan->permohonan->nama_penerima }}</td>
                    <td rowspan="3" style="bold;text-align:center">
                        <img src="{{ $qrcode }}" width="100" height="100" />
                        <span style="margin-top:5px;">{{ $transpermohonan->id }}</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="1" style="bold;font-size:18px; ">
                        {{ $transpermohonan->permohonan->jenishak->singkatan }}.{{ $transpermohonan->permohonan->nomor_hak }},
                        {{ $transpermohonan->permohonan->persil ? ', ' . $transpermohonan->permohonan->persil . ', ' . $transpermohonan->permohonan->klas : '' }}
                        L.{{ $transpermohonan->permohonan->luas_tanah }} M2
                        Desa {{ $transpermohonan->permohonan->desa->nama_desa }},
                        {{ $transpermohonan->permohonan->desa->kecamatan->nama_kecamatan }}
                    </td>
                </tr>
                <tr>
                    <td style="font-size:18px;">
                        {{ $transpermohonan->nodaftar }}
                        -
                        {{ $transpermohonan->jenispermohonan->nama_jenispermohonan }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>

</html>
