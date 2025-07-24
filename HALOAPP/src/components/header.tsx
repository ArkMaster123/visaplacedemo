"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    {
      title: "Expertise Methods",
      href: "/",
      items: [
        { title: "Method 1: Narrative Storytelling", href: "/assessment?method=1" },
        { title: "Method 2: Targeted Questioning", href: "/assessment?method=2" },
        { title: "Method 3: Observational Simulation", href: "/assessment?method=3" },
        { title: "Method 4: Protocol Analysis", href: "/assessment?method=4" },
      ]
    },
    {
      title: "How It Works",
      href: "/how-it-works",
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
      items: [
        { title: "Our Mission", href: "/about/mission" },
        { title: "Technology", href: "/about/technology" },
        { title: "Team", href: "/about/team" },
        { title: "Research", href: "/about/research" },
      ]
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/50 bg-white/80 backdrop-blur-xl">
      <div className="container-padding">
        <div className="flex h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HALO
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex flex-1 justify-center">
            <NavigationMenu>
              <NavigationMenuList className="space-x-8">
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuTrigger className="h-auto p-0 font-medium text-neutral-700 hover:text-blue-800 data-[active]:text-blue-800 data-[state=open]:text-blue-800">
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[400px] gap-3 p-4">
                        {item.items.map((subItem) => (
                          <NavigationMenuLink key={subItem.title} asChild>
                            <Link
                              href={subItem.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-neutral-50 hover:text-blue-800 focus:bg-neutral-50 focus:text-blue-800"
                            >
                              <div className="text-sm font-medium leading-none">{subItem.title}</div>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* CTA Buttons - Right aligned */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            <Button variant="ghost" className="text-neutral-700 hover:text-blue-800" asChild>
              <Link href="/">Start Capture</Link>
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden ml-auto">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navigationItems.map((item) => (
                  <div key={item.title} className="space-y-2">
                    <h3 className="font-semibold text-blue-800">{item.title}</h3>
                    <div className="ml-4 space-y-2">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          className="block text-sm text-neutral-600 hover:text-blue-800 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="pt-4 space-y-2">
                  <Button variant="outline" className="w-full border-blue-800 text-blue-800 hover:bg-blue-50" asChild>
                    <Link href="/" onClick={() => setIsOpen(false)}>
                      Start Capture
                    </Link>
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                    <Link href="/contact" onClick={() => setIsOpen(false)}>
                      Contact Us
                    </Link>
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