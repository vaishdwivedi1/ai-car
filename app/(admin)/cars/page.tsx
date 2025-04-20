// "use client";

// export interface Car {
//   _id: string;
//   make: string;
//   model: string;
//   year: number;
//   color: string;
//   price: number;
//   status: "AVAILABLE" | "UNAVAILABLE" | "SOLD";
//   // Add other car properties as needed
// }
// import { useRouter } from "next/navigation";
// import React, { useState, useEffect } from "react";

// const Cars = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [cars, setCars] = useState<Car[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   const fetchCars = async () => {
//     try {
//       const response = await fetch("/api/cars", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(errorText || "Failed to fetch cars");
//       }

//       const data = await response.json();
//       console.log("Received data:", data, data.length, "cars");
//       setCars(data);
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setError(err.message || "Error loading cars");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCars();
//   }, []);

//   // Filter cars based on search query
//   const filteredCars = cars.filter((car) => {
//     const query = searchQuery.toLowerCase();
//     return (
//       car.make.toLowerCase().includes(query) ||
//       car.model.toLowerCase().includes(query) ||
//       car.color.toLowerCase().includes(query) ||
//       car.year.toString().includes(query) ||
//       car.price.toString().includes(query)
//     );
//   });

//   const handleEdit = (carId: string) => {
//     router.push(`/edit-car/${carId}`);
//   };

//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center text-white">
//         Loading cars...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="h-screen flex items-center justify-center text-red-500">
//         Error: {error}
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-900 text-white p-4">
//       {/* Header and Search */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//         <h1 className="text-2xl font-bold">Car Inventory</h1>
//         <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
//           <button
//             onClick={() => router.push("/add-car")}
//             className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
//           >
//             Add New Car
//           </button>
//           <input
//             type="text"
//             placeholder="Search cars..."
//             className="px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Cars Table */}
//       <div className="flex-1 overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead className="bg-gray-800">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                 Make
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                 Model
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                 Year
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                 Color
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                 Price
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-700">
//             {filteredCars.length > 0 ? (
//               filteredCars.map((car) => (
//                 <tr key={car._id} className="hover:bg-gray-800/50">
//                   <td className="px-6 py-4 whitespace-nowrap">{car.make}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">{car.model}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">{car.year}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">{car.color}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {car.price?.numberDecimal
//                       ? `$${car.price.numberDecimal}`
//                       : "N/A"}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs ${
//                         car.status === "AVAILABLE"
//                           ? "bg-green-500/20 text-green-400"
//                           : car.status === "SOLD"
//                           ? "bg-red-500/20 text-red-400"
//                           : "bg-yellow-500/20 text-yellow-400"
//                       }`}
//                     >
//                       {car.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <button
//                       onClick={() => handleEdit(car._id)}
//                       className="text-blue-400 hover:text-blue-300 mr-4"
//                     >
//                       Edit
//                     </button>
//                     <button className="text-red-400 hover:text-red-300">
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={7} className="px-6 py-4 text-center">
//                   No cars found matching your search
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Cars;

"use client";

export interface Car {
  _id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  price: number | null;
  status: "AVAILABLE" | "UNAVAILABLE" | "SOLD";
  featured: boolean;
  // Add other car properties as needed
}

import { formatCurrency } from "@/hooks/formatCurrency";
import { Edit, Eye, Star, StarOff, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

const Cars = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<boolean>(false);
  const router = useRouter();

  const fetchCars = async () => {
    try {
      const response = await fetch("/api/cars", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Fetch error:", errorText);
        throw new Error(errorText || "Failed to fetch cars");
      }

      const data = await response.json();
      setCars(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Error loading cars");
    } finally {
      setLoading(false);
    }
  };

  const updateCarStatus = async (carId: string, newStatus: Car["status"]) => {
    try {
      const response = await fetch(`/api/cars/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: carId,
          change: "status",
          value: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update car status");
      }

      setCars(
        cars.map((car) =>
          car._id === carId ? { ...car, status: newStatus } : car
        )
      );
      toast.success(`Changed status to ${newStatus}`);
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Error updating car status");
      setError(err.message || "Error updating car status");
    }
  };

  const toggleFeatured = async (carId: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/cars`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: carId,
          change: "featured",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update featured status");
      }

      setCars(
        cars.map((car) =>
          car._id === carId ? { ...car, featured: !currentFeatured } : car
        )
      );
      toast.success(
        currentFeatured ? "Remove from featured" : "Set to featured"
      );
    } catch (err) {
      console.error("Error updating featured status:", err);
      setError(err.message || "Error updating featured status");
      toast.error("Error updating featured status");
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Filter cars based on search query
  const filteredCars = cars.filter((car) => {
    const query = searchQuery.toLowerCase();
    return (
      car.make.toLowerCase().includes(query) ||
      car.model.toLowerCase().includes(query) ||
      car.color.toLowerCase().includes(query) ||
      car.year.toString().includes(query) ||
      (car.price ? car.price.toString().includes(query) : false)
    );
  });

  const handleEdit = (carId: string) => {
    router.push(`/add-car/${carId}`);
  };

  const deleteCar = async (carId: string) => {
    setDeletingId(true);
    try {
      const response = await fetch(`/api/cars/${carId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete car");
      }

      setCars(cars.filter((car) => car._id !== carId));
      toast.success("Car deleted successfully");
    } catch (err) {
      console.error("Error deleting car:", err);
      toast.error("Error deleting car");
      setError(err.message || "Error deleting car");
    } finally {
      setDeletingId(false);
    }
  };

  // Add a confirmation dialog before deleting
  const handleDelete = (carId: string) => {
    if (confirm("Are you sure you want to delete this car?")) {
      deleteCar(carId);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading cars...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-800 text-white p-4">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Car Inventory</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button
            onClick={() => router.push("/add-car")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Add New Car
          </button>
          <input
            type="text"
            placeholder="Search cars..."
            className="px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Cars Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Make
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Model
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Color
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Featured
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredCars.length > 0 ? (
              filteredCars.map((car) => (
                <tr key={car._id} className="hover:bg-gray-800/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {car.make} -{car.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{car.model}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{car.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{car.color}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatCurrency(car.price?.$numberDecimal || "0")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer">
                    <select
                      value={car.status}
                      onChange={(e) =>
                        updateCarStatus(
                          car._id,
                          e.target.value as Car["status"]
                        )
                      }
                      className={`px-2 py-1 rounded-md text-xs bg-gray-800 border ${
                        car.status === "AVAILABLE"
                          ? "border-green-500"
                          : car.status === "SOLD"
                          ? "border-red-500"
                          : "border-yellow-500"
                      }`}
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="UNAVAILABLE">Unavailable</option>
                      <option value="SOLD">Sold</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap  cursor-pointer">
                    <button
                      onClick={() => toggleFeatured(car._id, car.featured)}
                      className={`px-2 py-1 rounded-md text-xs  cursor-pointer ${
                        car.featured
                          ? "bg-blue-500 text-white"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {car.featured ? (
                        <Star className="h-5 w-5 text-amber-500 fill-amber-500  cursor-pointer" />
                      ) : (
                        <StarOff className="h-5 w-5 text-gray-400  cursor-pointer" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex">
                      <Eye
                        color="white"
                        className="mr-2 h-4 w-4 cursor-pointer"
                      />
                      <Edit
                        className="mr-2 h-4 w-4 cursor-pointer"
                        onClick={() => handleEdit(car._id)}
                        color="green"
                      />
                      <Trash2
                        className={`mr-2 h-4 w-4 cursor-pointer ${
                          deletingId === car._id ? "opacity-50" : ""
                        }`}
                        color="red"
                        onClick={() =>
                          deletingId !== car._id && handleDelete(car._id)
                        }
                        disabled={deletingId === car._id}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center">
                  No cars found matching your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cars;
