export type Ingredient = {
  name: string;
  targetWeight: number;
};

export type Recipe = {
  id: string;
  name: string;
  ingredients: Ingredient[];
};

export type Pen = {
  id: string;
  name: string;
  headCount: number;
  arrivalDate: string;
  initialWeight: number;
  expectedShipDate: string;
  animalTags: string[];
  recipeId: string;
  photoUrl: string;
  photoHint: string;
  status: 'Active' | 'Closed';
};

export type FeedingRecord = {
  id: string;
  penId: string;
  date: string;
  ingredients: { name: string; actualWeight: number }[];
};

export type HealthRecord = {
  id: string;
  penId: string;
  cowTag?: string;
  drugName: string;
  treatmentDate: string;
  dosage?: string;
  reminderDays?: 60 | 75 | 90;
};

export type ClosedGroupInfo = {
  penId: string;
  finalWeight: number;
  saleDate: string;
  salePrice: number;
};
