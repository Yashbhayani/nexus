import { useState } from "react";
import { Button } from "../../UI/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../UI/avatar";
import { Badge } from "../../UI/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../UI/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../UI/tabs";
import { Separator } from "../../UI/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../UI/dialog";
import { Input } from "../../UI/input";
import { Textarea } from "../../UI/textarea";
import { Label } from "../../UI/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../UI/select";
import { 
  Settings, 
  MapPin, 
  Calendar, 
  Users, 
  Edit3,
  LogOut,
  Mail,
  Phone,
  Globe,
  Award,
  GraduationCap,
  Building2,
  Target,
  Link as LinkIcon,
  UserPlus,
  X,
  Plus
} from "lucide-react";
import { ImageWithFallback } from "../../Figma/ImageWithFallback";

interface UserProfileProps {
  onLogout?: () => void;
  selectedProfileId?: string;
  onNavigate?: (screen: string, data?: any) => void;
}

const UserProfile = ({ onLogout, selectedProfileId = "student", onNavigate }: UserProfileProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    bio: "",
    major: "",
    minor: "",
    academicLevel: "",
    graduationYear: "",
    skills: [] as string[],
    interests: [] as string[],
    newSkill: "",
    newInterest: ""
  });

  // Mock student data
  const studentProfile = {
    name: "Alex Johnson",
    email: "alex.johnson@university.edu",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    bio: "Computer Science major passionate about AI/ML and full-stack development. Always looking to collaborate on innovative projects!",
    academicLevel: "Junior",
    major: "Computer Science",
    minor: "Mathematics",
    graduationYear: "2026",
    location: "Engineering Building, Room 304",
    joinedDate: "Fall 2023",
    stats: {
      enrolledOrgs: 5,
      eventsAttended: 18
    },
    skills: ["Python", "React", "Machine Learning", "Data Structures", "UI/UX Design"],
    interests: ["Artificial Intelligence", "Web Development", "Hackathons", "Open Source"],
    enrolledOrganizations: [
      {
        id: "1",
        name: "Computer Science Society",
        role: "Member",
        logo: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=100&h=100&fit=crop",
        category: "Academic"
      },
      {
        id: "2",
        name: "AI Research Club",
        role: "Vice President",
        logo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop",
        category: "Academic"
      },
      {
        id: "3",
        name: "HackNight Weekly",
        role: "Organizer",
        logo: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=100&h=100&fit=crop",
        category: "Technical"
      }
    ]
  };

  // Mock organization data (for organizations the student manages)
  const organizationProfile = {
    name: "Computer Science Society",
    email: "contact@cssociety.edu",
    avatar: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=300&h=300&fit=crop",
    banner: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=400&fit=crop",
    description: "The premier organization for Computer Science students at the university. We host tech talks, hackathons, and networking events to help students grow their skills and connect with industry professionals.",
    mission: "To foster a collaborative community of aspiring technologists through educational events, hands-on projects, and industry connections.",
    category: "Academic",
    location: "Engineering Building, Room 215",
    foundedDate: "2015",
    website: "https://cssociety.university.edu",
    socialMedia: {
      discord: "cssociety",
      instagram: "@cs_society",
      linkedin: "cs-society-university"
    },
    stats: {
      members: 342,
      eventsHosted: 28,
      postsPublished: 45
    },
    contactInfo: {
      president: "Sarah Chen",
      vicePresident: "Alex Johnson",
      email: "contact@cssociety.edu",
      phone: "(555) 123-4567"
    },
    upcomingEvents: [
      {
        id: "1",
        title: "CS Study Group for Finals",
        date: "Dec 18",
        time: "6:00 PM",
        location: "Library Room 204",
        attendees: 23,
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&h=200&fit=crop"
      },
      {
        id: "2",
        title: "Tech Innovation Showcase",
        date: "May 20",
        time: "4:00 PM",
        location: "Engineering Building Atrium",
        attendees: 289,
        image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=300&h=200&fit=crop"
      }
    ],

    members: [
      {
        id: "1",
        name: "Sarah Chen",
        role: "President",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
        major: "Computer Science"
      },
      {
        id: "2",
        name: "Alex Johnson",
        role: "Vice President",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        major: "Computer Science"
      },
      {
        id: "3",
        name: "Marcus Williams",
        role: "Secretary",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
        major: "Software Engineering"
      },
      {
        id: "4",
        name: "Emily Rodriguez",
        role: "Treasurer",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        major: "Computer Science"
      }
    ]
  };

  // Determine profile type based on selectedProfileId
  const profileType = selectedProfileId === "student" ? "student" : "organization";
  
  // Get current profile data based on type
  const currentProfile = profileType === "student" ? studentProfile : organizationProfile;

  // Open edit dialog and populate form with current data
  const handleEditProfile = () => {
    if (profileType === "student") {
      setEditFormData({
        bio: studentProfile.bio,
        major: studentProfile.major,
        minor: studentProfile.minor,
        academicLevel: studentProfile.academicLevel,
        graduationYear: studentProfile.graduationYear,
        skills: [...studentProfile.skills],
        interests: [...studentProfile.interests],
        newSkill: "",
        newInterest: ""
      });
      setIsEditDialogOpen(true);
    }
  };

  // Handle form field changes
  const handleFormChange = (field: string, value: string) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  // Add new skill
  const handleAddSkill = () => {
    if (editFormData.newSkill.trim() && !editFormData.skills.includes(editFormData.newSkill.trim())) {
      setEditFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: ""
      }));
    }
  };

  // Remove skill
  const handleRemoveSkill = (skill: string) => {
    setEditFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  // Add new interest
  const handleAddInterest = () => {
    if (editFormData.newInterest.trim() && !editFormData.interests.includes(editFormData.newInterest.trim())) {
      setEditFormData(prev => ({
        ...prev,
        interests: [...prev.interests, prev.newInterest.trim()],
        newInterest: ""
      }));
    }
  };

  // Remove interest
  const handleRemoveInterest = (interest: string) => {
    setEditFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  // Save profile changes
  const handleSaveProfile = () => {
    // In a real app, this would update the database
    console.log("Saving profile:", editFormData);
    
    // Update local data (in real app, this would be from API response)
    studentProfile.bio = editFormData.bio;
    studentProfile.major = editFormData.major;
    studentProfile.minor = editFormData.minor;
    studentProfile.academicLevel = editFormData.academicLevel;
    studentProfile.graduationYear = editFormData.graduationYear;
    studentProfile.skills = editFormData.skills;
    studentProfile.interests = editFormData.interests;
    
    setIsEditDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      {/* Header Section */}
      <div className="relative">
        {/* Banner - Only for organization profile */}
        {profileType === "organization" && (
          <div className="h-48 md:h-64 w-full bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 relative overflow-hidden">
            <ImageWithFallback
              src={organizationProfile.banner}
              alt="Organization banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
        )}

        {/* Profile Header */}
        <div className={`max-w-5xl mx-auto px-4 ${profileType === "organization" ? "-mt-24" : "pt-4"}`}>
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
            {/* Avatar */}
            <div className={`${profileType === "organization" ? "ring-4 ring-background" : ""} rounded-full`}>
              <Avatar className="h-32 w-32 md:h-40 md:w-40">
                <AvatarImage src={currentProfile.avatar} alt={currentProfile.name} />
                <AvatarFallback className="text-3xl">
                  {currentProfile.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Profile Info & Actions */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                <div className="min-w-0">
                  <h1 className="text-2xl md:text-3xl font-semibold mb-1 truncate">{currentProfile.name}</h1>
                  <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                    {profileType === "student" ? (
                      <>
                        <GraduationCap className="h-4 w-4" />
                        <span className="text-sm">{studentProfile.academicLevel} • {studentProfile.major}</span>
                      </>
                    ) : (
                      <>
                        <Building2 className="h-4 w-4" />
                        <span className="text-sm">{organizationProfile.category} Organization</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleEditProfile}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                {profileType === "student" ? (
                  <>
                    <div>
                      <div className="font-semibold">{studentProfile.stats.enrolledOrgs}</div>
                      <div className="text-sm text-muted-foreground">Organizations</div>
                    </div>
                    <div>
                      <div className="font-semibold">{studentProfile.stats.eventsAttended}</div>
                      <div className="text-sm text-muted-foreground">Events Attended</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="font-semibold">{organizationProfile.stats.members}</div>
                      <div className="text-sm text-muted-foreground">Members</div>
                    </div>
                    <div>
                      <div className="font-semibold">{organizationProfile.stats.eventsHosted}</div>
                      <div className="text-sm text-muted-foreground">Events Hosted</div>
                    </div>
                    <div>
                      <div className="font-semibold">{organizationProfile.stats.postsPublished}</div>
                      <div className="text-sm text-muted-foreground">Posts Published</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 mt-6">
        {profileType === "student" ? (
          /* STUDENT PROFILE VIEW */
          <Tabs defaultValue="about" className="space-y-6">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="organizations">Organizations</TabsTrigger>
            </TabsList>

            {/* About Tab */}
            <TabsContent value="about" className="space-y-6">
              {/* Bio */}
              <Card>
                <CardHeader>
                  <CardTitle>Bio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{studentProfile.bio}</p>
                </CardContent>
              </Card>

              {/* Academic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Academic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Major</div>
                      <div className="font-medium">{studentProfile.major}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Minor</div>
                      <div className="font-medium">{studentProfile.minor}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Academic Level</div>
                      <div className="font-medium">{studentProfile.academicLevel}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Graduation Year</div>
                      <div className="font-medium">{studentProfile.graduationYear}</div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">Location</div>
                      <div className="font-medium">{studentProfile.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills & Interests */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {studentProfile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Interests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {studentProfile.interests.map((interest, index) => (
                        <Badge key={index} variant="outline">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Organizations Tab */}
            <TabsContent value="organizations" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">My Organizations</h2>
                <Button size="sm" onClick={() => onNavigate?.("discover")}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Join New
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studentProfile.enrolledOrganizations.map((org) => (
                  <Card key={org.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex gap-4 p-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={org.logo} alt={org.name} />
                          <AvatarFallback>{org.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mb-1 truncate">{org.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {org.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {org.role}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          /* ORGANIZATION PROFILE VIEW */
          <Tabs defaultValue="about" className="space-y-6">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
            </TabsList>

            {/* About Tab */}
            <TabsContent value="about" className="space-y-6">
              {/* Description & Mission */}
              <Card>
                <CardHeader>
                  <CardTitle>About Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{organizationProfile.description}</p>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Our Mission
                    </h3>
                    <p className="text-muted-foreground">{organizationProfile.mission}</p>
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
                        <div className="font-medium truncate">{organizationProfile.contactInfo.email}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="min-w-0">
                        <div className="text-sm text-muted-foreground">Phone</div>
                        <div className="font-medium">{organizationProfile.contactInfo.phone}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="min-w-0">
                        <div className="text-sm text-muted-foreground">Location</div>
                        <div className="font-medium">{organizationProfile.location}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="min-w-0">
                        <div className="text-sm text-muted-foreground">Website</div>
                        <a href={organizationProfile.website} className="font-medium text-primary hover:underline truncate block">
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
                        <div className="font-medium">{organizationProfile.contactInfo.president}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Vice President</div>
                        <div className="font-medium">{organizationProfile.contactInfo.vicePresident}</div>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-3">Social Media</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <LinkIcon className="h-3 w-3" />
                        Discord: {organizationProfile.socialMedia.discord}
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <LinkIcon className="h-3 w-3" />
                        Instagram: {organizationProfile.socialMedia.instagram}
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <LinkIcon className="h-3 w-3" />
                        LinkedIn: {organizationProfile.socialMedia.linkedin}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Upcoming Events</h2>
                <Button size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </div>

              <div className="space-y-4">
                {organizationProfile.upcomingEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex gap-4 p-4">
                        <ImageWithFallback
                          src={event.image}
                          alt={event.title}
                          className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mb-2 line-clamp-2">{event.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <Calendar className="h-4 w-4" />
                            <span>{event.date} • {event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{event.attendees} interested</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="self-start">
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Members ({organizationProfile.stats.members})</h2>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Members
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {organizationProfile.members.map((member) => (
                  <Card key={member.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{member.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">{member.major}</p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {member.role}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Logout Button */}
        <div className="mt-8 pt-6 border-t border-border">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto text-destructive hover:text-destructive"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information, skills, and interests.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={editFormData.bio}
                onChange={(e) => handleFormChange("bio", e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Academic Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="major">Major</Label>
                  <Input
                    id="major"
                    placeholder="e.g., Computer Science"
                    value={editFormData.major}
                    onChange={(e) => handleFormChange("major", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minor">Minor</Label>
                  <Input
                    id="minor"
                    placeholder="e.g., Mathematics"
                    value={editFormData.minor}
                    onChange={(e) => handleFormChange("minor", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="academicLevel">Academic Level</Label>
                  <Select
                    value={editFormData.academicLevel}
                    onValueChange={(value) => handleFormChange("academicLevel", value)}
                  >
                    <SelectTrigger id="academicLevel">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Freshman">Freshman</SelectItem>
                      <SelectItem value="Sophomore">Sophomore</SelectItem>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                      <SelectItem value="Graduate">Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Select
                    value={editFormData.graduationYear}
                    onValueChange={(value) => handleFormChange("graduationYear", value)}
                  >
                    <SelectTrigger id="graduationYear">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2027">2027</SelectItem>
                      <SelectItem value="2028">2028</SelectItem>
                      <SelectItem value="2029">2029</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Skills */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Skills
              </Label>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill (e.g., Python, React)"
                  value={editFormData.newSkill}
                  onChange={(e) => handleFormChange("newSkill", e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <Button type="button" size="sm" onClick={handleAddSkill}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {editFormData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="pl-3 pr-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Interests */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Interests
              </Label>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add an interest (e.g., AI, Web Development)"
                  value={editFormData.newInterest}
                  onChange={(e) => handleFormChange("newInterest", e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddInterest();
                    }
                  }}
                />
                <Button type="button" size="sm" onClick={handleAddInterest}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {editFormData.interests.map((interest, index) => (
                  <Badge key={index} variant="outline" className="pl-3 pr-1">
                    {interest}
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserProfile
