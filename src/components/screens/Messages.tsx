import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { 
  ArrowLeft, 
  Search, 
  MoreHorizontal, 
  Send, 
  Smile, 
  Paperclip,
  Phone,
  Video 
} from "lucide-react";

interface MessagesProps {
  currentView?: "list" | "chat";
  selectedChatId?: string;
  onNavigate?: (view: "list" | "chat", chatId?: string) => void;
}

export function Messages({ 
  currentView = "list", 
  selectedChatId,
  onNavigate = () => {}
}: MessagesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [messageText, setMessageText] = useState("");

  const conversations = [
    {
      id: "1",
      name: "Campus Safety",
      avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=face",
      lastMessage: "🚨 Weather Alert: Campus closed tomorrow due to snow conditions",
      timestamp: "2m",
      unread: 1,
      online: true,
      isGroup: true
    },
    {
      id: "2",
      name: "Student Government",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      lastMessage: "📢 Library extended hours start Monday for finals week",
      timestamp: "1h",
      unread: 0,
      online: false,
      isGroup: true
    },
    {
      id: "3",
      name: "Dining Services",
      avatar: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=150&h=150&fit=crop&crop=face",
      lastMessage: "🍕 New pizza station opening in the Student Union next week!",
      timestamp: "3h",
      unread: 0,
      online: true,
      isGroup: true
    },
    {
      id: "4",
      name: "IT Services",
      avatar: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=150&h=150&fit=crop&crop=face",
      lastMessage: "⚙️ WiFi maintenance scheduled for this weekend 2-4 AM",
      timestamp: "1d",
      unread: 0,
      online: false,
      isGroup: true
    }
  ];

  const chatMessages = [
    {
      id: "1",
      senderId: "alex",
      senderName: "Alex Rivera",
      content: "Hey! Are you going to the jazz festival this weekend?",
      timestamp: "2:30 PM",
      isOwn: false
    },
    {
      id: "2",
      senderId: "me",
      senderName: "You",
      content: "Yes! I just RSVP'd. Are you going too?",
      timestamp: "2:32 PM",
      isOwn: true
    },
    {
      id: "3",
      senderId: "alex",
      senderName: "Alex Rivera",
      content: "Definitely! I love jazz music. Maybe we can meet up there?",
      timestamp: "2:33 PM",
      isOwn: false
    },
    {
      id: "4",
      senderId: "me",
      senderName: "You",
      content: "That sounds great! Let's plan to meet at the main entrance around 7 PM",
      timestamp: "2:35 PM",
      isOwn: true
    },
    {
      id: "5",
      senderId: "alex",
      senderName: "Alex Rivera",
      content: "Perfect! See you there 🎵",
      timestamp: "2:36 PM",
      isOwn: false
    }
  ];

  const selectedChat = conversations.find(conv => conv.id === selectedChatId) || conversations[0];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageText.trim()) {
      console.log("Send message:", messageText);
      setMessageText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (currentView === "chat") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Chat Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onNavigate("list")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src={selectedChat.avatar} alt={selectedChat.name} />
                <AvatarFallback>{selectedChat.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedChat.name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedChat.online ? "Online" : "Last seen 1h ago"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[75%] ${message.isOwn ? "order-2" : "order-1"}`}>
                {!message.isOwn && (
                  <Avatar className="h-6 w-6 mb-1">
                    <AvatarImage src={selectedChat.avatar} alt={selectedChat.name} />
                    <AvatarFallback>{selectedChat.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    message.isOwn
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p>{message.content}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 px-2">
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="border-t border-border p-4">
          <div className="flex items-end gap-2">
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
              <Paperclip className="h-5 w-5" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              size="sm" 
              className="h-10 w-10 p-0"
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Campus Announcements</h1>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="max-w-md mx-auto">
        {filteredConversations.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => onNavigate("chat", conversation.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.avatar} alt={conversation.name} />
                      <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{conversation.name}</p>
                        {conversation.isGroup && (
                          <Badge variant="secondary" className="text-xs">Group</Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate pr-2">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread > 0 && (
                        <Badge variant="default" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">No announcements found</h3>
            <p className="text-sm text-muted-foreground">
              Try a different search term
            </p>
          </div>
        )}
      </div>
    </div>
  );
}