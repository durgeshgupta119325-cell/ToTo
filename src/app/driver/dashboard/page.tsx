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
import { LogOut, Car, IndianRupee, Star } from 'lucide-react';

export default function DriverDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/driver/login');
  };

  // Dummy data for dashboard stats
  const dashboardStats = {
    rides: 12,
    earnings: 1540,
    rating: 4.8,
  };

  return (
    <div className="flex min-h-dvh flex-col bg-secondary">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/driver/dashboard" className="flex items-center gap-2">
            <Icons.TotoLogo className="h-6 w-auto text-primary" />
            <span className="font-bold">Driver Dashboard</span>
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-4xl space-y-8">
           <div>
                <h1 className="text-3xl font-bold tracking-tight">Today's Summary</h1>
                <p className="text-muted-foreground">A quick overview of your performance today.</p>
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
