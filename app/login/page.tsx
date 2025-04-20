"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Shared schema
const formSchema = z.object({
  email: z.string().email({ message: "Enter a valid email." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export default function AuthForm() {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // 🔁 Toggle login/signup

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: any) {
    setLoading(true);
    const endpoint = isLogin ? "/api/auth" : "/api/auth/signup";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Something went wrong");

      if (result.success) {
        localStorage.setItem("token", result.token);
        window.location.href = "/";
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-800 text-white px-4">
      <div className="w-full max-w-md bg-black border border-zinc-700 shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full text-white bg-gray-800"
            >
              {loading
                ? isLogin
                  ? "Logging in..."
                  : "Signing up..."
                : isLogin
                ? "Login"
                : "Sign Up"}
            </Button>
          </form>
        </Form>

        <div className="my-5 text-center text-zinc-400">or</div>

        <Button
          type="button"
          variant="outline"
          className="w-full bg-gray-800 border-zinc-600 text-white"
          // onClick={() => signIn("google")} // for OAuth
        >
          Continue with Google
        </Button>

        <div className="mt-6 text-sm text-center text-zinc-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="text-blue-400 hover:underline ml-1"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
