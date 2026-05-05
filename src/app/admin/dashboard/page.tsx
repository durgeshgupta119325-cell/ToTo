
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
  Navigation
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
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

import { useState, useEffect, useMemo } from 'react';
import { DUMMY_DRIVERS, DUMMY_CUSTOMERS, BOOK_RIDE_SERVICE_AREAS, ADMIN_DASHBOARD_STATS, DEFAULT_RATES, MOCK_PAYMENTS, MOCK_SETTLEMENTS, DUMMY_LOCATIONS_DATA } from '@/lib/mock-data';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Area Management State
  const [newHub, setNewHub] = useState({ state: '', city: '', range: '10' });

  // Commission States
  const [dayCommission, setDayCommission] = useState(15);
  const [nightCommission, setNightCommission] = useState(25);

  // Manual Payment State
  const [manualEntry, setManualEntry] = useState({
    rideId: '',
    customer: '',
    driver: '',
    amount: '',
    mode: 'UPI',
    status: 'success'
  });

  const handleLogout = () => {
    toast({ title: 'Logged Out', description: 'Session ended.' });
    router.push('/admin/login');
  };

  const filteredPayments = useMemo(() => {
    return MOCK_PAYMENTS.filter(p => {
      const matchesSearch = p.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.customer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = paymentFilter === 'All' || p.status.toLowerCase() === paymentFilter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, paymentFilter]);

  const handleManualEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Payment Recorded', description: `Manual entry for ${manualEntry.rideId} has been saved.` });
    setManualEntry({ rideId: '', customer: '', driver: '', amount: '', mode: 'UPI', status: 'success' });
  };

  const handleAddHub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHub.state || !newHub.city) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please fill in all fields.' });
      return;
    }
    toast({ title: 'Service Area Added', description: `${newHub.city}, ${newHub.state} is now registered with a ${newHub.range}km range.` });
    setNewHub({ state: '', city: '', range: '10' });
  };

  const currentHour = new Date().getHours();
  const isNight = currentHour >= 21 || currentHour < 6;
  const activeCommission = isNight ? nightCommission : dayCommission;

  const states = useMemo(() => {
    return Array.from(new Set(DUMMY_LOCATIONS_DATA.map(l => l.state))).sort();
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-secondary/20">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Icons.TotoLogo className="h-6 w-auto text-primary" />
            <span className="font-bold hidden md:inline">Admin Console</span>
          </Link>
          <div className="flex items-center gap-4">
             <div className="hidden lg:flex items-center gap-2 text-xs font-medium bg-muted px-3 py-1 rounded-full">
                <Clock className="h-3 w-3" />
                <span>{isNight ? 'Night Mode' : 'Day Mode'} Commission: {activeCommission}%</span>
             </div>
             <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Log Out
             </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tighter">Command Center</h1>
              <p className="text-sm text-muted-foreground">Manage users, city hubs, and platform revenue.</p>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-background border h-11 w-full justify-start overflow-x-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="drivers">Drivers</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="hubs">City Hubs</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Total Volume</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">₹{ADMIN_DASHBOARD_STATS.grossVolume.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Total Rides</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{ADMIN_DASHBOARD_STATS.totalRides}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Active Drivers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{DUMMY_DRIVERS.length}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-primary/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-primary uppercase">Est. Commission</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-primary">₹{(ADMIN_DASHBOARD_STATS.grossVolume * (activeCommission/100)).toLocaleString()}</div>
                        </CardContent>
                    </Card>
                </div>
                
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Platform Health</CardTitle>
                        <CardDescription>Daily activity trends across all service areas.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg">
                        <div className="text-center space-y-2">
                            <BadgeCheck className="h-12 w-12 text-primary mx-auto opacity-50" />
                            <p className="text-sm font-bold">System Status: Optimal</p>
                            <p className="text-xs text-muted-foreground">All {BOOK_RIDE_SERVICE_AREAS.length} hubs reporting normal traffic.</p>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Financial Records</h2>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Export</Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Manual Entry</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Manual Payment Entry</DialogTitle>
                                    <DialogDescription>Record offline payments or reconcile transactions.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleManualEntrySubmit} className="space-y-4 pt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Ride ID</Label>
                                            <Input value={manualEntry.rideId} onChange={e => setManualEntry({...manualEntry, rideId: e.target.value})} placeholder="RIDE_123" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Amount (₹)</Label>
                                            <Input type="number" value={manualEntry.amount} onChange={e => setManualEntry({...manualEntry, amount: e.target.value})} placeholder="0.00" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Customer Name</Label>
                                        <Input value={manualEntry.customer} onChange={e => setManualEntry({...manualEntry, customer: e.target.value})} placeholder="John Doe" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Payment Mode</Label>
                                            <Select value={manualEntry.mode} onValueChange={v => setManualEntry({...manualEntry, mode: v})}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="UPI">UPI</SelectItem>
                                                    <SelectItem value="Cash">Cash</SelectItem>
                                                    <SelectItem value="Card">Card</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Status</Label>
                                            <Select value={manualEntry.status} onValueChange={v => setManualEntry({...manualEntry, status: v})}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="success">Success</SelectItem>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full">Record Payment</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <Card className="border-none shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-muted/10 flex flex-wrap gap-4">
                        <div className="relative flex-1 min-w-[300px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search transactions..." 
                                className="pl-10"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                            <SelectTrigger className="w-[180px]">
                                <Filter className="mr-2 h-4 w-4" /> <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Statuses</SelectItem>
                                <SelectItem value="success">Success</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ride ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Mode</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPayments.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-bold">{p.id}</TableCell>
                                    <TableCell>{p.customer}</TableCell>
                                    <TableCell className="font-black">₹{p.amount}</TableCell>
                                    <TableCell><Badge variant="secondary">{p.mode}</Badge></TableCell>
                                    <TableCell>
                                        <Badge variant={p.status === 'success' ? 'default' : 'outline'} className={cn(p.status === 'success' && 'bg-green-500 hover:bg-green-600 text-white border-none')}>
                                            {p.status.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Details</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </TabsContent>

            <TabsContent value="drivers" className="space-y-6">
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Driver Directory</CardTitle>
                        <CardDescription>Review and manage all registered platform partners.</CardDescription>
                    </CardHeader>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Vehicle</TableHead>
                                <TableHead>City</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {DUMMY_DRIVERS.map((d) => (
                                <TableRow key={d.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold">{d.name}</span>
                                            <span className="text-[10px] text-muted-foreground">{d.id}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{d.mobile}</TableCell>
                                    <TableCell>{d.vehicleType} ({d.vehicleNumber})</TableCell>
                                    <TableCell>{d.city}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge className="bg-green-500">Active</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </TabsContent>

            <TabsContent value="customers" className="space-y-6">
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Customer Base</CardTitle>
                    </CardHeader>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Mobile</TableHead>
                                <TableHead>Joined Hub</TableHead>
                                <TableHead className="text-right">Rides</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {DUMMY_CUSTOMERS.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell className="font-bold">{c.name}</TableCell>
                                    <TableCell>{c.email}</TableCell>
                                    <TableCell>{c.mobile}</TableCell>
                                    <TableCell>{c.city}</TableCell>
                                    <TableCell className="text-right font-bold">{c.rides.length}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </TabsContent>

            <TabsContent value="hubs" className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Service Area Management</h2>
                        <p className="text-sm text-muted-foreground">Define cities and operational range.</p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add New Hub</Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90dvh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Register New Service Area</DialogTitle>
                                <DialogDescription>Define a new city hub and its operational radius.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddHub} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>Select State</Label>
                                    <Select value={newHub.state} onValueChange={v => setNewHub({...newHub, state: v})}>
                                        <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                                        <SelectContent className="max-h-[300px]">
                                            {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>City Name</Label>
                                    <Input value={newHub.city} onChange={e => setNewHub({...newHub, city: e.target.value})} placeholder="E.g. Lucknow" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Service Radius (Range in KM)</Label>
                                    <div className="flex items-center gap-2">
                                        <Input type="number" value={newHub.range} onChange={e => setNewHub({...newHub, range: e.target.value})} placeholder="10" />
                                        <span className="text-sm font-bold text-muted-foreground">KM</span>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full">Register Hub</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card className="border-none shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>City</TableHead>
                                <TableHead>State</TableHead>
                                <TableHead>Range (Radius)</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {BOOK_RIDE_SERVICE_AREAS.map((area, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-bold flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        {area.city}
                                    </TableCell>
                                    <TableCell>{area.state}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-mono">
                                            <Navigation className="mr-1 h-3 w-3" /> {area.range || 10} km
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={area.active ? 'default' : 'secondary'} className={cn(area.active && 'bg-green-500')}>
                                            {area.active ? 'Operational' : 'Paused'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Toggle</Button>
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
                            <CardTitle className="flex items-center gap-2"><IndianRupee className="h-5 w-5" /> Fare Settings</CardTitle>
                            <CardDescription>Adjust per-kilometer rates for vehicles.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>E-Rickshaw Rate (₹/km)</Label>
                                <Input defaultValue={DEFAULT_RATES.erickshaw} type="number" />
                            </div>
                            <div className="space-y-2">
                                <Label>Standard Cab Rate (₹/km)</Label>
                                <Input defaultValue={DEFAULT_RATES.cab} type="number" />
                            </div>
                            <Button className="w-full">Update Global Rates</Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Percent className="h-5 w-5" /> Commission Controls</CardTitle>
                            <CardDescription>Manage platform cuts based on time of day.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Morning Commission (%, 6AM - 9PM)</Label>
                                <Input 
                                    value={dayCommission} 
                                    onChange={e => setDayCommission(Number(e.target.value))} 
                                    type="number" 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Night Commission (%, 9PM - 6AM)</Label>
                                <Input 
                                    value={nightCommission} 
                                    onChange={e => setNightCommission(Number(e.target.value))} 
                                    type="number" 
                                />
                            </div>
                            <Button variant="secondary" className="w-full" onClick={() => toast({title: "Settings Saved"})}>
                                Apply Commission Rules
                            </Button>
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
