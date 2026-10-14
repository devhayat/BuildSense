
import React from 'react';
import { LayoutGrid, FileText, Activity, Users, Settings, Plus, Play, Info, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';
import { Project, BOQItem, ProjectTemplate, SteelDetail, MarketRate, LearningTip } from './types';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid className="w-5 h-5" /> },
  { id: 'projects', label: 'Projects', icon: <FileText className="w-5 h-5" /> },
  { id: 'mentorship', label: 'AI Mentor', icon: <Users className="w-5 h-5" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  { id: 'admin', label: 'Admin Panel', icon: <ShieldCheck className="w-5 h-5" /> },
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

export const REGIONS = [
  'Mumbai, IN', 'Delhi, IN', 'Bangalore, IN', 'Chennai, IN', 'Hyderabad, IN',
  'Dubai, UAE', 'Abu Dhabi, UAE', 'Riyadh, SA'
];

export const MARKET_RATES: MarketRate[] = [
  {
    id: 'mr_1', material: 'Earthwork Excavation', category: 'Excavation', unit: 'm³',
    rates: { 'Mumbai, IN': 450, 'Delhi, IN': 380, 'Bangalore, IN': 420, 'Chennai, IN': 400, 'Hyderabad, IN': 390, 'Dubai, UAE': 65, 'Abu Dhabi, UAE': 72, 'Riyadh, SA': 55 },
    lastUpdated: '2026-10-01', source: 'CPWD DSR 2026'
  },
  {
    id: 'mr_2', material: 'M25 RCC Concrete', category: 'Concrete', unit: 'm³',
    rates: { 'Mumbai, IN': 8500, 'Delhi, IN': 7800, 'Bangalore, IN': 8200, 'Chennai, IN': 7900, 'Hyderabad, IN': 7600, 'Dubai, UAE': 950, 'Abu Dhabi, UAE': 1020, 'Riyadh, SA': 880 },
    lastUpdated: '2026-10-01', source: 'CPWD DSR 2026'
  },
  {
    id: 'mr_3', material: 'M30 RCC Concrete', category: 'Concrete', unit: 'm³',
    rates: { 'Mumbai, IN': 9200, 'Delhi, IN': 8500, 'Bangalore, IN': 8900, 'Chennai, IN': 8600, 'Hyderabad, IN': 8300, 'Dubai, UAE': 1050, 'Abu Dhabi, UAE': 1120, 'Riyadh, SA': 960 },
    lastUpdated: '2026-10-01', source: 'CPWD DSR 2026'
  },
  {
    id: 'mr_4', material: 'Fe500 TMT Steel', category: 'Steel', unit: 'MT',
    rates: { 'Mumbai, IN': 65000, 'Delhi, IN': 62000, 'Bangalore, IN': 64000, 'Chennai, IN': 63000, 'Hyderabad, IN': 61000, 'Dubai, UAE': 3200, 'Abu Dhabi, UAE': 3400, 'Riyadh, SA': 2900 },
    lastUpdated: '2026-10-01', source: 'SAIL/Tata Steel Price List'
  },
  {
    id: 'mr_5', material: 'Fe550 TMT Steel', category: 'Steel', unit: 'MT',
    rates: { 'Mumbai, IN': 70000, 'Delhi, IN': 67000, 'Bangalore, IN': 69000, 'Chennai, IN': 68000, 'Hyderabad, IN': 66000, 'Dubai, UAE': 3500, 'Abu Dhabi, UAE': 3700, 'Riyadh, SA': 3150 },
    lastUpdated: '2026-10-01', source: 'SAIL/Tata Steel Price List'
  },
  {
    id: 'mr_6', material: '230mm Brick Masonry CM 1:6', category: 'Brickwork', unit: 'm²',
    rates: { 'Mumbai, IN': 1200, 'Delhi, IN': 1050, 'Bangalore, IN': 1150, 'Chennai, IN': 1100, 'Hyderabad, IN': 1000, 'Dubai, UAE': 145, 'Abu Dhabi, UAE': 155, 'Riyadh, SA': 125 },
    lastUpdated: '2026-10-01', source: 'CPWD DSR 2026'
  },
  {
    id: 'mr_7', material: 'Plastering 12mm CM 1:4', category: 'Plaster', unit: 'm²',
    rates: { 'Mumbai, IN': 280, 'Delhi, IN': 250, 'Bangalore, IN': 270, 'Chennai, IN': 260, 'Hyderabad, IN': 240, 'Dubai, UAE': 35, 'Abu Dhabi, UAE': 38, 'Riyadh, SA': 30 },
    lastUpdated: '2026-10-01', source: 'CPWD DSR 2026'
  },
  {
    id: 'mr_8', material: 'Vitrified Tile Flooring', category: 'Flooring', unit: 'm²',
    rates: { 'Mumbai, IN': 1450, 'Delhi, IN': 1300, 'Bangalore, IN': 1400, 'Chennai, IN': 1350, 'Hyderabad, IN': 1250, 'Dubai, UAE': 180, 'Abu Dhabi, UAE': 195, 'Riyadh, SA': 160 },
    lastUpdated: '2026-10-01', source: 'Market Survey Q4 2026'
  },
];

export const LEARNING_TIPS: LearningTip[] = [
  {
    category: 'Excavation',
    title: 'Understanding Earthwork Quantities',
    explanation: 'Excavation volume is calculated by measuring Length × Breadth × Depth of foundation trenches. Always add 150-300mm working space on all sides for safe operations and formwork placement.',
    formula: 'Volume = L × B × D (with 0.15-0.3m extra on each side)',
    proTip: 'As per IS 1200 Part 1, earthwork is measured in m³. Rates differ for soft soil, hard soil, and rock excavation. Always check soil investigation reports first.'
  },
  {
    category: 'Concrete',
    title: 'RCC Concrete Volume Calculation',
    explanation: 'Concrete quantity is derived from structural drawings by calculating the volume of each element — footings, columns, beams, slabs, and lintels. The grade (M25, M30) depends on structural design requirements.',
    formula: 'Footing: L×B×D | Column: L×B×H | Beam: L×B×D | Slab: L×B×thickness',
    proTip: 'Always add 2-5% wastage factor. M25 is standard for residential (fck=25 MPa). For high-rises above 10 floors, M30 or higher is typically required per IS 456:2000.'
  },
  {
    category: 'Steel',
    title: 'Steel Reinforcement Estimation',
    explanation: 'Steel quantity is estimated using the thumb rule (80-120 kg/m³ of concrete for residential, 130-150 kg/m³ for commercial) or precisely from the Bar Bending Schedule (BBS).',
    formula: 'Thumb Rule: Steel (kg) = 80-120 × Concrete Volume (m³) | BBS: Σ(No. of bars × Length × Unit weight)',
    proTip: 'Fe500 grade is most common in India. Lap length = 50d (where d = bar diameter). Always add 5% for cutting waste. Check IS 2502 for BBS preparation guidelines.'
  },
  {
    category: 'Brickwork',
    title: 'Masonry Wall Quantities',
    explanation: 'Brickwork area is calculated from wall layouts by computing total wall area and deducting all openings (doors, windows, ventilators). Standard brick size in India: 230×115×75mm.',
    formula: 'Net Area = Gross Wall Area − (Door openings + Window openings) | Volume = Area × Thickness',
    proTip: 'For 230mm walls, use 1:6 cement mortar ratio. Standard: ~500 bricks per m³ of brickwork. AAC blocks are increasingly replacing clay bricks in urban construction.'
  },
  {
    category: 'Labor',
    title: 'Construction Labor Estimation',
    explanation: 'Labor cost is typically estimated as 25-35% of the total material cost for civil works. It includes masons, bar benders, carpenters, helpers, and supervisory staff.',
    formula: 'Labor Cost ≈ 25-35% of Material Cost | Or use CPWD labor rates per unit of work',
    proTip: 'Labor rates vary significantly by city and season. Festival seasons and monsoon periods see 15-20% higher rates. Always include ESI and PF contributions in labor costing.'
  },
  {
    category: 'Plaster',
    title: 'Plastering Area Measurement',
    explanation: 'Plastering area is measured for both internal and external walls. Internal plaster is typically 12mm thick (1:4 CM) while external is 20mm thick (1:4 CM first coat + 1:3 CM finish).',
    formula: 'Plaster Area = 2 × (L+B) × H − Openings (for each room) | Ceiling = L × B',
    proTip: 'Deduct openings only if they exceed 0.5 m². Add 5% for reveals and sills around openings. POP punning is extra over plastering.'
  },
  {
    category: 'Flooring',
    title: 'Floor Area and Tiling',
    explanation: 'Flooring is measured as the carpet area of each room. Include skirting (100mm height) as running meters. Wastage for tiles depends on size — smaller tiles have less waste.',
    formula: 'Floor Area = L × B (per room) | Skirting = 2×(L+B) − door widths | Add 5-8% waste for tiles',
    proTip: 'Vitrified tiles (600×600mm) are standard for residential. For large halls, 800×800mm reduces joints. Always add 5% for breakage and 3% for cutting waste at edges.'
  },
];

export const PRACTICE_PROJECTS: Project[] = [
  {
    id: 'practice_001',
    name: '2BHK Residential Plan',
    location: 'Mumbai, IN',
    buildingType: 'Residential',
    floors: 4,
    budget: 12000000,
    timeline: '12 Months',
    status: 'Analyzed',
    createdAt: new Date(),
    drawingUrl: 'https://picsum.photos/800/600?random=101',
  },
  {
    id: 'practice_002',
    name: 'School Building G+2',
    location: 'Delhi, IN',
    buildingType: 'Institutional',
    floors: 3,
    budget: 25000000,
    timeline: '14 Months',
    status: 'Analyzed',
    createdAt: new Date(),
    drawingUrl: 'https://picsum.photos/800/600?random=102',
  },
  {
    id: 'practice_003',
    name: 'Small Warehouse',
    location: 'Bangalore, IN',
    buildingType: 'Industrial',
    floors: 1,
    budget: 8000000,
    timeline: '8 Months',
    status: 'Draft',
    createdAt: new Date(),
    drawingUrl: 'https://picsum.photos/800/600?random=103',
  },
];
