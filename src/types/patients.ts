export type Goal =
  | "WEIGHT_LOSS"
  | "HYPERTROPHY"
  | "REEDUCATION"
  | "MAINTENANCE";

export type PatientStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "PAUSED";

export type PatientUser = {
  id: string;
  name: string;
  email: string;
};

export type PatientProfile = {
  id: string;
  userId: string;
  nutritionistId: string;

  goal: Goal;
  status: PatientStatus;

  birthDate: string | null;
  height: number | null;
  targetWeight: number | null;
  observation: string | null;

  createdAt: string;
  updatedAt: string;

  user: PatientUser;
};