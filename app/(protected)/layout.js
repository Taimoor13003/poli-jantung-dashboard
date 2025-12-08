"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../header";
import { useAuth } from "../../components/AuthProvider";

export default function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="spinner" />
        <p>Sedang memproses data...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}
