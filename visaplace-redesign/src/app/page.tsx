import Header from "@/components/header";
import AIChatbot from "@/components/ai-chatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Users, Award, Globe, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-neutral-50 to-white">
        <div className="container-padding">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 shadow-soft mb-8">
              <span className="mr-2">🇨🇦</span>
              <span className="mr-2">🇺🇸</span>
              Trusted by 10,000+ clients worldwide
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
              Your Gateway to
              <span className="text-gradient block">Canadian & US Immigration</span>
            </h1>
            
            <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Expert immigration lawyers helping you navigate the complex world of visas, 
              work permits, and permanent residence with confidence.
            </p>
            
            {/* Country Selector */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="group" asChild>
                <Link href="/canadian-immigration">
                  <span className="mr-2">🇨🇦</span>
                  Canadian Immigration
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="group" asChild>
                <Link href="/us-immigration">
                  <span className="mr-2">🇺🇸</span>
                  US Immigration
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            
            {/* Quick Assessment CTA */}
            <div className="inline-flex items-center space-x-4">
              <Button size="lg" variant="ghost" asChild>
                <Link href="/assessment">
                  Take Free Assessment
                </Link>
              </Button>
              <span className="text-neutral-400">or</span>
              <Button size="lg" variant="ghost" asChild>
                <Link href="/consultation">
                  Book Consultation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 border-b border-neutral-100">
        <div className="container-padding">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">10,000+</div>
              <div className="text-sm text-neutral-600">Successful Cases</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">25+</div>
              <div className="text-sm text-neutral-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">98%</div>
              <div className="text-sm text-neutral-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-sm text-neutral-600">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Immigration Topics */}
      <section className="section-padding">
        <div className="container-padding">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
                Popular Immigration Pathways
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Explore the most common routes to Canadian and US immigration
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <Card key={index} className="card-minimal hover:shadow-soft-lg transition-smooth group cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{item.country}</span>
                      {item.popular && (
                        <Badge variant="secondary" className="bg-accent-50 text-accent-600 border-accent-200">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="group-hover:text-primary-600 transition-colors">
                      {item.title}
                    </CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={item.href} className="inline-flex items-center text-primary-600 font-medium group-hover:text-primary-700">
                      Learn More
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose VisaPlace */}
      <section className="section-padding bg-neutral-50">
        <div className="container-padding">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
                Why Choose VisaPlace?
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                We combine legal expertise with technology to deliver exceptional results
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Award className="h-8 w-8 text-primary-600" />,
                  title: "Expert Legal Team",
                  description: "Licensed immigration lawyers with decades of combined experience"
                },
                {
                  icon: <CheckCircle className="h-8 w-8 text-primary-600" />,
                  title: "Proven Success",
                  description: "98% success rate with thousands of successful immigration cases"
                },
                {
                  icon: <Globe className="h-8 w-8 text-primary-600" />,
                  title: "Global Reach",
                  description: "Serving clients from over 50 countries worldwide"
                },
                {
                  icon: <Users className="h-8 w-8 text-primary-600" />,
                  title: "Personalized Service",
                  description: "Dedicated case managers for every client journey"
                },
                {
                  icon: <MessageCircle className="h-8 w-8 text-primary-600" />,
                  title: "24/7 Support",
                  description: "Round-the-clock assistance when you need it most"
                },
                {
                  icon: <ArrowRight className="h-8 w-8 text-primary-600" />,
                  title: "Fast Processing",
                  description: "Streamlined processes to minimize wait times"
                }
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Ready to Start Your Immigration Journey?
            </h2>
            <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
              Get your free assessment today and discover your best immigration options
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/assessment">
                  Get Free Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/consultation">
                  Book Consultation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}
