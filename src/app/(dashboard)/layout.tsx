import { SidebarProvider } from "@/components/ui/sidebar"
import { DasboardNavbar } from "@/modules/dasboard/ui/components/dashboard-navbar";
import { DashboardSidebar } from "@/modules/dasboard/ui/components/dashboard-sidebar";

interface Props{
    children: React.ReactNode;
}


const Layout = ({ children }: Props) => {
    return (
        <SidebarProvider>
            <DashboardSidebar />
            
            <main className="flex flex-col h-screen w-screen bg-muted">
                <DasboardNavbar/>
            {children}
            </main>
        </SidebarProvider>
    )
}
export default Layout