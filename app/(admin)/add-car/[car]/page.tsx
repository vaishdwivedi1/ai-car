"use client";

import Manual from "@/components/add-car/Manual";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { carFormSchema } from "../page";

const AddCarForm = () => {
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
  return <Manual form={form} />;
};
export default AddCarForm;
