import Link from "next/link";
import { Globe, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container-padding">
        <div className="py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center mb-6">
                <img 
                  src="/images/visaplace-logo-simple.svg" 
                  alt="VisaPlace" 
                  className="h-8 w-auto filter brightness-0 invert"
                />
              </div>
              <p className="text-neutral-300 mb-6 leading-relaxed">
                Your trusted partner for Canadian and US immigration. Expert legal guidance for your journey to a new life.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center text-neutral-300">
                  <Globe className="h-4 w-4 mr-2" />
                  <span className="text-sm">50+ Countries Served</span>
                </div>
              </div>
            </div>

            {/* Canadian Immigration */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Canadian Immigration</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/canadian-immigration/express-entry" className="text-neutral-300 hover:text-white transition-colors">
                    Express Entry
                  </Link>
                </li>
                <li>
                  <Link href="/canadian-immigration/pnp" className="text-neutral-300 hover:text-white transition-colors">
                    Provincial Nominee Program
                  </Link>
                </li>
                <li>
                  <Link href="/canadian-immigration/work-permits" className="text-neutral-300 hover:text-white transition-colors">
                    Work Permits
                  </Link>
                </li>
                <li>
                  <Link href="/canadian-immigration/study-permits" className="text-neutral-300 hover:text-white transition-colors">
                    Study Permits
                  </Link>
                </li>
                <li>
                  <Link href="/canadian-immigration/family-sponsorship" className="text-neutral-300 hover:text-white transition-colors">
                    Family Sponsorship
                  </Link>
                </li>
              </ul>
            </div>

            {/* US Immigration */}
            <div>
              <h3 className="font-semibold text-lg mb-6">US Immigration</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/us-immigration/green-cards" className="text-neutral-300 hover:text-white transition-colors">
                    Green Cards
                  </Link>
                </li>
                <li>
                  <Link href="/us-immigration/work-visas" className="text-neutral-300 hover:text-white transition-colors">
                    Work Visas
                  </Link>
                </li>
                <li>
                  <Link href="/us-immigration/family-immigration" className="text-neutral-300 hover:text-white transition-colors">
                    Family Immigration
                  </Link>
                </li>
                <li>
                  <Link href="/us-immigration/student-visas" className="text-neutral-300 hover:text-white transition-colors">
                    Student Visas
                  </Link>
                </li>
                <li>
                  <Link href="/us-immigration/citizenship" className="text-neutral-300 hover:text-white transition-colors">
                    Citizenship
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-3 mt-1 text-neutral-400" />
                  <div className="text-neutral-300 text-sm">
                    <p>123 Immigration Street</p>
                    <p>Toronto, ON M5V 3A8</p>
                    <p>Canada</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-3 text-neutral-400" />
                  <a href="tel:+1-416-555-0123" className="text-neutral-300 hover:text-white transition-colors text-sm">
                    +1 (416) 555-0123
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-3 text-neutral-400" />
                  <a href="mailto:info@visaplace.com" className="text-neutral-300 hover:text-white transition-colors text-sm">
                    info@visaplace.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-neutral-400 text-sm mb-4 md:mb-0">
              © 2024 VisaPlace. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-neutral-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-neutral-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-neutral-400 hover:text-white transition-colors text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 