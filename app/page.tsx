"use client"

import type React from "react"

import {
  Heart,
  Shield,
  Users,
  HeartIcon,
  ChevronDown,
  ArrowRight,
  Award,
  Zap,
  CheckCircle,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

export default function Home() {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState("home")
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: "smooth" })
    setActiveSection(sectionId)
    setMobileMenuOpen(false)
  }

  const navLink = (sectionId: string) =>
    `text-sm font-medium transition cursor-pointer
    ${activeSection === sectionId ? "border-b-2 border-white pb-1 text-white" : "text-white/80 hover:text-white"}`

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* ================= HEADER ================= */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-teal-700/95 shadow-lg backdrop-blur-sm" : "bg-teal-700"
        } px-4 sm:px-6 md:px-10 py-4 flex items-center justify-between text-white`}
      >
        <div className="flex items-center gap-2 font-bold text-lg flex-shrink-0">
          <Image src="/logo2.svg" alt="Al Falah Logo" width={140} height={140} priority className="h-12 w-auto" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection("home")} className={navLink("home")}>
            Home
          </button>
          <button onClick={() => scrollToSection("about")} className={navLink("about")}>
            About Us
          </button>
          <button onClick={() => scrollToSection("services")} className={navLink("services")}>
            Services
          </button>
          <button onClick={() => scrollToSection("reviews")} className={navLink("reviews")}>
            Reviews
          </button>
          <button onClick={() => scrollToSection("faq")} className={navLink("faq")}>
            FAQ's
          </button>

          <Link
            href="/staff/login"
            className="bg-white text-teal-700 px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 hover:shadow-lg transition"
          >
            Admin Login
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <nav className="fixed top-16 left-0 right-0 bg-teal-700 md:hidden z-40 shadow-lg">
          <div className="flex flex-col p-4 gap-4">
            <button
              onClick={() => scrollToSection("home")}
              className="text-white hover:text-cyan-200 text-left py-2 font-medium"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-white hover:text-cyan-200 text-left py-2 font-medium"
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-white hover:text-cyan-200 text-left py-2 font-medium"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("reviews")}
              className="text-white hover:text-cyan-200 text-left py-2 font-medium"
            >
              Reviews
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-white hover:text-cyan-200 text-left py-2 font-medium"
            >
              FAQ's
            </button>
            <Link
              href="/staff/login"
              className="bg-white text-teal-700 px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 text-center"
            >
              Admin Login
            </Link>
          </div>
        </nav>
      )}

      {/* ================= HERO SECTION ================= */}
      <section
        id="home"
        className="relative w-full min-h-screen bg-cover bg-center pt-24 sm:pt-28 md:pt-32 lg:pt-10"
        style={{
          backgroundImage: "url('Vector.png')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-teal-700/90"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-24 lg:py-32 flex flex-col md:flex-row items-center gap-8 md:gap-12 text-white">
          {/* Text */}
          <div className="flex-1 animate-fadeInUp">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 sm:mb-6 text-balance">
              Compassionate Assistance,
              <br />
              <span className="text-cyan-200">Delivered with Dignity</span>
            </h1>

            <p className="text-base sm:text-lg text-white/90 max-w-xl mb-6 sm:mb-8 leading-relaxed">
              A secure and compassionate platform connecting those in need with mercy-based support.
            </p>

            <div className="flex gap-3 sm:gap-4 flex-wrap">
              <Link href="/form">
                <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-teal-700 rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all text-sm sm:text-base">
                  Apply for Assistance
                </button>
              </Link>

              <Link href="/application-status">
                <button className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all text-sm sm:text-base">
                  Check Status
                </button>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="flex-1 flex justify-center md:justify-end animate-slideInRight w-full md:w-auto">
            <div className="animate-float">
              <Image
                src="/mosque.png"
                alt="Help Illustration"
                width={420}
                height={420}
                priority
                className="drop-shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto"
              />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
          onClick={() => scrollToSection("about")}
        >
          <ChevronDown className="w-8 h-8 text-white" />
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section id="about" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fadeInUp">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              About <span className="text-teal-600">Us</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed px-2">
              Rahmah Exchange is a faith-inspired initiative rooted in compassion, connecting generous hearts with those
              in need. We believe in the power of community and the importance of dignity in giving.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-12">
            <div
              className="p-6 sm:p-8 bg-gradient-to-br from-teal-50 to-white border-2 border-teal-200 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="w-12 sm:w-14 h-12 sm:h-14 bg-teal-600 rounded-full flex items-center justify-center mb-4 text-white flex-shrink-0">
                <Heart className="w-6 sm:w-7 h-6 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Compassionate Care</h3>
              <p className="text-sm sm:text-base text-gray-600">
                We treat every person with dignity and respect, understanding that true support goes beyond financial
                assistance.
              </p>
            </div>

            <div
              className="p-6 sm:p-8 bg-gradient-to-br from-teal-50 to-white border-2 border-teal-200 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="w-12 sm:w-14 h-12 sm:h-14 bg-teal-600 rounded-full flex items-center justify-center mb-4 text-white flex-shrink-0">
                <Shield className="w-6 sm:w-7 h-6 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Secure & Transparent</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Your information is protected with the highest security standards, and all processes are transparent and
                accountable.
              </p>
            </div>

            <div
              className="p-6 sm:p-8 bg-gradient-to-br from-teal-50 to-white border-2 border-teal-200 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp sm:col-span-2 md:col-span-1"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="w-12 sm:w-14 h-12 sm:h-14 bg-teal-600 rounded-full flex items-center justify-center mb-4 text-white flex-shrink-0">
                <Users className="w-6 sm:w-7 h-6 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Community-Driven</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Built on the foundation of community support, bringing generous donors and those in need together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES SECTION ================= */}
      <section id="services" className="px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fadeInUp">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-teal-600">Services</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-2">
              We offer comprehensive support services tailored to meet the diverse needs of our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <ServiceCard
              icon={<Heart className="w-10 sm:w-12 h-10 sm:h-12" />}
              title="Zakah and Sadaqah Services"
              description="Lorem Ipsum is simply dummy text of the printing and typesetting Lorem Ipsum is simply dummy text of the printing and typesetting"
              delay="0s"
            />
            <ServiceCard
              icon={<Shield className="w-10 sm:w-12 h-10 sm:h-12" />}
              title="Emergency Relief"
              description="Quick and compassionate response to urgent needs. We understand that some situations require immediate assistance and are ready to help."
              delay="0.1s"
            />
            <ServiceCard
              icon={<Users className="w-10 sm:w-12 h-10 sm:h-12" />}
              title="Community Support Programs"
              description="Long-term sustainable support programs designed to help individuals and families achieve self-sufficiency and improve their quality of life."
              delay="0.2s"
            />
            <ServiceCard
              icon={<HeartIcon className="w-10 sm:w-12 h-10 sm:h-12" />}
              title="Mentorship & Guidance"
              description="Personal guidance and mentorship programs connecting beneficiaries with experienced mentors who provide support and wisdom."
              delay="0.3s"
            />
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fadeInUp">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="text-teal-600">Rahmah Exchange</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Feature
              icon={<Zap className="w-7 sm:w-8 h-7 sm:h-8" />}
              title="Fast & Easy"
              description="Simple application process that takes just minutes to complete."
              delay="0s"
            />
            <Feature
              icon={<Award className="w-7 sm:w-8 h-7 sm:h-8" />}
              title="Verified & Trusted"
              description="All applications are carefully verified to ensure funds reach those truly in need."
              delay="0.1s"
            />
            <Feature
              icon={<CheckCircle className="w-7 sm:w-8 h-7 sm:h-8" />}
              title="Transparent Process"
              description="Complete transparency at every step of your application and approval journey."
              delay="0.2s"
            />
          </div>
        </div>
      </section>

      {/* ================= REVIEWS SECTION ================= */}
      <section id="reviews" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fadeInUp">
            <p className="text-teal-600 font-semibold text-sm mb-2">TESTIMONIAL</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              What People <span className="text-teal-600">Say About Us</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <ReviewCard
              title="Kindness"
              quote="Lorem Ipsum is simply dummy text Lorem Ipsum is simply dummy text Lorem Ipsum is simply dummy text Lorem Ipsum is simply dummy text"
              author="Bashir Muhammad"
              role="Senior Gardener Farmer"
              delay="0s"
            />
            <ReviewCard
              title="Humanity"
              quote="Lorem Ipsum is simply dummy text Lorem Ipsum is simply dummy text Lorem Ipsum is simply dummy text Lorem Ipsum is simply dummy text"
              author="Bashir Muhammad"
              role="Senior Gardener Farmer"
              delay="0.1s"
            />
            <ReviewCard
              title="Ethics & Morality"
              quote="Lorem Ipsum is simply dummy text Lorem Ipsum is simply dummy text Lorem Ipsum is simply dummy text Lorem Ipsum is simply dummy text"
              author="Bashir Muhammad"
              role="Senior Gardener Farmer"
              delay="0.2s"
            />
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section id="faq" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fadeInUp">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked <span className="text-teal-600">Questions</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg px-2">
              Find answers to common questions about our application process and services.
            </p>
          </div>

          <div className="space-y-4">
            <FAQItem
              question="How to apply?"
              answer="To apply for assistance, click the 'Apply for Assistance' button on our homepage. You'll be guided through a simple step-by-step process. Fill in your basic information, provide details about your situation, and upload any supporting documents. Our team will review your application within 3-5 business days."
            />
            <FAQItem
              question="Which types of documents are needed?"
              answer="Required documents typically include: Government-issued ID, Proof of residence (utility bill or rental agreement), Income documentation (if applicable), Medical records (if health-related), and any other documents supporting your case. Specific requirements depend on your situation."
            />
            <FAQItem
              question="How many days to complete this process?"
              answer="The typical timeline is 5-10 business days from application submission to final decision. This includes: 1-2 days for initial review, 2-3 days for verification, 2-3 days for assessment, and 1-2 days for final approval. Urgent cases may be expedited."
            />
            <FAQItem
              question="How to contact us?"
              answer="You can reach us through multiple channels: Phone: 000-123-4567, Email: support@rahmahexchange.com, or use our contact form on the website. For urgent matters, please call our hotline. We're available Monday-Friday, 9 AM - 5 PM."
            />
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-400 px-4 sm:px-6 md:px-8 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12">
            <div className="animate-fadeInUp" style={{ animationDelay: "0s" }}>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/logo2.svg" alt="Al Falah Logo" width={140} height={140} priority className="h-10 w-auto" />
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-gray-300">
                Mercy-based giving network for verified need. Compassionate assistance delivered with dignity.
              </p>
            </div>

            <div className="animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
              <h4 className="text-white font-bold mb-4 flex items-center gap-2 text-sm sm:text-base">Quick Links</h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <li>
                  <button
                    onClick={() => scrollToSection("home")}
                    className="hover:text-white transition-colors hover:translate-x-1 inline-flex items-center gap-1"
                  >
                    <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4" /> Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("about")}
                    className="hover:text-white transition-colors hover:translate-x-1 inline-flex items-center gap-1"
                  >
                    <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4" /> About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("services")}
                    className="hover:text-white transition-colors hover:translate-x-1 inline-flex items-center gap-1"
                  >
                    <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4" /> Services
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("reviews")}
                    className="hover:text-white transition-colors hover:translate-x-1 inline-flex items-center gap-1"
                  >
                    <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4" /> Reviews
                  </button>
                </li>
              </ul>
            </div>

            <div className="animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
              <h4 className="text-white font-bold mb-4 text-sm sm:text-base">Resources</h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <li>
                  <button
                    onClick={() => scrollToSection("faq")}
                    className="hover:text-white transition-colors hover:translate-x-1 inline-flex items-center gap-1"
                  >
                    <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4" /> FAQ's
                  </button>
                </li>
                <li>
                  <Link
                    href="/form"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-flex items-center gap-1"
                  >
                    <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4" /> Apply Now
                  </Link>
                </li>
                <li>
                  <Link
                    href="/application-status"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-flex items-center gap-1"
                  >
                    <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4" /> Check Status
                  </Link>
                </li>
              </ul>
            </div>

            <div className="animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
              <h4 className="text-white font-bold mb-4 text-sm sm:text-base">Support</h4>
              <p className="text-xs sm:text-sm mb-3 text-gray-300">
                <span className="block font-semibold text-white">Phone</span>
                000-123-4567
              </p>
              <p className="text-xs sm:text-sm text-gray-300">
                <span className="block font-semibold text-white">Email</span>
                support@rahmahexchange.com
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left text-xs sm:text-sm text-gray-500 gap-4">
              <p>&copy; 2026 Rahmah Exchange. All rights reserved.</p>
              <div className="flex gap-6 flex-wrap justify-center sm:justify-start">
                <Link href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ServiceCard({
  icon,
  title,
  description,
  delay,
}: { icon: React.ReactNode; title: string; description: string; delay: string }) {
  return (
    <div
      className="p-6 sm:p-8 bg-white rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp border border-gray-200"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="text-teal-600 flex-shrink-0">{icon}</div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

function Feature({
  icon,
  title,
  description,
  delay,
}: { icon: React.ReactNode; title: string; description: string; delay: string }) {
  return (
    <div className="p-6 sm:p-8 text-center animate-fadeInUp" style={{ animationDelay: delay }}>
      <div className="flex justify-center mb-4 text-teal-600">{icon}</div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600">{description}</p>
    </div>
  )
}

function ReviewCard({
  title,
  quote,
  author,
  role,
  delay,
}: { title: string; quote: string; author: string; role: string; delay: string }) {
  return (
    <div
      className="p-6 sm:p-8 bg-white rounded-2xl hover:shadow-xl transition-all duration-300 animate-fadeInUp border border-gray-200"
      style={{ animationDelay: delay }}
    >
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">{quote}</p>
      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm font-semibold text-gray-900">{author}</p>
        <p className="text-xs sm:text-sm text-gray-500">{role}</p>
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 text-left flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-50"
      >
        <span className="text-sm sm:text-base">{question}</span>
        <ChevronDown className={`w-5 h-5 text-teal-600 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm sm:text-base text-gray-600 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  )
}
