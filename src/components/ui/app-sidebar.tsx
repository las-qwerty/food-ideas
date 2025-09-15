import { useState } from "react";
import { Utensils } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../components/ui/sidebar";
import { Link } from "react-router-dom";

export function AppSidebar() {
  const [foods] = useState([
    {
      food: "Create Food Idea",
      doneBy: "Lawrence",
      href: "/home",
    },
    {
      food: "List Food Ideas",
      doneBy: "Anna",
      href: "/dinner",
    },
  ]);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Food Ideas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {foods.map((item, i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton asChild>
                    <Link to={item.href}>
                      <Utensils />
                      <span>{item.food}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
