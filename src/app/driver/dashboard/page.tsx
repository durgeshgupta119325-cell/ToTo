
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import { Car, IndianRupee, Star, Home, Eye, MapPin, CheckCircle2, User, Timer, Navigation } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useFirestore, useUser } from '@/firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, limit } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Badge } from '@/components/ui/badge';

type Ride = {
  id: string;
  customerId: string;
  customerName: string;
  pickup: string;
  destination: string;
  fare: number;
  status: 'pending' | 'searching_all' | 'accepted' | 'arrived' | 'started';
  otp: string;
  type: string;
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

  // 1. Listen for Incoming Requests
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

  // 2. Listen for Current Active Ride Updates
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
    <div className="flex min-h-dvh flex-col bg-secondary">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/driver/dashboard" className="flex items-center gap-2">
            <Icons.TotoLogo className="h-6 w-auto text-primary" />
            <span className="font-bold">Driver Dashboard</span>
          </Link>
          <div className="flex items-center gap-4">
             <div className="flex items-center space-x-2 bg-muted px-3 py-1 rounded-full text-xs">
                <span className={cn("h-2 w-2 rounded-full", isOnline ? "bg-green-500 animate-pulse" : "bg-red-500")} />
                <span className="font-semibold">{isOnline ? 'Active' : 'Offline'}</span>
                <Switch checked={isOnline} onCheckedChange={handleOnlineToggle} size="sm" />
            </div>
            <Button variant="ghost" size="sm" onClick={() => router.push('/')}><Home className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          
          {/* Incoming Request Overlay */}
          {incomingRequest && (
            <Card className="border-4 border-primary shadow-2xl animate-in zoom-in-95">
                <CardHeader className="bg-primary/5 pb-4">
                    <div className="flex items-center justify-between">
                        <Badge className="bg-primary text-black">New {incomingRequest.type} Request</Badge>
                        <div className="flex items-center gap-1 text-xs font-bold text-primary">
                            <Timer className="h-3 w-3" /> 60s
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Incoming Ride Request</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase text-muted-foreground">Pick-up Location</p>
                                <p className="font-bold flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                                    {incomingRequest.pickup}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase text-muted-foreground">Drop-off Location</p>
                                <p className="font-bold flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-destructive shrink-0" />
                                    {incomingRequest.destination}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-center p-6 bg-muted/20 rounded-xl border border-dashed">
                            <p className="text-sm font-medium text-muted-foreground">Estimated Fare</p>
                            <p className="text-4xl font-black text-primary">₹{incomingRequest.fare}</p>
                        </div>
                    </div>
                    <div className="mt-8 flex gap-3">
                        <Button variant="outline" className="flex-1 h-12" onClick={() => setIncomingRequest(null)}>Reject</Button>
                        <Button className="flex-1 h-12 text-lg font-bold" onClick={handleAcceptRide}>Accept Ride</Button>
                    </div>
                </CardContent>
            </Card>
          )}

          {/* Active Ride Control */}
          {activeRide && (
            <Card className="border-2 border-primary shadow-lg overflow-hidden">
                <div className="bg-primary text-black px-6 py-2 flex items-center justify-between font-bold text-xs uppercase tracking-widest">
                    <span>Active Ride: {activeRide.id}</span>
                    <span>Status: {activeRide.status}</span>
                </div>
                <CardContent className="p-6">
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                                    <User className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{activeRide.customerName}</h3>
                                    <p className="text-xs text-muted-foreground">Contact: Verified Customer</p>
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
                                    I Have Arrived
                                </Button>
                            )}

                            {(activeRide.status === 'arrived') && (
                                <div className="space-y-4 animate-in slide-in-from-bottom-2">
                                    <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-xl text-center">
                                        <p className="text-xs font-bold text-yellow-800 uppercase mb-2">Verification Required</p>
                                        <p className="text-sm text-yellow-700">Enter the 4-digit code provided by the customer to start the trip.</p>
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
                                        <CheckCircle2 className="h-12 w-12 text-green-600 animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Trip in Progress</h3>
                                        <p className="text-sm text-muted-foreground">Navigate to {activeRide.destination}</p>
                                    </div>
                                    <Button variant="outline" className="w-full" onClick={() => setActiveRide(null)}>Complete Trip (Demo)</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
          )}

          {/* Regular Dashboard Content */}
          {!incomingRequest && !activeRide && (
            <>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Driver Hub</h1>
                        <p className="text-muted-foreground">Status: {isOnline ? 'Online & Waiting' : 'Resting'}</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Daily Earnings</CardTitle>
                            <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹1,540</div>
                            <p className="text-xs text-muted-foreground">+₹240 since yesterday</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Trips Completed</CardTitle>
                            <Car className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground">Target: 15 trips</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Star Rating</CardTitle>
                            <Star className="h-4 w-4 text-primary fill-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">4.8</div>
                            <p className="text-xs text-muted-foreground">Top 10% of drivers</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Trip History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Route</TableHead>
                                    <TableHead className="text-right">Earnings</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">Anjali S.</TableCell>
                                    <TableCell className="text-xs">CP → India Gate</TableCell>
                                    <TableCell className="text-right font-bold">₹75</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Rahul V.</TableCell>
                                    <TableCell className="text-xs">Sec-18 → Cyber Hub</TableCell>
                                    <TableCell className="text-right font-bold">₹150</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
