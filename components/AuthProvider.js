"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../lib/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (err) => {
        console.error("Firebase auth error", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      signOut: () => firebaseSignOut(auth),
    }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
