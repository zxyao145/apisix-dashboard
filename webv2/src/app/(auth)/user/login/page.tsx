"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Github, LockKeyhole, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/use-auth";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect");

  const { signInWithPassword, token, initialized, loading } = useAuth();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!initialized) return;
    if (token) {
      const destination = redirect ? decodeURIComponent(redirect) : "/";
      router.replace(destination === "/user/logout" ? "/" : destination);
    }
  }, [initialized, redirect, router, token]);

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      await signInWithPassword(values);
      toast.success("Signed in successfully");
      const destination = redirect ? decodeURIComponent(redirect) : "/dashboard";
      router.replace(destination === "/user/logout" ? "/dashboard" : destination);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in";
      toast.error(message);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center bg-gradient-to-br from-slate-50 via-white to-sky-50 px-4 py-10">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <LockKeyhole className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">Sign in to APISIX Dashboard</CardTitle>
              <CardDescription>
                Cloud-Native Microservices API Gateway control plane
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3">
                        <UserRound className="h-4 w-4 text-muted-foreground" />
                        <Input {...field} placeholder="admin" className="border-0 px-0 shadow-none" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3">
                        <LockKeyhole className="h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••"
                          className="border-0 px-0 shadow-none"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                Sign In
              </Button>
            </form>
          </Form>
          <div className="rounded-lg bg-muted/60 px-4 py-3 text-xs text-muted-foreground">
            <p className="mb-2 font-semibold text-foreground">Default credentials</p>
            <p>
              You can update the default username and password in{" "}
              <Link
                href="https://github.com/apache/apisix-dashboard/blob/master/api/conf/conf.yaml#L70-L75"
                target="_blank"
                className="text-primary underline-offset-2 hover:underline"
              >
                conf.yaml
              </Link>
              .
            </p>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <Link
              href="https://apisix.apache.org"
              target="_blank"
              className="inline-flex items-center gap-1 text-foreground transition hover:text-primary"
            >
              <Github className="h-4 w-4" />
              GitHub
            </Link>
            <Label className="text-muted-foreground">
              Need access? Ensure your Admin API is reachable.
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
