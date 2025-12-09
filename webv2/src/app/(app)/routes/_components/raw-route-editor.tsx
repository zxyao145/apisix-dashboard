"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ActionBar } from "@/components/layout/action-bar";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/api/client";
import { fetchRoute } from "@/lib/api/routes";

type Mode = "create" | "edit" | "duplicate";

type Props = {
  mode: Mode;
  routeId?: string;
};

export const RawRouteEditor = ({ mode, routeId }: Props) => {
  const router = useRouter();
  const [jsonValue, setJsonValue] = useState<string>("{\n  \n}");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!routeId) return;
    fetchRoute(routeId).then((data) => {
      if (!data) return;
      const payload = { ...data };
      if (mode === "duplicate") {
        delete (payload as any).id;
        payload.name = `${payload.name || "route"}-copy`;
      }
      setJsonValue(JSON.stringify(payload, null, 2));
    });
  }, [mode, routeId]);

  const handleSubmit = async () => {
    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(jsonValue);
    } catch (error) {
      toast.error("Invalid JSON");
      return;
    }
    setLoading(true);
    try {
      if (mode === "edit" && routeId) {
        await apiRequest({
          url: `/routes/${routeId}`,
          method: "PUT",
          data: payload,
        });
        toast.success("Route updated");
      } else {
        await apiRequest({
          url: "/routes",
          method: "POST",
          data: payload,
        });
        toast.success("Route created");
      }
      router.replace("/routes/list");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Save failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title={
        mode === "create"
          ? "Create Route"
          : mode === "duplicate"
          ? "Duplicate Route"
          : "Edit Route"
      }
      description="Edit the full route definition using raw JSON."
      padded={false}
    >
      <div className="space-y-4 p-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Route definition</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={jsonValue}
              onChange={(event) => setJsonValue(event.target.value)}
              className="min-h-[520px] font-mono"
            />
          </CardContent>
        </Card>
      </div>
      <ActionBar>
        <Button
          variant="ghost"
          onClick={() => {
            router.back();
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </ActionBar>
    </PageContainer>
  );
};
