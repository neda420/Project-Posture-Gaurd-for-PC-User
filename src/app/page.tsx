"use client";

import { Activity, Settings, CheckSquare, Clock, Shield } from "lucide-react";
import styles from "./page.module.css";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const PostureCamera = dynamic(() => import("../components/PostureCamera"), {
  ssr: false,
});

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <Shield size={32} />
          PostureGuard
        </div>
        <nav className={styles.nav}>
          <button 
            className={`${styles.navItem} ${activeTab === "dashboard" ? styles.navItemActive : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <Activity size={20} /> Dashboard
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === "tasks" ? styles.navItemActive : ""}`}
            onClick={() => setActiveTab("tasks")}
          >
            <CheckSquare size={20} /> Tasks
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === "settings" ? styles.navItemActive : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={20} /> Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>
              {activeTab === "dashboard" && "Posture Dashboard"}
              {activeTab === "tasks" && "Task Manager"}
              {activeTab === "settings" && "Settings"}
            </h1>
            <p className={styles.subtitle}>
              {activeTab === "dashboard" && "Monitor your ergonomics in real-time."}
              {activeTab === "tasks" && "Stay on top of your daily goals."}
              {activeTab === "settings" && "Customize your PostureGuard experience."}
            </p>
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
