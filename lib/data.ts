//lib/data.ts
export interface Concert {
  id: string;
  title: string;
  artist: string;
  venue: string;
  date: string;
  time: string;
  price: number;
  image: string;
  remainingTickets: number;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export const concerts: Concert[] = [
  {
    id: "1",
    title: "Summer Tour",
    artist: "The Weeknd",
    venue: "Madison Square Garden, NYC",
    date: "Jul 15, 2026",
    time: "8:00 PM",
    price: 89,
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop",
    remainingTickets: 234,
    category: "Pop"
  },
  {
    id: "2",
    title: "Rock Effect",
    artist: "Foo Fighters",
    venue: "Wembley Stadium, London",
    date: "Aug 22, 2026",
    time: "7:30 PM",
    price: 125,
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop",
    remainingTickets: 89,
    category: "Rock"
  },
  {
    id: "3",
    title: "K-Pop Come True",
    artist: "BTS",
    venue: "Seoul Olympic Stadium",
    date: "Sep 5, 2026",
    time: "6:00 PM",
    price: 199,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    remainingTickets: 12,
    category: "K-Pop"
  },
  {
    id: "4",
    title: "EDM Land",
    artist: "Various Artists",
    venue: "Coachella Valley, CA",
    date: "Oct 12, 2026",
    time: "4:00 PM",
    price: 350,
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
    remainingTickets: 567,
    category: "EDM"
  },
  {
    id: "5",
    title: "Hip-Hop Legends",
    artist: "Kendrick Lamar",
    venue: "Staples Center, LA",
    date: "Nov 8, 2026",
    time: "9:00 PM",
    price: 145,
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=600&fit=crop",
    remainingTickets: 178,
    category: "Hip-Hop"
  },
  {
    id: "6",
    title: "Symphony Night",
    artist: "London Philharmonic",
    venue: "Royal Albert Hall, London",
    date: "Dec 20, 2026",
    time: "7:00 PM",
    price: 75,
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop",
    remainingTickets: 320,
    category: "Classical"
  }
];

export const categories: Category[] = [
  { id: "rock", name: "Rock", icon: "Guitar", count: 156 },
  { id: "pop", name: "Pop", icon: "Music", count: 243 },
  { id: "kpop", name: "K-Pop", icon: "Sparkles", count: 89 },
  { id: "edm", name: "EDM", icon: "Zap", count: 127 },
  { id: "hiphop", name: "Hip-Hop", icon: "Mic", count: 198 },
  { id: "classical", name: "Classical", icon: "Music2", count: 64 }
];
