import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Om Sai Enterprises</h3>
            <p className="mb-4">
              Your trusted partner for quality hardware solutions since 2005. We provide premium products for businesses
              and individuals.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-white">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="hover:text-white">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="hover:text-white">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Product Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=tools" className="hover:text-white">
                  Tools
                </Link>
              </li>
              <li>
                <Link href="/products?category=fasteners" className="hover:text-white">
                  Fasteners
                </Link>
              </li>
              <li>
                <Link href="/products?category=electrical" className="hover:text-white">
                  Electrical
                </Link>
              </li>
              <li>
                <Link href="/products?category=plumbing" className="hover:text-white">
                  Plumbing
                </Link>
              </li>
              <li>
                <Link href="/products?category=safety" className="hover:text-white">
                  Safety Equipment
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 shrink-0 text-orange-500" />
                <span>Sy. No. 157/E, Doolapally Village, IDA Jeedimetla, Hyderabad - 500055</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-orange-500" />
                <span>+91 90109 85402</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-orange-500" />
                <span>omsai5402@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} Om Sai Enterprises. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
