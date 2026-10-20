import React from 'react';
import { LayoutDashboard, CheckSquare, Droplets, Scale } from 'lucide-react';
import { playSystemSound } from '../utils/audio';

export const Navigation = ({ activeTab, onSelectTab, soundEnabled }) => {
  const tabs = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard, keyBadge: '1' },
    { id: 'habits', label: 'HABITS', icon: CheckSquare, keyBadge: '2' },
    { id: 'nutrition', label: 'NUTRITION', icon: Droplets, keyBadge: '3' },
    { id: 'body', label: 'BODY', icon: Scale, keyBadge: '4' },
  ];

  return (
    <nav className="sovereign-bottom-nav" role="tablist" aria-label="System Navigation">
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
            <Icon size={17} strokeWidth={isActive ? 2.5 : 1.8} />
            <span>{tab.label}</span>
            <span className="desktop-key-hint">{tab.keyBadge}</span>
          </button>
        );
      })}
    </nav>
  );
};
