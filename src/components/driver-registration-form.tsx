"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, Loader2, UploadCloud, FileCheck } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth, useFirestore, useStorage } from "@/firebase";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dlFile, setDlFile] = useState<File | null>(null);
  const [rcFile, setRcFile] = useState<File | null>(null);

  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const storage = useStorage();

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

  const handleFileUpload = async (file: File, path: string) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!dlFile || !rcFile) {
      toast({
        variant: "destructive",
        title: "Documents Required",
        description: "Please upload your Driving License and Vehicle RC.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create User Auth
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const uid = userCredential.user.uid;

      // 2. Upload Documents
      const dlUrl = await handleFileUpload(dlFile, `driver_docs/${uid}/dl_${Date.now()}`);
      const rcUrl = await handleFileUpload(rcFile, `driver_docs/${uid}/rc_${Date.now()}`);

      // 3. Save Driver Profile to Firestore
      const driverData = {
        driverId: uid,
        uid: uid,
        name: values.fullName,
        phone: values.phone.startsWith('+91') ? values.phone : `+91${values.phone}`,
        email: values.email,
        vehicleNumber: values.vehicleNumber.toUpperCase(),
        vehicleType: values.vehicleType,
        role: 'driver',
        isOnline: false,
        isAvailable: false,
        currentLat: 25.5941,
        currentLng: 85.1376,
        rating: 5.0,
        totalTrips: 0,
        city: values.city,
        documents: {
          dl: dlUrl,
          rc: rcUrl,
          insurance: ""
        },
        fleetId: null,
        kycVerified: false,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "drivers", uid), driverData);
      await setDoc(doc(db, "users", uid), {
        uid: uid,
        name: values.fullName,
        email: values.email,
        role: 'driver',
        createdAt: new Date().toISOString(),
        isBlocked: false
      });

      toast({
        title: "Registration Successful",
        description: "Welcome to the TOTO partner network! You can now log in.",
      });
      router.push('/driver/login');
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="shadow-2xl border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-black italic uppercase">Partner Registration</CardTitle>
        <CardDescription className="font-medium">
          Upload your documents and register to start earning with the network.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
               <h3 className="text-xs font-black uppercase tracking-widest text-primary">Identity Details</h3>
               <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. Suresh Yadav" className="bg-secondary/30 border-none h-11" {...field} />
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
                      <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="suresh@example.com" className="bg-secondary/30 border-none h-11" {...field} />
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
                      <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+919876543211" className="bg-secondary/30 border-none h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-primary">Vehicle Intel</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="vehicleNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">Vehicle Number</FormLabel>
                      <FormControl>
                        <Input placeholder="BR01AB1234" className="bg-secondary/30 border-none h-11" {...field} />
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
                      <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-secondary/30 border-none h-11">
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
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary">Verification Documents</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Driving License (DL)</Label>
                        <div className="relative">
                            <Input 
                                type="file" 
                                className="hidden" 
                                id="dl-upload" 
                                accept="image/*,.pdf"
                                onChange={(e) => setDlFile(e.target.files?.[0] || null)}
                            />
                            <Label 
                                htmlFor="dl-upload" 
                                className={cn(
                                    "flex flex-col items-center justify-center h-24 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
                                    dlFile ? "bg-green-50 border-green-200" : "bg-secondary/20 hover:bg-secondary/30 border-muted"
                                )}
                            >
                                {dlFile ? <FileCheck className="h-6 w-6 text-green-500" /> : <UploadCloud className="h-6 w-6 text-muted-foreground" />}
                                <span className="text-[10px] font-bold mt-2">{dlFile ? dlFile.name : "Upload DL"}</span>
                            </Label>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Vehicle RC</Label>
                        <div className="relative">
                            <Input 
                                type="file" 
                                className="hidden" 
                                id="rc-upload" 
                                accept="image/*,.pdf"
                                onChange={(e) => setRcFile(e.target.files?.[0] || null)}
                            />
                            <Label 
                                htmlFor="rc-upload" 
                                className={cn(
                                    "flex flex-col items-center justify-center h-24 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
                                    rcFile ? "bg-green-50 border-green-200" : "bg-secondary/20 hover:bg-secondary/30 border-muted"
                                )}
                            >
                                {rcFile ? <FileCheck className="h-6 w-6 text-green-500" /> : <UploadCloud className="h-6 w-6 text-muted-foreground" />}
                                <span className="text-[10px] font-bold mt-2">{rcFile ? rcFile.name : "Upload RC"}</span>
                            </Label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary">Security</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">Password</FormLabel>
                        <FormControl>
                            <div className="relative">
                            <Input type={showPassword ? "text" : "password"} className="bg-secondary/30 border-none h-11" {...field} />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 hover:bg-transparent"
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
                        <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">Confirm</FormLabel>
                        <FormControl>
                            <Input type="password" className="bg-secondary/30 border-none h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
            </div>

            <Button type="submit" className="w-full h-14 font-black text-lg shadow-xl" disabled={isSubmitting}>
              {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    REGISTERING PARTNER...
                  </>
              ) : "COMPLETE REGISTRATION"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
