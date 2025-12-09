"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getGrafanaURL } from "@/lib/api/settings";

const DashboardPage = () => {
  const [grafanaURL, setGrafanaURL] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    getGrafanaURL().then(setGrafanaURL);
  }, []);

  return (
    <PageContainer
      title="Dashboard"
      description="Visualize APISIX metrics through your configured Grafana endpoint."
      padded={false}
    >
      <Card className="overflow-hidden border-0">
        {!grafanaURL ? (
          <div className="flex flex-col items-center gap-4 px-8 py-16 text-center">
            <Alert variant="info" className="max-w-xl text-left">
              <AlertTitle className="flex items-center gap-2 text-base font-semibold">
                <Info className="h-4 w-4" />
                Grafana endpoint not configured
              </AlertTitle>
              <AlertDescription>
                Add your Grafana URL in Settings to embed dashboards directly inside APISIX
                Dashboard.
              </AlertDescription>
            </Alert>
            <Button
              size="lg"
              onClick={() => {
                router.push("/settings");
              }}
            >
              Configure Grafana
            </Button>
          </div>
        ) : (
          <iframe
            title="APISIX Dashboard"
            src={grafanaURL}
            width="100%"
            height="860"
            className="min-h-[70vh] w-full"
          />
        )}
      </Card>
    </PageContainer>
  );
};

export default DashboardPage;
