
'use client';

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { add, isPast } from 'date-fns';

export interface Plan {
  name: 'Free' | 'Pro' | 'Mega' | 'Booster Pack';
  price: string;
  priceSuffix: string;
  description: string;
  features: string[];
  credits: number;
  costPerGeneration: number;
  durationDays?: number;
  polarLink: string | null;
  buttonText: string;
}

export interface User {
  email: string | null;
  plan: Plan['name'];
  credits: number;
  planExpiration: string | null;
  freeGenerationUsed: boolean;
}

interface UserContextType {
  user: User;
  plans: Plan[];
  login: (email: string) => void;
  logout: () => void;
  activatePlan: (planName: Plan['name']) => void;
  deductCredits: (amount: number) => void;
  isLoggedIn: boolean;
  getPlanByName: (planName: Plan['name']) => Plan | undefined;
}

const defaultUser: User = {
  email: null,
  plan: 'Free',
  credits: 0,
  planExpiration: null,
  freeGenerationUsed: false,
};

export const plans: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    priceSuffix: '',
    description: 'For starters and hobbyists.',
    features: [
      '1 free image generation (4 images)',
      'Standard Quality (1080p)',
      'Personal use license',
    ],
    credits: 0,
    costPerGeneration: 0,
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
      'Cost: 10 credits / generation',
      '4K Ultra-High Quality',
      'Commercial use license',
      'Credits expire after 30 days',
    ],
    credits: 3000,
    costPerGeneration: 10,
    durationDays: 30,
    polarLink: 'https://buy.polar.sh/polar_cl_iQpYIoo3qkW310DMOKN5lXhQo70OHOiLLU5Fp0eZ49f',
    buttonText: 'Switch to Pro',
  },
  {
    name: 'Mega',
    price: '$100',
    priceSuffix: '/ month',
    description: 'For power users and teams.',
    features: [
      '10,000 credits per month',
      'Cost: 20 credits / generation',
      'Lightning-fast speed',
      '4K Ultra-High Quality',
      'Credits expire after 30 days',
    ],
    credits: 10000,
    costPerGeneration: 20,
    durationDays: 30,
    polarLink: 'https://polar.sh/checkout/polar_c_tQZOjzbVYwZhnWg5tdpBcWpYyPzqQZzuvIClV0oUzrC',
    buttonText: 'Switch to Mega',
  },
  {
    name: 'Booster Pack',
    price: '$20',
    priceSuffix: 'one-time',
    description: 'Add-on credit top-up.',
    features: [
      '1,000 credits',
      'Cost: 30 credits / generation',
      'Credits expire after 30 days',
    ],
    credits: 1000,
    costPerGeneration: 30,
    durationDays: 30,
    polarLink: 'https://buy.polar.sh/polar_cl_u5vpk1YGAidaW5Lf7PXbDiWqo7jDVyWlv1v0o3G0NAh',
    buttonText: 'Purchase',
  },
];


export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [isInitialized, setIsInitialized] = useState(false);

  const getUserStorageKey = (email: string) => `userState_${email}`;

  const loadUser = useCallback((email: string | null) => {
    if (!email) {
      setUser(defaultUser);
      return;
    }
    try {
      const storedUser = localStorage.getItem(getUserStorageKey(email));
      let currentUser = storedUser ? JSON.parse(storedUser) : { ...defaultUser, email };
      
      if (currentUser.planExpiration && isPast(new Date(currentUser.planExpiration))) {
        currentUser = { ...defaultUser, email: currentUser.email, freeGenerationUsed: true };
        console.log(`Plan for ${email} expired. Resetting to Free plan.`);
      }
      
      setUser(currentUser);
    } catch (error) {
      console.error("Failed to load user state from localStorage", error);
      setUser({ ...defaultUser, email });
    }
  }, []);

  useEffect(() => {
    const lastEmail = localStorage.getItem('lastUserEmail');
    if (lastEmail) {
      loadUser(lastEmail);
    } else {
      setUser(defaultUser);
    }
    setIsInitialized(true);
  }, [loadUser]);

  useEffect(() => {
    if (isInitialized && user.email) {
      try {
        localStorage.setItem(getUserStorageKey(user.email), JSON.stringify(user));
        localStorage.setItem('lastUserEmail', user.email);
      } catch (error) {
        console.error("Could not save user state to localStorage", error);
      }
    }
  }, [user, isInitialized]);

  const getPlanByName = useCallback((planName: Plan['name']) => {
    return plans.find(p => p.name === planName);
  }, []);

  const login = useCallback((email: string) => {
    loadUser(email);
  }, [loadUser]);

  const logout = useCallback(() => {
    if (user.email) {
       localStorage.removeItem('lastUserEmail');
       setUser(defaultUser);
    }
  }, [user.email]);

  const activatePlan = useCallback((planName: Plan['name']) => {
    const plan = getPlanByName(planName);
    if (!plan || plan.name === 'Free') return;

    setUser(currentUser => {
      if (!currentUser.email) {
        console.error("Cannot activate a plan without a logged-in user.");
        return currentUser;
      }
        
      const isExpired = currentUser.planExpiration && isPast(new Date(currentUser.planExpiration));
      const baseCredits = isExpired ? 0 : currentUser.credits;
      const newCredits = baseCredits + plan.credits;
      const newExpiration = plan.durationDays ? add(new Date(), { days: plan.durationDays }).toISOString() : null;

      let newPlanName = plan.name;
      // If the current plan is Pro or Mega and a Booster is bought, keep the original plan name but add credits and reset expiration.
      if (plan.name === 'Booster Pack' && (currentUser.plan === 'Pro' || currentUser.plan === 'Mega') && !isExpired) {
          newPlanName = currentUser.plan;
      }
      
      return {
          ...currentUser,
          plan: newPlanName,
          credits: newCredits,
          planExpiration: newExpiration,
          freeGenerationUsed: true, // Purchasing any plan counts as using the free tier.
      };
    });
  }, [getPlanByName]);
  
  const deductCredits = useCallback((amount: number) => {
      if (user.plan === 'Free' && !user.freeGenerationUsed) {
          setUser(prev => ({ ...prev, freeGenerationUsed: true }));
          return;
      }
      if (user.credits >= amount) {
          setUser(prev => ({ ...prev, credits: prev.credits - amount }));
      } else {
          throw new Error("Insufficient credits");
      }
  }, [user]);

  const value = {
    user,
    plans,
    login,
    logout,
    activatePlan,
    deductCredits,
    isLoggedIn: !!user.email,
    getPlanByName,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
