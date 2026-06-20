export type ProjectStatus = "ON_TRACK" | "NEEDS_ATTENTION" | "DELAYED" | "CRITICAL" | "COMPLETED";
export type ProjectPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type FlagType = "DELAYED" | "RISK" | "BUDGET_ISSUE" | "STAFF_SHORTAGE" | "COMPLIANCE_ISSUE" | "OTHER";
export type DistrictStatus = "GOOD" | "NEEDS_ATTENTION" | "CRITICAL";
export type WelfareProgramStatus = "ON_TRACK" | "NEEDS_ATTENTION" | "CRITICAL";
export type FacilityType =
  | "MOHALLA_CLINIC"
  | "POLYCLINIC"
  | "GOVERNMENT_HOSPITAL"
  | "ICU_BEDS"
  | "DIAGNOSTIC_CENTER"
  | "TELEMEDICINE_CENTER"
  | "AMBULANCE_STATION"
  | "MATERNITY_WARD"
  | "BLOOD_BANK";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN";
  employeeCode: string;
}

export interface District {
  id: string;
  name: string;
  performanceScore: number;
  scorePreviousQuarter: number | null;
  population: string; // BigInt serialized as string over JSON
  facilitiesCount: number;
  activeProjectsCount: number;
  budgetUtilizationPct: number;
  status: DistrictStatus;
  registeredPatients: string;
  hospitalBeds: number;
  doctorsAvailable: number;
  nursingStaff: number;
  ambulancesActive: number;
  vaccinationCoveragePct: number;
  hospitalBedOccupancyPct: number;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  done: boolean;
  dueDate: string | null;
  order: number;
}

export interface ProjectComment {
  id: string;
  projectId: string;
  authorId: string | null;
  author: { name: string } | null;
  text: string;
  createdAt: string;
}

export interface ProjectFlag {
  id: string;
  projectId: string;
  type: FlagType;
  note: string | null;
  raisedBy: string | null;
  createdAt: string;
  resolved: boolean;
}

export interface ProjectStatusHistoryEntry {
  id: string;
  projectId: string;
  status: ProjectStatus;
  note: string | null;
  changedBy: string | null;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  districtId: string | null;
  district: District | null;
  districtLabel: string | null;
  category: string;
  program: string | null;
  budgetCr: number;
  spentCr: number;
  status: ProjectStatus;
  priority: ProjectPriority;
  progressPct: number;
  officer: string | null;
  description: string | null;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
  milestones: Milestone[];
  comments: ProjectComment[];
  flags: ProjectFlag[];
  statusHistory: ProjectStatusHistoryEntry[];
}

export interface ProjectListSummary {
  total: number;
  active: number;
  completed: number;
  delayed: number;
  critical: number;
}

export interface Facility {
  id: string;
  type: FacilityType;
  districtId: string | null;
  district: District | null;
  name: string | null;
  completedCount: number;
  ongoingCount: number;
}

export interface FacilityOverviewRow {
  type: FacilityType;
  label: string;
  completed: number;
  ongoing: number;
}

export interface WelfareProgram {
  id: string;
  name: string;
  beneficiariesLabel: string;
  beneficiariesRaw: number;
  coveragePct: number;
  budgetAllocatedCr: number;
  budgetSpentCr: number;
  progressPct: number;
  status: WelfareProgramStatus;
}

export interface BudgetOverview {
  fiscalYear: string;
  allocatedCr: number;
  releasedCr: number;
  releasedPct: number;
  utilizedCr: number;
  utilizationRatePct: number;
  remainingCr: number;
  targetUtilPct: number;
  monthlyTrend: { month: string; utilPct: number }[];
  vaccinationByDistrict: { district: string; coveragePct: number }[];
  performanceByDistrict: { district: string; score: number }[];
  bedOccupancyByDistrict: { district: string; occupancyPct: number }[];
}

export interface DashboardSummary {
  lastUpdated: string;
  kpis: {
    activeProjects: number;
    delayedProjects: number;
    operationalFacilities: number;
    healthcarePersonnel: number;
    budgetUtilizationPct: number;
    pendingAdminTasks: number;
    deptPerformanceScore: number;
    citizenSatisfactionIndex: number;
  };
  alertBanners: {
    interventionBanner: string | null;
    delayedBanner: string | null;
    completionBanner: string | null;
  };
  districtHighlights: {
    bestPerforming: District | null;
    needsAttention: District | null;
    highestVaccination: District | null;
    mostImproved: (District & { improvementPct: number }) | null;
  };
  aiSummary: { text: string; severity: "info" | "warning" | "critical" }[];
  recommendations: { text: string; priority: "Low" | "Medium" | "High" | "Critical" }[];
}

export interface AuditLogEntry {
  id: string;
  user: { name: string; employeeCode: string } | null;
  action: string;
  entityType: string;
  entityId: string | null;
  oldValue: unknown;
  newValue: unknown;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  type: string;
  message: string;
  entityType: string | null;
  entityId: string | null;
  read: boolean;
  createdAt: string;
}
