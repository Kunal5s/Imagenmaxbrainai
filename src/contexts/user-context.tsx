
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
  credits: 10,
  planExpiration: null,
};

export const plans: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    priceSuffix: '',
    description: 'For starters and hobbyists.',
    features: [
      '10 free credits',
      'Standard Quality (1080p)',
      'Access to core models',
      'Personal use license',
    ],
    credits: 10,
    costPerGeneration: 1,
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
    polarLink: 'https://polar.sh/checkout/polar_c_tQZOjzbVYwZhnWg5tdpBcWpYyPzqQZzuvIClV0oUzrC',
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
      'Credits never expire',
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

  const getUserStorageKey = (email: string) => `userState_${email}`;

  const loadUser = useCallback((email: string | null) => {
    if (!email) {
      // Handle non-logged-in user with session storage for free credits
      const sessionUser = localStorage.getItem('sessionUser');
      if (sessionUser) {
        setUser(JSON.parse(sessionUser));
      } else {
        setUser(defaultUser);
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
        // First time this email is used on this browser, give free credits
        currentUser = { ...defaultUser, email, plan: 'Free', credits: 10 };
      }
      
      // Check for expiration
      if (currentUser.planExpiration && isPast(new Date(currentUser.planExpiration))) {
        console.log(`Plan for ${email} expired. Resetting to Free plan.`);
        currentUser = { ...defaultUser, email: currentUser.email, plan: 'Free', credits: 0 };
      }
      
      setUser(currentUser);

    } catch (error) {
      console.error("Failed to load user state from localStorage", error);
      setUser({ ...defaultUser, email, plan: 'Free', credits: 10 });
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
       // Reset to the default non-logged-in state
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
        
      const isExpired = currentUser.planExpiration ? isPast(new Date(currentUser.planExpiration)) : true;
      
      // Credits from an expired plan are lost. Active plan credits are kept.
      const currentCredits = isExpired ? 0 : currentUser.credits;
      const newCredits = currentCredits + plan.credits;
      
      let newExpiration = currentUser.planExpiration;
      // Only set/reset expiration for plans that have a duration (Pro/Mega)
      if (plan.durationDays) {
        newExpiration = add(new Date(), { days: plan.durationDays }).toISOString();
      }

      let newPlanName = currentUser.plan;
      // If the new plan is a monthly subscription, it becomes the new active plan.
      if (plan.name === 'Pro' || plan.name === 'Mega') {
        newPlanName = plan.name;
      } else if (isExpired) {
        // If the old plan was expired and they buy a booster, they are on a 'Free' plan with credits.
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
  
  const deductCredits = useCallback((amount: number) => {
      // For free users, generation cost is 1 credit. 
      // For paid users, we get the cost from their plan.
      const plan = getPlanByName(user.plan);
      const cost = plan?.costPerGeneration ?? 1;

      if (user.credits >= cost) {
          setUser(prev => ({ ...prev, credits: prev.credits - cost }));
      } else {
          console.error("Insufficient credits");
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
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
