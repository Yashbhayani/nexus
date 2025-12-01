import { useState, useEffect, useContext } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { OrganizationCard } from "../common/OrganizationCard";
import { StudentCard } from "../common/StudentCard";
import { Badge } from "../ui/badge";
import { Search, Grid3X3, List } from "lucide-react";
import { LoadingSpinner } from "../common/LoadingSpinner";
<<<<<<< HEAD
import {
  SkeletonOrganizationCard,
  SkeletonStudentCard,
} from "../common/SkeletonCard";
import APIContext from "../../Context/apimethods/APIContext";
import * as apiroute from "../../Context/API/ApiRouter";
=======
import { SkeletonOrganizationCard, SkeletonStudentCard } from "../common/SkeletonCard";
import * as apiroute from "../../Context/API/ApiRouter";
import APIContext from "../../Context/apimethods/APIContext";

>>>>>>> 905519b29a11611656f8fcf3c0a2cb37aeaed068

interface EventDiscoveryProps {
  onNavigate?: (screen: string, data?: any) => void;
}

export function EventDiscovery({ onNavigate }: EventDiscoveryProps) {
<<<<<<< HEAD
  const context = useContext(APIContext);
  const { GETFunction } = context;
=======

  const context = useContext(APIContext);
  const { GETFunction, DELETEFunction, PATCHFunctionParams } = context;

>>>>>>> 905519b29a11611656f8fcf3c0a2cb37aeaed068
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState<
    "all" | "organizations" | "students"
  >("all");

  const categories = [
    "all",
    "Academic",
    "Sports",
    "Arts",
    "Greek Life",
    "Service",
    "Cultural",
  ];
  const types = ["all", "organizations", "students"];
  const [dummyorganizations, setdummyOrganizations] = useState<any[]>([]);
  const [dumystudents, setdummyStudents] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState([
    {
      id: "org1",
      name: "Computer Science Club",
      image:
        "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=300&fit=crop",
      description:
        "Join fellow CS students for coding challenges, tech talks, and networking events.",
      category: "Academic",
      members: 156,
      location: "Engineering Building",
      isJoined: false,
    },
    {
      id: "org2",
      name: "Campus Basketball League",
      image:
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
      description:
        "Competitive and recreational basketball for all skill levels.",
      category: "Sports",
      members: 89,
      location: "Recreation Center",
      isJoined: true,
    },
    {
      id: "org3",
      name: "Art & Design Society",
      image:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
      description:
        "Creative community for artists, designers, and art enthusiasts.",
      category: "Arts",
      members: 67,
      location: "Art Building",
      isJoined: false,
    },
    {
      id: "org4",
      name: "Alpha Beta Gamma",
      image:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop",
      description:
        "Academic fraternity focused on leadership and community service.",
      category: "Greek Life",
      members: 45,
      location: "Greek Row",
      isJoined: false,
    },
    {
      id: "org5",
      name: "Volunteer Corps",
      image:
        "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop",
      description:
        "Make a difference in our community through organized volunteer work.",
      category: "Service",
      members: 123,
      location: "Student Union",
      isJoined: true,
    },
    {
      id: "org6",
      name: "International Student Association",
      image:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop",
      description:
        "Celebrating diversity and connecting students from around the world.",
      category: "Cultural",
      members: 234,
      location: "International Center",
      isJoined: false,
    },
  ]);

  const [students, setStudents] = useState([
    {
      id: "stu1",
      name: "Emily Chen",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b286?w=400&h=400&fit=crop",
      bio: "CS major passionate about AI and machine learning. Love to collaborate on projects!",
      year: "Junior",
      major: "Computer Science",
      interests: ["AI", "Web Dev", "Gaming"],
      location: "Engineering Quad",
      isFollowing: false,
    },
    {
      id: "stu2",
      name: "Marcus Johnson",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      bio: "Business student and basketball team captain. Always looking for new connections.",
      year: "Senior",
      major: "Business Administration",
      interests: ["Basketball", "Leadership", "Entrepreneurship"],
      location: "Business Building",
      isFollowing: true,
    },
    {
      id: "stu3",
      name: "Sophia Rodriguez",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      bio: "Art major specializing in digital design. Love exploring creative collaborations.",
      year: "Sophomore",
      major: "Fine Arts",
      interests: ["Digital Art", "Photography", "Design"],
      location: "Art Building",
      isFollowing: false,
    },
    {
      id: "stu4",
      name: "Alex Thompson",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      bio: "Psychology major interested in research and community mental health initiatives.",
      year: "Graduate",
      major: "Psychology",
      interests: ["Research", "Mental Health", "Community Service"],
      location: "Psychology Building",
      isFollowing: false,
    },
    {
      id: "stu5",
      name: "Sarah Kim",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      bio: "International student from South Korea studying Environmental Science.",
      year: "Junior",
      major: "Environmental Science",
      interests: ["Sustainability", "Climate Action", "Cultural Exchange"],
      location: "Science Building",
      isFollowing: true,
    },
    {
      id: "stu6",
      name: "David Martinez",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      bio: "Engineering student and fraternity member. Passionate about renewable energy.",
      year: "Senior",
      major: "Mechanical Engineering",
      interests: ["Engineering", "Greek Life", "Renewable Energy"],
      location: "Engineering Building",
      isFollowing: false,
    },
  ]);

  const filteredOrganizations = dummyorganizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || org.category === selectedCategory;

    const matchesType =
      selectedType === "all" || selectedType === "organizations";

    return matchesSearch && matchesCategory && matchesType;
  });

  const filteredStudents = dumystudents.filter((student) => {
    const search = searchTerm.toLowerCase();

    const name = student.name?.toLowerCase() || "";
    const bio = student.bio?.toLowerCase() || "";
    const major = student.major?.toLowerCase() || "";

    // ALWAYS an array (because API returns null sometimes)
    const interests: string[] = Array.isArray(student.skills)
      ? student.skills
      : [];

    // 🔍 Search filter
    const matchesSearch =
      name.includes(search) ||
      bio.includes(search) ||
      major.includes(search) ||
      interests.some((interests) => interests.toLowerCase().includes(search));

    // 🎭 Category Filter
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "Academic" &&
        (major.includes("computer") ||
          major.includes("engineering") ||
          major.includes("science"))) ||
      (selectedCategory === "Sports" &&
        interests.some(
          (s) =>
            s.toLowerCase().includes("basketball") ||
            s.toLowerCase().includes("sports")
        )) ||
      (selectedCategory === "Arts" &&
        (major.includes("art") ||
          interests.some(
            (s) =>
              s.toLowerCase().includes("art") ||
              s.toLowerCase().includes("design")
          ))) ||
      (selectedCategory === "Greek Life" &&
        interests.some((s) => s.toLowerCase().includes("greek"))) ||
      (selectedCategory === "Service" &&
        interests.some(
          (s) =>
            s.toLowerCase().includes("service") ||
            s.toLowerCase().includes("community")
        )) ||
      (selectedCategory === "Cultural" &&
        interests.some(
          (s) =>
            s.toLowerCase().includes("cultural") ||
            s.toLowerCase().includes("exchange")
        ));

    // 🎚️ Type Filter
    const matchesType = selectedType === "all" || selectedType === "students";

    return matchesSearch && matchesCategory && matchesType;
  });

  const allFiltered = [...filteredOrganizations, ...filteredStudents];

  const handleJoinOrganization = async (orgId: string) => {
    let parms = {
      OID: orgId,
    };
    const JoinOrg = await GETFunction(apiroute.joinorganizationurl, parms);

    await EexploreData();
  };

  const handleFollowStudent = (studentId: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? { ...student, isFollowing: !student.isFollowing }
          : student
      )
    );
  };

  const handleNavigateToOrganization = (orgId: string) => {
    onNavigate?.("organizationProfile", { organizationId: orgId });
  };

  const handleNavigateToStudent = (studentId: string) => {
    onNavigate?.("otherUserProfile", { userId: studentId });
  };

  useEffect(() => {
    const fetchData = async () => {
      await EexploreData();
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const EexploreData = async () => {
    const exdata = await GETFunction(apiroute.explore);

    // Normalize Organizations
    const normalizedOrgs = exdata.orgDate.map((org: any) => ({
      id: org.ID,
      name: org.Name,
      image: org.image,
      description: org.description || "",
      category: org.category || "General",
      members: org.members || 0,
      location: org.Location || "",
      isJoined: org.isJoined || false,
    }));

    // Normalize Students
    const normalizedStudents = exdata.userDate.map((stu: any) => ({
      id: stu.id,
      name: stu.name,
      image: stu.image,
      bio: stu.bio,
      year: stu.StudentType,
      major: stu.major,
      interests: Array.isArray(stu.skills) ? stu.skills : [],
      location: stu.Location,
      isFollowing: stu.isFollowing || false,
    }));

    setdummyOrganizations(normalizedOrgs);
    setdummyStudents(normalizedStudents);

    return true;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Campus Community</h1>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search organizations and students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Type Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {types.map((type) => (
              <Badge
                key={type}
                variant={selectedType === type ? "default" : "secondary"}
                className={`cursor-pointer whitespace-nowrap ${
                  selectedType === type
                    ? "bg-primary text-primary-foreground"
                    : ""
                }`}
                onClick={() =>
                  setSelectedType(type as "all" | "organizations" | "students")
                }
              >
                {type === "all"
                  ? "All"
                  : type === "organizations"
                  ? "Organizations"
                  : "Students"}
              </Badge>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={
                  selectedCategory === category ? "default" : "secondary"
                }
                className={`cursor-pointer whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === "all" ? "All Categories" : category}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">
        {isLoading ? (
          <div className="space-y-4">
            <SkeletonOrganizationCard />
            <SkeletonOrganizationCard />
            <SkeletonOrganizationCard />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                {allFiltered.length} results found
                {selectedType === "organizations" &&
                  ` (${filteredOrganizations.length} organizations)`}
                {selectedType === "students" &&
                  ` (${filteredStudents.length} students)`}
                {selectedType === "all" &&
                  ` (${filteredOrganizations.length} organizations, ${filteredStudents.length} students)`}
              </p>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredOrganizations.map((org) => (
                  <OrganizationCard
                    key={org.id}
                    organization={org}
                    onJoin={handleJoinOrganization}
                    variant="grid"
                    onNavigate={handleNavigateToOrganization}
                  />
                ))}
                {filteredStudents.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    onFollow={handleFollowStudent}
                    variant="grid"
                    onNavigate={handleNavigateToStudent}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrganizations.map((org) => (
                  <OrganizationCard
                    key={org.id}
                    organization={org}
                    onJoin={handleJoinOrganization}
                    variant="list"
                    onNavigate={handleNavigateToOrganization}
                  />
                ))}
                {filteredStudents.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    onFollow={handleFollowStudent}
                    variant="list"
                    onNavigate={handleNavigateToStudent}
                  />
                ))}
              </div>
            )}

            {allFiltered.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-2">No results found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
