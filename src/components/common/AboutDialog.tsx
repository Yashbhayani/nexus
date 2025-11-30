import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Mail, Heart, Github, AlertCircle, ExternalLink, Phone, MapPin, Globe, Laptop, Activity } from "lucide-react";
import { NexusLogo } from "./NexusLogo";

interface AboutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutDialog({ isOpen, onClose }: AboutDialogProps) {
  const developers = [
    {
      name: "Nexus Development Team",
      email: "nexus.support@uta.edu",
      role: "Technical Support & General Inquiries"
    }
  ];

  const handleEmailClick = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handlePhoneClick = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <NexusLogo size="md" showTagline={false} />
          </div>
          <DialogTitle className="text-center">
            About Nexus
          </DialogTitle>
          <DialogDescription className="text-center">
            University of Texas at Arlington's campus resource portal for events, announcements, and community connections
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Version Info */}
          {/* <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Version 1.0.0</span>
            <span>•</span>
            <span>November 2025</span>
          </div> */}

          {/* UT Arlington Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
              <h3>University Information</h3>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-3 sm:p-4 space-y-3">
              <div className="space-y-2">
                <p className="font-medium text-card-foreground">
                  The University of Texas at Arlington
                </p>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>701 S Nedderman Drive<br />Arlington, TX 76019</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    <span>(817) 272-2011</span>
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-auto py-2 px-3 min-h-[36px]"
                onClick={() => window.open('https://www.uta.edu', '_blank')}
              >
                <Globe className="w-3.5 h-3.5 mr-2 flex-shrink-0" aria-hidden="true" />
                <span className="text-xs sm:text-sm">Visit uta.edu</span>
                <ExternalLink className="w-3 h-3 ml-auto flex-shrink-0" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {/* Developer Contacts */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
              <Mail className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
              <h3>Contact Nexus Support</h3>
            </div>

            <div className="space-y-3">
              {developers.map((dev, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-muted/30 p-3 sm:p-4 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className="font-medium text-card-foreground">
                        {dev.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {dev.role}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-auto py-2 px-3 min-h-[36px]"
                    onClick={() => handleEmailClick(dev.email)}
                  >
                    <Mail className="w-3.5 h-3.5 mr-2 flex-shrink-0" aria-hidden="true" />
                    <span className="truncate text-xs sm:text-sm">{dev.email}</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Important Campus Resources */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-card-foreground">
              Important Campus Resources
            </p>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="ghost"
                className="justify-start h-auto py-3 px-3"
                onClick={() => window.open('https://www.uta.edu/campus-ops/police', '_blank')}
              >
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 text-red-600" aria-hidden="true" />
                <span className="flex-1 text-left">UTA Police Department: (817) 272-3003</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                className="justify-start h-auto py-3 px-3"
                onClick={() => window.open('https://www.uta.edu/oit/services/help-desk', '_blank')}
              >
                <Laptop className="w-4 h-4 mr-2 flex-shrink-0" aria-hidden="true" />
                <span className="flex-1 text-left">IT Help Desk: (817) 272-2208</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                className="justify-start h-auto py-3 px-3"
                onClick={() => window.open('https://www.uta.edu/student-affairs/health-services', '_blank')}
              >
                <Activity className="w-4 h-4 mr-2 flex-shrink-0 text-green-600" aria-hidden="true" />
                <span className="flex-1 text-left">Health Services: (817) 272-2771</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                className="justify-start h-auto py-3 px-3"
                onClick={() => window.open('https://www.uta.edu/student-affairs', '_blank')}
              >
                <Globe className="w-4 h-4 mr-2 flex-shrink-0" aria-hidden="true" />
                <span className="flex-1 text-left">Student Affairs</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                className="justify-start h-auto py-3 px-3"
                onClick={() => window.open('https://www.uta.edu/student-affairs/caps', '_blank')}
              >
                <Heart className="w-4 h-4 mr-2 flex-shrink-0 text-primary" aria-hidden="true" />
                <span className="flex-1 text-left">Counseling & Psychological Services</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                className="justify-start h-auto py-3 px-3"
                onClick={() => window.open('https://libraries.uta.edu', '_blank')}
              >
                <Globe className="w-4 h-4 mr-2 flex-shrink-0" aria-hidden="true" />
                <span className="flex-1 text-left">UTA Libraries</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {/* Support Information */}
          <div className="rounded-lg border border-border bg-primary/5 p-3 sm:p-4 space-y-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-2 flex-1 min-w-0">
                <h4 className="font-medium text-card-foreground">
                  Having Issues?
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  If you encounter any bugs, technical issues, or have feature requests for Nexus, please reach out to our development team at nexus.support@uta.edu. We're here to help make your campus experience better!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={onClose} className="w-full sm:w-auto min-h-[44px]">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}