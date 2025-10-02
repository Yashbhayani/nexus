import { useState, useEffect } from "react";
import StartPage  from "./StartPage";
import HomeFeed  from "../HomeComponent/HomeFeed";
import EventDiscovery from "../EventsComponent/EventDiscovery";
import EventsScreen  from "../EventsComponent/EventsScreen";
import EventDetail  from "../EventsComponent/EventDetail";
import UserProfile from "../UserComponent/UserProfile";
import { BottomNav } from "../Navigation/BottomNav";
import { LeftNav } from "../Navigation/LeftNav";
import { AIAssistant } from "../../Ai/AIAssistant";
import { Button } from "../../UI/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../UI/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from "../../UI/dropdown-menu";
import { Moon, Sun, User, Building2 } from "lucide-react";

const AuthComponent = () => {
const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [currentView, setCurrentView] = useState({
    screen: "home",
    data: undefined as any
  });

  // Initialize authentication and dark mode from localStorage
  useEffect(() => {
    // Check authentication status
    const savedAuth = localStorage.getItem("isAuthenticated");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }

    // Initialize dark mode
    const savedMode = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = savedMode ? savedMode === "true" : prefersDark;
    
    setIsDarkMode(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
    document.documentElement.classList.toggle("dark", newMode);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Map tabs to screens
    const screenMap: { [key: string]: string } = {
      home: "home",
      discover: "discover",
      events: "events",
      profile: "profile"
    };
    
    setCurrentView({ screen: screenMap[tab] || "home", data: undefined });
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
    setCurrentView({ screen: "home", data: undefined });
  };

  const handleNavigate = (screen: string, data?: any) => {
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
      type: "student" as const,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      icon: User
    },
    { 
      id: "org1", 
      name: "Computer Science Society", 
      type: "organization" as const,
      avatar: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=300&h=300&fit=crop",
      icon: Building2
    },
    { 
      id: "org2", 
      name: "AI Research Club", 
      type: "organization" as const,
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
        return <UserProfile onLogout={handleLogout} selectedProfileId={currentView.data?.profileId} onNavigate={handleNavigate} />;
      
      default:
        return <HomeFeed onNavigate={handleNavigate} />;
    }
  };

  // Show start page if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {/* Dark Mode Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0"
            onClick={toggleDarkMode}
            title="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>

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
        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0"
          onClick={toggleDarkMode}
          title="Toggle dark mode"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

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

export default AuthComponent
