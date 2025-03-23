import { useEffect, useState } from "react";
import emitter from "../../../emitter/eventEmitter";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Button } from "../../ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

const apiUrl = import.meta.env.VITE_API_URL;

export interface User {
  email: string;
  username: string;
  role: string;
  points: number;
}

interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [refresh, setRefresh] = useState(0);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
  });
  const [searchCriteria, setSearchCriteria] = useState({
    username: "",
    role: "",
    minPoints: 0,
    sortBy: "id",
    sortDirection: "DESC",
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        emitter.emit("startLoading");
        const userToken = localStorage.getItem("userToken");

        const queryParams = new URLSearchParams({
          username: searchCriteria.username,
          role: searchCriteria.role,
          minPoints: String(searchCriteria.minPoints),
          sortBy: searchCriteria.sortBy,
          sortDirection: searchCriteria.sortDirection,
          page: String(searchCriteria.page),
          pageSize: String(searchCriteria.pageSize),
        }).toString();

        const response = await fetch(
          `${apiUrl}/api/profile/allUsers?${queryParams}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data: PageResponse<User> = await response.json();

        setUsers(data.content);
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
    <div className="flex justify-center items-center">
      <div className="max-w-[1440px] w-full py-24">
        <div className="flex flex-col gap-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg shadow-sm bg-white">
            <Input
              placeholder="Username"
              value={searchCriteria.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
            />
            <Input
              placeholder="Role"
              value={searchCriteria.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
            />
            <Input
              placeholder="Minimum Points"
              value={searchCriteria.minPoints}
              onChange={(e) => handleInputChange("minPoints", e.target.value)}
            />
            <Select
              value={searchCriteria.sortBy}
              onValueChange={(value) => handleInputChange("sortBy", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="username">Username</SelectItem>
                <SelectItem value="role">Role</SelectItem>
                <SelectItem value="points">Points</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={searchCriteria.sortDirection}
              onValueChange={(value) =>
                handleInputChange("sortDirection", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort Direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASC">Ascending</SelectItem>
                <SelectItem value="DESC">Descending</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setRefresh((prev) => prev + 1)}
            >
              Apply Filters
            </Button>
          </div>
          <div className="flex flex-col gap-y-4">
            {users.map((user, key) => (
              <div
                key={key}
                className="flex flex-row gap-6 p-4 rounded-lg shadow-sm bg-white border hover:shadow-xl transition-shadow duration-200 ease-in-out"
              >
                <div className="flex-shrink-0">
                  <Avatar className="w-20 h-20 rounded-full border-2 border-slate-300">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="User Avatar"
                      className="object-cover w-full h-full rounded-full"
                    />
                    <AvatarFallback className="bg-gray-300 text-gray-800 flex items-center justify-center w-full h-full text-lg">
                      {user.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex flex-col justify-between gap-2 w-full">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-slate-800">
                      {user.username}
                    </h3>
                    {/*<p className="text-sm text-gray-500">{user.email}</p>*/}
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-slate-600">
                      Role: <span className="font-medium">{user.role}</span>
                    </p>
                    <p className="text-sm text-slate-600">
                      Points: <span className="font-medium">{user.points}</span>
                    </p>
                  </div>
                </div>
              </div>
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
                      className={
                        pagination.pageNumber === index ? "active" : ""
                      }
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
      </div>
    </div>
  );
}
