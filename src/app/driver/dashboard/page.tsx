
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import { Star, Home, CheckCircle2, Wallet, LayoutDashboard, Clock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useFirestore, useUser, useCollectionData } from '@/firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, setDoc, limit, orderBy } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Ride = {
  rideId: string;
  customerId: string;
  customerName: string;
  pickup: { address: string; lat: number; lng: number };
  dropoff: { address: string; lat: number; lng: number };
  fare: number;
  status: 'requested' | 'accepted' | 'started' | 'completed' | 'cancelled';
  otp: string;
  vehicleType: string;
  createdAt: string;
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

  // Real-time location simulation
  useEffect(() => {
    if (!isOnline || !user || !db) return;

    // Simulate location updates every 10 seconds
    const interval = setInterval(() => {
      // Simulate slight movement around a central point
      const baseLat = 25.5941;
      const baseLng = 85.1376;
      const lat = baseLat + (Math.random() - 0.5) * 0.01;
      const lng = baseLng + (Math.random() - 0.5) * 0.01;
      
      const locRef = doc(db, 'driver_locations', user.uid);
      setDoc(locRef, {
        driverId: user.uid,
        lat,
        lng,
        heading: Math.floor(Math.random() * 360),
        speed: Math.random() * 40, // 0 to 40 km/h
        lastUpdated: new Date().toISOString(),
        isOnline: true
      }, { merge: true });
    }, 10000);

    return () => clearInterval(interval);
  }, [isOnline, user, db]);

  const completedRidesQuery = useMemo(() => {
    if (!user) return null;
    return query(
      collection(db, 'rides'),
      where('driverId', '==', user.uid),
      where('status', '==', 'completed'),
      orderBy('createdAt', 'desc')
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
      where('status', '==', 'requested'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const rideData = snapshot.docs[0].data();
        setIncomingRequest({ id: snapshot.docs[0].id, ...rideData } as any);
      } else {
        setIncomingRequest(null);
      }
    });

    return () => unsubscribe();
  }, [isOnline, user, db, activeRide]);

  useEffect(() => {
    if (!activeRide || !db) return;

    const unsubscribe = onSnapshot(doc(db, 'rides', activeRide.rideId), (snapshot) => {
        if (snapshot.exists()) {
            setActiveRide({ ...snapshot.data() } as Ride);
        } else {
            setActiveRide(null);
        }
    });

    return () => unsubscribe();
  }, [activeRide?.rideId, db]);

  const handleOnlineToggle = (online: boolean) => {
    setIsOnline(online);
    if (user) {
        updateDoc(doc(db, 'drivers', user.uid), { isOnline: online, isAvailable: online });
        // Update location status
        const locRef = doc(db, 'driver_locations', user.uid);
        updateDoc(locRef, { isOnline: online, lastUpdated: new Date().toISOString() }).catch(() => {
            // Document might not exist if first time
            setDoc(locRef, { driverId: user.uid, isOnline: online, lat: 0, lng: 0, lastUpdated: new Date().toISOString() });
        });
    }
    toast({ title: online ? 'System Online' : 'System Offline' });
  };

  const handleAcceptRide = () => {
    if (!incomingRequest || !user) return;

    const rideRef = doc(db, 'rides', incomingRequest.rideId);
    updateDoc(rideRef, {
        status: 'accepted',
        driverId: user.uid,
        driverName: user.displayName || 'Partner',
        vehicleDetails: "BR-01-AB-1234"
    }).then(() => {
        setActiveRide(incomingRequest);
        setIncomingRequest(null);
        updateDoc(doc(db, 'drivers', user.uid), { isAvailable: false });
    });
  };

  const handleArrived = () => {
    if (!activeRide) return;
    toast({ title: "Arrived", description: "Request OTP from customer." });
  };

  const handleVerifyOtp = () => {
    if (!activeRide || !otpInput) return;
    
    setIsVerifying(true);
    if (otpInput === activeRide.otp) {
        updateDoc(doc(db, 'rides', activeRide.rideId), { 
            status: 'started',
            otpUsed: true,
            startedAt: new Date().toISOString()
        }).then(() => {
            toast({ title: "Verified", description: "Trip started!" });
            setOtpInput('');
        });
    } else {
        toast({ variant: "destructive", title: "Invalid Handshake Code" });
    }
    setIsVerifying(false);
  };

  const handleCompleteRide = () => {
    if (!activeRide || !user) return;
    updateDoc(doc(db, 'rides', activeRide.rideId), { 
        status: 'completed',
        completedAt: new Date().toISOString(),
        paymentStatus: 'paid'
    }).then(() => {
        setActiveRide(null);
        updateDoc(doc(db, 'drivers', user.uid), { isAvailable: true });
        toast({ title: "Ride Completed!" });
    });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-secondary/30">
      <header className="sticky top-0 z-40 border-b bg-background shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Icons.TotoLogo className="h-6 w-auto text-primary" />
            <span className="font-bold">Partner Hub</span>
          </Link>
          <div className="flex items-center gap-4">
             <div className="flex items-center space-x-2 bg-muted px-4 py-1.5 rounded-full text-xs">
                <span className={cn("h-2 w-2 rounded-full", isOnline ? "bg-green-500 animate-pulse" : "bg-red-500")} />
                <span className="font-black uppercase tracking-widest">{isOnline ? 'Online' : 'Offline'}</span>
                <Switch checked={isOnline} onCheckedChange={handleOnlineToggle} />
            </div>
            <Button variant="ghost" size="sm" asChild><Link href="/"><Home className="h-4 w-4" /></Link></Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-12 shadow-sm border bg-background/50 backdrop-blur">
              <TabsTrigger value="overview" className="gap-2 font-bold"><LayoutDashboard className="h-4 w-4" /> Command</TabsTrigger>
              <TabsTrigger value="earnings" className="gap-2 font-bold"><Wallet className="h-4 w-4" /> Wallet</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-6">
                {incomingRequest && (
                  <Card className="border-4 border-primary shadow-2xl animate-in zoom-in-95 duration-500">
                      <div className="bg-primary/5 p-6 border-b border-primary/10">
                          <div className="flex items-center justify-between">
                              <Badge className="bg-primary text-black font-black text-[10px] uppercase tracking-widest">Incoming {incomingRequest.vehicleType}</Badge>
                              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground"><Clock className="h-3 w-3" /> 45s left</div>
                          </div>
                          <h2 className="text-3xl font-black mt-2">New Trip Request</h2>
                      </div>
                      <CardContent className="pt-6">
                          <div className="grid gap-6 md:grid-cols-2">
                              <div className="space-y-6">
                                  <div className="space-y-4">
                                      <div className="flex items-start gap-3">
                                          <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                                          <div>
                                              <p className="text-[10px] uppercase font-bold text-muted-foreground">Pickup</p>
                                              <p className="font-bold text-sm">{incomingRequest.pickup.address}</p>
                                          </div>
                                      </div>
                                      <div className="flex items-start gap-3">
                                          <div className="h-2 w-2 rounded-full bg-destructive mt-1.5" />
                                          <div>
                                              <p className="text-[10px] uppercase font-bold text-muted-foreground">Destination</p>
                                              <p className="font-bold text-sm">{incomingRequest.dropoff.address}</p>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className="flex flex-col justify-center items-center p-8 bg-secondary/20 rounded-2xl border-2 border-dashed border-primary/20">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Estimated Fare</p>
                                  <p className="text-5xl font-black text-primary">₹{incomingRequest.fare}</p>
                              </div>
                          </div>
                          <div className="mt-8 flex gap-4">
                              <Button variant="outline" className="flex-1 h-14 font-black text-xs uppercase" onClick={() => setIncomingRequest(null)}>Ignore</Button>
                              <Button className="flex-1 h-14 font-black text-lg shadow-lg" onClick={handleAcceptRide}>ACCEPT TRIP</Button>
                          </div>
                      </CardContent>
                  </Card>
                )}

                {activeRide && (
                  <Card className="border-2 border-primary shadow-xl overflow-hidden animate-in slide-in-from-top-4">
                      <div className="bg-primary text-black px-6 py-2.5 flex items-center justify-between font-black text-[10px] uppercase tracking-[0.2em]">
                          <span>Active Mission: {activeRide.rideId}</span>
                          <span className="bg-black text-white px-2 py-0.5 rounded-sm">{activeRide.status.toUpperCase()}</span>
                      </div>
                      <CardContent className="p-8">
                          <div className="grid gap-8 md:grid-cols-2">
                              <div className="space-y-6">
                                  <div>
                                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Customer</p>
                                      <h3 className="font-black text-2xl">{activeRide.customerName}</h3>
                                  </div>
                                  <div className="space-y-4 pl-4 border-l-4 border-primary/20 py-2">
                                      <p className="text-sm font-bold">{activeRide.pickup.address}</p>
                                      <p className="text-sm font-bold">{activeRide.dropoff.address}</p>
                                  </div>
                              </div>
                              <div className="space-y-6 flex flex-col justify-center">
                                  {activeRide.status === 'accepted' && (
                                      <div className="space-y-4">
                                          <Button size="lg" className="h-20 text-xl font-black w-full shadow-lg" onClick={handleArrived}>
                                              ARRIVED AT PICKUP
                                          </Button>
                                          <div className="space-y-2">
                                              <p className="text-[10px] text-center uppercase font-bold text-muted-foreground">Enter Handshake Code</p>
                                              <div className="flex gap-2">
                                                  <Input 
                                                      placeholder="0000" 
                                                      className="h-20 text-center text-5xl font-black tracking-[0.5em] border-primary" 
                                                      maxLength={4}
                                                      value={otpInput}
                                                      onChange={(e) => setOtpInput(e.target.value)}
                                                  />
                                                  <Button className="h-20 px-8 font-black" onClick={handleVerifyOtp} disabled={isVerifying}>
                                                      {isVerifying ? <Clock className="animate-spin" /> : 'START'}
                                                  </Button>
                                              </div>
                                          </div>
                                      </div>
                                  )}
                                  {activeRide.status === 'started' && (
                                      <Button size="lg" className="h-20 text-xl font-black w-full bg-green-500 hover:bg-green-600 shadow-lg" onClick={handleCompleteRide}>
                                          COMPLETE TRIP
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
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Daily Volume</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black">{stats.count}</div>
                            <p className="text-[10px] text-muted-foreground mt-2 font-medium">Completed Triangulations</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-primary/5">
                        <CardHeader className="pb-2">
                            <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Net Wallet</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black text-primary">₹{stats.net.toLocaleString()}</div>
                            <p className="text-[10px] text-muted-foreground mt-2 font-medium">Settlement Pending</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Trust Factor</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black flex items-center gap-2">4.8 <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" /></div>
                            <p className="text-[10px] text-muted-foreground mt-2 font-medium">Elite Partner Tier</p>
                        </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="earnings">
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-8 bg-background border-2 rounded-2xl shadow-sm text-center">
                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-widest">Gross Yield</p>
                    <p className="text-3xl font-black">₹{stats.gross.toLocaleString()}</p>
                  </div>
                  <div className="p-8 bg-background border-2 rounded-2xl shadow-sm text-center">
                    <p className="text-[10px] font-black uppercase text-destructive mb-1 tracking-widest">Protocol Fee (20%)</p>
                    <p className="text-3xl font-black text-destructive">-₹{stats.commission.toLocaleString()}</p>
                  </div>
                  <div className="p-8 bg-primary text-primary-foreground rounded-2xl shadow-xl text-center">
                    <p className="text-[10px] font-black uppercase opacity-80 mb-1 tracking-widest">Liquid Assets</p>
                    <p className="text-3xl font-black">₹{stats.net.toLocaleString()}</p>
                  </div>
                </div>

                <Card className="border-none shadow-sm overflow-hidden">
                  <div className="p-4 border-b bg-muted/20">
                    <h3 className="text-sm font-black uppercase tracking-widest">Transaction History</h3>
                  </div>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-muted/10">
                        <TableRow>
                          <TableHead className="font-black text-[10px] uppercase">Rider</TableHead>
                          <TableHead className="font-black text-[10px] uppercase">Gross</TableHead>
                          <TableHead className="text-right font-black text-[10px] uppercase">Net Credit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rideHistory?.map((ride: any) => (
                          <TableRow key={ride.rideId} className="hover:bg-muted/5 transition-colors">
                            <TableCell className="font-bold text-xs">{ride.customerName}</TableCell>
                            <TableCell className="text-xs font-medium">₹{ride.fare}</TableCell>
                            <TableCell className="text-right font-black text-green-600 text-sm">₹{(ride.fare * 0.8).toFixed(0)}</TableCell>
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
