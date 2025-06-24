'use client';

import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';

export default function Header() {
  return (
    <header className="py-4 px-4 md:px-8 border-b border-border/20 sticky top-0 bg-background/80 backdrop-blur-sm z-20">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BrainCircuit className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-headline font-bold text-foreground">
            Imagen Max <span className="text-primary">BrainAi</span>
          </h1>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
