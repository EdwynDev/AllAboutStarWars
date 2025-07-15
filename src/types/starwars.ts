export interface Character {
  id: string;
  name: string;
  description: string;
  image: string;
  species?: string;
  homeworld?: string;
  gender?: string;
  height?: string;
  mass?: string;
  hair_color?: string;
  skin_color?: string;
  eye_color?: string;
  birth_year?: string;
  affiliations?: string[];
}

export interface Droid {
  id: string;
  name: string;
  description: string;
  image: string;
  manufacturer?: string;
  model?: string;
  class?: string;
  height?: string;
  mass?: string;
  color?: string;
  affiliations?: string[];
}

export interface Species {
  id: string;
  name: string;
  description: string;
  image: string;
  classification?: string;
  designation?: string;
  homeworld?: string;
  average_height?: string;
  average_lifespan?: string;
  language?: string;
  skin_colors?: string;
  hair_colors?: string;
  eye_colors?: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  image: string;
  region?: string;
  sector?: string;
  system?: string;
  terrain?: string;
  climate?: string;
  gravity?: string;
  population?: string;
  government?: string;
  capital?: string;
  language?: string;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  image: string;
  type?: string;
  founded?: string;
  dissolved?: string;
  headquarters?: string;
  leaders?: string[];
  members?: string[];
  affiliations?: string[];
}

export interface Vehicle {
  id: string;
  name: string;
  description: string;
  image: string;
  model?: string;
  manufacturer?: string;
  class?: string;
  length?: string;
  width?: string;
  height?: string;
  max_speed?: string;
  crew?: string;
  passengers?: string;
  cargo_capacity?: string;
  consumables?: string;
  cost?: string;
  affiliations?: string[];
}

export type ResourceType = 'characters' | 'droids' | 'species' | 'locations' | 'organizations' | 'vehicles';

export interface ApiResponse<T> {
  data: T[];
  count: number;
  next?: string;
  previous?: string;
}