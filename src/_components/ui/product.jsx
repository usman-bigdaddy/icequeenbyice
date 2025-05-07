"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useDispatch } from "react-redux";
import { create_product, edit_product } from "@/store/products/product-thunk";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product_Schema } from "@/lib/form-schema";
import Formfield from "./formField";
import FileUpload from "../FileUpload";
import config from "@/lib/config";

const Product = ({
  defaultValues,
  image,
  product_id,
  triggerTxt,
  triggerStyle,
  btnTxt,
  btnStyle,
}) => {
  const form = useForm({
    resolver: zodResolver(Product_Schema),
    defaultValues: {
      name: "",
      description: "",
      size: "",
      width: "",
      quantity: "",
      fabricType: "",
      featured: "",
      price: "",
      length: "",
      bestSeller: "",
      trending: "",
    },
  });

  const [photos, setPhotos] = useState([]);

  const dispatch = useDispatch();

  const { publicKey, privateKey } = config.env.imagekit;

  const uploadToImageKit = async (file) => {
    try {
      // Fetch authentication data from your server
      const authRes = await fetch(`${config.env.apiEndpoint}/api/imagekit`);
      const authData = await authRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("useUniqueFileName", "true");
      formData.append("folder", "products");
      les;
      formData.append("publicKey", config.env.imagekit.publicKey);
      formData.append("signature", authData.signature);
      formData.append("expire", authData.expire);
      formData.append("token", authData.token);

      const res = await fetch(
        "https://upload.imagekit.io/api/v1/files/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      return data.url;
    } catch (error) {
      console.error("Image upload failed:", error.message);
      return null;
    }
  };

  const onSubmit = async (values) => {
    let uploadedUrls = [];

    if (photos.length > 0) {
      try {
        const uploads = await Promise.all(
          photos.map((file) => uploadToImageKit(file))
        );
        uploadedUrls = uploads;
      } catch (error) {
        console.error("Image upload failed:", error);
        return;
      }
    }

    const payload = {
      ...values,
      length: Number(values.length) || 0,
      visibility: true,
      images: uploadedUrls,
    };

    if (btnTxt === "Add Product") {
      dispatch(create_product(payload));
    } else {
      dispatch(edit_product({ product_id, data: payload }));
    }

    form.reset();
    setPhotos([]);
  };

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        ...defaultValues,
        length: defaultValues.length?.toString() || "",
      });
    }
  }, [defaultValues]);

  const sizes = ["SMALL", "MEDIUM", "LARGE", "FREE_SIZE"];
  const freeSize = [
    "55",
    "56",
    "57",
    "58",
    "59",
    "60",
    "61",
    "62",
    "63",
    "64",
    "65",
    "66",
    "67",
    "68",
    "69",
    "70",
  ];

  const [selectedSize, setSelectedSize] = useState("");
  const isfeatured = [true, false];

  return (
    <Dialog>
      <DialogTrigger className={triggerStyle}>{triggerTxt}</DialogTrigger>
      <DialogContent className="w-fit md:w-[70vw] !max-w-fit h-auto px-2 py-2">
        <VisuallyHidden>
          <DialogTitle>Product Form</DialogTitle>
        </VisuallyHidden>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col md:flex-row md:justify-between  w-full h-full px-1 py-1 gap-3 ">
              <div className="flex flex-col md:w-[70%] gap-3 bg-gray-100 rounded-md px-4 py-2">
                <h2 className="text-gray-700 font-md text-lg">
                  General Information
                </h2>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-md">
                        Product Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="item name..."
                          {...field}
                          className=" bg-gray-300 focus:border-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-md">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Product description..."
                          type="t"
                          {...field}
                          className=" bg-gray-300 focus:border-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fabricType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-md">
                        Fabric Type
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Fabric type..."
                          {...field}
                          className=" bg-gray-300 focus:border-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <h2 className="text-gray-700 font-md text-md">Size</h2>
                <div className="flex flex-row mb-2">
                  {sizes.map((size, index) => (
                    <FormField
                      key={index}
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem className="flex flex-wrap md:flex-row items-start  space-y-0">
                          <FormControl>
                            <Checkbox
                              className="bg-gray-300"
                              checked={field.value === size}
                              onCheckedChange={(checked) => {
                                const updatedSize = checked ? size : "";
                                field.onChange(updatedSize);
                                setSelectedSize(updatedSize);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-gray-700 font-md me-4">
                            {size}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <div className="flex flex-row justify-between gap-2">
                  <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                      <FormItem
                        className={`${selectedSize === "Free size" ? "w-1/2" : "w-full"}`}
                      >
                        <FormLabel className="text-gray-700 font-md">
                          Width
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Width..."
                            {...field}
                            className=" bg-gray-300 focus:border-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedSize === "FREE_SIZE" && (
                    <FormField
                      control={form.control}
                      name="length"
                      render={({ field }) => (
                        <FormItem className="w-1/2">
                          <FormLabel className="text-gray-700 font-md">
                            Length
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(val) => field.onChange(val)}
                              value={field.value || ""}
                            >
                              <SelectTrigger className="w-full bg-gray-300">
                                <SelectValue placeholder="Select length" />
                              </SelectTrigger>
                              <SelectContent>
                                {freeSize.map((fs, idx) => (
                                  <SelectItem key={idx} value={fs}>
                                    {fs}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              <div className="flex flex-col w-[80vw] md:w-[30%]  gap-3 ">
                <div className="w-full bg-gray-100 rounded-md px-4 py-3 ">
                  <h2 className="text-gray-700 font-md text-lg">
                    Display and Pricing
                  </h2>
                  <FileUpload onFilesSelected={setPhotos} />
                  {/* <Formfield
                    name="image"
                    control={form.control}
                    type="file"
                    label="Product Image"
                    labelStyle="text-gray-700 font-md"
                    onChange={(e) => {
                      const files = Array.from(e.target.files[0] || []);
                      setPhotos((prev) => [...prev, ...files]);
                    }}
                    multiple={true}
                    className="focus:border-none bg-gray-300 px-2 py-14 mt-2 text-gray-700"
                  /> */}
                </div>

                <div className="w-full bg-gray-100 rounded-md px-4 py-2 space-y-6">
                  <div>
                    <h2 className="!mb-2 font-md text-gray-700">Featured?</h2>
                    <div className="flex flex-row">
                      {isfeatured.map((item, index) => (
                        <FormField
                          key={index}
                          control={form.control}
                          name="featured"
                          render={({ field }) => (
                            <FormItem className="flex flex-col md:flex-row items-start space-y-0">
                              <FormControl>
                                <Checkbox
                                  className="bg-gray-300"
                                  checked={field.value === item}
                                  onCheckedChange={(checked) => {
                                    const updated = checked ? item : "";
                                    field.onChange(updated);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-gray-700 font-md me-4">
                                {item == true ? "Yes" : "No"}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="!mb-2 font-md text-gray-700">
                      Best Seller?
                    </h2>
                    <div className="flex flex-row">
                      {isfeatured.map((item, index) => (
                        <FormField
                          key={index}
                          control={form.control}
                          name="bestSeller"
                          render={({ field }) => (
                            <FormItem className="flex flex-col md:flex-row items-start space-y-0">
                              <FormControl>
                                <Checkbox
                                  className="bg-gray-300"
                                  checked={field.value === item}
                                  onCheckedChange={(checked) => {
                                    const updated = checked ? item : "";
                                    field.onChange(updated);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-gray-700 font-md me-4">
                                {item == true ? "Yes" : "No"}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="!mb-2 font-md text-gray-700">Trending?</h2>
                    <div className="flex flex-row">
                      {isfeatured.map((item, index) => (
                        <FormField
                          key={index}
                          control={form.control}
                          name="trending"
                          render={({ field }) => (
                            <FormItem className="flex flex-col md:flex-row items-start space-y-0">
                              <FormControl>
                                <Checkbox
                                  className="bg-gray-300"
                                  checked={field.value === item}
                                  onCheckedChange={(checked) => {
                                    const updated = checked ? item : "";
                                    field.onChange(updated);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-gray-700 font-md me-4">
                                {item == true ? "Yes" : "No"}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between gap-2">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem className="md:w-1/2">
                          <FormLabel className="text-gray-700 font-md">
                            Quantity
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Qtr..."
                              {...field}
                              className=" bg-gray-300 focus:border-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem className="md:w-1/2">
                          <FormLabel>Price ₦</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="price..."
                              {...field}
                              className=" bg-gray-300 focus:border-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className={btnStyle}>
                    {btnTxt}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default Product;
