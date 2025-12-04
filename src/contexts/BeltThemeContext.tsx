import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

type BeltColor = 'white' | 'orange' | 'blue' | 'yellow' | 'green' | 'brown' | 'black';

interface BeltThemeContextType {
  beltColor: BeltColor;
}

const BeltThemeContext = createContext<BeltThemeContextType | undefined>(undefined);

// HSL values for belt colors
const beltThemes: Record<BeltColor, { primary: string; accent: string; ring: string }> = {
  white: { primary: '0 0% 70%', accent: '0 0% 75%', ring: '0 0% 70%' },
  orange: { primary: '25 95% 53%', accent: '25 95% 58%', ring: '25 95% 53%' },
  blue: { primary: '217 91% 60%', accent: '217 91% 65%', ring: '217 91% 60%' },
  yellow: { primary: '48 96% 53%', accent: '48 96% 58%', ring: '48 96% 53%' },
  green: { primary: '142 76% 36%', accent: '142 76% 41%', ring: '142 76% 36%' },
  brown: { primary: '30 59% 41%', accent: '30 59% 46%', ring: '30 59% 41%' },
  black: { primary: '0 0% 15%', accent: '0 0% 20%', ring: '0 0% 15%' },
};

// Default red theme (when no user logged in)
const defaultTheme = { primary: '0 84% 55%', accent: '0 84% 60%', ring: '0 84% 55%' };

export function BeltThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  const beltColor = ((user as any)?.belt_color?.toLowerCase() || 'white') as BeltColor;
  
  useEffect(() => {
    const root = document.documentElement;
    const theme = user ? (beltThemes[beltColor] || beltThemes.white) : defaultTheme;
    
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--ring', theme.ring);
    root.style.setProperty('--dojo-red', theme.primary);
    root.style.setProperty('--dojo-red-light', theme.accent);
    
    return () => {
      // Reset to default on unmount
      root.style.setProperty('--primary', defaultTheme.primary);
      root.style.setProperty('--accent', defaultTheme.accent);
      root.style.setProperty('--ring', defaultTheme.ring);
      root.style.setProperty('--dojo-red', defaultTheme.primary);
      root.style.setProperty('--dojo-red-light', defaultTheme.accent);
    };
  }, [user, beltColor]);

  return (
    <BeltThemeContext.Provider value={{ beltColor }}>
      {children}
    </BeltThemeContext.Provider>
  );
}

export function useBeltTheme() {
  const context = useContext(BeltThemeContext);
  if (context === undefined) {
    throw new Error('useBeltTheme must be used within a BeltThemeProvider');
  }
  return context;
}
