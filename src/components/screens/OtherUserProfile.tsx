import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import { Separator } from "../ui/separator";
import {
  SkeletonProfileHeader,
  SkeletonPostCard,
} from "../common/SkeletonCard";
import {
  MapPin,
  Calendar,
  Mail,
  Award,
  GraduationCap,
  Building2,
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  Users,
  UserPlus,
  Check,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface OtherUserProfileProps {
  userId: string;
  onNavigate?: (screen: string, data?: any) => void;
  onBack?: () => void;
}

export function OtherUserProfile({
  userId,
  onNavigate,
  onBack,
}: OtherUserProfileProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(234);

  // Mock user data - in real app, this would be fetched based on userId
  const otherUserProfile = {
    id: userId,
    name: "Sarah Chen",
    email: "sarah.chen@university.edu",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
    bio: "Software Engineering major with a passion for mobile development and UX design. Love building apps that make a difference!",
    academicLevel: "Senior",
    major: "Software Engineering",
    minor: "Design",
    graduationYear: "2025",
    location: "Student Center, 2nd Floor",
    joinedDate: "Fall 2021",
    stats: {
      enrolledOrgs: 7,
      eventsAttended: 42,
      followers: 234,
    },
    skills: [
      "Swift",
      "Kotlin",
      "Figma",
      "React Native",
      "Product Design",
    ],
    interests: [
      "Mobile Development",
      "UX Design",
      "Entrepreneurship",
      "Photography",
    ],
    enrolledOrganizations: [
      {
        id: "1",
        name: "Computer Science Society",
        role: "President",
        logo: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=100&h=100&fit=crop",
        category: "Academic",
      },
      {
        id: "2",
        name: "Design Collective",
        role: "Co-founder",
        logo: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&h=100&fit=crop",
        category: "Creative",
      },
      {
        id: "3",
        name: "Women in Tech",
        role: "Mentor",
        logo: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=100&h=100&fit=crop",
        category: "Professional",
      },
      {
        id: "4",
        name: "Startup Incubator",
        role: "Member",
        logo: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=100&h=100&fit=crop",
        category: "Entrepreneurship",
      },
    ],
  };

  // Mock posts from this user
  const userPosts = [
    {
      id: "1",
      organization: "Computer Science Society",
      orgLogo:
        "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=100&h=100&fit=crop",
      author: "Sarah Chen",
      authorAvatar: otherUserProfile.avatar,
      timestamp: "2 hours ago",
      content:
        "Excited to announce our upcoming hackathon! 🚀 Join us for 24 hours of coding, learning, and building amazing projects. Registration opens next week!",
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop",
      likes: 124,
      comments: 18,
      category: "Event",
    },
    {
      id: "2",
      organization: "Design Collective",
      orgLogo:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&h=100&fit=crop",
      author: "Sarah Chen",
      authorAvatar: otherUserProfile.avatar,
      timestamp: "1 day ago",
      content:
        "New workshop alert! Learn the fundamentals of user research and how to conduct effective usability testing. Perfect for beginners!",
      likes: 89,
      comments: 12,
      category: "Workshop",
    },
    {
      id: "3",
      organization: "Women in Tech",
      orgLogo:
        "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=100&h=100&fit=crop",
      author: "Sarah Chen",
      authorAvatar: otherUserProfile.avatar,
      timestamp: "3 days ago",
      content:
        "Thank you to everyone who attended our mentorship kickoff! Looking forward to an amazing semester of learning and growth together 💜",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
      likes: 156,
      comments: 24,
      category: "Update",
    },
  ];

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [userId]);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    // Update follower count
    if (!isFollowing) {
      setFollowerCount(followerCount + 1);
    } else {
      setFollowerCount(Math.max(0, followerCount - 1));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          <SkeletonProfileHeader />
          <div className="space-y-4">
            <SkeletonPostCard />
            <SkeletonPostCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="flex items-center gap-4 p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-full"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-semibold">
                {otherUserProfile.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {otherUserProfile.major}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-32 w-32 ring-4 ring-primary/10">
                  <AvatarImage
                    src={otherUserProfile.avatar}
                    alt={otherUserProfile.name}
                  />
                  <AvatarFallback className="text-3xl">
                    {otherUserProfile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                  <h2 className="text-2xl">
                    {otherUserProfile.name}
                  </h2>
                  <p className="text-muted-foreground">
                    {otherUserProfile.academicLevel} •{" "}
                    {otherUserProfile.major}
                  </p>
                  {otherUserProfile.minor && (
                    <p className="text-sm text-muted-foreground">
                      Minor: {otherUserProfile.minor}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex gap-8 pt-2">
                  <div className="text-center">
                    <div className="text-2xl text-primary">
                      {otherUserProfile.stats.enrolledOrgs}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Organizations
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl text-primary">
                      {otherUserProfile.stats.eventsAttended}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Events Attended
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl text-primary">
                      {followerCount}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Followers
                    </div>
                  </div>
                </div>

                {/* Follow Button */}
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  size="default"
                  onClick={handleFollowToggle}
                  className="w-full max-w-xs"
                >
                  {isFollowing ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Follow
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="organizations">
                Organizations
              </TabsTrigger>
            </TabsList>

            {/* About Tab */}
            <TabsContent
              value="about"
              className="space-y-4 mt-4"
            >
              {/* Stats */}
              {/* <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center gap-8">
                    <div className="text-center">
                      <div className="text-2xl font-semibold">{otherUserProfile.stats.enrolledOrgs}</div>
                      <div className="text-sm text-muted-foreground">Organizations</div>
                    </div>
                    <Separator orientation="vertical" className="h-12" />
                    <div className="text-center">
                      <div className="text-2xl font-semibold">{otherUserProfile.stats.eventsAttended}</div>
                      <div className="text-sm text-muted-foreground">Events Attended</div>
                    </div>
                    <Separator orientation="vertical" className="h-12" />
                    <div className="text-center">
                      <div className="text-2xl font-semibold">{otherUserProfile.stats.followers}</div>
                      <div className="text-sm text-muted-foreground">Followers</div>
                    </div>
                  </div>
                </CardContent>
              </Card> */}

              {/* Bio */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {otherUserProfile.bio}
                  </p>
                </CardContent>
              </Card>

              {/* Academic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Academic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-foreground">
                        {otherUserProfile.academicLevel}
                      </div>
                      <div className="text-xs">
                        Academic Level
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-foreground">
                        {otherUserProfile.major}
                      </div>
                      <div className="text-xs">Major</div>
                    </div>
                  </div>
                  {otherUserProfile.minor && (
                    <>
                      <Separator />
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Award className="h-5 w-5 text-primary" />
                        <div>
                          <div className="text-sm text-foreground">
                            {otherUserProfile.minor}
                          </div>
                          <div className="text-xs">Minor</div>
                        </div>
                      </div>
                    </>
                  )}
                  <Separator />
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-foreground">
                        {otherUserProfile.graduationYear}
                      </div>
                      <div className="text-xs">
                        Expected Graduation
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              {otherUserProfile.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {otherUserProfile.skills.map(
                        (skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                          >
                            {skill}
                          </Badge>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Interests */}
              {otherUserProfile.interests.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Interests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {otherUserProfile.interests.map(
                        (interest, index) => (
                          <Badge key={index} variant="outline">
                            {interest}
                          </Badge>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Posts Tab */}
            <TabsContent
              value="posts"
              className="space-y-4 mt-4"
            >
              {userPosts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">
                      No posts yet
                    </p>
                  </CardContent>
                </Card>
              ) : (
                userPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden"
                  >
                    <CardContent className="p-4 space-y-3">
                      {/* Post Header */}
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={post.orgLogo}
                            alt={post.organization}
                          />
                          <AvatarFallback>
                            {post.organization[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">
                              {post.organization}
                            </p>
                            <Badge
                              variant="secondary"
                              className="text-xs"
                            >
                              {post.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <span>{post.author}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{post.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      <p className="text-sm">{post.content}</p>

                      {/* Post Image */}
                      {post.image && (
                        <div className="rounded-lg overflow-hidden">
                          <ImageWithFallback
                            src={post.image}
                            alt="Post image"
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="flex items-center gap-6 pt-2">
                        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                          <Heart className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </button>
                        {/* <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors ml-auto">
                          <Share2 className="h-4 w-4" />
                        </button> */}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Organizations Tab */}
            <TabsContent
              value="organizations"
              className="space-y-4 mt-4"
            >
              {otherUserProfile.enrolledOrganizations.length ===
              0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Not enrolled in any organizations
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {otherUserProfile.enrolledOrganizations.map(
                    (org) => (
                      <Card
                        key={org.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() =>
                          onNavigate?.("organizationProfile", {
                            orgName: org.name,
                          })
                        }
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage
                                src={org.logo}
                                alt={org.name}
                              />
                              <AvatarFallback>
                                {org.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold truncate">
                                {org.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {org.category}
                                </Badge>
                                <Badge
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {org.role}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ),
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}