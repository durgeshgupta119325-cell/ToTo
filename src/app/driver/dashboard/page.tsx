
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import { Car, IndianRupee, Star, Home, Eye, MapPin, CheckCircle2, User, Timer, Navigation, Wallet, TrendingUp, History, Percent, LayoutDashboard, Clock } from 'lucide-react';
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

  const stats = useMemo(() => {
    if (!rideHistory) return { gross: 0, net: 0, commission: 0, count: 0 };
    const gross = rideHistory.reduce((acc, r: any) => acc + (r.fare || 0), 0);
    const commission = gross * 0.20;
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
    toast({ title: online ? 'Online' : 'Offline' });
  };

  const handleAcceptRide = () => {
    if (!incomingRequest || !user) return;

    const rideRef = doc(db, 'rides', incomingRequest.id);
    updateDoc(rideRef, {
        status: 'accepted',
        driverId: user.uid,
        driverName: user.displayName || 'Ramesh',
        vehicleDetails: "KA-01-AB-1234, White Sedan"
    }).then(() => {
        setActiveRide(incomingRequest);
        setIncomingRequest(null);
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
        updateDoc(doc(db, 'rides', activeRide.id), { 
            status: 'started',
            otpUsed: true,
            verifiedAt: new Date().toISOString()
        }).then(() => {
            toast({ title: "Verified", description: "Trip started!" });
            setOtpInput('');
        });
    } else {
        toast({ variant: "destructive", title: "Invalid OTP" });
    }
    setIsVerifying(false);
  };

  const handleCompleteRide = () => {
    if (!activeRide) return;
    updateDoc(doc(db, 'rides', activeRide.id), { status: 'completed' }).then(() => {
        setActiveRide(null);
        toast({ title: "Ride Completed!" });
    });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-secondary/30">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Icons.TotoLogo className="h-6 w-auto text-primary" />
            <span className="font-bold">Driver Portal</span>
          </Link>
          <div className="flex items-center gap-4">
             <div className="flex items-center space-x-2 bg-muted px-3 py-1 rounded-full text-xs">
                <span className={cn("h-2 w-2 rounded-full", isOnline ? "bg-green-500 animate-pulse" : "bg-red-500")} />
                <span className="font-semibold">{isOnline ? 'Online' : 'Offline'}</span>
                <Switch checked={isOnline} onCheckedChange={handleOnlineToggle} size="sm" />
            </div>
            <Button variant="ghost" size="sm" asChild><Link href="/"><Home className="h-4 w-4" /></Link></Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
              <TabsTrigger value="overview" className="gap-2"><LayoutDashboard className="h-4 w-4" /> Hub</TabsTrigger>
              <TabsTrigger value="earnings" className="gap-2"><Wallet className="h-4 w-4" /> Wallet</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-6">
                {incomingRequest && (
                  <Card className="border-4 border-primary shadow-2xl animate-in zoom-in-95">
                      <CardHeader className="bg-primary/5 pb-4">
                          <div className="flex items-center justify-between">
                              <Badge className="bg-primary text-black">New {incomingRequest.type} Request</Badge>
                          </div>
                          <CardTitle className="text-2xl">Incoming Ride</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                          <div className="grid gap-6 md:grid-cols-2">
                              <div className="space-y-4">
                                  <p className="font-bold flex items-start gap-2 text-sm">
                                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                                      {incomingRequest.pickup}
                                  </p>
                                  <p className="font-bold flex items-start gap-2 text-sm">
                                      <MapPin className="h-4 w-4 text-destructive shrink-0" />
                                      {incomingRequest.destination}
                                  </p>
                              </div>
                              <div className="flex flex-col justify-center items-center p-6 bg-muted/20 rounded-xl">
                                  <p className="text-4xl font-black text-primary">₹{incomingRequest.fare}</p>
                              </div>
                          </div>
                          <div className="mt-8 flex gap-3">
                              <Button variant="outline" className="flex-1" onClick={() => setIncomingRequest(null)}>Ignore</Button>
                              <Button className="flex-1 font-bold" onClick={handleAcceptRide}>Accept</Button>
                          </div>
                      </CardContent>
                  </Card>
                )}

                {activeRide && (
                  <Card className="border-2 border-primary shadow-lg overflow-hidden">
                      <div className="bg-primary text-black px-6 py-2 flex items-center justify-between font-bold text-xs">
                          <span>Active: {activeRide.id}</span>
                          <span>{activeRide.status.toUpperCase()}</span>
                      </div>
                      <CardContent className="p-6">
                          <div className="grid gap-8 md:grid-cols-2">
                              <div className="space-y-6">
                                  <h3 className="font-bold text-lg">{activeRide.customerName}</h3>
                                  <div className="space-y-4 pl-1 border-l-2 border-primary/20">
                                      <p className="text-sm font-semibold">{activeRide.pickup}</p>
                                      <p className="text-sm font-semibold">{activeRide.destination}</p>
                                  </div>
                              </div>
                              <div className="space-y-6 flex flex-col justify-center">
                                  {activeRide.status === 'accepted' && (
                                      <Button size="lg" className="h-16 text-xl font-bold w-full" onClick={handleArrived}>
                                          Arrived at Pickup
                                      </Button>
                                  )}
                                  {activeRide.status === 'arrived' && (
                                      <div className="space-y-4">
                                          <div className="flex gap-2">
                                              <Input 
                                                  placeholder="Enter OTP" 
                                                  className="h-16 text-center text-3xl font-black tracking-[0.5em]" 
                                                  maxLength={4}
                                                  value={otpInput}
                                                  onChange={(e) => setOtpInput(e.target.value)}
                                              />
                                              <Button className="h-16 px-8 font-bold" onClick={handleVerifyOtp}>Verify</Button>
                                          </div>
                                      </div>
                                  )}
                                  {activeRide.status === 'started' && (
                                      <Button size="lg" className="h-16 text-xl font-bold w-full" onClick={handleCompleteRide}>
                                          Complete Trip
                                      </Button>
                                  )}
                              </div>
                          </div>
                      </CardContent>
                  </Card>
                )}

                {!incomingRequest && !activeRide && (
                  <div className="grid gap-6 md:grid-cols-3">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Today's Rides</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{stats.count}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Today's Wallet</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">₹{stats.net.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Rating</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">4.8</div>
                        </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="earnings">
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-6 bg-background border rounded-xl shadow-sm text-center">
                    <p className="text-xs text-muted-foreground mb-1">Gross</p>
                    <p className="text-2xl font-black">₹{stats.gross.toLocaleString()}</p>
                  </div>
                  <div className="p-6 bg-background border rounded-xl shadow-sm text-center">
                    <p className="text-xs text-muted-foreground mb-1">Commission (20%)</p>
                    <p className="text-2xl font-black text-destructive">-₹{stats.commission.toLocaleString()}</p>
                  </div>
                  <div className="p-6 bg-primary text-primary-foreground rounded-xl shadow-lg text-center">
                    <p className="text-xs opacity-80 mb-1">Net Earnings</p>
                    <p className="text-2xl font-black">₹{stats.net.toLocaleString()}</p>
                  </div>
                </div>

                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle>Trip History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Fare</TableHead>
                          <TableHead className="text-right">Net</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rideHistory?.map((ride: any) => (
                          <TableRow key={ride.id}>
                            <TableCell className="font-bold">{ride.customerName}</TableCell>
                            <TableCell>₹{ride.fare}</TableCell>
                            <TableCell className="text-right font-black text-green-600">₹{(ride.fare * 0.8).toFixed(0)}</TableCell>
                          </TableRow>
                        ))}
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
