
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
