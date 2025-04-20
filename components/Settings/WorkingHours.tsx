"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { DAYS } from "@/Constants/constants";
import { CheckCircle, Clock, Loader2 } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
interface WorkingHour {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}
const WorkingHours = () => {
  const [workingHours, setWorkingHours] = useState(
    DAYS.map(() => ({
      isOpen: false,
      openTime: "",
      closeTime: "",
    }))
  );

  const [savingHours, setSavingHours] = useState(false);

  // Handle changes to working hours for each day
  const handleWorkingHourChange = (
    index: number,
    field: keyof WorkingHour,
    value: string | boolean
  ) => {
    setWorkingHours((prevState) => {
      const updatedHours = [...prevState];

      // Explicitly cast the value to the correct type
      updatedHours[index][field] = value as WorkingHour[typeof field]; // Type assertion here

      return updatedHours;
    });
  };
  // Handle saving the working hours (e.g., API call)
  const handleSaveHours = () => {
    setSavingHours(true);
    // Simulate saving logic (e.g., API call)
    setTimeout(() => {
      setSavingHours(false);
    }, 2000); // Replace with real saving logic
  };

  return (
    <TabsContent value="hours" className="space-y-6 mt-6">
      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle>Working Hours</CardTitle>
          <CardDescription>
            Set your dealership's working hours for each day of the week.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {DAYS.map((day, index) => (
              <div
                key={day.value}
                className="grid grid-cols-12 gap-4 items-center py-3 px-4 rounded-lg hover:bg-gray-700"
              >
                <div className="col-span-3 md:col-span-2">
                  <div className="font-medium text-gray-300">{day.label}</div>
                </div>

                <div className="col-span-9 md:col-span-2 flex items-center">
                  <Checkbox
                    id={`is-open-${day.value}`}
                    checked={workingHours[index]?.isOpen}
                    onCheckedChange={(checked) => {
                      handleWorkingHourChange(index, "isOpen", checked);
                    }}
                  />
                  <Label
                    htmlFor={`is-open-${day.value}`}
                    className="ml-2 cursor-pointer text-gray-300"
                  >
                    {workingHours[index]?.isOpen ? "Open" : "Closed"}
                  </Label>
                </div>

                {workingHours[index]?.isOpen && (
                  <>
                    <div className="col-span-5 md:col-span-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <Input
                          type="time"
                          value={workingHours[index]?.openTime}
                          onChange={(e) =>
                            handleWorkingHourChange(
                              index,
                              "openTime",
                              e.target.value
                            )
                          }
                          className="text-sm bg-gray-700 text-white"
                        />
                      </div>
                    </div>

                    <div className="text-center col-span-1 text-gray-400">
                      to
                    </div>

                    <div className="col-span-5 md:col-span-3">
                      <Input
                        type="time"
                        value={workingHours[index]?.closeTime}
                        onChange={(e) =>
                          handleWorkingHourChange(
                            index,
                            "closeTime",
                            e.target.value
                          )
                        }
                        className="text-sm bg-gray-700 text-white"
                      />
                    </div>
                  </>
                )}

                {!workingHours[index]?.isOpen && (
                  <div className="col-span-11 md:col-span-8 text-gray-500 italic text-sm">
                    Closed all day
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSaveHours}
              disabled={savingHours}
              className="bg-gray-700 text-white hover:bg-gray-600"
            >
              {savingHours ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Save Working Hours
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default WorkingHours;
