"use client";
import React, { useState } from "react";

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const data = [
    {
      productName: 'Apple MacBook Pro 17"',
      color: "Silver",
      category: "Laptop",
      price: "$2999",
      status: "Confirmed",
    },
    {
      productName: "Dell XPS 15",
      color: "Black",
      category: "Laptop",
      price: "$1999",
      status: "Pending",
    },
    {
      productName: "HP Spectre x360",
      color: "Gray",
      category: "Laptop",
      price: "$1599",
      status: "Completed",
    },
    {
      productName: "Lenovo ThinkPad X1",
      color: "Black",
      category: "Laptop",
      price: "$1799",
      status: "Canceled",
    },
    {
      productName: "ASUS ZenBook 14",
      color: "Blue",
      category: "Laptop",
      price: "$1399",
      status: "No Show",
    },
  ];

  // Filtered and Sorted Data
  const filteredData = data.filter((item) => {
    const matchesQuery =
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.price.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter
      ? item.status === statusFilter
      : true;

    return matchesQuery && matchesStatus;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {/* Search and Status Filter */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 rounded-md bg-gray-800 border text-white placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="ml-4 px-3 py-2 rounded-md bg-gray-800 text-white focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Canceled">Canceled</option>
          <option value="No Show">No Show</option>
        </select>
      </div>

      {/* Table */}
      <table className="w-full text-sm text-left rtl:text-right text-gray-400">
        <thead className="sticky top-0 z-10 text-xs text-gray-400 uppercase bg-gray-900">
          <tr>
            <th className="px-6 py-3">Product name</th>
            <th className="px-6 py-3">Color</th>
            <th className="px-6 py-3">Category</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="scrollbar-hide">
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
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
                <td className="px-6 py-4">{item.status}</td>
                <td className="px-6 py-4">
                  <a
                    href="#"
                    className="font-medium text-blue-500 hover:underline"
                  >
                    Edit
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="text-center py-6 text-gray-500 italic"
              >
                No matching records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Page;
