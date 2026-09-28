# Rizki Ramadhan — Portfolio Reel

Video promosi 43 detik, 1080 × 1920, 30 fps, MP4 H.264. Visual berasal dari tangkapan portfolio asli pada ukuran desktop, tablet, dan ponsel. Gerakan perangkat, zoom galeri, transisi, tipografi, dan perpindahan tema disusun dengan React/Remotion.

## Hasil

- `out/Rizki-Ramadhan-Portfolio-Reel.mp4` — dengan instrumental asli yang dibuat untuk video ini.
- `out/Rizki-Ramadhan-Portfolio-Reel-Tanpa-Musik.mp4` — untuk menambahkan musik di Instagram.
- `out/Cover-Reels.png` — gambar sampul.
- `out/Storyboard.jpg` — pratinjau semua adegan.

## Edit dan render ulang

Jalankan dari folder `promo-video`:

```sh
npm install
npm run studio
```

Sunting isi adegan, durasi, dan posisi perangkat di `src/reel.jsx`. Tangkapan web ada di `public/captures`, sedangkan gambar yang dipakai video ada di `public/sections` dan dipetakan dalam `src/assets.json`.

```sh
npm run stills
npm run render
```

Renderer memakai Google Chrome yang terpasang di Windows. Bila lokasinya berbeda, isi variabel `REMOTION_BROWSER` dengan lokasi executable Chrome. Tidak memakai profil atau akun browser pribadi.

## Alur video

0–3 detik: logo RR dan pembuka. 3–7: tampilan utama desktop dan ponsel. 7–11: Learning by Doing dengan cuplikan video. 11–16: Selected Work dan proyek. 16–20: detail dan galeri. 20–24: About Me. 24–28: Skills. 28–32: Learning Journey dan marquee nama. 32–36: light/dark. 36–39: Contact. 39–43: alamat website dan penutup.

Musik dibuat oleh `soundtrack.mjs` dengan sintesis suara, tanpa rekaman pihak ketiga. Untuk menggantinya, ganti sumber `<Audio>` dalam `src/reel.jsx`, lalu render ulang. Versi tanpa musik bisa langsung diberi audio dari Instagram.

Folder ini dikecualikan dari deployment portfolio melalui `.vercelignore`.
