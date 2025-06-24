import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl opacity-0 animate-fadeInUp">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Have questions, feedback, or need support? We'd love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-16 items-start">
        <div className="space-y-6">
            <h2 className="font-headline text-3xl font-bold">Send us a Message</h2>
            <form className="space-y-4">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" type="text" placeholder="Your Name" className="mt-1 bg-input" />
              </div>
               <div>
                <Label htmlFor="email">Your Email</Label>
                <Input id="email" type="email" placeholder="Your Email" className="mt-1 bg-input" />
              </div>
              <div>
                <Label htmlFor="message">Your Message</Label>
                <Textarea id="message" placeholder="Your Message" className="min-h-[150px] mt-1 bg-input" />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
        </div>

        <div className="space-y-8">
            <h2 className="font-headline text-3xl font-bold">Contact Information</h2>
            <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-foreground">Email</h3>
                  <p className="text-muted-foreground">General Inquiries: <a href="mailto:contact@imagenmax.ai" className="hover:text-primary">contact@imagenmax.ai</a></p>
                  <p className="text-muted-foreground">Support: <a href="mailto:support@imagenmax.ai" className="hover:text-primary">support@imagenmax.ai</a></p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-foreground">Phone</h3>
                  <p className="text-muted-foreground">Mon-Fri, 9am-5pm PST</p>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-foreground">Office</h3>
                  <p className="text-muted-foreground">123 AI Avenue, Tech City, 94105</p>
                  <p className="text-muted-foreground">United States</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
