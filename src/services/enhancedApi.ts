import { StarWarsAPI } from './api';
import { SWAPIService, SWAPICharacter, SWAPIPlanet, SWAPISpecies, SWAPIStarship, SWAPIVehicle, SWAPIFilm } from './swapiService';
import { Character, Droid, Species, Location, Organization, Vehicle, Film, ResourceType } from '../types/starwars';

export interface EnhancedCharacter extends Character {
  swapi_data?: SWAPICharacter;
  films?: SWAPIFilm[];
  homeworld_details?: SWAPIPlanet;
  species_details?: SWAPISpecies[];
  starships?: SWAPIStarship[];
  vehicles_piloted?: SWAPIVehicle[];
}

export interface EnhancedLocation extends Location {
  swapi_data?: SWAPIPlanet;
  residents?: SWAPICharacter[];
  films?: SWAPIFilm[];
}

export interface EnhancedSpecies extends Species {
  swapi_data?: SWAPISpecies;
  people?: SWAPICharacter[];
  films?: SWAPIFilm[];
  homeworld_details?: SWAPIPlanet;
}

export interface EnhancedVehicle extends Vehicle {
  swapi_data?: SWAPIStarship | SWAPIVehicle;
  pilots?: SWAPICharacter[];
  films?: SWAPIFilm[];
}

export interface EnhancedFilm extends Film {
  swapi_data?: SWAPIFilm;
  characters?: SWAPICharacter[];
  planets?: SWAPIPlanet[];
  species?: SWAPISpecies[];
  starships?: SWAPIStarship[];
  vehicles?: SWAPIVehicle[];
}

export class EnhancedStarWarsAPI {
  private static swapiCache = new Map<string, any>();
  private static cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private static async getCachedOrFetch<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    const cached = this.swapiCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const data = await fetchFn();
      this.swapiCache.set(key, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.warn(`Failed to fetch SWAPI data for ${key}:`, error);
      return cached?.data || null;
    }
  }

  private static findSWAPIMatch<T extends { name: string }>(
    name: string, 
    swapiData: T[]
  ): T | undefined {
    // Exact match first
    let match = swapiData.find(item => 
      item.name.toLowerCase() === name.toLowerCase()
    );

    if (!match) {
      // Partial match
      match = swapiData.find(item => 
        item.name.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(item.name.toLowerCase())
      );
    }

    // Special cases for common mismatches
    if (!match && name.toLowerCase().includes('vader')) {
      match = swapiData.find(item => item.name.toLowerCase().includes('vader'));
    }
    
    if (!match && name.toLowerCase().includes('skywalker')) {
      match = swapiData.find(item => item.name.toLowerCase().includes('skywalker'));
    }

    return match;
  }

  private static async resolveUrls<T>(urls: string[], fetchFn: (id: number) => Promise<T>): Promise<T[]> {
    const results: T[] = [];
    
    for (const url of urls) {
      const id = SWAPIService.extractIdFromUrl(url);
      if (id) {
        try {
          const data = await this.getCachedOrFetch(`${url}`, () => fetchFn(id));
          if (data) results.push(data);
        } catch (error) {
          console.warn(`Failed to resolve URL ${url}:`, error);
        }
      }
    }
    
    return results;
  }

  static async getEnhancedCharacters(): Promise<EnhancedCharacter[]> {
    const [originalData, swapiCharacters, swapiPlanets, swapiSpecies, swapiFilms, swapiStarships, swapiVehicles] = await Promise.all([
      StarWarsAPI.getCharacters(),
      this.getCachedOrFetch('swapi_characters', () => SWAPIService.getAllCharacters()),
      this.getCachedOrFetch('swapi_planets', () => SWAPIService.getAllPlanets()),
      this.getCachedOrFetch('swapi_species', () => SWAPIService.getAllSpecies()),
      this.getCachedOrFetch('swapi_films', () => SWAPIService.getAllFilms()),
      this.getCachedOrFetch('swapi_starships', () => SWAPIService.getAllStarships()),
      this.getCachedOrFetch('swapi_vehicles', () => SWAPIService.getAllVehicles()),
    ]);

    return Promise.all(originalData.map(async (character): Promise<EnhancedCharacter> => {
      const swapiMatch = this.findSWAPIMatch(character.name, swapiCharacters);
      
      let enhancedCharacter: EnhancedCharacter = { ...character };

      if (swapiMatch) {
        enhancedCharacter.swapi_data = swapiMatch;

        // Resolve homeworld
        if (swapiMatch.homeworld) {
          const homeworldId = SWAPIService.extractIdFromUrl(swapiMatch.homeworld);
          if (homeworldId) {
            enhancedCharacter.homeworld_details = await this.getCachedOrFetch(
              `planet_${homeworldId}`,
              () => SWAPIService.getPlanetById(homeworldId)
            );
          }
        }

        // Resolve species
        if (swapiMatch.species.length > 0) {
          enhancedCharacter.species_details = await this.resolveUrls(
            swapiMatch.species,
            SWAPIService.getSpeciesById
          );
        }

        // Resolve films
        if (swapiMatch.films.length > 0) {
          enhancedCharacter.films = await this.resolveUrls(
            swapiMatch.films,
            SWAPIService.getFilmById
          );
        }

        // Resolve starships
        if (swapiMatch.starships.length > 0) {
          enhancedCharacter.starships = await this.resolveUrls(
            swapiMatch.starships,
            SWAPIService.getStarshipById
          );
        }

        // Resolve vehicles
        if (swapiMatch.vehicles.length > 0) {
          enhancedCharacter.vehicles_piloted = await this.resolveUrls(
            swapiMatch.vehicles,
            SWAPIService.getVehicleById
          );
        }
      }

      return enhancedCharacter;
    }));
  }

  static async getEnhancedLocations(): Promise<EnhancedLocation[]> {
    const [originalData, swapiPlanets, swapiCharacters, swapiFilms] = await Promise.all([
      StarWarsAPI.getLocations(),
      this.getCachedOrFetch('swapi_planets', () => SWAPIService.getAllPlanets()),
      this.getCachedOrFetch('swapi_characters', () => SWAPIService.getAllCharacters()),
      this.getCachedOrFetch('swapi_films', () => SWAPIService.getAllFilms()),
    ]);

    return Promise.all(originalData.map(async (location): Promise<EnhancedLocation> => {
      const swapiMatch = this.findSWAPIMatch(location.name, swapiPlanets);
      
      let enhancedLocation: EnhancedLocation = { ...location };

      if (swapiMatch) {
        enhancedLocation.swapi_data = swapiMatch;

        // Resolve residents
        if (swapiMatch.residents.length > 0) {
          enhancedLocation.residents = await this.resolveUrls(
            swapiMatch.residents,
            SWAPIService.getCharacterById
          );
        }

        // Resolve films
        if (swapiMatch.films.length > 0) {
          enhancedLocation.films = await this.resolveUrls(
            swapiMatch.films,
            SWAPIService.getFilmById
          );
        }
      }

      return enhancedLocation;
    }));
  }

  static async getEnhancedSpecies(): Promise<EnhancedSpecies[]> {
    const [originalData, swapiSpecies, swapiCharacters, swapiPlanets, swapiFilms] = await Promise.all([
      StarWarsAPI.getSpecies(),
      this.getCachedOrFetch('swapi_species', () => SWAPIService.getAllSpecies()),
      this.getCachedOrFetch('swapi_characters', () => SWAPIService.getAllCharacters()),
      this.getCachedOrFetch('swapi_planets', () => SWAPIService.getAllPlanets()),
      this.getCachedOrFetch('swapi_films', () => SWAPIService.getAllFilms()),
    ]);

    return Promise.all(originalData.map(async (species): Promise<EnhancedSpecies> => {
      const swapiMatch = this.findSWAPIMatch(species.name, swapiSpecies);
      
      let enhancedSpecies: EnhancedSpecies = { ...species };

      if (swapiMatch) {
        enhancedSpecies.swapi_data = swapiMatch;

        // Resolve homeworld
        if (swapiMatch.homeworld) {
          const homeworldId = SWAPIService.extractIdFromUrl(swapiMatch.homeworld);
          if (homeworldId) {
            enhancedSpecies.homeworld_details = await this.getCachedOrFetch(
              `planet_${homeworldId}`,
              () => SWAPIService.getPlanetById(homeworldId)
            );
          }
        }

        // Resolve people
        if (swapiMatch.people.length > 0) {
          enhancedSpecies.people = await this.resolveUrls(
            swapiMatch.people,
            SWAPIService.getCharacterById
          );
        }

        // Resolve films
        if (swapiMatch.films.length > 0) {
          enhancedSpecies.films = await this.resolveUrls(
            swapiMatch.films,
            SWAPIService.getFilmById
          );
        }
      }

      return enhancedSpecies;
    }));
  }

  static async getEnhancedVehicles(): Promise<EnhancedVehicle[]> {
    const [originalData, swapiStarships, swapiVehicles, swapiCharacters, swapiFilms] = await Promise.all([
      StarWarsAPI.getVehicles(),
      this.getCachedOrFetch('swapi_starships', () => SWAPIService.getAllStarships()),
      this.getCachedOrFetch('swapi_vehicles', () => SWAPIService.getAllVehicles()),
      this.getCachedOrFetch('swapi_characters', () => SWAPIService.getAllCharacters()),
      this.getCachedOrFetch('swapi_films', () => SWAPIService.getAllFilms()),
    ]);

    return Promise.all(originalData.map(async (vehicle): Promise<EnhancedVehicle> => {
      // Try to match with starships first, then vehicles
      let swapiMatch = this.findSWAPIMatch(vehicle.name, swapiStarships) || 
                      this.findSWAPIMatch(vehicle.name, swapiVehicles);
      
      let enhancedVehicle: EnhancedVehicle = { ...vehicle };

      if (swapiMatch) {
        enhancedVehicle.swapi_data = swapiMatch;

        // Resolve pilots
        if (swapiMatch.pilots && swapiMatch.pilots.length > 0) {
          enhancedVehicle.pilots = await this.resolveUrls(
            swapiMatch.pilots,
            SWAPIService.getCharacterById
          );
        }

        // Resolve films
        if (swapiMatch.films && swapiMatch.films.length > 0) {
          enhancedVehicle.films = await this.resolveUrls(
            swapiMatch.films,
            SWAPIService.getFilmById
          );
        }
      }

      return enhancedVehicle;
    }));
  }

  static async getEnhancedFilms(): Promise<EnhancedFilm[]> {
    const [swapiFilms, swapiCharacters, swapiPlanets, swapiSpecies, swapiStarships, swapiVehicles] = await Promise.all([
      this.getCachedOrFetch('swapi_films', () => SWAPIService.getAllFilms()),
      this.getCachedOrFetch('swapi_characters', () => SWAPIService.getAllCharacters()),
      this.getCachedOrFetch('swapi_planets', () => SWAPIService.getAllPlanets()),
      this.getCachedOrFetch('swapi_species', () => SWAPIService.getAllSpecies()),
      this.getCachedOrFetch('swapi_starships', () => SWAPIService.getAllStarships()),
      this.getCachedOrFetch('swapi_vehicles', () => SWAPIService.getAllVehicles()),
    ]);

    return Promise.all(swapiFilms.map(async (film): Promise<EnhancedFilm> => {
      const enhancedFilm: EnhancedFilm = {
        id: SWAPIService.extractIdFromUrl(film.url)?.toString() || film.title,
        title: film.title,
        episode_id: film.episode_id,
        opening_crawl: film.opening_crawl,
        director: film.director,
        producer: film.producer,
        release_date: film.release_date,
        description: film.opening_crawl.substring(0, 200) + '...',
        image: `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=top`,
        swapi_data: film
      };

      // Resolve characters
      if (film.characters && film.characters.length > 0) {
        enhancedFilm.characters = await this.resolveUrls(
          film.characters,
          SWAPIService.getCharacterById
        );
      }

      // Resolve planets
      if (film.planets && film.planets.length > 0) {
        enhancedFilm.planets = await this.resolveUrls(
          film.planets,
          SWAPIService.getPlanetById
        );
      }

      // Resolve species
      if (film.species && film.species.length > 0) {
        enhancedFilm.species = await this.resolveUrls(
          film.species,
          SWAPIService.getSpeciesById
        );
      }

      // Resolve starships
      if (film.starships && film.starships.length > 0) {
        enhancedFilm.starships = await this.resolveUrls(
          film.starships,
          SWAPIService.getStarshipById
        );
      }

      // Resolve vehicles
      if (film.vehicles && film.vehicles.length > 0) {
        enhancedFilm.vehicles = await this.resolveUrls(
          film.vehicles,
          SWAPIService.getVehicleById
        );
      }

      return enhancedFilm;
    }));
  }

  static async getEnhancedResourceByType(type: ResourceType): Promise<any[]> {
    switch (type) {
      case 'characters':
        return this.getEnhancedCharacters();
      case 'films':
        return this.getEnhancedFilms();
      case 'droids':
        return StarWarsAPI.getDroids(); // No SWAPI equivalent for droids specifically
      case 'species':
        return this.getEnhancedSpecies();
      case 'locations':
        return this.getEnhancedLocations();
      case 'organizations':
        return StarWarsAPI.getOrganizations(); // No direct SWAPI equivalent
      case 'vehicles':
        return this.getEnhancedVehicles();
      default:
        throw new Error(`Unknown resource type: ${type}`);
    }
  }
}