import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Github, Twitter, Linkedin, Brain, Target, Eye, Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-background via-muted to-background overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-network-pattern opacity-20" />
      
      <div className="relative z-10 container-padding py-16">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow-pink transition-all duration-300 overflow-hidden">
                    <Image
                      src="/logo.png"
                      alt="HALO Logo"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-br from-primary via-secondary to-accent bg-clip-text text-transparent">
                    HALO
                  </span>
                  <span className="text-xs text-muted-foreground font-medium -mt-1">
                    AI Innovation Incubator
                  </span>
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed max-w-md">
                Transforming business challenges into intelligent solutions through advanced AI expertise capture and knowledge management.
              </p>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Brain className="h-4 w-4 text-primary" />
                  <span>Expertise Capture</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4 text-secondary" />
                  <span>AI Solutions</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4 text-accent" />
                  <span>Innovation</span>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex items-center space-x-4">
                <Link href="#" className="p-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors group">
                  <Github className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                </Link>
                <Link href="#" className="p-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors group">
                  <Twitter className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                </Link>
                <Link href="#" className="p-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors group">
                  <Linkedin className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                </Link>
              </div>
            </div>

            {/* Methods */}
            <div className="space-y-6">
              <div>
                <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
                  Methods
                </Badge>
                <h3 className="text-lg font-semibold text-foreground mb-4">Expertise Capture</h3>
                <div className="space-y-3">
                  <Link href="/assessment?method=1" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors group">
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    <span>Narrative Storytelling</span>
                  </Link>
                  <Link href="/assessment?method=2" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors group">
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    <span>Targeted Questioning</span>
                  </Link>
                  <Link href="/assessment?method=3" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors group">
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    <span>Observational Simulation</span>
                  </Link>
                  <Link href="/assessment?method=4" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors group">
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    <span>Protocol Analysis</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Process */}
            <div className="space-y-6">
              <div>
                <Badge variant="outline" className="mb-4 border-secondary-500/30 text-secondary-400">
                  Process
                </Badge>
                <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
                <div className="space-y-3">
                  <Link href="/how-it-works/elicitation" className="flex items-center space-x-2 text-neutral-300 hover:text-secondary-400 transition-colors group">
                    <div className="w-2 h-2 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-full" />
                    <span>Knowledge Elicitation</span>
                  </Link>
                  <Link href="/how-it-works/capture" className="flex items-center space-x-2 text-neutral-300 hover:text-secondary-400 transition-colors group">
                    <div className="w-2 h-2 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-full" />
                    <span>Expertise Capture</span>
                  </Link>
                  <Link href="/how-it-works/analysis" className="flex items-center space-x-2 text-neutral-300 hover:text-secondary-400 transition-colors group">
                    <div className="w-2 h-2 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-full" />
                    <span>AI-Powered Analysis</span>
                  </Link>
                  <Link href="/how-it-works/organization" className="flex items-center space-x-2 text-neutral-300 hover:text-secondary-400 transition-colors group">
                    <div className="w-2 h-2 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-full" />
                    <span>Knowledge Organization</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-neutral-800">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="text-sm text-neutral-400">
                © 2024 HALO AI Innovation Incubator. All rights reserved.
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <Link href="/privacy" className="text-neutral-400 hover:text-primary-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-neutral-400 hover:text-primary-400 transition-colors">
                  Terms of Service
                </Link>
                <Link href="/contact" className="text-neutral-400 hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 