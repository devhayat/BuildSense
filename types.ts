
export type UserRole = 'Civil Engineer' | 'Contractor' | 'Student' | 'Admin';

export interface BOQItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  total: number;
  confidence: number;
  reasoning: string;
  uncertaintyReason?: string;
}

export interface DesignError {
  id: string;
  severity: 'Critical' | 'Warning' | 'Info';
  location: string;
  issue: string;
  recommendation: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  buildingType: string;
  floors: number;
  budget: number;
  timeline: string;
  status: 'Draft' | 'Analyzed' | 'Confirmed';
  createdAt: Date;
  drawingUrl?: string;
  boq?: BOQItem[];
  errors?: DesignError[];
}

export interface ProjectTemplate {
  id: string;
  name: string;
  buildingType: string;
  floors: number;
  description: string;
  baseBoq: Partial<BOQItem>[];
}

export interface SimulationResult {
  deltaCost: number;
  deltaQuantities: { [key: string]: number };
  impactSummary: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  persona?: 'Senior Site Engineer' | 'Quantity Surveyor' | 'Consultant';
}

export interface SteelDetail {
  id: string;
  barMark: string;
  diameter: number;
  spacing: number;
  shape: string;
  totalWeight: number;
}
