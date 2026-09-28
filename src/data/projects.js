import { projectArt } from "./projectArt";

export const projects = [
  {
    id: 1,
    slug: "savepoint",
    title: "SavePoint",

    category: {
      id: "Kecerdasan Buatan dan Sains Data",
      en: "Artificial Intelligence and Data Science",
    },

    description: {
      id: "Model kecerdasan buatan hybrid untuk mendeteksi tingkat risiko kecanduan game menggunakan Decision Tree dan Fuzzy C-Means.",
      en: "A hybrid artificial intelligence model for detecting gaming addiction risk levels using Decision Tree and Fuzzy C-Means.",
    },

    technologies: [
      "Python",
      "Decision Tree",
      "Fuzzy C-Means",
      "Scikit-learn",
      "Pandas",
    ],

    image: projectArt.savepoint,
    repository: "",
    demo: "",
    featured: true,
    status: "completed",
  },

  {
    id: 2,
    slug: "cpu-scheduling-simulator",
    title: "CPU Scheduling Simulator",

    category: {
      id: "Pengembangan Web dan Sistem Operasi",
      en: "Web Development and Operating Systems",
    },

    description: {
      id: "Aplikasi web interaktif untuk menyimulasikan dan memvisualisasikan berbagai algoritma penjadwalan CPU.",
      en: "An interactive web application for simulating and visualizing different CPU scheduling algorithms.",
    },

    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "Algorithm Visualization",
    ],

    image: projectArt["cpu-scheduling-simulator"],
    repository: "",
    demo: "",
    featured: true,
    status: "completed",
  },

  {
    id: 3,
    slug: "wartegsmart",
    title: "WartegSmart",

    category: {
      id: "Pengembangan Web dan Manajemen Bisnis",
      en: "Web Development and Business Management",
    },

    description: {
      id: "Aplikasi kasir dan manajemen keuangan yang dirancang untuk membantu operasional usaha warteg.",
      en: "A cashier and financial management application designed to support small food business operations.",
    },

    technologies: [
      "PHP",
      "MongoDB",
      "Tailwind CSS",
      "JavaScript",
      "Chart.js",
    ],

    image: projectArt.wartegsmart,
    repository: "",
    demo: "",
    featured: true,
    status: "completed",
  },

  {
    id: 4,
    slug: "serenity",
    title: "Serenity",

    category: {
      id: "Manajemen Acara dan Aplikasi CRUD",
      en: "Event Management and CRUD Application",
    },

    description: {
      id: "Aplikasi manajemen event dan wedding organizer dengan pemesanan pelanggan serta fitur CRUD untuk admin.",
      en: "An event and wedding organizer management application with customer ordering and administrative CRUD features.",
    },

    technologies: [
      "Laravel",
      "PHP",
      "MongoDB",
      "Tailwind CSS",
      "JavaScript",
    ],

    image: projectArt.serenity,
    repository: "",
    demo: "",
    featured: true,
    status: "completed",
  },

  {
    id: 5,
    slug: "laras",
    title: "Laras",

    category: {
      id: "Manajemen Kehidupan Personal dan Keuangan",
      en: "Personal Life and Finance Management",
    },

    description: {
      id: "Aplikasi personal life management untuk mengelola aktivitas, keuangan multi-rekening, prioritas, langganan, serta insight dan rekomendasi adaptif.",
      en: "A personal life management application for activities, multi-account finance, priorities, subscriptions, and adaptive insights and recommendations.",
    },

    technologies: [
      "Laravel",
      "PHP",
      "MySQL",
      "JavaScript",
      "Tailwind CSS",
    ],

    image: projectArt.laras,
    repository: "",
    demo: "",
    featured: true,
    status: "in-progress",
  },
];
