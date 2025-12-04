export default function Hero() {
  return (
    <section className="relative">
      <div className="h-[60vh] bg-cover bg-center flex items-center" style={{ backgroundImage: "url('/hero.jpg')" }}>
        <div className="max-w-5xl mx-auto px-4 py-12 flex items-center">
          <div className="bg-white/80 backdrop-blur p-8 rounded-md shadow-lg max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold">A S Tour And Travels</h1>
            <p className="mt-2 text-gray-700">Flight, Railway, Bus, Cab, Visa & Passport assistance — fast quotes & GST-ready invoices.</p>

            <div className="mt-4">
              <a href="/lead" className="inline-block bg-blue-600 text-white px-5 py-3 rounded font-medium">Get Quick Quote</a>
              <a href="https://wa.me/918602837299" className="ml-3 inline-block bg-green-600 text-white px-4 py-3 rounded">WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
