'use client';
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { type User as PrismaUser } from "@prisma/client";

interface AuthContextType {
  user: PrismaUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PrismaUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        const res = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            uid: firebaseUser.uid,
            email: firebaseUser.email || undefined,
            username: firebaseUser.displayName || undefined,
            photoUrl: firebaseUser.photoURL || undefined,
          }),
        });
        const dbUser: PrismaUser = await res.json();
        setUser(dbUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a FirebaseAuthProvider");
  }
  return context;
}