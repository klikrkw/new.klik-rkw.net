import { Deserializer } from "v8";

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}
export interface Pengaturan {
    id: number;
    nama_pengaturan: string;
    tipe_data: string;
    grup: string;
    nilai: string;
}

export interface Kecamatan {
    id: string;
    nama_kecamatan: string;
}
export interface Desa {
    id: string;
    nama_desa: string;
    kecamatan: Kecamatan;
}

export interface Metodebayar {
    id: string;
    nama_metodebayar: string;
    akun: Akun;
    akun_id: string;
}

export interface Kantor {
    id: string;
    nama_kantor: string;
    image_kantor: string;
    alamat_kantor: string;
}

export interface Ruang {
    id: string;
    nama_ruang: string;
    image_ruang: string;
    kode_ruang: string;
    kantor: Kantor;
}
export interface Jenistempatarsip {
    id: string;
    nama_jenistempatarsip: string;
    image_jenistempatarsip: string;
}
export interface Fieldcatatan {
    id: string;
    nama_fieldcatatan: string;
}
export interface Catatanperm {
    id: string;
    fieldcatatan: Fieldcatatan;
    isi_catatanperm: string;
    image_catatanperm: string;
}

export interface Tempatarsip {
    id: string;
    nama_tempatarsip: string;
    image_tempatarsip: string;
    kode_tempatarsip: string;
    ruang: Ruang;
    baris: number;
    kolom: number;
    jenistempatarsip: Jenistempatarsip;
}
export interface Tempatberkas {
    id: string;
    nama_tempatberkas: string;
    image_tempatberkas: string;
    ruang: Ruang;
    row_count: number;
    col_count: number;
    jenistempatarsip: Jenistempatarsip;
}
export interface Posisiberkas {
    id: string;
    tempatberkas: Tempatberkas;
    row: number;
    col: number;
}

export interface Jenisakun {
    id: string;
    nama_jenisakun: string;
    kode_jenisakun: string;
}
export interface Kelompokakun {
    id: string;
    nama_kelompokakun: string;
    kode_kelompokakun: string;
    jenisakun: Jenisakun;
}

export interface Akun {
    id: string;
    nama_akun: string;
    kelompokakun: Kelompokakun;
    kelompokakun_id: string;
    slug: string;
    kode_akun: string;
}

export interface Permission {
    id: number;
    name: string;
    roles: Role[];
}

export interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

export interface Jenispermohonan {
    id: number;
    nama_jenispermohonan: string;
}
export interface Instansi {
    id: string;
    nama_instansi: string;
    info_instansi: string;
}

export interface Grupitemkegiatan {
    id: string;
    nama_grupitemkegiatan: string;
}

export interface Traffic {
    nama_jenispermohonan: string;
    jumlah: number;
    percentage: number;
    bg_color: string;
}
export interface RecentActivity {
    nama_penerima: string;
    identitas: string;
    catatan_proses_perm: string;
    tanggal: string;
    nama_itemprosesperm: string;
}

export interface Itemkegiatan {
    id: string;
    nama_itemkegiatan: string;
    instansi_id: string;
    instansi: Instansi;
    akun_id: string;
    akun: Akun;
    grupitemkegiatans: Grupitemkegiatan[];
    itemrincianbiayaperms: Itemrincianbiayaperm[];
    isunique: boolean;
    checkbiaya: boolean;
    is_alert: boolean;
    start_alert: number;
}
export interface Rekening {
    id: string;
    nama_rekening: string;
    ket_rekening: string;
    akun_id: string;
    akun: Akun;
}

export interface Postingjurnal {
    id: string;
    uraian: string;
    user_id: string;
    user: User;
    akun_debet: string;
    akun_kredit: string;
    jumlah: string;
    image: string;
    created_at: string;
}

export interface Kasbon {
    id: string;
    tgl_kasbon: string;
    jumlah_kasbon: number;
    jumlah_penggunaan: number;
    sisa_penggunaan: number;
    user_id: string;
    user: User;
    keperluan: string;
    status_kasbon: string;
    jenis_kasbon: string;
    instansi: Instansi;
}

export interface Rincianbiayaperm {
    id: string;
    tgl_rincianbiayaperm: string;
    total_pemasukan: number;
    total_pengeluaran: number;
    total_piutang: number;
    sisa_saldo: number;
    user_id: string;
    user: User;
    ket_rincianbiayaperm: string;
    status_rincianbiayaperm: string;
    permohonan: string;
    nama_jenispermohonan: string;
    letak_obyek: string;
    transpermohonan: Transpermohonan;
    created_at: string;
    metodebayar: Metodebayar;
    drincianbiayaperms: Drincianbiayaperm[];
    no_daftar: string;
}

export interface JenispermohonanPivotePerm extends Jenispermohonan {
    pivot: { active: boolean };
}

export interface Itemprosesperm {
    id: number;
    nama_itemprosesperm: string;
}

export interface Itemrincianbiayaperm {
    id: number;
    nama_itemrincianbiayaperm: string;
    min_value: string;
    max_value: string;
    command_itemrincianbiayaperm: string;
    jenis_itemrincianbiayaperm: string;
}

export interface Statusprosesperm {
    id: string;
    nama_statusprosesperm: string;
    image_statusprosesperm: string;
}
export interface Jenishak {
    id: string;
    nama_jenishak: string;
    singkatan: string;
}

export interface Pemohon {
    id: number;
    nama_pemohon: string;
    email_pemohon: string;
    alamat_pemohon: string;
    telp_pemohon: string;
    nodaftar_pemohon: string;
    thdaftar_pemohon: string;
    no_daftar: string;
    nik_pemohon: string;
    users: User[];
    active: boolean;
}

export interface Keluarbiayapermuser {
    id: string;
    tgl_keluarbiayaperm: string;
    instansi: Instansi;
    rekening: Rekening;
    metodebayar: Metodebayar;
    kasbons: Kasbon[];
    created_at: string;
    status_keluarbiayapermuser: string;
    user: User;
    dkeluarbiayapermusers: Dkeluarbiayapermuser[];
    saldo_awal: string;
    jumlah_biaya: string;
    saldo_akhir: string;
}
export interface Keluarbiaya {
    id: string;
    tgl_keluarbiayaperm: string;
    instansi: Instansi;
    rekening: Rekening;
    metodebayar: Metodebayar;
    kasbons: Kasbon[];
    created_at: string;
    status_keluarbiaya: string;
    user: User;
    dkeluarbiaya: Dkeluarbiaya[];
    saldo_awal: string;
    jumlah_biaya: string;
    saldo_akhir: string;
}

export interface BiayapermStatus {
    id: string;
    tgl_biayaperm: string;
    jumlah_biayaperm: string;
    jumlah_bayar: string;
    kurang_bayar: string;
    catatan_biayaperm: string;
    image_biayaperm: string;
    users: User[];
    nama_jenispermohonan: string;
    permohonan: string;
    no_daftar: string;
}

export interface Dkeluarbiayapermuser {
    id: string;
    created_at: string;
    permohonan: string;
    nama_itemkegiatan: string;
    jumlah_biaya: string;
    ket_biaya: string;
    keluarbiayapermuser: Keluarbiayapermuser;
    itemkegiatan: Itemkegiatan;
    image_dkeluarbiayapermuser: string;
}
export interface Dkasbon {
    id: string;
    created_at: string;
    permohonan: string;
    nama_itemkegiatan: string;
    jumlah_biaya: string;
    ket_biaya: string;
}
export interface Dkasbonnoperm {
    id: string;
    created_at: string;
    nama_itemkegiatan: string;
    jumlah_biaya: string;
    ket_biaya: string;
}

export interface Dkeluarbiaya {
    id: string;
    created_at: string;
    nama_itemkegiatan: string;
    jumlah_biaya: string;
    ket_biaya: string;
    keluarbiaya: Keluarbiaya;
    itemkegiatan: Itemkegiatan;
    image_dkeluarbiaya: string;
}

export interface DkeluarbiayapermuserStaf {
    id: string;
    created_at: string;
    metodebayar: Metodebayar;
    itemkegiatan: Itemkegiatan;
    instansi: Instansi;
    user: User;
    jumlah_biaya: string;
    ket_biaya: string;
    image_dkeluarbiayapermuser: string;
}
export interface Drincianbiayaperm {
    id: string;
    created_at: string;
    itemrincianbiayaperm: Itemrincianbiayaperm;
    jumlah_biaya: string;
    ket_biaya: string;
}

export interface OptionSelect {
    value: string;
    label: string;
}
export interface OptionSelectActive {
    value: string;
    label: string;
    active: boolean;
}

export type OptionSelectDisabled = OptionSelect & { isDisabled: boolean };

export interface OptionSelectWithData<Data> {
    value: string;
    label: string;
    data: Data;
}

export interface Permohonan {
    id: string;
    nama_pelepas: string;
    nama_penerima: string;
    jenishak_id: number;
    nomor_hak: string;
    persil: string;
    klas: string;
    luas_tanah: number;
    atas_nama: string;
    jenis_tanah: string;
    desa_id: string;
    nodaftar_permohonan: number;
    thdaftar_permohonan: number;
    users: User[];
    active: boolean;
    letak_obyek: string;
    no_daftar: string;
    tgl_daftar: string;
    users: User[];
    bidang: number;
    kode_unik: string;
    transpermohonans: Transpermohonan[];
    transpermohonan: Transpermohonan;
    jenishak: Jenishak;
    desa: Desa;
    cek_biaya: boolean;
    period_cekbiaya: string;
    date_cekbiaya: string;
}

export interface Transpermohonan {
    id: string;
    no_daftar: string;
    tgl_daftar: string;
    jenispermohonan: Jenispermohonan;
    permohonan: Permohonan;
    active: boolean;
    nodaftar_transpermohonan: string;
    thdaftar_transpermohonan: string;
}

export interface Statusprosesperm {
    id: string;
    nama_statusprosesperm: string;
    image_statusprosesperm: string;
}

export interface StatusprosespermProsespermohonan {
    id: string;
    nama_statusprosesperm: string;
    image_statusprosesperm: string;
    user: User;
    pivot: {
        created_at: string;
        catatan_statusprosesperm: string;
        active: boolean;
    };
    canRemove: boolean;
}

// export interface Prosespermohonan {
//     id: string;
//     tgl_proses: string;
//     itemprosesperm: Itemprosesperm;
//     user: User;
//     catatan_prosesperm: string;
//     active: boolean;
// }

export interface Prosespermohonan {
    id: string;
    tgl_proses: string;
    itemprosesperm: Itemprosesperm;
    transpermohonan: Transpermohonan;
    user: User;
    catatan_prosesperm: string;
    statusprosesperms: StatusprosespermProsespermohonan[];
    active: boolean;
    is_alert: boolean;
    start: string;
    end: string;
}
export interface Kategorievent {
    id: string;
    nama_kategorievent: string;
}

export interface Event {
    id: string;
    start: Date;
    end: Date;
    title: string;
    data: string;
    user: User;
    kategorievent: Kategorievent;
    is_transpermohonan: boolean;
    transpermohonan: Transpermohonan;
}

export interface Biayaperm {
    id: string;
    tgl_biayaperm: string;
    jumlah_biayaperm: number;
    jumlah_bayar: number;
    kurang_bayar: number;
    transpermohonan: Transpermohonan;
    user: User;
    catatan_biayaperm: string;
    statusprosesperms: StatusprosespermProsespermohonan[];
    image_biayaperm: string;
}
export interface KeluarBiayaperm {
    id: string;
    tgl_keluarbiayaperm: string;
    transpermohonan_id: string;
    transpermohonan: Transpermohonan;
    jumlah_keluarbiayaperm: number;
    metodebayar: Metodebayar;
    itemkegiatan: Itemkegiatan;
    metodebayar_id: string;
    user: User;
    catatan_keluarbiayaperm: string;
    image_keluarbiayaperm: string;
}

export interface Bayarbiayaperm {
    id: string;
    tgl_bayarbiayaperm: string;
    saldo_awal: number;
    jumlah_bayar: number;
    saldo_akhir: number;
    metodebayar: Metodebayar;
    metodebayar_id: string;
    info_rekening: string;
    catatan_bayarbiayaperm: string;
    image_bayarbiayaperm: string;
}

export interface Anggarankeluarbiayaperm {
    id: string;
    created_at: string;
    kasbon: Kasbon;
    transpermohonan: Transpermohonan;
    jumlah_biaya: number;
    itemkegiatan: Itemkegiatan;
    ket_biaya: string;
    permohonan: string;
}

// export interface Statusprosespermprosespermohonan {
//     id: string;
//     prosespermohonan_id: string;
//     statusprosesperm_id: string;
//     statusprosesperm: Statusprosesperm;
//     user: User;
//     catatan_statusprosesperm: string;
// }

export type TPermohonan = {
    id: string;
    nama_pelepas: string;
    nama_penerima: string;
    jenishak_id: number;
    nomor_hak: string;
    persil: string;
    klas: string;
    luas_tanah: number;
    atas_nama: string;
    jenispermohonan_id: string;
    jenis_tanah: string;
    desa_id: string;
    nodaftar_permohonan: number;
    thdaftar_permohonan: number;
    users: User[];
    active: boolean;
    letak_obyek: string;
    no_daftar: string;
    tgl_daftar: string;
};

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
};

export interface PanelDisclosure {
    title: string;
    body: string;
}

interface Bukubesar {
    nourut: string;
    tanggal: string;
    nama_akun: string;
    uraian: string;
    debet: string;
    kredit: string;
    saldo: string;
}

type PrintData = {
    col: string;
    row: string;
};
