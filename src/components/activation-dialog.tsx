
'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user-context';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ActivationDialog() {
  const { isActivationDialogOpen, setActivationDialogOpen, login, planToPurchase, activatePlan } = useUser();
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (!isActivationDialogOpen) {
      setEmail('');
    }
  }, [isActivationDialogOpen]);

  const handleActivation = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
       toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    const allowedDomains = ['gmail.com', 'yahoo.com'];
    const emailDomain = email.split('@')[1];
    if (!allowedDomains.includes(emailDomain?.toLowerCase())) {
      toast({
        title: 'Unsupported Email Provider',
        description: 'For security and to prevent abuse, please use a Gmail or Yahoo account.',
        variant: 'destructive',
        duration: 9000,
      });
      return;
    }


    if (planToPurchase) {
      activatePlan(planToPurchase, email);
    } else {
      login(email);
      setActivationDialogOpen(false);
      toast({
        title: 'Logged In',
        description: 'Your account has been loaded successfully.',
      });
    }
  };
  
  return (
    <Dialog open={isActivationDialogOpen} onOpenChange={setActivationDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleActivation}>
          <DialogHeader>
            <DialogTitle>{planToPurchase ? `Activate ${planToPurchase}` : 'Access Your Account'}</DialogTitle>
            <DialogDescription>
              To activate your purchase or access your account, enter the <strong>exact same email address</strong> you used at checkout. Only Gmail and Yahoo accounts are supported.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email-activate" className="text-right">
                Email
              </Label>
              <Input
                id="email-activate"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                className="col-span-3"
                required
              />
            </div>
             <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground bg-accent p-3 rounded-md border">
                <AlertCircle className="w-12 h-12 flex-shrink-0 text-primary/50" />
                <span>
                  It is crucial to use the same email you provided during payment. Your plan and credits are permanently tied to that email address and cannot be transferred.
                </span>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Activate &amp; Login</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
