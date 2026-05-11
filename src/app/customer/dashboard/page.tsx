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
import { LogOut, User, History, ArrowRight, ShieldCheck, MapPin, Calendar, Smartphone, Mail } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

type Ride = {
  rideId: string;
  date: string;
  from: string;
  to: string;
  fare: string;
};

type Customer = {
  uid: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  role: string;
  profilePic: string;
  isBlocked: boolean;
  createdAt: string;
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
    <div className="flex min-h-dvh flex-col bg-secondary/20">
      <header className="sticky top-0 z-40 border-b bg-background shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Icons.TotoLogo className="h-6 w-auto text-primary" />
            <span className="font-bold hidden md:inline">TOTO Rider</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-6xl space-y-8">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 border-4 border-primary/20 shadow-xl">
                        <AvatarImage src={customer.profilePic} />
                        <AvatarFallback className="bg-primary/10 text-primary font-black text-2xl">
                            {customer.name[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-black tracking-tighter">Namaste, {customer.name.split(' ')[0]}!</h1>
                            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200 border-none px-2 uppercase text-[10px] font-bold">
                                {customer.role}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">Manage your urban transit and profile.</p>
                    </div>
                </div>
                <Button asChild size="lg" className="h-14 px-8 text-lg font-black shadow-lg shadow-primary/20">
                    <Link href="/book-ride">Book a Ride <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-1 border-none shadow-sm overflow-hidden">
                    <CardHeader className="bg-primary/5 pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg"><User className="h-5 w-5 text-primary" /> Profile ID: <span className="font-mono text-xs font-normal">{customer.uid}</span></CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Phone</p>
                                    <p className="text-sm font-bold">{customer.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="truncate">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Email</p>
                                    <p className="text-sm font-bold truncate">{customer.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Location</p>
                                    <p className="text-sm font-bold">{customer.city}, {customer.state}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Member Since</p>
                                    <p className="text-sm font-bold">{new Date(customer.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>
                        <Button asChild variant="secondary" className="w-full font-bold">
                           <Link href="/customer/login?edit=true">Edit Account Details</Link>
                        </Button>
                    </CardContent>
                </Card>

                 <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                        <div>
                            <CardTitle className="flex items-center gap-2"><History className="h-5 w-5 text-primary" /> Trip Log</CardTitle>
                            <CardDescription>History of your recent urban movements.</CardDescription>
                        </div>
                        <ShieldCheck className="h-10 w-10 text-primary/20" />
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-bold">Date</TableHead>
                                    <TableHead className="font-bold">Pickup</TableHead>
                                    <TableHead className="font-bold">Destination</TableHead>
                                    <TableHead className="text-right font-bold">Fare Paid</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customer.rides && customer.rides.length > 0 ? (
                                  customer.rides.map((ride) => (
                                    <TableRow key={ride.rideId} className="group transition-colors">
                                        <TableCell className="font-medium text-xs">
                                            {ride.date}
                                        </TableCell>
                                        <TableCell className="text-xs group-hover:font-medium transition-all">{ride.from}</TableCell>
                                        <TableCell className="text-xs group-hover:font-medium transition-all">{ride.to}</TableCell>
                                        <TableCell className="text-right font-black text-primary">{ride.fare}</TableCell>
                                    </TableRow>
                                  ))
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground italic">
                                        Your urban journey starts here. Book your first ride!
                                    </TableCell>
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