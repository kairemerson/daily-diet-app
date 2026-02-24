export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type PatientStackParamList = {
  Home: undefined;
  Statistics: {
    percentage: number;
    bestSequence: number;
    totalMeals: number;
    insideDiet: number;
    outsideDiet: number;
  };
  MealForm: {
    id?: string
  } | undefined
  Feedback: {
    isOnDiet: boolean
  }
  MealDetails: {
    id: string
  }
};

export type AdminStackParamList = {
    HomeAdmin: undefined
    Dashboard: undefined;
    PatientDetails: { patientId: string };
    CreatePatient: undefined;
}