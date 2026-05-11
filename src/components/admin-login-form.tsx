"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertTriangle, ExternalLink, ShieldCheck } from "lucide-react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useAuth, useFirestore } from "@/firebase";

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export function AdminLoginForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [configError, setConfigError] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "totoadmin@gmail.com",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setConfigError(false);
    
    try {
      if (isSignUp) {
        // Register Admin
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;
        
        // Set admin role in Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: "System Admin",
          email: user.email,
          role: "admin",
          createdAt: new Date().toISOString(),
          isBlocked: false,
        });

        toast({
          title: "Admin Account Created",
          description: "You are now registered as an administrator.",
        });
      } else {
        // Login Admin
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast({
          title: "Admin Login Successful",
          description: "Welcome back to the Command Console.",
        });
      }
      router.push('/admin/dashboard');
    } catch (error: any) {
      console.error("Auth Error:", error);
      let message = error.message;
      
      if (error.code === 'auth/configuration-not-found' || error.message?.includes('configuration-not-found')) {
        setConfigError(true);
        message = "Email/Password sign-in is not enabled in your Firebase Console.";
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        message = "Invalid email or password. Use 'Sign Up' if you haven't created an account.";
      } else if (error.code === 'auth/email-already-in-use') {
        message = "This email is already registered. Please login instead.";
      }

      toast({
        variant: "destructive",
        title: isSignUp ? "Registration Failed" : "Login Failed",
        description: message,
        duration: 10000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="shadow-2xl border-none">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center gap-2 mb-2">
           <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-primary" />
           </div>
           <CardTitle className="text-2xl font-black">Admin Access</CardTitle>
        </div>
        <CardDescription className="font-medium">
          {isSignUp 
            ? "Establish a new system administrator identity." 
            : "Authenticate to access the Command Console."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {configError && (
          <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 animate-in fade-in slide-in-from-top-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="font-bold">Firebase Configuration Required</AlertTitle>
            <AlertDescription className="text-xs mt-2 leading-relaxed">
              The <span className="font-bold">Email/Password</span> provider is currently disabled. 
              To fix this and enable login:
              <ol className="list-decimal list-inside mt-2 space-y-1 font-medium">
                <li>Open the <span className="font-bold">Firebase Console</span></li>
                <li>Go to <span className="font-bold">Authentication &gt; Sign-in method</span></li>
                <li>Enable <span className="font-bold">Email/Password</span> and click Save</li>
              </ol>
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs text-destructive font-bold mt-3"
                asChild
              >
                <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer">
                  Go to Firebase Console <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Admin Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="admin@toto.com" className="h-12 bg-secondary/30 border-none focus-visible:ring-1 focus-visible:ring-primary" />
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
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Security Phrase</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        className="h-12 bg-secondary/30 border-none focus-visible:ring-1 focus-visible:ring-primary"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4 pt-4">
              <Button
                type="submit"
                className="w-full h-14 font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {isSignUp ? "CREATING ADMIN..." : "VERIFYING..."}
                  </>
                ) : (
                  isSignUp ? "CREATE ACCOUNT" : "AUTHENTICATE"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setConfigError(false);
                }}
              >
                {isSignUp ? "ALREADY HAVE AN ADMIN ACCOUNT? LOGIN" : "FIRST TIME? REGISTER AS ADMIN"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
