import { useState } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { 
  Settings, 
  MapPin, 
  Calendar, 
  Users, 
  Edit3,
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
  Plus,
  Check,
  Trash2,
  Send
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface UserProfileProps {
  selectedProfileId?: string;
  activeTab?: string;
  onNavigate?: (screen: string, data?: any) => void;
}

export function UserProfile({ selectedProfileId = "student", activeTab = "about", onNavigate }: UserProfileProps) {
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

  // Organization edit form data
  const [orgEditFormData, setOrgEditFormData] = useState({
    description: "",
    mission: "",
    email: "",
    phone: "",
    website: "",
    discord: "",
    instagram: "",
    linkedin: ""
  });

  // Create event dialog state
  const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState(false);
  const [createEventFormData, setCreateEventFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    capacity: "",
    imageUrl: ""
  });

  // Edit event dialog state
  const [isEditEventDialogOpen, setIsEditEventDialogOpen] = useState(false);
  const [editEventFormData, setEditEventFormData] = useState({
    id: "",
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    capacity: "",
    imageUrl: ""
  });

  // Member management state
  const [isInviteMemberDialogOpen, setIsInviteMemberDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");
  
  // Pending member requests (mock data)
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: "p1",
      name: "Jordan Chen",
      email: "jordan.chen@university.edu",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face",
      major: "Computer Engineering",
      requestDate: "2 days ago"
    },
    {
      id: "p2",
      name: "Taylor Smith",
      email: "taylor.smith@university.edu",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      major: "Information Systems",
      requestDate: "5 days ago"
    }
  ]);

  // Posts management state
  const [isCreatePostDialogOpen, setIsCreatePostDialogOpen] = useState(false);
  const [isEditPostDialogOpen, setIsEditPostDialogOpen] = useState(false);
  const [createPostFormData, setCreatePostFormData] = useState({
    title: "",
    content: "",
    category: "",
    imageUrl: ""
  });
  const [editPostFormData, setEditPostFormData] = useState({
    id: "",
    title: "",
    content: "",
    category: "",
    imageUrl: ""
  });

  // Mock posts data (would come from database in real app)
  const [organizationPosts, setOrganizationPosts] = useState([
    {
      id: "post1",
      title: "Hackathon 2025 Registration Now Open!",
      content: "We're excited to announce that registration for our annual Hackathon is now open! Join us for 48 hours of coding, collaboration, and innovation. Prizes worth $10,000!",
      category: "Announcement",
      imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop",
      date: "2 days ago",
      author: "Admin Team"
    },
    {
      id: "post2",
      title: "Weekly Study Session - Algorithm Design",
      content: "Join us this Friday for our weekly algorithm design study session. We'll be covering dynamic programming and graph algorithms. All skill levels welcome!",
      category: "Event",
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
      date: "5 days ago",
      author: "Study Group Lead"
    },
    {
      id: "post3",
      title: "New Partnership with Tech Giants",
      content: "We're thrilled to announce new partnerships with leading tech companies! This means more workshops, internship opportunities, and networking events for our members.",
      category: "News",
      imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop",
      date: "1 week ago",
      author: "President"
    }
  ]);

  // Student posts state (personal posts by the student)
  const [studentPosts, setStudentPosts] = useState([
    {
      id: "studentpost1",
      title: "Looking for Project Partners",
      content: "I'm working on a machine learning project about sentiment analysis. Looking for teammates who have experience with Python and NLP. Let's connect!",
      category: "Collaboration",
      imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
      date: "1 day ago"
    },
    {
      id: "studentpost2",
      title: "Study Group for Data Structures",
      content: "Starting a weekly study group for CS 201 - Data Structures. Meeting every Tuesday at 6 PM in the library. All are welcome!",
      category: "Study",
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop",
      date: "3 days ago"
    },
    {
      id: "studentpost3",
      title: "Successful Internship at Google!",
      content: "Just finished my summer internship at Google! Learned so much about cloud architecture and scalable systems. Happy to share my experience and tips!",
      category: "Achievement",
      imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=400&fit=crop",
      date: "1 week ago"
    }
  ]);

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
        category: "Academic",
        socialMedia: {
          discord: "cssociety",
          instagram: "@cs_society",
          linkedin: "cs-society-university"
        }
      },
      {
        id: "2",
        name: "AI Research Club",
        role: "Vice President",
        logo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop",
        category: "Academic",
        socialMedia: {
          discord: "ai_research",
          instagram: "@ai_research_club",
          linkedin: "ai-research-club"
        }
      },
      {
        id: "3",
        name: "HackNight Weekly",
        role: "Organizer",
        logo: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=100&h=100&fit=crop",
        category: "Technical",
        socialMedia: {
          discord: "hacknight",
          instagram: "@hacknight_weekly",
          linkedin: "hacknight-weekly"
        }
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
    } else {
      setOrgEditFormData({
        description: organizationProfile.description,
        mission: organizationProfile.mission,
        email: organizationProfile.contactInfo.email,
        phone: organizationProfile.contactInfo.phone,
        website: organizationProfile.website,
        discord: organizationProfile.socialMedia.discord,
        instagram: organizationProfile.socialMedia.instagram,
        linkedin: organizationProfile.socialMedia.linkedin
      });
    }
    setIsEditDialogOpen(true);
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
    if (profileType === "student") {
      // In a real app, this would update the database
      console.log("Saving student profile:", editFormData);
      
      // Update local data (in real app, this would be from API response)
      studentProfile.bio = editFormData.bio;
      studentProfile.major = editFormData.major;
      studentProfile.minor = editFormData.minor;
      studentProfile.academicLevel = editFormData.academicLevel;
      studentProfile.graduationYear = editFormData.graduationYear;
      studentProfile.skills = editFormData.skills;
      studentProfile.interests = editFormData.interests;
    } else {
      // Save organization profile
      console.log("Saving organization profile:", orgEditFormData);
      
      // Update local data
      organizationProfile.description = orgEditFormData.description;
      organizationProfile.mission = orgEditFormData.mission;
      organizationProfile.contactInfo.email = orgEditFormData.email;
      organizationProfile.contactInfo.phone = orgEditFormData.phone;
      organizationProfile.website = orgEditFormData.website;
      organizationProfile.socialMedia.discord = orgEditFormData.discord;
      organizationProfile.socialMedia.instagram = orgEditFormData.instagram;
      organizationProfile.socialMedia.linkedin = orgEditFormData.linkedin;
    }
    
    setIsEditDialogOpen(false);
  };

  // Handle create event
  const handleCreateEvent = () => {
    // In a real app, this would send data to the database
    console.log("Creating event:", createEventFormData);
    
    // Reset form and close dialog
    setCreateEventFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      category: "",
      capacity: "",
      imageUrl: ""
    });
    setIsCreateEventDialogOpen(false);
    
    // Show success message (in real app, would handle success/error from API)
    alert("Event created successfully!");
  };

  // Handle open edit event dialog
  const handleOpenEditEvent = (event) => {
    // Pre-populate the form with the event's current data
    setEditEventFormData({
      id: event.id,
      title: event.title,
      description: event.description || "",
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category || "",
      capacity: event.capacity?.toString() || "",
      imageUrl: event.image || ""
    });
    setIsEditEventDialogOpen(true);
  };

  // Handle save edited event
  const handleSaveEditedEvent = () => {
    // In a real app, this would send updated data to the database
    console.log("Updating event:", editEventFormData);
    
    // Update the event in the local data (in real app, this would be from API response)
    const eventIndex = organizationProfile.upcomingEvents.findIndex(e => e.id === editEventFormData.id);
    if (eventIndex !== -1) {
      organizationProfile.upcomingEvents[eventIndex] = {
        ...organizationProfile.upcomingEvents[eventIndex],
        title: editEventFormData.title,
        description: editEventFormData.description,
        date: editEventFormData.date,
        time: editEventFormData.time,
        location: editEventFormData.location,
        category: editEventFormData.category,
        capacity: editEventFormData.capacity,
        image: editEventFormData.imageUrl
      };
    }
    
    // Close dialog
    setIsEditEventDialogOpen(false);
    
    // Show success message (in real app, would handle success/error from API)
    alert("Event updated successfully!");
  };

  // Member management handlers
  const handleSendInvite = () => {
    // In a real app, this would send an email invitation
    console.log("Sending invite to:", inviteEmail, "with role:", inviteRole);
    
    // Reset form and close dialog
    setInviteEmail("");
    setInviteRole("Member");
    setIsInviteMemberDialogOpen(false);
    
    alert(`Invitation sent to ${inviteEmail}!`);
  };

  const handleApproveRequest = (requestId) => {
    // In a real app, this would approve the request in the database
    const request = pendingRequests.find(r => r.id === requestId);
    if (request) {
      console.log("Approving request from:", request.name);
      setPendingRequests(prev => prev.filter(r => r.id !== requestId));
      alert(`${request.name} has been approved and added to the organization!`);
    }
  };

  const handleRejectRequest = (requestId) => {
    // In a real app, this would reject the request in the database
    const request = pendingRequests.find(r => r.id === requestId);
    if (request) {
      console.log("Rejecting request from:", request.name);
      setPendingRequests(prev => prev.filter(r => r.id !== requestId));
      alert(`${request.name}'s request has been rejected.`);
    }
  };

  const handleRemoveMember = (memberId, memberName) => {
    // In a real app, this would remove the member from the database
    if (confirm(`Are you sure you want to remove ${memberName} from the organization?`)) {
      console.log("Removing member:", memberId);
      alert(`${memberName} has been removed from the organization.`);
    }
  };

  const handleUpdateMemberRole = (memberId, memberName, newRole) => {
    // In a real app, this would update the member's role in the database
    console.log("Updating role for member:", memberId, "to:", newRole);
    alert(`${memberName}'s role has been updated to ${newRole}.`);
  };

  // Post management handlers
  const handleCreatePost = () => {
    // In a real app, this would send the post data to the database
    const newPost = {
      id: `post${Date.now()}`,
      ...createPostFormData,
      date: "Just now",
      author: "Admin Team"
    };
    
    setOrganizationPosts([newPost, ...organizationPosts]);
    
    // Reset form and close dialog
    setCreatePostFormData({
      title: "",
      content: "",
      category: "",
      imageUrl: ""
    });
    setIsCreatePostDialogOpen(false);
    
    alert("Post created successfully!");
  };

  const handleEditPost = (post) => {
    // Open edit dialog with pre-filled data
    setEditPostFormData({
      id: post.id,
      title: post.title,
      content: post.content,
      category: post.category,
      imageUrl: post.imageUrl || ""
    });
    setIsEditPostDialogOpen(true);
  };

  const handleSaveEditedPost = () => {
    // In a real app, this would update the post in the database
    setOrganizationPosts(organizationPosts.map(post => 
      post.id === editPostFormData.id 
        ? {
            ...post,
            title: editPostFormData.title,
            content: editPostFormData.content,
            category: editPostFormData.category,
            imageUrl: editPostFormData.imageUrl
          }
        : post
    ));
    
    // Close dialog
    setIsEditPostDialogOpen(false);
    
    alert("Post updated successfully!");
  };

  const handleDeletePost = (postId, postTitle) => {
    // In a real app, this would delete the post from the database
    if (confirm(`Are you sure you want to delete "${postTitle}"?`)) {
      setOrganizationPosts(organizationPosts.filter(post => post.id !== postId));
      alert("Post deleted successfully!");
    }
  };

  // Student post management handlers
  const handleCreateStudentPost = () => {
    // In a real app, this would send the post data to the database
    const newPost = {
      id: `studentpost${Date.now()}`,
      ...createPostFormData,
      date: "Just now"
    };
    
    setStudentPosts([newPost, ...studentPosts]);
    
    // Reset form and close dialog
    setCreatePostFormData({
      title: "",
      content: "",
      category: "",
      imageUrl: ""
    });
    setIsCreatePostDialogOpen(false);
    
    alert("Post created successfully!");
  };

  const handleEditStudentPost = (post) => {
    // Open edit dialog with pre-filled data
    setEditPostFormData({
      id: post.id,
      title: post.title,
      content: post.content,
      category: post.category,
      imageUrl: post.imageUrl || ""
    });
    setIsEditPostDialogOpen(true);
  };

  const handleSaveEditedStudentPost = () => {
    // In a real app, this would update the post in the database
    setStudentPosts(studentPosts.map(post => 
      post.id === editPostFormData.id 
        ? {
            ...post,
            title: editPostFormData.title,
            content: editPostFormData.content,
            category: editPostFormData.category,
            imageUrl: editPostFormData.imageUrl
          }
        : post
    ));
    
    // Close dialog
    setIsEditPostDialogOpen(false);
    
    alert("Post updated successfully!");
  };

  const handleDeleteStudentPost = (postId, postTitle) => {
    // In a real app, this would delete the post from the database
    if (confirm(`Are you sure you want to delete "${postTitle}"?`)) {
      setStudentPosts(studentPosts.filter(post => post.id !== postId));
      alert("Post deleted successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      {/* Header Section */}
      <div className="relative">
        {/* Profile Header */}
        <div className="max-w-5xl mx-auto px-4 pt-4">
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
            {/* Avatar */}
            <div className="rounded-full">
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

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" onClick={handleEditProfile}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  {/* <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button> */}
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
          <Tabs defaultValue={activeTab} className="space-y-6">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
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

            {/* Posts Tab (Student) */}
            <TabsContent value="posts" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">My Posts ({studentPosts.length})</h2>
                <Button size="sm" onClick={() => setIsCreatePostDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studentPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      {post.imageUrl && (
                        <ImageWithFallback
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {post.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{post.date}</span>
                            </div>
                            <h3 className="font-semibold mb-2">{post.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {post.content}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditStudentPost(post)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteStudentPost(post.id, post.title)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {studentPosts.length === 0 && (
                  <Card className="md:col-span-2">
                    <CardContent className="p-12 text-center">
                      <p className="text-muted-foreground">No posts yet. Create your first post to share with the community!</p>
                    </CardContent>
                  </Card>
                )}
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
                    <CardContent className="p-4 space-y-4">
                      <div className="flex gap-4">
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
                          <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => onNavigate?.("profile", { profileId: org.id, activeTab: "about" })}>
                            View Profile
                          </Button>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Social Media Section */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Social Media</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                            <LinkIcon className="h-3 w-3" />
                            Discord: {org.socialMedia.discord}
                          </Badge>
                          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                            <LinkIcon className="h-3 w-3" />
                            Instagram: {org.socialMedia.instagram}
                          </Badge>
                          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                            <LinkIcon className="h-3 w-3" />
                            LinkedIn: {org.socialMedia.linkedin}
                          </Badge>
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
          <Tabs defaultValue={activeTab} className="space-y-6">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
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
                <Button size="sm" onClick={() => setIsCreateEventDialogOpen(true)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {organizationProfile.upcomingEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <ImageWithFallback
                        src={event.image}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2 line-clamp-2">{event.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                              <Calendar className="h-4 w-4" />
                              <span>{event.date} • {event.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                              <MapPin className="h-4 w-4" />
                              <span className="truncate">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>{event.attendees} interested</span>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenEditEvent(event)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Posts Tab */}
            <TabsContent value="posts" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Posts ({organizationPosts.length})</h2>
                <Button size="sm" onClick={() => setIsCreatePostDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {organizationPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      {post.imageUrl && (
                        <ImageWithFallback
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {post.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{post.date}</span>
                            </div>
                            <h3 className="font-semibold mb-2">{post.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {post.content}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              By {post.author}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditPost(post)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeletePost(post.id, post.title)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {organizationPosts.length === 0 && (
                  <Card className="md:col-span-2">
                    <CardContent className="p-12 text-center">
                      <p className="text-muted-foreground">No posts yet. Create your first post to get started!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members" className="space-y-6">
              {/* Pending Requests Section */}
              {pendingRequests.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Pending Requests ({pendingRequests.length})</h2>
                  </div>

                  <div className="space-y-3">
                    {pendingRequests.map((request) => (
                      <Card key={request.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={request.avatar} alt={request.name} />
                              <AvatarFallback>{request.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold truncate">{request.name}</h3>
                              <p className="text-sm text-muted-foreground truncate">{request.major}</p>
                              <p className="text-xs text-muted-foreground mt-1">Requested {request.requestDate}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => handleApproveRequest(request.id)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleRejectRequest(request.id)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Members Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Members ({organizationProfile.stats.members})</h2>
                  <Button size="sm" onClick={() => setIsInviteMemberDialogOpen(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Members
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
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
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Role Selector */}
                            <Select
                              value={member.role}
                              onValueChange={(newRole) => handleUpdateMemberRole(member.id, member.name, newRole)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="President">President</SelectItem>
                                <SelectItem value="Vice President">Vice President</SelectItem>
                                <SelectItem value="Secretary">Secretary</SelectItem>
                                <SelectItem value="Treasurer">Treasurer</SelectItem>
                                <SelectItem value="Officer">Officer</SelectItem>
                                <SelectItem value="Member">Member</SelectItem>
                              </SelectContent>
                            </Select>

                            {/* Remove Member Button */}
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleRemoveMember(member.id, member.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {profileType === "student" ? "Profile" : "Organization"}</DialogTitle>
            <DialogDescription>
              {profileType === "student" 
                ? "Update your profile information, skills, and interests."
                : "Update your organization's information and contact details."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {profileType === "student" ? (
              // Student Edit Form
              <>
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
            </>
            ) : (
              // Organization Edit Form
              <>
                {/* About Us Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    About Us
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of your organization..."
                      value={orgEditFormData.description}
                      onChange={(e) => setOrgEditFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mission">Mission Statement</Label>
                    <Textarea
                      id="mission"
                      placeholder="Your organization's mission..."
                      value={orgEditFormData.mission}
                      onChange={(e) => setOrgEditFormData(prev => ({ ...prev, mission: e.target.value }))}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Contact Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="contact@organization.edu"
                        value={orgEditFormData.email}
                        onChange={(e) => setOrgEditFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={orgEditFormData.phone}
                        onChange={(e) => setOrgEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        placeholder="https://organization.university.edu"
                        value={orgEditFormData.website}
                        onChange={(e) => setOrgEditFormData(prev => ({ ...prev, website: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Social Media */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Social Media
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="discord">Discord</Label>
                      <Input
                        id="discord"
                        placeholder="organization_server"
                        value={orgEditFormData.discord}
                        onChange={(e) => setOrgEditFormData(prev => ({ ...prev, discord: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        placeholder="@organization"
                        value={orgEditFormData.instagram}
                        onChange={(e) => setOrgEditFormData(prev => ({ ...prev, instagram: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        placeholder="organization-university"
                        value={orgEditFormData.linkedin}
                        onChange={(e) => setOrgEditFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
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

      {/* Create Event Dialog */}
      <Dialog open={isCreateEventDialogOpen} onOpenChange={setIsCreateEventDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Fill out the details below to create a new event for your organization.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Event Title */}
            <div className="space-y-2">
              <Label htmlFor="event-title">Event Title *</Label>
              <Input
                id="event-title"
                placeholder="e.g., Tech Workshop: Introduction to AI"
                value={createEventFormData.title}
                onChange={(e) => setCreateEventFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            {/* Event Description */}
            <div className="space-y-2">
              <Label htmlFor="event-description">Description *</Label>
              <Textarea
                id="event-description"
                placeholder="Describe what your event is about, what attendees will learn or experience..."
                value={createEventFormData.description}
                onChange={(e) => setCreateEventFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-date">Date *</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={createEventFormData.date}
                  onChange={(e) => setCreateEventFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-time">Time *</Label>
                <Input
                  id="event-time"
                  type="time"
                  value={createEventFormData.time}
                  onChange={(e) => setCreateEventFormData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="event-location">Location *</Label>
              <Input
                id="event-location"
                placeholder="e.g., Engineering Building Room 203"
                value={createEventFormData.location}
                onChange={(e) => setCreateEventFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            {/* Category and Capacity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-category">Category *</Label>
                <Select
                  value={createEventFormData.category}
                  onValueChange={(value) => setCreateEventFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger id="event-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="seminar">Seminar</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="competition">Competition</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-capacity">Capacity (optional)</Label>
                <Input
                  id="event-capacity"
                  type="number"
                  placeholder="e.g., 50"
                  value={createEventFormData.capacity}
                  onChange={(e) => setCreateEventFormData(prev => ({ ...prev, capacity: e.target.value }))}
                />
              </div>
            </div>

            {/* Event Image URL */}
            <div className="space-y-2">
              <Label htmlFor="event-image">Event Image URL (optional)</Label>
              <Input
                id="event-image"
                type="url"
                placeholder="https://example.com/event-image.jpg"
                value={createEventFormData.imageUrl}
                onChange={(e) => setCreateEventFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Provide a URL to an image that represents your event
              </p>
            </div>

            {/* Image Preview */}
            {createEventFormData.imageUrl && (
              <div className="space-y-2">
                <Label>Image Preview</Label>
                <div className="rounded-lg overflow-hidden border border-border">
                  <ImageWithFallback
                    src={createEventFormData.imageUrl}
                    alt="Event preview"
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsCreateEventDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateEvent}
              disabled={
                !createEventFormData.title ||
                !createEventFormData.description ||
                !createEventFormData.date ||
                !createEventFormData.time ||
                !createEventFormData.location ||
                !createEventFormData.category
              }
            >
              <Calendar className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditEventDialogOpen} onOpenChange={setIsEditEventDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update the details below to modify your event.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Event Title */}
            <div className="space-y-2">
              <Label htmlFor="edit-event-title">Event Title *</Label>
              <Input
                id="edit-event-title"
                placeholder="e.g., Tech Workshop: Introduction to AI"
                value={editEventFormData.title}
                onChange={(e) => setEditEventFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            {/* Event Description */}
            <div className="space-y-2">
              <Label htmlFor="edit-event-description">Description *</Label>
              <Textarea
                id="edit-event-description"
                placeholder="Describe what your event is about, what attendees will learn or experience..."
                value={editEventFormData.description}
                onChange={(e) => setEditEventFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-event-date">Date *</Label>
                <Input
                  id="edit-event-date"
                  type="date"
                  value={editEventFormData.date}
                  onChange={(e) => setEditEventFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-event-time">Time *</Label>
                <Input
                  id="edit-event-time"
                  type="time"
                  value={editEventFormData.time}
                  onChange={(e) => setEditEventFormData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="edit-event-location">Location *</Label>
              <Input
                id="edit-event-location"
                placeholder="e.g., Engineering Building Room 203"
                value={editEventFormData.location}
                onChange={(e) => setEditEventFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            {/* Category and Capacity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-event-category">Category *</Label>
                <Select
                  value={editEventFormData.category}
                  onValueChange={(value) => setEditEventFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger id="edit-event-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="seminar">Seminar</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="competition">Competition</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-event-capacity">Capacity (optional)</Label>
                <Input
                  id="edit-event-capacity"
                  type="number"
                  placeholder="e.g., 50"
                  value={editEventFormData.capacity}
                  onChange={(e) => setEditEventFormData(prev => ({ ...prev, capacity: e.target.value }))}
                />
              </div>
            </div>

            {/* Event Image URL */}
            <div className="space-y-2">
              <Label htmlFor="edit-event-image">Event Image URL (optional)</Label>
              <Input
                id="edit-event-image"
                type="url"
                placeholder="https://example.com/event-image.jpg"
                value={editEventFormData.imageUrl}
                onChange={(e) => setEditEventFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Provide a URL to an image that represents your event
              </p>
            </div>

            {/* Image Preview */}
            {editEventFormData.imageUrl && (
              <div className="space-y-2">
                <Label>Image Preview</Label>
                <div className="rounded-lg overflow-hidden border border-border">
                  <ImageWithFallback
                    src={editEventFormData.imageUrl}
                    alt="Event preview"
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsEditEventDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEditedEvent}
              disabled={
                !editEventFormData.title ||
                !editEventFormData.description ||
                !editEventFormData.date ||
                !editEventFormData.time ||
                !editEventFormData.location ||
                !editEventFormData.category
              }
            >
              <Calendar className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invite Member Dialog */}
      <Dialog open={isInviteMemberDialogOpen} onOpenChange={setIsInviteMemberDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite New Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your organization via email.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email Address *</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="student@university.edu"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="invite-role">Initial Role *</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger id="invite-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="President">President</SelectItem>
                  <SelectItem value="Vice President">Vice President</SelectItem>
                  <SelectItem value="Secretary">Secretary</SelectItem>
                  <SelectItem value="Treasurer">Treasurer</SelectItem>
                  <SelectItem value="Officer">Officer</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Information Note */}
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm text-muted-foreground">
                An email invitation will be sent to this address with a link to join your organization.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsInviteMemberDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendInvite}
              disabled={!inviteEmail || !inviteEmail.includes('@')}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Invitation
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Post Dialog */}
      <Dialog open={isCreatePostDialogOpen} onOpenChange={setIsCreatePostDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>
              Share updates, announcements, and news with your organization members.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Post Title */}
            <div className="space-y-2">
              <Label htmlFor="create-post-title">Post Title *</Label>
              <Input
                id="create-post-title"
                placeholder="e.g., Hackathon 2025 Registration Open"
                value={createPostFormData.title}
                onChange={(e) => setCreatePostFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            {/* Post Content */}
            <div className="space-y-2">
              <Label htmlFor="create-post-content">Content *</Label>
              <Textarea
                id="create-post-content"
                placeholder="Write your post content here..."
                rows={6}
                value={createPostFormData.content}
                onChange={(e) => setCreatePostFormData(prev => ({ ...prev, content: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Provide detailed information about your announcement, event, or news
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="create-post-category">Category *</Label>
              <Select 
                value={createPostFormData.category}
                onValueChange={(value) => setCreatePostFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger id="create-post-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {profileType === "student" ? (
                    <>
                      <SelectItem value="Study">Study</SelectItem>
                      <SelectItem value="Collaboration">Collaboration</SelectItem>
                      <SelectItem value="Achievement">Achievement</SelectItem>
                      <SelectItem value="Question">Question</SelectItem>
                      <SelectItem value="Opportunity">Opportunity</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Announcement">Announcement</SelectItem>
                      <SelectItem value="Event">Event</SelectItem>
                      <SelectItem value="News">News</SelectItem>
                      <SelectItem value="Update">Update</SelectItem>
                      <SelectItem value="Achievement">Achievement</SelectItem>
                      <SelectItem value="Opportunity">Opportunity</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="create-post-image">Cover Image URL (optional)</Label>
              <Input
                id="create-post-image"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={createPostFormData.imageUrl}
                onChange={(e) => setCreatePostFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Add a cover image to make your post more engaging
              </p>
            </div>

            {/* Preview Section */}
            {(createPostFormData.title || createPostFormData.content) && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    {createPostFormData.imageUrl && (
                      <ImageWithFallback
                        src={createPostFormData.imageUrl}
                        alt="Post preview"
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      {createPostFormData.category && (
                        <Badge variant="secondary" className="text-xs mb-2">
                          {createPostFormData.category}
                        </Badge>
                      )}
                      {createPostFormData.title && (
                        <h3 className="font-semibold mb-2">{createPostFormData.title}</h3>
                      )}
                      {createPostFormData.content && (
                        <p className="text-sm text-muted-foreground">
                          {createPostFormData.content}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsCreatePostDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={profileType === "student" ? handleCreateStudentPost : handleCreatePost}
              disabled={
                !createPostFormData.title ||
                !createPostFormData.content ||
                !createPostFormData.category
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Post Dialog */}
      <Dialog open={isEditPostDialogOpen} onOpenChange={setIsEditPostDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>
              Update your post information and content.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Post Title */}
            <div className="space-y-2">
              <Label htmlFor="edit-post-title">Post Title *</Label>
              <Input
                id="edit-post-title"
                placeholder="e.g., Hackathon 2025 Registration Open"
                value={editPostFormData.title}
                onChange={(e) => setEditPostFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            {/* Post Content */}
            <div className="space-y-2">
              <Label htmlFor="edit-post-content">Content *</Label>
              <Textarea
                id="edit-post-content"
                placeholder="Write your post content here..."
                rows={6}
                value={editPostFormData.content}
                onChange={(e) => setEditPostFormData(prev => ({ ...prev, content: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Provide detailed information about your announcement, event, or news
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="edit-post-category">Category *</Label>
              <Select 
                value={editPostFormData.category}
                onValueChange={(value) => setEditPostFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger id="edit-post-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {profileType === "student" ? (
                    <>
                      <SelectItem value="Study">Study</SelectItem>
                      <SelectItem value="Collaboration">Collaboration</SelectItem>
                      <SelectItem value="Achievement">Achievement</SelectItem>
                      <SelectItem value="Question">Question</SelectItem>
                      <SelectItem value="Opportunity">Opportunity</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Announcement">Announcement</SelectItem>
                      <SelectItem value="Event">Event</SelectItem>
                      <SelectItem value="News">News</SelectItem>
                      <SelectItem value="Update">Update</SelectItem>
                      <SelectItem value="Achievement">Achievement</SelectItem>
                      <SelectItem value="Opportunity">Opportunity</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="edit-post-image">Cover Image URL (optional)</Label>
              <Input
                id="edit-post-image"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={editPostFormData.imageUrl}
                onChange={(e) => setEditPostFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Add a cover image to make your post more engaging
              </p>
            </div>

            {/* Preview Section */}
            {(editPostFormData.title || editPostFormData.content) && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    {editPostFormData.imageUrl && (
                      <ImageWithFallback
                        src={editPostFormData.imageUrl}
                        alt="Post preview"
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      {editPostFormData.category && (
                        <Badge variant="secondary" className="text-xs mb-2">
                          {editPostFormData.category}
                        </Badge>
                      )}
                      {editPostFormData.title && (
                        <h3 className="font-semibold mb-2">{editPostFormData.title}</h3>
                      )}
                      {editPostFormData.content && (
                        <p className="text-sm text-muted-foreground">
                          {editPostFormData.content}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsEditPostDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={profileType === "student" ? handleSaveEditedStudentPost : handleSaveEditedPost}
              disabled={
                !editPostFormData.title ||
                !editPostFormData.content ||
                !editPostFormData.category
              }
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}