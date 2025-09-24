"use client";

import { LoadingState } from "@/components/loading-state";
import { trpc } from "@/trpc/client";

export const AgentsView = () => {
  const { data, isLoading } = trpc.agents.getMany.useQuery();

  if (isLoading) return <LoadingState />;

  return <div>{JSON.stringify(data, null, 2)}</div>;
};

export const AgentsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agents"
      description="This may take a few seconds."
    />
  );
};
    