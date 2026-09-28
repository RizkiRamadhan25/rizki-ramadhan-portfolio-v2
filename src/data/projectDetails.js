import { projectScreenshots } from "./projectScreenshots";

export const projectDetails = {
  savepoint: {
    role: {
      id: "Pengembang Model dan Analis Data",
      en: "Model Developer and Data Analyst",
    },

    type: {
      id: "Proyek Kecerdasan Buatan Akademik",
      en: "Academic Artificial Intelligence Project",
    },

    year: "2026",

    overview: {
      id: "SavePoint merupakan proyek kecerdasan buatan untuk mendeteksi tingkat risiko kecanduan game. Proyek ini menggabungkan Decision Tree sebagai algoritma klasifikasi dengan Fuzzy C-Means untuk menemukan pola kelompok pada data pengguna.",
      en: "SavePoint is an artificial intelligence project for detecting gaming addiction risk levels. It combines Decision Tree classification with Fuzzy C-Means clustering to discover patterns within user data.",
    },

    problem: {
      id: "Risiko kecanduan game tidak hanya dipengaruhi oleh durasi bermain, tetapi juga pola tidur, interaksi sosial, kondisi fisik, performa akademik, dan perubahan perilaku. Data tersebut perlu diproses secara terstruktur agar dapat digunakan untuk melakukan klasifikasi.",
      en: "Gaming addiction risk is influenced not only by gaming duration, but also by sleep patterns, social interaction, physical conditions, academic performance, and behavioral changes. The data must be processed systematically before classification.",
    },

    solution: {
      id: "Dataset dibersihkan, dipilih fitur yang relevan, dan dinormalisasi. Fuzzy C-Means digunakan untuk menghasilkan informasi cluster dan nilai membership, kemudian hasil tersebut digabungkan dengan fitur utama untuk melatih model Decision Tree hybrid.",
      en: "The dataset was cleaned, relevant features were selected, and numerical values were normalized. Fuzzy C-Means generated cluster information and membership values, which were combined with the primary features to train a hybrid Decision Tree model.",
    },

    features: [
      {
        title: {
          id: "Pembersihan dan Persiapan Data",
          en: "Data Cleaning and Preparation",
        },
        description: {
          id: "Menangani data kosong, memeriksa duplikasi, menganalisis outlier, dan menyiapkan fitur sebelum proses pemodelan.",
          en: "Handles missing values, checks duplicates, analyzes outliers, and prepares features before model training.",
        },
      },
      {
        title: {
          id: "Fuzzy C-Means Clustering",
          en: "Fuzzy C-Means Clustering",
        },
        description: {
          id: "Mengelompokkan data menggunakan tingkat keanggotaan sehingga setiap data dapat memiliki hubungan dengan lebih dari satu cluster.",
          en: "Groups data using membership degrees, allowing each record to have relationships with more than one cluster.",
        },
      },
      {
        title: {
          id: "Klasifikasi Hybrid",
          en: "Hybrid Classification",
        },
        description: {
          id: "Menggabungkan fitur asli, hasil cluster, dan nilai membership sebagai masukan untuk model Decision Tree.",
          en: "Combines original features, cluster results, and membership values as inputs for the Decision Tree model.",
        },
      },
      {
        title: {
          id: "Evaluasi Model",
          en: "Model Evaluation",
        },
        description: {
          id: "Mengevaluasi model menggunakan confusion matrix dan metrik klasifikasi untuk melihat kualitas prediksi.",
          en: "Evaluates the model using a confusion matrix and classification metrics to measure prediction quality.",
        },
      },
    ],

    process: [
      {
        title: {
          id: "Analisis Dataset",
          en: "Dataset Analysis",
        },
        description: {
          id: "Memahami struktur data, distribusi target, missing value, dan karakteristik setiap variabel.",
          en: "Examined the dataset structure, target distribution, missing values, and variable characteristics.",
        },
      },
      {
        title: {
          id: "Preprocessing",
          en: "Preprocessing",
        },
        description: {
          id: "Melakukan pembersihan, encoding, pemilihan fitur, dan normalisasi menggunakan MinMaxScaler.",
          en: "Performed cleaning, encoding, feature selection, and normalization using MinMaxScaler.",
        },
      },
      {
        title: {
          id: "Optimasi Cluster",
          en: "Cluster Optimization",
        },
        description: {
          id: "Menguji beberapa jumlah cluster dan memilih konfigurasi berdasarkan nilai Fuzzy Partition Coefficient.",
          en: "Tested multiple cluster configurations and selected the best result using the Fuzzy Partition Coefficient.",
        },
      },
      {
        title: {
          id: "Pelatihan dan Evaluasi",
          en: "Training and Evaluation",
        },
        description: {
          id: "Melatih Decision Tree dengan fitur hybrid lalu mengevaluasi hasil prediksi pada data pengujian.",
          en: "Trained the Decision Tree with hybrid features and evaluated predictions on the test data.",
        },
      },
    ],

    challenges: [
      {
        title: {
          id: "Perbedaan Jumlah Fitur",
          en: "Feature Count Mismatch",
        },
        description: {
          id: "Jumlah fitur yang digunakan model sempat berbeda dengan data yang dikirim pada tahap prediksi.",
          en: "The number of features used during training initially differed from the features provided during prediction.",
        },
        resolution: {
          id: "Pipeline fitur diperbaiki agar urutan dan jumlah fitur pada proses training dan prediction selalu sama.",
          en: "The feature pipeline was corrected so training and prediction always used the same feature order and count.",
        },
      },
      {
        title: {
          id: "Menentukan Jumlah Cluster",
          en: "Selecting the Number of Clusters",
        },
        description: {
          id: "Jumlah cluster awal belum menghasilkan tingkat pemisahan data yang optimal.",
          en: "The initial cluster count did not provide an optimal separation of the data.",
        },
        resolution: {
          id: "Dilakukan pengujian beberapa jumlah cluster dan konfigurasi dengan nilai FPC terbaik dipilih.",
          en: "Multiple cluster counts were evaluated, and the configuration with the highest FPC value was selected.",
        },
      },
    ],

    learnings: {
      id: [
        "Memahami tahapan preprocessing untuk dataset campuran.",
        "Menerapkan clustering dan classification dalam satu pipeline.",
        "Menggunakan evaluasi model untuk memeriksa kualitas prediksi.",
        "Menyimpan model dan hasil evaluasi agar dapat digunakan kembali.",
      ],
      en: [
        "Understanding preprocessing for mixed datasets.",
        "Combining clustering and classification in one pipeline.",
        "Using model evaluation to assess prediction quality.",
        "Saving models and evaluation results for future use.",
      ],
    },

    screenshots: projectScreenshots['savepoint'],
  },

  "cpu-scheduling-simulator": {
    role: {
      id: "Pengembang Algoritma dan Frontend",
      en: "Algorithm and Frontend Developer",
    },

    type: {
      id: "Proyek Simulasi Sistem Operasi",
      en: "Operating System Simulation Project",
    },

    year: "2026",

    overview: {
      id: "CPU Scheduling Simulator merupakan aplikasi web interaktif untuk memvisualisasikan cara kerja berbagai algoritma penjadwalan CPU melalui Gantt Chart, tabel hasil, dan animasi proses.",
      en: "CPU Scheduling Simulator is an interactive web application that visualizes different CPU scheduling algorithms through Gantt charts, result tables, and process animations.",
    },

    problem: {
      id: "Perhitungan penjadwalan CPU sering sulit dipahami hanya melalui tabel dan rumus, terutama ketika menggunakan algoritma preemptive yang memiliki banyak perpindahan proses.",
      en: "CPU scheduling calculations can be difficult to understand through tables and formulas alone, especially for preemptive algorithms with frequent process switches.",
    },

    solution: {
      id: "Aplikasi menerima data arrival time, burst time, priority, dan quantum. Sistem kemudian menghitung urutan eksekusi, waiting time, turnaround time, serta menampilkan proses tersebut dalam Gantt Chart interaktif.",
      en: "The application accepts arrival time, burst time, priority, and quantum values. It calculates execution order, waiting time, and turnaround time, then displays the results through an interactive Gantt chart.",
    },

    features: [
      {
        title: {
          id: "Berbagai Algoritma",
          en: "Multiple Algorithms",
        },
        description: {
          id: "Mendukung FCFS, SJF, SRTF, Priority Scheduling, dan Round Robin.",
          en: "Supports FCFS, SJF, SRTF, Priority Scheduling, and Round Robin.",
        },
      },
      {
        title: {
          id: "Gantt Chart Interaktif",
          en: "Interactive Gantt Chart",
        },
        description: {
          id: "Menampilkan urutan eksekusi proses, batas arrival time, dan batas quantum.",
          en: "Displays process execution order, arrival-time boundaries, and quantum boundaries.",
        },
      },
      {
        title: {
          id: "Perhitungan Otomatis",
          en: "Automatic Calculations",
        },
        description: {
          id: "Menghitung waiting time, turnaround time, serta nilai rata-rata secara otomatis.",
          en: "Automatically calculates waiting time, turnaround time, and their averages.",
        },
      },
      {
        title: {
          id: "Simulasi Beranimasi",
          en: "Animated Simulation",
        },
        description: {
          id: "Memvisualisasikan proses masuk dan berjalan dengan kecepatan animasi yang dapat diatur.",
          en: "Visualizes arriving and running processes with adjustable animation speed.",
        },
      },
    ],

    process: [
      {
        title: {
          id: "Perancangan Rumus",
          en: "Calculation Design",
        },
        description: {
          id: "Mendefinisikan aturan dan rumus setiap algoritma penjadwalan.",
          en: "Defined the rules and calculations for each scheduling algorithm.",
        },
      },
      {
        title: {
          id: "Implementasi Algoritma",
          en: "Algorithm Implementation",
        },
        description: {
          id: "Memisahkan logika perhitungan setiap algoritma agar lebih mudah diuji.",
          en: "Separated each scheduling algorithm into testable calculation logic.",
        },
      },
      {
        title: {
          id: "Visualisasi Gantt Chart",
          en: "Gantt Chart Visualization",
        },
        description: {
          id: "Mengubah hasil perhitungan menjadi blok proses dan penanda waktu.",
          en: "Converted calculation results into process blocks and time markers.",
        },
      },
      {
        title: {
          id: "Pengujian Skenario",
          en: "Scenario Testing",
        },
        description: {
          id: "Menguji berbagai kombinasi arrival time, burst time, priority, dan quantum.",
          en: "Tested different arrival time, burst time, priority, and quantum combinations.",
        },
      },
    ],

    challenges: [
      {
        title: {
          id: "Algoritma Preemptive",
          en: "Preemptive Algorithms",
        },
        description: {
          id: "SRTF dan Round Robin dapat menghasilkan banyak bagian proses pada Gantt Chart.",
          en: "SRTF and Round Robin can generate many process segments in the Gantt chart.",
        },
        resolution: {
          id: "Setiap interval eksekusi disimpan sebagai segmen terpisah sebelum divisualisasikan.",
          en: "Each execution interval was stored as a separate segment before visualization.",
        },
      },
      {
        title: {
          id: "Sinkronisasi Tampilan dan Perhitungan",
          en: "Calculation and Visualization Synchronization",
        },
        description: {
          id: "Gantt Chart, tabel, dan animasi harus menggunakan hasil perhitungan yang sama.",
          en: "The Gantt chart, table, and animation needed to use the same calculation results.",
        },
        resolution: {
          id: "Hasil algoritma dijadikan satu sumber data utama untuk seluruh komponen tampilan.",
          en: "The algorithm result was used as a single source of truth for all visual components.",
        },
      },
    ],

    learnings: {
      id: [
        "Memahami perbedaan algoritma preemptive dan non-preemptive.",
        "Mengubah hasil algoritma menjadi visualisasi interaktif.",
        "Membangun antarmuka yang responsif menggunakan JavaScript.",
        "Menguji algoritma menggunakan berbagai skenario proses.",
      ],
      en: [
        "Understanding preemptive and non-preemptive algorithms.",
        "Transforming algorithm results into interactive visualization.",
        "Building responsive interfaces using JavaScript.",
        "Testing algorithms with multiple process scenarios.",
      ],
    },

    screenshots: projectScreenshots['cpu-scheduling-simulator'],
  },

  wartegsmart: {
    role: {
      id: "Pengembang Full-Stack",
      en: "Full-Stack Developer",
    },

    type: {
      id: "Aplikasi Manajemen Bisnis",
      en: "Business Management Application",
    },

    year: "2026",

    overview: {
      id: "WartegSmart adalah aplikasi kasir dan manajemen keuangan untuk membantu usaha warteg mengelola menu, stok, transaksi, laporan pendapatan, dan aktivitas operasional.",
      en: "WartegSmart is a cashier and financial management application that helps small food businesses manage menus, inventory, transactions, revenue reports, and daily operations.",
    },

    problem: {
      id: "Pencatatan transaksi dan stok secara manual dapat menyebabkan kesalahan perhitungan, kehilangan data, serta kesulitan dalam memantau kondisi usaha.",
      en: "Manual transaction and inventory records can cause calculation errors, data loss, and difficulty monitoring business performance.",
    },

    solution: {
      id: "WartegSmart menyediakan sistem berdasarkan peran Owner dan Kasir. Kasir dapat melakukan transaksi, sedangkan Owner dapat mengelola menu dan melihat laporan melalui dashboard.",
      en: "WartegSmart provides role-based functionality for Owners and Cashiers. Cashiers process transactions, while Owners manage menus and monitor reports through a dashboard.",
    },

    features: [
      {
        title: {
          id: "Role Owner dan Kasir",
          en: "Owner and Cashier Roles",
        },
        description: {
          id: "Setiap pengguna memperoleh halaman dan akses fitur sesuai perannya.",
          en: "Each user receives pages and feature access based on their role.",
        },
      },
      {
        title: {
          id: "CRUD Menu",
          en: "Menu CRUD",
        },
        description: {
          id: "Owner dapat menambah, mengubah, menghapus, dan memperbarui stok menu.",
          en: "Owners can add, edit, delete, and update menu inventory.",
        },
      },
      {
        title: {
          id: "Sistem Transaksi",
          en: "Transaction System",
        },
        description: {
          id: "Kasir dapat memilih menu, mengelola keranjang, menerima pembayaran, dan mencetak struk.",
          en: "Cashiers can select menu items, manage the cart, process payments, and print receipts.",
        },
      },
      {
        title: {
          id: "Dashboard dan Laporan",
          en: "Dashboard and Reports",
        },
        description: {
          id: "Menampilkan pendapatan, metode pembayaran, menu terlaris, dan notifikasi stok.",
          en: "Displays revenue, payment methods, best-selling items, and stock notifications.",
        },
      },
    ],

    process: [
      {
        title: {
          id: "Perancangan Fitur",
          en: "Feature Planning",
        },
        description: {
          id: "Mendefinisikan kebutuhan Owner dan Kasir serta batas akses masing-masing.",
          en: "Defined Owner and Cashier requirements and their respective access limits.",
        },
      },
      {
        title: {
          id: "Perancangan Database",
          en: "Database Design",
        },
        description: {
          id: "Membuat collection users, menus, dan transactions pada MongoDB.",
          en: "Created users, menus, and transactions collections in MongoDB.",
        },
      },
      {
        title: {
          id: "Implementasi CRUD dan Transaksi",
          en: "CRUD and Transaction Implementation",
        },
        description: {
          id: "Membangun pengelolaan menu, keranjang, pembayaran, dan pengurangan stok.",
          en: "Built menu management, cart functionality, payments, and inventory deduction.",
        },
      },
      {
        title: {
          id: "Dashboard dan Visualisasi",
          en: "Dashboard and Visualization",
        },
        description: {
          id: "Mengolah data transaksi menjadi metrik dan grafik menggunakan Chart.js.",
          en: "Converted transaction data into dashboard metrics and charts using Chart.js.",
        },
      },
    ],

    challenges: [
      {
        title: {
          id: "Sinkronisasi Stok",
          en: "Inventory Synchronization",
        },
        description: {
          id: "Stok harus langsung berkurang setelah transaksi berhasil diproses.",
          en: "Inventory needed to decrease immediately after a successful transaction.",
        },
        resolution: {
          id: "Proses penyimpanan transaksi dan pembaruan stok ditempatkan dalam alur yang sama.",
          en: "Transaction storage and inventory updates were handled within the same workflow.",
        },
      },
      {
        title: {
          id: "Pengolahan Data Laporan",
          en: "Report Data Processing",
        },
        description: {
          id: "Data transaksi perlu dikelompokkan berdasarkan tanggal, bulan, dan metode pembayaran.",
          en: "Transaction data needed to be grouped by date, month, and payment method.",
        },
        resolution: {
          id: "Data diolah pada controller sebelum dikirim ke dashboard dan Chart.js.",
          en: "The data was processed in the controller before being sent to the dashboard and Chart.js.",
        },
      },
    ],

    learnings: {
      id: [
        "Membangun aplikasi web menggunakan pola MVC sederhana.",
        "Menghubungkan PHP dengan MongoDB Atlas.",
        "Menerapkan autentikasi dan pembatasan akses berdasarkan peran.",
        "Mengubah data transaksi menjadi laporan dan grafik.",
      ],
      en: [
        "Building a web application with a simple MVC structure.",
        "Connecting PHP with MongoDB Atlas.",
        "Implementing authentication and role-based access.",
        "Transforming transaction data into reports and charts.",
      ],
    },

    screenshots: projectScreenshots['wartegsmart'],
  },

  serenity: {
    role: {
      id: "Pengembang Full-Stack",
      en: "Full-Stack Developer",
    },

    type: {
      id: "Aplikasi CRUD Event Organizer",
      en: "Event Organizer CRUD Application",
    },

    year: "2026",

    overview: {
      id: "Serenity merupakan aplikasi manajemen Event Organizer dan Wedding Organizer dengan sistem pelanggan dan admin yang terpisah.",
      en: "Serenity is an Event Organizer and Wedding Organizer management application with separate customer and administrator systems.",
    },

    problem: {
      id: "Pengelolaan layanan acara, data pemesanan, dan informasi pelanggan membutuhkan sistem terpusat agar proses administrasi menjadi lebih terstruktur.",
      en: "Managing event services, customer orders, and client information requires a centralized system to make administration more structured.",
    },

    solution: {
      id: "Aplikasi menyediakan halaman pelanggan untuk melihat dan memesan layanan serta dashboard admin untuk mengelola kategori, pesanan, undangan, dan laporan.",
      en: "The application provides a customer interface for viewing and ordering services and an administrator dashboard for managing categories, orders, invitations, and reports.",
    },

    features: [
      {
        title: {
          id: "Sistem Pelanggan",
          en: "Customer System",
        },
        description: {
          id: "Pelanggan dapat melihat layanan dan melakukan pemesanan melalui aplikasi.",
          en: "Customers can browse services and place orders through the application.",
        },
      },
      {
        title: {
          id: "Dashboard Admin",
          en: "Administrator Dashboard",
        },
        description: {
          id: "Admin dapat mengelola data layanan, pesanan, dan informasi pelanggan.",
          en: "Administrators can manage services, orders, and customer information.",
        },
      },
      {
        title: {
          id: "Undangan Digital",
          en: "Digital Invitations",
        },
        description: {
          id: "Menyediakan pengelolaan data undangan berdasarkan kategori acara.",
          en: "Provides invitation data management based on event categories.",
        },
      },
      {
        title: {
          id: "Laporan Pemesanan",
          en: "Order Reports",
        },
        description: {
          id: "Admin dapat menampilkan dan mencetak informasi pemesanan.",
          en: "Administrators can display and print order information.",
        },
      },
    ],

    process: [
      {
        title: {
          id: "Penentuan Ruang Lingkup",
          en: "Scope Definition",
        },
        description: {
          id: "Menyederhanakan fitur agar sesuai dengan kebutuhan tugas dan waktu pengembangan.",
          en: "Simplified the features to match the assignment requirements and development timeline.",
        },
      },
      {
        title: {
          id: "Perancangan Sistem",
          en: "System Design",
        },
        description: {
          id: "Memisahkan alur pelanggan dan admin serta merancang struktur data pesanan.",
          en: "Separated customer and administrator flows and designed the order data structure.",
        },
      },
      {
        title: {
          id: "Implementasi CRUD",
          en: "CRUD Implementation",
        },
        description: {
          id: "Membangun fungsi tambah, tampil, ubah, dan hapus pada data utama aplikasi.",
          en: "Built create, read, update, and delete functionality for the application's primary data.",
        },
      },
      {
        title: {
          id: "Pengujian dan Perbaikan",
          en: "Testing and Improvements",
        },
        description: {
          id: "Menguji alur pemesanan, perubahan kategori, preview undangan, dan pencetakan laporan.",
          en: "Tested ordering flows, category changes, invitation previews, and report printing.",
        },
      },
    ],

    challenges: [
      {
        title: {
          id: "Perubahan Kategori Undangan",
          en: "Invitation Category Changes",
        },
        description: {
          id: "Perubahan kategori undangan dapat menyebabkan data lama tidak sesuai dengan template baru.",
          en: "Changing an invitation category could make existing data incompatible with the new template.",
        },
        resolution: {
          id: "Validasi dan struktur data perlu disesuaikan berdasarkan kebutuhan setiap kategori.",
          en: "Validation and data structures needed to be adjusted based on each category's requirements.",
        },
      },
      {
        title: {
          id: "Tampilan Laporan Cetak",
          en: "Printed Report Layout",
        },
        description: {
          id: "Layout halaman web tidak selalu sesuai ketika dicetak menjadi laporan.",
          en: "Web page layouts do not always translate properly into printed reports.",
        },
        resolution: {
          id: "Diperlukan aturan CSS khusus untuk mode print agar elemen laporan lebih terstruktur.",
          en: "Dedicated print CSS rules were required to structure report elements properly.",
        },
      },
    ],

    learnings: {
      id: [
        "Memahami implementasi CRUD dalam aplikasi Laravel.",
        "Memisahkan alur pelanggan dan administrator.",
        "Mengelola data berbasis dokumen menggunakan MongoDB.",
        "Menguji perubahan data terhadap tampilan dan laporan.",
      ],
      en: [
        "Understanding CRUD implementation in Laravel applications.",
        "Separating customer and administrator workflows.",
        "Managing document-based data using MongoDB.",
        "Testing how data changes affect interfaces and reports.",
      ],
    },

    screenshots: projectScreenshots['serenity'],
  },

  laras: {
    role: {
      id: "Pengembang Aplikasi",
      en: "Application Developer",
    },
    type: {
      id: "Aplikasi Manajemen Personal",
      en: "Personal Management Application",
    },
    year: "2026",
    overview: {
      id: "Laras adalah aplikasi manajemen kehidupan personal yang sedang dikembangkan untuk membantu pengguna mengatur aktivitas, keuangan multi-rekening, prioritas, dan langganan dalam satu tempat.",
      en: "Laras is an in-progress personal management application designed to bring activities, multi-account finances, priorities, and subscriptions into one place.",
    },
    problem: {
      id: "Aktivitas, transaksi, dan langganan sering tercatat di tempat yang berbeda sehingga sulit dilihat sebagai satu gambaran yang utuh.",
      en: "Activities, transactions, and subscriptions often live in separate places, making it difficult to see the full picture.",
    },
    solution: {
      id: "Laras dirancang sebagai ruang kerja terpadu dengan pencatatan aktivitas dan keuangan, penentuan prioritas, serta insight dan rekomendasi adaptif. Fitur-fitur ini masih dalam pengembangan.",
      en: "Laras is being designed as a unified workspace for activities and finances, priority planning, and adaptive insights and recommendations. These features are still in development.",
    },
    features: [
      {
        title: { id: "Aktivitas dan Prioritas", en: "Activities and Priorities" },
        description: {
          id: "Merencanakan aktivitas dan menyusun hal yang paling penting untuk dikerjakan.",
          en: "Plan activities and organize what matters most.",
        },
      },
      {
        title: { id: "Keuangan Multi-Rekening", en: "Multi-Account Finances" },
        description: {
          id: "Menyatukan pencatatan keuangan dari lebih dari satu rekening.",
          en: "Bring financial records from multiple accounts together.",
        },
      },
      {
        title: { id: "Langganan dan Insight", en: "Subscriptions and Insights" },
        description: {
          id: "Memantau langganan dan menyiapkan insight adaptif berdasarkan data pengguna.",
          en: "Track subscriptions and prepare adaptive insights from user data.",
        },
      },
    ],
    process: [
      {
        title: { id: "Perancangan Kebutuhan", en: "Requirements Planning" },
        description: {
          id: "Menentukan alur utama untuk aktivitas, rekening, prioritas, dan langganan.",
          en: "Define the main flows for activities, accounts, priorities, and subscriptions.",
        },
      },
      {
        title: { id: "Pengembangan Bertahap", en: "Incremental Development" },
        description: {
          id: "Membangun dan menguji modul secara bertahap selama proyek berlangsung.",
          en: "Build and check each module incrementally as the project progresses.",
        },
      },
    ],
    challenges: [
      {
        title: { id: "Data yang Saling Berkaitan", en: "Connected Data" },
        description: {
          id: "Aktivitas, rekening, dan langganan perlu tetap mudah dipahami saat ditampilkan bersama.",
          en: "Activities, accounts, and subscriptions need to remain clear when viewed together.",
        },
        resolution: {
          id: "Alur dan struktur data sedang dirancang per modul sebelum digabungkan.",
          en: "Flows and data structures are being designed module by module before integration.",
        },
      },
    ],
    learnings: {
      id: [
        "Merancang aplikasi dari kebutuhan sehari-hari.",
        "Memecah fitur besar menjadi modul yang dapat dikembangkan bertahap.",
      ],
      en: [
        "Designing an application around everyday needs.",
        "Breaking a broad feature set into modules that can be developed incrementally.",
      ],
    },
    screenshots: projectScreenshots['laras'],
  },
};
