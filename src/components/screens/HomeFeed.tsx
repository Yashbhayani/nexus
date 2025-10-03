import { useState } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PostCard } from "../common/PostCard";
import { EventCard } from "../common/EventCard";
import { Search, Bell, Star } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface HomeFeedProps {
  onNavigate?: (screen: string, data?: any) => void;
}

export function HomeFeed({ onNavigate }: HomeFeedProps) {
  const [posts, setPosts] = useState([
    {
      id: "1",
      user: {
        name: "Student Government",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        username: "studentgov"
      },
      content: "📢 IMPORTANT: New library hours starting Monday! Extended study hours during finals week. Open 24/7 from Dec 10-22. Good luck with exams everyone! 📚✨",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop",
      timestamp: "2h",
      likes: 156,
      comments: 23,
      isLiked: false
    },
    {
      id: "2",
      user: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        username: "sarahc_22"
      },
      content: "Just finished my first coding interview! 💻 Feeling nervous but excited. Thanks to everyone who helped me practice. CS students - the career center's mock interviews are amazing! #coding #internship",
      timestamp: "3h",
      likes: 89,
      comments: 31,
      isLiked: true
    },
    {
      id: "3", 
      user: {
        name: "Engineering Society",
        avatar: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=150&h=150&fit=crop&crop=face",
        username: "engsociety"
      },
      content: "🔧 Tech Talk Series continues this Friday! Join us for 'AI in Sustainable Engineering' with guest speaker Dr. Martinez from Tesla. Free pizza included! 🍕",
      timestamp: "4h",
      likes: 142,
      comments: 28,
      isLiked: false
    },
    {
      id: "4",
      user: {
        name: "Marcus Johnson", 
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        username: "marcus_j"
      },
      content: "Shoutout to the amazing turnout at yesterday's climate action rally! 🌍 Over 800 students showed up. Change starts with us! Next meeting: Tuesday 7pm at Student Union Room 205 #climateaction",
      image: "https://images.unsplash.com/photo-1573166364524-d9d8d464b0fe?w=600&h=400&fit=crop",
      timestamp: "6h",
      likes: 234,
      comments: 45,
      isLiked: true
    },
    {
      id: "5",
      user: {
        name: "Campus Recreation",
        avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face", 
        username: "campusrec"
      },
      content: "🏃‍♀️ Intramural Basketball registration is OPEN! Teams of 5, season starts Jan 15th. $50 per team. Register at the Rec Center or online! 🏀",
      timestamp: "8h",
      likes: 67,
      comments: 18,
      isLiked: false
    }
  ]);

  const [bigEvents] = useState([
    {
      id: "big-1",
      title: "Spring Career Fair 2024",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
      date: "Mar 15-16",
      time: "2 Days",
      location: "Student Union",
      category: "Career",
      attendees: 2500,
      price: "Free",
      isBookmarked: false,
      status: "upcoming"
    },
    {
      id: "big-2",
      title: "Homecoming Weekend",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      date: "Oct 12-14",
      time: "3 Days",
      location: "Campus-wide",
      category: "Campus",
      attendees: 8000,
      price: "Varies",
      isBookmarked: true,
      status: "happening"
    },
    {
      id: "big-3",
      title: "Graduation Ceremony",
      image: "https://images.unsplash.com/photo-1627556704203-3a0712d18d37?w=400&h=300&fit=crop",
      date: "May 18",
      time: "10:00 AM",
      location: "Football Stadium",
      category: "Academic",
      attendees: 15000,
      price: "Free",
      isBookmarked: false,
      status: "upcoming"
    }
  ]);

  const [recommendedEvents] = useState([
    {
      id: "1",
      title: "Study Abroad Info Session",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop",
      date: "Dec 20",
      time: "3:00 PM",
      location: "International Center",
      category: "Academic",
      attendees: 45,
      price: "Free",
      isBookmarked: false
    },
    {
      id: "2",
      title: "Mental Health Workshop",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
      date: "Dec 22",
      time: "1:00 PM",
      location: "Wellness Center",
      category: "Wellness",
      attendees: 67,
      price: "Free",
      isBookmarked: true
    }
  ]);



  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleComment = (postId: string) => {
    console.log("Comment on post:", postId);
  };

  const handleShare = (postId: string) => {
    console.log("Share post:", postId);
  };



  const handleBigEventClick = (eventId: string) => {
    onNavigate?.("event-detail", { eventId });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">Campus Feed</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto">
        {/* Big Events Section */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Major Campus Events</h2>
            </div>
            <Button variant="ghost" size="sm">
              See all
            </Button>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2">
            {bigEvents.map((event) => (
              <div 
                key={event.id} 
                className="flex-shrink-0 w-48 cursor-pointer"
                onClick={() => handleBigEventClick(event.id)}
              >
                <div className="relative rounded-lg overflow-hidden mb-2">
                  <ImageWithFallback
                    src={event.image}
                    alt={event.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.status === 'happening' 
                        ? 'bg-green-500 text-white' 
                        : event.status === 'upcoming'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}>
                      {event.status === 'happening' ? 'Live' : 
                       event.status === 'upcoming' ? 'Soon' : 'Past'}
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <div className="bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                      {event.attendees.toLocaleString()}
                    </div>
                  </div>
                </div>
                <h3 className="font-medium text-sm line-clamp-2 mb-1">{event.title}</h3>
                <p className="text-xs text-muted-foreground">{event.date} • {event.location}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Campus Feed */}
        <div className="p-4 space-y-6">
          {/* Recent Posts */}
          {posts.slice(0, 2).map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
            />
          ))}

          {/* Recommended Events Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Upcoming for you</h2>
              <Button variant="ghost" size="sm">
                See all
              </Button>
            </div>

            <div className="space-y-3">
              {recommendedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  variant="feed"
                />
              ))}
            </div>
          </div>

          {/* More Posts */}
          {posts.slice(2).map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
            />
          ))}
        </div>
      </div>
    </div>
  );
}