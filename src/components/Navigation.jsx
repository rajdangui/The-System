import React from 'react';
import { User, Scroll, Swords, Sparkles } from 'lucide-react';
import { playSystemSound } from '../utils/audio';

export const Navigation = ({ activeTab, onSelectTab, soundEnabled }) => {
  const tabs = [
    { id: 'status', label: 'STATUS', icon: User, keyBadge: '1' },
    { id: 'quests', label: 'QUESTS', icon: Scroll, keyBadge: '2' },
    { id: 'dungeons', label: 'RAIDS', icon: Swords, keyBadge: '3' },
    { id: 'shadows', label: 'SHADOWS', icon: Sparkles, keyBadge: '4' },
  ];

  return (
    <nav className="sovereign-bottom-nav" role="tablist" aria-label="Command Deck Navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`tab-btn-${tab.id}`}
            data-testid={`tab-${tab.id}`}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            tabIndex={0}
            className={`sovereign-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => {
              playSystemSound('click', soundEnabled);
              onSelectTab(tab.id);
            }}
          >
            {isActive && <div className="sovereign-nav-indicator" />}
            <Icon size={18} strokeWidth={isActive ? 2.4 : 1.8} />
            <span>{tab.label}</span>
            <span className="desktop-key-hint">{tab.keyBadge}</span>
          </button>
        );
      })}
    </nav>
  );
};
