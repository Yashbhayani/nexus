import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { EventCard } from "../common/EventCard";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Search, Grid3X3, List, Calendar, MapPin, Filter, Check, CheckCheck } from "lucide-react";
import { SkeletonEventCard } from "../common/SkeletonCard";

interface EventsScreenProps {
  onNavigate?: (screen: string, data?: any) => void;
}

export function EventsScreen({ onNavigate }: EventsScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [showGoingOnly, setShowGoingOnly] = useState(false);

  const categories = ["all", "Academic", "Sports", "Arts", "Greek Life", "Service", "Cultural"];
  const dateFilters = ["all", "today", "tomorrow", "this-week", "this-month"];
  const locations = ["all", "Library", "Recreation Center", "Student Union", "Campus Quad", "Engineering Building", "Convention Center", "Campus Amphitheater", "Wellness Center"];

  const [events, setEvents] = useState([
    {
      id: "evt1",
      title: "CS Study Group for Finals",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop",
      date: "Dec 18",
      time: "6:00 PM",
      location: "Library Room 204",
      category: "Academic",
      attendees: 23,
      price: "Free",
      isBookmarked: false,
      isRSVPd: false,
      organizer: "Computer Science Club",
      description: "Join us for a collaborative study session as we prepare for final exams. Bring your questions and let's tackle them together!",
      status: "approved"
    },
    {
      id: "evt2",
      title: "Intramural Basketball Tournament",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      date: "Jan 20",
      time: "3:00 PM",
      location: "Recreation Center Court A",
      category: "Sports",
      attendees: 156,
      price: "Free",
      isBookmarked: true,
      isRSVPd: true,
      organizer: "Campus Basketball League",
      description: "Annual basketball tournament open to all skill levels. Form your team or join as a free agent!",
      status: "approved"
    },
    {
      id: "evt3",
      title: "Winter Art Exhibition Opening",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      date: "Feb 5",
      time: "7:00 PM",
      location: "Student Union Gallery",
      category: "Arts",
      attendees: 89,
      price: "Free",
      isBookmarked: false,
      isRSVPd: false,
      organizer: "Art & Design Society",
      description: "Celebrate student creativity at our winter exhibition featuring paintings, sculptures, and digital art.",
      status: "approved"
    },
    {
      id: "evt4",
      title: "Greek Life Recruitment Fair",
      image: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=400&h=300&fit=crop",
      date: "Mar 12",
      time: "2:00 PM",
      location: "Campus Quad",
      category: "Greek Life",
      attendees: 245,
      price: "Free",
      isBookmarked: false,
      isRSVPd: false,
      organizer: "Alpha Beta Gamma",
      description: "Meet representatives from various fraternities and sororities. Learn about opportunities for leadership and service.",
      status: "approved"
    },
    {
      id: "evt5",
      title: "Community Garden Volunteer Day",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop",
      date: "Apr 15",
      time: "9:00 AM",
      location: "Campus Community Garden",
      category: "Service",
      attendees: 78,
      price: "Free",
      isBookmarked: true,
      isRSVPd: false,
      organizer: "Volunteer Corps",
      description: "Help maintain our campus community garden. We'll be planting, weeding, and harvesting fresh produce.",
      status: "approved"
    },
    {
      id: "evt6",
      title: "International Food Festival",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
      date: "Apr 22",
      time: "12:00 PM",
      location: "Student Union Plaza",
      category: "Cultural",
      attendees: 312,
      price: "$5",
      isBookmarked: false,
      isRSVPd: false,
      organizer: "International Student Association",
      description: "Taste authentic dishes from around the world prepared by international students and local restaurants."
    },
    {
      id: "evt7",
      title: "Career Fair 2024",
      image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=300&fit=crop",
      date: "May 3",
      time: "10:00 AM",
      location: "Convention Center",
      category: "Academic",
      attendees: 567,
      price: "Free",
      isBookmarked: false,
      isRSVPd: true,
      organizer: "Career Services",
      description: "Network with top employers and explore internship and job opportunities across various industries."
    },
    {
      id: "evt8",
      title: "Spring Concert Series",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      date: "May 10",
      time: "8:00 PM",
      location: "Campus Amphitheater",
      category: "Arts",
      attendees: 445,
      price: "$10",
      isBookmarked: true,
      isRSVPd: false,
      organizer: "Music Department",
      description: "Enjoy an evening of live performances by student bands and solo artists in our beautiful outdoor venue."
    },
    {
      id: "evt9",
      title: "Mental Health Awareness Workshop",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop",
      date: "May 15",
      time: "2:00 PM",
      location: "Wellness Center",
      category: "Service",
      attendees: 134,
      price: "Free",
      isBookmarked: false,
      isRSVPd: false,
      organizer: "Student Wellness Initiative",
      description: "Learn about mental health resources, stress management techniques, and peer support systems."
    },
    {
      id: "evt10",
      title: "Tech Innovation Showcase",
      image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=300&fit=crop",
      date: "May 20",
      time: "4:00 PM",
      location: "Engineering Building Atrium",
      category: "Academic",
      attendees: 289,
      price: "Free",
      isBookmarked: false,
      isRSVPd: false,
      organizer: "Computer Science Club",
      description: "See cutting-edge student projects in AI, robotics, and software development. Network with tech industry professionals."
    }
  ]);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Helper function to check if event matches date filter
  const matchesDateFilter = (event: any) => {
    if (selectedDate === "all") return true;
    
    const eventDate = event.date.toLowerCase();
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    switch (selectedDate) {
      case "today":
        return eventDate.includes("dec 18") || eventDate.includes("today");
      case "tomorrow":
        return eventDate.includes("dec 19") || eventDate.includes("tomorrow");
      case "this-week":
        return eventDate.includes("dec") && (
          eventDate.includes("18") || eventDate.includes("19") || eventDate.includes("20") || 
          eventDate.includes("21") || eventDate.includes("22") || eventDate.includes("23") || eventDate.includes("24")
        );
      case "this-month":
        return eventDate.includes("dec") || eventDate.includes("jan") || eventDate.includes("feb") || 
               eventDate.includes("mar") || eventDate.includes("apr") || eventDate.includes("may");
      default:
        return true;
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = 
      selectedCategory === "all" ? true :
      event.category === selectedCategory;
    const matchesDate = matchesDateFilter(event);
    const matchesLocation = selectedLocation === "all" || event.location.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesGoing = !showGoingOnly || event.isRSVPd;
    
    return matchesSearch && matchesCategory && matchesDate && matchesLocation && matchesGoing;
  });

  const handleBookmark = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, isBookmarked: !event.isBookmarked }
        : event
    ));
  };

  const handleRSVP = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, isRSVPd: !event.isRSVPd }
        : event
    ));
  };

  const handleOrganizerClick = (organizerName: string) => {
    // Navigate to organization profile
    // We'll use the existing profile system but pass the organization name
    if (onNavigate) {
      onNavigate('organizationProfile', { organizationName: organizerName });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Campus Events</h1>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events, organizers, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Categories</span>
              </div>
              {/* Going Filter Toggle */}
              <Button
                variant={showGoingOnly ? "default" : "outline"}
                size="sm"
                className={`h-8 gap-2 ${
                  showGoingOnly ? "bg-primary text-primary-foreground" : ""
                }`}
                onClick={() => setShowGoingOnly(!showGoingOnly)}
              >
                <CheckCheck className="w-4 h-4" aria-hidden="true" />
                <span>Going</span>
              </Button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "secondary"}
                  className={`cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    selectedCategory === category ? "bg-primary text-primary-foreground" : ""
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === "all" ? "All Events" : category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Date and Location Filter Dropdowns */}
          <div className="grid grid-cols-2 gap-3">
            {/* Date Filter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Date</span>
              </div>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Location</span>
              </div>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Library">Library</SelectItem>
                  <SelectItem value="Recreation Center">Recreation Center</SelectItem>
                  <SelectItem value="Student Union">Student Union</SelectItem>
                  <SelectItem value="Campus Quad">Campus Quad</SelectItem>
                  <SelectItem value="Engineering Building">Engineering Building</SelectItem>
                  <SelectItem value="Convention Center">Convention Center</SelectItem>
                  <SelectItem value="Campus Amphitheater">Campus Amphitheater</SelectItem>
                  <SelectItem value="Wellness Center">Wellness Center</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredEvents.length} events found
            </p>
            {(selectedCategory !== "all" || selectedDate !== "all" || selectedLocation !== "all" || showGoingOnly) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedDate("all");
                  setSelectedLocation("all");
                  setShowGoingOnly(false);
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonEventCard key={index} />
            ))}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onBookmark={handleBookmark}
                onRSVP={handleRSVP}
                onOrganizerClick={handleOrganizerClick}
                variant="grid"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onBookmark={handleBookmark}
                onRSVP={handleRSVP}
                onOrganizerClick={handleOrganizerClick}
                variant="list"
              />
            ))}
          </div>
        )}

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">No events found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}