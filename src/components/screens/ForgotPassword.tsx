import { useContext, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
} from "../ui/card";
import { ArrowLeft, Mail, CheckCircle2, Lock, Eye, EyeOff } from "lucide-react";
import { NexusLogo } from "../common/NexusLogo";
import APIContext from "../../Context/apimethods/APIContext";
import * as apiroute from "../../Context/API/ApiRouter";

interface ForgotPasswordProps {
  onBack: () => void;
  onResetLink?: () => void;
}

export function ForgotPassword({ onBack, onResetLink }: ForgotPasswordProps) {
  const context = useContext(APIContext);
  const { GETFunction } = context;

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<"email" | "otp" | "reset">(
    "email"
  );
  const [otpError, setOtpError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let cleanEmail = email.trim().replace(/^[?=]+|[?=]+$/g, "");

    const verifyEmail = await GETFunction(apiroute.verifyemail, {
      email: cleanEmail,
    });
    console.log(verifyEmail);

    if (verifyEmail.success) {
      // Simulate sending OTP
      setTimeout(() => {
        setIsLoading(false);
        setCurrentStep("otp");
      }, 1500);

      setCurrentStep("otp");
    } else {
      // Simulate sending OTP
      setTimeout(() => {
        alert(verifyEmail.error);
        setIsLoading(false);
      }, 1500);
    }
    return;
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    setIsLoading(true);

    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      if (otp === "0000") {
        setCurrentStep("reset");
      } else {
        setOtpError("Wrong OTP, try again");
        setOtp("");
      }
    }, 1000);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    // Simulate password reset
    setTimeout(() => {
      setIsLoading(false);
      // Reset complete, go back to login
      onBack();
    }, 1500);
  };

  const handleBackToLogin = () => {
    setCurrentStep("email");
    setEmail("");
    onBack();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <NexusLogo size="lg" showTagline={false} />
          </div>

          <Card className="bg-card border border-border shadow-lg">
            {currentStep === "email" ? (
              <>
                <CardHeader className="space-y-1 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={onBack}
                      className="p-1 hover:bg-muted rounded-md transition-colors"
                      aria-label="Go back to login"
                    >
                      <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                  <h2 className="text-card-foreground">Forgot Password?</h2>
                  <CardDescription className="text-muted-foreground">
                    No worries! Enter your email address and we'll send you a
                    link to reset your password.
                  </CardDescription>
                </CardHeader>

                <form onSubmit={handleEmailSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="reset-email"
                        className="text-sm text-card-foreground"
                      >
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="your.email@university.edu"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-11 pl-10"
                          aria-describedby="email-description"
                        />
                      </div>
                      <p id="email-description" className="sr-only">
                        Enter your university email address to receive password
                        reset instructions
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col space-y-3 pt-6">
                    <Button
                      type="submit"
                      className="w-full h-11"
                      disabled={isLoading || !email}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </div>
                      ) : (
                        "Get OTP"
                      )}
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={onBack}
                        className="text-sm text-primary hover:text-primary/80 transition-colors font-medium underline-offset-4 hover:underline"
                      >
                        Back to Login
                      </button>
                    </div>
                  </CardFooter>
                </form>
              </>
            ) : currentStep === "otp" ? (
              <>
                <CardHeader className="space-y-1 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => setCurrentStep("email")}
                      className="p-1 hover:bg-muted rounded-md transition-colors"
                      aria-label="Go back to email entry"
                    >
                      <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                  <h2 className="text-card-foreground">Verify OTP</h2>
                  <CardDescription className="text-muted-foreground">
                    We've sent a verification code to:{" "}
                    <span className="font-medium text-primary">{email}</span>
                  </CardDescription>
                </CardHeader>

                <form onSubmit={handleOtpSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="otp"
                        className="text-sm text-card-foreground"
                      >
                        Enter OTP
                      </Label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <Input
                          id="otp"
                          type="text"
                          placeholder="Enter 4-digit code"
                          value={otp}
                          onChange={(e) => {
                            setOtp(e.target.value);
                            setOtpError("");
                          }}
                          required
                          maxLength={4}
                          className="h-11 pl-10 text-center text-lg tracking-widest"
                          aria-describedby="otp-description"
                        />
                      </div>
                      <p id="otp-description" className="sr-only">
                        Enter the 4-digit OTP sent to your email address
                      </p>
                      {otpError && (
                        <p className="text-sm text-red-500 flex items-center gap-2">
                          <span className="inline-block w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                            !
                          </span>
                          {otpError}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        Demo: Use code{" "}
                        <span className="font-mono font-medium text-primary">
                          0000
                        </span>{" "}
                        to continue
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col space-y-3 pt-6">
                    <Button
                      type="submit"
                      className="w-full h-11"
                      disabled={isLoading || otp.length !== 4}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          Verifying...
                        </div>
                      ) : (
                        "Verify OTP"
                      )}
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStep("email");
                          setOtp("");
                          setOtpError("");
                        }}
                        className="text-sm text-primary hover:text-primary/80 transition-colors font-medium underline-offset-4 hover:underline"
                      >
                        Try Different Email
                      </button>
                    </div>
                  </CardFooter>
                </form>
              </>
            ) : (
              <>
                <CardHeader className="space-y-1 pb-4">
                  <h2 className="text-card-foreground">Reset Password</h2>
                  <CardDescription className="text-muted-foreground">
                    Enter your new password for {email}
                  </CardDescription>
                </CardHeader>

                <form onSubmit={handlePasswordReset}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="new-password"
                        className="text-sm text-card-foreground"
                      >
                        New Password
                      </Label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <Input
                          id="new-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            setPasswordError("");
                          }}
                          required
                          className="h-11 pl-10"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirm-password"
                        className="text-sm text-card-foreground"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <Input
                          id="confirm-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setPasswordError("");
                          }}
                          required
                          className="h-11 pl-10"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {passwordError && (
                        <p className="text-sm text-red-500 flex items-center gap-2">
                          <span className="inline-block w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                            !
                          </span>
                          {passwordError}
                        </p>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col space-y-3 pt-6">
                    <Button
                      type="submit"
                      className="w-full h-11"
                      disabled={isLoading || !newPassword || !confirmPassword}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          Resetting Password...
                        </div>
                      ) : (
                        "Reset Password"
                      )}
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleBackToLogin}
                        className="text-sm text-primary hover:text-primary/80 transition-colors font-medium underline-offset-4 hover:underline"
                      >
                        Back to Login
                      </button>
                    </div>
                  </CardFooter>
                </form>
              </>
            )}
          </Card>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Need help? Contact your campus IT support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
