export default function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="logo" className="w-10 h-10 object-contain" />
          <div>
            <div className="font-bold text-lg">A S Tour And Travels</div>
            <div className="text-xs text-gray-500">Trusted travel agent</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a className="text-sm" href="tel:8602837299">Call: 8602837299</a>
          <a className="bg-green-600 text-white px-3 py-2 rounded text-sm" href="https://wa.me/918602837299" target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </div>
    </nav>
  );
}
