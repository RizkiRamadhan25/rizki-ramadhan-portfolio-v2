# Rizki Ramadhan Portfolio

Portfolio personal berbasis React + Vite + Tailwind CSS dengan arah visual **3D glassmorphism** dan animasi scroll yang dikelola menggunakan GSAP.

## Konsep visual

- Dark graphite / indigo dengan material glass yang tipis, bukan tumpukan kartu generik.
- Foto hero dan About menggunakan depth layers, perspective, pointer tilt, dan glare ringan untuk efek 3D.
- Judul section menggunakan SplitText untuk reveal per baris/kata.
- Role `Informatics Engineering Student` menggunakan animasi typewriter berulang: ketik -> tahan -> backspace -> ulang.
- Project desktop menggunakan vertical-scroll-to-horizontal-track dengan ScrollTrigger + pin + scrub + snap.
- Journey memakai scroll-linked progress dan depth reveal.
- Navigasi memakai menu layar penuh dan tombol pilihan bahasa yang tetap terlihat.
- Ambient SVG memakai MorphSVGPlugin secara halus sebagai aksen latar.
- ScrollSmoother dipakai untuk smooth scrolling dan tetap menghormati `prefers-reduced-motion`.

## GSAP

GSAP 3.15.0 dan plugin berikut dimuat dari jsDelivr sebelum bundle aplikasi:

- GSAP core
- ScrollTrigger
- ScrollSmoother
- Observer
- SplitText
- MorphSVGPlugin

Versi dipin ke `3.15.0` di `index.html` agar perilaku animasi tidak berubah karena update CDN tanpa disengaja.

## Menjalankan project

```bash
npm install
npm run dev
```

Untuk production build:

```bash
npm run build
```

## Quality check

```bash
npm run lint
```

## Struktur penting

```text
src/
  components/
    common/
      AmbientMorph.jsx
      SmoothScroll.jsx
      ThreeDPortrait.jsx
      TypewriterRole.jsx
    sections/
      AboutSection.jsx
      SkillsSection.jsx
      ProjectsSection.jsx
      JourneySection.jsx
      ContactSection.jsx
  hooks/
    useGlassTilt.js
  lib/
    gsap.js
  pages/
    HomePage.jsx
```

Video pada halaman utama memakai cuplikan ringan `public/videos/learning-python-preview.mp4`.
Sumber lengkap 1080p disimpan di `source-media/learning-python-1080p.mp4` dan tidak ikut hasil build atau Git.
Tombol YouTube tetap membuka video lengkap pada menit 21:00.
