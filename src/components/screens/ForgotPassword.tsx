import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardDescription } from "../ui/card";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { NexusLogo } from "../common/NexusLogo";

interface ForgotPasswordProps {
  onBack: () => void;
}

export function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleBackToLogin = () => {
    setIsSubmitted(false);
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
            {!isSubmitted ? (
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
                  <h2 className="text-card-foreground">
                    Forgot Password?
                  </h2>
                  <CardDescription className="text-muted-foreground">
                    No worries! Enter your email address and we'll send you a link to reset your password.
                  </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email" className="text-sm text-card-foreground">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
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
                        Enter your university email address to receive password reset instructions
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
                        'Send Reset Link'
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
                      Check Your Email
                    </h2>
                    <CardDescription className="text-muted-foreground">
                      We've sent password reset instructions to:
                    </CardDescription>
                    <p className="text-sm text-primary font-medium">
                      {email}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the email? Check your spam folder or try again with a different email address.
                  </p>
                </CardContent>

                <CardFooter className="flex flex-col space-y-3 pt-6">
                  <Button
                    onClick={handleBackToLogin}
                    variant="outline"
                    className="w-full h-11"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                    Back to Login
                  </Button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail("");
                    }}
                    className="text-sm text-primary hover:text-primary/80 transition-colors font-medium underline-offset-4 hover:underline"
                  >
                    Try Different Email
                  </button>
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
