export interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
  isSelected: boolean;
}

export interface DateItem {
  id: string;
  date: Date;
  formattedDate: string;
  dayName: string;
  isToday: boolean;
  isSelected: boolean;
}

export interface SelectedDateTime {
  date: Date;
  timeSlot: TimeSlot;
}

export interface StoreHours {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  openTime: string; // HH:MM format
  closeTime: string; // HH:MM format
  isOpen: boolean;
}

export interface StoreOverride {
  date: string; // YYYY-MM-DD format
  openTime?: string; // HH:MM format
  closeTime?: string; // HH:MM format
  isOpen: boolean;
  reason?: string; // e.g., "Holiday", "Special Event"
}

export interface StoreInfo {
  id: string;
  name: string;
  timezone: string;
  storeHours: StoreHours[];
  storeOverrides: StoreOverride[];
}

export interface User {
  id: string;
  email: string;
  name?: string;
  timezone?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
} 