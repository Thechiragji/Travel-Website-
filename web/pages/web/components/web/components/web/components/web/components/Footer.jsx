export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-10">
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h4 className="font-bold">A S Tour And Travels</h4>
          <p className="text-sm mt-2">GST: (add GST number)</p>
        </div>

        <div>
          <h5 className="font-semibold">Contact</h5>
          <p className="text-sm mt-2">Phone: <a href="tel:8602837299" className="underline">8602837299</a></p>
          <p className="text-sm">Email: <a className="underline" href="mailto:A.stourandtravels@yahoo.com">A.stourandtravels@yahoo.com</a></p>
        </div>

        <div>
          <h5 className="font-semibold">Quick Links</h5>
          <ul className="text-sm mt-2 space-y-1">
            <li>Flights</li>
            <li>Trains</li>
            <li>Buses</li>
            <li>Visa & Passport</li>
          </ul>
        </div>
      </div>

      <div className="text-center p-3 text-xs bg-black/20">© {new Date().getFullYear()} A S Tour And Travels</div>
    </footer>
  );
}
