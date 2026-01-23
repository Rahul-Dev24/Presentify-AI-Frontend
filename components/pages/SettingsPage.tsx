"use client";

import React from "react";
import {
    User, Shield, CreditCard, Sparkles, Bell,
    ChevronRight, Camera, Zap, Fingerprint,
    Github, Twitter, Globe, Wallet
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SettingsTransparent() {
    return (
        // Parent is now transparent - it will inherit the background of your Layout/Wrapper
        <div className="min-h-screen bg-transparent text-slate-200 selection:bg-blue-500/30">

            <div className="relative max-w-[1200px] mx-auto">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-400 font-medium text-sm tracking-widest uppercase">
                            <Shield size={14} /> System Preferences
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Settings</h1>
                    </div>

                    {/* Transparent Pill Switcher */}
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-1.5 rounded-2xl backdrop-blur-2xl">
                        <Button variant="ghost" className="rounded-xl px-6 bg-white/10 text-white shadow-xl shadow-black/20">Account</Button>
                        <Button variant="ghost" className="rounded-xl px-6 text-slate-400 hover:text-white transition-colors">Workspace</Button>
                    </div>
                </header>

                {/* Bento Grid */}
                <div className="grid grid-cols-12 gap-6">

                    {/* Main Profile - High Transparency Glass */}
                    <Card className="col-span-12 lg:col-span-8 bg-white/[0.02] border-white/10 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl group transition-all duration-500 hover:border-white/20">
                        <div className="relative flex flex-col md:flex-row items-start gap-8">
                            <div className="relative">
                                <div className="h-32 w-32 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                                    <img src="https://github.com/shadcn.png" alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                                <button className="absolute -bottom-2 -right-2 p-2.5 bg-blue-600 rounded-2xl border-2 border-white/10 text-white hover:bg-blue-500 transition-colors shadow-lg">
                                    <Camera size={16} />
                                </button>
                            </div>

                            <div className="flex-1 space-y-6 w-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Identity</label>
                                        <Input className="bg-white/[0.03] border-white/10 rounded-2xl h-12 focus:border-blue-500/50 focus:ring-0 transition-all" defaultValue="Rahul Sharma" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Contact</label>
                                        <Input className="bg-white/[0.03] border-white/10 rounded-2xl h-12 focus:border-blue-500/50 focus:ring-0 transition-all" defaultValue="rahul@presentify.ai" />
                                    </div>
                                </div>
                                <Button className="bg-white/90 hover:bg-white text-black rounded-2xl px-10 h-12 font-bold transition-all shadow-xl shadow-white/5">
                                    Update Profile
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Plan Card - Gradient Glass */}
                    <Card className="col-span-12 lg:col-span-4 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 text-white relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <Badge className="bg-blue-500/20 border-blue-500/30 text-blue-300 mb-6 px-3 py-1 rounded-full">Pro Member</Badge>
                                <h3 className="text-4xl font-bold tracking-tighter mb-1">$29<span className="text-lg font-medium opacity-40">/mo</span></h3>
                                <p className="text-slate-400 text-xs font-medium tracking-wide">Next renewal: Feb 2026</p>
                            </div>
                            <Button className="w-full bg-blue-600/80 hover:bg-blue-600 text-white backdrop-blur-md rounded-2xl h-12 font-bold mt-8 border border-white/10 transition-all shadow-lg shadow-blue-900/20">
                                Manage Billing
                            </Button>
                        </div>
                    </Card>

                    {/* AI Settings - Low Opacity Grid */}
                    <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: "AI Designer", desc: "Contextual layouts", icon: <Sparkles />, color: "text-blue-400", bg: "bg-blue-400/10" },
                            { title: "Smart Summary", desc: "Key point extraction", icon: <Zap />, color: "text-purple-400", bg: "bg-purple-400/10" },
                            { title: "2FA Security", desc: "Biometric protection", icon: <Fingerprint />, color: "text-emerald-400", bg: "bg-emerald-400/10" }
                        ].map((item, i) => (
                            <Card key={i} className="bg-white/[0.01] border-white/5 backdrop-blur-xl p-7 rounded-[2.5rem] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
                                <div className={`h-12 w-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-inner`}>
                                    {item.icon}
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-lg tracking-tight">{item.title}</h4>
                                    <Switch className="data-[state=checked]:bg-blue-600 scale-90" defaultChecked />
                                </div>
                                <p className="text-xs leading-relaxed text-slate-500 font-medium">{item.desc}</p>
                            </Card>
                        ))}
                    </div>

                    {/* Integrations - Dashed Border Glass */}
                    <Card className="col-span-12 bg-white/[0.01] border-dashed border-white/10 backdrop-blur-md p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:border-white/20">
                        <div className="space-y-1 text-center md:text-left">
                            <h4 className="text-lg font-bold tracking-tight">Cloud Integrations</h4>
                            <p className="text-xs text-slate-500 font-medium">Auto-sync exports to your workspace.</p>
                        </div>
                        <div className="flex gap-4">
                            {[Github, Twitter, Globe, Wallet].map((Icon, i) => (
                                <button key={i} className="h-12 w-12 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl flex items-center justify-center transition-all group/icon">
                                    <Icon size={18} className="text-slate-500 group-hover/icon:text-white group-hover/icon:scale-110 transition-all" />
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}