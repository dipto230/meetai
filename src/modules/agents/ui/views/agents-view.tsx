"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";

export const AgentsView = () => {
  const { data, isLoading } = trpc.agents.getMany.useQuery();

  if (isLoading) return <LoadingState />;

  return (
    <div>
      {JSON.stringify(data, null, 2)}
    </div>
  );
};

export const AgentsViewLoading = () => {
  return (
    <div>
      <Button>Some action</Button>
      {"Loading..."}
    </div>
  );
};

export const AgentsViewError = () => {
  return (
    <ErrorState
      title="Error Loading Agents"
      description="Something went wrong"
    />
  );
};
