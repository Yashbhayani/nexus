import { useState } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Heart, 
  Share, 
  MessageCircle,
  ExternalLink 
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface EventDetailProps {
  eventId: string;
  onBack: () => void;
}

export function EventDetail({ eventId, onBack }: EventDetailProps) {
  const [isRSVPed, setIsRSVPed] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Mock event data
  const event = {
    id: eventId,
    title: "Summer Jazz Festival",
    image: "https://images.unsplash.com/photo-1743791022256-40413c5f019b?w=800&h=400&fit=crop",
    date: "Saturday, June 15",
    time: "7:00 PM - 11:00 PM",
    location: "Central Park Bandshell, New York",
    category: "Music",
    price: "$25",
    description: "Join us for an unforgettable evening of smooth jazz under the stars. Featuring renowned local and international artists, this festival celebrates the rich tradition of jazz music. Bring your friends and family for a magical night of music, food, and community.",
    organizer: {
      name: "NYC Music Events",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      verified: true
    },
    attendees: [
      { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=150&h=150&fit=crop&crop=face" },
      { name: "Alex Rivera", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
      { name: "Maya Patel", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" },
      { name: "Jordan Kim", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
    ],
    totalAttendees: 156,
    features: ["Live Music", "Food Vendors", "Family Friendly", "Outdoor Venue"]
  };

  const handleRSVP = () => {
    setIsRSVPed(!isRSVPed);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    console.log("Share event");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">Event Details</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleBookmark}>
              <Heart className={`h-5 w-5 ${isBookmarked ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Event Image */}
        <div className="relative">
          <ImageWithFallback
            src={event.image}
            alt={event.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              {event.category}
            </Badge>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Title and Basic Info */}
          <div>
            <h1 className="text-2xl font-semibold mb-3">{event.title}</h1>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{event.date}</p>
                  <p className="text-sm text-muted-foreground">{event.time}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">{event.location}</p>
                  <Button variant="link" size="sm" className="h-auto p-0 text-primary">
                    View on map <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <p className="font-medium">{event.totalAttendees} people going</p>
              </div>
            </div>
          </div>

          {/* Price and RSVP */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-2xl font-semibold text-primary">{event.price}</p>
                </div>
                <Button 
                  size="lg" 
                  className={`px-8 ${isRSVPed ? "bg-green-500 hover:bg-green-600" : ""}`}
                  onClick={handleRSVP}
                >
                  {isRSVPed ? "Going ✓" : "RSVP"}
                </Button>
              </div>
              {isRSVPed && (
                <p className="text-sm text-green-600 bg-green-50 dark:bg-green-950 p-2 rounded-md">
                  You're going to this event! We'll send you reminders.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-3">About this event</h3>
            <p className="text-muted-foreground leading-relaxed">{event.description}</p>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-3">What to expect</h3>
            <div className="flex flex-wrap gap-2">
              {event.features.map((feature) => (
                <Badge key={feature} variant="outline">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          {/* Organizer */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Organized by</h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={event.organizer.avatar} alt={event.organizer.name} />
                  <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{event.organizer.name}</p>
                    {event.organizer.verified && (
                      <Badge variant="secondary" className="text-xs">Verified</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Event organizer</p>
                </div>
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Attendees */}
          <div>
            <h3 className="font-semibold mb-3">Who's going</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex -space-x-2">
                {event.attendees.map((attendee, index) => (
                  <Avatar key={index} className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={attendee.avatar} alt={attendee.name} />
                    <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
                <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                  <span className="text-xs font-medium">+{event.totalAttendees - event.attendees.length}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {event.attendees.slice(0, 2).map(a => a.name).join(", ")} and {event.totalAttendees - 2} others are going
            </p>
            <Button variant="outline" size="sm" className="mt-2">
              See all attendees
            </Button>
          </div>

          {/* Map Preview Placeholder */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Location</h3>
              <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Map preview</p>
              </div>
              <Button variant="outline" className="w-full mt-3">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in Maps
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}