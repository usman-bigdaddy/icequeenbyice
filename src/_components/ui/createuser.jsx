"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import Formfield from "./formField";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Create_User_Schema } from "@/lib/form-schema";
import { useDispatch, useSelector } from "react-redux";
import { Label } from "@/components/ui/label";
import { add_admin_user } from "@/store/admin-auth/admin-auth-slice";
const CreateUser = ({ userRole }) => {
  const { add_admin_loading } = useSelector((state) => state.auth);
  const form = useForm({
    resolver: zodResolver(Create_User_Schema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });
  const dispatch = useDispatch();
  const onSubmit = (values) => {
    dispatch(add_admin_user(values));
    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger
        className={`text-white  font-semibold text-sm 
  bg-[#DE0D6F] px-3 py-2 rounded-md 
  hover:bg-white hover:border hover:border-[#DE0D6F] hover:text-gray-700  transition duration-300class ${userRole === "ADMIN" && "hidden"}`}
      >
        Add New User
      </DialogTrigger>
      <DialogContent className="sm:max-w-[325px] ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create User</DialogTitle>
              <DialogDescription>Add new admin user</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col py-4 gap-2">
              <Formfield
                control={form.control}
                type="text"
                name="fullName"
                placeholder="fullname"
                label="Name"
                className="text-gray-700 w-full"
              />

              <Formfield
                control={form.control}
                type="email"
                name="email"
                label="Email"
                placeholder="email"
                className="text-gray-700 w-full"
              />
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={add_admin_loading}
                  className=" text-white  font-semibold text-md 
  bg-[#DE0D6F] px-4 py-3 rounded-md 
  hover:bg-white hover:border-1 hover:border-[#DE0D6F] hover:text-gray-700  transition duration-300"
                >
                  Add User
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUser;
