"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import AIChatbot from "@/components/ai-chatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Users, Award, Globe, MessageCircle, Star, Clock, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);
  const counterRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  React.useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  return (
    <div ref={counterRef} className="text-4xl font-bold text-blue-800 mb-2">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/images/legal3.jpg"
            alt="Immigration lawyer helping clients"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 container-padding w-full">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-6 py-3 text-sm font-medium mb-8">
              <span className="mr-2">🇨🇦</span>
              <span className="mr-2">🇺🇸</span>
              Trusted by 10,000+ clients worldwide
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Get Personalized Help from
              <span className="block text-amber-100">Top Immigration Lawyers</span>
            </h1>
            
            <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Select your destination and start your quiz qualifier now.
            </p>
            
            {/* Country Selector */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                <div className="text-4xl mb-2">🇨🇦</div>
                <h3 className="text-xl font-semibold mb-2">Canada</h3>
                <p className="text-sm text-white/80">Express Entry, Work Permits, Family Sponsorship</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                <div className="text-4xl mb-2">🇺🇸</div>
                <h3 className="text-xl font-semibold mb-2">United States of America</h3>
                <p className="text-sm text-white/80">Green Cards, Work Visas, Family Immigration</p>
              </div>
            </div>
            
            {/* Main CTA */}
            <div className="mb-8">
              <Button size="lg" className="bg-blue-800 hover:bg-blue-900 text-white text-lg px-12 py-4 rounded-full" asChild>
                <Link href="/assessment">
                  Begin with an Immigration Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">Understand your options and the next steps</p>
              <p className="text-base text-white/90">Find the right lawyer for Canada and US Immigration</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-slate-50">
        <div className="container-padding">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <AnimatedCounter end={10000} suffix="+" />
              <div className="text-slate-600">Successful Cases</div>
            </div>
            <div>
              <AnimatedCounter end={25} suffix="+" />
              <div className="text-slate-600">Years Experience</div>
            </div>
            <div>
              <AnimatedCounter end={98} suffix="%" />
              <div className="text-slate-600">Success Rate</div>
            </div>
            <div>
              <AnimatedCounter end={50} suffix="+" />
              <div className="text-slate-600">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Immigration Pathways */}
      <section className="py-16 bg-white">
        <div className="container-padding">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Popular Immigration Pathways
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Explore the most common routes to Canadian and US immigration
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Express Entry",
                  description: "Fast-track to Canadian permanent residence",
                  country: "🇨🇦",
                  href: "/canadian-immigration/express-entry",
                  popular: true
                },
                {
                  title: "Work Permits",
                  description: "Temporary work authorization for Canada",
                  country: "🇨🇦",
                  href: "/canadian-immigration/work-permits"
                },
                {
                  title: "Green Card",
                  description: "US permanent residence pathways",
                  country: "🇺🇸",
                  href: "/us-immigration/green-cards",
                  popular: true
                },
                {
                  title: "Family Sponsorship",
                  description: "Reunite with family in Canada or US",
                  country: "🇨🇦🇺🇸",
                  href: "/services/family-sponsorship"
                },
                {
                  title: "Study Permits",
                  description: "Education pathways to immigration",
                  country: "🇨🇦🇺🇸",
                  href: "/services/study-permits"
                },
                {
                  title: "Business Immigration",
                  description: "Investor and entrepreneur programs",
                  country: "🇨🇦🇺🇸",
                  href: "/services/business-immigration"
                }
              ].map((item, index) => (
                <Card key={index} className="border-slate-200 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{item.country}</span>
                      {item.popular && (
                        <Badge className="bg-red-600 text-white">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl group-hover:text-blue-800 transition-colors">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-base text-slate-600">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={item.href} className="inline-flex items-center text-blue-800 font-semibold text-base group-hover:text-blue-900">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose VisaPlace */}
      <section className="py-16 bg-slate-50">
        <div className="container-padding">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Why Choose VisaPlace?
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                We combine legal expertise with technology to deliver exceptional results
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Award className="h-10 w-10 text-amber-500" />,
                  title: "Expert Legal Team",
                  description: "Licensed immigration lawyers with decades of combined experience"
                },
                {
                  icon: <CheckCircle className="h-10 w-10 text-green-600" />,
                  title: "Proven Success",
                  description: "98% success rate with thousands of successful immigration cases"
                },
                {
                  icon: <Globe className="h-10 w-10 text-blue-600" />,
                  title: "Global Reach",
                  description: "Serving clients from over 50 countries worldwide"
                },
                {
                  icon: <Users className="h-10 w-10 text-blue-800" />,
                  title: "Personalized Service",
                  description: "Dedicated case managers for every client journey"
                },
                {
                  icon: <MessageCircle className="h-10 w-10 text-blue-600" />,
                  title: "24/7 Support",
                  description: "Round-the-clock assistance when you need it most"
                },
                {
                  icon: <Clock className="h-10 w-10 text-amber-500" />,
                  title: "Fast Processing",
                  description: "Streamlined processes to minimize wait times"
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl text-center hover:shadow-lg transition-shadow border border-slate-200">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-base">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-800 to-blue-900 text-white">
        <div className="container-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Start Your Immigration Journey?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
              Get your personalized assessment today and discover your best immigration options with our expert legal team
            </p>
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white text-lg px-12 py-4 rounded-full" asChild>
              <Link href="/assessment">
                Start Your Assessment Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <div className="mt-8 text-center">
              <p className="text-blue-100 text-sm">
                ✓ Free consultation ✓ Expert guidance ✓ Personalized results
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}
