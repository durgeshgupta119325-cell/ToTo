"use client";

import Link from 'next/link';
import Image from 'next/image';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import { useState, useEffect } from 'react';
import { DUMMY_DRIVERS, DUMMY_CUSTOMERS, DUMMY_LOCATIONS_DATA, ADMIN_DASHBOARD_STATS, DEFAULT_RATES } from '@/lib/mock-data';

type Driver = (typeof DUMMY_DRIVERS)[0];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [driverList, setDriverList] = useState<Driver[]>([]);
  const initialServiceAreas = [
    { id: 1, city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra', active: true },
    { id: 2, city: 'Delhi', district: 'New Delhi', state: 'Delhi', active: true },
    { id: 3, city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', active: false },
    { id: 4, city: 'Gurugram', district: 'Gurgaon', state: 'Haryana', active: true },
  ];
  const [serviceAreas, setServiceAreas] = useState<typeof initialServiceAreas>([]);
  const [approvedStatesList, setApprovedStatesList] = useState<string[]>(['Maharashtra', 'Delhi', 'Haryana', 'Karnataka']);
  
  const [rates, setRates] = useState({ erickshaw: 0, cab: 0 });
  const [commissionRates, setCommissionRates] = useState({ day: 0, night: 0 });
  const [todayStats, setTodayStats] = useState({
    rides: 0,
    grossVolume: 0,
    lastReset: 0,
  });
  
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    // 1. Initialize Driver List
    const storedDrivers = localStorage.getItem('toto-admin-drivers');
    if (storedDrivers) {
      setDriverList(JSON.parse(storedDrivers));
    } else {
      setDriverList(DUMMY_DRIVERS);
      localStorage.setItem('toto-admin-drivers', JSON.stringify(DUMMY_DRIVERS));
    }
    
    // 2. Initialize Service Areas
    const storedAreas = localStorage.getItem('toto-admin-service-areas');
    if (storedAreas) {
      setServiceAreas(JSON.parse(storedAreas));
    } else {
      setServiceAreas(initialServiceAreas);
      localStorage.setItem('toto-admin-service-areas', JSON.stringify(initialServiceAreas));
    }

    // 2b. Initialize Approved States
    const storedStates = localStorage.getItem('toto-admin-approved-states');
    if (storedStates) {
        setApprovedStatesList(JSON.parse(storedStates));
    } else {
        localStorage.setItem('toto-admin-approved-states', JSON.stringify(approvedStatesList));
    }
    
    // 3. Initialize Rates
    const storedRates = localStorage.getItem('toto-admin-rates');
    if (storedRates) {
      setRates(JSON.parse(storedRates));
    } else {
      const initialRates = { erickshaw: DEFAULT_RATES.erickshaw, cab: DEFAULT_RATES.cab };
      setRates(initialRates);
      localStorage.setItem('toto-admin-rates', JSON.stringify(initialRates));
    }
    
    // 4. Initialize Commissions
    const storedCommission = localStorage.getItem('toto-admin-commission-rates');
    if (storedCommission) {
      setCommissionRates(JSON.parse(storedCommission));
    } else {
      const initialComm = { day: 2, night: 3 };
      setCommissionRates(initialComm);
      localStorage.setItem('toto-admin-commission-rates', JSON.stringify(initialComm));
    }

    // 5. Initialize Today Stats
    const storedToday = localStorage.getItem('toto-admin-today-stats');
    if (storedToday) {
      const parsed = JSON.parse(storedToday);
      const oneDay = 24 * 60 * 60 * 1000;
      if (Date.now() - parsed.lastReset > oneDay) {
        const newStats = {
          rides: Math.floor(Math.random() * 50) + 10,
          grossVolume: Math.floor(Math.random() * 15000) + 5000,
          lastReset: Date.now(),
        };
        localStorage.setItem('toto-admin-today-stats', JSON.stringify(newStats));
        setTodayStats(newStats);
      } else {
        setTodayStats(parsed);
      }
    } else {
      const initialStats = {
        rides: Math.floor(Math.random() * 50) + 10,
        grossVolume: Math.floor(Math.random() * 15000) + 5000,
        lastReset: Date.now(),
      };
      localStorage.setItem('toto-admin-today-stats', JSON.stringify(initialStats));
      setTodayStats(initialStats);
    }

    setDataLoaded(true);
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      localStorage.setItem('toto-admin-drivers', JSON.stringify(driverList));
    }
  }, [driverList, dataLoaded]);
  
  useEffect(() => {
    if (dataLoaded) {
      localStorage.setItem('toto-admin-service-areas', JSON.stringify(serviceAreas));
      localStorage.setItem('toto-admin-approved-states', JSON.stringify(approvedStatesList));
    }
  }, [serviceAreas, approvedStatesList, dataLoaded]);
  
  useEffect(() => {
    if (dataLoaded) {
      localStorage.setItem('toto-admin-rates', JSON.stringify(rates));
    }
  }, [rates, dataLoaded]);

  useEffect(() => {
    if (dataLoaded) {
      localStorage.setItem('toto-admin-commission-rates', JSON.stringify(commissionRates));
    }
  }, [commissionRates, dataLoaded]);


  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState(DUMMY_CUSTOMERS[0]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [driverSearch, setDriverSearch] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [districts, setDistricts] = useState<string[]>([]);
  const [commissionInfo, setCommissionInfo] = useState<{rate: number; amount: number} | null>(null);
  const [todayCommissionInfo, setTodayCommissionInfo] = useState<{rate: number; amount: number} | null>(null);


  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const isNightTime = currentHour >= 21 || currentHour < 6;

    const rate = isNightTime ? commissionRates.night / 100 : commissionRates.day / 100;
    
    setCommissionInfo({
        rate: rate,
        amount: ADMIN_DASHBOARD_STATS.grossVolume * rate
    });

    setTodayCommissionInfo({
        rate: rate,
        amount: todayStats.grossVolume * rate,
    });
  }, [commissionRates, todayStats.grossVolume]);

  const handleLogout = () => {
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/admin/login');
  };

  const handleRemoveDriver = (driverId: string) => {
    setDriverList(driverList.filter((d) => d.id !== driverId));
    toast({
      title: 'Driver Removed',
      description: `Driver ${driverId} has been removed from the platform.`,
    });
  };

  const handleServiceAreaToggle = (id: number) => {
    setServiceAreas(
      serviceAreas.map((area) =>
        area.id === id ? { ...area, active: !area.active } : area
      )
    );
  };

  const handleAddServiceArea = () => {
    if (!selectedState || !selectedDistrict || !selectedCity.trim()) {
        toast({
            variant: 'destructive',
            title: 'Incomplete Information',
            description: 'Please select a state, a district, and enter a city name.',
        });
        return;
    }

    const trimmedCity = selectedCity.trim();

    if (serviceAreas.some(area => area.city.toLowerCase() === trimmedCity.toLowerCase() && area.district === selectedDistrict && area.state === selectedState)) {
        toast({
            variant: 'destructive',
            title: 'Area Already Added',
            description: `${trimmedCity} in ${selectedDistrict}, ${selectedState} is already in your service areas.`,
        });
        return;
    }

    const newArea = {
        id: serviceAreas.length > 0 ? Math.max(...serviceAreas.map(a => a.id)) + 1 : 1,
        city: trimmedCity,
        district: selectedDistrict,
        state: selectedState,
        active: true,
    };
    setServiceAreas([...serviceAreas, newArea]);
    setSelectedState('');
    setSelectedDistrict('');
    setSelectedCity('');
    setDistricts([]);
    toast({
        title: 'Area Added',
        description: `${newArea.city} has been added to your service areas.`,
    });
  };
  
  const handleRemoveServiceArea = (id: number) => {
      const areaToRemove = serviceAreas.find(area => area.id === id);
      setServiceAreas(serviceAreas.filter(area => area.id !== id));
      if (areaToRemove) {
          toast({
              title: 'Area Removed',
              description: `${areaToRemove.city} has been removed from your service areas.`,
          });
      }
  };

  const handleApproveState = (state: string) => {
      if (approvedStatesList.includes(state)) {
          toast({
              variant: 'destructive',
              title: 'State Already Approved',
              description: `${state} is already on the approved list.`,
          });
          return;
      }
      setApprovedStatesList([...approvedStatesList, state]);
      toast({
          title: 'State Approved',
          description: `${state} has been approved for TOTO services.`,
      });
  };

  const handleRemoveApprovedState = (state: string) => {
      setApprovedStatesList(approvedStatesList.filter(s => s !== state));
      toast({
          title: 'State Approval Revoked',
          description: `${state} is no longer an approved state.`,
      });
  };

  const handleSaveRates = () => {
    toast({
        title: 'Rates Saved',
        description: 'The per-kilometer rates have been updated.',
    });
  };

  const handleSaveCommissionRates = () => {
    toast({
      title: 'Commission Rates Saved',
      description: 'The platform commission rates have been updated.',
    });
  };

  const handlePaymentTransfer = (driver: typeof DUMMY_DRIVERS[0]) => {
    const netPayout = driver.grossEarnings * (1 - (commissionInfo?.rate || commissionRates.day / 100));
    toast({
      title: 'Payment Initiated',
      description: `Transfer of ₹${netPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} to ${driver.name} has been initiated via UPI.`,
    });
  };

  const handleTransferAllPayments = () => {
    if (driverList.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Drivers Found',
        description: 'There are no drivers to pay.',
      });
      return;
    }

    const totalPayout = driverList.reduce((acc, driver) => {
      const netPayout =
        driver.grossEarnings *
        (1 - (commissionInfo?.rate || commissionRates.day / 100));
      return acc + netPayout;
    }, 0);

    toast({
      title: 'All Payments Initiated',
      description: `Transfers totaling ₹${totalPayout.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} to ${
        driverList.length
      } drivers have been initiated via UPI.`,
    });
  };

  const states = [...new Set(DUMMY_LOCATIONS_DATA.map(l => l.state))].sort();

  const handleStateChange = (state: string) => {
      setSelectedState(state);
      setSelectedDistrict('');
      setSelectedCity('');
      const availableDistricts = DUMMY_LOCATIONS_DATA.filter(l => l.state === state);
      const uniqueDistricts = [...new Set(availableDistricts.map(l => l.district))].sort();
      setDistricts(uniqueDistricts);
  };

  const handleDistrictChange = (district: string) => {
      setSelectedDistrict(district);
      setSelectedCity('');
  };

  const filteredCustomers = DUMMY_CUSTOMERS.filter(
    (customer) =>
      customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.mobile.includes(customerSearch)
  );

  const filteredDrivers = driverList.filter(
    (driver) =>
      driver.name.toLowerCase().includes(driverSearch.toLowerCase()) ||
      driver.id.toLowerCase().includes(driverSearch.toLowerCase())
  );


  return (
    <div className="flex min-h-dvh flex-col bg-secondary">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Icons.TotoLogo className="h-6 w-auto text-primary" />
            <span className="font-bold">Admin Dashboard</span>
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Console
            </h1>
            <p className="text-muted-foreground">
              Manage your drivers, customers, and platform settings.
            </p>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="drivers">Drivers</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
               <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Today's Overview</h2>
                    <p className="text-muted-foreground">Statistics for the last 24 hours.</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Today's Rides
                            </CardTitle>
                            <Car className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {todayStats.rides.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Rides in the last 24 hours
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Today's Gross Volume
                            </CardTitle>
                            <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ₹{todayStats.grossVolume.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Value of rides in the last 24 hours
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Today's Commission
                            </CardTitle>
                            <Percent className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {todayCommissionInfo ? (
                                <>
                                    <div className="text-2xl font-bold">
                                        ₹{todayCommissionInfo.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {todayCommissionInfo.rate * 100}% of Today's Volume {todayCommissionInfo.rate === commissionRates.night / 100 && '(Night Rate)'}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
                                    <div className="mt-1 h-4 w-32 animate-pulse rounded-md bg-muted" />
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="pt-8">
                    <h2 className="text-2xl font-bold tracking-tight">All-Time Overview</h2>
                    <p className="text-muted-foreground">Total platform statistics.</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                        Total Rides
                        </CardTitle>
                        <Car className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                        {ADMIN_DASHBOARD_STATS.totalRides.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                        Total rides completed
                        </p>
                    </CardContent>
                    </Card>
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                        Male Customers
                        </CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                        {DUMMY_CUSTOMERS.filter(c => c.gender === 'Male').length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                        Total male customers
                        </p>
                    </CardContent>
                    </Card>
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                        Female Customers
                        </CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                        {DUMMY_CUSTOMERS.filter(c => c.gender === 'Female').length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                        Total female customers
                        </p>
                    </CardContent>
                    </Card>
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                        Gross Volume
                        </CardTitle>
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                        ₹{ADMIN_DASHBOARD_STATS.grossVolume.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                        Total value of all rides
                        </p>
                    </CardContent>
                    </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="drivers">
              <Dialog>
                <Card>
                  <CardHeader>
                    <div className="flex flex-row items-start justify-between">
                      <div>
                        <CardTitle>Driver Management</CardTitle>
                        <CardDescription>
                          View, manage, and remove drivers from the platform.
                        </CardDescription>
                      </div>
                      <Button onClick={handleTransferAllPayments}>
                        <Send className="mr-2 h-4 w-4" />
                        Transfer All Payouts
                      </Button>
                    </div>
                    <div className="relative pt-4">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground mt-2" />
                      <Input
                        placeholder="Search by name or ID..."
                        value={driverSearch}
                        onChange={(e) => setDriverSearch(e.target.value)}
                        className="pl-10 max-w-sm"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Driver ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Vehicle No.</TableHead>
                          <TableHead className="text-right">Gross Earnings</TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDrivers.map((driver) => (
                          <TableRow key={driver.id}>
                            <TableCell className="font-medium">
                              {driver.id}
                            </TableCell>
                            <TableCell>{driver.name}</TableCell>
                            <TableCell>{driver.email}</TableCell>
                            <TableCell>{driver.vehicleNumber}</TableCell>
                            <TableCell className="text-right">
                              ₹{driver.grossEarnings.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <AlertDialog>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      aria-haspopup="true"
                                      size="icon"
                                      variant="ghost"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Toggle menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DialogTrigger asChild>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          setSelectedDriver(driver)
                                        }
                                      >
                                        View Details
                                      </DropdownMenuItem>
                                    </DialogTrigger>
                                    <DropdownMenuItem onClick={() => handlePaymentTransfer(driver)}>
                                      <Send className="mr-2 h-4 w-4" />
                                      <span>Transfer Payment</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Remove Driver
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will
                                      permanently remove the driver and their
                                      data from the platform.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-destructive hover:bg-destructive/90"
                                      onClick={() =>
                                        handleRemoveDriver(driver.id)
                                      }
                                    >
                                      Remove
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <DialogContent className="sm:max-w-4xl">
                  {selectedDriver ? (
                    <>
                      <DialogHeader>
                        <DialogTitle>Driver Details: {selectedDriver.name}</DialogTitle>
                        <DialogDescription>
                          View driver information, vehicle details, and documents.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-6 py-4 md:grid-cols-3">
                        <div className="space-y-4 md:col-span-1">
                          <Card>
                            <CardContent className="pt-6">
                              <div className="flex flex-col items-center gap-4">
                                <Image
                                  src={selectedDriver.photoUrl}
                                  alt={selectedDriver.name}
                                  width={128}
                                  height={128}
                                  className="rounded-full"
                                  data-ai-hint="driver profile photo"
                                />
                                <div className="text-center">
                                  <h3 className="text-xl font-semibold">
                                    {selectedDriver.name}
                                  </h3>
                                  <p className="text-muted-foreground">
                                    {selectedDriver.id}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">
                                Contact Information
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                              <div>
                                <p className="font-semibold text-muted-foreground">
                                  Email
                                </p>
                                <p>{selectedDriver.email}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-muted-foreground">
                                  Mobile
                                </p>
                                <p>{selectedDriver.mobile}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        <div className="space-y-4 md:col-span-2">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">
                                Vehicle Details
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="font-semibold text-muted-foreground">
                                    Vehicle Type
                                  </p>
                                  <p>{selectedDriver.vehicleType}</p>
                                </div>
                                <div>
                                  <p className="font-semibold text-muted-foreground">
                                    Vehicle Number
                                  </p>
                                  <p>{selectedDriver.vehicleNumber}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">
                                Identification Proof
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <Image
                                src={selectedDriver.idProofUrl}
                                alt="ID Proof"
                                width={400}
                                height={250}
                                className="w-full rounded-md border object-cover"
                                data-ai-hint="identification card"
                              />
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </>
                  ) : null}
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="customers">
              <Dialog>
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Management</CardTitle>
                    <CardDescription>
                      Search for customers to view their details and ride history.
                    </CardDescription>
                    <div className="relative pt-4">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground mt-2" />
                        <Input 
                            placeholder="Search by name or mobile..."
                            value={customerSearch}
                            onChange={(e) => setCustomerSearch(e.target.value)}
                            className="pl-10 max-w-sm"
                        />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Mobile</TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCustomers.map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell className="font-medium">
                              {customer.id}
                            </TableCell>
                            <TableCell>{customer.name}</TableCell>
                            <TableCell>{customer.mobile}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    aria-haspopup="true"
                                    size="icon"
                                    variant="ghost"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DialogTrigger asChild>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        setSelectedCustomer(customer)
                                      }
                                    >
                                      View Details
                                    </DropdownMenuItem>
                                  </DialogTrigger>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <DialogContent className="sm:max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>
                      Customer Details: {selectedCustomer.name}
                    </DialogTitle>
                  </DialogHeader>
                   <div className="grid gap-6">
                        <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <div>
                                    <p className="font-semibold text-muted-foreground">Name</p>
                                    <p>{selectedCustomer.name}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-muted-foreground">Mobile</p>
                                    <p>{selectedCustomer.mobile}</p>
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold text-muted-foreground">Email</p>
                                <p>{selectedCustomer.email}</p>
                            </div>
                        </CardContent>
                        </Card>

                        <div>
                        <h3 className="mb-4 text-lg font-medium">Ride History</h3>
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Pick up</TableHead>
                                <TableHead>Drop off</TableHead>
                                <TableHead className="text-right">Fare</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {selectedCustomer.rides.map((ride) => (
                                <TableRow key={ride.rideId}>
                                <TableCell>{ride.date}</TableCell>
                                <TableCell>{ride.from}</TableCell>
                                <TableCell>{ride.to}</TableCell>
                                <TableCell className="text-right">{ride.fare}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        </div>
                    </div>
                </DialogContent>
              </Dialog>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Location & Hub Management</CardTitle>
                    <CardDescription>
                      Manage specific city hubs within your approved states.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="mb-6 flex flex-col gap-4 rounded-md border border-primary/20 p-4 bg-primary/5">
                          <div className="space-y-1">
                              <p className="text-sm font-bold flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-primary" />
                                  Add a new city hub
                              </p>
                              <p className="text-xs text-muted-foreground">Define precise service areas by selecting from approved states.</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                              <Select value={selectedState} onValueChange={handleStateChange}>
                                  <SelectTrigger className="bg-background">
                                      <SelectValue placeholder="State" />
                                  </SelectTrigger>
                                  <SelectContent>
                                      {approvedStatesList.sort().map(state => (
                                          <SelectItem key={state} value={state}>{state}</SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                              <Select 
                                value={selectedDistrict} 
                                onValueChange={handleDistrictChange}
                                disabled={!selectedState}
                              >
                                  <SelectTrigger className="bg-background">
                                      <SelectValue placeholder="District" />
                                  </SelectTrigger>
                                  <SelectContent>
                                      {districts.map(district => (
                                          <SelectItem key={district} value={district}>{district}</SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                              <Input
                                  placeholder="Enter City Name"
                                  className="bg-background"
                                  value={selectedCity}
                                  onChange={(e) => setSelectedCity(e.target.value)}
                                  disabled={!selectedDistrict}
                              />
                              <Button onClick={handleAddServiceArea} disabled={!selectedCity}>Add Hub</Button>
                          </div>
                      </div>

                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead>City Hub</TableHead>
                          <TableHead>District</TableHead>
                          <TableHead>State</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {serviceAreas.map((area) => (
                          <TableRow key={area.id} className="hover:bg-muted/10 transition-colors">
                            <TableCell className="font-bold">{area.city}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{area.district}</TableCell>
                            <TableCell className="text-sm">{area.state}</TableCell>
                            <TableCell>
                              <Badge variant={area.active ? 'default' : 'secondary'} className="px-3">
                                {area.active ? 'Live' : 'Hidden'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveServiceArea(area.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Global Rate Controls</CardTitle>
                    <CardDescription>
                      Configure the standard per-kilometer rates across the platform.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-3 p-4 border rounded-xl bg-muted/10">
                            <Label className="text-xs font-bold uppercase tracking-tighter text-muted-foreground">E-Rickshaw Rate (₹/km)</Label>
                            <div className="flex items-center gap-3">
                                <IndianRupee className="h-5 w-5 text-primary" />
                                <Input
                                    type="number"
                                    className="text-xl font-bold h-12"
                                    value={rates.erickshaw}
                                    onChange={(e) => setRates({ ...rates, erickshaw: Number(e.target.value) || 0 })}
                                />
                            </div>
                        </div>
                        <div className="space-y-3 p-4 border rounded-xl bg-muted/10">
                            <Label className="text-xs font-bold uppercase tracking-tighter text-muted-foreground">Standard Cab Rate (₹/km)</Label>
                            <div className="flex items-center gap-3">
                                <IndianRupee className="h-5 w-5 text-primary" />
                                <Input
                                    type="number"
                                    className="text-xl font-bold h-12"
                                    value={rates.cab}
                                    onChange={(e) => setRates({ ...rates, cab: Number(e.target.value) || 0 })}
                                />
                            </div>
                        </div>
                    </div>
                    <Button onClick={handleSaveRates} size="lg" className="w-full md:w-auto px-12 h-12">Apply New Rates</Button>
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
