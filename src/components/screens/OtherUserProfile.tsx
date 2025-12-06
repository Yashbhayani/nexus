import { useState, useEffect, useContext } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";

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
  Send,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import * as apiroute from "../../Context/API/ApiRouter";
import APIContext from "../../Context/apimethods/APIContext";

interface OtherUserProfileProps {
  userId: number;
  onNavigate?: (screen: string, data?: any) => void;
  onBack?: () => void;
}

export function OtherUserProfile({
  userId,
  onNavigate,
  onBack,
}: OtherUserProfileProps) {
  const context = useContext(APIContext);
  const { GETFunction, POSTFunction } = context;

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(234);
  const [othuserinfo, setOtheruserinfo] = useState<any>(null);
  const [useraboutinfo, setUseraboutinfo] = useState<any>(null);
  const [userposts, setUserposts] = useState<any>(null);
  const [userorg, setUserorg] = useState<any>(null);
  const [showComments, setShowComments] = useState(false);
  const [openCommentsPostId, setOpenCommentsPostId] = useState<number | null>(
    null
  );
  const [commentsList, setCommentsList] = useState<any>(null);
  const [newComment, setNewComment] = useState("");
  // Simulate loading
  useEffect(() => {
    console.log("Navigate to student:", userId);
    const fetchData = async () => {
      await otheruserinfo();
      setIsLoading(false);
    };
    fetchData();
  }, [userId]);

  const otheruserinfo = async () => {
    const parms = {
      AUID: userId,
    };

    const Data = await GETFunction(apiroute.otheruserinfo, parms);
    console.log("Other User Info Data:", Data);
    if (Data.success) {
      setOtheruserinfo(Data.userinfo[0]);
      setUseraboutinfo(Data.useraboutinfo[0]);
      setUserposts(Data.userposts);
      setUserorg(Data.userorg);
      setFollowerCount(othuserinfo?.Followers);
    }
  };
  const onLike = async (postId: number) => {
    const params = { BID: postId };
    const DataLike = await GETFunction(apiroute.like, params);

    if (DataLike.success) {
      setUserposts((prevPosts: any) =>
        prevPosts.map((post: any) =>
          post.ID === postId
            ? {
                ...post,
                IsLiked: !post.IsLiked,
                Likes: post.IsLiked ? post.Likes - 1 : post.Likes + 1,
              }
            : post
        )
      );
    }
  };

  const handleFollowToggle = async () => {
    setIsFollowing(!isFollowing);

    const params = { UserID: userId };
    const DataFollow = await GETFunction(apiroute.followuser, params);
    if (DataFollow.success) {
      // Update follower count
      if (DataFollow.IsFollowing) {
        setFollowerCount(followerCount + 1);
      } else {
        followerCount - 1 === 0
          ? setFollowerCount(0)
          : setFollowerCount(Math.max(0, followerCount - 1));
      }
    }
  };

  const handleCommentClick = async (postId: number) => {
    // If clicking the same post → toggle close/open
    if (openCommentsPostId === postId) {
      setShowComments(!showComments);
      return;
    }

    // Otherwise open comments for new post
    setOpenCommentsPostId(postId);
    setShowComments(true);
    const params = { BID: postId };
    const DataComment = await GETFunction(apiroute.comments, params);

    if (DataComment?.success) {
      setCommentsList(DataComment.getcommenst);
    } else {
      setCommentsList([]);
    }
  };

  const handleAddComment = async (postId: number) => {
    if (!newComment.trim()) return;

    let body = {
      BID: postId,
      comment: newComment,
    };

    const response = await POSTFunction(body, apiroute.comments);

    if (response.success) {
      setNewComment(""); // clear input after posting

      // fetch new comment list WITHOUT closing comment box
      const params = { BID: postId };
      const DataComment = await GETFunction(apiroute.comments, params);

      if (DataComment?.success && Array.isArray(DataComment.getcommenst)) {
        setCommentsList(DataComment.getcommenst);
      }
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
              <h1 className="font-semibold">{othuserinfo?.Name}</h1>
              <p className="text-sm text-muted-foreground">
                {othuserinfo?.Majors}
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
                    src={
                      othuserinfo?.Image
                        ? othuserinfo?.Image
                        : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                    }
                    alt={othuserinfo?.Name}
                  />
                  <AvatarFallback className="text-3xl">
                    {othuserinfo?.Name.split(" ")
                      .map((n: any) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                  <h2 className="text-2xl">{othuserinfo?.Name}</h2>
                  <p className="text-muted-foreground">
                    {othuserinfo?.StudentType} • {othuserinfo?.Majors}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex gap-8 pt-2">
                  <div className="text-center">
                    <div className="text-2xl text-primary">
                      {othuserinfo?.Organizations}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Organizations
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl text-primary">
                      {othuserinfo?.EventsAttended}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Events Attended
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl text-primary">
                      {followerCount === undefined || followerCount === null
                        ? othuserinfo?.Followers
                        : followerCount}
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
                  {othuserinfo?.IsFollowing ? (
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
              <TabsTrigger value="organizations">Organizations</TabsTrigger>
            </TabsList>

            {/* About Tab */}
            <TabsContent value="about" className="space-y-4 mt-4">
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
                    {useraboutinfo.bio
                      ? useraboutinfo.bio
                      : "This user is a mystery."}
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
                        {othuserinfo?.StudentType}
                      </div>
                      <div className="text-xs">Academic Level</div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-foreground">
                        {othuserinfo?.Majors}
                      </div>
                      <div className="text-xs">Major</div>
                    </div>
                  </div>
                  {/* {otherUserProfile.minor && (
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
                  <Separator /> */}
                  {/* <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-foreground">
                        {otherUserProfile.graduationYear}
                      </div>
                      <div className="text-xs">
                        Expected Graduation
                      </div>
                    </div>
                  </div> */}
                </CardContent>
              </Card>

              {/* Skills */}
              {useraboutinfo.skills && useraboutinfo.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {useraboutinfo?.skills.map((skill: any, index: any) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Interests */}
              {useraboutinfo.interest && useraboutinfo.interest.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Interests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {useraboutinfo.interest.map(
                        (interest: any, index: any) => (
                          <Badge key={index} variant="outline">
                            {interest}
                          </Badge>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Posts Tab */}
            <TabsContent value="posts" className="space-y-4 mt-4">
              {userposts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No posts yet</p>
                  </CardContent>
                </Card>
              ) : (
                userposts.map((post: any) => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardContent className="p-4 space-y-3">
                      {/* Post Header */}
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={
                              othuserinfo?.Image
                                ? othuserinfo?.Image
                                : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                            }
                            alt={othuserinfo.Name}
                          />
                          <AvatarFallback>{othuserinfo.Name}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{post.Name}</p>
                            <Badge variant="secondary" className="text-xs">
                              {post.CategoryName}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <span>{post.UserName}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{post.TimeAgo}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      <h4 className="text-sm">{post.PostTitle}</h4>

                      {/* Post Image */}
                      {post.Image ? (
                        <div className="rounded-lg overflow-hidden">
                          <ImageWithFallback
                            src={post.Image}
                            alt="Post image"
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      ) : (
                        <></>
                      )}

                      {/* Post Content */}
                      <p className="text-sm">{post.Content}</p>

                      {/* Post Actions */}
                      <div className="flex items-center gap-6 pt-2">
                        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                          <Heart
                            className={`h-4 w-4 ${
                              post.IsLiked ? "fill-current" : ""
                            }`}
                            onClick={() => onLike(post.ID)}
                          />{" "}
                          <span>{post.Likes}</span>
                        </button>
                        <button
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => handleCommentClick(post.ID)}
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.Comments}</span>
                        </button>
                        {/* <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors ml-auto">
                          <Share2 className="h-4 w-4" />
                        </button> */}
                      </div>
                      {showComments && openCommentsPostId === post.ID && (
                        <div className="mt-4 pt-4 border-t border-border">
                          {/* Existing Comments */}
                          {commentsList && commentsList.length > 0 ? (
                            <div className="space-y-4 mb-4">
                              {commentsList.map((comment: any) => {
                                // Determine if commenter is an organization

                                return (
                                  <div
                                    key={comment.CommentID}
                                    className="flex gap-3"
                                  >
                                    <button
                                      //  onClick={() => onCommentUserClick?.(comment.userID, isCommentOrg ? 'organization' : 'student')}
                                      className="hover:opacity-80 transition-opacity"
                                    >
                                      <Avatar className="h-8 w-8 mt-1">
                                        <AvatarImage
                                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                            comment.Name
                                          )}`}
                                          alt={comment.Name}
                                        />
                                        <AvatarFallback>
                                          {comment.Name.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                    </button>
                                    <div className="flex-1 min-w-0">
                                      <div className="bg-muted/50 rounded-lg px-3 py-2">
                                        <button
                                          //  onClick={() => onCommentUserClick?.(comment.user.username, isCommentOrg ? 'organization' : 'student')}
                                          className="font-medium text-sm hover:text-primary hover:underline cursor-pointer"
                                        >
                                          {comment.Name}
                                        </button>
                                        <p className="text-sm leading-relaxed mt-1">
                                          {comment.comment}
                                        </p>
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-1 ml-1">
                                        {comment.TimeAgo}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No comments yet. Be the first to comment!
                            </p>
                          )}

                          {/* Add Comment Form */}
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleAddComment(post.ID);
                            }}
                            className="flex gap-2"
                          >
                            <Avatar className="h-8 w-8 mt-1">
                              <AvatarImage
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
                                alt="You"
                              />
                              <AvatarFallback>You</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex gap-2">
                              <Input
                                type="text"
                                value={newComment}
                                onChange={(e: any) =>
                                  setNewComment(e.target.value)
                                }
                                placeholder="Write a comment..."
                                className="flex-1"
                              />
                              <Button
                                type="submit"
                                size="sm"
                                disabled={!newComment.trim()}
                                className="h-10"
                                aria-label="Post comment"
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </form>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Organizations Tab */}
            <TabsContent value="organizations" className="space-y-4 mt-4">
              {userorg?.length === 0 ? (
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
                  {userorg?.map((org: any) => (
                    <Card
                      key={org.orgID}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() =>
                        onNavigate?.("organizationProfile", {
                          orgName: org.OrganizationName,
                        })
                      }
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage
                              src={
                                org.image
                                  ? org.image
                                  : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                              }
                              alt={org.OrganizationName}
                            />
                            <AvatarFallback>
                              {org.OrganizationName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">
                              {org.OrganizationName}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {org.OrganizationType}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {org.UserRole}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
