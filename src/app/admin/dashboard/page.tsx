
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
import {
  LogOut,
  Users,
  Car,
  Globe,
  Plus,
  Activity,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Star,
  BadgeCheck,
  ReceiptIndianRupee,
  Loader2,
  MessageSquare
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useState, useMemo, useEffect } from 'react';
import { useFirestore, useCollectionData, useUser, useAuth } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { BOOK_RIDE_SERVICE_AREAS, DUMMY_DRIVERS, DUMMY_CUSTOMERS, DUMMY_LOCATIONS_DATA } from '@/lib/mock-data';

export default function AdminDashboardPage() {
  const router = useRouter();
  const db = useFirestore();
  const auth = useAuth();
  const { user, loading: authLoading } = useUser();
  const { toast } = useToast();

  const [newHub, setNewHub] = useState({ state: '', city: '', range: '10' });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  // Live Subscriptions
  const liveRidesQuery = useMemo(() => query(collection(db, 'rides'), orderBy('createdAt', 'desc'), limit(50)), [db]);
  const { data: liveRides, loading: ridesLoading } = useCollectionData(liveRidesQuery);

  const txQuery = useMemo(() => query(collection(db, 'transactions'), orderBy('createdAt', 'desc'), limit(50)), [db]);
  const { data: transactions, loading: txLoading } = useCollectionData(txQuery);

  const reviewsQuery = useMemo(() => query(collection(db, 'reviews'), orderBy('createdAt', 'desc'), limit(50)), [db]);
  const { data: reviews, loading: reviewsLoading } = useCollectionData(reviewsQuery);

  const stats = useMemo(() => {
    if (!liveRides || !transactions) return { totalRides: 0, grossVolume: 0, activeCount: 0, netRevenue: 0 };
    const completed = liveRides.filter((r: any) => r.status === 'completed');
    const active = liveRides.filter((r: any) => r.status !== 'completed' && r.status !== 'cancelled');
    const gross = completed.reduce((acc: number, r: any) => acc + (r.fare || 0), 0);
    const revenue = transactions.filter((tx: any) => tx.type === 'debit').reduce((acc: number, tx: any) => acc + (tx.amount * 0.2), 0);
    
    return { 
      totalRides: completed.length, 
      grossVolume: gross,
      activeCount: active.length,
      netRevenue: revenue
    };
  }, [liveRides, transactions]);

  const handleLogout = async () => {
    await auth.signOut();
    toast({ title: 'Logged Out' });
    router.push('/admin/login');
  };

  const allStates = useMemo(() => Array.from(new Set(DUMMY_LOCATIONS_DATA.map(l => l.state))).sort(), []);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-secondary/20">
      <header className="sticky top-0 z-40 border-b bg-background shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Icons.TotoLogo className="h-6 w-auto text-primary" />
            <span className="font-bold hidden md:inline">Command Console</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right mr-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Administrator</p>
              <p className="text-xs font-bold truncate max-w-[150px]">{user?.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black tracking-tighter">System Intelligence</h1>
              <p className="text-sm text-muted-foreground font-medium">Monitoring urban mobility and platform performance.</p>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-background border h-11 w-full justify-start overflow-x-auto p-1 shadow-inner">
              <TabsTrigger value="overview" className="gap-2"><LayoutDashboard className="h-4 w-4" /> Monitor</TabsTrigger>
              <TabsTrigger value="ledger" className="gap-2"><ReceiptIndianRupee className="h-4 w-4" /> Ledger</TabsTrigger>
              <TabsTrigger value="reviews" className="gap-2"><MessageSquare className="h-4 w-4" /> Reviews</TabsTrigger>
              <TabsTrigger value="hubs" className="gap-2"><Globe className="h-4 w-4" /> Geography</TabsTrigger>
              <TabsTrigger value="drivers" className="gap-2"><Car className="h-4 w-4" /> Partners</TabsTrigger>
              <TabsTrigger value="customers" className="gap-2"><Users className="h-4 w-4" /> Riders</TabsTrigger>
              <TabsTrigger value="settings" className="gap-2"><Settings className="h-4 w-4" /> Protocol</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-4">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Nodes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{stats.activeCount}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Gross Volume</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-primary">₹{stats.grossVolume.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-primary/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-primary uppercase tracking-widest">Net Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">₹{stats.netRevenue.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Fleet</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{DUMMY_DRIVERS.length}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> Live Activity Monitor</CardTitle>
                        <CardDescription>Real-time verification of trip handshake codes across the city.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ride ID</TableHead>
                                    <TableHead>Pickup</TableHead>
                                    <TableHead>Fare</TableHead>
                                    <TableHead>OTP</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Code Used</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {liveRides?.map((ride: any) => (
                                    <TableRow key={ride.id}>
                                        <TableCell className="font-bold text-xs font-mono">{ride.rideId}</TableCell>
                                        <TableCell className="text-xs max-w-[200px] truncate">{ride.pickup?.address}</TableCell>
                                        <TableCell className="text-xs font-bold">₹{ride.fare}</TableCell>
                                        <TableCell className="font-black text-primary tracking-widest">{ride.otp}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                                                {ride.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {ride.otpUsed ? <BadgeCheck className="h-5 w-5 text-green-500 inline-block" /> : <Clock className="h-5 w-5 text-muted-foreground inline-block" />}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Customer Feedback</CardTitle>
                        <CardDescription>Direct quality insights from recent urban movements.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Ride ID</TableHead>
                                    <TableHead>Comment</TableHead>
                                    <TableHead className="text-right">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reviews?.map((review: any) => (
                                    <TableRow key={review.id}>
                                        <TableCell>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={cn("h-3 w-3", i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30")} />
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs font-mono">{review.rideId}</TableCell>
                                        <TableCell className="text-xs italic text-muted-foreground max-w-[300px] truncate">"{review.comment}"</TableCell>
                                        <TableCell className="text-right text-[10px] font-mono">{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="ledger" className="space-y-6">
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Global Ledger</CardTitle>
                        <CardDescription>Comprehensive audit trail of all financial movements.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>TXN ID</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Timestamp</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions?.map((tx: any) => (
                                    <TableRow key={tx.id}>
                                        <TableCell className="font-mono text-[10px]">{tx.transactionId}</TableCell>
                                        <TableCell>
                                            <Badge variant={tx.type === 'credit' ? 'default' : 'secondary'} className={cn("text-[9px] uppercase", tx.type === 'credit' ? "bg-green-500" : "bg-red-500")}>
                                                {tx.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-bold">₹{tx.amount}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{tx.description}</TableCell>
                                        <TableCell className="text-right text-[10px] font-mono">{new Date(tx.createdAt).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="hubs" className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Geographic Nodes</h2>
                        <p className="text-xs text-muted-foreground font-medium">Urban operational sectors and service ranges.</p>
                    </div>
                </div>
                <Card className="border-none shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Urban Sector</TableHead>
                                <TableHead>Territory</TableHead>
                                <TableHead>Range</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {BOOK_RIDE_SERVICE_AREAS.map((area, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-bold">{area.city}</TableCell>
                                    <TableCell>{area.state}</TableCell>
                                    <TableCell>{area.range} KM</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant={area.active ? 'default' : 'secondary'} className={cn(area.active && "bg-green-500")}>
                                            {area.active ? 'Active' : 'Offline'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </TabsContent>

            <TabsContent value="drivers" className="space-y-6">
                <Card className="border-none shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Partner</TableHead>
                                <TableHead>Vehicle</TableHead>
                                <TableHead>Performance</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {DUMMY_DRIVERS.map(d => (
                                <TableRow key={d.driverId}>
                                    <TableCell className="text-sm font-bold">{d.name}</TableCell>
                                    <TableCell className="text-xs uppercase">{d.vehicleNumber} ({d.vehicleType})</TableCell>
                                    <TableCell className="text-xs flex items-center gap-1 font-bold"><Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /> {d.rating}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="outline" className="text-[10px] font-bold uppercase">{d.kycVerified ? 'Verified' : 'Pending'}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </TabsContent>

            <TabsContent value="customers" className="space-y-6">
                <Card className="border-none shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rider</TableHead>
                                <TableHead>Hub</TableHead>
                                <TableHead>Risk Protocol</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {DUMMY_CUSTOMERS.map(c => (
                                <TableRow key={c.uid}>
                                    <TableCell className="text-sm font-bold">{c.name}</TableCell>
                                    <TableCell className="text-xs">{c.city}</TableCell>
                                    <TableCell>
                                        <Badge variant={c.isBlocked ? 'destructive' : 'secondary'} className="text-[9px] uppercase">
                                            {c.isBlocked ? 'Blocked' : 'Safe'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-8">
                <div className="grid gap-8 md:grid-cols-2">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Monetary Policy</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Standard Fare (₹/KM)</Label>
                                <Input defaultValue="15" type="number" />
                            </div>
                            <Button className="w-full h-11 font-bold">Synchronize Rates</Button>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Protocol Fee</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Global Commission (%)</Label>
                                <Input defaultValue="20" type="number" />
                            </div>
                            <Button variant="secondary" className="w-full h-11 font-bold">Apply Logic</Button>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
