"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from "@/components/header";
import Footer from "@/components/footer";
import AssessmentChatbot from '@/components/assessment-chatbot';
import { CheckCircle, Brain, Target, Users, User, Building, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

interface UserInfo {
  name: string;
  domain: string;
  history: string;
}

export default function AssessmentPage() {
  const searchParams = useSearchParams();
  const method = searchParams.get('method') || '1';
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isFormComplete, setIsFormComplete] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    history: ''
  });

  const methodTitles = {
    '1': 'Narrative Storytelling Elicitation',
    '2': 'Targeted Questioning and Probing',
    '3': 'Observational Simulation and Shadowing',
    '4': 'Protocol Analysis and Think-Aloud'
  };

  const methodDescriptions = {
    '1': 'Share 3-5 detailed stories from your expertise journey to capture broad experiences and tacit insights.',
    '2': 'Answer focused questions to deepen insights and elicit granular, explicit knowledge.',
    '3': 'Walk through your processes step-by-step to capture workflows and behaviors.',
    '4': 'Think aloud about your decision-making process to uncover cognitive strategies.'
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.name && formData.domain && formData.history) {
      const userInfo = {
        name: formData.name.trim(),
        domain: formData.domain.trim(),
        history: formData.history.trim()
      };
      
      setUserInfo(userInfo);
      setIsFormComplete(true);
      
      // Store in session storage for use across the app
      sessionStorage.setItem('halo_user_info', JSON.stringify(userInfo));
      sessionStorage.setItem('halo_method', method);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Always reset session data on method change
  useEffect(() => {
    sessionStorage.removeItem('halo_user_info');
    sessionStorage.removeItem('halo_method');
    setUserInfo(null);
    setFormData({ name: '', domain: '', history: '' });
    setIsFormComplete(false);
  }, [method]);

  if (!isFormComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="relative min-h-[40vh] flex items-center">
          <div className="absolute inset-0">
            <Image
              src="/images/legal2.jpg"
              alt="Expert knowledge capture session"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-muted/70"></div>
          </div>
          
          <div className="relative z-10 container-padding w-full">
            <div className="max-w-4xl mx-auto text-center text-foreground">
              <div className="inline-flex items-center rounded-full bg-card/20 backdrop-blur-sm px-6 py-3 text-sm font-medium mb-6">
                <Brain className="mr-2 h-4 w-4" />
                Method {method} Setup
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
                Method {method}:
                <span className="block text-accent">{methodTitles[method as keyof typeof methodTitles]}</span>
              </h1>
              
              <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed text-muted-foreground">
                {methodDescriptions[method as keyof typeof methodDescriptions]}
              </p>
            </div>
          </div>
        </section>

        {/* User Info Form */}
        <section className="py-16 bg-gradient-to-br from-background via-muted/30 to-background relative">
          <div className="container-padding relative z-10">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-card/70 backdrop-blur-xl border border-border rounded-3xl shadow-2xl p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-card-foreground mb-4">
                    Tell Us About Yourself
                  </h2>
                  <p className="text-muted-foreground">
                    This information will help Spark personalize your expertise capture session.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div>
                    <label className="flex items-center text-sm font-medium text-muted-foreground mb-2">
                      <User className="h-4 w-4 mr-2" />
                      Your Name
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Tim"
                      required
                      className="text-lg py-3 bg-background border-border text-foreground placeholder-muted-foreground"
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-muted-foreground mb-2">
                      <Building className="h-4 w-4 mr-2" />
                      Your Domain/Field
                    </label>
                    <Input
                      type="text"
                      value={formData.domain}
                      onChange={(e) => handleInputChange('domain', e.target.value)}
                      placeholder="e.g., Advertising/Marketing, Software Engineering, Healthcare"
                      required
                      className="text-lg py-3 bg-background border-border text-foreground placeholder-muted-foreground"
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-muted-foreground mb-2">
                      <History className="h-4 w-4 mr-2" />
                      Key Background/History
                    </label>
                    <Input
                      type="text"
                      value={formData.history}
                      onChange={(e) => handleInputChange('history', e.target.value)}
                      placeholder="e.g., Working at Publicis, 10 years in tech startups"
                      required
                      className="text-lg py-3 bg-background border-border text-foreground placeholder-muted-foreground"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-lg py-4 mt-8"
                    disabled={!formData.name || !formData.domain || !formData.history}
                  >
                    Start Method {method} Session
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  // Show chat interface once form is complete
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Method Info */}
      <section className="relative min-h-[40vh] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/images/legal2.jpg"
            alt="Expert knowledge capture session"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-800/70"></div>
        </div>
        
        <div className="relative z-10 container-padding w-full">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-6 py-3 text-sm font-medium mb-6">
              <Brain className="mr-2 h-4 w-4" />
              Active Session - Method {method}
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              {userInfo?.name}'s Expertise Capture
              <span className="block text-amber-100">{methodTitles[method as keyof typeof methodTitles]}</span>
            </h1>
            
            <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed text-blue-100">
              {methodDescriptions[method as keyof typeof methodDescriptions]}
            </p>
            
            {/* User Info Display */}
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center">
                <User className="h-5 w-5 text-blue-400 mr-2" />
                <span>{userInfo?.name}</span>
              </div>
              <div className="flex items-center">
                <Building className="h-5 w-5 text-green-400 mr-2" />
                <span>{userInfo?.domain}</span>
              </div>
              <div className="flex items-center">
                <History className="h-5 w-5 text-amber-400 mr-2" />
                <span>{userInfo?.history}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900 relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="container-padding relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 rounded-3xl shadow-2xl p-8">
              <AssessmentChatbot method={method} userInfo={userInfo} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 