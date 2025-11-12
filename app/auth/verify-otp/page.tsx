"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authAPI } from "@/lib/api";

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(decodeURIComponent(emailParam));
  }, [searchParams]);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  useEffect(() => {
    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
  }, []);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !email) {
      toast.error("Please enter both email and OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.verifyCode(email, otp);
      const { data } = response.data || {};

      // Store temporary reset token/data
      sessionStorage.setItem("resetEmail", email);
      sessionStorage.setItem("resetToken", data?.resetToken || otp);

      setIsVerified(true);
      toast.success("OTP verified successfully");

      redirectTimer.current = setTimeout(() => {
        router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email || timer > 0) return;
    setTimer(60);
    setIsLoading(true);
    try {
      await authAPI.forgetPassword(email);
      toast.success("OTP sent to your email");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to resend OTP");
      setTimer(0);
    } finally {
      setIsLoading(false);
    }
  };

  const maskedEmail = email
    ? email.replace(/(^.).*(@.*$)/, (_, a, b) => `${a}***${b}`)
    : "";

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
          <CardTitle className="text-2xl font-bold">Verify OTP</CardTitle>
          <CardDescription>
            {isVerified ? "OTP verified. Redirecting..." : `Enter the OTP sent to ${maskedEmail}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isVerified ? (
            <div className="text-center space-y-4">
              <div className="text-green-600 text-sm font-medium">OTP verified successfully!</div>
              <div className="text-gray-600 text-sm">You will be redirected to reset your password...</div>
            </div>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium mb-2">
                  OTP Code
                </label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  inputMode="numeric"
                  pattern="\\d{6}"
                  disabled={isLoading}
                  className="text-center tracking-widest text-lg"
                  autoComplete="one-time-code"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#96A1DB] hover:bg-[#556ff3]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  "Verify OTP"
                )}
              </Button>

              <div className="text-center text-sm">
                <p className="text-gray-600">
                  Didn&apos;t receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={timer > 0 || isLoading}
                    className="text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400"
                  >
                    {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                  </button>
                </p>
              </div>

              <Button type="button" variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/auth/forgot-password">
                  <span className="inline-flex items-center"><ArrowLeft size={18} className="mr-2" />Back</span>
                </Link>
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
