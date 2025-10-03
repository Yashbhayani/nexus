import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Sparkles,
  Calendar,
  MapPin,
  Clock
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: string;
  suggestions?: string[];
}

interface AIAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AIAssistant({ isOpen, onToggle }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! I'm your campus AI assistant. I can help you find events, get information about organizations, check dining hours, and answer questions about campus resources. How can I help you today?",
      sender: "assistant",
      timestamp: "now",
      suggestions: [
        "What events are happening this week?",
        "Show me study spaces",
        "Dining hall hours",
        "Join student organizations"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputMessage.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateAIResponse(messageText);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    let content = "";
    let suggestions: string[] = [];

    if (lowerMessage.includes("event") || lowerMessage.includes("happening")) {
      content = "🎉 Here are some upcoming campus events:\n\n• Study Group for Finals - Dec 18, 6:00 PM at Library\n• Basketball Tournament - Jan 20, 3:00 PM at Rec Center\n• Winter Art Showcase - Feb 5, 7:00 PM at Student Union\n\nWould you like me to help you RSVP to any of these?";
      suggestions = ["RSVP to study group", "More sports events", "Art events this month"];
    } else if (lowerMessage.includes("dining") || lowerMessage.includes("food") || lowerMessage.includes("eat")) {
      content = "🍽️ Campus Dining Information:\n\n• Main Dining Hall: 7:00 AM - 9:00 PM\n• Student Union Food Court: 10:00 AM - 8:00 PM\n• Coffee Shop (Library): 6:00 AM - 11:00 PM\n• Late Night Snacks: 9:00 PM - 2:00 AM\n\nDuring finals week, most locations have extended hours!";
      suggestions = ["Menu for today", "Dietary restrictions", "Food truck schedule"];
    } else if (lowerMessage.includes("study") || lowerMessage.includes("library")) {
      content = "📚 Study Spaces & Library Info:\n\n• Main Library: Open 24/7 during finals week\n• Study Rooms: Book online or walk-in\n• Quiet Floor: 3rd floor, no talking\n• Group Study: 1st floor collaborative spaces\n• Computer Lab: 2nd floor, 50+ workstations\n\nNeed help booking a study room?";
      suggestions = ["Book study room", "Library events", "Computer availability"];
    } else if (lowerMessage.includes("organization") || lowerMessage.includes("club") || lowerMessage.includes("join")) {
      content = "🏛️ Student Organizations:\n\n• Computer Science Society - Tech talks & hackathons\n• Student Government - Campus leadership\n• Engineering Society - Professional development\n• Campus Recreation - Sports & fitness\n• Cultural Organizations - International community\n\nWhich type of organization interests you most?";
      suggestions = ["Academic clubs", "Sports teams", "Cultural groups"];
    } else if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
      content = "🤝 Campus Support Resources:\n\n• Academic Advising: Schedule online\n• Counseling Services: 24/7 crisis line\n• Career Center: Resume help & job search\n• IT Support: Tech troubleshooting\n• Campus Safety: Emergency & escort services\n\nWhat type of support are you looking for?";
      suggestions = ["Academic help", "Mental health", "Career services"];
    } else {
      content = "I'd be happy to help! I can assist you with:\n\n🎯 Finding campus events and activities\n📍 Locating buildings and services\n🍕 Dining information and hours\n📚 Study spaces and library resources\n🏛️ Student organizations and clubs\n💬 General campus information\n\nWhat would you like to know more about?";
      suggestions = ["Campus events", "Dining hours", "Study spaces", "Student organizations"];
    }

    return {
      id: Date.now().toString(),
      content,
      sender: "assistant",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-20 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 lg:bottom-8 lg:right-8"
        size="lg"
        title="Open AI Assistant"
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        onClick={onToggle}
      />
      
      {/* Chat Window */}
      <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-2xl z-50 lg:bottom-8 lg:right-8 lg:w-96 lg:h-[500px]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-sm">Campus Assistant</CardTitle>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <span>Online</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex flex-col h-full">
          {/* Messages */}
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <div
                    className={`flex gap-2 ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.sender === "assistant" && (
                      <Avatar className="h-6 w-6 mt-1">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          <Bot className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div
                      className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                    </div>

                    {message.sender === "user" && (
                      <Avatar className="h-6 w-6 mt-1">
                        <AvatarFallback className="text-xs">
                          <User className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>

                  {/* Suggestions */}
                  {message.suggestions && message.sender === "assistant" && (
                    <div className="flex flex-wrap gap-1 ml-8">
                      {message.suggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
                          onClick={() => handleSendMessage(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <Avatar className="h-6 w-6 mt-1">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      <Bot className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3 animate-pulse" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about campus resources..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isTyping}
                className="h-10 w-10 p-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}