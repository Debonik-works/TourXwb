export interface Place {
  id: string;
  name: string;
  category: string;
  lat: number;
  lon: number;
  city?: string;
  description?: string;
  images?: string[];
  google_map_link?: string;
}

export interface Hotel {
  id: string;
  name: string;
  lat: number;
  lon: number;
  rating?: number;
}

export interface Artisan {
  artisan_id: string;
  full_name: string;
  email: string;
  phone: string;
  products: any[];
  created_at: string;
  updated_at: string;
}

export const heroImages = [
  "https://images.unsplash.com/photo-1558431382-27e303142255?w=600&q=80",
  "https://images.unsplash.com/photo-1555400082-4b3b94d6d721?w=600&q=80",
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80",
];

export const culturalAspects = [
  {
    icon: "music",
    title: "Classical Music",
    description: "Rich tradition of Rabindra Sangeet and classical ragas",
    color: "#6366f1",
  },
  {
    icon: "palette",
    title: "Traditional Arts",
    description: "Exquisite handicrafts, terracotta work, and paintings",
    color: "#10b981",
  },
  {
    icon: "film",
    title: "Bengali Theater",
    description: "Vibrant theater scene and cultural performances",
    color: "#ef4444",
  },
  {
    icon: "camera",
    title: "Film Heritage",
    description: "Birthplace of legendary filmmakers and cinema",
    color: "#f59e0b",
  },
];

export const stats = [
    { icon: "map-pin", label: "Heritage Sites", value: "50+" },
    { icon: "camera", label: "Photo Spots", value: "200+" },
    { icon: "heart", label: "Cultural Events", value: "100+" },
    { icon: "users", label: "Happy Visitors", value: "10K+" },
];
