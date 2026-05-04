"use client";

import { Activity, Settings, CheckSquare, Clock, Shield } from "lucide-react";
import styles from "./page.module.css";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const PostureCamera = dynamic(() => import("../components/PostureCamera"), {
  ssr: false,
});

// 1. Extract configuration to keep JSX clean and scalable
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
          {/* 2. Map over the configuration instead of hardcoding buttons */}
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
            {/* 3. Render header dynamically based on current tab */}
            <h1 className={styles.title}>{currentTab.title}</h1>
            <p className={styles.subtitle}>{currentTab.subtitle}</p>
          </div>
          <div>
            <Clock className="text-muted" size={24} />
          </div>
        </header>

        {activeTab === "dashboard" && (
          <div className={`${styles.dashboardGrid} animate-fade-in`}>
            <div className="card">
              <h3>Live Camera Feed</h3>
              <p className={styles.subtitle} style={{ marginBottom: "1rem" }}>TensorFlow.js PoseNet Tracking</p>
              <div className={styles.cameraWrapper}>
                <PostureCamera />
              </div>
            </div>
            <div className="card">
              <h3>Focus Timer</h3>
              <p className={styles.subtitle} style={{ marginBottom: "2rem" }}>Pomodoro Technique</p>
              <div className={styles.pomodoroContainer}>
                <div className={styles.timer}>25:00</div>
                <div className={styles.controls}>
                  <button className={`${styles.btn} ${styles.btnPrimary}`}>Start</button>
                  <button className={`${styles.btn} ${styles.btnSecondary}`}>Reset</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className={`card animate-fade-in`} style={{ maxWidth: '600px' }}>
            <h3>Preferences</h3>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Launch on Startup</span>
                <input type="checkbox" defaultChecked />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Slouch Sensitivity</span>
                <input type="range" min="1" max="10" defaultValue="5" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Play Alert Sound</span>
                <input type="checkbox" defaultChecked />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
