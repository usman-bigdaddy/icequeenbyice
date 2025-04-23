"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PencilIcon,
  TrashIcon,
  DotsVerticalIcon,
  PlusIcon,
  RefreshIcon,
  SearchIcon,
  FilterIcon,
} from "@heroicons/react/outline";
import ConfirmAlert from "@/_components/ui/confirmAlert";
import Product from "@/_components/ui/product";
import Image from "next/image";
import DiamondLoader from "@/components/ui/DiamondLoader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";

const Page = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/products2");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products
    .filter((product) => {
      if (filter === "featured") return product.featured;
      if (filter === "bestSeller") return product.bestSeller;
      if (filter === "trending") return product.trending;
      if (filter === "lowStock") return product.quantity < 10;
      return true;
    })
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "priceHigh") return b.price - a.price;
      if (sort === "priceLow") return a.price - b.price;
      return 0;
    });

  if (isLoading) {
    return <DiamondLoader />;
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 mb-8 shadow-sm border border-pink-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-pink-900">
              Manage Products
            </h1>
            <p className="text-pink-700 mt-1">
              {products.length} {products.length === 1 ? "product" : "products"}{" "}
              available
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchProducts}
              className="text-pink-700 border-pink-200 hover:bg-pink-50"
            >
              <RefreshIcon className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Product
              triggerStyle="mt-0 text-white font-medium text-sm bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 rounded-lg hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-200"
              btnTxt="Add Product"
              btnStyle="w-full text-white font-semibold text-md bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-3 rounded-lg hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-200"
              triggerTxt="Add Product"
              onSuccess={fetchProducts} // Refresh list after adding
            />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 bg-white p-4 rounded-xl border border-pink-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-pink-400" />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10 border-pink-200 focus:ring-pink-500 focus:border-pink-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <FilterIcon className="h-4 w-4 text-pink-500" />
            <select
              className="border border-pink-200 rounded-md px-3 py-2 text-sm focus:ring-pink-500 focus:border-pink-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Products</option>
              <option value="featured">Featured</option>
              <option value="bestSeller">Best Sellers</option>
              <option value="trending">Trending</option>
              <option value="lowStock">Low Stock</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Label className="text-sm text-pink-700">Sort by:</Label>
            <select
              className="border border-pink-200 rounded-md px-3 py-2 text-sm focus:ring-pink-500 focus:border-pink-500"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="priceLow">Price: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-pink-100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-full divide-y divide-pink-100">
            <TableHeader className="bg-pink-50">
              <TableRow>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-pink-900 uppercase tracking-wider">
                  Product
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-pink-900 uppercase tracking-wider">
                  Details
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-pink-900 uppercase tracking-wider">
                  Inventory
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-pink-900 uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-medium text-pink-900 uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-pink-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow
                    key={product.id}
                    className="hover:bg-pink-50 transition-colors"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden border border-pink-200">
                          <Image
                            src={
                              product.images[0] || "/placeholder-product.jpg"
                            }
                            alt={product.name}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-pink-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-pink-600">
                            ₦{product.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-4">
                      <div className="space-y-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-sm text-pink-700 line-clamp-2">
                                {product.description}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs bg-white border border-pink-200 shadow-lg rounded-lg p-3 text-pink-700">
                              {product.description}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <div className="text-xs text-pink-500">
                          Added:{" "}
                          {new Date(product.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="text-sm font-medium text-pink-900">
                            {product.quantity} in stock
                          </div>
                          <div
                            className={`text-xs ${
                              product.quantity < 10
                                ? "text-rose-600"
                                : "text-pink-500"
                            }`}
                          >
                            {product.quantity < 10 ? "Low stock" : "In stock"}
                          </div>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center rounded-full border border-pink-300 px-2.5 py-0.5 text-xs font-medium text-pink-700 cursor-pointer">
                                View Specs
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white border border-gray-200 shadow-lg rounded-lg p-4 text-gray-900">
                              <div className="space-y-2 min-w-[200px]">
                                <div className="flex justify-between">
                                  <span className="font-medium">Fabric:</span>
                                  <span>{product.fabricType || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium">Size:</span>
                                  <span>{product.size || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium">Width:</span>
                                  <span>{product.width || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium">Length:</span>
                                  <span>{product.length || "-"}</span>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {product.featured && (
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">
                            Featured
                          </span>
                        )}
                        {product.bestSeller && (
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                            Best Seller
                          </span>
                        )}
                        {product.trending && (
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-800">
                            Trending
                          </span>
                        )}
                        {!product.featured &&
                          !product.bestSeller &&
                          !product.trending && (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                              Regular
                            </span>
                          )}
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Popover>
                        <PopoverTrigger className="text-pink-600 hover:text-pink-800 p-1 rounded-full hover:bg-pink-100">
                          <DotsVerticalIcon className="h-5 w-5" />
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-40 p-2 space-y-1"
                          align="end"
                        >
                          <Product
                            triggerTxt={
                              <button className="w-full flex items-center px-3 py-2 text-sm text-pink-700 hover:bg-pink-50 rounded">
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Edit
                              </button>
                            }
                            btnStyle="w-full text-white font-medium bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-200"
                            btnTxt="Save Changes"
                            product_id={product.id}
                            defaultValues={{
                              name: product.name,
                              description: product.description,
                              size: product.size,
                              width: product.width,
                              length: product.length,
                              quantity: product.quantity,
                              fabricType: product.fabricType,
                              featured: product.featured,
                              bestSeller: product.bestSeller,
                              trending: product.trending,
                              price: product.price,
                            }}
                            onSuccess={fetchProducts} // Refresh list after editing
                          />
                          <ConfirmAlert
                            triggerTxt={
                              <button className="w-full flex items-center px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded">
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Delete
                              </button>
                            }
                            message="Are you sure you want to delete this product?"
                            btnTxt="Delete"
                            btnStyle="w-full text-white font-medium bg-gradient-to-r from-rose-500 to-red-500 px-4 py-2 rounded-lg hover:from-rose-600 hover:to-red-600 transition-all duration-200"
                            product_id={product.id}
                            onSuccess={fetchProducts} // Refresh list after deleting
                          />
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Image
                        src="/empty-state.svg"
                        alt="No products"
                        width={200}
                        height={200}
                        className="mb-4 opacity-75"
                      />
                      <h3 className="text-lg font-medium text-pink-900 mb-1">
                        No products found
                      </h3>
                      <p className="text-pink-600 max-w-md">
                        {searchTerm || filter !== "all"
                          ? "Try adjusting your search or filter criteria"
                          : "Add your first product to get started"}
                      </p>
                      <Product
                        triggerStyle="mt-4 text-white font-medium text-sm bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 rounded-lg hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-200"
                        btnTxt="Add Product"
                        btnStyle="w-full text-white font-semibold text-md bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-3 rounded-lg hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-200"
                        triggerTxt="Add Product"
                        onSuccess={fetchProducts} // Refresh list after adding
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Page;
