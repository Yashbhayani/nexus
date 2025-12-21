import { useState, useEffect, useContext } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { OrganizationCard } from "../common/OrganizationCard";
import { StudentCard } from "../common/StudentCard";
import { Badge } from "../ui/badge";
import { Search, Grid3X3, List } from "lucide-react";
import { LoadingSpinner } from "../common/LoadingSpinner";
import {
  SkeletonOrganizationCard,
  SkeletonStudentCard,
} from "../common/SkeletonCard";
import APIContext from "../../Context/apimethods/APIContext";
import * as apiroute from "../../Context/API/ApiRouter";

interface EventDiscoveryProps {
  onNavigate?: (screen: string, data?: any) => void;
}

export function EventDiscovery({ onNavigate }: EventDiscoveryProps) {
  const context = useContext(APIContext);
  const { GETFunction } = context;
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
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || org.category === selectedCategory;

    const matchesType =
      selectedType === "all" || selectedType === "organizations";

    return matchesSearch && matchesCategory && matchesType;
  });

  const filteredStudents = students.filter((student) => {
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
    // ⭐ Immediately update UI without API reload
    setOrganizations((prev) =>
      prev.map((org) =>
        org.id === orgId ? { ...org, isJoined: !org.isJoined } : org
      )
    );
  };

  const handleFollowStudent = async (studentId: string) => {
    let parms = {
      UserID: studentId,
    };
    const FollowUser = await GETFunction(apiroute.followuser, parms);
    // ⭐ If you want to keep main students list in sync also update:
    setStudents((prev) =>
      prev.map((stu) =>
        stu.id === studentId ? { ...stu, isFollowing: !stu.isFollowing } : stu
      )
    );
  };

  const handleNavigateToOrganization = (orgId: any) => {
    onNavigate?.("organizationProfile", { organizationId: orgId });
  };

  const handleNavigateToStudent = (studentId: any) => {
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

    setOrganizations(normalizedOrgs);
    setStudents(normalizedStudents);

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
