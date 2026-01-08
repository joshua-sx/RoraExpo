export interface Driver {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  onDuty: boolean;
  vehicleType: string;
  vehicleModel: string;
  licensePlate: string;
  profileImage?: string;
  phone: string;
  email: string;
  bio: string;
  yearsExperience: number;
  languages: string[];
  // Extended fields from database
  isRoraPro?: boolean;
  serviceAreaTags?: string[]; // Geographic area tags
  specializations?: string[]; // Service type tags: 'vip', 'airport', 'cruise_port'
  seats?: number;
}

