import "./styles/globals.css";
import { useState, useEffect } from "react";
import { StartPage } from "./components/screens/StartPage";
import { HomeFeed } from "./components/screens/HomeFeed";
import { EventDiscovery } from "./components/screens/EventDiscovery";
import { EventsScreen } from "./components/screens/EventsScreen";
import { EventDetail } from "./components/screens/EventDetail";
import { UserProfile } from "./components/screens/UserProfile";
import { BottomNav } from "./components/navigation/BottomNav";
import { LeftNav } from "./components/navigation/LeftNav";
import { AIAssistant } from "./components/ai/AIAssistant";
import { Button } from "./components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from "./components/ui/dropdown-menu";
import { User, Building2, LogOut } from "lucide-react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [currentView, setCurrentView] = useState({ screen: "home" });

  // Initialize authentication and detect system theme preference
  useEffect(() => {
    // Check authentication status
    const savedAuth = localStorage.getItem("isAuthenticated");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }

    // Detect system theme preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      setIsDarkMode(e.matches);
      document.documentElement.classList.toggle("dark", e.matches);
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Map tabs to screens
    const screenMap = {
      home: "home",
      discover: "discover",
      events: "events",
      profile: "profile"
    };
    
    setCurrentView({ screen: screenMap[tab] || "home" });
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    // Reset app state when logging out
    setActiveTab("home");
    setCurrentView({ screen: "home" });
  };

  const handleNavigate = (screen, data) => {
    setCurrentView({ screen, data });
  };

  // Mock user data - in production this would come from your auth system
  const currentUser = {
    name: "Alex Johnson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    initials: "AJ"
  };

  // Mock list of profiles the user can access (student + organizations they manage)
  const availableProfiles = [
    { 
      id: "student", 
      name: "My Profile (Student)", 
      type: "student",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      icon: User
    },
    { 
      id: "org1", 
      name: "Computer Science Society", 
      type: "organization",
      avatar: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=300&h=300&fit=crop",
      icon: Building2
    },
    { 
      id: "org2", 
      name: "AI Research Club", 
      type: "organization",
      avatar: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=300&fit=crop",
      icon: Building2
    }
  ];

  const renderCurrentScreen = () => {
    // Render screens based on current view
    switch (currentView.screen) {
      case "home":
        return <HomeFeed onNavigate={handleNavigate} />;
      
      case "discover":
        return <EventDiscovery />;
      
      case "events":
        return <EventsScreen />;
      
      case "event-detail":
        return (
          <EventDetail 
            eventId={currentView.data?.eventId || "1"}
            onBack={() => handleNavigate("home")}
          />
        );
      
      case "profile":
        return <UserProfile selectedProfileId={currentView.data?.profileId} onNavigate={handleNavigate} />;
      
      default:
        return <HomeFeed onNavigate={handleNavigate} />;
    }
  };

  // Show start page if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <StartPage onLogin={handleLogin} />
      </div>
    );
  }

  // Show main app if authenticated
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Left Navigation - Desktop only */}
      <LeftNav 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
      />

      {/* Top Right Controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        {/* Profile Picture with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all focus:outline-none focus:ring-primary/60"
              title="Switch Profile"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.initials}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Switch Profile</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableProfiles.map((profile) => {
              const Icon = profile.icon;
              return (
                <DropdownMenuItem
                  key={profile.id}
                  onClick={() => handleNavigate("profile", { profileId: profile.id })}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 w-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile.avatar} alt={profile.name} />
                      <AvatarFallback>
                        <Icon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{profile.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{profile.type}</div>
                    </div>
                  </div>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <div className="flex items-center gap-3 w-full">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {renderCurrentScreen()}
      </div>

      {/* Bottom Navigation - Mobile only, hide in event detail */}
      {currentView.screen !== "event-detail" && (
        <div className="lg:hidden">
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      )}

      {/* AI Assistant */}
      <AIAssistant 
        isOpen={isAIAssistantOpen} 
        onToggle={() => setIsAIAssistantOpen(!isAIAssistantOpen)} 
      />
    </div>
  );
}

export default App;

//--legacy-peer-deps