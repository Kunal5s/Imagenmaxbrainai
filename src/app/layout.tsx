
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Inter, Lora } from 'next/font/google';
import { UserProvider } from '@/contexts/user-context';

const headlineFont = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-headline',
});

const bodyFont = Inter({
  subsets: ['latin'],
  display: 'swap',
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${headlineFont.variable} ${bodyFont.variable} font-body bg-background text-foreground antialiased`}>
        <UserProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
