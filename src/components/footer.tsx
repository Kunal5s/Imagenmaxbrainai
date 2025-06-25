'use client';

import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 border-t mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="flex flex-col items-start gap-4">
            <Link href="/" className="flex items-center gap-2">
                <BrainCircuit className="w-8 h-8 text-primary" />
                <h1 className="text-xl font-bold text-foreground">Imagen Max BrainAi</h1>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              The future of AI-powered image generation, designed for creators, developers, and innovators.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold font-headline mb-4 text-foreground">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="text-sm text-muted-foreground hover:text-primary transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Imagen Max BrainAi. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
