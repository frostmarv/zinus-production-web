import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 px-6 py-12">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-6">
          Kebijakan Privasi
        </h1>
        <p className="text-sm text-gray-500 text-center mb-10">
          Terakhir diperbarui: 17 Oktober 2025
        </p>

        <section className="space-y-6 leading-relaxed">
          <p>
            <strong>Baytera</strong> menghargai privasi Anda dan berkomitmen
            untuk melindungi data pribadi Anda. Halaman ini menjelaskan
            bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi
            tersebut.
          </p>

          <h2 className="text-xl font-semibold text-green-700">
            1. Informasi yang Kami Kumpulkan
          </h2>
          <p>
            Kami dapat mengumpulkan informasi pribadi seperti nama, alamat
            email, nomor telepon, dan data transaksi untuk keperluan verifikasi
            dan penyediaan layanan.
          </p>

          <h2 className="text-xl font-semibold text-green-700">
            2. Penggunaan Informasi
          </h2>
          <p>
            Informasi Anda digunakan untuk menyediakan, meningkatkan, dan
            menyesuaikan layanan kami. Kami juga dapat menggunakan data tersebut
            untuk keperluan komunikasi atau dukungan pelanggan.
          </p>

          <h2 className="text-xl font-semibold text-green-700">
            3. Perlindungan Data
          </h2>
          <p>
            Kami menerapkan langkah-langkah keamanan teknis dan organisasi untuk
            mencegah akses tidak sah, kehilangan, atau penyalahgunaan data Anda.
          </p>

          <h2 className="text-xl font-semibold text-green-700">
            4. Berbagi Informasi
          </h2>
          <p>
            Kami tidak menjual atau menyewakan data pribadi Anda. Informasi
            hanya dibagikan dengan pihak ketiga tepercaya yang membantu
            operasional layanan kami, sesuai dengan kebijakan ini.
          </p>

          <h2 className="text-xl font-semibold text-green-700">
            5. Perubahan Kebijakan
          </h2>
          <p>
            Kami dapat memperbarui kebijakan ini dari waktu ke waktu. Perubahan
            besar akan diberitahukan melalui email atau notifikasi di platform.
          </p>

          <h2 className="text-xl font-semibold text-green-700">
            6. Hubungi Kami
          </h2>
          <p>
            Untuk pertanyaan terkait privasi, hubungi kami di{" "}
            <a
              href="mailto:privacy@baytera.com"
              className="text-green-700 underline"
            >
              privacy@baytera.com
            </a>
            .
          </p>
        </section>

        <div className="mt-10 text-center">
          <a
            href="/tos"
            className="text-green-700 hover:text-green-900 underline text-sm"
          >
            Baca Syarat & Ketentuan
          </a>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
