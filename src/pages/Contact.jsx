import ContactForm from '../components/ContactForm';
import phone from '../assets/icons/phone.png';
import mail from '../assets/icons/mail.png';
import map from '../assets/icons/map.png';
import Footer from '../components/Footer';

export default function Contact(){
  return (
    <main className="container mx-auto p-8">
      <section className="bg-white p-8 rounded-md shadow-md max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Hubungi Kami</h2>
        <p className="mb-4 text-gray-600">Ada pertanyaan? Hubungi kami sekarang!</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={phone} alt="phone" className="w-6 h-6" />
              <div>+62 857-0812-8392</div>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <img src={mail} alt="mail" className="w-6 h-6" />
              <div>parkir.digie@gmail.com</div>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <img src={map} alt="map" className="w-6 h-6" />
              <div>Madyopuro, Indonesia</div>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>

      <Footer />
    </main>
  )
}