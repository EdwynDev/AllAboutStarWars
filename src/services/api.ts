import { Character, Droid, Species, Location, Organization, Vehicle, ResourceType } from '../types/starwars';

const BASE_URL = 'https://starwars-databank-server.vercel.app/api/v1';

export class StarWarsAPI {
  private static async fetchData<T>(endpoint: string): Promise<T> {
    try {
      console.log(`Fetching: ${BASE_URL}${endpoint}`);
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Data received:`, data);
      
      // Handle different response structures
      if (Array.isArray(data)) {
        return data;
      } else if (data.data && Array.isArray(data.data)) {
        return data.data;
      } else if (data.results && Array.isArray(data.results)) {
        return data.results;
      } else {
        console.warn('Unexpected data structure:', data);
        return data;
      }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  private static async fetchAllPages<T>(baseEndpoint: string): Promise<T[]> {
    let allData: T[] = [];
    let page = 1;
    let hasMoreData = true;

    while (hasMoreData) {
      try {
        const endpoint = `${baseEndpoint}?page=${page}&limit=50`;
        const data = await this.fetchData<T[]>(endpoint);
        
        if (Array.isArray(data) && data.length > 0) {
          allData = [...allData, ...data];
          page++;
          
          // If we get less than 50 items, we've reached the end
          if (data.length < 50) {
            hasMoreData = false;
          }
        } else {
          hasMoreData = false;
        }
      } catch (error) {
        // If pagination fails, try without pagination
        if (page === 1) {
          try {
            const data = await this.fetchData<T[]>(baseEndpoint);
            return Array.isArray(data) ? data : [];
          } catch (fallbackError) {
            console.error('Fallback API call failed:', fallbackError);
            return [];
          }
        }
        hasMoreData = false;
      }
    }

    return allData;
  }

  static async getCharacters(): Promise<Character[]> {
    return this.fetchAllPages<Character>('/characters');
  }

  static async getDroids(): Promise<Droid[]> {
    return this.fetchAllPages<Droid>('/droids');
  }

  static async getSpecies(): Promise<Species[]> {
    return this.fetchAllPages<Species>('/species');
  }

  static async getLocations(): Promise<Location[]> {
    return this.fetchAllPages<Location>('/locations');
  }

  static async getOrganizations(): Promise<Organization[]> {
    return this.fetchAllPages<Organization>('/organizations');
  }

  static async getVehicles(): Promise<Vehicle[]> {
    return this.fetchAllPages<Vehicle>('/vehicles');
  }

  static async getResourceByType(type: ResourceType): Promise<any[]> {
    switch (type) {
      case 'characters':
        return this.getCharacters();
      case 'droids':
        return this.getDroids();
      case 'species':
        return this.getSpecies();
      case 'locations':
        return this.getLocations();
      case 'organizations':
        return this.getOrganizations();
      case 'vehicles':
        return this.getVehicles();
      default:
        throw new Error(`Unknown resource type: ${type}`);
    }
  }
}