import "./styles/globals.css";
import React, { useState, useEffect, useContext } from "react";
import { StartPage } from "./components/screens/StartPage";
import { ForgotPassword } from "./components/screens/ForgotPassword";
import { ResetPassword } from "./components/screens/ResetPassword";
import { HomeFeed } from "./components/screens/HomeFeed";
import { EventDiscovery } from "./components/screens/EventDiscovery";
import { EventsScreen } from "./components/screens/EventsScreen";
import { EventDetail } from "./components/screens/EventDetail";
import { UserProfile } from "./components/screens/UserProfile";
import { OtherUserProfile } from "./components/screens/OtherUserProfile";
import { OrganizationProfile } from "./components/screens/OrganizationProfile";
import { AdminScreen } from "./components/screens/AdminScreen";
import { BottomNav } from "./components/navigation/BottomNav";
import { LeftNav } from "./components/navigation/LeftNav";
import { AIAssistant } from "./components/ai/AIAssistant";
import { AboutDialog } from "./components/common/AboutDialog";
import { Button } from "./components/ui/button";
import * as apiroute from "./Context/API/ApiRouter";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "./components/ui/dropdown-menu";
import { User, Building2, LogOut, Info, Shield } from "lucide-react";
import { APIState } from "./Context/apimethods/APIState";
import APIContext from "./Context/apimethods/APIContext";

const iconMap: any = {
  User: User,
  Building2: Building2,
};

export default function App() {
  const context = useContext(APIContext);
  const { GETFunction } = context;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [currentView, setCurrentView] = useState<{
    screen: string;
    data?: Record<string, any>;
  }>({
    screen: "home",
    data: undefined,
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [availableProfiles, setAvailableProfiles] = useState<any[]>([]);
  const [currentProfile, setCurrentProfile] = useState<any>(null);

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("auth-token")
  );

  // RUN ONLY ONCE

  // ----------------------- THEME EFFECT -----------------------
  useEffect(() => {
    document.documentElement.lang = "en";

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const prefersDark = mediaQuery.matches;

    setIsDarkMode(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);

    const handleChange = (e: any) => {
      setIsDarkMode(e.matches);
      document.documentElement.classList.toggle("dark", e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Auth effect (runs after login + refresh)
  useEffect(() => {
    const authenticate = async () => {
      if (!token) return;

      const isAdminUser = await verifyuserisAdmin();
      setIsAdmin(isAdminUser);
      setIsAuthenticated(true);

      await AvaliProfiles();
    };

    authenticate();
  }, [token]);

  // ✔ Verify user type
  // ----------------------- VERIFY ADMIN -----------------------
  const verifyuserisAdmin = async () => {
    const result = await GETFunction(apiroute.verifyusertype);
    return result?.status; // MUST return boolean
  };

  // ----------------------- LOAD PROFILES -----------------------
  const AvaliProfiles = async () => {
    try {
      const response = await GETFunction(apiroute.userlogdata);
      const profiles = response?.userlogData ?? [];

      setAvailableProfiles(profiles);

      // Set first profile as current
      if (profiles.length > 0) {
        setCurrentProfile(profiles[0]);
      }

      return profiles;
    } catch (err) {
      console.error("Error fetching profiles:", err);
    }
  };

  // ✔ Tab handler
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    const screenMap: Record<string, string> = {
      home: "home",
      discover: "discover",
      events: "events",
      profile: "profile",
      admin: "admin",
    };

    setCurrentView({ screen: screenMap[tab] || "home", data: undefined });
  };

  // ✔ Login
  const handleLogin = (adminStatus: any, tokenValue: any) => {
    // store token
    localStorage.setItem("auth-token", tokenValue);
    setToken(tokenValue); // IMPORTANT — triggers auth useEffect

    setIsAuthenticated(true);
    setIsAdmin(adminStatus);
  };

  // ✔ Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);

    localStorage.removeItem("auth-token");
    setToken(null); // removes token from state

    setActiveTab("home");
    setCurrentView({ screen: "home" });
  };

  const handleNavigate = (screen: string, data?: Record<string, any>) => {
    setCurrentView({ screen, data });
  };

  // Mock user data - in production this would come from your auth system
  // const currentUser = {
  //   name: isAdmin ? "Admin" : "Alex Johnson",
  //   avatar:
  //     "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  //   initials: isAdmin ? "AD" : "AJ",
  //   isAdmin: isAdmin,
  // };

  const renderCurrentScreen = () => {
    // Render screens based on current view
    switch (currentView.screen) {
      case "home":
        return (
          <APIState>
            <HomeFeed onNavigate={handleNavigate} />
          </APIState>
        );

      case "discover":
        return (
          <APIState>
            <EventDiscovery onNavigate={handleNavigate} />
          </APIState>
        );

      case "events":
        return (
          <APIState>
            <EventsScreen onNavigate={handleNavigate} />
          </APIState>
        );

      case "event-detail":
        return (
          <APIState>
            <EventDetail
              eventId={currentView.data?.eventId || "1"}
              onBack={() => handleNavigate("home")}
            />
          </APIState>
        );

      case "profile":
        return (
          <APIState>
            <UserProfile
              selectedProfileId={currentView.data?.profileId}
              activeTab={currentView.data?.activeTab}
              onNavigate={handleNavigate}
            />
          </APIState>
        );

      case "organizationProfile":
        return (
          <APIState>
            <OrganizationProfile
              organizationId={currentView.data?.organizationId || "org1"}
              onBack={() => handleNavigate("discover")}
              onNavigate={handleNavigate}
            />
          </APIState>
        );

      case "otherUserProfile":
        return (
          <APIState>
            <OtherUserProfile
              userId={currentView.data?.userId || "1"}
              onNavigate={handleNavigate}
              onBack={() => handleNavigate("home")}
            />
          </APIState>
        );

      case "admin":
        return (
          <APIState>
            <AdminScreen />
          </APIState>
        );

      default:
        return (
          <APIState>
            <HomeFeed onNavigate={handleNavigate} />
          </APIState>
        );
    }
  };

  // Show start page if not authenticated
  if (!isAuthenticated) {
    // Show reset password screen
    if (showResetPassword) {
      return (
        <div className="min-h-screen bg-background text-foreground">
          <APIState>
            <ResetPassword
              onBack={() => {
                setShowResetPassword(false);
                setShowForgotPassword(false);
              }}
              onSuccess={() => {
                setShowResetPassword(false);
                setShowForgotPassword(false);
                setCurrentView({ screen: "home", data: undefined });
              }}
            />
          </APIState>
        </div>
      );
    }

    // Show forgot password screen
    if (showForgotPassword) {
      return (
        <div className="min-h-screen bg-background text-foreground">
          <APIState>
            <ForgotPassword
              onBack={() => setShowForgotPassword(false)}
              onResetLink={() => {
                setShowForgotPassword(false);
                setShowResetPassword(true);
              }}
            />
          </APIState>
        </div>
      );
    }

    // Show login/signup screen
    return !localStorage.getItem("auth-token") ? (
      <div className="min-h-screen bg-background text-foreground">
        <APIState>
          <StartPage
            onLogin={handleLogin}
            onForgotPassword={() => setShowForgotPassword(true)}
          />
        </APIState>
      </div>
    ) : (
      <div className="min-h-screen bg-background text-foreground"></div>
    );
  }

  // Show main app if authenticated
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to main content
      </a>

      {/* Left Navigation - Desktop only */}
      <LeftNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isAdmin={isAdmin}
      />
      {/* Debug: isAdmin value */}
      {/* {console.log(isAdmin)} */}

      {/* Top Right Controls */}
      <div
        className="fixed top-4 right-4 z-50 flex items-center gap-3"
        role="region"
        aria-label="User menu"
      >
        {/* Profile Picture with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all focus:outline-none focus:ring-primary/60"
              aria-label="Switch Profile - Current: Alex Johnson"
              aria-haspopup="menu"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={currentProfile?.image}
                  alt={currentProfile?.Name}
                />
                <AvatarFallback>
                  {currentProfile?.Name?.substring(0, 1)}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Switch Profile</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableProfiles.map((profile: any) => {
              const Icon = iconMap[profile.icon] || User; // fallback icon

              return (
                <DropdownMenuItem
                  key={profile.ID}
                  onClick={() => {
                    setCurrentProfile(profile); // <-- store clicked profile
                    handleNavigate("profile", profile); // <-- pass entire profile data
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 w-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile.image} alt={profile.Name} />
                      <AvatarFallback>
                        <Icon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{profile.Name}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {profile.SourceTable}
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              );
            })}

            <DropdownMenuSeparator />
            {isAdmin && (
              <>
                <DropdownMenuItem
                  onClick={() => handleNavigate("admin")}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 w-full">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Admin Panel</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem
              onClick={() => setShowAboutDialog(true)}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-3 w-full">
                <Info className="h-4 w-4" />
                <span>About Nexus</span>
              </div>
            </DropdownMenuItem>
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
      <main id="main-content" className="lg:pl-64" role="main">
        {renderCurrentScreen()}
      </main>

      {/* Bottom Navigation - Mobile only, hide in event detail */}
      {currentView.screen !== "event-detail" &&
        currentView.screen !== "organizationProfile" && (
          <div className="lg:hidden">
            <BottomNav
              activeTab={activeTab}
              onTabChange={handleTabChange}
              isAdmin={isAdmin}
            />
          </div>
        )}

      {/* AI Assistant */}
      <AIAssistant
        isOpen={isAIAssistantOpen}
        onToggle={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
      />

      {/* About Dialog */}
      <AboutDialog
        isOpen={showAboutDialog}
        onClose={() => setShowAboutDialog(false)}
      />
    </div>
  );
}
