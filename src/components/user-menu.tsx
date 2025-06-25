
'use client';

import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUser } from '@/hooks/use-user-context';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { CreditCard, LogOut, User as UserIcon, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function UserMenu() {
  const { user, isLoggedIn, login, logout, getPlanByName } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      login(email);
      setIsDialogOpen(false);
      toast({
        title: 'Account Activated',
        description: 'Your plans and credits are now linked to this email.',
      });
    } else {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          Activate Plan
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleLogin}>
              <DialogHeader>
                <DialogTitle>Activate Your Plan</DialogTitle>
                <DialogDescription>
                  Enter the email address you used during purchase to activate your credits and plan features.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="col-span-3"
                    required
                  />
                </div>
                 <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground bg-slate-50 p-3 rounded-md border">
                    <AlertCircle className="w-8 h-8 flex-shrink-0 text-primary/50" />
                    <span>
                      After purchasing a plan, use this form to link your purchase to this browser session. Your plan is tied to your email.
                    </span>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Activate</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  const currentPlan = getPlanByName(user.plan);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentPlan?.name} Plan
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>{user.credits.toLocaleString()} Credits</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>{user.planExpiration ? `Expires: ${new Date(user.planExpiration).toLocaleDateString()}` : 'No Expiration'}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
