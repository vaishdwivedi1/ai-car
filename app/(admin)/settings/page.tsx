import UsersSettings from "@/components/Settings/UsersSettings";
import WorkingHours from "@/components/Settings/WorkingHours";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Shield } from "lucide-react";

function Settings() {
  return (
    <Tabs defaultValue="hours">
      <TabsList className="bg-gray-800 border border-gray-600">
        <TabsTrigger
          value="hours"
          className="text-black bg-gray-800 hover:bg-gray-600 active:bg-white active:text-white px-4 py-2 transition-colors duration-300 rounded-t-md"
        >
          <Clock className="h-4 w-4 mr-2 text-gray-400" />
          Working Hours
        </TabsTrigger>
        <TabsTrigger
          value="admins"
          className="text-black bg-gray-800 hover:bg-gray-600 active:bg-white active:text-white px-4 py-2 transition-colors duration-300 rounded-t-md"
        >
          <Shield className="h-4 w-4 mr-2 text-gray-400" />
          Admin Users
        </TabsTrigger>
      </TabsList>

      <WorkingHours />

      <UsersSettings />
    </Tabs>
  );
}

export default Settings;
