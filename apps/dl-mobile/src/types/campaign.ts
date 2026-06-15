export enum CampaignStatus {
  UPCOMING = 'UPCOMING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  startDate: string;
  endDate: string;
  targetUnits: number;
  currentUnits: number;
  status: CampaignStatus;
  bloodTypesNeeded: string[];
  centerId?: string;
  centerName?: string;
  imageUrl?: string;
  distance?: number;
}
