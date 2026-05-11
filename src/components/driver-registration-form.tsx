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
    phone: z.string().regex(/^\+?91\d{10}$|^\d{10}$/, "Please enter a valid mobile number."),
    vehicleNumber: z.string().min(4, "Vehicle number must be at least 4 characters."),
    vehicleType: z.enum(["e-rickshaw", "cab"], {
      required_error: "Please select a vehicle type.",
    }),
    city: z.string().min(2, "City is required."),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      vehicleNumber: "",
      city: "Patna",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const driverId = `DRV_${Date.now()}`;
    
    const newDriver = {
      driverId: driverId,
      name: values.fullName,
      phone: values.phone.startsWith('+91') ? values.phone : `+91${values.phone}`,
      email: values.email,
      vehicleNumber: values.vehicleNumber.toUpperCase(),
      vehicleType: values.vehicleType,
      isOnline: false,
      isAvailable: false,
      currentLat: 0,
      currentLng: 0,
      rating: 5.0,
      totalTrips: 0,
      city: values.city,
      documents: {
        dl: "",
        rc: "",
        insurance: ""
      },
      fleetId: null,
      kycVerified: false,
      createdAt: new Date().toISOString(),
      grossEarnings: 0,
      password: values.password
    };

    // Store in local memory for demo purposes as well
    let drivers = [];
    try {
      const storedDrivers = localStorage.getItem('toto-admin-drivers');
      drivers = storedDrivers ? JSON.parse(storedDrivers) : [...DUMMY_DRIVERS];
    } catch (e) {
      drivers = [...DUMMY_DRIVERS];
    }

    const updatedDrivers = [...drivers, newDriver];
    localStorage.setItem('toto-admin-drivers', JSON.stringify(updatedDrivers));

    toast({
      title: "Registration Successful",
      description: "Welcome to the partner network! You can now log in.",
    });
    router.push('/driver/login');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Partner Registration</CardTitle>
        <CardDescription>
          Register your vehicle to start earning with the network.
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
                    <Input placeholder="E.g. Suresh Yadav" {...field} />
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
                      <Input placeholder="suresh@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+919876543211" {...field} />
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
                      <Input placeholder="BR01AB1234" {...field} />
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
                        <SelectItem value="e-rickshaw">E-Rickshaw</SelectItem>
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
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operating City</FormLabel>
                  <FormControl>
                    <Input placeholder="Patna" {...field} />
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