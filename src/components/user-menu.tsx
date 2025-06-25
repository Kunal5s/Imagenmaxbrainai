
'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUser } from '@/hooks/use-user-context';
import { CreditCard, LogOut, User as UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function UserMenu() {
  const { user, isLoggedIn, logout, getPlanByName, setActivationDialogOpen } = useUser();
  const { toast } = useToast();

  const handleActivateClick = () => {
    toast({
      title: 'Activate Your Purchase',
      description: "To unlock your credits, please enter the same email address you used during checkout. If you haven't purchased a plan yet, please visit our pricing page first.",
      duration: 9000,
    });
    setActivationDialogOpen(true);
  };

  if (!isLoggedIn) {
    return (
      <>
        <Button variant="outline" onClick={handleActivateClick} data-user-menu-trigger>
          Activate Plan
        </Button>
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
            <p className="text-sm font-medium leading-none truncate">{user.email}</p>
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
