"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authAPI } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const redirectTimer = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.forgetPassword(email);
      setIsSubmitted(true);
      toast.success("OTP sent to your email");

      // Redirect to OTP verification after 2 seconds
      redirectTimer.current = setTimeout(() => {
        router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF5F9] p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Image
              src="/logo.png"
              alt="Brand logo"
              width={208}
              height={90}
              className="w-[208px] h-[90px] object-contain"
              priority
            />
          </div>
          <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
          <CardDescription>
            {isSubmitted ? "Redirecting to OTP verification..." : "Enter your email address to receive an OTP"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="text-center space-y-4">
              <div className="text-green-600 text-sm font-medium">OTP has been sent to your email address</div>
              <div className="text-gray-600 text-sm">You will be redirected to verify your OTP in a moment...</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  disabled={isLoading}
                  autoComplete="email"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-[#96A1DB] hover:bg-[#556ff3]" disabled={isLoading}>
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending OTP...
                  </span>
                ) : (
                  "Send OTP"
                )}
              </Button>

              <Button type="button" variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/auth/login">
                  <span className="inline-flex items-center"><ArrowLeft size={18} className="mr-2" />Back to Login</span>
                </Link>
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
