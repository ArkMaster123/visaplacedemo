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
      title: "Canadian Immigration",
      href: "/canadian-immigration",
      items: [
        { title: "Express Entry", href: "/canadian-immigration/express-entry" },
        { title: "Provincial Nominee Program", href: "/canadian-immigration/pnp" },
        { title: "Family Sponsorship", href: "/canadian-immigration/family-sponsorship" },
        { title: "Work Permits", href: "/canadian-immigration/work-permits" },
        { title: "Study Permits", href: "/canadian-immigration/study-permits" },
      ]
    },
    {
      title: "US Immigration",
      href: "/us-immigration",
      items: [
        { title: "Green Cards", href: "/us-immigration/green-cards" },
        { title: "Work Visas", href: "/us-immigration/work-visas" },
        { title: "Family Immigration", href: "/us-immigration/family-immigration" },
        { title: "Student Visas", href: "/us-immigration/student-visas" },
        { title: "Citizenship", href: "/us-immigration/citizenship" },
      ]
    },
    {
      title: "Services",
      href: "/services",
      items: [
        { title: "Visa Consult", href: "/services/visa-consult" },
        { title: "Visa Premier", href: "/services/visa-premier" },
        { title: "Corporate Services", href: "/services/corporate" },
        { title: "Assessment Tools", href: "/services/assessment" },
      ]
    },
    {
      title: "Resources",
      href: "/resources",
      items: [
        { title: "Immigration News", href: "/resources/news" },
        { title: "Blog", href: "/resources/blog" },
        { title: "Country Guides", href: "/resources/guides" },
        { title: "FAQs", href: "/resources/faqs" },
      ]
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/50 bg-white/80 backdrop-blur-xl">
      <div className="container-padding">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="/images/visaplace-logo-simple.svg" 
              alt="VisaPlace - Immigration Starts Here" 
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuTrigger className="h-auto p-0 font-medium text-neutral-700 hover:text-primary-600 data-[active]:text-primary-600 data-[state=open]:text-primary-600">
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4">
                      {item.items.map((subItem) => (
                        <NavigationMenuLink key={subItem.title} asChild>
                          <Link
                            href={subItem.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-neutral-50 hover:text-primary-600 focus:bg-neutral-50 focus:text-primary-600"
                          >
                            <div className="text-sm font-medium leading-none">{subItem.title}</div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/about" className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:text-primary-600 focus:text-primary-600 focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    About
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/assessment">Free Assessment</Link>
            </Button>
            <Button asChild>
              <Link href="/consultation">Book Consultation</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navigationItems.map((item) => (
                  <div key={item.title} className="space-y-2">
                    <h3 className="font-semibold text-primary-600">{item.title}</h3>
                    <div className="ml-4 space-y-2">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          className="block text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <Link
                  href="/about"
                  className="font-semibold text-primary-600"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
                <div className="pt-4 space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/assessment" onClick={() => setIsOpen(false)}>
                      Free Assessment
                    </Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/consultation" onClick={() => setIsOpen(false)}>
                      Book Consultation
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