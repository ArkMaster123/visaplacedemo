"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Menu, X, ChevronDown, Sparkles, Zap, Brain, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    {
      title: "Expertise Methods",
      href: "/",
      description: "Choose your knowledge capture approach",
      items: [
        { 
          title: "Multi-Agent System", 
          href: "/multi-agent",
          description: "Advanced AI agents working together",
          icon: Sparkles,
          color: "text-purple-400"
        },
        { 
          title: "Method 1: Narrative Storytelling", 
          href: "/assessment?method=1",
          description: "Share detailed stories from your experience",
          icon: Brain,
          color: "text-blue-400"
        },
        { 
          title: "Method 2: Targeted Questioning", 
          href: "/assessment?method=2",
          description: "Answer focused questions to deepen insights",
          icon: Target,
          color: "text-green-400"
        },
        { 
          title: "Method 3: Observational Simulation", 
          href: "/assessment?method=3",
          description: "Walk through your processes step-by-step",
          icon: Zap,
          color: "text-purple-400"
        },
        { 
          title: "Method 4: Protocol Analysis", 
          href: "/assessment?method=4",
          description: "Think aloud about your decision-making",
          icon: Brain,
          color: "text-amber-400"
        },
      ]
    },
    {
      title: "How It Works",
      href: "/how-it-works",
      description: "Learn about our expertise capture process",
      items: [
        { title: "Knowledge Elicitation", href: "/how-it-works/elicitation" },
        { title: "Expertise Capture", href: "/how-it-works/capture" },
        { title: "AI-Powered Analysis", href: "/how-it-works/analysis" },
        { title: "Knowledge Organization", href: "/how-it-works/organization" },
      ]
    },
    {
      title: "About",
      href: "/about",
      description: "Discover our mission and technology",
      items: [
        { title: "Our Mission", href: "/about/mission" },
        { title: "Technology", href: "/about/technology" },
        { title: "Team", href: "/about/team" },
        { title: "Research", href: "/about/research" },
      ]
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container-padding">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 flex-shrink-0 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow-pink transition-all duration-300 group-hover:scale-105 overflow-hidden">
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
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuTrigger className="text-foreground hover:text-primary transition-colors">
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {item.items.map((subItem) => {
                          const IconComponent = subItem.icon;
                          return (
                            <li key={subItem.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={subItem.href}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground"
                                >
                                  <div className="flex items-center space-x-2">
                                    {IconComponent && (
                                      <IconComponent className={`h-4 w-4 ${subItem.color || 'text-primary'}`} />
                                    )}
                                    <div className="text-sm font-medium leading-none text-foreground">
                                      {subItem.title}
                                    </div>
                                  </div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                    {subItem.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          );
                        })}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="outline" className="border-border text-foreground hover:bg-muted">
              Sign In
            </Button>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-foreground hover:bg-muted"
                onClick={() => setIsOpen(!isOpen)}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-background border-border">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <Link href="/" className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary via-secondary to-accent rounded-lg flex items-center justify-center">
                      <Image
                        src="/logo.png"
                        alt="HALO Logo"
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-br from-primary via-secondary to-accent bg-clip-text text-transparent">
                      HALO
                    </span>
                  </Link>
                </div>

                <nav className="flex-1 space-y-6">
                  {navigationItems.map((item) => (
                    <div key={item.title} className="space-y-2">
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <div className="space-y-1">
                        {item.items.map((subItem) => {
                          const IconComponent = subItem.icon;
                          return (
                            <Link
                              key={subItem.title}
                              href={subItem.href}
                              className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                            >
                              {IconComponent && (
                                <IconComponent className={`h-4 w-4 ${subItem.color || 'text-primary'}`} />
                              )}
                              <span>{subItem.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>

                <div className="space-y-4 pt-6 border-t border-border">
                  <ThemeToggle />
                  <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted">
                    Sign In
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground">
                    Get Started
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header; 