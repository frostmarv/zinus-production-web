import React from "react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 px-6 py-12">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-6">
          Syarat dan Ketentuan Layanan
        </h1>
        <p className="text-sm text-gray-500 text-center mb-10">
          Terakhir diperbarui: 17 Oktober 2025
        </p>

        <section className="space-y-6 leading-relaxed">
          <p>
            Selamat datang di <strong>Baytera</strong>. Dengan menggunakan
            platform kami, Anda menyetujui untuk terikat pada syarat dan
            ketentuan berikut. Mohon baca dengan seksama sebelum melanjutkan.
          </p>

          <h2 className="text-xl font-semibold text-green-700">
            1. Penggunaan Layanan
          </h2>
          <p>
            Anda setuju untuk menggunakan layanan kami hanya untuk tujuan yang
            sah dan sesuai dengan hukum yang berlaku. Setiap bentuk
            penyalahgunaan akan mengakibatkan penghentian akses tanpa
            pemberitahuan.
          </p>

          <h2 className="text-xl font-semibold text-green-700">
            2. Akun dan Keamanan
          </h2>
          <p>
            Anda bertanggung jawab penuh terhadap keamanan akun Anda, termasuk
            menjaga kerahasiaan kata sandi dan aktivitas yang terjadi di
            dalamnya.
          </p>

          <h2 className="text-xl font-semibold text-green-700">
            3. Pembayaran dan Transaksi
          </h2>
          <p>
            Semua transaksi melalui Baytera dilakukan secara aman melalui mitra
            pembayaran resmi. Kami tidak bertanggung jawab atas kesalahan
            transfer akibat informasi yang salah dari pengguna.
          </p>

          <h2 className="text-xl font-semibold text-green-700">
            4. Perubahan Ketentuan
          </h2>
          <p>
            Kami berhak mengubah atau memperbarui ketentuan ini sewaktu-waktu.
            Versi terbaru akan selalu tersedia di halaman ini.
          </p>

          <h2 className="text-xl font-semibold text-green-700">
            5. Kontak Kami
          </h2>
          <p>
            Jika Anda memiliki pertanyaan, silakan hubungi kami di{" "}
            <a
              href="mailto:support@baytera.com"
              className="text-green-700 underline"
            >
              support@baytera.com
            </a>
            .
          </p>
        </section>

        <div className="mt-10 text-center">
          <a
            href="/privacy-policy"
            className="text-green-700 hover:text-green-900 underline text-sm"
          >
            Baca Kebijakan Privasi Kami
          </a>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
