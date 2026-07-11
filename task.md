Perbaikan anggaran cerdas
- touchable opacity nya kecilin (semua) [DONE]
- format tanggal (jadi Sen, 12 Nov 2026), lalu disampingnya ada total pengeluaran di tanggal itu [DONE]
- label dan placeholder inputan dibuat lebih intuitif  [DONE]
- input harga menjadi format rupiah (100000 => 100.000) [DONE]
- input jumlah pakai button - [1] +
- kategori yang sering dipakai langsung ada tanpa pencet select kategori
- Implement infinite scroll untuk seluruh pengeluaran
- filter pengeluaran (seluruh pengeluaran, per bulan, filter by tanggal)
- ringkasan catatan
-- ada chart (ada filter, defaultnya bulan ini, lainnya ada per 3 bulan, 6 bulan, 12 bulan, atau filter by tanggal)
-- Pengeluaran paling banyak untuk apa aja

Tambahan fitur:
- export menjadi Excel, pdf, atau csv




npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview