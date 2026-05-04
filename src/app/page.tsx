"use client";

import { Activity, Settings, CheckSquare, Clock, Shield } from "lucide-react";
import styles from "./page.module.css";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const PostureCamera = dynamic(() => import("../components/PostureCamera"), {
  ssr: false,
});

const TAB_CONFIG = {
  dashboard: {
    id: "dashboard",
    label: "Dashboard",
    icon: Activity,
    title: "Posture Dashboard",
    subtitle: "Monitor your ergonomics in real-time.",
  },
  tasks: {
    id: "tasks",
    label: "Tasks",
    icon: CheckSquare,
    title: "Task Manager",
    subtitle: "Stay on top of your daily goals.",
  },
  settings: {
    id: "settings",
    label: "Settings",
    icon: Settings,
    title: "Settings",
    subtitle: "Customize your PostureGuard experience.",
  },
};

type TabKey = keyof typeof TAB_CONFIG;

// --- Sub-components extracted for clean architecture ---

const DashboardView = () => (
  <div className={`${styles.dashboardGrid} animate-fade-in`}>
    <div className="card">
      <h3>Live Camera Feed</h3>
      <p className={`${styles.subtitle} ${styles.mb4}`}>TensorFlow.js PoseNet Tracking</p>
      <div className={styles.cameraWrapper}>
        <PostureCamera />
      </div>
    </div>
    <div className="card">
      <h3>Focus Timer</h3>
      <p className={`${styles.subtitle} ${styles.mb6}`}>Pomodoro Technique</p>
      <div className={styles.pomodoroContainer}>
        <div className={styles.timer}>25:00</div>
        <div className={styles.controls}>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>Start</button>
          <button className={`${styles.btn} ${styles.btnSecondary}`}>Reset</button>
        </div>
      </div>
    </div>
  </div>
);

const SettingsView = () => (
  <div className={`card animate-fade-in ${styles.settingsCard}`}>
    <h3>Preferences</h3>
    <div className={styles.settingsList}>
      <div className={styles.settingRow}>
        <span>Launch on Startup</span>
        <input type="checkbox" defaultChecked />
      </div>
      <div className={styles.settingRow}>
        <span>Slouch Sensitivity</span>
        <input type="range" min="1" max="10" defaultValue="5" />
      </div>
      <div className={styles.settingRow}>
        <span>Play Alert Sound</span>
        <input type="checkbox" defaultChecked />
      </div>
    </div>
  </div>
);

// --- Main Layout Component ---

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const currentTab = TAB_CONFIG[activeTab];

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <Shield size={32} />
          PostureGuard
        </div>
        <nav className={styles.nav}>
          {Object.values(TAB_CONFIG).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`${styles.navItem} ${activeTab === tab.id ? styles.navItemActive : ""}`}
                onClick={() => setActiveTab(tab.id as TabKey)}
              >
                <Icon size={20} /> {tab.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>{currentTab.title}</h1>
            <p className={styles.subtitle}>{currentTab.subtitle}</p>
          </div>
          <div>
            <Clock className="text-muted" size={24} />
          </div>
        </header>

        {/* Dynamic View Rendering */}
        {activeTab === "dashboard" && <DashboardView />}
        {activeTab === "settings" && <SettingsView />}
        {activeTab === "tasks" && <div className="animate-fade-in">Task Manager UI coming soon...</div>}
        
      </main>
    </div>
  );
}
