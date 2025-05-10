'use client'
import React from 'react';
import SectionHeader from './SectionHeader';

const PanelSection = ({ title, children, isExpanded, onToggle }) => (
  <div className="mb-3">
    <SectionHeader 
      title={title} 
      onClick={onToggle} 
      isActive={isExpanded} 
    />
    {isExpanded && (
      <div className="pl-1 pt-1 space-y-2">
        {children}
      </div>
    )}
  </div>
);

export default PanelSection;