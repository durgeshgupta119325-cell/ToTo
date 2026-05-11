
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
  IndianRupee,
  MoreHorizontal,
  Trash2,
  Percent,
  User,
  Send,
  Car,
  MapPin,
  CheckCircle2,
  CreditCard,
  Search,
  Filter,
  Download,
  Plus,
  FileText,
  BadgeCheck,
  AlertCircle,
  LayoutDashboard,
  Globe,
  Settings,
  Clock,
  Navigation,
  Activity,
  History
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
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import { useState, useMemo } from 'react';
import { useFirestore, useCollectionData } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { BOOK_RIDE_SERVICE_AREAS, DUMMY_DRIVERS, DUMMY_CUSTOMERS, DUMMY_LOCATIONS_DATA } from '@/lib/mock-data';

export default function AdminDashboardPage() {
  const router = useRouter();
  const db = useFirestore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [newHub, setNewHub] = useState({ state: '', city: '', range: '10' });

  // Live monitor query for rides
  const liveRidesQuery = useMemo(() => query(collection(db, 'rides'), orderBy('timestamp', 'desc'), limit(20)), [db]);
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

  const states = useMemo(() => Array.from(new Set(DUMMY_LOCATIONS_DATA.map(l => l.state))).sort(), []);

  return (
    <div className="flex min-h-dvh flex-col bg-secondary/20">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Icons.TotoLogo className="h-6 w-auto text-primary" />
            <span className="font-bold hidden md:inline">Admin Console</span>
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
              <h1 className="text-3xl font-black tracking-tighter">Command Center</h1>
              <p className="text-sm text-muted-foreground">Monitor platform activity and manage service operations.</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 py-1.5 px-3">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                SYSTEM ONLINE
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-background border h-11 w-full justify-start overflow-x-auto p-1">
              <TabsTrigger value="overview" className="gap-2"><LayoutDashboard className="h-4 w-4" /> Live Monitor</TabsTrigger>
              <TabsTrigger value="hubs" className="gap-2"><Globe className="h-4 w-4" /> City Hubs</TabsTrigger>
              <TabsTrigger value="drivers" className="gap-2"><Car className="h-4 w-4" /> Drivers</TabsTrigger>
              <TabsTrigger value="customers" className="gap-2"><Users className="h-4 w-4" /> Customers</TabsTrigger>
              <TabsTrigger value="settings" className="gap-2"><Settings className="h-4 w-4" /> Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Active Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{stats.activeCount}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Recent Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-primary">₹{stats.grossVolume.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Total Fleet Size</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{DUMMY_DRIVERS.length}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> Live Activity Monitor</CardTitle>
                        <CardDescription>Real-time view of customer OTPs and driver verification status.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ride ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Driver</TableHead>
                                    <TableHead>OTP Code</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Activity</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {liveRides?.map((ride: any) => (
                                    <TableRow key={ride.id}>
                                        <TableCell className="font-bold">{ride.id}</TableCell>
                                        <TableCell>{ride.customerName}</TableCell>
                                        <TableCell>{ride.driverName || <span className="text-muted-foreground italic">Searching...</span>}</TableCell>
                                        <TableCell className="font-black text-primary tracking-widest">{ride.otp}</TableCell>
                                        <TableCell>
                                            <Badge 
                                                variant={ride.status === 'completed' ? 'default' : 'outline'} 
                                                className={cn(
                                                    ride.status === 'completed' && 'bg-green-500 hover:bg-green-600',
                                                    ride.status === 'started' && 'bg-blue-500 hover:bg-blue-600 text-white border-none',
                                                    ride.status === 'pending' && 'bg-orange-100 text-orange-700 border-none'
                                                )}
                                            >
                                                {ride.status.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {ride.otpUsed ? (
                                                <Badge variant="secondary" className="bg-green-100 text-green-700 border-none">Verified</Badge>
                                            ) : (
                                                <div className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground uppercase font-bold">
                                                    <Clock className="h-3 w-3" /> Waiting
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {(!liveRides || liveRides.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                            No recent activity detected.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="hubs" className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Service Area Management</h2>
                        <p className="text-xs text-muted-foreground">Register new cities and set operational ranges.</p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add City Hub</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Register New Hub</DialogTitle>
                                <DialogDescription>Define a new operational city and its service radius.</DialogDescription>
                            </DialogHeader>
                            <form className="space-y-4 pt-4" onSubmit={(e) => e.preventDefault()}>
                                <div className="space-y-2">
                                    <Label>State</Label>
                                    <Select onValueChange={v => setNewHub({...newHub, state: v})}>
                                        <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                                        <SelectContent className="max-h-[300px]">
                                            {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>City</Label>
                                    <Input placeholder="E.g. Mumbai" value={newHub.city} onChange={e => setNewHub({...newHub, city: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Service Range (KM Radius)</Label>
                                    <Input type="number" placeholder="25" value={newHub.range} onChange={e => setNewHub({...newHub, range: e.target.value})} />
                                </div>
                                <Button className="w-full h-12 font-bold" onClick={() => {
                                    toast({ title: "Hub Registered", description: `${newHub.city} hub is now active.` });
                                    setNewHub({ state: '', city: '', range: '10' });
                                }}>Register Hub</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <Card className="border-none shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>City Hub</TableHead>
                                <TableHead>State</TableHead>
                                <TableHead>Radius (KM)</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {BOOK_RIDE_SERVICE_AREAS.map((area, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-bold">{area.city}</TableCell>
                                    <TableCell>{area.state}</TableCell>
                                    <TableCell>{area.range} km</TableCell>
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
                        <h2 className="text-xl font-bold">Driver Fleet</h2>
                        <p className="text-xs text-muted-foreground">Manage driver accounts and track performance.</p>
                    </div>
                </div>
                <Card className="border-none shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Vehicle Details</TableHead>
                                <TableHead className="text-right">Total Earnings</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {DUMMY_DRIVERS.map(d => (
                                <TableRow key={d.id}>
                                    <TableCell className="font-bold">{d.name}</TableCell>
                                    <TableCell>{d.mobile}</TableCell>
                                    <TableCell>
                                        <div className="text-xs">
                                            <p className="font-bold">{d.vehicleType}</p>
                                            <p className="text-muted-foreground font-mono uppercase">{d.vehicleNumber}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-black text-primary">₹{d.grossEarnings.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </TabsContent>

            <TabsContent value="customers" className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Customer Base</h2>
                        <p className="text-xs text-muted-foreground">View and manage registered user profiles.</p>
                    </div>
                </div>
                <Card className="border-none shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {DUMMY_CUSTOMERS.map(c => (
                                <TableRow key={c.id}>
                                    <TableCell className="font-bold">{c.name}</TableCell>
                                    <TableCell className="text-xs">{c.email}</TableCell>
                                    <TableCell>{c.mobile}</TableCell>
                                    <TableCell className="text-xs">{c.city}, {c.state}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="outline">Active User</Badge>
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
                            <CardTitle>Global Fare Rates</CardTitle>
                            <CardDescription>Base platform pricing for calculated distances.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Standard Fare (₹/km)</Label>
                                <Input defaultValue="15" type="number" />
                            </div>
                            <div className="space-y-2">
                                <Label>Minimum Fare (Base Charge)</Label>
                                <Input defaultValue="50" type="number" />
                            </div>
                            <Button className="w-full h-11 font-bold">Update Pricing</Button>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Commission Rules</CardTitle>
                            <CardDescription>Platform service fee deducted from drivers.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Platform Commission (%)</Label>
                                <Input defaultValue="20" type="number" />
                            </div >
                            <div className="space-y-2">
                                <Label>Surge Multiplier (Max)</Label>
                                <Input defaultValue="1.5" step="0.1" type="number" />
                            </div>
                            <Button variant="secondary" className="w-full h-11 font-bold">Save Commission Rules</Button>
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
