import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { ArrowRight, CheckCircle } from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

const interests = [
  "Music", "Food & Drink", "Art & Culture", "Sports", "Technology",
  "Business", "Health & Wellness", "Travel", "Photography", "Fashion",
  "Gaming", "Books", "Movies", "Outdoor", "Social"
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    selectedInterests: [] as string[]
  });

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(interest)
        ? prev.selectedInterests.filter(i => i !== interest)
        : [...prev.selectedInterests, interest]
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name && formData.email;
      case 2:
        return formData.username;
      case 3:
        return formData.selectedInterests.length >= 3;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map((stepNum) => (
              <div
                key={stepNum}
                className={`h-2 w-8 rounded-full ${
                  stepNum <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Step {step} of 3
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-2xl font-semibold mb-2">Welcome to Vibe</h1>
                  <p className="text-muted-foreground">
                    Connect with friends and discover amazing events
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-2">Choose a Username</h2>
                  <p className="text-muted-foreground">
                    This is how others will find you
                  </p>
                </div>

                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="@username"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Must be unique and contain only letters, numbers, and underscores
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-2">What interests you?</h2>
                  <p className="text-muted-foreground">
                    Select at least 3 interests to personalize your experience
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {interests.map((interest) => {
                    const isSelected = formData.selectedInterests.includes(interest);
                    return (
                      <Badge
                        key={interest}
                        variant={isSelected ? "default" : "secondary"}
                        className={`cursor-pointer justify-center py-2 px-3 ${
                          isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                        }`}
                        onClick={() => handleInterestToggle(interest)}
                      >
                        {isSelected && <CheckCircle className="h-3 w-3 mr-1" />}
                        {interest}
                      </Badge>
                    );
                  })}
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  Selected: {formData.selectedInterests.length}/3+ interests
                </p>
              </div>
            )}

            <Button
              className="w-full mt-6"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {step === 3 ? "Get Started" : "Continue"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}