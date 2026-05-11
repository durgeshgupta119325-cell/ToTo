
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DUMMY_DRIVERS } from "@/lib/mock-data";
import { useAuth } from "@/firebase";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.62-4.55 1.62-3.83 0-6.95-3.12-6.95-6.95s3.12-6.95 6.95-6.95c2.21 0 3.63 1.02 4.47 1.84l2.5-2.5C18.16 3.53 15.65 2.4 12.48 2.4c-5.49 0-9.94 4.45-9.94 9.94s4.45 9.94 9.94 9.94c5.38 0 9.6-3.63 9.6-9.69 0-.61-.06-1.21-.17-1.8z" fill="currentColor"/>
    </svg>
);

export function DriverLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // First try real Firebase Auth if credentials exist there
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({ title: "Login Successful" });
      router.push('/driver/dashboard');
    } catch (firebaseError: any) {
      // Fallback to legacy dummy check for prototyping
      let drivers: typeof DUMMY_DRIVERS = [];
      try {
          const storedDrivers = localStorage.getItem('toto-admin-drivers');
          drivers = storedDrivers ? JSON.parse(storedDrivers) : DUMMY_DRIVERS;
      } catch (e) {
          drivers = DUMMY_DRIVERS;
      }
      
      const driver = drivers.find((d: any) => d.email.toLowerCase() === values.email.toLowerCase());

      if (driver && driver.password && values.password === driver.password) {
        localStorage.setItem('toto-driver', JSON.stringify(driver));
        toast({
          title: "Login Successful",
          description: `Welcome back, ${driver.name}!`,
        });
        router.push('/driver/dashboard');
      } else {
        let message = firebaseError.message;
        if (firebaseError.code === 'auth/configuration-not-found') {
          message = "Email/Password sign-in is not enabled in Firebase Console. Prototyping fallback failed for these credentials.";
        }
        
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: message,
          duration: 8000,
        });
      }
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        let drivers: typeof DUMMY_DRIVERS = [];
        const storedDrivers = localStorage.getItem('toto-admin-drivers');
        drivers = storedDrivers ? JSON.parse(storedDrivers) : DUMMY_DRIVERS;

        const driver = drivers.find((d: any) => d.email.toLowerCase() === user.email?.toLowerCase());

        if (driver) {
            localStorage.setItem('toto-driver', JSON.stringify(driver));
            toast({
                title: "Login Successful",
                description: `Welcome back, ${driver.name}!`,
            });
            router.push('/driver/dashboard');
        } else {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: "No driver account found with this Google account. Please register first.",
            });
            await auth.signOut();
        }
    } catch (error: any) {
        console.error("Google Sign-In Error:", error);
        
        let message = error.message;
        if (error.code === 'auth/configuration-not-found' || error.message.includes('configuration-not-found')) {
            message = "Google Sign-In is not enabled. Please go to the Firebase Console -> Authentication -> Sign-in method and enable Google.";
        }

        toast({
            variant: "destructive",
            title: "Sign-In Error",
            description: message,
            duration: 8000,
        });
    } finally {
        setIsGoogleLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Driver Login</CardTitle>
        <CardDescription>
          Access your professional dashboard and earnings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-11"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Authenticating..." : "Log In"}
            </Button>
          </form>
        </Form>
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                    Or use Google
                </span>
            </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full h-11" 
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
        >
            {isGoogleLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <GoogleIcon className="mr-2 h-4 w-4" />
            )}
            {isGoogleLoading ? "Connecting..." : "Continue with Google"}
        </Button>
      </CardContent>
    </Card>
  );
}
