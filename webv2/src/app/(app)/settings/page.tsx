"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ActionBar } from "@/components/layout/action-bar";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getGrafanaURL, updateGrafanaURL } from "@/lib/api/settings";

const schema = z.object({
  grafanaURL: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^https?:\/\//i.test(value),
      "Grafana URL must start with http:// or https://",
    ),
});

const SettingsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      grafanaURL: "",
    },
  });

  useEffect(() => {
    getGrafanaURL().then((value) => {
      form.setValue("grafanaURL", value);
    });
  }, [form]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    await updateGrafanaURL(values.grafanaURL || "");
    toast.success("Settings updated");
    const redirect = searchParams?.get("redirect");
    if (redirect) {
      const decoded = decodeURIComponent(redirect);
      router.replace(decoded.startsWith("http") ? "/" : decoded);
      return;
    }
    router.replace("/dashboard");
  };

  return (
    <PageContainer
      title="Settings"
      description="Manage dashboard integrations for monitoring and observability."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Grafana</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <FormField
                control={form.control}
                name="grafanaURL"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Grafana URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://grafana.example.com/d/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <ActionBar>
            <Button type="submit">Save</Button>
          </ActionBar>
        </form>
      </Form>
    </PageContainer>
  );
};

export default SettingsPage;
