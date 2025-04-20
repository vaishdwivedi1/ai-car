"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { CheckCircle, Loader2, Shield, Users, UserX } from "lucide-react";
import { useEffect, useState } from "react";

// UsersSettings Component
const UsersSettings = () => {
  // State Variables
  const [userSearch, setUserSearch] = useState("");
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [usersData, setUsersData] = useState<any>(null);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [updatingRole, setUpdatingRole] = useState(false);
  const [userToPromote, setUserToPromote] = useState<any>(null);
  const [userToDemote, setUserToDemote] = useState<any>(null);
  const [confirmAdminDialog, setConfirmAdminDialog] = useState(false);
  const [confirmRemoveDialog, setConfirmRemoveDialog] = useState(false);

  // Example function to handle making admin
  const handleMakeAdmin = () => {
    setUpdatingRole(true);
    // Logic to make user an admin goes here
    setTimeout(() => {
      setUpdatingRole(false);
      setConfirmAdminDialog(false);
    }, 2000); // Simulate async API call
  };

  // Example function to handle removing admin
  const handleRemoveAdmin = () => {
    setUpdatingRole(true);
    // Logic to remove user from admin goes here
    setTimeout(() => {
      setUpdatingRole(false);
      setConfirmRemoveDialog(false);
    }, 2000); // Simulate async API call
  };

  // Use Effect to fetch users (example logic)
  useEffect(() => {
    setFetchingUsers(true);
    // Simulate fetching data from API
    setTimeout(() => {
      setUsersData({
        success: true,
        data: [
          {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
            role: "USER",
            imageUrl: "",
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane.smith@example.com",
            role: "ADMIN",
            imageUrl: "",
          },
        ],
      });
      setFetchingUsers(false);
    }, 1000); // Simulate async API call
  }, []);

  // Filter users based on search query
  useEffect(() => {
    if (usersData?.data) {
      const result = usersData.data.filter((user: any) =>
        user.name.toLowerCase().includes(userSearch.toLowerCase())
      );
      setFilteredUsers(result);
    }
  }, [userSearch, usersData]);

  return (
    <TabsContent value="admins" className="mt-4">
      <Card className="bg-gray-800 border border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Admin Users</CardTitle>
          <CardDescription className="text-gray-400">
            Manage users with admin privileges.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 relative">
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-9 w-full bg-gray-700 text-white placeholder-gray-500 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </div>

          {fetchingUsers ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : usersData?.success && filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800 text-gray-400">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                            {user.imageUrl ? (
                              <img
                                src={user.imageUrl}
                                alt={user.name || "User"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Users className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <span>{user.name || "Unnamed User"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        <span
                          className={
                            user.role === "ADMIN"
                              ? "bg-green-800 text-white px-2 py-1 rounded-full"
                              : "bg-gray-800 text-white px-2 py-1 rounded-full"
                          }
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        {user.role === "ADMIN" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-gray-700 "
                            onClick={() => {
                              setUserToDemote(user);
                              setConfirmRemoveDialog(true);
                            }}
                            disabled={updatingRole}
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            Remove Admin
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-500 border-gray-700 "
                            onClick={() => {
                              setUserToPromote(user);
                              setConfirmAdminDialog(true);
                            }}
                            disabled={updatingRole}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Make Admin
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400">
              <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-1">
                No users found
              </h3>
              <p>
                {userSearch
                  ? "No users match your search criteria"
                  : "There are no users registered yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirm Make Admin Dialog */}
      <Dialog open={confirmAdminDialog} onOpenChange={setConfirmAdminDialog}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Admin Privileges</DialogTitle>
            <DialogDescription>
              Are you sure you want to give admin privileges to{" "}
              {userToPromote?.name || userToPromote?.email}? Admin users can
              manage all aspects of the dealership.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmAdminDialog(false)}
              disabled={updatingRole}
              className="text-gray-400 border-gray-700 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleMakeAdmin}
              disabled={updatingRole}
              className="bg-green-500 text-white border-gray-700 hover:bg-green-600"
            >
              {updatingRole ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Remove Admin Dialog */}
      <Dialog open={confirmRemoveDialog} onOpenChange={setConfirmRemoveDialog}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Remove Admin Privileges</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove admin privileges from{" "}
              {userToDemote?.name || userToDemote?.email}? They will no longer
              be able to access the admin dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmRemoveDialog(false)}
              disabled={updatingRole}
              className="text-gray-400 border-gray-700 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveAdmin}
              disabled={updatingRole}
              className="bg-red-600 text-white border-gray-700 hover:bg-red-700"
            >
              {updatingRole ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove Admin"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TabsContent>
  );
};

export default UsersSettings;
