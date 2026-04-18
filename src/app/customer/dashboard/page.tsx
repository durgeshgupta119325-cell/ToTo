
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import { LogOut, User, History, ArrowRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';

type Ride = {
  rideId: string;
  date: string;
  from: string;
  to: string;
  fare: string;
};

type Customer = {
  name: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  rides: Ride[];
};

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const storedCustomer = localStorage.getItem('toto-customer');
    if (storedCustomer) {
      try {
        setCustomer(JSON.parse(storedCustomer));
      } catch (error) {
        console.error("Failed to parse customer data from localStorage", error);
        localStorage.removeItem('toto-customer');
        router.push('/customer/login');
      }
    } else {
      router.push('/customer/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('toto-customer');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/');
  };

  if (!customer) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-secondary">
        <p>Loading your dashboard...</p>
      </div>
    );
  }


  return (
    <div className="flex min-h-dvh flex-col bg-secondary">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Icons.TotoLogo className="h-6 w-auto text-primary" />
            <span className="font-bold">Customer Dashboard</span>
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-4xl space-y-8">
           <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome, {customer.name}!</h1>
                    <p className="text-muted-foreground">Manage your profile and view your ride history.</p>
                </div>
                <Button asChild size="lg">
                    <Link href="/book-ride">Book a New Ride <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Your Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div>
                            <p className="font-semibold text-muted-foreground">Name</p>
                            <p>{customer.name}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-muted-foreground">Email</p>
                            <p>{customer.email}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-muted-foreground">Mobile</p>
                            <p>{customer.mobile}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-muted-foreground">Address</p>
                            <p>{customer.address}, {customer.city}, {customer.state} - {customer.pincode}</p>
                        </div>
                         <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                           <Link href="/customer/login?edit=true">Edit Profile</Link>
                         </Button>
                    </CardContent>
                </Card>
                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" /> Ride History</CardTitle>
                        <CardDescription>A log of your past rides.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>From</TableHead>
                                    <TableHead>To</TableHead>
                                    <TableHead className="text-right">Fare</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customer.rides.length > 0 ? (
                                  customer.rides.map((ride) => (
                                    <TableRow key={ride.rideId}>
                                        <TableCell className="font-medium">{ride.date}</TableCell>
                                        <TableCell>{ride.from}</TableCell>
                                        <TableCell>{ride.to}</TableCell>
                                        <TableCell className="text-right">{ride.fare}</TableCell>
                                    </TableRow>
                                  ))
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={4} className="text-center">You have no ride history yet.</TableCell>
                                  </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
