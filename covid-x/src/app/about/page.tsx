// src/app/about/page.tsx

import React from "react";
import Image from "next/image";
import ValdoPP from "../../assets/ValdoPP.jpg";
import NathanPP from "../../assets/NathanPP.jpeg";
import NelloPP from "../../assets/NelloPP.jpg";
import DarrenPP from "../../assets/DarrenPP.jpeg";

export default function About() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 animate-spin-slow blur-xl">
          <div className="absolute w-[60%] h-[60%] top-1/4 left-1/4 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 opacity-80 mix-blend-overlay"></div>
          <div className="absolute w-[80%] h-[80%] top-0 left-1/2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 opacity-60 animate-bounce mix-blend-overlay"></div>
        </div>
      </div>

      <section className="relative z-10 max-w-4xl text-center p-8 bg-white/10 backdrop-blur-md rounded-lg shadow-xl mt-32">
        <h1 className="text-5xl font-extrabold">About Us</h1>
        <p className="mt-6 text-lg text-gray-300">
          At <strong className="text-indigo-400">COVIDX</strong>, we are
          committed to providing an advanced, AI-driven solution to assist in
          the early detection of COVID using lung X-ray images. Our mission is
          to empower healthcare professionals and individuals with fast and
          reliable diagnostics, leveraging the power of cutting-edge technology.
        </p>
      </section>

      {/* Mission Section */}
      <section className="relative z-10 mt-16 max-w-3xl text-center">
        <h2 className="text-4xl font-semibold mb-6">Our Mission</h2>
        <p className="text-lg text-gray-300">
          Our mission is to provide precise, accessible, and timely COVID
          detection to save lives. We empower individuals with the tools and
          information they need to make informed health decisions. Through
          advanced technology, we aim to ensure everyone can act swiftly in
          their healthcare journey.
        </p>
      </section>

      {/* Team Section */}
      <section className="relative z-10 mt-16 text-center">
        <h2 className="text-4xl font-semibold mb-10">Meet Our Team</h2>
        <div className="flex flex-wrap justify-center gap-10">
          {teamMembers.map((member) => (
            <div key={member.name} className="flex flex-col items-center">
              <Image
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
              <h3 className="text-2xl text-indigo-400">{member.name}</h3>
              <p className="text-gray-300">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-16 p-6 text-center">
        <p className="text-gray-400">© 2024 COVIDX. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Team members data
const teamMembers = [
  {
    name: "Vernandio Rivaldo",
    role: "Website Developer",
    image: ValdoPP,
  },

  {
    name: "Darren Oliver H.P",
    role: "Design Specialist",
    image: DarrenPP,
  },
  {
    name: "Nathaniel Alexander",
    role: "AI Developer",
    image: NathanPP,
  },
  {
    name: "Nello Aurelius",
    role: "Report Maker",
    image: NelloPP,
  },
];
