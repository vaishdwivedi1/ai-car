"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Cars = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  // Sample data (replace with your actual data)
  const data = [
    {
      productName: 'Apple MacBook Pro 17"',
      color: "Silver",
      category: "Laptop",
      price: "$2999",
    },
    {
      productName: "Dell XPS 15",
      color: "Black",
      category: "Laptop",
      price: "$1999",
    },
    // Add more data as needed
  ];

  // Filter data based on search query
  const filteredData = data.filter(
    (item) =>
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.price.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col text-white">
      {/* Header or other content (optional) */}

      {/* Search bar */}
      <div className="p-4 flex justify-between items-center">
        <div
          onClick={() => router.push("/add-car")}
          className="p-2 text-md font-bold text-center border border-gray-700 w-[100px] cursor-pointer"
        >
          Add Car
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="p-2 w-full text-gray-900 bg-gray-200 rounded max-w-[250px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <br />

      {/* Table wrapper that grows and scrolls */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-400">
          <thead className="sticky top-0 z-10 text-xs text-gray-400 uppercase bg-gray-900">
            <tr>
              <th className="px-6 py-3">Product name</th>
              <th className="px-6 py-3">Color</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="scrollbar-hide">
            {filteredData.map((item, index) => (
              <tr
                key={index}
                className="odd:bg-gray-800 even:bg-gray-700 border-b border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-white whitespace-nowrap"
                >
                  {item.productName}
                </th>
                <td className="px-6 py-4">{item.color}</td>
                <td className="px-6 py-4">{item.category}</td>
                <td className="px-6 py-4">{item.price}</td>
                <td className="px-6 py-4">
                  <a
                    href="#"
                    className="font-medium text-blue-500 hover:underline"
                  >
                    Edit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cars;
