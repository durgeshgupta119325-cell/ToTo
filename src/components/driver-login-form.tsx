"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

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

// Schema for the login form
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export function DriverLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Robustly initialize driver data on component mount to ensure login can check against all drivers.
  useEffect(() => {
    try {
      const storedDrivers = localStorage.getItem('toto-admin-drivers');
      if (!storedDrivers) {
        // If no drivers are in storage, initialize storage with the default list.
        localStorage.setItem('toto-admin-drivers', JSON.stringify(DUMMY_DRIVERS));
      }
    } catch (e) {
      console.error("Failed to initialize driver storage, falling back to default.", e);
      // In case of error, still ensure there's a list to check against.
      localStorage.setItem('toto-admin-drivers', JSON.stringify(DUMMY_DRIVERS));
    }
  }, []); // Empty dependency array ensures it runs once on mount.


  function onSubmit(values: z.infer<typeof formSchema>) {
    // 1. Get the current list of drivers from localStorage. This should now always exist.
    let drivers: typeof DUMMY_DRIVERS = [];
    try {
        const storedDrivers = localStorage.getItem('toto-admin-drivers');
        drivers = storedDrivers ? JSON.parse(storedDrivers) : [];
    } catch (e) {
        console.error("Could not parse drivers from localStorage, falling back to default.", e);
        drivers = DUMMY_DRIVERS; // Fallback to defaults as a last resort
    }
    
    // 2. Find the driver by email
    const driver = drivers.find((d: any) => d.email === values.email);

    // 3. Check if driver exists and password matches
    if (driver && driver.password && values.password === driver.password) {
      // 4. Save logged-in driver's data to localStorage for the dashboard
      localStorage.setItem('toto-driver', JSON.stringify(driver));
      
      toast({
        title: "Login Successful",
        description: "Welcome back! Redirecting to your dashboard...",
      });
      router.push('/driver/dashboard');
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please check your credentials or register.",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Driver Login</CardTitle>
        <CardDescription>
          Enter your email and password to access your dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="driver@example.com" {...field} />
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
                        placeholder="********"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
