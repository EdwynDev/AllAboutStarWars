import React, { useState } from 'react';
import { X, ExternalLink, Users, Bot, Dna, MapPin, Shield, Car, Film, ChevronDown, ChevronUp } from 'lucide-react';
import { ResourceType } from '../types/starwars';
import { EnhancedCharacter, EnhancedLocation, EnhancedSpecies, EnhancedVehicle } from '../services/enhancedApi';

interface EnhancedDetailModalProps {
  data: any;
  type: ResourceType;
  isOpen: boolean;
  onClose: () => void;
}

const EnhancedDetailModal: React.FC<EnhancedDetailModalProps> = ({ data, type, isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  if (!isOpen || !data) return null;

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getIcon = () => {
    switch (type) {
      case 'films': return Film;
      case 'characters': return Users;
      case 'droids': return Bot;
      case 'species': return Dna;
      case 'locations': return MapPin;
      case 'organizations': return Shield;
      case 'vehicles': return Car;
      default: return Users;
    }
  };

  const getImageUrl = () => {
    if (data.image && data.image.includes('http')) {
      return data.image;
    }
    return `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=top`;
  };

  const renderExpandableSection = (title: string, items: any[], renderItem: (item: any) => React.ReactNode) => {
    if (!items || items.length === 0) return null;

    const isExpanded = expandedSections.has(title);

    return (
      <div className="mb-4">
        <button
          onClick={() => toggleSection(title)}
          className="flex items-center justify-between w-full p-3 bg-gray-800/50 rounded-lg border border-blue-500/20 hover:border-blue-400/40 transition-colors"
        >
          <span className="text-blue-400 font-medium">{title} ({items.length})</span>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {isExpanded && (
          <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
            {items.map((item, index) => (
              <div key={index} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                {renderItem(item)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderEnhancedCharacterDetails = (character: EnhancedCharacter) => (
    <>
      {character.swapi_data && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-blue-400 mb-3">Enhanced Details from SWAPI</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {character.swapi_data.birth_year && (
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-sm text-blue-400 font-medium">Birth Year</div>
                <div className="text-white">{character.swapi_data.birth_year}</div>
              </div>
            )}
            {character.swapi_data.eye_color && (
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-sm text-blue-400 font-medium">Eye Color</div>
                <div className="text-white">{character.swapi_data.eye_color}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {character.homeworld_details && (
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-blue-400 mb-2">Homeworld Details</h4>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-blue-500/20">
            <h5 className="font-medium text-white mb-2">{character.homeworld_details.name}</h5>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-gray-400">Climate:</span> <span className="text-white">{character.homeworld_details.climate}</span></div>
              <div><span className="text-gray-400">Terrain:</span> <span className="text-white">{character.homeworld_details.terrain}</span></div>
              <div><span className="text-gray-400">Population:</span> <span className="text-white">{character.homeworld_details.population}</span></div>
              <div><span className="text-gray-400">Gravity:</span> <span className="text-white">{character.homeworld_details.gravity}</span></div>
            </div>
          </div>
        </div>
      )}

      {renderExpandableSection('Films Appeared In', character.films || [], (film) => (
        <div>
          <h5 className="font-medium text-white">{film.title}</h5>
          <p className="text-sm text-gray-400">Episode {film.episode_id} • {film.release_date}</p>
          <p className="text-sm text-gray-300 mt-1">Directed by {film.director}</p>
        </div>
      ))}

      {renderExpandableSection('Species Details', character.species_details || [], (species) => (
        <div>
          <h5 className="font-medium text-white">{species.name}</h5>
          <p className="text-sm text-gray-400">{species.classification} • {species.designation}</p>
          <p className="text-sm text-gray-300">Average lifespan: {species.average_lifespan} years</p>
        </div>
      ))}

      {renderExpandableSection('Starships Piloted', character.starships || [], (starship) => (
        <div>
          <h5 className="font-medium text-white">{starship.name}</h5>
          <p className="text-sm text-gray-400">{starship.model} • {starship.starship_class}</p>
          <p className="text-sm text-gray-300">Manufacturer: {starship.manufacturer}</p>
        </div>
      ))}

      {renderExpandableSection('Vehicles Piloted', character.vehicles_piloted || [], (vehicle) => (
        <div>
          <h5 className="font-medium text-white">{vehicle.name}</h5>
          <p className="text-sm text-gray-400">{vehicle.model} • {vehicle.vehicle_class}</p>
          <p className="text-sm text-gray-300">Manufacturer: {vehicle.manufacturer}</p>
        </div>
      ))}
    </>
  );

  const renderEnhancedContent = () => {
    switch (type) {
      case 'characters':
        return renderEnhancedCharacterDetails(data as EnhancedCharacter);
      default:
        return null;
    }
  };

  const Icon = getIcon();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 backdrop-blur-md border border-blue-500/30 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative">
          <img
            src={getImageUrl()}
            alt={data.name}
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=top`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all duration-200"
          >
            <X size={24} />
          </button>
          
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <Icon size={32} className="text-blue-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">{data.name || data.title || 'Unknown'}</h2>
                <p className="text-blue-300 capitalize">{type.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Description */}
          {(data.description || data.opening_crawl) && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-3">Description</h3>
              <p className="text-gray-300 leading-relaxed">{data.description || data.opening_crawl}</p>
            </div>
          )}

          {/* Enhanced Content */}
          {renderEnhancedContent()}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Enhanced with data from SWAPI and Star Wars Databank
              </div>
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDetailModal;