"use client";

import { Loader2, Upload, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { carFormSchema } from "@/app/(admin)/add-car/page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import {
  bodyTypes,
  carStatuses,
  fuelTypes,
  transmissions,
} from "@/Constants/constants";

type CarFormValues = z.infer<typeof carFormSchema>;

interface ManualFormProps {
  form: UseFormReturn<CarFormValues>;
}
const Manual = ({ form }: ManualFormProps) => {
  const router = useRouter();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageError, setImageError] = useState("");
  const [addCarLoading, setAddCarLoading] = useState(false);
  const params = useParams();
  const carId = params?.car;

  const {
    register,
    setValue,
    getValues,
    formState: { errors },
    handleSubmit,
    watch,
  } = form;

  const onMultiImagesDrop = useCallback(
    (acceptedFiles: any[]) => {
      const validFiles = acceptedFiles.filter((file) => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} exceeds 5MB limit and will be skipped`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);

        if (progress >= 100) {
          clearInterval(interval);
          const newImages: {
            file: any;
            preview: string | ArrayBuffer | null | undefined;
          }[] = [];

          validFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              newImages.push({
                file,
                preview: e?.target?.result,
              });

              if (newImages.length === validFiles.length) {
                setUploadedImages((prev) => [...prev, ...newImages]);
                setValue("images", [
                  ...(getValues("images") || []),
                  ...newImages.map((img) => img.preview),
                ]);
                setUploadProgress(0);
                setImageError("");
                toast.success(
                  `Successfully uploaded ${validFiles.length} images`
                );
              }
            };
            reader.readAsDataURL(file);
          });
        }
      }, 200);
    },
    [getValues, setValue]
  );
  const {
    getRootProps: getMultiImageRootProps,
    getInputProps: getMultiImageInputProps,
  } = useDropzone({
    onDrop: onMultiImagesDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
  });
  const removeImage = (index: number) => {
    setUploadedImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      setValue(
        "images",
        newImages.map((img) => img?.preview)
      );
      return newImages;
    });
  };

  const formImages = watch("images") || [];

  async function onSubmit(data: any) {
    setAddCarLoading(true);

    // Combine AI image (if exists) with manually uploaded images
    const allImages = [
      ...formImages,
      ...uploadedImages.map((img) => img?.preview),
    ].filter(Boolean);

    if (allImages.length === 0) {
      setImageError("Please upload at least one image");
      setAddCarLoading(false);
      return;
    }

    // Clean price value (remove $ and commas)
    const cleanPrice = data.price.replace(/[$,]/g, "");
    const cleanMileage = data.mileage.replace(/[,]/g, "");

    const carData = {
      ...data,
      year: parseInt(data.year),
      price: parseFloat(cleanPrice),
      mileage: parseInt(cleanMileage),
      seats: data.seats ? parseInt(data.seats) : null,
      images: allImages, // Use combined images array
    };

    try {
      const url = carId ? `/api/cars/${carId}` : "/api/cars";
      const method = carId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(carData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || `Failed to ${carId ? "update" : "create"} car`
        );
      }

      toast.success(`Car ${carId ? "updated" : "created"} successfully!`);
      router.push("/cars");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error.message || `Failed to ${carId ? "update" : "create"} car`
      );
    } finally {
      setAddCarLoading(false);
    }
  }

  const fetchCarData = async () => {
    if (!carId) return;

    try {
      const res = await fetch(`/api/cars/${carId}`);
      if (!res.ok) throw new Error("Failed to fetch car data");

      const car = await res.json();
      console.log(car); // Log the fetched car data

      form.reset({
        make: car.make,
        model: car.model,
        year: car.year?.toString(),
        price: car.price?.toString(),
        mileage: car.mileage?.toString(),
        color: car.color,
        fuelType: car.fuelType,
        transmission: car.transmission,
        bodyType: car.bodyType,
        seats: car.seats?.toString() || "",
        status: car.status,
        description: car.description,
        images: car.images || [],
      });

      setUploadedImages(
        (car.images || [])?.map((img: string) => ({
          file: null,
          preview: img,
        }))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to load car data");
    }
  };

  useEffect(() => {
    fetchCarData();
  }, [carId]);
  return (
    <Card className="bg-gray-900 text-white flex flex-1">
      <CardHeader>
        <CardTitle className="text-white">Car Details</CardTitle>
        <CardDescription className="text-gray-400">
          Enter the details of the car you want to add.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col h-screen overflow-y-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex flex-col overflow-hidden"
        >
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Make */}
              <div className="space-y-2">
                <Label htmlFor="make" className="text-white">
                  Make
                </Label>
                <Input
                  id="make"
                  {...register("make")}
                  placeholder="e.g. Toyota"
                  className={`bg-gray-700 text-white ${
                    errors.make ? "border-red-500" : "border-gray-600"
                  }`}
                />
                {errors.make && (
                  <p className="text-xs text-red-500">{errors.make.message}</p>
                )}
              </div>

              {/* Model */}
              <div className="space-y-2">
                <Label htmlFor="model" className="text-white">
                  Model
                </Label>
                <Input
                  id="model"
                  {...register("model")}
                  placeholder="e.g. Camry"
                  className={`bg-gray-700 text-white ${
                    errors.model ? "border-red-500" : "border-gray-600"
                  }`}
                />
                {errors.model && (
                  <p className="text-xs text-red-500">{errors.model.message}</p>
                )}
              </div>

              {/* Year */}
              <div className="space-y-2">
                <Label htmlFor="year" className="text-white">
                  Year
                </Label>
                <Input
                  id="year"
                  {...register("year")}
                  placeholder="e.g. 2022"
                  className={`bg-gray-700 text-white ${
                    errors.year ? "border-red-500" : "border-gray-600"
                  }`}
                />
                {errors.year && (
                  <p className="text-xs text-red-500">{errors.year.message}</p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-white">
                  Price ($)
                </Label>
                <Input
                  id="price"
                  {...register("price")}
                  placeholder="e.g. 25000"
                  className={`bg-gray-700 text-white ${
                    errors.price ? "border-red-500" : "border-gray-600"
                  }`}
                />
                {errors.price && (
                  <p className="text-xs text-red-500">{errors.price.message}</p>
                )}
              </div>

              {/* Mileage */}
              <div className="space-y-2">
                <Label htmlFor="mileage" className="text-white">
                  Mileage
                </Label>
                <Input
                  id="mileage"
                  {...register("mileage")}
                  placeholder="e.g. 15000"
                  className={`bg-gray-700 text-white ${
                    errors.mileage ? "border-red-500" : "border-gray-600"
                  }`}
                />
                {errors.mileage && (
                  <p className="text-xs text-red-500">
                    {errors.mileage.message}
                  </p>
                )}
              </div>

              {/* Color */}
              <div className="space-y-2">
                <Label htmlFor="color" className="text-white">
                  Color
                </Label>
                <Input
                  id="color"
                  {...register("color")}
                  placeholder="e.g. Blue"
                  className={`bg-gray-700 text-white ${
                    errors.color ? "border-red-500" : "border-gray-600"
                  }`}
                />
                {errors.color && (
                  <p className="text-xs text-red-500">{errors.color.message}</p>
                )}
              </div>

              {/* Fuel Type */}
              <div className="space-y-2">
                <Label htmlFor="fuelType" className="text-white">
                  Fuel Type
                </Label>
                <Select
                  onValueChange={(value) => setValue("fuelType", value)}
                  defaultValue={getValues("fuelType")}
                >
                  <SelectTrigger
                    className={`bg-gray-700 text-white ${
                      errors.fuelType ? "border-red-500" : "border-gray-600"
                    }`}
                  >
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fuelType && (
                  <p className="text-xs text-red-500">
                    {errors.fuelType.message}
                  </p>
                )}
              </div>

              {/* Transmission */}
              <div className="space-y-2">
                <Label htmlFor="transmission" className="text-white">
                  Transmission
                </Label>
                <Select
                  onValueChange={(value) => setValue("transmission", value)}
                  defaultValue={getValues("transmission")}
                >
                  <SelectTrigger
                    className={`bg-gray-700 text-white ${
                      errors.transmission ? "border-red-500" : "border-gray-600"
                    }`}
                  >
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    {transmissions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.transmission && (
                  <p className="text-xs text-red-500">
                    {errors.transmission.message}
                  </p>
                )}
              </div>

              {/* Body Type */}
              <div className="space-y-2">
                <Label htmlFor="bodyType" className="text-white">
                  Body Type
                </Label>
                <Select
                  onValueChange={(value) => setValue("bodyType", value)}
                  defaultValue={getValues("bodyType")}
                >
                  <SelectTrigger
                    className={`bg-gray-700 text-white ${
                      errors.bodyType ? "border-red-500" : "border-gray-600"
                    }`}
                  >
                    <SelectValue placeholder="Select body type" />
                  </SelectTrigger>
                  <SelectContent>
                    {bodyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.bodyType && (
                  <p className="text-xs text-red-500">
                    {errors.bodyType.message}
                  </p>
                )}
              </div>

              {/* Seats */}
              <div className="space-y-2">
                <Label htmlFor="seats" className="text-white">
                  Number of Seats{" "}
                  <span className="text-sm text-gray-500">(Optional)</span>
                </Label>
                <Input
                  id="seats"
                  {...register("seats")}
                  placeholder="e.g. 5"
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status" className="text-white">
                  Status
                </Label>
                <Select
                  onValueChange={(value) => setValue("status", value)}
                  defaultValue={getValues("status")}
                >
                  <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {carStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 mt-6">
              <Label htmlFor="description" className="text-white">
                Description
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Enter detailed description of the car..."
                className={`bg-gray-700 text-white ${
                  errors.description ? "border-red-500" : "border-gray-600"
                }`}
              />
              {errors.description && (
                <p className="text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Featured */}
            <div className="flex items-start space-x-3 space-y-0 rounded-md border bg-gray-700 text-white p-4 mt-6">
              <Checkbox
                id="featured"
                checked={watch("featured")}
                onCheckedChange={(checked) => {
                  setValue("featured", checked);
                }}
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor="featured" className="text-white">
                  Feature this car
                </Label>
                <p className="text-sm text-gray-400">
                  Featured cars appear on the homepage
                </p>
              </div>
            </div>

            {/* Image Upload with Dropzone */}
            <div className="mt-6">
              <Label
                htmlFor="images"
                className={imageError ? "text-red-500" : "text-white"}
              >
                Images {imageError && <span className="text-red-500">*</span>}
              </Label>
              <div className="mt-2">
                <div
                  {...getMultiImageRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-600 transition ${
                    imageError ? "border-red-500" : "border-gray-500"
                  }`}
                >
                  <input {...getMultiImageInputProps()} />
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="h-12 w-12 text-gray-400 mb-3" />
                    <span className="text-sm text-gray-500">
                      Drag & drop or click to upload multiple images
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      (JPG, PNG, WebP, max 5MB each)
                    </span>
                  </div>
                </div>
                {imageError && (
                  <p className="text-xs text-red-500">{imageError}</p>
                )}
                {uploadProgress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}

                <div className="mt-4">
                  {(uploadedImages.length > 0 || formImages.length > 0) && (
                    <div className="mt-4">
                      <Label className="text-white">Uploaded Images</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        {uploadedImages.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <Image
                              src={img}
                              alt={`upload-${idx}`}
                              width={200}
                              height={150}
                              className="rounded border border-gray-600 w-full"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white hover:bg-red-600"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}

                        {formImages.map((img, index) => (
                          <div key={`ai-${index}`} className="relative">
                            <Image
                              src={img || ""}
                              alt={`upload-${index}`}
                              width={200}
                              height={150}
                              className="rounded border border-gray-600 w-full"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Fixed Submit Button */}

            <div className="border-t border-gray-700 pt-4 mt-4">
              <Button type="submit" className="w-full">
                {addCarLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {carId ? "Updating Car" : "Adding Car..."}
                  </>
                ) : carId ? (
                  "Update Car"
                ) : (
                  "Add Car"
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default Manual;
