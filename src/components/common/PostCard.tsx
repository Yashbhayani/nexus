import { Heart, MessageCircle, Share, MoreHorizontal, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Input } from "../ui/input";
import { useState } from "react";

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
    username: string;
  };
  content: string;
  timestamp: string;
}

interface PostCardProps {
  post: {
    id: string;
    user: {
      name: string;
      avatar: string;
      username: string;
    };
    content: string;
    image?: string;
    timestamp: string;
    likes: number;
    comments: number;
    isLiked: boolean;
    commentsList?: Comment[];
  };
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onAddComment?: (postId: string, comment: string) => void;
  onUserClick?: (username: string, userType: 'student' | 'organization') => void;
  onCommentUserClick?: (username: string, userType: 'student' | 'organization') => void;
}

export function PostCard({ post, onLike, onComment, onShare, onAddComment, onUserClick, onCommentUserClick }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && onAddComment) {
      onAddComment(post.id, newComment.trim());
      setNewComment("");
    }
  };

  const handleCommentClick = () => {
    setShowComments(!showComments);
    onComment(post.id);
  };

  // Determine if it's an organization or student based on username/name
  const isOrganization = post.user.name.includes('Society') || 
                         post.user.name.includes('Government') || 
                         post.user.name.includes('Recreation') ||
                         post.user.name.includes('Club') ||
                         post.user.username.includes('society') ||
                         post.user.username.includes('gov') ||
                         post.user.username.includes('rec');

  const handleUserClick = () => {
    if (onUserClick) {
      onUserClick(post.user.username, isOrganization ? 'organization' : 'student');
    }
  };

  return (
    <Card className="mb-4 border-0 shadow-sm">
      <CardContent className="p-4">
        {/* User Header */}
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={handleUserClick}
            className="flex items-center gap-3 hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors group"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.user.avatar} alt={post.user.name} />
              <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="font-medium group-hover:text-primary group-hover:underline transition-all cursor-pointer">{post.user.name}</p>
              <p className="text-sm text-muted-foreground">@{post.user.username} • {post.timestamp}</p>
            </div>
          </button>
          {/* <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button> */}
        </div>

        {/* Content */}
        <p className="mb-3 leading-relaxed">{post.content}</p>

        {/* Image */}
        {post.image && (
          <div className="mb-3 rounded-lg overflow-hidden">
            <ImageWithFallback
              src={post.image}
              alt="Post image"
              className="w-full h-64 object-cover"
              fallbackType="post"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 px-2 gap-2 ${
                post.isLiked ? "text-red-500" : "text-muted-foreground"
              }`}
              onClick={() => onLike(post.id)}
            >
              <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
              <span className="text-sm">{post.likes}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 gap-2 text-muted-foreground"
              onClick={handleCommentClick}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{post.comments}</span>
            </Button>
          </div>

          {/* <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground"
            onClick={() => onShare(post.id)}
          >
            <Share className="h-4 w-4" />
          </Button> */}
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-border">
            {/* Existing Comments */}
            {post.commentsList && post.commentsList.length > 0 ? (
              <div className="space-y-4 mb-4">
                {post.commentsList.map(comment => {
                  // Determine if commenter is an organization
                  const isCommentOrg = comment.user.name.includes('Society') || 
                                      comment.user.name.includes('Government') || 
                                      comment.user.name.includes('Recreation') ||
                                      comment.user.name.includes('Club') ||
                                      comment.user.username.includes('society') ||
                                      comment.user.username.includes('gov') ||
                                      comment.user.username.includes('rec');
                  
                  return (
                    <div key={comment.id} className="flex gap-3">
                      <button
                        onClick={() => onCommentUserClick?.(comment.user.username, isCommentOrg ? 'organization' : 'student')}
                        className="hover:opacity-80 transition-opacity"
                      >
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                          <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="bg-muted/50 rounded-lg px-3 py-2">
                          <button
                            onClick={() => onCommentUserClick?.(comment.user.username, isCommentOrg ? 'organization' : 'student')}
                            className="font-medium text-sm hover:text-primary hover:underline cursor-pointer"
                          >
                            {comment.user.name}
                          </button>
                          <p className="text-sm leading-relaxed mt-1">{comment.content}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 ml-1">{comment.timestamp}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No comments yet. Be the first to comment!</p>
            )}

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              {/* <Avatar className="h-8 w-8 mt-1">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" alt="You" />
                <AvatarFallback>You</AvatarFallback>
              </Avatar> */}
              <div className="flex-1 flex gap-2">
                <Input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
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
  );
}