import Link from "next/link";
import { Brain, Mail, Phone, MapPin, Target, Eye, Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container-padding">
        <div className="py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  HALO
                </span>
              </div>
              <p className="text-neutral-300 mb-6 leading-relaxed">
                Organizing human expertise for the AI age. Advanced knowledge capture and elicitation powered by intelligent conversation.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center text-neutral-300">
                  <Brain className="h-4 w-4 mr-2" />
                  <span className="text-sm">AI-Powered Expertise Capture</span>
                </div>
              </div>
            </div>

            {/* Expertise Methods */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Capture Methods</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/assessment?method=1" className="text-neutral-300 hover:text-white transition-colors flex items-center">
                    <Brain className="h-4 w-4 mr-2" />
                    Narrative Storytelling
                  </Link>
                </li>
                <li>
                  <Link href="/assessment?method=2" className="text-neutral-300 hover:text-white transition-colors flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    Targeted Questioning
                  </Link>
                </li>
                <li>
                  <Link href="/assessment?method=3" className="text-neutral-300 hover:text-white transition-colors flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    Observational Simulation
                  </Link>
                </li>
                <li>
                  <Link href="/assessment?method=4" className="text-neutral-300 hover:text-white transition-colors flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Protocol Analysis
                  </Link>
                </li>
              </ul>
            </div>

            {/* How It Works */}
            <div>
              <h3 className="font-semibold text-lg mb-6">How It Works</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/how-it-works/elicitation" className="text-neutral-300 hover:text-white transition-colors">
                    Knowledge Elicitation
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works/capture" className="text-neutral-300 hover:text-white transition-colors">
                    Expertise Capture
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works/analysis" className="text-neutral-300 hover:text-white transition-colors">
                    AI-Powered Analysis
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works/organization" className="text-neutral-300 hover:text-white transition-colors">
                    Knowledge Organization
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-neutral-300 hover:text-white transition-colors">
                    About HALO
                  </Link>
                </li>
                <li>
                  <Link href="/about/technology" className="text-neutral-300 hover:text-white transition-colors">
                    Technology
                  </Link>
                </li>
                <li>
                  <Link href="/about/research" className="text-neutral-300 hover:text-white transition-colors">
                    Research
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-neutral-300 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-neutral-400 text-sm">
              © 2024 HALO by Mega Lab. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-neutral-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-neutral-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-neutral-400 hover:text-white transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 