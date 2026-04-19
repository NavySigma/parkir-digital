import hero from '../assets/images/bike.png';
import laptop from '../assets/images/laptop.png';
import Footer from '../components/Footer';

export default function Home(){
  return (
    <main className="container mx-auto p-8">
      <section className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-md shadow-md">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-extrabold mb-4 text-gray-900">PARKIR DIGITAL</h2>
          <p className="text-gray-600 mb-4">Parkir Digital yang Cepat dan Efisien</p>
          <p className="mb-4">Solusi parkir cerdas untuk memudahkan pencarian lokasi parkir secara real-time.</p>
          <a href="/qrcode" className="inline-block px-8 py-4 bg-primary text-white rounded-md">Bayar Disini</a>
        </div>
        <img src={hero} alt="hero" className="md:w-1/2 w-full" />
      </section>

      <section className="mt-8 bg-white p-8 rounded-md shadow-md">
        <h3 className="text-xl font-semibold mb-4">Why choose us</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-50 rounded-md text-center">Fast booking</div>
          <div className="p-6 bg-gray-50 rounded-md text-center">Secure</div>
          <div className="p-6 bg-gray-50 rounded-md text-center">24/7 Support</div>
        </div>
      </section>

      <section className="mt-8">
        <img src={laptop} alt="illustration" className="w-full max-w-2xl mx-auto" />
      </section>

      <Footer />
    </main>
  )
}