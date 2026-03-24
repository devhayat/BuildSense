
import React from 'react';
import { LayoutGrid, FileText, Activity, Users, Settings, Plus, Play, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { Project, BOQItem, ProjectTemplate, SteelDetail } from './types';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid className="w-5 h-5" /> },
  { id: 'projects', label: 'Projects', icon: <FileText className="w-5 h-5" /> },
  { id: 'mentorship', label: 'AI Mentor', icon: <Users className="w-5 h-5" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'prj_001',
    name: 'Skyline Residence',
    location: 'Mumbai, IN',
    buildingType: 'Residential',
    floors: 12,
    budget: 45000000,
    timeline: '18 Months',
    status: 'Analyzed',
    createdAt: new Date(),
    drawingUrl: 'https://picsum.photos/800/600?random=1',
  },
  {
    id: 'prj_002',
    name: 'Central Mall Expansion',
    location: 'Dubai, UAE',
    buildingType: 'Commercial',
    floors: 3,
    budget: 120000000,
    timeline: '24 Months',
    status: 'Draft',
    createdAt: new Date(),
    drawingUrl: 'https://picsum.photos/800/600?random=2',
  }
];

export const MOCK_BOQ: BOQItem[] = [
  { id: '1', category: 'Excavation', description: 'Earthwork in excavation for foundation trenches', quantity: 1250, unit: 'm³', rate: 450, total: 562500, confidence: 94, reasoning: 'Calculated based on footing dimensions + 0.3m working space on all sides.' },
  { id: '2', category: 'Concrete', description: 'M25 grade RCC for footings and beams', quantity: 340, unit: 'm³', rate: 8500, total: 2890000, confidence: 98, reasoning: 'Direct volume extraction from slab and beam schedules.' },
  { id: '3', category: 'Steel', description: 'Fe500 grade TMT reinforcement bars', quantity: 42, unit: 'MT', rate: 65000, total: 2730000, confidence: 85, reasoning: 'Estimated using 80kg/m³ rule of thumb.' },
  { id: '4', category: 'Brickwork', description: '230mm thick brick masonry in CM 1:6', quantity: 850, unit: 'm²', rate: 1200, total: 1020000, confidence: 91, reasoning: 'Based on wall layouts and heights minus openings.' },
  { id: '5', category: 'Labor', description: 'Skilled and unskilled construction labor', quantity: 1, unit: 'LS', rate: 1500000, total: 1500000, confidence: 80, reasoning: 'Standard industry allocation for civil works.' },
];

export const MOCK_TEMPLATES: ProjectTemplate[] = [
  {
    id: 't_001',
    name: 'Standard High-Rise',
    buildingType: 'Residential',
    floors: 15,
    description: 'Template for multi-story residential towers with reinforced concrete frames.',
    baseBoq: [{ category: 'Concrete', unit: 'm³' }, { category: 'Steel', unit: 'MT' }]
  },
  {
    id: 't_002',
    name: 'Retail Plaza',
    buildingType: 'Commercial',
    floors: 3,
    description: 'Optimized for wide-span layouts and heavy flooring loads.',
    baseBoq: [{ category: 'Flooring', unit: 'm²' }]
  }
];

export const MOCK_STEEL_DETAILS: SteelDetail[] = [
  { id: 'st_1', barMark: 'C1-T1', diameter: 16, spacing: 150, shape: 'Straight', totalWeight: 1.2 },
  { id: 'st_2', barMark: 'C1-L1', diameter: 20, spacing: 100, shape: 'Bent', totalWeight: 2.8 },
  { id: 'st_3', barMark: 'B1-S1', diameter: 10, spacing: 200, shape: 'Stirrup', totalWeight: 0.5 },
];
