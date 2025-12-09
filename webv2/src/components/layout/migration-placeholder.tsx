import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

import { PageContainer } from "./page-container";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export const MigrationPlaceholder = ({ title, description, action }: Props) => (
  <PageContainer title={title} description={description ?? "This view is being migrated to the new Next.js + shadcn UI."}>
    <Card>
      <CardContent className="flex flex-col items-start gap-3 p-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 text-foreground">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>Work in progress</span>
        </div>
        <p>
          The legacy Ant Design implementation is being replaced. Core functionality will be restored
          here once the migration completes.
        </p>
        {action ? <div className="flex items-center gap-2">{action}</div> : null}
        <Button variant="outline" size="sm" asChild>
          <a href="https://apisix.apache.org/docs/dashboard/" target="_blank">
            View Dashboard docs
          </a>
        </Button>
      </CardContent>
    </Card>
  </PageContainer>
);
