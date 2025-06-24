import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Lora, Inter } from 'next/font/google';

const headlineFont = Lora({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-headline',
});

const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Imagen Max BrainAi',
  description: 'Next-Generation AI Image Generation Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${headlineFont.variable} ${bodyFont.variable} font-body bg-background text-foreground antialiased`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
