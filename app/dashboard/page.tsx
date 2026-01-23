"use client";

import React, { useState } from "react";
import {
  Plus,
  Clock,
  LayoutDashboard,
  Settings,
  Menu,
  X,
  Video,
  Headphones,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import AnimatedBackground from "@/components/AnimatedBackground";
import Loader from "@/components/ui/Loader";
import Profile from "@/components/Profile";
import Link from "next/link";
import DashboardPage from "@/components/pages/Dashboard";
import VideoToPPTPage from "@/components/pages/VideoToPPTPage";
import MyProjectsPage from "@/components/pages/MyProjectsPage";
import MyVideosPage from "@/components/pages/MyVideosPage";
import DashboardHeader, { ButtonType } from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";
import MyAudiosPage from "@/components/pages/MyAudiosPage";
import SettingsPage from "@/components/pages/SettingsPage";


interface MenuItem {
  label: string;
  key: string;
  icon: React.ReactNode;
  active?: boolean
}

interface HearderModel {
  title: string;
  mainTitle: string;
  subTitle: string | React.ReactNode;
  buttons: ButtonType[];
  key: string;
}

const Dashboard = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const router = useRouter();

  if (!loading && !isAuthenticated) {
    router.replace("/login");
  }


  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [HeaderList, setHeaderList] = useState<HearderModel[]>([
    {
      title: "Welcome Back",
      mainTitle: "",
      subTitle: "Transform your media into professional presentations.",
      key: "dashboard",
      buttons: [
        {
          label: "New Presentation",
          key: "generate_ppt",
          icon: <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />,
          style: "group relative hidden md:flex items-center gap-2 px-6 py-5 bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-[1.02] active:scale-95 transition-all duration-300 rounded-xl border-t border-white/20 shadow-lg shadow-blue-500/20 overflow-hidden",
          onclick: () => handleActive(1)
        }
      ],
    },
    {
      title: "Convert",
      mainTitle: "Media to Presentation",
      subTitle: `Upload content or a link. Our AI transforms it into a polished PPT.`,
      key: "generate_ppt",
      buttons: [],
    }
  ]);
  const [menuList, setMenuList] = useState<MenuItem[]>([
    {
      label: "Dashboard",
      key: "dashboard",
      icon: <LayoutDashboard size={20} />,
      active: true
    },
    {
      label: "Generate PPT",
      key: "generate_ppt",
      icon: <Sparkles size={20} />,
    },
    {
      label: "My Projects",
      key: "projects",
      icon: <Clock size={20} />,
    },
    {
      label: "My Videos",
      key: "videos",
      icon: <Video size={20} />,
    },
    {
      label: "My Audios",
      key: "audios",
      icon: <Headphones size={20} />,
    },
    {
      label: "Settings",
      key: "settings",
      icon: <Settings size={20} />,
    },
  ]);


  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);


  const handleActive = (index: number) => {
    const updatedMenu = menuList.map((item, i) => ({
      ...item,
      active: i === index,
    }));

    setMenuList(updatedMenu);
    setCurrentTab(updatedMenu[index].key);
    if (isSidebarOpen) toggleSidebar();
  };


  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-100  overflow-hidden">

      {/* --- MOBILE SIDEBAR OVERLAY --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 text-slate-100 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] text-slate-400 border-r 
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:block
      `}>
        <div className="p-6 flex justify-between items-center md:border-b md:border-gray-700 md:py-7.5">
          <div
            onClick={() => { currentTab !== 'dashboard' && handleActive(0) }}
            className="flex cursor-pointer items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Video className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl md:text-2xl text-white font-bold">Presentify AI</span>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
            <X size={20} />
          </Button>
        </div>

        <nav className="space-y-2 px-4 mt-4">

          {menuList.map((item, index) => (
            <div key={index}
              onClick={() => { handleActive(index) }}
              className={`${item.active ? "active-button" : ""} hover:bg-zinc-600 hover:text-slate-200 flex items-center gap-4 p-2 my-2 w-full rounded-md cursor-pointer hover:opacity-90 transition-all`}
            >
              {item.icon}
              <span className="text-lg  font-bold">{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Upgrade Card */}
        <div className="m-4 p-4 absolute w-[88%] bottom-0 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-blue-950 dark:to-slate-900 text-white overflow-hidden group">
          <Sparkles className="absolute -right-2 -top-2 text-blue-400/20 w-16 h-16 group-hover:rotate-12 transition-transform" />
          <p className="text-xs font-medium text-blue-300 mb-1">Pro Plan</p>
          <p className="text-sm font-bold mb-3">Unlimited AI Power</p>
          <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-500 text-xs h-8 rounded-lg">
            Upgrade Now
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <AnimatedBackground />
        <header className="flex scale-z-95 items-center justify-between p-4 border-b bg-gray-800 md:hidden">
          <div onClick={() => { currentTab !== 'dashboard' && handleActive(0) }} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Video className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold">Presentify AI</span>
          </div>

          <div className="flex items-center justify-end gap-4 md:hidden" >
            {loading ? (
              <Loader />
            ) : (
              <React.Fragment>
                {isAuthenticated && (
                  <Profile user={user} logout={logout} loading={loading} />
                )}
              </React.Fragment>
            )
            }

            <Button variant="outline" size="icon" onClick={toggleSidebar}>
              <Menu size={20} />
            </Button>
          </div>
        </header>
        <div className="p-8 scale-z-95" >

          {
            currentTab === "dashboard" ? (<><DashboardHeader Header={HeaderList[0]} /> <DashboardPage /> </>) : currentTab === "generate_ppt" ? (<><DashboardHeader Header={HeaderList[1]} /><VideoToPPTPage /></>) : currentTab === "settings" ? (<SettingsPage />) : currentTab === "projects" ? (<MyProjectsPage />) : currentTab === "videos" ? (<MyVideosPage />) : currentTab === "audios" ? (<MyAudiosPage />) : (null)
          }

        </div>
      </main>
    </div>
  );
}

export default Dashboard
