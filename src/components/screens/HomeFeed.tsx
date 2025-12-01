import { useState, useEffect, useContext } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PostCard } from "../common/PostCard";
import { EventCard } from "../common/EventCard";
import { Search, Bell, Star } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { SkeletonPostCard, SkeletonBigEventCard } from "../common/SkeletonCard";
import APIContext from "../../Context/apimethods/APIContext";
import * as apiroute from "../../Context/API/ApiRouter";

interface HomeFeedProps {
  onNavigate?: (screen: string, data?: any) => void;
}

export function HomeFeed({ onNavigate }: HomeFeedProps) {
  const context = useContext(APIContext);
  const { GETFunction, POSTFunction } = context;
  const [isLoading, setIsLoading] = useState(true);

  const [posts, setPosts] = useState<any[]>([]);
  const [recommendedEvents, setRecommendedEvents] = useState<any[]>([]);

  const handleLike = (postId: string) => {
    setIsLoading(true);
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
    setIsLoading(false);
  };

  const handleComment = async (postId: string) => {
    const params = { BID: postId };
    let DataComment = await GETFunction(apiroute.comments, params);

    if (DataComment?.success && Array.isArray(DataComment.getcommenst)) {
      const formattedComments = DataComment.getcommenst.map(
        (c: any, index: number) => ({
          id: `c${Date.now()}_${index}`,
          user: {
            name: c.Name,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              c.Name
            )}`,
            username: c.Name.replace(/\s+/g, "").toLowerCase(),
          },
          content: c.comment,
          timestamp: c.TimeAgo,
        })
      );

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                commentsList: formattedComments,
                comments: formattedComments.length,
              }
            : post
        )
      );
    }
  };

  const handleAddComment = async (postId: string, commentText: string) => {
    let body = {
      BID: postId,
      comment: commentText,
    };
    await POSTFunction(body, apiroute.comments);
    handleComment(postId);
  };

  const handleShare = (postId: string) => {};

  const handleUserClick = (
    username: string,
    userType: "student" | "organization"
  ) => {
    // Check if this is the current user or an organization they manage
    const ownProfiles = ["studentgov", "engsociety", "campusrec"]; // Organizations the user manages

    if (userType === "organization") {
      // Navigate to organization profile - map username to organizationId
      const orgIdMapping: Record<string, string> = {
        studentgov: "org1", // Computer Science Club / Student Government
        engsociety: "org2", // Engineering Society
        campusrec: "org3", // Campus Recreation
      };

      const organizationId = orgIdMapping[username] || "org1";
      onNavigate?.("organizationProfile", { organizationId });
    } else {
      // Check if clicking on own profile
      if (username === "alex_j" || username === "alexjohnson") {
        // Navigate to own profile
        onNavigate?.("profile", { profileId: "student" });
      } else {
        // Navigate to other user's profile - map username to userId
        const userIdMapping: Record<string, string> = {
          sarahc_22: "1", // Sarah Chen
          emily_r: "2", // Emily Rodriguez
          marcus_j: "3", // Marcus Johnson
          david_kim: "4", // David Kim
          jess_t: "5", // Jessica Taylor
        };

        const userId = userIdMapping[username] || "1";
        onNavigate?.("otherUserProfile", { userId });
      }
    }
  };

  const handleRSVP = (eventId: string) => {
    setRecommendedEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, isRSVPd: !event.isRSVPd } : event
      )
    );
  };

  const handleBookmark = (eventId: string) => {
    setRecommendedEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? { ...event, isBookmarked: !event.isBookmarked }
          : event
      )
    );
  };

  const handleBigEventClick = (eventId: string) => {
    onNavigate?.("event-detail", { eventId });
  };

  useEffect(() => {
    const fetchData = async () => {
      await GetFeeds();
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const GetFeeds = async () => {
    setIsLoading(true);
    const FeedData = await GETFunction(apiroute.feedurl);

    if (FeedData.success) {
      // ---------- FIXED USERNAME HERE ----------
      if (Array.isArray(FeedData.Blogsfeeds)) {
        setPosts(
          FeedData.Blogsfeeds.map((item: any) => ({
            id: item.ID?.toString(),
            user: {
              name: item.OrganizationName || item.Name,
              avatar: item.UserImage || "https://placehold.co/150",

              // 🔥 ALWAYS RETURNS A VALID USERNAME
              username:
                item.UserName ||
                (item.OrganizationName
                  ? item.OrganizationName.replace(/\s+/g, "").toLowerCase()
                  : item.Name.replace(/\s+/g, "").toLowerCase()),
            },

            content: item.Content || "",
            image: item.ImageURL || item.Image || null,
            timestamp: item.TimeAgo || "Just now",
            likes: Number(item.Likes) || 0,
            comments: Number(item.Comments) || 0,
            isLiked: item.IsLiked,
            commentsList: item.commentsList || [],
          }))
        );
      }

      // -------- EVENT FEEDS ----------
      if (Array.isArray(FeedData.EventFeeds)) {
        setRecommendedEvents(
          FeedData.EventFeeds.map((ev: any) => ({
            id: ev.ID?.toString(),
            title: ev.EventActivityName,
            image: ev.Image || "https://placehold.co/400x300",
            date: ev.EventDate,
            time: ev.StartingTime || "",
            location: ev.Name,
            category: ev.EventTypeName,
            attendees: Number(ev.Attendees) || 0,
            price: ev.Price || "Free",
            isBookmarked: Boolean(ev.IsBookmarked),
            isRSVPd: Boolean(ev.IsRSVPd),
          }))
        );
      }
    }

    setIsLoading(false);
    return true;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-semibold">Campus Feed</h1>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <div className="p-4 space-y-6">
          {isLoading ? (
            <>
              <SkeletonPostCard />
              <SkeletonPostCard />
            </>
          ) : (
            posts
              .slice(0, 2)
              .map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onAddComment={handleAddComment}
                  onShare={handleShare}
                  onUserClick={handleUserClick}
                  onCommentUserClick={handleUserClick}
                />
              ))
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Upcoming for you</h2>
              <Button variant="ghost" size="sm">
                See all
              </Button>
            </div>

            <div className="space-y-3">
              {recommendedEvents.slice(0, 2).map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  variant="feed"
                  onRSVP={handleRSVP}
                  onBookmark={handleBookmark}
                />
              ))}
            </div>
          </div>

          {isLoading ? (
            <>
              <SkeletonPostCard />
              <SkeletonPostCard />
            </>
          ) : (
            posts
              .slice(2)
              .map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onAddComment={handleAddComment}
                  onShare={handleShare}
                  onUserClick={handleUserClick}
                  onCommentUserClick={handleUserClick}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
}
