import Head from "next/head";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>A S Tour And Travels</title>
        <meta name="description" content="Book Flights, Trains, Buses, Cabs, Visa & Passport assistance" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />
      <main>
        <Hero />
        <Services />
      </main>
      <Footer />
    </>
  );
}
