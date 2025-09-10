import Link from "next/link"
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and Description */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <img src="/aastu-university-logo-white.png" alt="AASTU Logo" className="h-12 w-12" />
              <div>
                <h3 className="font-bold text-xl bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">AASTU</h3>
                <p className="text-sm text-blue-200 font-medium">Digital Repository</p>
              </div>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed">
              Empowering academic excellence through digital innovation at Addis Ababa Science and Technology University - University for Industry.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6 text-white text-lg">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-amber-300 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-amber-300 transition-colors duration-200">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-amber-300 transition-colors duration-200">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-300 transition-colors duration-200">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h4 className="font-semibold mb-6 text-white text-lg">User Portals</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/student/dashboard" className="hover:text-amber-300 transition-colors duration-200">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link href="/teacher/dashboard" className="hover:text-amber-300 transition-colors duration-200">
                  Faculty Portal
                </Link>
              </li>
              <li>
                <Link href="/department/dashboard" className="hover:text-amber-300 transition-colors duration-200">
                  Department Portal
                </Link>
              </li>
              <li>
                <Link href="/dean/dashboard" className="hover:text-amber-300 transition-colors duration-200">
                  Dean Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-6 text-white text-lg">Contact Information</h4>
            <div className="space-y-4 text-sm text-gray-400">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-amber-400" />
                <div>
                  <p className="font-medium">Addis Ababa Science and Technology University</p>
                  <p className="text-gray-500">Addis Ababa, Ethiopia</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 flex-shrink-0 text-amber-400" />
                <a href="mailto:archive@aastu.edu.et" className="hover:text-amber-300 transition-colors duration-200">
                  archive@aastu.edu.et
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 flex-shrink-0 text-amber-400" />
                <a href="tel:+251-11-XXX-XXXX" className="hover:text-amber-300 transition-colors duration-200">
                  +251-11-XXX-XXXX
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <ExternalLink className="h-5 w-5 flex-shrink-0 text-amber-400" />
                <a 
                  href="https://aastu.edu.et" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors duration-200"
                >
                  aastu.edu.et
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              <p>&copy; 2024 AASTU Digital Repository. All rights reserved.</p>
            </div>
            <div className="flex space-x-8 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-amber-300 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-amber-300 transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/support" className="hover:text-amber-300 transition-colors duration-200">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
