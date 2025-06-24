import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Have questions, feedback, or need support? We'd love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Send us a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <Input type="text" placeholder="Your Name" className="bg-background" />
              <Input type="email" placeholder="Your Email" className="bg-background" />
              <Textarea placeholder="Your Message" className="min-h-[150px] bg-background" />
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-md">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Email</h3>
              <p className="text-muted-foreground">General Inquiries: <a href="mailto:contact@imagenmax.ai" className="hover:text-primary">contact@imagenmax.ai</a></p>
              <p className="text-muted-foreground">Support: <a href="mailto:support@imagenmax.ai" className="hover:text-primary">support@imagenmax.ai</a></p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-md">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Phone</h3>
              <p className="text-muted-foreground">Mon-Fri, 9am-5pm PST</p>
              <p className="text-muted-foreground">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-md">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
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
