
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
  Activity,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Clock,
  Star,
  BadgeCheck,
  ReceiptIndianRupee,
  Loader2,
  MessageSquare,
  TrendingUp,
  MapPin
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
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useState, useMemo, useEffect } from 'react';
import { useFirestore, useCollectionData, useUser, useAuth, useDocData } from '@/firebase';
import { collection, query, orderBy, limit, doc } from 'firebase/firestore';
import { BOOK_RIDE_SERVICE_AREAS, DUMMY_DRIVERS, DUMMY_CUSTOMERS } from '@/lib/mock-data';

export default function AdminDashboardPage() {
  const router = useRouter();
  const db = useFirestore();
  const auth = useAuth();
  const { user, loading: authLoading } = useUser();
  const { toast } = useToast();

  // Fetch user data to verify admin role
  const { data: userData, loading: userLoading } = useDocData(user ? doc(db, 'users', user.uid) : null);

  useEffect(() => {
    if (!authLoading && !userLoading) {
      if (!user) {
        router.push('/admin/login');
      } else if (userData && userData.role !== 'admin') {
        auth.signOut();
        toast({
          variant: 'destructive',
          title: 'Unauthorized Access',
          description: 'You do not have administrative privileges.',
        });
        router.push('/admin/login');
      }
    }
  }, [user, userData, authLoading, userLoading, router, auth, toast]);

  // Only run queries if user is fully authenticated and confirmed as admin
  const isAuthorized = useMemo(() => {
    return !authLoading && !userLoading && !!user && !!userData && userData.role === 'admin';
  }, [authLoading, userLoading, user, userData]);

  // Live Subscriptions - strictly guarded by isAuthorized
  const liveRidesQuery = useMemo(() => isAuthorized ? query(collection(db, 'rides'), orderBy('createdAt', 'desc'), limit(50)) : null, [db, isAuthorized]);
  const { data: liveRides, loading: ridesLoading } = useCollectionData(liveRidesQuery);

  const txQuery = useMemo(() => isAuthorized ? query(collection(db, 'transactions'), orderBy('createdAt', 'desc'), limit(50)) : null, [db, isAuthorized]);
  const { data: transactions, loading: txLoading } = useCollectionData(txQuery);

  const reviewsQuery = useMemo(() => isAuthorized ? query(collection(db, 'reviews'), orderBy('createdAt', 'desc'), limit(50)) : null, [db, isAuthorized]);
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

  if (authLoading || userLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Authenticating Command...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
      return null;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-secondary/10">
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
            <Button variant="outline" size="sm" onClick={handleLogout} className="font-bold">
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase italic">System Intelligence</h1>
              <p className="text-sm text-muted-foreground font-medium">Monitoring urban mobility and platform performance in real-time.</p>
            </div>
            <div className="flex items-center gap-2 bg-background p-2 rounded-xl border shadow-sm">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-tighter">Protocol Secure</span>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-background border h-12 w-full justify-start overflow-x-auto p-1 shadow-sm rounded-xl">
              <TabsTrigger value="overview" className="gap-2 font-bold data-[state=active]:bg-primary/10 data-[state=active]:text-primary"><LayoutDashboard className="h-4 w-4" /> Monitor</TabsTrigger>
              <TabsTrigger value="ledger" className="gap-2 font-bold data-[state=active]:bg-primary/10 data-[state=active]:text-primary"><ReceiptIndianRupee className="h-4 w-4" /> Ledger</TabsTrigger>
              <TabsTrigger value="reviews" className="gap-2 font-bold data-[state=active]:bg-primary/10 data-[state=active]:text-primary"><MessageSquare className="h-4 w-4" /> Reviews</TabsTrigger>
              <TabsTrigger value="hubs" className="gap-2 font-bold data-[state=active]:bg-primary/10 data-[state=active]:text-primary"><Globe className="h-4 w-4" /> Hubs</TabsTrigger>
              <TabsTrigger value="drivers" className="gap-2 font-bold data-[state=active]:bg-primary/10 data-[state=active]:text-primary"><Car className="h-4 w-4" /> Partners</TabsTrigger>
              <TabsTrigger value="customers" className="gap-2 font-bold data-[state=active]:bg-primary/10 data-[state=active]:text-primary"><Users className="h-4 w-4" /> Riders</TabsTrigger>
              <TabsTrigger value="settings" className="gap-2 font-bold data-[state=active]:bg-primary/10 data-[state=active]:text-primary"><Settings className="h-4 w-4" /> Rates</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 animate-in fade-in duration-500">
                <div className="grid gap-6 md:grid-cols-4">
                    <Card className="border-none shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Activity className="h-12 w-12" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Nodes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{stats.activeCount}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp className="h-12 w-12" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Gross Volume</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-primary">₹{stats.grossVolume.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-primary/5 relative overflow-hidden group border-l-4 border-l-primary">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black text-primary uppercase tracking-widest">Net Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">₹{stats.netRevenue.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm relative overflow-hidden group">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Fleet Size</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{DUMMY_DRIVERS.length}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader className="bg-background border-b px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> Live Activity Monitor</CardTitle>
                                <CardDescription className="text-xs font-medium">Monitoring trip handshakes and real-time status updates.</CardDescription>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Streaming</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="text-[10px] font-black uppercase">Ride ID</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase">Pickup Sector</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase">Fare</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase">OTP</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase">Status</TableHead>
                                    <TableHead className="text-right text-[10px] font-black uppercase">Verification</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {liveRides?.map((ride: any) => (
                                    <TableRow key={ride.id} className="hover:bg-muted/10 transition-colors">
                                        <TableCell className="font-bold text-xs font-mono">{ride.rideId}</TableCell>
                                        <TableCell className="text-xs max-w-[200px] truncate font-medium">{ride.pickup?.address}</TableCell>
                                        <TableCell className="text-xs font-black">₹{ride.fare}</TableCell>
                                        <TableCell className="font-black text-primary tracking-widest">{ride.otp}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="text-[9px] uppercase font-black bg-secondary">
                                                {ride.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {ride.otpUsed ? <BadgeCheck className="h-5 w-5 text-green-500 inline-block" /> : <Clock className="h-5 w-5 text-muted-foreground/30 inline-block" />}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {(!liveRides || liveRides.length === 0) && !ridesLoading && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-16 text-muted-foreground italic text-sm">No active urban movements detected.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6 animate-in fade-in duration-500">
                <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader className="bg-background border-b px-6 py-4">
                        <CardTitle className="text-lg">Consumer Feedback Logs</CardTitle>
                        <CardDescription className="text-xs">Direct quality insights from recently completed trips.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="text-[10px] font-black uppercase">Rating</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase">Ride ID</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase">Commentary</TableHead>
                                    <TableHead className="text-right text-[10px] font-black uppercase">Timestamp</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reviews?.map((review: any) => (
                                    <TableRow key={review.id} className="hover:bg-muted/10 transition-colors">
                                        <TableCell>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={cn("h-3 w-3", i < review.rating ? "text-primary fill-primary" : "text-muted-foreground/20")} />
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs font-mono font-bold">{review.rideId}</TableCell>
                                        <TableCell className="text-xs italic text-muted-foreground max-w-[300px] truncate font-medium">"{review.comment}"</TableCell>
                                        <TableCell className="text-right text-[10px] font-mono text-muted-foreground">{new Date(review.createdAt).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                                {(!reviews || reviews.length === 0) && !reviewsLoading && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-16 text-muted-foreground italic text-sm">Quality logs are currently empty.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="ledger" className="space-y-6 animate-in fade-in duration-500">
                <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader className="bg-background border-b px-6 py-4">
                        <CardTitle className="text-lg">System Ledger</CardTitle>
                        <CardDescription className="text-xs">Comprehensive audit trail of all financial handshake events.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="text-[10px] font-black uppercase">Transaction ID</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase">Vector</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase">Value</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase">Event Description</TableHead>
                                    <TableHead className="text-right text-[10px] font-black uppercase">Date Recorded</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions?.map((tx: any) => (
                                    <TableRow key={tx.id} className="hover:bg-muted/10 transition-colors">
                                        <TableCell className="font-mono text-[10px] font-bold">{tx.transactionId}</TableCell>
                                        <TableCell>
                                            <Badge variant={tx.type === 'credit' ? 'default' : 'secondary'} className={cn("text-[9px] font-black uppercase tracking-tighter", tx.type === 'credit' ? "bg-green-500" : "bg-red-500")}>
                                                {tx.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-black text-sm">₹{tx.amount}</TableCell>
                                        <TableCell className="text-[11px] text-muted-foreground font-medium">{tx.description}</TableCell>
                                        <TableCell className="text-right text-[10px] font-mono font-bold text-muted-foreground">{new Date(tx.createdAt).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                                {(!transactions || transactions.length === 0) && !txLoading && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-16 text-muted-foreground italic text-sm">Financial ledger currently inactive.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="hubs" className="space-y-6 animate-in fade-in duration-500">
                <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader className="bg-background border-b px-6 py-4">
                        <CardTitle className="text-lg">Operational Sectors</CardTitle>
                        <CardDescription className="text-xs">City-wide hubs and designated operational ranges.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="text-[10px] font-black uppercase">Urban Center</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase">Territory</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase">Operational Range</TableHead>
                                    <TableHead className="text-right text-[10px] font-black uppercase">Protocol Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {BOOK_RIDE_SERVICE_AREAS.map((area, idx) => (
                                    <TableRow key={idx} className="hover:bg-muted/10 transition-colors">
                                        <TableCell className="font-black italic">{area.city}</TableCell>
                                        <TableCell className="text-sm font-medium">{area.state}</TableCell>
                                        <TableCell className="text-sm font-black">{area.range} KM</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant={area.active ? 'default' : 'secondary'} className={cn("font-black text-[9px] uppercase", area.active && "bg-green-500")}>
                                                {area.active ? 'Active' : 'Offline'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="drivers" className="space-y-6 animate-in fade-in duration-500">
                <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader className="bg-background border-b px-6 py-4">
                        <CardTitle className="text-lg">Partner Directory</CardTitle>
                        <CardDescription className="text-xs">List of professional partners integrated into the urban network.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="text-[10px] font-black uppercase">Partner Name</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase">Vehicle Intel</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase">Rating</TableHead>
                                    <TableHead className="text-right text-[10px] font-black uppercase">Protocol Verification</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {DUMMY_DRIVERS.map(d => (
                                    <TableRow key={d.driverId} className="hover:bg-muted/10 transition-colors">
                                        <TableCell className="text-sm font-black">{d.name}</TableCell>
                                        <TableCell className="text-xs uppercase font-mono">{d.vehicleNumber} <span className="text-muted-foreground italic">({d.vehicleType})</span></TableCell>
                                        <TableCell className="text-xs flex items-center gap-1 font-black"><Star className="h-3 w-3 text-primary fill-primary" /> {d.rating}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter">{d.kycVerified ? 'Verified' : 'Pending Review'}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="customers" className="space-y-6 animate-in fade-in duration-500">
                <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader className="bg-background border-b px-6 py-4">
                        <CardTitle className="text-lg">Rider Intel</TableHead>
                        <CardDescription className="text-xs">Active riders within the city hubs.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="text-[10px] font-black uppercase">Rider Identity</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase">Assigned Hub</TableHead>
                                    <TableHead className="text-right text-[10px] font-black uppercase">Risk Protocol</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {DUMMY_CUSTOMERS.map(c => (
                                    <TableRow key={c.uid} className="hover:bg-muted/10 transition-colors">
                                        <TableCell className="text-sm font-black">{c.name}</TableCell>
                                        <TableCell className="text-xs font-bold flex items-center gap-1"><MapPin className="h-3 w-3" /> {c.city}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant={c.isBlocked ? 'destructive' : 'secondary'} className="text-[9px] font-black uppercase">
                                                {c.isBlocked ? 'Sanctioned' : 'Compliant'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-8 animate-in fade-in duration-500">
                <div className="grid gap-8 md:grid-cols-2">
                    <Card className="border-none shadow-sm relative overflow-hidden">
                        <div className="absolute -bottom-4 -right-4 opacity-5 text-primary">
                            <ReceiptIndianRupee className="h-24 w-24" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-lg font-black uppercase italic">Fare Policy</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Base Rate (₹/KM)</Label>
                                <Input defaultValue="15" type="number" className="h-12 border-none bg-secondary/30 font-black text-xl" />
                            </div>
                            <Button className="w-full h-14 font-black shadow-lg shadow-primary/20">Synchronize Urban Rates</Button>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm relative overflow-hidden">
                        <div className="absolute -bottom-4 -right-4 opacity-5 text-primary">
                            <ShieldCheck className="h-24 w-24" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-lg font-black uppercase italic">Protocol Fee</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Commission Percentage (%)</Label>
                                <Input defaultValue="20" type="number" className="h-12 border-none bg-secondary/30 font-black text-xl" />
                            </div>
                            <Button variant="secondary" className="w-full h-14 font-black">Apply Platform Logic</Button>
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
