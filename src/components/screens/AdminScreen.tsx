import { useState, useEffect, useContext } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
  User,
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
import APIContext from "../../Context/apimethods/APIContext";
import * as apiroute from "../../Context/API/ApiRouter";


interface AdminScreenProps {
  onNavigate?: (screen: string, data?: any) => void;
}

export function AdminScreen({ onNavigate }: AdminScreenProps) {
  const context = useContext(APIContext);
  const { GETFunction, DELETEFunction, PATCHFunctionParams } = context;
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: string;
    id: string;
    name: string;
    SourceTable?: string | null;
  }>({
    open: false,
    type: "",
    id: "",
    name: "",
    SourceTable: "",
  });
  const [stats, setStats] = useState<any>({
    totalPosts: 0,
    totalEvents: 0,
    pendingEvents: 0,
    totalAccounts: 0,
    students: 0,
    organizations: 0,
  });
  const [posts, setPosts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    // Simulate loading delay
    const fetchData = async () => {
      await AdminData();
      await PostData();
      await EventData();
      await UserandOrgData();
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const AdminData = async () => {
    setIsLoading(true);
    const admincardData = await GETFunction(apiroute.adminpanel);
    setStats(admincardData.TotalData);
    setIsLoading(false);
    return true;
  };

  const PostData = async () => {
    setIsLoading(true);
    const blogData = await GETFunction(apiroute.adminblogurl);
    if (blogData.success) {
      setPosts(blogData.userBlogs);
    }
    setIsLoading(false);
    return true;
  };

  const EventData = async () => {
    setIsLoading(true);
    const eventData = await GETFunction(apiroute.adminevent);
    if (eventData.success) {
      setEvents(eventData.eventActivities);
    }
    setIsLoading(false);
    return true;
  };

  const UserandOrgData = async () => {
    setIsLoading(true);
    const userOrgData = await GETFunction(apiroute.getuserorg);
    if (userOrgData.success) {
      setAccounts(userOrgData.userandorg);
    }
    setIsLoading(false);
    return true;
  };

  // Delete handlers
  const handleDeletePost = async (id: string) => {
    setIsLoading(true);
    const params = {
      ID: id,
    };
    const DELETEPostData = await DELETEFunction(apiroute.posturl, params);
    setIsLoading(false);
    await PostData();
    return true;
  };

  const handleDeleteEvent = async (id: string) => {
    setIsLoading(true);
    const params = {
      ID: id,
    };
    const DELETEPostData = await DELETEFunction(apiroute.deleteevent, params);
    setIsLoading(false);
    await EventData();
    return true;
  };

  const handleDeleteAccount = async (
    id: string,
    SourceTable: string | null = null
  ) => {
    setIsLoading(true);
    console.log(id, SourceTable);
    const params = {
      ID: id,
      SourceType: SourceTable,
    };
    const DELETEAccountData = await DELETEFunction(
      apiroute.deleteaccount,
      params
    );
    setIsLoading(false);
    await UserandOrgData();
    return true;
  };

  const handleApproveEvent = async (id: string) => {
    setIsLoading(true);
    const params = {
      ID: id,
    };
    const ApproveEventData = await PATCHFunctionParams(
      apiroute.approveeventurl,
      params
    );
    setIsLoading(false);
    await EventData();
    return true;
  };

  const handleRejectEvent = async (id: string) => {
    setIsLoading(true);
    const params = {
      ID: id,
    };
    const RejectedEventData = await PATCHFunctionParams(
      apiroute.rejecteventurl,
      params
    );
    setIsLoading(false);
    await EventData();
    return true;
  };

  const openDeleteDialog = (
    type: string,
    id: string,
    name: string,
    SourceTable: string | null = null
  ) => {
    console.log(type, id, name, SourceTable);
    setDeleteDialog({
      open: true,
      type,
      id,
      name,
      SourceTable: SourceTable || undefined,
    });
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
        handleDeleteAccount(deleteDialog.id, deleteDialog.SourceTable);
        break;
    }
  };

  // Filter function
  const filterItems = (items: any[], searchFields: string[]) => {
    if (!searchTerm) return items;
    return items.filter((item) =>
      searchFields.some((field) => {
        const value = field.split(".").reduce((obj, key) => obj?.[key], item);
        return value
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    );
  };

  const filteredPosts = filterItems(posts, ["Name", "UserName", "PostTitle"]);

  const filteredEvents = filterItems(events, [
    "EventActivityName",
    "OrganizationName",
    "EventType",
  ]);
  const filteredAccounts = filterItems(accounts, ["Name", "UserName", "Email"]);

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
              <p className="text-sm text-muted-foreground">
                Manage posts, events, and accounts
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Card>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-2">
                  <FileText
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <CardDescription className="text-xs">
                    Total Posts
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-semibold">
                  {stats?.totalPosts}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-2">
                  <Calendar
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <CardDescription className="text-xs">Events</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-semibold">
                  {stats.totalEvents}
                </div>
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
                  <Users
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <CardDescription className="text-xs">
                    Accounts
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-semibold">
                  {stats.totalAccounts}
                </div>
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
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
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
                <Card key={post.BlogID ?? post.ID ?? post.UserName}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.Image} alt={post.Name} />
                        <AvatarFallback>{post.Name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium truncate">
                                {post.Name}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {post.RecordType}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              @{post.UserName} · {post.TimeAgo}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                            onClick={() =>
                              openDeleteDialog(
                                "post",
                                post.BlogID,
                                post.SourceTable
                              )
                            }
                            aria-label={`Delete post by ${post.Name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="mt-2 text-sm">{post.PostTitle}</p>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{post.TotalLIke} likes</span>
                          <span>{post.TotalComments} comments</span>
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
                <Card
                  key={event.ID ?? event.EventID ?? event.EventActivityName}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium">
                            {event.EventActivityName}
                          </h3>
                          <Badge
                            variant={
                              event.Status === "Approved"
                                ? "default"
                                : event.Status === "Pending"
                                ? "secondary"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            {event.status === "Approved" && (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            )}
                            {event.status === "Pending" && (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {event.status === "Rejected" && (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {event.Status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.OrganizationName} · {event.EventDate}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {event.EventType}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {event.Capacity} Capacity
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {event.Status === "Pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950 h-8 w-8 p-0"
                              onClick={() => handleApproveEvent(event.ID)}
                              aria-label={`Approve ${event.EventActivityName}`}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-orange-600 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950 h-8 w-8 p-0"
                              onClick={() => handleRejectEvent(event.ID)}
                              aria-label={`Reject ${event.EventActivityName}`}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                          onClick={() =>
                            openDeleteDialog(
                              "event",
                              event.ID,
                              event.EventActivityName
                            )
                          }
                          aria-label={`Delete ${event.EventActivityName}`}
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
                <Card key={account.ID ?? account.UserName ?? account.Email}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={
                            account.image
                              ? account.image
                              : "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop"
                          }
                          alt={account.Name}
                        />
                        <AvatarFallback>
                          {account.SourceTable === "Student" ? (
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
                              <span className="font-medium truncate">
                                {account.Name}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {account.SourceTable === "Student" ? (
                                  <>
                                    <User className="h-3 w-3 mr-1" /> Student
                                  </>
                                ) : (
                                  <>
                                    <Building2 className="h-3 w-3 mr-1" />{" "}
                                    Organization
                                  </>
                                )}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              @{account.UserName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {account.Email}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                            onClick={() =>
                              openDeleteDialog(
                                "account",
                                account.ID,
                                account.Name,
                                account.SourceTable
                              )
                            }
                            aria-label={`Delete account ${account.Name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Joined {account.CreatedByDate}</span>
                          <span>{account.TotalPost} posts</span>
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
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          !open && setDeleteDialog({ open: false, type: "", id: "", name: "" })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {deleteDialog.name}
              </span>
              ?
              {deleteDialog.type === "account" && (
                <span className="block mt-2 text-destructive">
                  This will permanently delete the account and all associated
                  content.
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
              <span className="block mt-2 font-medium">
                This action cannot be undone.
              </span>
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
