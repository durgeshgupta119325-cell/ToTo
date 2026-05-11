"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
import { ArrowLeft } from "lucide-react";
import { DUMMY_CUSTOMERS } from "@/lib/mock-data";

const detailsSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().min(5, { message: "Address is required." }),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().min(2, { message: "State is required." }),
  pincode: z.string().regex(/^\d{6}$/, { message: "Please enter a valid 6-digit pin code." }),
});

const otpSchema = z.object({
  otp: z.string().length(4, { message: "OTP must be 4 digits." }),
});

export function CustomerLoginForm() {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const detailsForm = useForm<z.infer<typeof detailsSchema>>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (isEditMode) {
      const storedCustomer = localStorage.getItem('toto-customer');
      if (storedCustomer) {
        try {
          const customerData = JSON.parse(storedCustomer);
          detailsForm.reset(customerData);
        } catch (error) {
          console.error("Failed to parse customer data from localStorage", error);
        }
      }
    }
  }, [isEditMode, detailsForm]);

  function onDetailsSubmit(values: z.infer<typeof detailsSchema>) {
    toast({
      title: "OTP Sent",
      description: `An OTP has been sent to ${values.phone}.`,
    });
    setStep('otp');
  }

  function onOtpSubmit(values: z.infer<typeof otpSchema>) {
    if (values.otp.match(/^\d{4}$/)) {
        const enteredDetails = detailsForm.getValues();
        let customerToStore;

        if (isEditMode) {
            const storedCustomerRaw = localStorage.getItem('toto-customer');
            if (storedCustomerRaw) {
                const storedCustomer = JSON.parse(storedCustomerRaw);
                customerToStore = { ...storedCustomer, ...enteredDetails };
            } else {
                customerToStore = {
                    ...enteredDetails,
                    uid: `CUST_${Date.now()}`,
                    role: 'customer',
                    isBlocked: false,
                    profilePic: `https://picsum.photos/seed/${Date.now()}/200/200`,
                    createdAt: new Date().toISOString(),
                    rides: []
                };
            }
        } else {
            const existingCustomer = DUMMY_CUSTOMERS.find(c => c.phone === enteredDetails.phone);

            if (existingCustomer) {
                customerToStore = { ...existingCustomer, ...enteredDetails };
            } else {
                customerToStore = { 
                    ...enteredDetails, 
                    uid: `CUST_${Date.now()}`,
                    role: 'customer',
                    isBlocked: false,
                    profilePic: `https://picsum.photos/seed/${Date.now()}/200/200`,
                    createdAt: new Date().toISOString(),
                    rides: []
                };
            }
        }

        localStorage.setItem('toto-customer', JSON.stringify(customerToStore));
        toast({
          title: isEditMode ? "Profile Updated" : "Login Successful",
          description: isEditMode ? "Your details have been successfully updated." : "Welcome! You're now logged in.",
        });
        router.push('/customer/dashboard');
    } else {
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Invalid OTP. Please try again.",
        });
        otpForm.reset();
    }
  }
  
  const handleGoBack = () => {
    setStep('details');
    otpForm.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{isEditMode ? 'Edit Your Profile' : 'Customer Login / Sign Up'}</CardTitle>
        <CardDescription>
          {step === 'details' 
            ? isEditMode ? "Update your personal information below." : "Enter your details to login or create an account." 
            : `Enter the 4-digit OTP sent to ${detailsForm.getValues('phone')}.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'details' && (
            <Form {...detailsForm}>
            <form onSubmit={detailsForm.handleSubmit(onDetailsSubmit)} className="space-y-4">
                <FormField
                control={detailsForm.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Anjali Sharma" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={detailsForm.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="anjali@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={detailsForm.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                        <Input placeholder="+919876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                    control={detailsForm.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                            <Input placeholder="123, Main Street" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormField
                        control={detailsForm.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                                <Input placeholder="Mumbai" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={detailsForm.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                                <Input placeholder="Maharashtra" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={detailsForm.control}
                        name="pincode"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Pin Code</FormLabel>
                            <FormControl>
                                <Input placeholder="400001" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button
                type="submit"
                className="w-full !mt-6"
                disabled={detailsForm.formState.isSubmitting}
                >
                {detailsForm.formState.isSubmitting 
                    ? "Sending OTP..." 
                    : isEditMode ? "Update & Send OTP" : "Send OTP"}
                </Button>
            </form>
            </Form>
        )}

        {step === 'otp' && (
            <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
                 <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>One-Time Password</FormLabel>
                        <FormControl>
                            <Input placeholder="1234" {...field} maxLength={4} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex flex-col gap-2">
                    <Button
                    type="submit"
                    className="w-full"
                    disabled={otpForm.formState.isSubmitting}
                    >
                    {otpForm.formState.isSubmitting ? "Verifying..." : "Verify OTP & Login"}
                    </Button>
                    <Button variant="outline" type="button" onClick={handleGoBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                    </Button>
                </div>
            </form>
            </Form>
        )}

      </CardContent>
    </Card>
  );
}