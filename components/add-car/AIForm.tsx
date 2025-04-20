"use client";
import { carFormSchema } from "@/app/(admin)/add-car/page";
import { processCarImageWithAI } from "@/app/api/cars/route";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Camera, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type CarFormValues = z.infer<typeof carFormSchema>;

interface AIFormProps {
  form: UseFormReturn<CarFormValues>;
  setActiveTab: (tab: string) => void;
}
const AIForm = ({ form, setActiveTab }: AIFormProps) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedAiImage, setUploadedAiImage] = useState(null);
  const [processImageLoading, setProcessImageLoading] = useState(false);
  const { setValue } = form;

  // Process image with Gemini AI
  const processWithAI = async () => {
    if (!uploadedAiImage) {
      toast.error("Please upload an image first");
      return;
    }

    try {
      setProcessImageLoading(true);
      const res = await processCarImageWithAI(uploadedAiImage);
      console.log(res);

      // Set form values from AI response
      if (res) {
        setValue("make", res?.data?.make);
        setValue("model", res?.data?.model);
        setValue("year", res?.data?.year?.toString());
        setValue("color", res?.data?.color);
        setValue("fuelType", res?.data?.fuelType);
        setValue("transmission", res?.data?.transmission);
        setValue("bodyType", res?.data?.bodyType);
        setValue("mileage", res?.data?.mileage?.toString());
        setValue("price", res?.data?.price?.toString());
        setValue("description", res?.data?.description);

        // Set the AI image to form's images array
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageDataUrl = e.target?.result as string;
          setValue("images", [imageDataUrl]); // Set as array with the AI image
        };
        reader.readAsDataURL(uploadedAiImage);

        // Switch to manual tab
        setActiveTab("manual");
        toast.success("AI details loaded! Review and complete the form");
      }
    } catch (error) {
      toast.error("Failed to process image with AI");
    } finally {
      setProcessImageLoading(false);
    }
  };

  // Handle AI image upload with Dropzone
  const onAiDrop = useCallback((acceptedFiles: any[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploadedAiImage(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e?.target?.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps: getAiRootProps, getInputProps: getAiInputProps } =
    useDropzone({
      onDrop: onAiDrop,
      accept: {
        "image/*": [".jpeg", ".jpg", ".png", ".webp"],
      },
      maxFiles: 1,
      multiple: false,
    });

  return (
    <Card className="bg-gray-900 text-white border-gray-700">
      <CardHeader>
        <CardTitle>AI-Powered Car Details Extraction</CardTitle>
        <CardDescription className="text-gray-400">
          Upload an image of a car and let Gemini AI extract its details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
            {imagePreview ? (
              <div className="flex flex-col items-center">
                <img
                  src={imagePreview}
                  alt="Car preview"
                  className="max-h-56 max-w-full object-contain mb-4"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setImagePreview(null);
                      setUploadedAiImage(null);
                    }}
                    className="border-gray-500 text-black hover:bg-gray-700"
                  >
                    Remove
                  </Button>
                  <Button
                    onClick={processWithAI}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {processImageLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-4 w-4" />
                        Extract Details
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div
                {...getAiRootProps()}
                className="cursor-pointer hover:bg-gray-800 transition p-4 rounded-lg"
              >
                <input {...getAiInputProps()} />
                <div className="flex flex-col items-center justify-center">
                  <Camera className="h-12 w-12 text-gray-400 mb-3" />
                  <span className="text-sm text-gray-300">
                    Drag & drop or click to upload a car image
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    (JPG, PNG, WebP, max 5MB)
                  </span>
                </div>
              </div>
            )}
          </div>

          {processImageLoading && (
            <div className="bg-blue-900 text-blue-200 p-4 rounded-md flex items-center">
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">Analyzing image...</p>
                <p className="text-sm">Gemini AI is extracting car details</p>
              </div>
            </div>
          )}

          <div className="bg-gray-800 p-4 rounded-md">
            <h3 className="font-medium mb-2">How it works</h3>
            <ol className="space-y-2 text-sm text-gray-300 list-decimal pl-4">
              <li>Upload a clear image of the car</li>
              <li>Click "Extract Details" to analyze with Gemini AI</li>
              <li>Review the extracted information</li>
              <li>Fill in any missing details manually</li>
              <li>Add the car to your inventory</li>
            </ol>
          </div>

          <div className="bg-yellow-900 p-4 rounded-md">
            <h3 className="font-medium text-yellow-300 mb-1">
              Tips for best results
            </h3>
            <ul className="space-y-1 text-sm text-yellow-200">
              <li>• Use clear, well-lit images</li>
              <li>• Try to capture the entire vehicle</li>
              <li>• For difficult models, use multiple views</li>
              <li>• Always verify AI-extracted information</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIForm;
