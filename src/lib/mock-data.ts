export const DUMMY_DRIVERS = [
  {
    id: 'DRV001',
    uid: 'xyz789',
    name: 'Ramesh Kumar',
    gender: 'Male',
    email: 'ramesh@example.com',
    phone: '+919876543211',
    address: '123, Driver Lane',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    role: 'driver',
    isBlocked: false,
    vehicleType: 'Cab',
    vehicleNumber: 'MH12AB1234',
    accountNumber: '...1234',
    grossEarnings: 12500,
    photoUrl: 'https://picsum.photos/seed/driver1/200/200',
    profilePic: 'https://picsum.photos/seed/driver1/200/200',
    idProofUrl: 'https://picsum.photos/seed/id1/400/250',
    password: 'password',
    walletBalance: 4500,
    createdAt: '2023-01-15T10:00:00Z',
  },
  {
    id: 'DRV002',
    uid: 'abc456',
    name: 'Suresh Singh',
    gender: 'Male',
    email: 'suresh@example.com',
    phone: '+919876543212',
    address: '456, Auto Road',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    role: 'driver',
    isBlocked: false,
    vehicleType: 'E-Rickshaw',
    vehicleNumber: 'DL01CD5678',
    accountNumber: '...5678',
    grossEarnings: 9800,
    photoUrl: 'https://picsum.photos/seed/driver2/200/200',
    profilePic: 'https://picsum.photos/seed/driver2/200/200',
    idProofUrl: 'https://picsum.photos/seed/id2/400/250',
    password: 'password',
    walletBalance: 3200,
    createdAt: '2023-02-20T11:30:00Z',
  },
];

export const DUMMY_CUSTOMERS = [
  {
    id: 'CUST001',
    uid: 'xyz123',
    name: 'Anjali Sharma',
    gender: 'Female',
    email: 'anjali@example.com',
    phone: '+919876543210',
    address: '123, MG Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034',
    role: 'customer',
    isBlocked: false,
    profilePic: 'https://picsum.photos/seed/anjali/200/200',
    createdAt: '2023-05-08T10:00:00Z',
    rides: [
      {
        rideId: 'RIDE001',
        from: 'Connaught Place',
        to: 'India Gate',
        time: '2023-10-27 10:00 AM',
        date: '2023-10-27',
        fare: '₹75',
        transactionId: 'TXN001',
      },
    ],
  },
];

export const DUMMY_LOCATIONS_DATA = [
    { state: 'Andhra Pradesh', district: 'Amaravati', city: 'Vijayawada' },
    { state: 'Arunachal Pradesh', district: 'Itanagar', city: 'Itanagar' },
    { state: 'Assam', district: 'Kamrup', city: 'Guwahati' },
    { state: 'Bihar', district: 'Patna', city: 'Patna' },
    { state: 'Chhattisgarh', district: 'Raipur', city: 'Raipur' },
    { state: 'Goa', district: 'North Goa', city: 'Panaji' },
    { state: 'Gujarat', district: 'Ahmedabad', city: 'Ahmedabad' },
    { state: 'Haryana', district: 'Gurugram', city: 'Gurugram' },
    { state: 'Himachal Pradesh', district: 'Shimla', city: 'Shimla' },
    { state: 'Jharkhand', district: 'Ranchi', city: 'Ranchi' },
    { state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bengaluru' },
    { state: 'Kerala', district: 'Thiruvananthapuram', city: 'Thiruvananthapuram' },
    { state: 'Madhya Pradesh', district: 'Bhopal', city: 'Bhopal' },
    { state: 'Maharashtra', district: 'Mumbai City', city: 'Mumbai' },
    { state: 'Manipur', district: 'Imphal West', city: 'Imphal' },
    { state: 'Meghalaya', district: 'East Khasi Hills', city: 'Shillong' },
    { state: 'Mizoram', district: 'Aizawl', city: 'Aizawl' },
    { state: 'Nagaland', district: 'Kohima', city: 'Kohima' },
    { state: 'Odisha', district: 'Khurda', city: 'Bhubaneswar' },
    { state: 'Punjab', district: 'Ludhiana', city: 'Ludhiana' },
    { state: 'Rajasthan', district: 'Jaipur', city: 'Jaipur' },
    { state: 'Sikkim', district: 'Gangtok', city: 'Gangtok' },
    { state: 'Tamil Nadu', district: 'Chennai', city: 'Chennai' },
    { state: 'Telangana', district: 'Hyderabad', city: 'Hyderabad' },
    { state: 'Tripura', district: 'West Tripura', city: 'Agartala' },
    { state: 'Uttar Pradesh', district: 'Lucknow', city: 'Lucknow' },
    { state: 'Uttarakhand', district: 'Dehradun', city: 'Dehradun' },
    { state: 'West Bengal', district: 'Kolkata', city: 'Kolkata' },
    { state: 'Andaman and Nicobar Islands', district: 'South Andaman', city: 'Port Blair' },
    { state: 'Chandigarh', district: 'Chandigarh', city: 'Chandigarh' },
    { state: 'Dadra and Nagar Haveli and Daman and Diu', district: 'Daman', city: 'Daman' },
    { state: 'Delhi', district: 'New Delhi', city: 'New Delhi' },
    { state: 'Jammu and Kashmir', district: 'Srinagar', city: 'Srinagar' },
    { state: 'Ladakh', district: 'Leh', city: 'Leh' },
    { state: 'Lakshadweep', district: 'Kavaratti', city: 'Kavaratti' },
    { state: 'Puducherry', district: 'Puducherry', city: 'Puducherry' },
];

export const ADMIN_DASHBOARD_STATS = {
    totalRides: 1250,
    grossVolume: 85230,
};

export const BOOK_RIDE_SERVICE_AREAS = [
    { city: 'Mumbai', state: 'Maharashtra', range: 25, active: true },
    { city: 'Delhi', state: 'Delhi', range: 30, active: true },
    { city: 'Lucknow', state: 'Uttar Pradesh', range: 15, active: false },
];

export const SUPPORT_FAQS = [
  {
    question: 'How do I book a ride?',
    answer: 'Go to the "Book a Ride" page, enter your pickup and destination locations, and choose your preferred vehicle type.',
  },
  {
    question: 'What types of vehicles are available?',
    answer: 'TOTO offers E-Rickshaws for short distances and standard Cabs for longer, more comfortable journeys.',
  },
  {
    question: 'How is the fare calculated?',
    answer: 'Fares are calculated based on the distance between your pickup and destination. Rates vary by vehicle type.',
  },
  {
    question: 'Can I cancel a ride?',
    answer: 'Yes, you can cancel a ride before the driver accepts or if the driver is delayed.',
  },
  {
    question: 'How can I become a driver?',
    answer: 'Navigate to the "Become a Driver" section on the home page and complete the registration process.',
  },
];

export const DEFAULT_RATES = {
    erickshaw: 10,
    cab: 15,
};

export const MOCK_PAYMENTS = [
  { id: 'RIDE_101', customer: 'Anjali S.', amount: 450, mode: 'UPI', status: 'success', timestamp: '2023-10-27T10:30:00Z' },
  { id: 'RIDE_102', customer: 'Rahul V.', amount: 120, mode: 'Cash', status: 'pending', timestamp: '2023-10-27T11:15:00Z' },
  { id: 'RIDE_103', customer: 'Priya K.', amount: 350, mode: 'Card', status: 'success', timestamp: '2023-10-27T12:00:00Z' },
];

export const MOCK_SETTLEMENTS = [
  { driverId: 'DRV001', name: 'Ramesh Kumar', trips: 15, gross: 4500, commission: 900, net: 3600, settled: 'Yes' },
  { driverId: 'DRV002', name: 'Suresh Singh', trips: 12, gross: 3200, commission: 640, net: 2560, settled: 'Pending' },
];