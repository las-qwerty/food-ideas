import "./App.css";

import { Routes, Route } from "react-router-dom";
import HomePage from "./page/home.tsx";
import DinnerPage from "./page/dinner.tsx";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar.tsx";
import { AppSidebar } from "./components/ui/app-sidebar.tsx";

function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full min-h-screen">
        <SidebarTrigger />
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/dinner" element={<DinnerPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
    </SidebarProvider>
  );
}

export default App;
