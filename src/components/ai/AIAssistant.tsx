import { useState, useEffect, useRef, useContext } from "react";
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

// Import API Context
import APIContext from "../../Context/apimethods/APIContext";
import * as apiroute from "../../Context/API/ApiRouter";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: string;
  suggestions?: string[];
}

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

interface AIAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  userId?: number | null; // Pass logged-in user's ID
}

// Add chat route to ApiRouter.jsx: export const chaturl = "chat/";
const CHAT_URL = "chat/";

const INITIAL_GREETING: Message = {
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
};

export function AIAssistant({ isOpen, onToggle, userId = null }: AIAssistantProps) {
  // Use API Context
  const { POSTFunction } = useContext(APIContext);

  const [messages, setMessages] = useState<Message[]>([INITIAL_GREETING]);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string | null>(null);

  // Reset chat on every login - generates a new session each time
  useEffect(() => {
    if (userId !== null && userId !== undefined) {
      // Generate a new session ID for this login
      const newSessionId = `${userId}_${Date.now()}`;
      
      // Only reset if this is a new session
      if (sessionIdRef.current !== newSessionId) {
        // User logged in - reset everything for fresh start
        setMessages([INITIAL_GREETING]);
        setConversationHistory([]);
        setInputMessage("");
        localStorage.removeItem("campus_ai_chat_history");
        sessionIdRef.current = newSessionId;
      }
    } else if (userId === null || userId === undefined) {
      // User logged out - reset everything
      setMessages([INITIAL_GREETING]);
      setConversationHistory([]);
      setInputMessage("");
      localStorage.removeItem("campus_ai_chat_history");
      sessionIdRef.current = null;
    }
  }, [userId]);

  // Auto-scroll to bottom when new messages arrive or when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [isOpen, messages]);

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

    try {
      // Call the API using POSTFunction from context
      const data = await POSTFunction(
        {
          message: messageText,
          conversationHistory: conversationHistory,
          userId: userId
        },
        CHAT_URL
      );

      if (data.error) {
        throw new Error(data.error);
      }

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply,
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: data.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Update conversation history for context
      setConversationHistory(data.conversationHistory || [
        ...conversationHistory,
        { role: 'user', content: messageText },
        { role: 'assistant', content: data.reply }
      ]);

    } catch (error) {
      console.error('Chat error:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ["Try again"]
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
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
        aria-label="Open AI Assistant chat"
      >
        <Bot className="h-6 w-6" aria-hidden="true" />
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
      <Card 
        className="fixed bottom-6 right-6 w-80 h-96 shadow-2xl z-50 lg:bottom-8 lg:right-8 lg:w-96 lg:h-[500px]"
        role="dialog"
        aria-label="AI Assistant chat"
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center" aria-hidden="true">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-sm">Campus Assistant</CardTitle>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="h-2 w-2 bg-green-500 rounded-full" aria-hidden="true" />
                  <span aria-label="Status: Online">Online</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-8 w-8 p-0"
              aria-label="Close AI Assistant"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex flex-col overflow-hidden" style={{ height: 'calc(100% - 70px)' }}>
          {/* Messages */}
          <ScrollArea className="flex-1 px-4 overflow-y-auto" role="log" aria-live="polite" aria-label="Chat messages">
            <div className="space-y-4 pb-4 pt-4">
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
              
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
              <Input
                placeholder="Ask about campus resources..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                aria-label="Type your message"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!inputMessage.trim() || isTyping}
                className="h-10 w-10 p-0"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </>
  );
}