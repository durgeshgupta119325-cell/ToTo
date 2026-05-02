
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DUMMY_DRIVERS } from "@/lib/mock-data";

const formSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    mobile: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit mobile number."),
    vehicleNumber: z.string().min(4, "Vehicle number must be at least 4 characters."),
    vehicleType: z.enum(["erickshaw", "cab"], {
      required_error: "Please select a vehicle type.",
    }),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export function DriverRegistrationForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Ensure data exists before registration attempts
    const stored = localStorage.getItem('toto-admin-drivers');
    if (!stored) {
      localStorage.setItem('toto-admin-drivers', JSON.stringify(DUMMY_DRIVERS));
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      mobile: "",
      vehicleNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    let drivers = [];
    try {
      const storedDrivers = localStorage.getItem('toto-admin-drivers');
      drivers = storedDrivers ? JSON.parse(storedDrivers) : [...DUMMY_DRIVERS];
    } catch (e) {
      drivers = [...DUMMY_DRIVERS];
    }

    const exists = drivers.some(
      (d: any) => d.email.toLowerCase() === values.email.toLowerCase() || d.mobile === values.mobile
    );

    if (exists) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "A driver with this email or mobile already exists.",
      });
      return;
    }

    const newDriver = {
      id: `DRV${Date.now().toString().slice(-6)}`,
      name: values.fullName,
      email: values.email,
      mobile: values.mobile,
      vehicleType: values.vehicleType === "erickshaw" ? "E-Rickshaw" : "Cab",
      vehicleNumber: values.vehicleNumber.toUpperCase(),
      grossEarnings: 0,
      photoUrl: `https://picsum.photos/seed/${values.email}/200/200`,
      idProofUrl: `https://picsum.photos/seed/id-${values.email}/400/250`,
      password: values.password,
    };

    const updatedDrivers = [...drivers, newDriver];
    localStorage.setItem('toto-admin-drivers', JSON.stringify(updatedDrivers));

    toast({
      title: "Registration Successful",
      description: "Welcome to TOTO! You can now log in.",
    });
    router.push('/driver/login');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Become a Partner</CardTitle>
        <CardDescription>
          Register today to start earning with TOTO.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g. Rajesh Kumar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="rajesh@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile</FormLabel>
                    <FormControl>
                      <Input placeholder="9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="vehicleNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Number</FormLabel>
                    <FormControl>
                      <Input placeholder="MH12AB1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="erickshaw">E-Rickshaw</SelectItem>
                        <SelectItem value="cab">Cab</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showPassword ? "text" : "password"} {...field} />
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
             <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-11" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Registering..." : "Complete Registration"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
