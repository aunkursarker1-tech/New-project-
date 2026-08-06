export interface GeoDivision {
  name: string;
  bnName: string;
  districts: GeoDistrict[];
}

export interface GeoDistrict {
  name: string;
  bnName: string;
  upazilas: GeoUpazila[];
}

export interface GeoUpazila {
  name: string;
  bnName: string;
  unions: string[];
}

export const BANGLADESH_GEO_DATA: GeoDivision[] = [
  {
    name: 'Dhaka',
    bnName: 'ঢাকা',
    districts: [
      {
        name: 'Dhaka',
        bnName: 'ঢাকা',
        upazilas: [
          { name: 'Dhanmondi', bnName: 'ধানমন্ডি', unions: ['Ward 14', 'Ward 15', 'Central Dhanmondi', 'Kalabagan'] },
          { name: 'Gulshan', bnName: 'গুলশান', unions: ['Gulshan 1', 'Gulshan 2', 'Niketan', 'Baridhara'] },
          { name: 'Banani', bnName: 'বনানী', unions: ['Block A-F', 'Banani DOHS', 'Chairman Bari'] },
          { name: 'Uttara', bnName: 'উত্তরা', unions: ['Sector 1-7', 'Sector 8-14', 'Uttarkhan', 'Dakshinkhan'] },
          { name: 'Mirpur', bnName: 'মিরপুর', unions: ['Mirpur 1', 'Mirpur 10', 'Mirpur 11', 'Mirpur 12', 'Mirpur DOHS', 'Pallabi'] },
          { name: 'Mohammadpur', bnName: 'মোহাম্মদপুর', unions: ['Japan Garden', 'Katasur', 'Ring Road', 'Adabor'] },
          { name: 'Badda', bnName: 'বাড্ডা', unions: ['Merul Badda', 'Middle Badda', 'Satarkul'] },
          { name: 'Motijheel', bnName: 'মতিঝিল', unions: ['Dilkusha', 'Arambagh', 'Fakirapool'] },
          { name: 'Savar', bnName: 'সাভার', unions: ['Savar Sadar', 'Dhamrai', 'Ashulia', 'EPZ'] },
        ],
      },
      {
        name: 'Gazipur',
        bnName: 'গাজীপুর',
        upazilas: [
          { name: 'Gazipur Sadar', bnName: 'গাজীপুর সদর', unions: ['Tongi', 'Board Bazar', 'Chowrastah'] },
          { name: 'Kaliakair', bnName: 'কালিয়াকৈর', unions: ['Mouchak', 'Chandra'] },
          { name: 'Sreepur', bnName: 'শ্রীপুর', unions: ['Maona', 'Rajendrapur'] },
        ],
      },
      {
        name: 'Narayanganj',
        bnName: 'নারায়ণগঞ্জ',
        upazilas: [
          { name: 'Narayanganj Sadar', bnName: 'নারায়ণগঞ্জ সদর', unions: ['Chashara', 'Tanbazar'] },
          { name: 'Siddhirganj', bnName: 'সিদ্ধিরগঞ্জ', unions: ['Mouchak', 'Shimrail'] },
          { name: 'Rupganj', bnName: 'রূপগঞ্জ', unions: ['Kanchpur', 'Bhulta'] },
        ],
      },
      {
        name: 'Tangail',
        bnName: 'টাঙ্গাইল',
        upazilas: [
          { name: 'Tangail Sadar', bnName: 'টাঙ্গাইল সদর', unions: ['Akur Takur', 'Sontosh'] },
          { name: 'Mirzapur', bnName: 'মির্জাপুর', unions: ['Gorai', 'Sadar'] },
        ],
      },
    ],
  },
  {
    name: 'Chittagong',
    bnName: 'চট্টগ্রাম',
    districts: [
      {
        name: 'Chittagong',
        bnName: 'চট্টগ্রাম',
        upazilas: [
          { name: 'Agrabad', bnName: 'আগ্রাবাদ', unions: ['Commercial Area', 'Halishahar'] },
          { name: 'GEC', bnName: 'জিইসি', unions: ['GEC Circle', 'Nasirabad', 'Khulshi'] },
          { name: 'Panchlaish', bnName: 'পাঁচলাইশ', unions: ['Sholashahar', 'Muradpur'] },
          { name: 'Kotwali', bnName: 'কোতোয়ালী', unions: ['Anderkilla', 'Chawkbazar'] },
          { name: 'Patiya', bnName: 'পটিয়া', unions: ['Patiya Sadar', 'Kanchannagar'] },
        ],
      },
      {
        name: 'Cox’s Bazar',
        bnName: 'কক্সবাজার',
        upazilas: [
          { name: 'Cox’s Bazar Sadar', bnName: 'কক্সবাজার সদর', unions: ['Kolatoli', 'Sugandha', 'Laboni'] },
          { name: 'Teknaf', bnName: 'টেকনাফ', unions: ['Teknaf Sadar', 'Sabrang'] },
        ],
      },
      {
        name: 'Comilla',
        bnName: 'কুমিল্লা',
        upazilas: [
          { name: 'Comilla Sadar', bnName: 'কুমিল্লা সদর', unions: ['Kandirpar', 'Kashinathpur'] },
          { name: 'Daudkandi', bnName: 'দাউদকান্দি', unions: ['Gouripur', 'Elliotganj'] },
        ],
      },
    ],
  },
  {
    name: 'Sylhet',
    bnName: 'সিলেট',
    districts: [
      {
        name: 'Sylhet',
        bnName: 'সিলেট',
        upazilas: [
          { name: 'Sylhet Sadar', bnName: 'সিলেট সদর', unions: ['Zindabazar', 'Amberkhana', 'Shahi Eidgah', 'Kumarpara'] },
          { name: 'Beanibazar', bnName: 'বিয়ানীবাজার', unions: ['Beanibazar Sadar', 'Charkhai'] },
        ],
      },
      {
        name: 'Moulvibazar',
        bnName: 'মৌলভীবাজার',
        upazilas: [
          { name: 'Sreemangal', bnName: 'শ্রীমঙ্গল', unions: ['Town Center', 'Radhanagar'] },
          { name: 'Moulvibazar Sadar', bnName: 'মৌলভীবাজার সদর', unions: ['Chowk', 'Sadar'] },
        ],
      },
    ],
  },
  {
    name: 'Rajshahi',
    bnName: 'রাজশাহী',
    districts: [
      {
        name: 'Rajshahi',
        bnName: 'রাজশাহী',
        upazilas: [
          { name: 'Boalia', bnName: 'বোয়ালিয়া', unions: ['Saheb Bazar', 'Shaheb Bazar'] },
          { name: 'Motihar', bnName: 'মতিহার', unions: ['RU Campus', 'Kajla'] },
          { name: 'Rajpara', bnName: 'রাজপাড়া', unions: ['Medical Area', 'Court Station'] },
        ],
      },
      {
        name: 'Bogra',
        bnName: 'বগুড়া',
        upazilas: [
          { name: 'Bogra Sadar', bnName: 'বগুড়া সদর', unions: ['Satmatha', 'Jaltal'] },
        ],
      },
    ],
  },
  {
    name: 'Khulna',
    bnName: 'খুলনা',
    districts: [
      {
        name: 'Khulna',
        bnName: 'খুলনা',
        upazilas: [
          { name: 'Khulna Sadar', bnName: 'খুলনা সদর', unions: ['Dakbangla', 'KDA Avenue'] },
          { name: 'Sonadanga', bnName: 'সোনাডাঙ্গা', unions: ['Bus Terminal', 'Boyra'] },
        ],
      },
      {
        name: 'Jessore',
        bnName: 'যশোর',
        upazilas: [
          { name: 'Jessore Sadar', bnName: 'যশোর সদর', unions: ['Dopeghat', 'Chowrasta'] },
        ],
      },
    ],
  },
  {
    name: 'Barisal',
    bnName: 'বরিশাল',
    districts: [
      {
        name: 'Barisal',
        bnName: 'বরিশাল',
        upazilas: [
          { name: 'Barisal Sadar', bnName: 'বরিশাল সদর', unions: ['Sadat', 'Natun Bazar'] },
        ],
      },
    ],
  },
  {
    name: 'Rangpur',
    bnName: 'রংপুর',
    districts: [
      {
        name: 'Rangpur',
        bnName: 'রংপুর',
        upazilas: [
          { name: 'Rangpur Sadar', bnName: 'রংপুর সদর', unions: ['Jahaj Company', 'Dhap'] },
        ],
      },
    ],
  },
  {
    name: 'Mymensingh',
    bnName: 'ময়মনসিংহ',
    districts: [
      {
        name: 'Mymensingh',
        bnName: 'ময়মনসিংহ',
        upazilas: [
          { name: 'Mymensingh Sadar', bnName: 'ময়মনসিংহ সদর', unions: ['Ganginarpar', 'Town Hall'] },
        ],
      },
    ],
  },
];

/**
 * Recognizes BD Mobile Operators based on prefix
 */
export function getMobileOperator(phone: string): { name: string; color: string; logoText: string } | null {
  const clean = phone.replace(/[^0-9]/g, '');
  const prefix = clean.startsWith('880') ? clean.slice(3, 6) : clean.slice(0, 3);

  if (['017', '013'].includes(prefix)) {
    return { name: 'Grameenphone', color: 'bg-sky-500 text-white', logoText: 'GP' };
  }
  if (['018', '016'].includes(prefix)) {
    return { name: 'Robi / Airtel', color: 'bg-rose-600 text-white', logoText: 'Robi' };
  }
  if (['019', '014'].includes(prefix)) {
    return { name: 'Banglalink', color: 'bg-orange-500 text-white', logoText: 'BL' };
  }
  if (['015'].includes(prefix)) {
    return { name: 'Teletalk', color: 'bg-emerald-600 text-white', logoText: 'TT' };
  }
  return null;
}

/**
 * Reverse Geocodes lat/lng in BD to Division, District, Upazila & Address
 */
export function reverseGeocodeBD(lat: number, lng: number): {
  division: string;
  district: string;
  upazila: string;
  union: string;
  fullAddress: string;
} {
  // Approximate BD geographic bounds
  // Dhaka region: ~23.7 - 23.9 N, 90.3 - 90.5 E
  if (lat >= 23.6 && lat <= 24.1 && lng >= 90.2 && lng <= 90.6) {
    return {
      division: 'Dhaka',
      district: 'Dhaka',
      upazila: 'Dhanmondi',
      union: 'Central Dhanmondi',
      fullAddress: 'Road #8/A, House #24, Dhanmondi Residential Area, Dhaka',
    };
  } else if (lat >= 22.2 && lat <= 22.6 && lng >= 91.7 && lng <= 92.1) {
    return {
      division: 'Chittagong',
      district: 'Chittagong',
      upazila: 'Agrabad',
      union: 'Commercial Area',
      fullAddress: 'Jahan Building #3, Agrabad Commercial Area, Chittagong',
    };
  } else if (lat >= 24.7 && lat <= 25.1 && lng >= 91.7 && lng <= 92.1) {
    return {
      division: 'Sylhet',
      district: 'Sylhet',
      upazila: 'Sylhet Sadar',
      union: 'Zindabazar',
      fullAddress: 'Al-Hamra Shopping City, Zindabazar, Sylhet',
    };
  }

  // Default fallback for BD coordinates
  return {
    division: 'Dhaka',
    district: 'Dhaka',
    upazila: 'Gulshan',
    union: 'Gulshan 2',
    fullAddress: 'Block NW(J), Avenue Road, Gulshan 2, Dhaka-1212',
  };
}
