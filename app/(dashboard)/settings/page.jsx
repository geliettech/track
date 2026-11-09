"use client";

import { FiMoon, FiSun, FiUser } from "react-icons/fi";
import PageHeading from "@/components/dashboard/PageHeading";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsPage() {
  const { theme, setLight, setDark } = useTheme();

  return (
    <>
      <PageHeading
        eyebrow="Make Track yours"
        title="Settings"
        description="Manage your profile and workspace preferences."
      />
      <section className="settings-page" aria-label="Settings">
        <div className="settings-panel">
          <div className="settings-section-heading">
            <span className="settings-section-icon"><FiUser size={17} /></span>
            <div>
              <p className="eyebrow">Your account</p>
              <h3>Profile settings</h3>
              <p>Your profile is used across Track and your workspace.</p>
            </div>
          </div>
          <div className="settings-profile">
            <span className="avatar" aria-hidden="true">JD</span>
            <span><strong>Jordan Davis</strong><small>Workspace owner</small></span>
          </div>
        </div>

        <div className="settings-panel">
          <div className="settings-section-heading">
            <span className="settings-section-icon"><FiSun size={17} /></span>
            <div>
              <p className="eyebrow">Preferences</p>
              <h3>Appearance</h3>
              <p>Choose the theme that feels right for your workspace.</p>
            </div>
          </div>
          <div className="theme-options" role="group" aria-label="Color theme">
            <button type="button" className={`secondary-button${theme === "light" ? " selected" : ""}`} onClick={setLight}>
              <FiSun size={16} /> Light
            </button>
            <button type="button" className={`secondary-button${theme === "dark" ? " selected" : ""}`} onClick={setDark}>
              <FiMoon size={16} /> Dark
            </button>
          </div>
          <p className="settings-note">Your preferences are saved in this browser.</p>
        </div>
      </section>
    </>
  );
}
