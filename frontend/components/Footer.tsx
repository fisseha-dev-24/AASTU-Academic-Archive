import Link from "next/link"
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src="/aastu-university-logo-white.png" alt="AASTU Logo" className="h-8 w-8" />
              <div>
                <h3 className="font-bold text-lg">AASTU Archive</h3>
                <p className="text-sm text-gray-400">Digital Repository</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering academic excellence through digital innovation at Addis Ababa Science and Technology University.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-white transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h4 className="font-semibold mb-4 text-white">For Users</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/student/dashboard" className="hover:text-white transition-colors">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link href="/teacher/dashboard" className="hover:text-white transition-colors">
                  Faculty Portal
                </Link>
              </li>
              <li>
                <Link href="/department/dashboard" className="hover:text-white transition-colors">
                  Department Portal
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact Info</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p>Addis Ababa Science and Technology University</p>
                  <p>Addis Ababa, Ethiopia</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:archive@aastu.edu.et" className="hover:text-white transition-colors">
                  archive@aastu.edu.et
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+251-11-XXX-XXXX" className="hover:text-white transition-colors">
                  +251-11-XXX-XXXX
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <ExternalLink className="h-4 w-4 flex-shrink-0" />
                <a 
                  href="https://aastu.edu.et" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  aastu.edu.et
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              <p>&copy; 2024 AASTU Archive System. All rights reserved.</p>
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/support" className="hover:text-white transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
