export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type AppStackParamList = {
  Home: undefined;
  Statistics: {
    percentage: number;
    bestSequence: number;
    totalMeals: number;
    insideDiet: number;
    outsideDiet: number;
  };
  MealForm: {
    id: string
  }
};