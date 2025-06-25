
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
import { Label } from './ui/label';
import { Input } from './ui/input';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ActivationDialog() {
  const { isActivationDialogOpen, setActivationDialogOpen, login, planToPurchase, activatePlan, getPlanByName } = useUser();
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (!isActivationDialogOpen) {
      setEmail('');
    }
  }, [isActivationDialogOpen]);

  const handleActivation = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      login(email);
      // If a plan was selected before logging in, activate it now.
      if (planToPurchase) {
          const plan = getPlanByName(planToPurchase);
          if (plan) {
            activatePlan(planToPurchase, email);
             toast({
              title: `${plan.name} Plan Activated!`,
              description: `${plan.credits.toLocaleString()} credits have been added to your account.`,
            });
          }
      }
      setActivationDialogOpen(false);
    } else {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Dialog open={isActivationDialogOpen} onOpenChange={setActivationDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleActivation}>
          <DialogHeader>
            <DialogTitle>Activate Your Plan</DialogTitle>
            <DialogDescription>
              To activate your plan, enter the <strong>exact same email address</strong> you used at checkout.
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
                placeholder="your.email@example.com"
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
            <Button type="submit">Activate</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
