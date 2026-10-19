import React from 'react';
import { User, Scroll, Swords, Sparkles } from 'lucide-react';
import { playSystemSound } from '../utils/audio';

export const Navigation = ({ activeTab, onSelectTab, soundEnabled }) => {
  const tabs = [
    { id: 'status', label: 'STATUS', icon: User },
    { id: 'quests', label: 'QUESTS', icon: Scroll },
    { id: 'dungeons', label: 'RAIDS', icon: Swords },
    { id: 'shadows', label: 'SHADOWS', icon: Sparkles },
  ];

  return (
    <nav className="sovereign-bottom-nav">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`tab-btn-${tab.id}`}
            data-testid={`tab-${tab.id}`}
            className={`sovereign-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => {
              playSystemSound('click', soundEnabled);
              onSelectTab(tab.id);
            }}
          >
            {isActive && <div className="sovereign-nav-indicator" />}
            <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
