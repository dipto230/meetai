"use client";

import { Button } from "@/components/ui/button"
import { PlugIcon } from "lucide-react";
import { NewAgentDialog } from "./new-agent-dailouge";
import { useState } from "react";



export const AgentsListHeader = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    return (
        <>
            <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        <div className="py-4 px-4 flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <h5 className="font-medium text-xl">My Agents</h5>
                <Button onClick={()=>setIsDialogOpen(true)}>
                    <PlugIcon/>
                    New Agent
                </Button>

            </div>

           
            </div>
            </>
    )
}