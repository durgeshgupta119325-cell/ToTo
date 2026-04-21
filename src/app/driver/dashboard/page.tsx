
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import { Car, IndianRupee, Star, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type Driver = {
  id: string;
  name: string;
  gender: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  vehicleType: string;
  vehicleNumber: string;
  accountNumber: string;
  grossEarnings: number;
  photoUrl: string;
  idProofUrl: string;
};

export default function DriverDashboardPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [driver, setDriver] = useState<Driver | null>(null);

  useEffect(() => {
    const storedDriver = localStorage.getItem('toto-driver');
    if (storedDriver) {
      try {
        setDriver(JSON.parse(storedDriver));
      } catch (error) {
        console.error("Failed to parse driver data from localStorage", error);
        localStorage.removeItem('toto-driver');
        router.push('/driver/login');
      }
    } else {
      router.push('/driver/login');
    }
  }, [router]);

  const handleOnlineToggle = (online: boolean) => {
    setIsOnline(online);
    toast({
      title: `You are now ${online ? 'Online' : 'Offline'}`,
      description: online
        ? 'You will now receive new ride requests.'
        : 'You will not receive ride requests until you go online.',
    });
  };

  // Dummy data for dashboard stats
  const dashboardStats = {
    rides: 12,
    earnings: 1540,
    rating: 4.8,
  };

  if (!driver) {
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
          <Link href="/driver/dashboard" className="flex items-center gap-2">
            <Icons.TotoLogo className="h-6 w-auto text-primary" />
            <span className="font-bold">Driver Dashboard</span>
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-4xl space-y-8">
           <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome, {driver.name}!</h1>
                    <p className="text-muted-foreground">A quick overview of your performance today.</p>
                </div>
                 <div className="flex items-center space-x-3 rounded-lg border bg-card p-3 shadow-sm">
                    <Label htmlFor="online-status" className="font-medium text-card-foreground">
                        {isOnline ? 'Online' : 'Offline'}
                    </Label>
                    <Switch
                        id="online-status"
                        checked={isOnline}
                        onCheckedChange={handleOnlineToggle}
                    />
                </div>
            </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Rides
                </CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.rides}</div>
                <p className="text-xs text-muted-foreground">
                  +2 from yesterday
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Earnings
                </CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{dashboardStats.earnings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +5.2% from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Your Rating</CardTitle>
                 <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{dashboardStats.rating}</div>
                 <div className="flex items-center">
                    {[...Array(5)].map((_, i) => {
                        const ratingValue = i + 1;
                        return (
                             <Star key={i} className={`h-5 w-5 ${ratingValue <= dashboardStats.rating ? 'text-primary fill-primary' : 'text-muted-foreground/30'}`} />
                        )
                    })}
                 </div>
                 <p className="text-xs text-muted-foreground mt-2">Based on your last 50 rides</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
