import {useEffect, useState} from "react";
import PostCard from "./PostCard";
import emitter from "../../../../../emitter/eventEmitter";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../../ui/pagination";
import {Input} from "../../../../ui/input";
import {Button} from "../../../../ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "../../../../ui/select";
import {Calendar} from "../../../../ui/calendar";
import {Popover, PopoverContent, PopoverTrigger,} from "../../../../ui/popover";
import {CalendarIcon} from "lucide-react";
import {cn} from "../../../../../lib/utils";
import {format} from "date-fns";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Post {
  id: number;
  title: string;
  body: string;
  locationId: string;
  createdByUsername: string;
  createdAt: string;
  commentCount: number;
  likeCount: number;
  hasUpvoted: boolean;
  location: Location;
}

export interface Location {
  id: string;
  name: string;
  lon: number;
  lat: number;
  mainCategory: MainCategory;
  subCategories: SubCategory[];
  condition: LocationCondition;
  status: LocationStatus;
  additionalInformation: string
}

interface MainCategory {
  name: string;
  colorHex: string;
}

export interface SubCategory {
  name: string;
  colorHex: string;
}

export interface LocationCondition {
  id: number;
  name: string;
  colorHex: string;
}

export interface LocationStatus {
  id: number;
  name: string;
  colorHex: string;
}

interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refresh, setRefresh] = useState(0);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
  });
  const [searchCriteria, setSearchCriteria] = useState({
    title: "",
    body: "",
    createdByUsername: "",
    createdDateFrom: "",
    createdDateTo: "",
    sortBy: "id",
    sortDirection: "DESC",
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const handleIncrement = () => setRefresh((prev) => prev + 1);
    emitter.on("refreshPostList", handleIncrement);
    return () => {
      emitter.off("refreshPostList", handleIncrement);
    };
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        emitter.emit("startLoading");
        const userToken = localStorage.getItem("userToken");

        const queryParams = new URLSearchParams({
          title: searchCriteria.title,
          body: searchCriteria.body,
          createdByUsername: searchCriteria.createdByUsername,
          createdDateFrom: searchCriteria.createdDateFrom,
          createdDateTo: searchCriteria.createdDateTo,
          sortBy: searchCriteria.sortBy,
          sortDirection: searchCriteria.sortDirection,
          page: String(searchCriteria.page),
          pageSize: String(searchCriteria.pageSize),
        }).toString();

        const response = await fetch(`${apiUrl}/api/feed?${queryParams}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        });

        const data: PageResponse<Post> = await response.json();

        data.content.sort((a, b) => b.id - a.id);

        setPosts(data.content);
        setPagination({
          pageNumber: data.pageNumber,
          pageSize: data.pageSize,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        emitter.emit("stopLoading");
      }
    };

    fetchPosts();
  }, [refresh, searchCriteria]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePageChange = (page: number) => {
    setSearchCriteria((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setSearchCriteria((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg shadow-sm bg-white">
        <Input
          placeholder="Search by Title"
          value={searchCriteria.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
        />
        <Input
          placeholder="Search by Body"
          value={searchCriteria.body}
          onChange={(e) => handleInputChange("body", e.target.value)}
        />
        <Input
          placeholder="Created By Username"
          value={searchCriteria.createdByUsername}
          onChange={(e) =>
            handleInputChange("createdByUsername", e.target.value)
          }
        />
        <Select
          value={searchCriteria.sortBy}
          onValueChange={(value) => handleInputChange("sortBy", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id">ID</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="createdAt">Created Date</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={searchCriteria.sortDirection}
          onValueChange={(value) => handleInputChange("sortDirection", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort Direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ASC">Ascending</SelectItem>
            <SelectItem value="DESC">Descending</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal overflow-hidden",
                !searchCriteria.createdDateFrom && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {searchCriteria.createdDateFrom ? (
                format(searchCriteria.createdDateFrom, "PPP")
              ) : (
                <span>Pick a from date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={
                searchCriteria.createdDateFrom
                  ? new Date(searchCriteria.createdDateFrom)
                  : undefined
              }
              onSelect={(date) => {
                if (date) {
                  const dateString = date.toLocaleDateString("en-CA");
                  handleInputChange("createdDateFrom", dateString);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal overflow-hidden",
                !searchCriteria.createdDateTo && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {searchCriteria.createdDateTo ? (
                format(searchCriteria.createdDateTo, "PPP")
              ) : (
                <span>Pick a to date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={
                searchCriteria.createdDateTo
                  ? new Date(searchCriteria.createdDateTo)
                  : undefined
              }
              onSelect={(date) => {
                if (date) {
                  const dateString = date.toLocaleDateString("en-CA");
                  handleInputChange("createdDateTo", dateString);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button
          variant="default"
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setRefresh((prev) => prev + 1)}
        >
          Apply Filters
        </Button>
      </div>
      <div className="flex flex-col gap-y-4">
        {posts.map((post, key) => (
          <PostCard
            key={key}
            id={post.id}
            title={post.title}
            body={post.body}
            locationId={post.locationId}
            createdBy={post.createdByUsername}
            creatadAt={formatDate(post.createdAt)}
            commentCount={post.commentCount}
            likeCount={post.likeCount}
            hasUpvoted={post.hasUpvoted}
            locationName={post.location.name}
            lon={post.location.lon}
            lat={post.location.lat}
            mainCategoryName={post.location.mainCategory.name}
            mainCategoryHex={post.location.mainCategory.colorHex}
            subCategories={post.location.subCategories}
            condition={post.location.condition.name}
            status={post.location.status.name}
            additionalInformation={post.location.additionalInformation}
          />
        ))}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              size="sm"
              href="#"
              onClick={() =>
                pagination.pageNumber > 0 &&
                handlePageChange(pagination.pageNumber - 1)
              }
            />
          </PaginationItem>
          {pagination.totalPages > 0 &&
            Array.from({ length: pagination.totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  size="sm"
                  href="#"
                  onClick={() => handlePageChange(index)}
                  className={pagination.pageNumber === index ? "active" : ""}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          {pagination.totalPages > 5 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              size="sm"
              href="#"
              onClick={() =>
                pagination.pageNumber < pagination.totalPages - 1 &&
                handlePageChange(pagination.pageNumber + 1)
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
