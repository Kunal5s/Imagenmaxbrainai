
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
      '10 credits per generation',
      '4K Ultra-High Quality',
      'Commercial use license',
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
      '10 credits per generation',
      'Lightning-fast speed',
      '4K Ultra-High Quality',
    ],
    credits: 10000,
    costPerGeneration: 10,
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
      '10 credits per generation',
      'Credits never expire',
    ],
    credits: 1000,
    costPerGeneration: 10,
    polarLink: 'https://buy.polar.sh/polar_cl_u5vpk1YGAidaW5Lf7PXbDiWqo7jDVyWlv1v0o3G0NAh',
    buttonText: 'Purchase',
  },
];


export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('userState');
      let currentUser = storedUser ? JSON.parse(storedUser) : defaultUser;

      if (currentUser.planExpiration && isPast(new Date(currentUser.planExpiration))) {
        currentUser = { ...defaultUser, email: currentUser.email, freeGenerationUsed: true };
      }
      
      setUser(currentUser);
    } catch (error) {
      setUser(defaultUser);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('userState', JSON.stringify(user));
      } catch (error) {
        console.error("Could not save user state to localStorage", error);
      }
    }
  }, [user, isInitialized]);

  const getPlanByName = useCallback((planName: Plan['name']) => {
    return plans.find(p => p.name === planName);
  }, []);

  const login = useCallback((email: string) => {
    setUser(prev => ({ ...prev, email }));
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userState');
      setUser(defaultUser);
    }
  }, []);

  const activatePlan = useCallback((planName: Plan['name']) => {
    const plan = getPlanByName(planName);
    if (!plan || plan.name === 'Free') return;

    setUser(prevUser => {
        const isBooster = plan.name === 'Booster Pack';
        const currentCredits = (prevUser.plan === 'Free' || (prevUser.planExpiration && isPast(new Date(prevUser.planExpiration)))) ? 0 : prevUser.credits;
        
        const newCredits = currentCredits + plan.credits;
        let newExpiration = prevUser.planExpiration;

        if (!isBooster) {
             const startDate = (prevUser.planExpiration && !isPast(new Date(prevUser.planExpiration))) ? new Date(prevUser.planExpiration) : new Date();
             newExpiration = add(startDate, { days: plan.durationDays }).toISOString();
        }

        return {
            ...prevUser,
            plan: isBooster && prevUser.plan !== 'Free' ? prevUser.plan : plan.name,
            credits: newCredits,
            planExpiration: isBooster ? prevUser.planExpiration : newExpiration,
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
