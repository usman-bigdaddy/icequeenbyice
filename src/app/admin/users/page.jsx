"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CreateUser from "@/_components/ui/createuser";
import {
  fetchUsers,
  deleteUser,
  resetPassword,
} from "@/store/users/usersThunk";
import { useSelector, useDispatch } from "react-redux";
import {
  RefreshCw as RefreshIcon,
  Eye as EyeIcon,
  Key as KeyIcon,
  Trash2 as TrashIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
} from "lucide-react";
import DiamondLoader from "@/components/ui/DiamondLoader";

export default function UsersPage() {
  const [userType, setUserType] = useState("USER");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  const { user } = useSelector((state) => state.auth);
  const { users, loading, error } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const fetchUsersMemoized = useCallback(() => {
    dispatch(fetchUsers(userType));
    setIsRefreshing(false);
  }, [dispatch, userType]);

  useEffect(() => {
    fetchUsersMemoized();
  }, [fetchUsersMemoized]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchUsersMemoized();
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredUsers = sortedUsers.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleResetPassword = async (userId) => {
    if (confirm("Are you sure you want to reset this user's password?")) {
      dispatch(resetPassword(userId));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const SortIndicator = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return (
      <span className="ml-1">
        {sortConfig.direction === "asc" ? (
          <ChevronUpIcon className="h-3 w-3 inline" />
        ) : (
          <ChevronDownIcon className="h-3 w-3 inline" />
        )}
      </span>
    );
  };

  if (loading && !isRefreshing) {
    return <DiamondLoader />;
  }

  if (error) {
    return (
      <div className="p-4 text-rose-500 bg-rose-50 rounded-lg mx-4 flex items-center gap-4">
        <div>Error: {error}</div>
        <Button
          variant="outline"
          className="border-pink-200 hover:bg-pink-50"
          onClick={fetchUsersMemoized}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 mb-8 shadow-sm border border-pink-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-pink-900">
              User Management
            </h1>
            <p className="text-pink-700 mt-1">
              {filteredUsers.length} {userType.toLowerCase()}
              {filteredUsers.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-pink-200 hover:bg-pink-50"
            >
              <RefreshIcon
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            {user?.role === "ADMIN" && <CreateUser userRole={user?.role} />}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-pink-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-pink-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4 text-pink-500" />
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-pink-900 bg-white"
            >
              <option value="USER">Users</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-pink-100 overflow-hidden">
        <Table className="min-w-full divide-y divide-pink-100">
          <TableHeader className="bg-pink-50">
            <TableRow>
              <TableHead
                className="px-6 py-3 text-left text-xs font-medium text-pink-900 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("fullName")}
              >
                <div className="flex items-center">
                  User
                  <SortIndicator columnKey="fullName" />
                </div>
              </TableHead>
              <TableHead
                className="px-6 py-3 text-left text-xs font-medium text-pink-900 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center">
                  Email
                  <SortIndicator columnKey="email" />
                </div>
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-pink-900 uppercase tracking-wider">
                Role
              </TableHead>
              <TableHead
                className="px-6 py-3 text-left text-xs font-medium text-pink-900 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center">
                  Created
                  <SortIndicator columnKey="createdAt" />
                </div>
              </TableHead>
              <TableHead className="px-6 py-3 text-right text-xs font-medium text-pink-900 uppercase tracking-wider">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-pink-100">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-pink-50 transition-colors"
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                          !user.image ? "bg-pink-100 text-pink-800" : ""
                        }`}
                      >
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.fullName}
                            className="h-full w-full rounded-full object-cover border border-pink-200"
                          />
                        ) : (
                          <span className="font-medium">
                            {user.fullName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-pink-900">
                          {user.fullName}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-pink-700">
                    {user.email}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === "USER"
                          ? "bg-pink-100 text-pink-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="text-sm text-pink-700">
                      {formatDate(user.createdAt)}
                    </div>
                    <div className="text-xs text-pink-500">
                      {formatDateTime(user.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {user.role === "USER" ? (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="border-pink-500 text-pink-600 hover:bg-pink-50 hover:text-pink-700"
                        >
                          <Link
                            href={`/admin/orders/customer/${user.id}`}
                            className="flex items-center gap-1"
                          >
                            <EyeIcon className="h-4 w-4" />
                            <span>Orders</span>
                          </Link>
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-amber-500 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                            onClick={() => handleResetPassword(user.id)}
                          >
                            <KeyIcon className="h-4 w-4 mr-1" />
                            Reset
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-rose-500 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-pink-700 mb-4">
                      No users found matching your criteria
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setUserType("USER");
                      }}
                      className="border-pink-200 hover:bg-pink-50"
                    >
                      Clear filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
