
export const DUMMY_DRIVERS = [
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

export const DUMMY_CUSTOMERS = [
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
       {
        rideId: 'RIDE005',
        from: 'Gateway of India',
        to: 'Bandra-Worli Sea Link',
        time: '2023-10-28 05:00 PM',
        transactionId: 'TXN005',
      },
      {
        rideId: 'RIDE006',
        from: 'Juhu Beach',
        to: 'Siddhivinayak Temple',
        time: '2023-10-29 09:00 AM',
        transactionId: 'TXN006',
      },
    ],
  },
];

export const DUMMY_LOCATIONS_DATA = [
    // Andhra Pradesh
    { state: 'Andhra Pradesh', district: 'Visakhapatnam', city: 'Visakhapatnam' },
    { state: 'Andhra Pradesh', district: 'Krishna', city: 'Vijayawada' },
    { state: 'Andhra Pradesh', district: 'Guntur', city: 'Guntur' },
    { state: 'Andhra Pradesh', district: 'Nellore', city: 'Nellore' },
    { state: 'Andhra Pradesh', district: 'Chittoor', city: 'Tirupati' },
    // Arunachal Pradesh
    { state: 'Arunachal Pradesh', district: 'Papum Pare', city: 'Itanagar' },
    // Assam
    { state: 'Assam', district: 'Kamrup Metropolitan', city: 'Guwahati' },
    { state: 'Assam', district: 'Dibrugarh', city: 'Dibrugarh' },
    { state: 'Assam', district: 'Cachar', city: 'Silchar' },
    // Bihar
    { state: 'Bihar', district: 'Patna', city: 'Patna' },
    { state: 'Bihar', district: 'Gaya', city: 'Gaya' },
    { state: 'Bihar', district: 'Bhagalpur', city: 'Bhagalpur' },
    { state: 'Bihar', district: 'Muzaffarpur', city: 'Muzaffarpur' },
    // Chhattisgarh
    { state: 'Chhattisgarh', district: 'Raipur', city: 'Raipur' },
    { state: 'Chhattisgarh', district: 'Durg', city: 'Bhilai' },
    { state: 'Chhattisgarh', district: 'Bilaspur', city: 'Bilaspur' },
    // Goa
    { state: 'Goa', district: 'North Goa', city: 'Panaji' },
    { state: 'Goa', district: 'South Goa', city: 'Margao' },
    // Gujarat
    { state: 'Gujarat', district: 'Ahmedabad', city: 'Ahmedabad' },
    { state: 'Gujarat', district: 'Surat', city: 'Surat' },
    { state: 'Gujarat', district: 'Vadodara', city: 'Vadodara' },
    { state: 'Gujarat', district: 'Rajkot', city: 'Rajkot' },
    // Haryana
    { state: 'Haryana', district: 'Gurgaon', city: 'Gurugram' },
    { state: 'Haryana', district: 'Faridabad', city: 'Faridabad' },
    { state: 'Haryana', district: 'Panipat', city: 'Panipat' },
    // Himachal Pradesh
    { state: 'Himachal Pradesh', district: 'Shimla', city: 'Shimla' },
    // Jharkhand
    { state: 'Jharkhand', district: 'Ranchi', city: 'Ranchi' },
    { state: 'Jharkhand', district: 'East Singhbhum', city: 'Jamshedpur' },
    { state: 'Jharkhand', district: 'Dhanbad', city: 'Dhanbad' },
    // Karnataka
    { state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bengaluru' },
    { state: 'Karnataka', district: 'Mysuru', city: 'Mysuru' },
    { state: 'Karnataka', district: 'Dakshina Kannada', city: 'Mangaluru' },
    // Kerala
    { state: 'Kerala', district: 'Thiruvananthapuram', city: 'Thiruvananthapuram' },
    { state: 'Kerala', district: 'Ernakulam', city: 'Kochi' },
    { state: 'Kerala', district: 'Kozhikode', city: 'Kozhikode' },
    // Madhya Pradesh
    { state: 'Madhya Pradesh', district: 'Bhopal', city: 'Bhopal' },
    { state: 'Madhya Pradesh', district: 'Indore', city: 'Indore' },
    { state: 'Madhya Pradesh', district: 'Gwalior', city: 'Gwalior' },
    { state: 'Madhya Pradesh', district: 'Jabalpur', city: 'Jabalpur' },
    // Maharashtra
    { state: 'Maharashtra', district: 'Mumbai City', city: 'Mumbai' },
    { state: 'Maharashtra', district: 'Pune', city: 'Pune' },
    { state: 'Maharashtra', district: 'Nagpur', city: 'Nagpur' },
    { state: 'Maharashtra', district: 'Thane', city: 'Thane' },
    { state: 'Maharashtra', district: 'Nashik', city: 'Nashik' },
    // Manipur
    { state: 'Manipur', district: 'Imphal West', city: 'Imphal' },
    // Meghalaya
    { state: 'Meghalaya', district: 'East Khasi Hills', city: 'Shillong' },
    // Mizoram
    { state: 'Mizoram', district: 'Aizawl', city: 'Aizawl' },
    // Nagaland
    { state: 'Nagaland', district: 'Dimapur', city: 'Dimapur' },
    { state: 'Nagaland', district: 'Kohima', city: 'Kohima' },
    // Odisha
    { state: 'Odisha', district: 'Khordha', city: 'Bhubaneswar' },
    { state: 'Odisha', district: 'Cuttack', city: 'Cuttack' },
    { state: 'Odisha', district: 'Sundargarh', city: 'Rourkela' },
    // Punjab
    { state: 'Punjab', district: 'Ludhiana', city: 'Ludhiana' },
    { state: 'Punjab', district: 'Amritsar', city: 'Amritsar' },
    { state: 'Punjab', district: 'Jalandhar', city: 'Jalandhar' },
    // Rajasthan
    { state: 'Rajasthan', district: 'Jaipur', city: 'Jaipur' },
    { state: 'Rajasthan', district: 'Jodhpur', city: 'Jodhpur' },
    { state: 'Rajasthan', district: 'Kota', city: 'Kota' },
    { state: 'Rajasthan', district: 'Bikaner', city: 'Bikaner' },
    // Sikkim
    { state: 'Sikkim', district: 'East Sikkim', city: 'Gangtok' },
    // Tamil Nadu
    { state: 'Tamil Nadu', district: 'Chennai', city: 'Chennai' },
    { state: 'Tamil Nadu', district: 'Coimbatore', city: 'Coimbatore' },
    { state: 'Tamil Nadu', district: 'Madurai', city: 'Madurai' },
    // Telangana
    { state: 'Telangana', district: 'Hyderabad', city: 'Hyderabad' },
    { state: 'Telangana', district: 'Warangal Urban', city: 'Warangal' },
    // Tripura
    { state: 'Tripura', district: 'West Tripura', city: 'Agartala' },
    // Uttar Pradesh
    { state: 'Uttar Pradesh', district: 'Lucknow', city: 'Lucknow' },
    { state: 'Uttar Pradesh', district: 'Kanpur Nagar', city: 'Kanpur' },
    { state: 'Uttar Pradesh', district: 'Ghaziabad', city: 'Ghaziabad' },
    { state: 'Uttar Pradesh', district: 'Agra', city: 'Agra' },
    { state: 'Uttar Pradesh', district: 'Varanasi', city: 'Varanasi' },
    // Uttarakhand
    { state: 'Uttarakhand', district: 'Dehradun', city: 'Dehradun' },
    { state: 'Uttarakhand', district: 'Haridwar', city: 'Haridwar' },
    // West Bengal
    { state: 'West Bengal', district: 'Kolkata', city: 'Kolkata' },
    { state: 'West Bengal', district: 'Howrah', city: 'Howrah' },
    { state: 'West Bengal', district: 'Asansol', city: 'Asansol' },
    // Union Territories
    { state: 'Delhi', district: 'New Delhi', city: 'New Delhi' },
    { state: 'Chandigarh', district: 'Chandigarh', city: 'Chandigarh' },
    { state: 'Puducherry', district: 'Puducherry', city: 'Puducherry' },
    { state: 'Jammu and Kashmir', district: 'Srinagar', city: 'Srinagar' },
    { state: 'Jammu and Kashmir', district: 'Jammu', city: 'Jammu' },
    { state: 'Ladakh', district: 'Leh', city: 'Leh' },
];

export const ADMIN_DASHBOARD_STATS = {
    totalRides: 1250,
    grossVolume: 85230,
};

export const BOOK_RIDE_SERVICE_AREAS = [
    { city: 'Mumbai', state: 'Maharashtra', active: true },
    { city: 'Delhi', state: 'Delhi', active: true },
    { city: 'Bengaluru', state: 'Karnataka', active: false },
    { city: 'Gurugram', state: 'Haryana', active: true },
];

export const CUSTOMER_DASHBOARD_RIDE_HISTORY = [
    {
        rideId: 'RIDE001',
        from: 'Connaught Place',
        to: 'India Gate',
        date: '2023-10-27',
        fare: '₹75',
    },
    {
        rideId: 'RIDE002',
        from: 'Cyber Hub',
        to: 'Ambience Mall',
        date: '2023-10-26',
        fare: '₹150',
    },
     {
        rideId: 'RIDE004',
        from: 'Hauz Khas Village',
        to: 'Select Citywalk',
        date: '2023-10-25',
        fare: '₹120',
    }
];

export const SUPPORT_FAQS = [
  {
    question: 'How do I book a ride?',
    answer:
      'Go to the "Book a Ride" page, enter your pickup and destination locations, and choose your preferred vehicle type. Your ride will be confirmed instantly!',
  },
  {
    question: 'What types of vehicles are available?',
    answer:
      'We offer both eco-friendly E-Rickshaws for short trips and comfortable Cabs for longer journeys.',
  },
  {
    question: 'How is the fare calculated?',
    answer:
      'Fares are calculated based on the distance between your pickup and destination points. You will see an estimated fare before you confirm your booking.',
  },
  {
    question: 'Can I cancel a ride?',
    answer:
      'Currently, ride cancellation is not supported through the app. Please contact our support team for assistance.',
  },
  {
      question: 'How can I become a driver?',
      answer: 'You can register as a driver by clicking the "Become a Driver" button on the homepage and filling out the registration form. Our team will review your application and get in touch with you.'
  }
];

export const DEFAULT_RATES = {
    erickshaw: 10,
    cab: 15,
};
