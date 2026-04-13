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


// Mock Data
const customer = {
    name: 'Anjali Sharma',
    email: 'anjali@example.com',
    phone: '9876543210',
};

const rideHistory = [
    {
        rideId: 'RIDE001',
        from: 'Connaught Place',
        to: 'India Gate',
        date: '2023-10-27',
        fare: '₹75',
    },
    {
        rideId: 'RIDE002',
        from: 'Cyber Hub',
        to: 'Ambience Mall',
        date: '2023-10-26',
        fare: '₹150',
    },
     {
        rideId: 'RIDE004',
        from: 'Hauz Khas Village',
        to: 'Select Citywalk',
        date: '2023-10-25',
        fare: '₹120',
    }
];


export default function CustomerDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/');
  };


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
                            <p className="font-semibold text-muted-foreground">Phone</p>
                            <p>{customer.phone}</p>
                        </div>
                         <Button variant="outline" size="sm" className="mt-4 w-full">Edit Profile</Button>
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
                                {rideHistory.map((ride) => (
                                <TableRow key={ride.rideId}>
                                    <TableCell className="font-medium">{ride.date}</TableCell>
                                    <TableCell>{ride.from}</TableCell>
                                    <TableCell>{ride.to}</TableCell>
                                    <TableCell className="text-right">{ride.fare}</TableCell>
                                </TableRow>
                                ))}
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
