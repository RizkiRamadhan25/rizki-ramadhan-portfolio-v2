// Vite includes these source images in the production build and gives each one a stable URL.
const images = import.meta.glob("../../img-source-project/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});

const screenshot = (file, id, en) => ({
  src: images[`../../img-source-project/${file}`],
  alt: { id, en },
  caption: { id, en },
});

export const projectScreenshots = {
  savepoint: [
    screenshot("savepoint-home.png", "Halaman utama SavePoint", "SavePoint home page"),
    screenshot("savepoint-hasil-analisis.png", "Hasil analisis SavePoint", "SavePoint analysis results"),
    screenshot("savepoint-decision-tree.png", "Visualisasi Decision Tree", "Decision Tree visualization"),
    screenshot("savepoint-decision-tree-hybrid.png", "Visualisasi Decision Tree hybrid", "Hybrid Decision Tree visualization"),
  ],
  "cpu-scheduling-simulator": [
    screenshot("cpu-home.png", "Halaman utama CPU Scheduling Simulator", "CPU Scheduling Simulator home page"),
    screenshot("cpu-input.png", "Input proses dan algoritma penjadwalan CPU", "CPU scheduling process and algorithm input"),
    screenshot("cpu-gantt.png", "Visualisasi Gantt Chart CPU", "CPU Gantt chart visualization"),
    screenshot("cpu-tabel-waiting.png", "Tabel waiting time CPU", "CPU waiting time table"),
  ],
  wartegsmart: [
    screenshot("wartegsmart-dashboard-owner.png", "Dashboard pemilik WartegSmart", "WartegSmart owner dashboard"),
    screenshot("wartegsmart-transaksi-kasir.png", "Transaksi kasir WartegSmart", "WartegSmart cashier transaction"),
    screenshot("wartegsmart-riwayat-transaksi-owner.png", "Riwayat transaksi pemilik WartegSmart", "WartegSmart owner transaction history"),
    screenshot("wartegsmart-laporan-keuangan-owner.png", "Laporan keuangan pemilik WartegSmart", "WartegSmart owner financial report"),
  ],
  serenity: [
    screenshot("serenity-home.png", "Halaman utama Serenity", "Serenity home page"),
    screenshot("serenity-layanan.png", "Halaman layanan Serenity", "Serenity services page"),
    screenshot("serenity-undangan.png", "Undangan digital Serenity", "Serenity digital invitation"),
    screenshot("serenity-dashboard-admin.png", "Dashboard admin Serenity", "Serenity admin dashboard"),
  ],
  laras: [
    screenshot("laras-home.png", "Halaman utama Laras", "Laras home page"),
    screenshot("laras-other-feature.png", "Fitur lain aplikasi Laras", "Other Laras app features"),
  ],
};
