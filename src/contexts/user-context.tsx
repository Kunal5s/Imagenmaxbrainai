
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
  lastCreditReset?: string | null; // YYYY-MM-DD
}

interface UserContextType {
  user: User;
  plans: Plan[];
  login: (email: string) => void;
  logout: () => void;
  activatePlan: (planName: Plan['name']) => void;
  deductCredits: () => void;
  isLoggedIn: boolean;
  getPlanByName: (planName: Plan['name']) => Plan | undefined;
  isActivationDialogOpen: boolean;
  setActivationDialogOpen: (isOpen: boolean) => void;
  planToPurchase: Plan['name'] | null;
  setPlanToPurchase: (planName: Plan['name'] | null) => void;
}

const defaultUser: User = {
  email: null,
  plan: 'Free',
  credits: 10,
  planExpiration: null,
  lastCreditReset: null,
};

export const plans: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    priceSuffix: '',
    description: 'For starters and hobbyists.',
    features: [
      '10 free credits (5 generations)',
      'Standard Quality (1080p)',
      'Access to core models',
      'Personal use license',
    ],
    credits: 10,
    costPerGeneration: 2,
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
      'Priority support',
    ],
    credits: 3000,
    costPerGeneration: 10,
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
      'API access (coming soon)',
      'Team collaboration features',
      'Dedicated support',
    ],
    credits: 10000,
    costPerGeneration: 20,
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
      'Credits do not expire',
      'Immediately fast generation',
    ],
    credits: 1000,
    costPerGeneration: 30,
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

  const getUserStorageKey = (email: string) => `userState_${email}`;

  const loadUser = useCallback((email: string | null) => {
    const today = new Date().toISOString().split('T')[0];

    if (!email) {
      // Handle non-logged-in user with session storage for free credits
      const sessionUser = localStorage.getItem('sessionUser');
      if (sessionUser) {
        const parsedUser: User = JSON.parse(sessionUser);
        
        // Daily credit reset for free users
        if (parsedUser.plan === 'Free' && parsedUser.lastCreditReset !== today) {
            parsedUser.credits = 10;
            parsedUser.lastCreditReset = today;
        }
        
        setUser(parsedUser);
      } else {
        // First visit ever for a non-logged in user
        setUser({ ...defaultUser, lastCreditReset: today });
      }
      return;
    }

    // Handle logged-in user
    try {
      const storedUser = localStorage.getItem(getUserStorageKey(email));
      let currentUser: User;

      if (storedUser) {
        currentUser = JSON.parse(storedUser);
      } else {
        // First time this email is used on this browser
        currentUser = { ...defaultUser, email, plan: 'Free', credits: 10, lastCreditReset: today };
      }
      
      // Check for paid plan expiration
      if (currentUser.plan !== 'Free' && currentUser.plan !== 'Booster Pack' && currentUser.planExpiration && isPast(new Date(currentUser.planExpiration))) {
        console.log(`Plan for ${email} expired. Resetting to Free plan.`);
        currentUser = { ...defaultUser, email: currentUser.email, plan: 'Free', credits: 10, lastCreditReset: today };
      }

      // Daily credit reset for logged-in free users
      if (currentUser.plan === 'Free' && currentUser.lastCreditReset !== today) {
          currentUser.credits = 10;
          currentUser.lastCreditReset = today;
      }
      
      setUser(currentUser);

    } catch (error) {
      console.error("Failed to load user state from localStorage", error);
      setUser({ ...defaultUser, email, plan: 'Free', credits: 10, lastCreditReset: today });
    }
  }, []);

  useEffect(() => {
    // This runs once on mount
    const lastEmail = localStorage.getItem('lastUserEmail');
    loadUser(lastEmail);
    setIsInitialized(true);
  }, [loadUser]);

  useEffect(() => {
    // This runs whenever user state changes
    if (isInitialized) {
      try {
        if (user.email) {
          // Logged-in user: save to email-specific key
          localStorage.setItem(getUserStorageKey(user.email), JSON.stringify(user));
          localStorage.setItem('lastUserEmail', user.email);
          localStorage.removeItem('sessionUser'); // Clean up session user data
        } else {
           // Not logged-in: save to a temporary session key
           localStorage.setItem('sessionUser', JSON.stringify(user));
           localStorage.removeItem('lastUserEmail');
        }
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
       // Reset to the default non-logged-in state for a new session
       const today = new Date().toISOString().split('T')[0];
       setUser({ ...defaultUser, lastCreditReset: today });
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
        
      const isExpired = currentUser.planExpiration ? isPast(new Date(currentUser.planExpiration)) : true;
      
      const currentCredits = isExpired ? 0 : currentUser.credits;
      const newCredits = currentCredits + plan.credits;
      
      let newExpiration: string | null = null;
      // Only set/reset expiration for plans that have a duration
      if (plan.durationDays) {
          const now = new Date();
          const currentExpiration = (currentUser.planExpiration && !isExpired) ? new Date(currentUser.planExpiration) : now;
          // Extend from the current expiration date if it exists and is in the future, otherwise from now.
          const newExpirationDate = add(currentExpiration > now ? currentExpiration : now, { days: plan.durationDays });
          newExpiration = newExpirationDate.toISOString();
      } else {
          // Booster pack credits don't expire, so we don't set an expiration date
          // If a user has an active subscription, we keep its expiration date.
          newExpiration = isExpired ? null : currentUser.planExpiration;
      }
      
      let newPlanName = currentUser.plan;
      if (plan.name === 'Pro' || plan.name === 'Mega') {
        newPlanName = plan.name;
      } else if (currentUser.plan === 'Free' || isExpired) {
        // If they buy a booster while on free/expired plan, they don't get a "plan name"
        // but their credits are boosted. The plan remains Free conceptually.
        newPlanName = 'Free';
      }
      
      return {
          ...currentUser,
          plan: newPlanName,
          credits: newCredits,
          planExpiration: newExpiration,
      };
    });
  }, [getPlanByName]);
  
  const deductCredits = useCallback(() => {
      const plan = getPlanByName(user.plan);
      const cost = plan?.costPerGeneration ?? 2;

      if (user.credits >= cost) {
          setUser(prev => ({ ...prev, credits: prev.credits - cost }));
      } else {
          console.error("Insufficient credits");
          throw new Error("Insufficient credits");
      }
  }, [user.credits, user.plan, getPlanByName]);

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
    setPlanToPurchase,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
