
"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginAction } from "@/lib/actions";
import { SubmitButton } from "@/components/submit-button";
import { Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const initialState = undefined;

const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

const MicrosoftIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
        <path fill="#F25022" d="M11.4 11.4H1V1H11.4z" />
        <path fill="#7FBA00" d="M23 11.4h-10.4V1H23z" />
        <path fill="#00A4EF" d="M11.4 23H1V12.6H11.4z" />
        <path fill="#FFB900" d="M23 23h-10.4V12.6H23z" />
    </svg>
);

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold font-headline">Welcome Back</h1>
        <p className="text-muted-foreground">Enter your credentials to access your account</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="Enter Your Email Id" required />
      </div>
      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
          <Link href="#" className="ml-auto inline-block text-sm underline" prefetch={false}>
            Forgot your password?
          </Link>
        </div>
        <div className="relative">
            <Input 
                id="password" 
                name="password" 
                type={showPassword ? "text" : "password"}
                required 
            />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                onClick={() => setShowPassword(prev => !prev)}
            >
                {showPassword ? <EyeOff /> : <Eye />}
            </Button>
        </div>
      </div>
      <SubmitButton className="w-full">
        Login
      </SubmitButton>
      
       <div className="relative my-4">
        <Separator />
        <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">OR</span>
      </div>

       <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="w-full">
            <GoogleIcon />
            Google
          </Button>
          <Button variant="outline" className="w-full">
            <MicrosoftIcon />
            Microsoft
          </Button>
      </div>

      <Button variant="outline" className="w-full" asChild>
        <Link href="/register">Don't have an account? Sign up</Link>
      </Button>
    </form>
  );
}
