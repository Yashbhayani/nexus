import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardDescription } from "../ui/card";
import { ArrowLeft, Eye, EyeOff, CheckCircle2, Lock } from "lucide-react";
import { NexusLogo } from "../common/NexusLogo";

interface ResetPasswordProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function ResetPassword({ onBack, onSuccess }: ResetPasswordProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength (basic validation)
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleBackToLogin = () => {
    setIsSubmitted(false);
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <NexusLogo size="lg" showTagline={false} />
          </div>

          <Card className="bg-card border border-border shadow-lg">
            {!isSubmitted ? (
              <>
                <CardHeader className="space-y-1 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={onBack}
                      className="p-1 hover:bg-muted rounded-md transition-colors"
                      aria-label="Go back"
                    >
                      <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                  <h2 className="text-card-foreground">
                    Reset Your Password
                  </h2>
                  <CardDescription className="text-muted-foreground">
                    Enter your new password below. Make sure it's at least 8 characters long.
                  </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    {/* New Password */}
                    <div className="space-y-2">
                      <Label htmlFor="new-password" className="text-sm text-card-foreground">
                        New Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <Input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          className="h-11 pl-10 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-muted/20"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          aria-label={showNewPassword ? "Hide password" : "Show password"}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-sm text-card-foreground">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="h-11 pl-10 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-muted/20"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                        <p className="text-sm text-destructive">{error}</p>
                      </div>
                    )}
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
                        'Reset Password'
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
            ) : (
              <>
                <CardHeader className="space-y-4 text-center pb-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-primary" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-card-foreground">
                      Password Reset Successful!
                    </h2>
                    <CardDescription className="text-muted-foreground">
                      Your password has been successfully reset. You can now log in with your new password.
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardFooter className="flex flex-col space-y-3 pt-6">
                  <Button
                    onClick={handleBackToLogin}
                    className="w-full h-11"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                    Back to Login
                  </Button>
                </CardFooter>
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
