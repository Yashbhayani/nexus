import { Calendar, MapPin, Users, Heart } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    image: string;
    date: string;
    time: string;
    location: string;
    category: string;
    attendees: number;
    price: string;
    isBookmarked: boolean;
  };
  onBookmark?: (eventId: string) => void;
  onRSVP?: (eventId: string) => void;
  variant?: "grid" | "list" | "feed";
}

export function EventCard({ event, onBookmark, onRSVP, variant = "grid" }: EventCardProps) {
  if (variant === "feed") {
    return (
      <Card className="mb-3 border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="flex gap-3 p-4">
            <div className="flex-shrink-0">
              <ImageWithFallback
                src={event.image}
                alt={event.title}
                className="w-20 h-20 rounded-lg object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-medium truncate pr-2">{event.title}</h3>
                <Badge variant="outline" className="text-xs">
                  {event.category}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{event.date} • {event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground truncate">{event.location}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "list") {
    return (
      <Card className="mb-3 border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="flex gap-3 p-4">
            <div className="flex-shrink-0">
              <ImageWithFallback
                src={event.image}
                alt={event.title}
                className="w-20 h-20 rounded-lg object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-medium truncate pr-2">{event.title}</h3>
                {onBookmark && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 flex-shrink-0"
                    onClick={() => onBookmark(event.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        event.isBookmarked ? "fill-red-500 text-red-500" : "text-muted-foreground"
                      }`}
                    />
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{event.date} • {event.time}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground truncate">{event.location}</span>
              </div>
              {onRSVP && (
                <div className="flex justify-end">
                  <Button size="sm" className="h-7 px-3" onClick={() => onRSVP(event.id)}>
                    RSVP
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-0 shadow-sm">
      <CardContent className="p-0">
        <div className="relative">
          <ImageWithFallback
            src={event.image}
            alt={event.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              {event.category}
            </Badge>
          </div>
          {onBookmark && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-3 right-3 h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90"
              onClick={() => onBookmark(event.id)}
            >
              <Heart
                className={`h-4 w-4 ${
                  event.isBookmarked ? "fill-red-500 text-red-500" : "text-foreground"
                }`}
              />
            </Button>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-medium mb-2 line-clamp-2">{event.title}</h3>
          
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{event.date}</span>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground truncate">{event.location}</span>
          </div>
          
          {onRSVP && (
            <Button className="w-full mt-3" onClick={() => onRSVP(event.id)}>
              RSVP
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}