"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
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
      <Link href="#home" className="hover:text-cyan-300 transition">Home</Link>
      <Link href="#about" className="hover:text-cyan-300 transition">About</Link>
      <Link href="#blog" className="hover:text-cyan-300 transition">Blog</Link>
      <Link href="#pages" className="hover:text-cyan-300 transition">Pages</Link>
      <Link href="#contact" className="hover:text-cyan-300 transition">Contact</Link>
    </nav>

    {/* CTA Button */}
    <Button asChild size="lg" className="hidden md:inline-flex bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white hover:bg-white hover:text-white transition">
      <Link href="#appointment">Book Appointment</Link>
    </Button>
  </div>
</header>


      {/* Hero Section */}
      <section
        id="home"
        className="relative flex flex-1 items-center justify-center text-center text-white"
      >
        {/* Background Image */}
        <Image
          src="/home.png"
          alt="Medical Background"
          fill
          priority
          className="object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl px-6 py-32">
          <p className="uppercase tracking-wider text-sm text-blue-200">
            THE BEST MEDICAL CENTER
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Bringing <span className="text-cyan-300">health</span> <br />
            to life for the whole family.
          </h1>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="hidden md:inline-flex bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white hover:bg-white hover:text-white transition"
          >
            <Link href="#discover">Discover More</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
