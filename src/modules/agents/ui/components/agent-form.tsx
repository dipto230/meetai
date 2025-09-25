"use client";

import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { agentInsertSchema } from "../../schemas";
import { AgentGetOne } from "../../types";
import { trpc } from "@/trpc/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GeneratedAvatar } from "@/components/generated-avatar";

import toast from "react-hot-toast";

interface AgentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: AgentGetOne;
}

export const AgentForm = ({ onSuccess, onCancel, initialValues }: AgentFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // ✅ Fixed mutation
  const createAgent = trpc.agents.create.useMutation({
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(trpc.agents.getMany.getQueryKey());

      if (initialValues?.id) {
        await queryClient.invalidateQueries(
          trpc.agents.getOne.getQueryKey({ id: initialValues.id })
        );
      }

      console.log("Created agent:", data.agent);
      toast.success("Agent created successfully!");
      onSuccess?.();
    },
    onError: (err) => {
      console.error("Error creating agent:", err);
      toast.error("Failed to create agent");
    },
  });

  const form = useForm<z.infer<typeof agentInsertSchema>>({
    resolver: zodResolver(agentInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      instructions: initialValues?.instructions ?? "",
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createAgent.isLoading; // ✅ React Query uses `isLoading` instead of `isPending`

  const onSubmit = (values: z.infer<typeof agentInsertSchema>) => {
    if (isEdit) {
      console.log("TODO: updateAgent", values);
    } else {
      createAgent.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <GeneratedAvatar
            seed={form.watch("name") || "default"}
            variant="botttsNeutral"
            className="border w-16 h-16"
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter agent name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter instructions" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isEdit ? "Update Agent" : "Create Agent"}
          </Button>
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
