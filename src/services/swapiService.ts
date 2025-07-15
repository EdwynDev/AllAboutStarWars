export interface SWAPICharacter {
  name: string;
  birth_year: string;
  eye_color: string;
  gender: string;
  hair_color: string;
  height: string;
  mass: string;
  skin_color: string;
  homeworld: string;
  films: string[];
  species: string[];
  starships: string[];
  vehicles: string[];
  url: string;
}

export interface SWAPIFilm {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
  url: string;
}

export interface SWAPIStarship {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  hyperdrive_rating: string;
  MGLT: string;
  starship_class: string;
  pilots: string[];
  films: string[];
  url: string;
}

export interface SWAPIVehicle {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  vehicle_class: string;
  pilots: string[];
  films: string[];
  url: string;
}

export interface SWAPISpecies {
  name: string;
  classification: string;
  designation: string;
  average_height: string;
  skin_colors: string;
  hair_colors: string;
  eye_colors: string;
  average_lifespan: string;
  homeworld: string;
  language: string;
  people: string[];
  films: string[];
  url: string;
}

export interface SWAPIPlanet {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[];
  films: string[];
  url: string;
}

export interface SWAPIResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

const SWAPI_BASE_URL = 'https://swapi.py4e.com/api';

export class SWAPIService {
  private static async fetchData<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${SWAPI_BASE_URL}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`SWAPI HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('SWAPI Error:', error);
      throw error;
    }
  }

  private static async fetchAllPages<T>(endpoint: string): Promise<T[]> {
    let allData: T[] = [];
    let nextUrl: string | null = endpoint;

    while (nextUrl) {
      try {
        const response = await this.fetchData<SWAPIResponse<T>>(nextUrl.replace(SWAPI_BASE_URL, ''));
        allData = [...allData, ...response.results];
        nextUrl = response.next;
      } catch (error) {
        console.error('Error fetching SWAPI page:', error);
        break;
      }
    }

    return allData;
  }

  static async getAllCharacters(): Promise<SWAPICharacter[]> {
    return this.fetchAllPages<SWAPICharacter>('/people/');
  }

  static async getAllFilms(): Promise<SWAPIFilm[]> {
    return this.fetchAllPages<SWAPIFilm>('/films/');
  }

  static async getAllStarships(): Promise<SWAPIStarship[]> {
    return this.fetchAllPages<SWAPIStarship>('/starships/');
  }

  static async getAllVehicles(): Promise<SWAPIVehicle[]> {
    return this.fetchAllPages<SWAPIVehicle>('/vehicles/');
  }

  static async getAllSpecies(): Promise<SWAPISpecies[]> {
    return this.fetchAllPages<SWAPISpecies>('/species/');
  }

  static async getAllPlanets(): Promise<SWAPIPlanet[]> {
    return this.fetchAllPages<SWAPIPlanet>('/planets/');
  }

  static async getCharacterById(id: number): Promise<SWAPICharacter> {
    return this.fetchData<SWAPICharacter>(`/people/${id}/`);
  }

  static async getPlanetById(id: number): Promise<SWAPIPlanet> {
    return this.fetchData<SWAPIPlanet>(`/planets/${id}/`);
  }

  static async getSpeciesById(id: number): Promise<SWAPISpecies> {
    return this.fetchData<SWAPISpecies>(`/species/${id}/`);
  }

  static async getStarshipById(id: number): Promise<SWAPIStarship> {
    return this.fetchData<SWAPIStarship>(`/starships/${id}/`);
  }

  static async getVehicleById(id: number): Promise<SWAPIVehicle> {
    return this.fetchData<SWAPIVehicle>(`/vehicles/${id}/`);
  }

  static async getFilmById(id: number): Promise<SWAPIFilm> {
    return this.fetchData<SWAPIFilm>(`/films/${id}/`);
  }

  // Utility function to extract ID from SWAPI URL
  static extractIdFromUrl(url: string): number | null {
    const match = url.match(/\/(\d+)\/$/);
    return match ? parseInt(match[1], 10) : null;
  }

  // Search functions
  static async searchCharacters(query: string): Promise<SWAPICharacter[]> {
    const response = await this.fetchData<SWAPIResponse<SWAPICharacter>>(`/people/?search=${encodeURIComponent(query)}`);
    return response.results;
  }

  static async searchPlanets(query: string): Promise<SWAPIPlanet[]> {
    const response = await this.fetchData<SWAPIResponse<SWAPIPlanet>>(`/planets/?search=${encodeURIComponent(query)}`);
    return response.results;
  }

  static async searchSpecies(query: string): Promise<SWAPISpecies[]> {
    const response = await this.fetchData<SWAPIResponse<SWAPISpecies>>(`/species/?search=${encodeURIComponent(query)}`);
    return response.results;
  }

  static async searchStarships(query: string): Promise<SWAPIStarship[]> {
    const response = await this.fetchData<SWAPIResponse<SWAPIStarship>>(`/starships/?search=${encodeURIComponent(query)}`);
    return response.results;
  }

  static async searchVehicles(query: string): Promise<SWAPIVehicle[]> {
    const response = await this.fetchData<SWAPIResponse<SWAPIVehicle>>(`/vehicles/?search=${encodeURIComponent(query)}`);
    return response.results;
  }

  static async searchFilms(query: string): Promise<SWAPIFilm[]> {
    const response = await this.fetchData<SWAPIResponse<SWAPIFilm>>(`/films/?search=${encodeURIComponent(query)}`);
    return response.results;
  }
}