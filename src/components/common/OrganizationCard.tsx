import { MapPin, Users, UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface OrganizationCardProps {
  organization: {
    id: string;
    name: string;
    image: string;
    description: string;
    category: string;
    members: number;
    location: string;
    isJoined: boolean;
  };
  onJoin?: (orgId: string) => void;
  variant?: "grid" | "list";
}

export function OrganizationCard({ organization, onJoin, variant = "grid" }: OrganizationCardProps) {
  if (variant === "list") {
    return (
      <Card className="mb-3 border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="flex gap-3 p-4">
            <div className="flex-shrink-0">
              <ImageWithFallback
                src={organization.image}
                alt={organization.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-medium truncate pr-2">{organization.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {organization.category}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {organization.description}
              </p>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground truncate">{organization.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{organization.members} members</span>
                </div>
                {onJoin && (
                  <Button 
                    size="sm" 
                    className="h-7 px-3" 
                    variant={organization.isJoined ? "outline" : "default"}
                    onClick={() => onJoin(organization.id)}
                  >
                    {organization.isJoined ? "Joined" : "Join"}
                  </Button>
                )}
              </div>
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
            src={organization.image}
            alt={organization.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              {organization.category}
            </Badge>
          </div>
          {organization.isJoined && (
            <div className="absolute top-3 right-3">
              <Badge variant="default" className="bg-primary/80 backdrop-blur-sm">
                Joined
              </Badge>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-medium mb-2 line-clamp-2">{organization.name}</h3>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {organization.description}
          </p>
          
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground truncate">{organization.location}</span>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{organization.members} members</span>
            </div>
          </div>
          
          {onJoin && (
            <Button 
              className="w-full" 
              variant={organization.isJoined ? "outline" : "default"}
              onClick={() => onJoin(organization.id)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {organization.isJoined ? "Joined" : "Join Organization"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}