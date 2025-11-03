"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="fixed w-full z-50 border-b bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-[#0f172a] font-bold">
            M
          </div>
          <span className="text-xl font-bold text-white">Medi</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-8 font-medium text-white">
          <Link href="/home" className="hover:text-cyan-300 transition">
            Home
          </Link>
          <Link href="/about" className="hover:text-cyan-300 transition">
            About
          </Link>
          <Link href="/departments" className="hover:text-cyan-300 transition">
            Pages
          </Link>
          <Link href="/contact" className="hover:text-cyan-300 transition">
            Contact
          </Link>
        </nav>

        {/* CTA Button */}
        <Button
          asChild
          size="lg"
          className="hidden md:inline-flex bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white hover:bg-white hover:text-black transition"
        >
          <Link href="#appointment">Book Appointment</Link>
        </Button>
      </div>
    </header>
  )
}
