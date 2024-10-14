"use client"; // Required for client-side state in Next.js

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Helper for conditional class names (optional)

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/detection", label: "Detection" },
    { href: "/about", label: "About Us" },
  ];

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-500 p-4 fixed w-full top-0 left-0 shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-white text-2xl font-bold">
          COVIDX
        </Link>

        {/* Burger Icon for Mobile */}
        <button
          className="md:hidden flex flex-col space-y-1 focus:outline-none"
          onClick={toggleMenu}
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-transform ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white transition-opacity ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white transition-transform ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block text-lg ${
                  pathname === link.href
                    ? "text-orange-400 font-semibold"
                    : "text-white"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu */}
        <ul
          className={`absolute top-16 left-0 w-full bg-gray-800 p-4 md:hidden space-y-4 transition-all duration-500 ease-in-out transform ${
            isOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-8 opacity-0 pointer-events-none"
          }`}
        >
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block text-lg ${
                  pathname === link.href
                    ? "text-orange-400 font-semibold"
                    : "text-white"
                }`}
                onClick={() => setIsOpen(false)} // Close menu on link click
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
