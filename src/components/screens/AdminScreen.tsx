import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { 
  Search, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock,
  Users,
  Calendar,
  FileText,
  Shield,
  AlertTriangle,
  Building2,
  User
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface AdminScreenProps {
  onNavigate?: (screen: string, data?: any) => void;
}

export function AdminScreen({ onNavigate }: AdminScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; type: string; id: string; name: string }>({ 
    open: false, 
    type: "", 
    id: "", 
    name: "" 
  });

  // Mock data for posts
  const [posts, setPosts] = useState([
    {
      id: "p1",
      user: { name: "Student Government", username: "studentgov", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
      content: "📢 IMPORTANT: New library hours starting Monday!",
      timestamp: "2h",
      likes: 156,
      comments: 23,
      type: "organization"
    },
    {
      id: "p2",
      user: { name: "Sarah Chen", username: "sarahc_22", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop" },
      content: "Just finished my first coding interview! 💻",
      timestamp: "3h",
      likes: 89,
      comments: 31,
      type: "student"
    },
    {
      id: "p3",
      user: { name: "Engineering Society", username: "engsociety", avatar: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=150&h=150&fit=crop" },
      content: "🔧 Tech Talk Series continues this Friday!",
      timestamp: "4h",
      likes: 142,
      comments: 28,
      type: "organization"
    },
    {
      id: "p4",
      user: { name: "Marcus Johnson", username: "marcus_j", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" },
      content: "Shoutout to the amazing turnout at yesterday's climate action rally! 🌍",
      timestamp: "6h",
      likes: 234,
      comments: 45,
      type: "student"
    }
  ]);

  // Mock data for events
  const [events, setEvents] = useState([
    {
      id: "e1",
      title: "CS Study Group for Finals",
      organizer: "Computer Science Club",
      date: "Dec 18",
      attendees: 23,
      status: "approved",
      category: "Academic"
    },
    {
      id: "e2",
      title: "Intramural Basketball Tournament",
      organizer: "Campus Basketball League",
      date: "Jan 20",
      attendees: 156,
      status: "approved",
      category: "Sports"
    },
    {
      id: "e3",
      title: "Startup Networking Night",
      organizer: "Entrepreneurship Club",
      date: "Jan 25",
      attendees: 45,
      status: "pending",
      category: "Career"
    },
    {
      id: "e4",
      title: "Winter Art Exhibition",
      organizer: "Art & Design Society",
      date: "Feb 5",
      attendees: 89,
      status: "pending",
      category: "Arts"
    },
    {
      id: "e5",
      title: "Greek Life Recruitment Fair",
      organizer: "Alpha Beta Gamma",
      date: "Mar 12",
      attendees: 245,
      status: "approved",
      category: "Greek Life"
    }
  ]);

  // Mock data for accounts
  const [accounts, setAccounts] = useState([
    {
      id: "u1",
      name: "Sarah Chen",
      username: "sarahc_22",
      email: "sarah.chen@university.edu",
      type: "student",
      joinDate: "Sep 2023",
      posts: 45,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop"
    },
    {
      id: "u2",
      name: "Marcus Johnson",
      username: "marcus_j",
      email: "marcus.j@university.edu",
      type: "student",
      joinDate: "Sep 2022",
      posts: 128,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
    },
    {
      id: "u3",
      name: "Emily Rodriguez",
      username: "emily_r",
      email: "emily.rod@university.edu",
      type: "student",
      joinDate: "Jan 2024",
      posts: 12,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
    },
    {
      id: "o1",
      name: "Computer Science Club",
      username: "cs_club",
      email: "csclub@university.edu",
      type: "organization",
      joinDate: "Aug 2020",
      posts: 234,
      avatar: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=150&h=150&fit=crop"
    },
    {
      id: "o2",
      name: "Student Government",
      username: "studentgov",
      email: "studentgov@university.edu",
      type: "organization",
      joinDate: "Aug 2019",
      posts: 567,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
    }
  ]);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Stats calculation
  const stats = {
    totalPosts: posts.length,
    totalEvents: events.length,
    pendingEvents: events.filter(e => e.status === "pending").length,
    totalAccounts: accounts.length,
    students: accounts.filter(a => a.type === "student").length,
    organizations: accounts.filter(a => a.type === "organization").length
  };

  // Delete handlers
  const handleDeletePost = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
    setDeleteDialog({ open: false, type: "", id: "", name: "" });
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    setDeleteDialog({ open: false, type: "", id: "", name: "" });
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter(a => a.id !== id));
    setDeleteDialog({ open: false, type: "", id: "", name: "" });
  };

  const handleApproveEvent = (id: string) => {
    setEvents(events.map(e => e.id === id ? { ...e, status: "approved" } : e));
  };

  const handleRejectEvent = (id: string) => {
    setEvents(events.map(e => e.id === id ? { ...e, status: "rejected" } : e));
  };

  const openDeleteDialog = (type: string, id: string, name: string) => {
    setDeleteDialog({ open: true, type, id, name });
  };

  const confirmDelete = () => {
    switch (deleteDialog.type) {
      case "post":
        handleDeletePost(deleteDialog.id);
        break;
      case "event":
        handleDeleteEvent(deleteDialog.id);
        break;
      case "account":
        handleDeleteAccount(deleteDialog.id);
        break;
    }
  };

  // Filter function
  const filterItems = (items: any[], searchFields: string[]) => {
    if (!searchTerm) return items;
    return items.filter(item => 
      searchFields.some(field => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], item);
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  };

  const filteredPosts = filterItems(posts, ['user.name', 'user.username', 'content']);
  const filteredEvents = filterItems(events, ['title', 'organizer', 'category']);
  const filteredAccounts = filterItems(accounts, ['name', 'username', 'email']);

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading Admin Panel..." />;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-semibold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage posts, events, and accounts</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Card>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <CardDescription className="text-xs">Total Posts</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-semibold">{stats.totalPosts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <CardDescription className="text-xs">Events</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-semibold">{stats.totalEvents}</div>
                {stats.pendingEvents > 0 && (
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {stats.pendingEvents} pending
                  </Badge>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-2 md:col-span-1">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <CardDescription className="text-xs">Accounts</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-semibold">{stats.totalAccounts}</div>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {stats.students} students
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {stats.organizations} orgs
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              aria-label="Search posts, events, or accounts"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="events">
              Events
              {stats.pendingEvents > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1">
                  {stats.pendingEvents}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-3 mt-4">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No posts found</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.user.avatar} alt={post.user.name} />
                        <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium truncate">{post.user.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {post.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              @{post.user.username} · {post.timestamp}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                            onClick={() => openDeleteDialog("post", post.id, post.user.name)}
                            aria-label={`Delete post by ${post.user.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="mt-2 text-sm">{post.content}</p>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{post.likes} likes</span>
                          <span>{post.comments} comments</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-3 mt-4">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No events found</p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium">{event.title}</h3>
                          <Badge 
                            variant={
                              event.status === "approved" ? "default" :
                              event.status === "pending" ? "secondary" :
                              "destructive"
                            }
                            className="text-xs"
                          >
                            {event.status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {event.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                            {event.status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                            {event.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.organizer} · {event.date}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {event.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {event.attendees} attendees
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {event.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950 h-8 w-8 p-0"
                              onClick={() => handleApproveEvent(event.id)}
                              aria-label={`Approve ${event.title}`}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-orange-600 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950 h-8 w-8 p-0"
                              onClick={() => handleRejectEvent(event.id)}
                              aria-label={`Reject ${event.title}`}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                          onClick={() => openDeleteDialog("event", event.id, event.title)}
                          aria-label={`Delete ${event.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Accounts Tab */}
          <TabsContent value="accounts" className="space-y-3 mt-4">
            {filteredAccounts.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No accounts found</p>
              </div>
            ) : (
              filteredAccounts.map((account) => (
                <Card key={account.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={account.avatar} alt={account.name} />
                        <AvatarFallback>
                          {account.type === "student" ? (
                            <User className="h-5 w-5" />
                          ) : (
                            <Building2 className="h-5 w-5" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium truncate">{account.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {account.type === "student" ? (
                                  <><User className="h-3 w-3 mr-1" /> Student</>
                                ) : (
                                  <><Building2 className="h-3 w-3 mr-1" /> Organization</>
                                )}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">@{account.username}</p>
                            <p className="text-xs text-muted-foreground">{account.email}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                            onClick={() => openDeleteDialog("account", account.id, account.name)}
                            aria-label={`Delete account ${account.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Joined {account.joinDate}</span>
                          <span>{account.posts} posts</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, type: "", id: "", name: "" })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">{deleteDialog.name}</span>?
              {deleteDialog.type === "account" && (
                <span className="block mt-2 text-destructive">
                  This will permanently delete the account and all associated content.
                </span>
              )}
              {deleteDialog.type === "event" && (
                <span className="block mt-2">
                  This will permanently remove the event from the system.
                </span>
              )}
              {deleteDialog.type === "post" && (
                <span className="block mt-2">
                  This will permanently remove the post.
                </span>
              )}
              <span className="block mt-2 font-medium">This action cannot be undone.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
