import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

interface InfoSection {
  title: string;
  items: string[];
}

interface InfoPageProps {
  title: string;
  subtitle?: string;
  description: string;
  icon?: React.ReactNode;
  image?: string;
  sections?: InfoSection[];
  children?: React.ReactNode;
}

export default function InfoPage({ title, subtitle, description, icon, image, sections, children }: InfoPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <Card className="w-full mx-auto p-8 rounded-3xl shadow-xl border border-border bg-card/90 mb-8">
          <div className="flex flex-col items-center text-center">
            {icon && <div className="mb-4 text-primary">{icon}</div>}
            {image && (
              <div className="mb-6">
                <Image src={image} alt={title} width={120} height={120} className="rounded-xl object-cover" />
              </div>
            )}
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">{title}</h1>
            {subtitle && <h2 className="text-xl font-medium text-muted-foreground mb-4">{subtitle}</h2>}
            <p className="text-muted-foreground text-lg mb-6 max-w-2xl leading-relaxed">{description}</p>
          </div>
        </Card>

        {/* FAQ Sections */}
        {sections && sections.length > 0 && (
          <div className="space-y-6">
            {sections.map((section, index) => (
              <Card key={index} className="p-6 rounded-2xl shadow-lg border border-border bg-card/90">
                <h3 className="text-2xl font-semibold text-card-foreground mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        )}

        {children}
      </div>
    </div>
  );
} 