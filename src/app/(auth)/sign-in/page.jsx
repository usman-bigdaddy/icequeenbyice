"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Sign_In_Schema } from "@/lib/form-schema";
import Formfield from "@/_components/ui/formField";
import { Form, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "@/assets/icequeenLogo.png";
import { toast } from "react-toastify";
import { signinUser } from "@/store/admin-auth/admin-auth-slice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { SparklesCore } from "@/_components/ui/sparkles";
import { Btn } from "@/_components/ui/moving-border";

export default function SignIn() {
  const { loading, user, error, token } = useSelector((state) => state.auth);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(Sign_In_Schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user && token) {
      toast.success("Login Successful");
      window.localStorage.setItem("token", token);
      router.push("/admin/dashboard");
    }
    if (error) {
      toast.error(error);
    }
  }, [user, token, error, router]);
  const dispatch = useDispatch();
  const onSubmit = (values) => {
    dispatch(signinUser(values));
  };

  return (
    <div className="bg-[url('/blob-scene-haikei.png')] h-screen bg-cover md:bg-[url('/svgwave.svg')]">
      <div className="flex flex-row justify-between items-center w-full">
        <div className="w-full absolute inset-0 h-screen">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={200}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>
        <div className="md:flex flex-col justify-center items-center mt-[12%] px-7 w-1/2 hidden ">
          <h2 className="text-white  font-semibold text-4xl ">
            {" "}
            Welcome to Admin Signin
          </h2>
          <p className="text-white font-extralight text-xl">
            fill the signin form to acess your dashboard!
          </p>
        </div>

        <div className="flex flex-col w-full md:w-1/2 justify-center items-center px-0 py-10">
          <div className="flex flex-col md:w-[50%] justify-center items-center md:mt-[20%] mt-40  z-10">
            <Image src={logo} alt="logo" className="w-36 h-20 mb-3" />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <Formfield
                  control={form.control}
                  type="email"
                  name="email"
                  label="Email"
                  placeholder="johndoe@email.com"
                  className="text-gray-700"
                />

                <Formfield
                  control={form.control}
                  type="password"
                  name="password"
                  label="Password"
                  placeholder="Enter password"
                  className="mt-4 text-gray-700"
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-[100%] mt-4 ext-white  font-semibold text-md 
  bg-[#DE0D6F] hover:bg-white hover:border-1 hover:border-[#DE0D6F] hover:text-gray-700  transition duration-300"
                >
                  Signin
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
