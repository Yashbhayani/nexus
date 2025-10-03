import { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  Download,
  FileText,
  Calendar,
  Users,
  MessageCircle,
  User,
} from "lucide-react";

interface PDFExportProps {
  onClose: () => void;
}

export function PDFExport({ onClose }: PDFExportProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);

    // Create a new window with the print-friendly content
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = document.getElementById(
      "pdf-export-content",
    );
    if (!printContent) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title><strong>nexus</strong> App Export</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              background: white;
              padding: 20px;
            }
            .page-header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #5b6cf5;
            }
            .section {
              margin-bottom: 40px;
              page-break-inside: avoid;
            }
            .section-title {
              font-size: 24px;
              font-weight: 600;
              color: #5b6cf5;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 1px solid #e5e7eb;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 20px;
              margin-bottom: 20px;
            }
            .card {
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              padding: 20px;
              background: #fafafa;
              break-inside: avoid;
            }
            .card h3 {
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 10px;
              color: #1f2937;
            }
            .app-name {
              font-weight: 700 !important;
            }
            .card p {
              color: #6b7280;
              margin-bottom: 8px;
            }
            .avatar {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: #5b6cf5;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: 600;
              margin-right: 10px;
            }
            .badge {
              display: inline-block;
              padding: 4px 8px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 500;
              margin: 2px;
            }
            .badge-primary { background: #5b6cf5; color: white; }
            .badge-secondary { background: #e5e7eb; color: #374151; }
            .post-content {
              margin: 15px 0;
              padding: 15px;
              background: white;
              border-radius: 8px;
              border-left: 4px solid #5b6cf5;
            }
            .event-details {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
              margin-top: 15px;
            }
            .stat-item {
              text-align: center;
              padding: 15px;
              background: white;
              border-radius: 8px;
            }
            .stat-value {
              font-size: 24px;
              font-weight: 700;
              color: #5b6cf5;
            }
            .stat-label {
              font-size: 14px;
              color: #6b7280;
            }
            @media print {
              body { padding: 0; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();

    // Wait a moment for content to load, then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      setIsGenerating(false);
    }, 1000);
  };

  const mockPosts = [
    {
      id: "1",
      author: "Alex Chen",
      handle: "@alexc",
      content:
        "Just attended an amazing tech meetup! The networking opportunities in this app are incredible. Can't wait for the next event.",
      timestamp: "2h ago",
      likes: 24,
      comments: 5,
      shares: 3,
    },
    {
      id: "2",
      author: "Sarah Johnson",
      handle: "@sarahj",
      content:
        "Organizing a photography workshop next weekend. Who's interested in joining? We'll cover landscape and portrait techniques.",
      timestamp: "4h ago",
      likes: 18,
      comments: 12,
      shares: 6,
    },
    {
      id: "3",
      author: "Mike Rodriguez",
      handle: "@mikero",
      content:
        "The community here is so supportive! Thanks everyone for the advice on my startup pitch. You're all amazing! 🚀",
      timestamp: "1d ago",
      likes: 42,
      comments: 8,
      shares: 15,
    },
  ];

  const mockEvents = [
    {
      id: "1",
      title: "Tech Innovation Summit 2024",
      date: "Dec 15, 2024",
      time: "9:00 AM - 5:00 PM",
      location: "Convention Center",
      attendees: 500,
      price: "$99",
      category: "Technology",
    },
    {
      id: "2",
      title: "Creative Workshop Series",
      date: "Dec 20, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "Art Studio Downtown",
      attendees: 25,
      price: "Free",
      category: "Arts",
    },
    {
      id: "3",
      title: "Networking Happy Hour",
      date: "Dec 22, 2024",
      time: "6:00 PM - 8:00 PM",
      location: "Rooftop Bar",
      attendees: 75,
      price: "$25",
      category: "Networking",
    },
  ];

  const mockBigEvents = [
    {
      id: "big1",
      title: "New Year Celebration Gala",
      date: "Dec 31, 2024",
      location: "Grand Ballroom",
      attendees: 1000,
      price: "$150",
    },
    {
      id: "big2",
      title: "Spring Music Festival",
      date: "Mar 15, 2025",
      location: "Central Park",
      attendees: 5000,
      price: "$75",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Export to PDF
              </h2>
              <p className="text-muted-foreground mt-1">
                Generate a comprehensive PDF report of your{" "}
                <span className="font-bold">nexus</span> app
              </p>
            </div>
            <Button variant="ghost" onClick={onClose}>
              ×
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div id="pdf-export-content">
            {/* PDF Header */}
            <div className="page-header">
              <h1
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "#5b6cf5",
                  marginBottom: "10px",
                }}
              >
                <span className="app-name">nexus</span>
              </h1>
              <p style={{ fontSize: "16px", color: "#6b7280" }}>
                Social Media & Events Platform - Export Report
              </p>
              <p style={{ fontSize: "14px", color: "#9ca3af" }}>
                Generated on{" "}
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* App Overview Section */}
            <div className="section">
              <h2 className="section-title">📱 App Overview</h2>
              <div className="card">
                <h3>Platform Features</h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "15px",
                    marginTop: "15px",
                  }}
                >
                  <div className="stat-item">
                    <div className="stat-value">5</div>
                    <div className="stat-label">
                      Main Screens
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">50+</div>
                    <div className="stat-label">
                      Active Users
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">15</div>
                    <div className="stat-label">
                      Events This Month
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">200+</div>
                    <div className="stat-label">
                      Posts Shared
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: "20px" }}>
                  <p>
                    <strong>Core Functionality:</strong>
                  </p>
                  <ul
                    style={{
                      marginLeft: "20px",
                      marginTop: "10px",
                    }}
                  >
                    <li>
                      Social media feed with user posts and
                      interactions
                    </li>
                    <li>Event discovery and RSVP management</li>
                    <li>Real-time messaging system</li>
                    <li>User profiles and networking</li>
                    <li>Dark/light mode support</li>
                    <li>Mobile-first responsive design</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Social Feed Section */}
            <div className="section">
              <h2 className="section-title">📱 Social Feed</h2>
              <div className="grid">
                {mockPosts.map((post) => (
                  <div key={post.id} className="card">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "15px",
                      }}
                    >
                      <div className="avatar">
                        {post.author.charAt(0)}
                      </div>
                      <div>
                        <h3 style={{ marginBottom: "2px" }}>
                          {post.author}
                        </h3>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#9ca3af",
                          }}
                        >
                          {post.handle} • {post.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="post-content">
                      <p>{post.content}</p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "15px",
                        fontSize: "14px",
                        color: "#6b7280",
                      }}
                    >
                      <span>❤️ {post.likes} likes</span>
                      <span>💬 {post.comments} comments</span>
                      <span>🔄 {post.shares} shares</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Events Section */}
            <div className="section">
              <h2 className="section-title">📅 Events</h2>
              <div className="grid">
                {mockEvents.map((event) => (
                  <div key={event.id} className="card">
                    <h3>{event.title}</h3>
                    <div className="event-details">
                      <div>
                        <p>
                          <strong>📅 Date:</strong> {event.date}
                        </p>
                        <p>
                          <strong>🕐 Time:</strong> {event.time}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>📍 Location:</strong>{" "}
                          {event.location}
                        </p>
                        <p>
                          <strong>👥 Attendees:</strong>{" "}
                          {event.attendees}
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        marginTop: "15px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span className="badge badge-primary">
                        {event.category}
                      </span>
                      <span
                        style={{
                          fontWeight: "600",
                          color: "#5b6cf5",
                        }}
                      >
                        {event.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Big Events Section */}
            <div className="section">
              <h2 className="section-title">
                🎉 Featured Events
              </h2>
              <div className="grid">
                {mockBigEvents.map((event) => (
                  <div
                    key={event.id}
                    className="card"
                    style={{
                      background:
                        "linear-gradient(135deg, #5b6cf5 0%, #9333ea 100%)",
                      color: "white",
                    }}
                  >
                    <h3 style={{ color: "white" }}>
                      {event.title}
                    </h3>
                    <div style={{ marginTop: "15px" }}>
                      <p>
                        <strong>📅 Date:</strong> {event.date}
                      </p>
                      <p>
                        <strong>📍 Location:</strong>{" "}
                        {event.location}
                      </p>
                      <p>
                        <strong>👥 Expected:</strong>{" "}
                        {event.attendees.toLocaleString()}{" "}
                        attendees
                      </p>
                      <p>
                        <strong>💰 Price:</strong> {event.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Profile Section */}
            <div className="section">
              <h2 className="section-title">
                👤 User Profile Example
              </h2>
              <div className="card">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    className="avatar"
                    style={{
                      width: "80px",
                      height: "80px",
                      fontSize: "24px",
                      marginRight: "20px",
                    }}
                  >
                    JD
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: "24px",
                        marginBottom: "5px",
                      }}
                    >
                      John Doe
                    </h3>
                    <p style={{ color: "#6b7280" }}>@johndoe</p>
                    <p style={{ marginTop: "10px" }}>
                      Product designer passionate about creating
                      meaningful experiences. Love attending
                      tech meetups and design workshops.
                    </p>
                  </div>
                </div>
                <div className="event-details">
                  <div className="stat-item">
                    <div className="stat-value">45</div>
                    <div className="stat-label">Posts</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">12</div>
                    <div className="stat-label">
                      Events Attended
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">128</div>
                    <div className="stat-label">
                      Connections
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Overview */}
            <div className="section">
              <h2 className="section-title">
                💬 Messages Overview
              </h2>
              <div className="card">
                <h3>Recent Conversations</h3>
                <div style={{ marginTop: "15px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <div
                      className="avatar"
                      style={{ marginRight: "15px" }}
                    >
                      A
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: "600" }}>
                        Alice Wong
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#6b7280",
                        }}
                      >
                        Looking forward to the workshop
                        tomorrow!
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                      }}
                    >
                      2h ago
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <div
                      className="avatar"
                      style={{ marginRight: "15px" }}
                    >
                      B
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: "600" }}>
                        Bob Smith
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#6b7280",
                        }}
                      >
                        Thanks for connecting! Great meeting
                        you.
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                      }}
                    >
                      1d ago
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px 0",
                    }}
                  >
                    <div
                      className="avatar"
                      style={{ marginRight: "15px" }}
                    >
                      C
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: "600" }}>
                        Carol Davis
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#6b7280",
                        }}
                      >
                        The event was amazing! Let's plan
                        another one.
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                      }}
                    >
                      3d ago
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                textAlign: "center",
                marginTop: "40px",
                padding: "20px",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <p style={{ color: "#6b7280", fontSize: "14px" }}>
                This report was generated from the{" "}
                <strong>nexus</strong> platform.
                <br />
                For more information, visit our platform or
                contact support.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border">
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Generate PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}