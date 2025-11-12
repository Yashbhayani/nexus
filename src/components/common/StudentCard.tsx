import { GraduationCap, MapPin, UserPlus, BookOpen } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface StudentCardProps {
  student: {
    id: string;
    name: string;
    image: string;
    bio: string;
    year: string;
    major: string;
    interests: string[];
    location: string;
    isFollowing: boolean;
  };
  onFollow?: (studentId: string) => void;
  variant?: "grid" | "list";
}

export function StudentCard({ student, onFollow, variant = "grid" }: StudentCardProps) {
  if (variant === "list") {
    return (
      <Card className="mb-3 border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="flex gap-3 p-4">
            <div className="flex-shrink-0">
              <ImageWithFallback
                src={student.image}
                alt={student.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-medium truncate pr-2">{student.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {student.year}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{student.major}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {student.bio}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground truncate">{student.location}</span>
                </div>
                {onFollow && (
                  <Button 
                    size="sm" 
                    className="h-7 px-3" 
                    variant={student.isFollowing ? "outline" : "default"}
                    onClick={() => onFollow(student.id)}
                  >
                    {student.isFollowing ? "Following" : "Follow"}
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
          <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
          <div className="absolute -bottom-8 left-4">
            <ImageWithFallback
              src={student.image}
              alt={student.name}
              className="w-16 h-16 rounded-full object-cover border-4 border-background"
            />
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              {student.year}
            </Badge>
          </div>
          {student.isFollowing && (
            <div className="absolute top-3 left-3">
              <Badge variant="default" className="bg-primary/80 backdrop-blur-sm">
                Following
              </Badge>
            </div>
          )}
        </div>
        
        <div className="p-4 pt-10">
          <h3 className="font-medium mb-1">{student.name}</h3>
          
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{student.major}</span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {student.bio}
          </p>
          
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground truncate">{student.location}</span>
          </div>

          {student.interests.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {student.interests.slice(0, 3).map((interest, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
                {student.interests.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{student.interests.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          {onFollow && (
            <Button 
              className="w-full" 
              variant={student.isFollowing ? "outline" : "default"}
              onClick={() => onFollow(student.id)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {student.isFollowing ? "Following" : "Follow Student"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}