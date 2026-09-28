export const siteConfig = {
  name: "Rizki Ramadhan Portfolio",
  ownerName: "Rizki Ramadhan",

  defaultTitle:
    "Rizki Ramadhan | Informatics Engineering Portfolio",

  descriptions: {
    id: "Portofolio Rizki Ramadhan, mahasiswa Teknik Informatika yang mengembangkan proyek di bidang web development, software engineering, data science, dan artificial intelligence.",

    en: "The portfolio of Rizki Ramadhan, an Informatics Engineering student developing projects in web development, software engineering, data science, and artificial intelligence.",
  },

  /*
   * Ganti dengan alamat hasil deployment
   * setelah website berhasil dipublikasikan.
   */
  url: "https://rizki-ramadhan-portfolio.vercel.app/",

  defaultImage: "/images/og-cover.png",

  locales: {
    id: "id_ID",
    en: "en_US",
  },
};

export function getAbsoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}