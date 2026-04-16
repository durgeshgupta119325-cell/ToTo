
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
  Car,
  Users,
  IndianRupee,
  MoreHorizontal,
  Trash2,
  Percent,
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

import { useState } from 'react';

// Mock Data
const DUMMY_DRIVERS = [
  {
    id: 'DRV001',
    name: 'Ramesh Kumar',
    email: 'ramesh@example.com',
    vehicleNumber: 'MH12AB1234',
    accountNumber: '...1234',
    grossEarnings: 12500,
  },
  {
    id: 'DRV002',
    name: 'Suresh Singh',
    email: 'suresh@example.com',
    vehicleNumber: 'DL01CD5678',
    accountNumber: '...5678',
    grossEarnings: 9800,
  },
  {
    id: 'DRV003',
    name: 'Deepak Verma',
    email: 'deepak@example.com',
    vehicleNumber: 'KA05EF9012',
    accountNumber: '...9012',
    grossEarnings: 15200,
  },
];

const DUMMY_CUSTOMERS = [
  {
    id: 'CUST001',
    name: 'Anjali Sharma',
    email: 'anjali@example.com',
    phone: '9876543210',
    address: '123, MG Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034',
    rides: [
      {
        rideId: 'RIDE001',
        from: 'Connaught Place',
        to: 'India Gate',
        time: '2023-10-27 10:00 AM',
        transactionId: 'TXN001',
      },
      {
        rideId: 'RIDE002',
        from: 'Cyber Hub',
        to: 'Ambience Mall',
        time: '2023-10-26 08:30 PM',
        transactionId: 'TXN002',
      },
    ],
  },
  {
    id: 'CUST002',
    name: 'Vikram Batra',
    email: 'vikram@example.com',
    phone: '9123456780',
    address: '456, Marine Drive',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    rides: [
      {
        rideId: 'RIDE003',
        from: 'Koramangala',
        to: 'MG Road',
        time: '2023-10-27 11:00 AM',
        transactionId: 'TXN003',
      },
    ],
  },
];

const DUMMY_LOCATIONS_DATA = [
    // Andhra Pradesh
    { state: 'Andhra Pradesh', district: 'Visakhapatnam', city: 'Visakhapatnam' },
    { state: 'Andhra Pradesh', district: 'Krishna', city: 'Vijayawada' },
    { state: 'Andhra Pradesh', district: 'Guntur', city: 'Guntur' },
    { state: 'Andhra Pradesh', district: 'Nellore', city: 'Nellore' },
    { state: 'Andhra Pradesh', district: 'Chittoor', city: 'Tirupati' },
    { state: 'Andhra Pradesh', district: 'Anantapur', city: 'Anantapur' },
    { state: 'Andhra Pradesh', district: 'Kurnool', city: 'Kurnool' },
    { state: 'Andhra Pradesh', district: 'East Godavari', city: 'Rajahmundry' },
    { state: 'Andhra Pradesh', district: 'West Godavari', city: 'Eluru' },
    { state: 'Andhra Pradesh', district: 'Prakasam', city: 'Ongole' },
    // Assam
    { state: 'Assam', district: 'Kamrup Metropolitan', city: 'Guwahati' },
    { state: 'Assam', district: 'Dibrugarh', city: 'Dibrugarh' },
    { state: 'Assam', district: 'Cachar', city: 'Silchar' },
    { state: 'Assam', district: 'Jorhat', city: 'Jorhat' },
    // Bihar
    { state: 'Bihar', district: 'Patna', city: 'Patna' },
    { state: 'Bihar', district: 'Gaya', city: 'Gaya' },
    { state: 'Bihar', district: 'Bhagalpur', city: 'Bhagalpur' },
    { state: 'Bihar', district: 'Muzaffarpur', city: 'Muzaffarpur' },
    { state: 'Bihar', district: 'Darbhanga', city: 'Darbhanga' },
    { state: 'Bihar', district: 'Purnia', city: 'Purnia' },
    // Chandigarh
    { state: 'Chandigarh', district: 'Chandigarh', city: 'Chandigarh' },
    // Chhattisgarh
    { state: 'Chhattisgarh', district: 'Raipur', city: 'Raipur' },
    { state: 'Chhattisgarh', district: 'Durg', city: 'Bhilai' },
    { state: 'Chhattisgarh', district: 'Bilaspur', city: 'Bilaspur' },
    { state: 'Chhattisgarh', district: 'Korba', city: 'Korba' },
    // Delhi
    { state: 'Delhi', district: 'New Delhi', city: 'New Delhi' },
    { state: 'Delhi', district: 'North Delhi', city: 'North Delhi' },
    { state: 'Delhi', district: 'South Delhi', city: 'South Delhi' },
    { state: 'Delhi', district: 'East Delhi', city: 'East Delhi' },
    { state: 'Delhi', district: 'West Delhi', city: 'West Delhi' },
    // Gujarat
    { state: 'Gujarat', district: 'Ahmedabad', city: 'Ahmedabad' },
    { state: 'Gujarat', district: 'Surat', city: 'Surat' },
    { state: 'Gujarat', district: 'Vadodara', city: 'Vadodara' },
    { state: 'Gujarat', district: 'Rajkot', city: 'Rajkot' },
    { state: 'Gujarat', district: 'Jamnagar', city: 'Jamnagar' },
    { state: 'Gujarat', district: 'Bhavnagar', city: 'Bhavnagar' },
    { state: 'Gujarat', district: 'Gandhinagar', city: 'Gandhinagar' },
    // Haryana
    { state: 'Haryana', district: 'Gurgaon', city: 'Gurugram' },
    { state: 'Haryana', district: 'Faridabad', city: 'Faridabad' },
    { state: 'Haryana', district: 'Panipat', city: 'Panipat' },
    { state: 'Haryana', district: 'Ambala', city: 'Ambala' },
    { state: 'Haryana', district: 'Rohtak', city: 'Rohtak' },
    { state: 'Haryana', district: 'Hisar', city: 'Hisar' },
    // Himachal Pradesh
    { state: 'Himachal Pradesh', district: 'Shimla', city: 'Shimla' },
    { state: 'Himachal Pradesh', district: 'Mandi', city: 'Mandi' },
    { state: 'Himachal Pradesh', district: 'Kangra', city: 'Dharamshala' },
    // Jharkhand
    { state: 'Jharkhand', district: 'Ranchi', city: 'Ranchi' },
    { state: 'Jharkhand', district: 'East Singhbhum', city: 'Jamshedpur' },
    { state: 'Jharkhand', district: 'Dhanbad', city: 'Dhanbad' },
    { state: 'Jharkhand', district: 'Bokaro', city: 'Bokaro Steel City' },
    // Jammu and Kashmir
    { state: 'Jammu and Kashmir', district: 'Srinagar', city: 'Srinagar' },
    { state: 'Jammu and Kashmir', district: 'Jammu', city: 'Jammu' },
    // Karnataka
    { state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bengaluru' },
    { state: 'Karnataka', district: 'Mysuru', city: 'Mysuru' },
    { state: 'Karnataka', district: 'Dakshina Kannada', city: 'Mangaluru' },
    { state: 'Karnataka', district: 'Dharwad', city: 'Hubli-Dharwad' },
    { state: 'Karnataka', district: 'Belagavi', city: 'Belagavi' },
    { state: 'Karnataka', district: 'Davanagere', city: 'Davanagere' },
    { state: 'Karnataka', district: 'Ballari', city: 'Ballari' },
    { state: 'Karnataka', district: 'Shivamogga', city: 'Shivamogga' },
    // Kerala
    { state: 'Kerala', district: 'Ernakulam', city: 'Kochi' },
    { state: 'Kerala', district: 'Thiruvananthapuram', city: 'Thiruvananthapuram' },
    { state: 'Kerala', district: 'Kozhikode', city: 'Kozhikode' },
    { state: 'Kerala', district: 'Thrissur', city: 'Thrissur' },
    { state: 'Kerala', district: 'Kollam', city: 'Kollam' },
    { state: 'Kerala', district: 'Palakkad', city: 'Palakkad' },
    // Madhya Pradesh
    { state: 'Madhya Pradesh', district: 'Bhopal', city: 'Bhopal' },
    { state: 'Madhya Pradesh', district: 'Indore', city: 'Indore' },
    { state: 'Madhya Pradesh', district: 'Gwalior', city: 'Gwalior' },
    { state: 'Madhya Pradesh', district: 'Jabalpur', city: 'Jabalpur' },
    { state: 'Madhya Pradesh', district: 'Ujjain', city: 'Ujjain' },
    { state: 'Madhya Pradesh', district: 'Sagar', city: 'Sagar' },
    // Maharashtra
    { state: 'Maharashtra', district: 'Mumbai City', city: 'Mumbai' },
    { state: 'Maharashtra', district: 'Pune', city: 'Pune' },
    { state: 'Maharashtra', district: 'Nagpur', city: 'Nagpur' },
    { state: 'Maharashtra', district: 'Thane', city: 'Thane' },
    { state: 'Maharashtra', district: 'Pune', city: 'Pimpri-Chinchwad' },
    { state: 'Maharashtra', district: 'Nashik', city: 'Nashik' },
    { state: 'Maharashtra', district: 'Aurangabad', city: 'Aurangabad' },
    { state: 'Maharashtra', district: 'Solapur', city: 'Solapur' },
    { state: 'Maharashtra', district: 'Thane', city: 'Navi Mumbai' },
    { state: 'Maharashtra', district: 'Kolhapur', city: 'Kolhapur' },
    // Odisha
    { state: 'Odisha', district: 'Khordha', city: 'Bhubaneswar' },
    { state: 'Odisha', district: 'Cuttack', city: 'Cuttack' },
    { state: 'Odisha', district: 'Sundargarh', city: 'Rourkela' },
    { state: 'Odisha', district: 'Ganjam', city: 'Berhampur' },
    // Punjab
    { state: 'Punjab', district: 'Ludhiana', city: 'Ludhiana' },
    { state: 'Punjab', district: 'Amritsar', city: 'Amritsar' },
    { state: 'Punjab', district: 'Jalandhar', city: 'Jalandhar' },
    { state: 'Punjab', district: 'Patiala', city: 'Patiala' },
    { state: 'Punjab', district: 'SAS Nagar', city: 'Mohali' },
    // Rajasthan
    { state: 'Rajasthan', district: 'Jaipur', city: 'Jaipur' },
    { state: 'Rajasthan', district: 'Jodhpur', city: 'Jodhpur' },
    { state: 'Rajasthan', district: 'Kota', city: 'Kota' },
    { state: 'Rajasthan', district: 'Bikaner', city: 'Bikaner' },
    { state: 'Rajasthan', district: 'Udaipur', city: 'Udaipur' },
    { state: 'Rajasthan', district: 'Ajmer', city: 'Ajmer' },
    { state: 'Rajasthan', district: 'Alwar', city: 'Alwar' },
    // Tamil Nadu
    { state: 'Tamil Nadu', district: 'Chennai', city: 'Chennai' },
    { state: 'Tamil Nadu', district: 'Coimbatore', city: 'Coimbatore' },
    { state: 'Tamil Nadu', district: 'Madurai', city: 'Madurai' },
    { state: 'Tamil Nadu', district: 'Tiruchirappalli', city: 'Tiruchirappalli' },
    { state: 'Tamil Nadu', district: 'Salem', city: 'Salem' },
    { state: 'Tamil Nadu', district: 'Tirunelveli', city: 'Tirunelveli' },
    { state: 'Tamil Nadu', district: 'Vellore', city: 'Vellore' },
    // Telangana
    { state: 'Telangana', district: 'Hyderabad', city: 'Hyderabad' },
    { state: 'Telangana', district: 'Warangal Urban', city: 'Warangal' },
    { state: 'Telangana', district: 'Karimnagar', city: 'Karimnagar' },
    { state: 'Telangana', district: 'Nizamabad', city: 'Nizamabad' },
    // Uttar Pradesh
    { state: 'Uttar Pradesh', district: 'Lucknow', city: 'Lucknow' },
    { state: 'Uttar Pradesh', district: 'Kanpur Nagar', city: 'Kanpur' },
    { state: 'Uttar Pradesh', district: 'Gautam Buddha Nagar', city: 'Noida' },
    { state: 'Uttar Pradesh', district: 'Agra', city: 'Agra' },
    { state: 'Uttar Pradesh', district: 'Ghaziabad', city: 'Ghaziabad' },
    { state: 'Uttar Pradesh', district: 'Varanasi', city: 'Varanasi' },
    { state: 'Uttar Pradesh', district: 'Meerut', city: 'Meerut' },
    { state: 'Uttar Pradesh', district: 'Prayagraj', city: 'Prayagraj' },
    { state: 'Uttar Pradesh', district: 'Bareilly', city: 'Bareilly' },
    { state: 'Uttar Pradesh', district: 'Aligarh', city: 'Aligarh' },
    // Uttarakhand
    { state: 'Uttarakhand', district: 'Dehradun', city: 'Dehradun' },
    { state: 'Uttarakhand', district: 'Haridwar', city: 'Haridwar' },
    { state: 'Uttarakhand', district: 'Nainital', city: 'Nainital' },
    // West Bengal
    { state: 'West Bengal', district: 'Kolkata', city: 'Kolkata' },
    { state: 'West Bengal', district: 'Howrah', city: 'Howrah' },
    { state: 'West Bengal', district: 'Paschim Bardhaman', city: 'Asansol' },
    { state: 'West Bengal', district: 'Paschim Bardhaman', city: 'Durgapur' },
    { state: 'West Bengal', district: 'Darjeeling', city: 'Siliguri' },
];

const dashboardStats = {
    totalRides: 1250,
    grossVolume: 85230,
    platformCommission: 85230 * 0.02,
};


export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [driverList, setDriverList] = useState(DUMMY_DRIVERS);
  const [selectedCustomer, setSelectedCustomer] = useState(DUMMY_CUSTOMERS[0]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [serviceAreas, setServiceAreas] = useState([
    { id: 1, city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra', active: true },
    { id: 2, city: 'Delhi', district: 'New Delhi', state: 'Delhi', active: true },
    { id: 3, city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', active: false },
    { id: 4, city: 'Gurugram', district: 'Gurgaon', state: 'Haryana', active: true },
  ]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [districts, setDistricts] = useState<string[]>([]);

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
      customer.phone.includes(customerSearch)
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

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Rides
                    </CardTitle>
                    <Car className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardStats.totalRides.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Across all drivers
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Drivers
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {driverList.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Active on the platform
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
                      ₹{dashboardStats.grossVolume.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total value of all rides
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Platform Commission
                    </CardTitle>
                    <Percent className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ₹{dashboardStats.platformCommission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      2% of Gross Volume
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Drivers Tab */}
            <TabsContent value="drivers">
              <Card>
                <CardHeader>
                  <CardTitle>Driver Management</CardTitle>
                  <CardDescription>
                    View, manage, and remove drivers from the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Driver ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Vehicle No.</TableHead>
                        <TableHead>Account No.</TableHead>
                        <TableHead className="text-right">Gross Earnings</TableHead>
                        <TableHead className="text-right">Net Payout</TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {driverList.map((driver) => (
                        <TableRow key={driver.id}>
                          <TableCell className="font-medium">
                            {driver.id}
                          </TableCell>
                          <TableCell>{driver.name}</TableCell>
                          <TableCell>{driver.email}</TableCell>
                          <TableCell>{driver.vehicleNumber}</TableCell>
                          <TableCell>{driver.accountNumber}</TableCell>
                          <TableCell className="text-right">
                            ₹{driver.grossEarnings.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{(driver.grossEarnings * 0.98).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
            </TabsContent>

            {/* Customers Tab */}
            <TabsContent value="customers">
              <Dialog>
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Management</CardTitle>
                    <CardDescription>
                      Search for customers by name or mobile number to view their details and ride history.
                    </CardDescription>
                    <div className="relative pt-4">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground mt-2" />
                        <Input 
                            placeholder="Search by name or mobile number..."
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
                          <TableHead>Email</TableHead>
                          <TableHead>Phone Number</TableHead>
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
                            <TableCell>{customer.email}</TableCell>
                            <TableCell>{customer.phone}</TableCell>
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
                    <DialogDescription>
                      View customer information and their complete ride history.
                    </DialogDescription>
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
                                    <p className="font-semibold text-muted-foreground">Phone</p>
                                    <p>{selectedCustomer.phone}</p>
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold text-muted-foreground">Email</p>
                                <p>{selectedCustomer.email}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-muted-foreground">Address</p>
                                <p>{selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.state} - {selectedCustomer.pincode}</p>
                            </div>
                        </CardContent>
                        </Card>

                        <div>
                        <h3 className="mb-4 text-lg font-medium">Ride History</h3>
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Ride ID</TableHead>
                                <TableHead>Pick up and drop off</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Transaction ID</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {selectedCustomer.rides.map((ride) => (
                                <TableRow key={ride.rideId}>
                                <TableCell>{ride.rideId}</TableCell>
                                <TableCell>
                                    {ride.from} to {ride.to}
                                </TableCell>
                                <TableCell>{ride.time}</TableCell>
                                <TableCell>{ride.transactionId}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        </div>
                    </div>
                </DialogContent>
              </Dialog>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings">
               <Card>
                <CardHeader>
                  <CardTitle>Area Management</CardTitle>
                  <CardDescription>
                    Manage the areas where your service is available. Add or remove locations and toggle their status.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex flex-col gap-4 rounded-md border p-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Add a new service area</p>
                            <p className="text-sm text-muted-foreground">Select a state, district, and enter a city to add it to your operational areas.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                             <Select value={selectedState} onValueChange={handleStateChange}>
                                <SelectTrigger className="w-full min-w-[180px] flex-1">
                                    <SelectValue placeholder="Select a state" />
                                </SelectTrigger>
                                <SelectContent>
                                    {states.map(state => (
                                        <SelectItem key={state} value={state}>{state}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedDistrict} onValueChange={handleDistrictChange} disabled={!selectedState || districts.length === 0}>
                                <SelectTrigger className="w-full min-w-[180px] flex-1">
                                    <SelectValue placeholder="Select a district" />
                                </SelectTrigger>
                                <SelectContent>
                                    {districts.map(district => (
                                        <SelectItem key={district} value={district}>{district}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                placeholder="Enter a city"
                                className="w-full min-w-[180px] flex-1"
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                disabled={!selectedDistrict}
                            />
                            <Button onClick={handleAddServiceArea} className="w-full sm:w-auto">Add</Button>
                        </div>
                    </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>City</TableHead>
                        <TableHead>District</TableHead>
                        <TableHead>State</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Availability</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {serviceAreas.map((area) => (
                        <TableRow key={area.id}>
                          <TableCell className="font-medium">{area.city}</TableCell>
                          <TableCell>{area.district}</TableCell>
                          <TableCell>{area.state}</TableCell>
                          <TableCell>
                            <Badge variant={area.active ? 'default' : 'secondary'}>
                              {area.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={area.active}
                              onCheckedChange={() => handleServiceAreaToggle(area.id)}
                              aria-label={`Toggle service for ${area.city}`}
                            />
                          </TableCell>
                          <TableCell className="text-right">
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
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Remove
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
                                        This will remove {area.city} from your list of service areas. You can add it back later if needed.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-destructive hover:bg-destructive/90"
                                        onClick={() =>
                                            handleRemoveServiceArea(area.id)
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
