'use client';

import Link from 'next/link';
import { BrainCircuit, Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Generate Image' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/pricing', label: 'Pricing' },
];

export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="py-4 px-4 md:px-8 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-20">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setIsSheetOpen(false)}>
          <BrainCircuit className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-headline font-bold text-foreground">
            Imagen Max <span className="text-primary">BrainAi</span>
          </h1>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-bold">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>
                  Navigation Menu
                </SheetTitle>
                <SheetDescription className="sr-only">A list of links to navigate the website.</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-6 pt-8 text-lg font-bold">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
