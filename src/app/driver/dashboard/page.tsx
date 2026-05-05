
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import { Car, IndianRupee, Star, Home, Eye, MapPin, CheckCircle2, User, Timer, Navigation, Wallet, TrendingUp, History, Percent, LayoutDashboard } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useFirestore, useUser, useCollectionData } from '@/firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, limit, orderBy } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Ride = {
  id: string;
  customerId: string;
  customerName: string;
  pickup: string;
  destination: string;
  fare: number;
  status: 'pending' | 'searching_all' | 'accepted' | 'arrived' | 'started' | 'completed';
  otp: string;
  type: string;
  paymentStatus: string;
  paymentMode: string;
  timestamp: any;
};

export default function DriverDashboardPage() {
  const { toast } = useToast();
  const router = useRouter();
  const db = useFirestore();
  const { user } = useUser();
  
  const [isOnline, setIsOnline] = useState(true);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [incomingRequest, setIncomingRequest] = useState<Ride | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Fetch all completed rides for earnings history
  const completedRidesQuery = useMemo(() => {
    if (!user) return null;
    return query(
      collection(db, 'rides'),
      where('driverId', '==', user.uid),
      where('status', '==', 'completed'),
      orderBy('timestamp', 'desc')
    );
  }, [user, db]);

  const { data: rideHistory } = useCollectionData(completedRidesQuery);

  // Stats calculation
  const stats = useMemo(() => {
    if (!rideHistory) return { gross: 0, net: 0, commission: 0, count: 0 };
    const gross = rideHistory.reduce((acc, r: any) => acc + (r.fare || 0), 0);
    const commissionRate = 0.20; // 20% platform commission
    const commission = gross * commissionRate;
    const net = gross - commission;
    return { gross, net, commission, count: rideHistory.length };
  }, [rideHistory]);

  useEffect(() => {
    if (!isOnline || !user || activeRide) return;

    const q = query(
      collection(db, 'rides'),
      where('status', 'in', ['pending', 'searching_all']),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const ride = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Ride;
        setIncomingRequest(ride);
      } else {
        setIncomingRequest(null);
      }
    }, (err) => {
        const permissionError = new FirestorePermissionError({
          path: 'rides',
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
    });

    return () => unsubscribe();
  }, [isOnline, user, db, activeRide]);

  useEffect(() => {
    if (!activeRide || !db) return;

    const unsubscribe = onSnapshot(doc(db, 'rides', activeRide.id), (snapshot) => {
        if (snapshot.exists()) {
            setActiveRide({ id: snapshot.id, ...snapshot.data() } as Ride);
        } else {
            setActiveRide(null);
        }
    });

    return () => unsubscribe();
  }, [activeRide?.id, db]);

  const handleOnlineToggle = (online: boolean) => {
    setIsOnline(online);
    toast({
      title: `You are now ${online ? 'Online' : 'Offline'}`,
      description: online ? 'Receiving new ride requests.' : 'Requests paused.',
    });
  };

  const handleAcceptRide = () => {
    if (!incomingRequest || !user) return;

    const rideRef = doc(db, 'rides', incomingRequest.id);
    updateDoc(rideRef, {
        status: 'accepted',
        driverId: user.uid,
        driverName: user.displayName || 'TOTO Driver',
        acceptedAt: new Date().toISOString()
    }).then(() => {
        setActiveRide(incomingRequest);
        setIncomingRequest(null);
        toast({ title: "Ride Accepted", description: "Navigate to pickup location." });
    }).catch(async (err) => {
        const permissionError = new FirestorePermissionError({
            path: `rides/${incomingRequest.id}`,
            operation: 'update',
        });
        errorEmitter.emit('permission-error', permissionError);
    });
  };

  const handleArrived = () => {
    if (!activeRide) return;
    updateDoc(doc(db, 'rides', activeRide.id), { status: 'arrived' });
  };

  const handleVerifyOtp = () => {
    if (!activeRide || !otpInput) return;
    
    setIsVerifying(true);
    if (otpInput === activeRide.otp) {
        updateDoc(doc(db, 'rides', activeRide.id), { status: 'started' }).then(() => {
            toast({ title: "OTP Verified", description: "Trip started. Drive safely!" });
            setOtpInput('');
        });
    } else {
        toast({ variant: "destructive", title: "Invalid OTP", description: "Please ask the customer for the correct code." });
    }
    setIsVerifying(false);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-secondary/30">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/driver/dashboard" className="flex items-center gap-2">
            <Icons.TotoLogo className="h-6 w-auto text-primary" />
            <span className="font-bold">Driver Portal</span>
          </Link>
          <div className="flex items-center gap-4">
             <div className="flex items-center space-x-2 bg-muted px-3 py-1 rounded-full text-xs border">
                <span className={cn("h-2 w-2 rounded-full", isOnline ? "bg-green-500 animate-pulse" : "bg-red-500")} />
                <span className="font-semibold">{isOnline ? 'Online' : 'Resting'}</span>
                <Switch checked={isOnline} onCheckedChange={handleOnlineToggle} size="sm" />
            </div>
            <Button variant="ghost" size="sm" onClick={() => router.push('/')}><Home className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
              <TabsTrigger value="overview" className="gap-2"><LayoutDashboard className="h-4 w-4" /> Hub</TabsTrigger>
              <TabsTrigger value="earnings" className="gap-2"><Wallet className="h-4 w-4" /> Wallet & Earnings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-6">
                {incomingRequest && (
                  <Card className="border-4 border-primary shadow-2xl animate-in zoom-in-95">
                      <CardHeader className="bg-primary/5 pb-4">
                          <div className="flex items-center justify-between">
                              <Badge className="bg-primary text-black">New {incomingRequest.type} Request</Badge>
                              <div className="flex items-center gap-1 text-xs font-bold text-primary">
                                  <Timer className="h-3 w-3" /> 60s
                              </div>
                          </div>
                          <CardTitle className="text-2xl">Ride Request</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                          <div className="grid gap-6 md:grid-cols-2">
                              <div className="space-y-4">
                                  <div className="space-y-1">
                                      <p className="text-[10px] font-bold uppercase text-muted-foreground">Pick-up</p>
                                      <p className="font-bold flex items-start gap-2">
                                          <MapPin className="h-4 w-4 text-primary shrink-0" />
                                          {incomingRequest.pickup}
                                      </p>
                                  </div>
                                  <div className="space-y-1">
                                      <p className="text-[10px] font-bold uppercase text-muted-foreground">Drop-off</p>
                                      <p className="font-bold flex items-start gap-2">
                                          <MapPin className="h-4 w-4 text-destructive shrink-0" />
                                          {incomingRequest.destination}
                                      </p>
                                  </div>
                              </div>
                              <div className="flex flex-col justify-center items-center p-6 bg-muted/20 rounded-xl border border-dashed">
                                  <p className="text-sm font-medium text-muted-foreground">Est. Fare</p>
                                  <p className="text-4xl font-black text-primary">₹{incomingRequest.fare}</p>
                              </div>
                          </div>
                          <div className="mt-8 flex gap-3">
                              <Button variant="outline" className="flex-1 h-12" onClick={() => setIncomingRequest(null)}>Ignore</Button>
                              <Button className="flex-1 h-12 text-lg font-bold" onClick={handleAcceptRide}>Accept Now</Button>
                          </div>
                      </CardContent>
                  </Card>
                )}

                {activeRide && (
                  <Card className="border-2 border-primary shadow-lg overflow-hidden">
                      <div className="bg-primary text-black px-6 py-2 flex items-center justify-between font-bold text-xs uppercase tracking-widest">
                          <span>Active Trip: {activeRide.id}</span>
                          <span>Status: {activeRide.status}</span>
                      </div>
                      <CardContent className="p-6">
                          <div className="grid gap-8 md:grid-cols-2">
                              <div className="space-y-6">
                                  <div className="flex items-center gap-4">
                                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                          <User className="h-6 w-6 text-primary" />
                                      </div>
                                      <div>
                                          <h3 className="font-bold text-lg">{activeRide.customerName}</h3>
                                          <p className="text-xs text-muted-foreground">Customer Verified</p>
                                      </div>
                                  </div>
                                  <div className="space-y-4 pl-1 border-l-2 border-primary/20 ml-6">
                                      <div className="relative pl-6">
                                          <div className="absolute left-[-5px] top-1 h-2 w-2 rounded-full bg-primary" />
                                          <p className="text-xs text-muted-foreground uppercase font-bold">Pick-up</p>
                                          <p className="text-sm font-semibold">{activeRide.pickup}</p>
                                      </div>
                                      <div className="relative pl-6">
                                          <div className="absolute left-[-5px] top-1 h-2 w-2 rounded-full bg-destructive" />
                                          <p className="text-xs text-muted-foreground uppercase font-bold">Drop-off</p>
                                          <p className="text-sm font-semibold">{activeRide.destination}</p>
                                      </div>
                                  </div>
                              </div>

                              <div className="space-y-6 flex flex-col justify-center">
                                  {activeRide.status === 'accepted' && (
                                      <Button size="lg" className="h-16 text-xl font-bold w-full" onClick={handleArrived}>
                                          <Navigation className="mr-2 h-6 w-6" />
                                          Arrived at Pickup
                                      </Button>
                                  )}

                                  {(activeRide.status === 'arrived') && (
                                      <div className="space-y-4 animate-in slide-in-from-bottom-2">
                                          <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-xl text-center">
                                              <p className="text-xs font-bold text-yellow-800 uppercase mb-2">Verify Customer</p>
                                              <p className="text-sm text-yellow-700">Ask for the 4-digit code to start the trip.</p>
                                          </div>
                                          <div className="flex gap-2">
                                              <Input 
                                                  placeholder="XXXX" 
                                                  className="h-16 text-center text-3xl font-black tracking-[0.5em] border-2" 
                                                  maxLength={4}
                                                  value={otpInput}
                                                  onChange={(e) => setOtpInput(e.target.value)}
                                              />
                                              <Button 
                                                  className="h-16 px-8 text-lg font-bold" 
                                                  disabled={otpInput.length !== 4 || isVerifying}
                                                  onClick={handleVerifyOtp}
                                              >
                                                  Verify
                                              </Button>
                                          </div>
                                      </div>
                                  )}

                                  {activeRide.status === 'started' && (
                                      <div className="text-center space-y-4 py-8">
                                          <div className="mx-auto h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                                              <TrendingUp className="h-12 w-12 text-green-600 animate-pulse" />
                                          </div>
                                          <div>
                                              <h3 className="text-xl font-bold">In Transit</h3>
                                              <p className="text-sm text-muted-foreground">Destination: {activeRide.destination}</p>
                                          </div>
                                          <Button className="w-full h-12" onClick={() => setActiveRide(null)}>End Trip (Demo Only)</Button>
                                      </div>
                                  )}
                              </div>
                          </div>
                      </CardContent>
                  </Card>
                )}

                {!incomingRequest && !activeRide && (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Today's Wallet</CardTitle>
                            <Wallet className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">₹{stats.net.toLocaleString()}</div>
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                                < trending-up className="h-3 w-3 text-green-500" /> +₹450 from last trip
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Trips Done</CardTitle>
                            <Car className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{stats.count}</div>
                            <p className="text-[10px] text-muted-foreground mt-1">Next target: 15 trips</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Rating</CardTitle>
                            <Star className="h-4 w-4 text-primary fill-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">4.8</div>
                            <p className="text-[10px] text-muted-foreground mt-1">Top 10% performance</p>
                        </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="earnings">
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="p-4 bg-background border rounded-xl shadow-sm text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Gross Fare</p>
                    <p className="text-xl font-black">₹{stats.gross.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-background border rounded-xl shadow-sm text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Platform (20%)</p>
                    <p className="text-xl font-black text-destructive">-₹{stats.commission.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-primary text-primary-foreground rounded-xl shadow-lg text-center">
                    <p className="text-[10px] font-bold opacity-80 uppercase mb-1">Net Earnings</p>
                    <p className="text-xl font-black">₹{stats.net.toLocaleString()}</p>
                  </div>
                   <div className="p-4 bg-background border rounded-xl shadow-sm text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Total Trips</p>
                    <p className="text-xl font-black">{stats.count}</p>
                  </div>
                </div>

                <Card className="border-none shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Trip-wise Earnings</CardTitle>
                      <CardDescription>Breakdown of your completed journeys today.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm"><History className="mr-2 h-4 w-4" /> Full History</Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead>Gross</TableHead>
                          <TableHead>Comm.</TableHead>
                          <TableHead className="text-right">Net Earned</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rideHistory && rideHistory.map((ride: any) => (
                          <TableRow key={ride.id}>
                            <TableCell className="font-bold">{ride.customerName}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-[10px] uppercase font-bold">{ride.paymentMode || 'UPI'}</Badge>
                            </TableCell>
                            <TableCell className="text-xs">₹{ride.fare}</TableCell>
                            <TableCell className="text-xs text-destructive">-₹{(ride.fare * 0.2).toFixed(0)}</TableCell>
                            <TableCell className="text-right font-black text-green-600">₹{(ride.fare * 0.8).toFixed(0)}</TableCell>
                          </TableRow>
                        ))}
                        {(!rideHistory || rideHistory.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No completed trips found yet.</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
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
