
'use client';

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { add, isPast } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export interface Plan {
  name: 'Free' | 'Pro' | 'Mega' | 'Booster Pack';
  price: string;
  priceSuffix: string;
  description: string;
  features: string[];
  credits: number;
  costPerGeneration: number; // This will be the cost per click (which generates 4 images)
  durationDays?: number;
  polarLink: string | null;
  buttonText: string;
}

export interface User {
  email: string | null;
  plan: Plan['name'];
  credits: number;
  planExpiration: string | null;
  lastCreditReset?: string | null; // YYYY-MM-DD
}

interface UserContextType {
  user: User;
  plans: Plan[];
  login: (email: string) => void;
  logout: () => void;
  activatePlan: (planName: Plan['name'], emailOverride?: string) => void;
  deductCredits: () => void;
  isLoggedIn: boolean;
  getPlanByName: (planName: Plan['name']) => Plan | undefined;
  isActivationDialogOpen: boolean;
  setActivationDialogOpen: (isOpen: boolean) => void;
  planToPurchase: Plan['name'] | null;
}

const defaultUser: User = {
  email: null,
  plan: 'Free',
  credits: 10,
  planExpiration: null,
  lastCreditReset: null,
};

// Updated plans as per user request
export const plans: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    priceSuffix: '',
    description: 'For starters and hobbyists.',
    features: [
      '10 free credits (renews daily)',
      'Standard Quality (1080p)',
      'Access to all models',
      'Personal use license',
    ],
    credits: 10,
    costPerGeneration: 2, // 2 credits per generation (4 images)
    polarLink: null,
    buttonText: 'Start Generating',
  },
  {
    name: 'Pro',
    price: '$50',
    priceSuffix: '/ month',
    description: 'For professionals and creators.',
    features: [
      '3,000 credits per month',
      'Fast generation speed',
      '4K Ultra-High Quality',
      'Access to all AI models',
      'Commercial use license',
      'Credits expire after 30 days',
    ],
    credits: 3000,
    costPerGeneration: 30, // 30 credits per generation (4 images)
    durationDays: 30,
    polarLink: 'https://buy.polar.sh/polar_cl_iQpYIoo3qkW310DMOKN5lXhQo70OHOiLLU5Fp0eZ49f',
    buttonText: 'Upgrade to Pro',
  },
  {
    name: 'Mega',
    price: '$100',
    priceSuffix: '/ month',
    description: 'For power users and teams.',
    features: [
      '10,000 credits per month',
      'Lightning-fast speed',
      '4K Ultra-High Quality',
      'Access to all AI models',
      'Team collaboration features',
      'Credits expire after 30 days',
    ],
    credits: 10000,
    costPerGeneration: 60, // 60 credits per generation (4 images)
    durationDays: 30,
    polarLink: 'https://buy.polar.sh/polar_cl_xkFeAW6Ib01eE9ya6C6jRJVdkpSmHIb9xMnXL0trOi7',
    buttonText: 'Upgrade to Mega',
  },
  {
    name: 'Booster Pack',
    price: '$20',
    priceSuffix: 'one-time',
    description: 'Add-on credit top-up.',
    features: [
      '1,000 credits',
      'Immediately fast generation',
      'Can be added to any plan',
      'Credits expire after 30 days',
    ],
    credits: 1000,
    costPerGeneration: 40, // 40 credits per generation (4 images)
    durationDays: 30,
    polarLink: 'https://buy.polar.sh/polar_cl_u5vpk1YGAidaW5Lf7PXbDiWqo7jDVyWlv1v0o3G0NAh',
    buttonText: 'Buy Credits',
  },
];


export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isActivationDialogOpen, setActivationDialogOpen] = useState(false);
  const [planToPurchase, setPlanToPurchase] = useState<Plan['name'] | null>(null);
  const { toast } = useToast();

  const getUserStorageKey = (email: string) => `userState_${email}`;

  const getPlanByName = useCallback((planName: Plan['name']) => {
    return plans.find(p => p.name === planName);
  }, []);

  const loadUser = useCallback((email: string | null) => {
    const today = new Date().toISOString().split('T')[0];

    if (!email) {
      const sessionUserStr = localStorage.getItem('sessionUser');
      if (sessionUserStr) {
        const sessionUser: User = JSON.parse(sessionUserStr);
        if (sessionUser.lastCreditReset !== today) {
          sessionUser.credits = 10;
          sessionUser.lastCreditReset = today;
        }
        setUser(sessionUser);
      } else {
        setUser({ ...defaultUser, lastCreditReset: today });
      }
      return;
    }

    try {
      const storedUserStr = localStorage.getItem(getUserStorageKey(email));
      if (storedUserStr) {
        let storedUser: User = JSON.parse(storedUserStr);
        if (storedUser.plan !== 'Free' && storedUser.planExpiration && isPast(new Date(storedUser.planExpiration))) {
            toast({
                title: 'Plan Expired',
                description: `Your ${storedUser.plan} plan has expired. You are now on the Free plan.`,
                variant: 'destructive',
            });
            storedUser = { ...defaultUser, email, lastCreditReset: today };
        } else if (storedUser.plan === 'Free' && storedUser.lastCreditReset !== today) {
            storedUser.credits = 10;
            storedUser.lastCreditReset = today;
        }
        setUser(storedUser);
      } else {
        setUser({ ...defaultUser, email, lastCreditReset: today });
      }
    } catch (error) {
      console.error("Failed to load user state from localStorage", error);
      setUser({ ...defaultUser, email, lastCreditReset: today });
    }
  }, [toast]);
  
  useEffect(() => {
    const lastEmail = localStorage.getItem('lastUserEmail');
    loadUser(lastEmail);
    setIsInitialized(true);
  }, [loadUser]);

  useEffect(() => {
    if (isInitialized) {
      try {
        if (user.email) {
          localStorage.setItem(getUserStorageKey(user.email), JSON.stringify(user));
          localStorage.setItem('lastUserEmail', user.email);
          localStorage.removeItem('sessionUser');
        } else {
          localStorage.setItem('sessionUser', JSON.stringify(user));
          localStorage.removeItem('lastUserEmail');
        }
      } catch (error) {
        console.error("Could not save user state to localStorage", error);
      }
    }
  }, [user, isInitialized]);

  const login = useCallback((email: string) => {
    loadUser(email);
  }, [loadUser]);

  const activatePlan = useCallback((planName: Plan['name'], emailOverride?: string) => {
    const plan = getPlanByName(planName);
    if (!plan || plan.name === 'Free') return;

    if (emailOverride) {
      const targetEmail = emailOverride;
      
      const storageKey = getUserStorageKey(targetEmail);
      const storedUserStr = localStorage.getItem(storageKey);
      let currentUserState: User = { ...defaultUser, email: targetEmail };
      if (storedUserStr) {
          try {
              currentUserState = { ...currentUserState, ...JSON.parse(storedUserStr) };
          } catch(e) {
              console.error("Failed to parse user data, starting fresh.", e);
          }
      }

      if (currentUserState.plan !== 'Free' && currentUserState.planExpiration && isPast(new Date(currentUserState.planExpiration))) {
          currentUserState = { ...defaultUser, email: targetEmail, lastCreditReset: new Date().toISOString().split('T')[0] };
          toast({
              title: 'Previous Plan Expired',
              description: `Resetting to a Free plan before applying new purchase.`,
          });
      }

      const newCredits = currentUserState.credits + plan.credits;
      const newExpiration = add(new Date(), { days: plan.durationDays || 30 }).toISOString();
      
      let newPlanName = currentUserState.plan;
      if (plan.name === 'Pro' || plan.name === 'Mega') {
          newPlanName = plan.name;
      }

      const updatedUser: User = {
          ...currentUserState,
          email: targetEmail,
          plan: newPlanName,
          credits: newCredits,
          planExpiration: newExpiration,
      };
      
      localStorage.setItem(storageKey, JSON.stringify(updatedUser));
      
      login(targetEmail);

      setPlanToPurchase(null);
      setActivationDialogOpen(false);

      toast({
        title: `${plan.name} Activated!`,
        description: `${plan.credits.toLocaleString()} credits have been added to your account.`,
      });
    } else {
      setPlanToPurchase(planName);
      setActivationDialogOpen(true);
      toast({
          title: 'Activate Your Purchase',
          description: "After checkout, enter the exact email you used to pay to activate your plan.",
          duration: 9000,
      });
    }
  }, [getPlanByName, toast, login]);

  const logout = useCallback(() => {
    if (user.email) {
       localStorage.removeItem('lastUserEmail');
       const today = new Date().toISOString().split('T')[0];
       setUser({ ...defaultUser, lastCreditReset: today });
    }
  }, [user.email]);
  
  const deductCredits = useCallback(() => {
      const plan = getPlanByName(user.plan);
      const cost = plan?.costPerGeneration ?? 2;

      if (user.credits >= cost) {
          setUser(prev => ({ ...prev, credits: prev.credits - cost }));
      } else {
          console.error("Insufficient credits");
          toast({
            title: 'Out of Credits',
            description: 'You do not have enough credits. Please purchase a new plan or booster pack.',
            variant: 'destructive',
          });
          throw new Error("Insufficient credits");
      }
  }, [user.credits, user.plan, getPlanByName, toast]);

  const value = {
    user,
    plans,
    login,
    logout,
    activatePlan,
    deductCredits,
    isLoggedIn: !!user.email,
    getPlanByName,
    isActivationDialogOpen,
    setActivationDialogOpen,
    planToPurchase,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
