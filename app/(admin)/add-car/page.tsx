"use client";

import { useState } from "react";
import z from "zod";
import AIForm from "@/components/add-car/AIForm";
import Manual from "@/components/add-car/Manual";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";


// Define form schema with Zod
export const carFormSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().refine((val) => {
    const year = parseInt(val);
    return !isNaN(year) && year >= 1900 && year <= new Date().getFullYear() + 1;
  }, "Valid year required"),
  price: z.string().min(1, "Price is required"),
  mileage: z.string().min(1, "Mileage is required"),
  color: z.string().min(1, "Color is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  transmission: z.string().min(1, "Transmission is required"),
  bodyType: z.string().min(1, "Body type is required"),
  seats: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.enum(["AVAILABLE", "UNAVAILABLE", "SOLD"]),
  featured: z.boolean().default(false),
  // Images are handled separately
});


const AddCarForm = () => {
  const [activeTab, setActiveTab] = useState("manual");
  const form = useForm({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      make: "",
      model: "",
      year: "",
      price: "",
      mileage: "",
      color: "",
      fuelType: "",
      transmission: "",
      bodyType: "",
      seats: "",
      description: "",
      status: "AVAILABLE",
      featured: false,
    },
  });
  return (
    <Tabs
      defaultValue="ai"
      value={activeTab}
      onValueChange={setActiveTab}
      className="mt-6"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        <TabsTrigger value="ai">AI Upload</TabsTrigger>
      </TabsList>

      <TabsContent
        value="manual"
        className="mt-6 bg-gray-800 text-white flex flex-1 overflow-hidden"
      >
        {" "}
        <Manual form={form} />
      </TabsContent>
      <TabsContent value="ai" className="mt-6 max-h-[80vh] overflow-y-auto">
        <AIForm form={form} setActiveTab={setActiveTab} />
      </TabsContent>
    </Tabs>
  );
};
export default AddCarForm;
