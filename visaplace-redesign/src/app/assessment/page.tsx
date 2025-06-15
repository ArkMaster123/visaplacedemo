"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import AssessmentChatbot from '@/components/assessment-chatbot';
import { ArrowLeft, CheckCircle, Brain, Target, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function AssessmentPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section with Background */}
      <section className="relative min-h-[40vh] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/images/legal2.jpg"
            alt="Immigration assessment consultation"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-800/70"></div>
        </div>
        
        <div className="relative z-10 container-padding w-full">
          <div className="max-w-4xl mx-auto text-center text-white">
            {/* Back Button */}
            <div className="flex justify-start mb-6">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/20 backdrop-blur-sm border border-white/20" 
                asChild
              >
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
            
            <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-6 py-3 text-sm font-medium mb-6">
              <Brain className="mr-2 h-4 w-4" />
              AI-Powered Assessment
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              Your Personalized
              <span className="block text-amber-100">Immigration Assessment</span>
            </h1>
            
            <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed text-blue-100">
              Get expert guidance for your Canadian or US immigration journey. 
              Our AI assistant will analyze your situation and provide personalized recommendations.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <span>Free Assessment</span>
              </div>
              <div className="flex items-center">
                <Target className="h-5 w-5 text-blue-400 mr-2" />
                <span>Personalized Results</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-amber-400 mr-2" />
                <span>Expert Guidance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="container-padding relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Assessment Card with Glass Morphism */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
              <AssessmentChatbot />
            </div>
            
            {/* Benefits Section */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100/80 backdrop-blur-sm mb-4">
                  <Brain className="h-8 w-8 text-blue-800" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  AI-Powered Analysis
                </h3>
                <p className="text-slate-600">
                  Our advanced AI analyzes your responses to provide personalized immigration guidance
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100/80 backdrop-blur-sm mb-4">
                  <Target className="h-8 w-8 text-green-800" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Tailored Recommendations
                </h3>
                <p className="text-slate-600">
                  Get specific pathway recommendations based on your unique situation and goals
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100/80 backdrop-blur-sm mb-4">
                  <Users className="h-8 w-8 text-amber-800" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Expert Connection
                </h3>
                <p className="text-slate-600">
                  Connect directly with our immigration lawyers for detailed consultation
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 