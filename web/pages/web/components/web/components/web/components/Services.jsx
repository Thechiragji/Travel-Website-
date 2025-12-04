const services = [
  { title: "Flight Ticket", desc: "Domestic & International flight bookings" },
  { title: "Railway Ticket", desc: "IRCTC PNR help & bookings" },
  { title: "Bus Ticket", desc: "State & private bus bookings" },
  { title: "Cab Booking", desc: "Airport transfers & local cabs" },
  { title: "Visa Service", desc: "Visa assistance & documentation" },
  { title: "Passport Assistance", desc: "Application & renewals support" },
];

export default function Services() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {services.map((s, i) => (
            <div key={i} className="bg-white p-5 rounded shadow">
              <h3 className="font-semibold text-lg">{s.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
