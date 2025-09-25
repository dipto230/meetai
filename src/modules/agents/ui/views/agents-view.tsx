"use client";

import { useMemo } from "react";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useAgentsFilters } from "@/modules/hooks/use-agents-filters";
import { useSearchParams } from "next/navigation";
import { loadSearchParams } from "../../params";

export const AgentsView = () => {
  const searchParamsFromURL = useSearchParams();

  // Parse search params only once per render
  const initialFilters = useMemo(() => {
    if (!searchParamsFromURL) return { search: "", page: 1 };
    return loadSearchParams(Object.fromEntries(searchParamsFromURL.entries()));
  }, [searchParamsFromURL]);

  // Always call the hook (prevents Hooks order errors)
  const [filters] = useAgentsFilters(initialFilters);

  const { data, isLoading, isError } = trpc.agents.getMany.useQuery(filters, {
    enabled: !!initialFilters,
  });

  if (isLoading) return <LoadingState />;
  if (isError)
    return (
      <ErrorState
        title="Error Loading Agents"
        description="Something went wrong"
      />
    );

  return (
    <div className="flex-1 pb-5 px-5 md:px-8 flex flex-col gap-y-5">
      <DataTable data={data} columns={columns} />

      {data.length === 0 && (
        <EmptyState
          title="Create your first agent"
          description="Create an agent to join your meeting. Each agent will follow your instruction and can interact with participants during the call"
        />
      )}
    </div>
  );
};

export const AgentsViewLoading = () => (
  <div>
    <Button>Some action</Button>
    {"Loading..."}
  </div>
);

export const AgentsViewError = () => (
  <ErrorState title="Error Loading Agents" description="Something went wrong" />
);
