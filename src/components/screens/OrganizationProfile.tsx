import { useState, useContext } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";
import {
  ArrowLeft,
  MapPin,
  Users,
  Calendar,
  Mail,
  Globe,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Heart,
  MessageSquare,
  Share2,
  MoreHorizontal,
  UserPlus,
  UserCheck,
  Target,
  Link as LinkIcon,
} from "lucide-react";
import * as apiroute from "../../Context/API/ApiRouter";
import APIContext from "../../Context/apimethods/APIContext";

interface OrganizationProfileProps {
  organizationId: string;
  onBack: () => void;
  onNavigate?: (screen: string, data?: any) => void;
}

export function OrganizationProfile({
  organizationId,
  onBack,
  onNavigate,
}: OrganizationProfileProps) {

  const context = useContext(APIContext);
  const { GETFunction, DELETEFunction, PATCHFunctionParams } = context;

  
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("about");
  const [isJoined, setIsJoined] = useState(false);

  // Mock organization data - in production this would be fetched based on organizationId
  const organization = {
    id: organizationId,
    name: "Computer Science Club",
    image:
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=400&fit=crop",
    avatar:
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=300&h=300&fit=crop",
    description:
      "Join fellow CS students for coding challenges, tech talks, and networking events.",
    category: "Academic",
    members: 156,
    // location: "Engineering Building, Room 301",
    email: "cs.club@university.edu",
    phone: "(555) 123-4567",
    website: "https://csclub.university.edu",
    founded: "2015",
    mission:
      "To provide students with opportunities to learn, grow, and connect with like-minded individuals who share a passion for technology and computer science.",
    about:
      "The Computer Science Club is a student-led organization dedicated to fostering a community of passionate programmers, developers, and tech enthusiasts. We organize weekly coding sessions, host guest speakers from leading tech companies, and participate in hackathons throughout the year. Whether you're a beginner or an experienced coder, everyone is welcome!",
    contactInfo: {
      president: "Sarah Johnson",
      vicePresident: "Michael Chen",
    },
    // socialMedia: {
    //   discord: "cs_club",
    //   instagram: "@csclub",
    //   linkedin: "csclub-university",
    // },
  };

  // Mock events data
  const events = [
    {
      id: "evt1",
      title: "Weekly Coding Challenge",
      date: "Dec 15, 2024",
      time: "6:00 PM",
      location: "Engineering Building",
      image:
        "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=300&fit=crop",
      attendees: 45,
      status: "upcoming",
    },
    {
      id: "evt2",
      title: "Tech Talk: AI in Healthcare",
      date: "Dec 20, 2024",
      time: "7:00 PM",
      location: "Virtual",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop",
      attendees: 78,
      status: "upcoming",
    },
    {
      id: "evt3",
      title: "Winter Hackathon 2024",
      date: "Jan 10-12, 2025",
      time: "All Day",
      location: "Student Center",
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
      attendees: 120,
      status: "upcoming",
    },
  ];

  // Mock posts data
  const posts = [
    {
      id: "post1",
      author: {
        name: "Computer Science Club",
        avatar: organization.avatar,
      },
      content:
        "Excited to announce our upcoming hackathon! Register now to secure your spot. Prizes worth $5000!",
      timestamp: "2 hours ago",
      likes: 42,
      comments: 8,
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop",
    },
    {
      id: "post2",
      author: {
        name: "Computer Science Club",
        avatar: organization.avatar,
      },
      content:
        "Thanks to everyone who joined our coding challenge last night! The winner will be announced soon.",
      timestamp: "1 day ago",
      likes: 67,
      comments: 15,
    },
    {
      id: "post3",
      author: {
        name: "Computer Science Club",
        avatar: organization.avatar,
      },
      content:
        "New member orientation this Friday at 5 PM. Come learn about what we do and meet the team!",
      timestamp: "3 days ago",
      likes: 89,
      comments: 22,
    },
  ];

  // Mock members data
  const members = [
    {
      id: "mem1",
      name: "Sarah Johnson",
      role: "President",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b286?w=300&h=300&fit=crop",
      major: "Computer Science",
      year: "Senior",
    },
    {
      id: "mem2",
      name: "Michael Chen",
      role: "Vice President",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
      major: "Software Engineering",
      year: "Junior",
    },
    {
      id: "mem3",
      name: "Emily Rodriguez",
      role: "Treasurer",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
      major: "Computer Science",
      year: "Junior",
    },
    {
      id: "mem4",
      name: "David Kim",
      role: "Secretary",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
      major: "Data Science",
      year: "Sophomore",
    },
    {
      id: "mem5",
      name: "Jessica Lee",
      role: "Events Coordinator",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop",
      major: "Computer Engineering",
      year: "Junior",
    },
    {
      id: "mem6",
      name: "Alex Martinez",
      role: "Member",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
      major: "Computer Science",
      year: "Freshman",
    },
  ];

  const handleJoin = () => {
    setIsJoined(!isJoined);
  };

  const handleEventClick = (eventId: string) => {
    onNavigate?.("eventDetail", { eventId });
  };

  const handleMemberClick = (memberId: string) => {
    onNavigate?.("otherUserProfile", { userId: memberId });
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header with back button */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <h1 className="text-lg truncate">{organization.name}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Cover Image */}
        <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden bg-muted">
          <img
            src={organization.image}
            alt={organization.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Organization Header */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
          <div className="flex-shrink-0 -mt-16 sm:-mt-20">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-background shadow-xl">
              <AvatarImage src={organization.avatar} alt={organization.name} />
              <AvatarFallback>
                {organization.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 space-y-3 w-full sm:w-auto">
            <div>
              <h2 className="text-2xl sm:text-3xl">{organization.name}</h2>
              <p className="text-muted-foreground">{organization.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1">
                {organization.category}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{organization.members} members</span>
              </div>
              {/* <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{organization.location}</span>
              </div> */}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleJoin}
                className="gap-2"
                variant={isJoined ? "outline" : "default"}
              >
                {isJoined ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    Joined
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Join Organization
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            {/* <TabsTrigger value="members">Members</TabsTrigger> */}
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6 mt-6">
            {/* Description & Mission */}
            <Card>
              <CardHeader>
                <CardTitle>About Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{organization.about}</p>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Our Mission
                  </h3>
                  <p className="text-muted-foreground">{organization.mission}</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div className="font-medium truncate">{organization.email}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <div className="font-medium">{organization.phone}</div>
                    </div>
                  </div>
                  {/* <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-sm text-muted-foreground">Location</div>
                      <div className="font-medium">{organization.location}</div>
                    </div>
                  </div> */}
                  <div className="flex items-start gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-sm text-muted-foreground">Website</div>
                      <a
                        href={organization.website}
                        className="font-medium text-primary hover:underline truncate block"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3">Leadership</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="text-sm text-muted-foreground">President</div>
                      <div className="font-medium">{organization.contactInfo.president}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Vice President</div>
                      <div className="font-medium">{organization.contactInfo.vicePresident}</div>
                    </div>
                  </div>
                </div>
                {/* <Separator />
                <div>
                  <h3 className="font-semibold mb-3">Social Media</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <LinkIcon className="h-3 w-3" />
                      Discord: {organization.socialMedia.discord}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <LinkIcon className="h-3 w-3" />
                      Instagram: {organization.socialMedia.instagram}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <LinkIcon className="h-3 w-3" />
                      LinkedIn: {organization.socialMedia.linkedin}
                    </Badge>
                  </div>
                </div> */}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-4 mt-6">
            {events.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No upcoming events</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {events.map((event) => (
                  <Card
                    key={event.id}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="w-full h-48 bg-muted flex-shrink-0">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="flex-1 p-4 pt-0 space-y-2">
                        <div>
                          <h4 className="text-lg">{event.title}</h4>
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{event.attendees} attending</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">{event.status}</Badge>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-4 mt-6">
            {posts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No posts yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="p-4 space-y-3">
                      {/* Post Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={post.author.avatar}
                              alt={post.author.name}
                            />
                            <AvatarFallback>
                              {post.author.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{post.author.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {post.timestamp}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      <p>{post.content}</p>

                      {/* Post Image */}
                      {post.image && (
                        <div className="rounded-lg overflow-hidden">
                          <img
                            src={post.image}
                            alt="Post content"
                            className="w-full h-auto"
                          />
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="flex items-center gap-4 pt-2">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Members Tab */}
          {/* <TabsContent value="members" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl">
                    Members ({organization.members})
                  </h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleMemberClick(member.id)}
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{member.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.role}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.major} • {member.year}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
}