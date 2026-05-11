
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
  BadgeCheck
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

import { useState, useMemo } from 'react';
import { useFirestore, useCollectionData } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { BOOK_RIDE_SERVICE_AREAS, DUMMY_DRIVERS, DUMMY_CUSTOMERS, DUMMY_LOCATIONS_DATA } from '@/lib/mock-data';

export default function AdminDashboardPage() {
  const router = useRouter();
  const db = useFirestore();
  const { toast } = useToast();

  const [newHub, setNewHub] = useState({ state: '', city: '', range: '10' });

  const liveRidesQuery = useMemo(() => query(collection(db, 'rides'), orderBy('createdAt', 'desc'), limit(20)), [db]);
  const { data: liveRides } = useCollectionData(liveRidesQuery);

  const stats = useMemo(() => {
    if (!liveRides) return { totalRides: 0, grossVolume: 0, activeCount: 0 };
    const completed = liveRides.filter((r: any) => r.status === 'completed');
    const active = liveRides.filter((r: any) => r.status !== 'completed' && r.status !== 'cancelled');
    const gross = completed.reduce((acc: number, r: any) => acc + (r.fare || 0), 0);
    return { 
      totalRides: completed.length, 
      grossVolume: gross,
      activeCount: active.length
    };
  }, [liveRides]);

  const handleLogout = () => {
    toast({ title: 'Logged Out' });
    router.push('/admin/login');
  };

  const allStates = useMemo(() => Array.from(new Set(DUMMY_LOCATIONS_DATA.map(l => l.state))).sort(), []);

  return (
    <div className="flex min-h-dvh flex-col bg-secondary/20">
      <header className="sticky top-0 z-40 border-b bg-background shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Icons.TotoLogo className="h-6 w-auto text-primary" />
            <span className="font-bold hidden md:inline">Command Console</span>
          </Link>
          <div className="flex items-center gap-4">
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
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 py-1.5 px-3">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                NETWORK ACTIVE
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-background border h-11 w-full justify-start overflow-x-auto p-1 shadow-inner">
              <TabsTrigger value="overview" className="gap-2"><LayoutDashboard className="h-4 w-4" /> Operations</TabsTrigger>
              <TabsTrigger value="hubs" className="gap-2"><Globe className="h-4 w-4" /> Geography</TabsTrigger>
              <TabsTrigger value="drivers" className="gap-2"><Car className="h-4 w-4" /> Partners</TabsTrigger>
              <TabsTrigger value="customers" className="gap-2"><Users className="h-4 w-4" /> Riders</TabsTrigger>
              <TabsTrigger value="settings" className="gap-2"><Settings className="h-4 w-4" /> Protocol</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
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
                        <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> Live Handshake Stream</CardTitle>
                        <CardDescription>Real-time verification of trip handshake codes across the city.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ride ID</TableHead>
                                    <TableHead>Rider</TableHead>
                                    <TableHead>Partner</TableHead>
                                    <TableHead>OTP</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Audit</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {liveRides?.map((ride: any) => (
                                    <TableRow key={ride.rideId} className="group transition-colors">
                                        <TableCell className="font-bold text-xs font-mono">{ride.rideId}</TableCell>
                                        <TableCell className="text-xs">{ride.customerName}</TableCell>
                                        <TableCell className="text-xs">{ride.driverName || <span className="text-muted-foreground italic">Searching...</span>}</TableCell>
                                        <TableCell className="font-black text-primary tracking-widest">{ride.otp}</TableCell>
                                        <TableCell>
                                            <Badge 
                                                variant="secondary"
                                                className={cn(
                                                    "text-[10px] uppercase font-bold",
                                                    ride.status === 'completed' && 'bg-green-100 text-green-700',
                                                    ride.status === 'started' && 'bg-blue-100 text-blue-700',
                                                    ride.status === 'requested' && 'bg-orange-100 text-orange-700'
                                                )}
                                            >
                                                {ride.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {ride.otpUsed ? (
                                                <BadgeCheck className="h-4 w-4 text-green-500 inline-block" />
                                            ) : (
                                                <Clock className="h-4 w-4 text-muted-foreground inline-block" />
                                            )}
                                        </TableCell>
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
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm" className="font-bold"><Plus className="mr-2 h-4 w-4" /> Add Node</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Register Hub</DialogTitle>
                                <DialogDescription>Define a new operational sector for the network.</DialogDescription>
                            </DialogHeader>
                            <form className="space-y-4 pt-4" onSubmit={(e) => e.preventDefault()}>
                                <div className="space-y-2">
                                    <Label>State</Label>
                                    <Select onValueChange={v => setNewHub({...newHub, state: v})}>
                                        <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                                        <SelectContent className="max-h-[300px]">
                                            {allStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>City</Label>
                                    <Input placeholder="E.g. Patna" value={newHub.city} onChange={e => setNewHub({...newHub, city: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Radius (KM)</Label>
                                    <Input type="number" value={newHub.range} onChange={e => setNewHub({...newHub, range: e.target.value})} />
                                </div>
                                <Button className="w-full h-12 font-bold" onClick={() => {
                                    toast({ title: "Node Online", description: `${newHub.city} sector activated.` });
                                    setNewHub({ state: '', city: '', range: '10' });
                                }}>Activate Node</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <Card className="border-none shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Urban Sector</TableHead>
                                <TableHead>Territory</TableHead>
                                <TableHead>Radius</TableHead>
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
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Partner Fleet</h2>
                        <p className="text-xs text-muted-foreground font-medium">Audit logs for partner credentials and assets.</p>
                    </div>
                </div>
                <Card className="border-none shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Partner</TableHead>
                                <TableHead>Vehicle (ID/Type)</TableHead>
                                <TableHead>Hub</TableHead>
                                <TableHead>Performance</TableHead>
                                <TableHead className="text-right">KYC Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {DUMMY_DRIVERS.map(d => (
                                <TableRow key={d.driverId}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8 border">
                                                <AvatarFallback>{d.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="text-xs">
                                                <p className="font-bold">{d.name}</p>
                                                <p className="text-muted-foreground font-mono">{d.phone}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-xs">
                                            <p className="font-bold text-primary uppercase">{d.vehicleType}</p>
                                            <p className="text-muted-foreground font-mono uppercase">{d.vehicleNumber}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs font-medium">{d.city}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-4 text-xs">
                                            <span className="flex items-center gap-1 font-bold"><Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /> {d.rating}</span>
                                            <span className="text-muted-foreground">{d.totalTrips} Trips</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {d.kycVerified ? (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px] uppercase font-bold">Verified</Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-[10px] uppercase font-bold">Pending</Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </TabsContent>

            <TabsContent value="customers" className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Rider Directory</h2>
                        <p className="text-xs text-muted-foreground font-medium">Verified customer accounts and risk status.</p>
                    </div>
                </div>
                <Card className="border-none shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rider</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Primary Hub</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Risk Protocol</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {DUMMY_CUSTOMERS.map(c => (
                                <TableRow key={c.uid}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8 border">
                                                <AvatarImage src={c.profilePic} />
                                                <AvatarFallback>{c.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-bold text-sm">{c.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs font-mono">{c.phone}</TableCell>
                                    <TableCell className="text-xs font-medium">{c.city}</TableCell>
                                    <TableCell className="text-[10px] text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        {c.isBlocked ? (
                                            <Badge variant="destructive" className="text-[9px] uppercase"><ShieldAlert className="h-3 w-3 mr-1" /> Blocked</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-[9px] uppercase border-green-200 text-green-700 bg-green-50"><ShieldCheck className="h-3 w-3 mr-1" /> Safe</Badge>
                                        )}
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
                            <CardDescription>Global pricing adjustments for urban mobility nodes.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Standard Fare (₹/KM)</Label>
                                <Input defaultValue="15" type="number" />
                            </div>
                            <Button className="w-full h-11 font-bold shadow-lg shadow-primary/10">Synchronize Rates</Button>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Protocol Fee</CardTitle>
                            <CardDescription>Service commission derived from partner earnings.</CardDescription>
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
