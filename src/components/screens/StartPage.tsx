import { useState, useEffect, useContext } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Eye,
  EyeOff,
  Music,
  Calendar,
  Camera,
  Trophy,
  Star,
  MapPin,
  Coffee,
  Heart,
  BookOpen,
  GraduationCap,
  Gamepad2,
  Mic,
  PartyPopper,
  Pizza,
  Palette,
  Rocket,
  Globe,
  Lightbulb,
  Briefcase,
  Film,
  Headphones,
  Gift,
  Users,
  Zap,
  Sparkles,
  Crown,
  Diamond,
  Mail,
  AlertCircle,
  Info,
} from "lucide-react";
import { NexusLogo } from "../common/NexusLogo";
import { AboutDialog } from "../common/AboutDialog";
import APIContext from "../../Context/apimethods/APIContext";
import * as apiroute from "../../Context/API/ApiRouter";

interface StartPageProps {
  onLogin: (isAdmin: boolean, token: string) => void;
  onForgotPassword: () => void;
}

export function StartPage({ onLogin, onForgotPassword }: StartPageProps) {
  const context = useContext(APIContext);
  const { POSTFunction, GETFunction } = context;

  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const [AcademicLevels, setAcademicLevels] = useState<any[]>([]);
  const [Majors, setAMajors] = useState<any[]>([]);
  // Cursor halo effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    const handleMouseLeave = () => {
      setCursorPosition(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // API calls must be in a separate async function
    AcademicLevel(); // AcademicLevel already setsAcademicLevels()
    MajorLevel(); // MajorLevel already setsAMajors()

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Clear errors when switching tabs
  useEffect(() => {
    setPasswordError("");
    setEmailError("");
  }, [activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    // Get form data
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Clear previous errors
    setPasswordError("");
    setEmailError("");

    // Validate email format - must be username@website.com or username@website.edu
    const emailPattern = /^[^\s@]+@[^\s@]+\.(com|edu)$/;
    if (!emailPattern.test(email)) {
      setEmailError("Email must end with .com or .edu");
      setIsLoading(false);
      return;
    }

    // Check if admin credentials

    let body = {
      Email: email,
      Password: password,
    };

    const PostData = await POSTFunction(body, apiroute.loginurl);

    if (!PostData.success) {
      alert(PostData.error); // You can use a more sophisticated notification here
      setIsLoading(false);
      return;
    } else {
      localStorage.setItem("auth-token", PostData.authToken);
      let useradd = await verifyuserisAdmin();
      if (useradd) {
        onLogin(useradd, PostData.authToken);
      } else {
        onLogin(useradd, PostData.authToken);
      }
    }
    // const isAdmin =
    //   email === "admin@gmail.com" && password === "admin";
    // if (isAdmin) {
    //   console.log("Admin logged in");
    //          // onLogin(isAdmin);
    // } else {
    //   return;
    // }
  };

  const AcademicLevel = async () => {
    const Data = await GETFunction(apiroute.academiclevel);
    setAcademicLevels(Data.statusdata || []);
  };

  const MajorLevel = async () => {
    const Data = await GETFunction(apiroute.major);
    setAMajors(Data.statusdata); // THIS is enough
  };

  const verifyuserisAdmin = async () => {
    let IsAdminStatus = await GETFunction(apiroute.verifyusertype);
    return IsAdminStatus.success;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const mobileNumber = formData.get("mobileNumber") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const signupPassword = formData.get("signupPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const academicLevel = formData.get("academicLevel") as string;
    const major = formData.get("major") as string;

    // Clear previous errors
    setPasswordError("");
    setEmailError("");

    // Validate email format - must be username@website.com or username@website.edu
    const emailPattern = /^[^\s@]+@[^\s@]+\.(com|edu)$/;
    if (!emailPattern.test(email)) {
      setEmailError("Email must end with .com or .edu");
      return;
    }

    // Validate passwords match
    if (signupPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    // Password strength validation
    if (signupPassword.length < 8 || signupPassword.length > 12) {
      setPasswordError("Password must be 8-12 characters long");
      return;
    }

    if (!/[A-Z]/.test(signupPassword)) {
      setPasswordError(
        "Password must contain at least one uppercase letter (A-Z)"
      );
      return;
    }

    if (!/[a-z]/.test(signupPassword)) {
      setPasswordError(
        "Password must contain at least one lowercase letter (a-z)"
      );
      return;
    }

    if (!/[0-9]/.test(signupPassword)) {
      setPasswordError("Password must contain at least one digit (0-9)");
      return;
    }

    if (!/[!@#$%^&*()_\-+=\[\]{};:'",.<>?/|\\]/.test(signupPassword)) {
      setPasswordError(
        "Password must contain at least one special character (!@#$%^&*()_-+=[]{};:'\",.<>?/|)"
      );
      return;
    }

    const phoneRegex = /^\+?[0-9]{10,12}$/;

    if (!phoneRegex.test(mobileNumber.trim())) {
      setMobileError("Mobile number must be 10–12 digits (with optional +).");
    } else {
      setMobileError("");
    }

    setIsLoading(true);

    let body = {
      FirstName: firstName,
      LastName: lastName,
      MobileNumber: mobileNumber,
      Email: email,
      Password: signupPassword,
      StudentType: academicLevel,
      Majors: major,
    };

    const PostData = await POSTFunction(body, apiroute.signupurl);
    console.log(PostData);
    if (!PostData.success) {
      alert(PostData.error); // You can use a more sophisticated notification here
      setIsLoading(false);
      return;
    } else {
      localStorage.setItem("auth-token", PostData.authToken);
      let useradd = await verifyuserisAdmin();
      if (useradd) {
        onLogin(useradd, PostData.authToken);
      } else {
        onLogin(useradd, PostData.authToken);
      }
    }
  };

  // Orbiting icons - Inner ring (10 icons)
  const innerRingIcons = [
    { Icon: Music, color: "#ff6b6b", delay: 0 },
    { Icon: Calendar, color: "#4ecdc4", delay: 1 },
    { Icon: Camera, color: "#45b7d1", delay: 2 },
    { Icon: Trophy, color: "#ffd93d", delay: 3 },
    { Icon: Star, color: "#ff9ff3", delay: 4 },
    { Icon: MapPin, color: "#54a0ff", delay: 5 },
    { Icon: Coffee, color: "#ff9f43", delay: 6 },
    { Icon: Heart, color: "#ff6b6b", delay: 7 },
    { Icon: BookOpen, color: "#6c5ce7", delay: 8 },
    { Icon: GraduationCap, color: "#74b9ff", delay: 9 },
  ];

  // Orbiting icons - Outer ring (12 icons)
  const outerRingIcons = [
    { Icon: Gamepad2, color: "#6c5ce7", delay: 0 },
    { Icon: Mic, color: "#fd79a8", delay: 1 },
    { Icon: PartyPopper, color: "#fdcb6e", delay: 2 },
    { Icon: Pizza, color: "#ff7675", delay: 3 },
    { Icon: Palette, color: "#fd79a8", delay: 4 },
    { Icon: Rocket, color: "#00b894", delay: 5 },
    { Icon: Globe, color: "#0984e3", delay: 6 },
    { Icon: Lightbulb, color: "#fdcb6e", delay: 7 },
    { Icon: Briefcase, color: "#8e44ad", delay: 8 },
    { Icon: Film, color: "#e74c3c", delay: 9 },
    { Icon: Headphones, color: "#3498db", delay: 10 },
    { Icon: Gift, color: "#f39c12", delay: 11 },
  ];

  // Static side icons - More student-friendly campus icons
  const sideIcons = [
    // Left side icons
    {
      Icon: BookOpen,
      position: { top: "15%", left: "3%" },
      color: "#6366f1",
      size: "w-6 h-6",
    },
    {
      Icon: GraduationCap,
      position: { top: "25%", left: "5%" },
      color: "#8b5cf6",
      size: "w-7 h-7",
    },
    {
      Icon: Coffee,
      position: { top: "35%", left: "2%" },
      color: "#f59e0b",
      size: "w-5 h-5",
    },
    {
      Icon: Calendar,
      position: { top: "45%", left: "4%" },
      color: "#10b981",
      size: "w-6 h-6",
    },
    {
      Icon: Users,
      position: { top: "55%", left: "3%" },
      color: "#06b6d4",
      size: "w-6 h-6",
    },
    {
      Icon: Trophy,
      position: { top: "65%", left: "5%" },
      color: "#fbbf24",
      size: "w-7 h-7",
    },
    {
      Icon: Music,
      position: { top: "75%", left: "2%" },
      color: "#f472b6",
      size: "w-5 h-5",
    },
    {
      Icon: Camera,
      position: { top: "85%", left: "4%" },
      color: "#a78bfa",
      size: "w-6 h-6",
    },

    // Right side icons
    {
      Icon: Lightbulb,
      position: { top: "12%", right: "3%" },
      color: "#fbbf24",
      size: "w-6 h-6",
    },
    {
      Icon: Rocket,
      position: { top: "22%", right: "5%" },
      color: "#3b82f6",
      size: "w-7 h-7",
    },
    {
      Icon: Heart,
      position: { top: "32%", right: "2%" },
      color: "#ef4444",
      size: "w-5 h-5",
    },
    {
      Icon: Globe,
      position: { top: "42%", right: "4%" },
      color: "#059669",
      size: "w-6 h-6",
    },
    {
      Icon: Zap,
      position: { top: "52%", right: "3%" },
      color: "#f59e0b",
      size: "w-6 h-6",
    },
    {
      Icon: Gamepad2,
      position: { top: "62%", right: "5%" },
      color: "#8b5cf6",
      size: "w-7 h-7",
    },
    {
      Icon: Palette,
      position: { top: "72%", right: "2%" },
      color: "#ec4899",
      size: "w-5 h-5",
    },
    {
      Icon: Mic,
      position: { top: "82%", right: "4%" },
      color: "#06b6d4",
      size: "w-6 h-6",
    },

    // Additional scattered icons
    {
      Icon: Star,
      position: { top: "8%", left: "12%" },
      color: "#fbbf24",
      size: "w-5 h-5",
    },
    {
      Icon: Sparkles,
      position: { top: "90%", left: "15%" },
      color: "#a78bfa",
      size: "w-5 h-5",
    },
    {
      Icon: Crown,
      position: { top: "6%", right: "12%" },
      color: "#f59e0b",
      size: "w-5 h-5",
    },
    {
      Icon: Diamond,
      position: { top: "92%", right: "15%" },
      color: "#06b6d4",
      size: "w-5 h-5",
    },
    {
      Icon: PartyPopper,
      position: { bottom: "8%", left: "8%" },
      color: "#f472b6",
      size: "w-6 h-6",
    },
    {
      Icon: Gift,
      position: { bottom: "6%", right: "8%" },
      color: "#10b981",
      size: "w-6 h-6",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="mb-8">
            <NexusLogo size="lg" showTagline={false} />
          </div>

          <Card className="bg-card border border-border shadow-lg">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <CardHeader className="pb-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
              </CardHeader>

              <TabsContent value="login">
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="login-email"
                        className="text-sm font-medium text-card-foreground"
                      >
                        Email
                      </Label>
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="username@website.com"
                        required
                        className="h-11"
                      />
                      {emailError && activeTab === "login" && (
                        <p className="text-red-500 text-sm mt-1">
                          {emailError}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-sm font-medium text-card-foreground"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          required
                          className="h-11 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-muted/20"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff
                              className="h-4 w-4 text-muted-foreground"
                              aria-hidden="true"
                            />
                          ) : (
                            <Eye
                              className="h-4 w-4 text-muted-foreground"
                              aria-hidden="true"
                            />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col space-y-3 pt-6">
                    <Button
                      type="submit"
                      className="w-full h-11"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          Signing in...
                        </div>
                      ) : (
                        "Sign In"
                      )}
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={onForgotPassword}
                        className="text-sm text-primary hover:text-primary/80 transition-colors font-medium underline-offset-4 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </CardFooter>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="firstName"
                          className="text-sm font-medium text-card-foreground"
                        >
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          placeholder="Alex"
                          required
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="lastName"
                          className="text-sm font-medium text-card-foreground"
                        >
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="Chen"
                          required
                          className="h-10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium text-card-foreground"
                        >
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="username@website.com"
                          required
                          className="h-10"
                        />
                        {emailError && (
                          <p className="text-red-500 text-sm mt-1">
                            {emailError}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium text-card-foreground"
                        >
                          Mobile Number
                        </Label>
                        <Input
                          id="mobileNumber"
                          name="mobileNumber"
                          type="mobileNumber"
                          placeholder="+19999999999"
                          required
                          className="h-10"
                          minLength={10}
                          maxLength={12}
                        />
                        {mobileError && (
                          <p className="text-red-500 text-sm mt-1">
                            {mobileError}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="signupPassword"
                        className="text-sm font-medium text-card-foreground"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="signupPassword"
                          name="signupPassword"
                          type={showSignupPassword ? "text" : "password"}
                          placeholder="••••••••"
                          required
                          className="h-10 pr-10"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-muted/20"
                          onClick={() =>
                            setShowSignupPassword(!showSignupPassword)
                          }
                          aria-label={
                            showSignupPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showSignupPassword ? (
                            <EyeOff
                              className="h-4 w-4 text-muted-foreground"
                              aria-hidden="true"
                            />
                          ) : (
                            <Eye
                              className="h-4 w-4 text-muted-foreground"
                              aria-hidden="true"
                            />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Must be 8-12 characters with uppercase, lowercase,
                        digit, and special character
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium text-card-foreground"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          required
                          className="h-10 pr-10"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-muted/20"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff
                              className="h-4 w-4 text-muted-foreground"
                              aria-hidden="true"
                            />
                          ) : (
                            <Eye
                              className="h-4 w-4 text-muted-foreground"
                              aria-hidden="true"
                            />
                          )}
                        </Button>
                      </div>
                      {passwordError && (
                        <p className="text-red-500 text-sm mt-1">
                          {passwordError}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="academicLevel"
                          className="text-sm font-medium text-card-foreground"
                        >
                          Academic Level
                        </Label>
                        <Select name="academicLevel" required>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            {AcademicLevels?.map((level: any, index) => (
                              <SelectItem key={index} value={level.Code}>
                                {" "}
                                {level.Name}
                              </SelectItem>
                            ))}
                            {/* <SelectItem value="freshman">Freshman</SelectItem>
                            <SelectItem value="sophomore">Sophomore</SelectItem>
                            <SelectItem value="junior">Junior</SelectItem>
                            <SelectItem value="senior">Senior</SelectItem>
                            <SelectItem value="graduate">Graduate</SelectItem>
                            <SelectItem value="phd">PhD Candidate</SelectItem> */}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="major"
                          className="text-sm font-medium text-card-foreground"
                        >
                          Major
                        </Label>
                        <Select name="major" required>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select major" />
                          </SelectTrigger>
                          <SelectContent>
                            {Majors?.map((level: any, index) => (
                              <SelectItem key={index} value={level.Code}>
                                {" "}
                                {level.Name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                          {/* <SelectContent>
                            <SelectItem value="computer-science">Computer Science</SelectItem>
                            <SelectItem value="software-engineering">Software Engineering</SelectItem>
                            <SelectItem value="information-systems">Information Systems</SelectItem>
                            <SelectItem value="data-science">Data Science</SelectItem>
                            <SelectItem value="business-administration">Business Administration</SelectItem>
                            <SelectItem value="psychology">Psychology</SelectItem>
                            <SelectItem value="biology">Biology</SelectItem>
                            <SelectItem value="chemistry">Chemistry</SelectItem>
                            <SelectItem value="physics">Physics</SelectItem>
                            <SelectItem value="mathematics">Mathematics</SelectItem>
                            <SelectItem value="mechanical-engineering">Mechanical Engineering</SelectItem>
                            <SelectItem value="electrical-engineering">Electrical Engineering</SelectItem>
                            <SelectItem value="civil-engineering">Civil Engineering</SelectItem>
                            <SelectItem value="fine-arts">Fine Arts</SelectItem>
                            <SelectItem value="graphic-design">Graphic Design</SelectItem>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="history">History</SelectItem>
                            <SelectItem value="political-science">Political Science</SelectItem>
                            <SelectItem value="economics">Economics</SelectItem>
                            <SelectItem value="nursing">Nursing</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent> */}
                        </Select>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-6">
                    <Button
                      type="submit"
                      className="w-full h-11"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          Creating account...
                        </div>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </Card>

          {/* About Us Footer Link */}
          <div className="mt-6 text-center pb-4">
            <button
              onClick={() => setShowAboutDialog(true)}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              <Info className="w-4 h-4" />
              About Nexus
            </button>
          </div>
        </div>
      </div>

      {/* About Dialog */}
      <AboutDialog
        isOpen={showAboutDialog}
        onClose={() => setShowAboutDialog(false)}
      />
    </div>
  );
}
