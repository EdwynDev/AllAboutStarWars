import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Users, Bot, Dna, MapPin, Shield, Car, Calendar, Globe, Zap, Wrench, Clock, DollarSign, Gauge, Package, User, Star } from 'lucide-react';
import { ResourceType } from '../types/starwars';
import { EnhancedCharacter, EnhancedLocation, EnhancedSpecies, EnhancedVehicle } from '../services/enhancedApi';

interface EnhancedDetailModalProps {
  data: any;
  type: ResourceType;
  isOpen: boolean;
  onClose: () => void;
}

const EnhancedDetailModal: React.FC<EnhancedDetailModalProps> = ({ data, type, isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic']));

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

  // Fonction pour formater les valeurs avec la première lettre en majuscule
  const formatValue = (value: string | number | undefined | null): string => {
    if (!value || value === 'unknown' || value === 'n/a') return 'Unknown';
    const str = String(value);
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Fonction pour formater les valeurs numériques avec unités
  const formatValueWithUnit = (value: string | undefined, unit: string): string => {
    if (!value || value === 'unknown' || value === 'n/a') return 'Unknown';
    return `${value} ${unit}`;
  };

  const getIcon = () => {
    switch (type) {
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

  const renderExpandableSection = (title: string, items: any[], renderItem: (item: any) => React.ReactNode, icon?: React.ComponentType<any>) => {
    if (!items || items.length === 0) return null;

    const isExpanded = expandedSections.has(title.toLowerCase());
    const IconComponent = icon || Star;

    return (
      <div className="mb-4">
        <button
          onClick={() => toggleSection(title.toLowerCase())}
          className="flex items-center justify-between w-full p-4 bg-gray-800/50 rounded-lg border border-blue-500/20 hover:border-blue-400/40 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <IconComponent size={20} className="text-blue-400" />
            <span className="text-blue-400 font-medium">{title} ({items.length})</span>
          </div>
          {isExpanded ? <ChevronUp size={20} className="text-blue-400" /> : <ChevronDown size={20} className="text-blue-400" />}
        </button>
        
        {isExpanded && (
          <div className="mt-3 space-y-3 max-h-80 overflow-y-auto">
            {items.map((item, index) => (
              <div key={index} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                {renderItem(item)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderBasicInfo = () => {
    const isExpanded = expandedSections.has('basic');
    
    return (
      <div className="mb-4">
        <button
          onClick={() => toggleSection('basic')}
          className="flex items-center justify-between w-full p-4 bg-gray-800/50 rounded-lg border border-blue-500/20 hover:border-blue-400/40 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <User size={20} className="text-blue-400" />
            <span className="text-blue-400 font-medium">Basic Information</span>
          </div>
          {isExpanded ? <ChevronUp size={20} className="text-blue-400" /> : <ChevronDown size={20} className="text-blue-400" />}
        </button>
        
        {isExpanded && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderBasicInfoContent()}
          </div>
        )}
      </div>
    );
  };

  const renderBasicInfoContent = () => {
    const details = [];
    
    switch (type) {
      case 'characters':
        if (data.swapi_data?.birth_year) details.push({ label: 'Birth Year', value: data.swapi_data.birth_year, icon: Calendar });
        if (data.swapi_data?.gender) details.push({ label: 'Gender', value: formatValue(data.swapi_data.gender), icon: User });
        if (data.swapi_data?.height) details.push({ label: 'Height', value: formatValueWithUnit(data.swapi_data.height, 'cm'), icon: Gauge });
        if (data.swapi_data?.mass) details.push({ label: 'Mass', value: formatValueWithUnit(data.swapi_data.mass, 'kg'), icon: Package });
        if (data.swapi_data?.hair_color) details.push({ label: 'Hair Color', value: formatValue(data.swapi_data.hair_color), icon: User });
        if (data.swapi_data?.skin_color) details.push({ label: 'Skin Color', value: formatValue(data.swapi_data.skin_color), icon: User });
        if (data.swapi_data?.eye_color) details.push({ label: 'Eye Color', value: formatValue(data.swapi_data.eye_color), icon: User });
        break;
        
      case 'droids':
        if (data.model) details.push({ label: 'Model', value: formatValue(data.model), icon: Bot });
        if (data.manufacturer) details.push({ label: 'Manufacturer', value: formatValue(data.manufacturer), icon: Wrench });
        if (data.class) details.push({ label: 'Class', value: formatValue(data.class), icon: Bot });
        if (data.height) details.push({ label: 'Height', value: formatValueWithUnit(data.height, 'cm'), icon: Gauge });
        if (data.mass) details.push({ label: 'Mass', value: formatValueWithUnit(data.mass, 'kg'), icon: Package });
        if (data.color) details.push({ label: 'Color', value: formatValue(data.color), icon: User });
        break;
        
      case 'locations':
        if (data.swapi_data?.diameter) details.push({ label: 'Diameter', value: formatValueWithUnit(data.swapi_data.diameter, 'km'), icon: Globe });
        if (data.swapi_data?.rotation_period) details.push({ label: 'Rotation Period', value: formatValueWithUnit(data.swapi_data.rotation_period, 'hours'), icon: Clock });
        if (data.swapi_data?.orbital_period) details.push({ label: 'Orbital Period', value: formatValueWithUnit(data.swapi_data.orbital_period, 'days'), icon: Clock });
        if (data.swapi_data?.gravity) details.push({ label: 'Gravity', value: `${data.swapi_data.gravity} standard`, icon: Zap });
        if (data.swapi_data?.population) details.push({ label: 'Population', value: formatValue(data.swapi_data.population), icon: Users });
        if (data.swapi_data?.climate) details.push({ label: 'Climate', value: formatValue(data.swapi_data.climate), icon: Globe });
        if (data.swapi_data?.terrain) details.push({ label: 'Terrain', value: formatValue(data.swapi_data.terrain), icon: MapPin });
        if (data.swapi_data?.surface_water) details.push({ label: 'Surface Water', value: `${data.swapi_data.surface_water}%`, icon: Globe });
        break;
        
      case 'species':
        if (data.swapi_data?.classification) details.push({ label: 'Classification', value: formatValue(data.swapi_data.classification), icon: Dna });
        if (data.swapi_data?.designation) details.push({ label: 'Designation', value: formatValue(data.swapi_data.designation), icon: Dna });
        if (data.swapi_data?.average_height) details.push({ label: 'Average Height', value: formatValueWithUnit(data.swapi_data.average_height, 'cm'), icon: Gauge });
        if (data.swapi_data?.average_lifespan) details.push({ label: 'Average Lifespan', value: formatValueWithUnit(data.swapi_data.average_lifespan, 'years'), icon: Clock });
        if (data.swapi_data?.language) details.push({ label: 'Language', value: formatValue(data.swapi_data.language), icon: Globe });
        if (data.swapi_data?.skin_colors) details.push({ label: 'Skin Colors', value: formatValue(data.swapi_data.skin_colors), icon: User });
        if (data.swapi_data?.hair_colors) details.push({ label: 'Hair Colors', value: formatValue(data.swapi_data.hair_colors), icon: User });
        if (data.swapi_data?.eye_colors) details.push({ label: 'Eye Colors', value: formatValue(data.swapi_data.eye_colors), icon: User });
        break;
        
      case 'vehicles':
        if (data.swapi_data?.model) details.push({ label: 'Model', value: formatValue(data.swapi_data.model), icon: Car });
        if (data.swapi_data?.manufacturer) details.push({ label: 'Manufacturer', value: formatValue(data.swapi_data.manufacturer), icon: Wrench });
        if (data.swapi_data?.vehicle_class || data.swapi_data?.starship_class) {
          details.push({ label: 'Class', value: formatValue(data.swapi_data.vehicle_class || data.swapi_data.starship_class), icon: Car });
        }
        if (data.swapi_data?.length) details.push({ label: 'Length', value: formatValueWithUnit(data.swapi_data.length, 'm'), icon: Gauge });
        if (data.swapi_data?.cost_in_credits && data.swapi_data.cost_in_credits !== 'unknown') {
          details.push({ label: 'Cost', value: `${data.swapi_data.cost_in_credits} credits`, icon: DollarSign });
        }
        if (data.swapi_data?.crew) details.push({ label: 'Crew', value: formatValue(data.swapi_data.crew), icon: Users });
        if (data.swapi_data?.passengers) details.push({ label: 'Passengers', value: formatValue(data.swapi_data.passengers), icon: Users });
        if (data.swapi_data?.max_atmosphering_speed) details.push({ label: 'Max Speed', value: formatValue(data.swapi_data.max_atmosphering_speed), icon: Zap });
        if (data.swapi_data?.cargo_capacity) details.push({ label: 'Cargo Capacity', value: formatValueWithUnit(data.swapi_data.cargo_capacity, 'kg'), icon: Package });
        if (data.swapi_data?.consumables) details.push({ label: 'Consumables', value: formatValue(data.swapi_data.consumables), icon: Clock });
        if (data.swapi_data?.hyperdrive_rating) details.push({ label: 'Hyperdrive Rating', value: formatValue(data.swapi_data.hyperdrive_rating), icon: Zap });
        if (data.swapi_data?.MGLT) details.push({ label: 'MGLT', value: formatValue(data.swapi_data.MGLT), icon: Zap });
        break;

      case 'organizations':
        if (data.type) details.push({ label: 'Type', value: formatValue(data.type), icon: Shield });
        if (data.founded) details.push({ label: 'Founded', value: formatValue(data.founded), icon: Calendar });
        if (data.dissolved) details.push({ label: 'Dissolved', value: formatValue(data.dissolved), icon: Calendar });
        if (data.headquarters) details.push({ label: 'Headquarters', value: formatValue(data.headquarters), icon: MapPin });
        if (data.leaders?.length) details.push({ label: 'Leaders', value: data.leaders.join(', '), icon: User });
        break;
    }
    
    return details.map((detail, index) => {
      const IconComponent = detail.icon || Star;
      return (
        <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-blue-500/10 hover:border-blue-500/20 transition-colors">
          <div className="flex items-center space-x-2 mb-2">
            <IconComponent size={16} className="text-blue-400" />
            <div className="text-sm text-blue-400 font-medium">{detail.label}</div>
          </div>
          <div className="text-white font-medium">{detail.value}</div>
        </div>
      );
    });
  };

  const renderEnhancedContent = () => {
    switch (type) {
      case 'characters':
        return renderCharacterContent(data as EnhancedCharacter);
      case 'locations':
        return renderLocationContent(data as EnhancedLocation);
      case 'species':
        return renderSpeciesContent(data as EnhancedSpecies);
      case 'vehicles':
        return renderVehicleContent(data as EnhancedVehicle);
      default:
        return null;
    }
  };

  const renderCharacterContent = (character: EnhancedCharacter) => (
    <>
      {character.homeworld_details && (
        <div className="mb-4">
          <button
            onClick={() => toggleSection('homeworld')}
            className="flex items-center justify-between w-full p-4 bg-gray-800/50 rounded-lg border border-blue-500/20 hover:border-blue-400/40 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Globe size={20} className="text-blue-400" />
              <span className="text-blue-400 font-medium">Homeworld Details</span>
            </div>
            {expandedSections.has('homeworld') ? <ChevronUp size={20} className="text-blue-400" /> : <ChevronDown size={20} className="text-blue-400" />}
          </button>
          
          {expandedSections.has('homeworld') && (
            <div className="mt-3 bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <h5 className="font-bold text-white mb-3 text-lg">{character.homeworld_details.name}</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><span className="text-gray-400">Climate:</span> <span className="text-white font-medium">{formatValue(character.homeworld_details.climate)}</span></div>
                <div><span className="text-gray-400">Terrain:</span> <span className="text-white font-medium">{formatValue(character.homeworld_details.terrain)}</span></div>
                <div><span className="text-gray-400">Population:</span> <span className="text-white font-medium">{formatValue(character.homeworld_details.population)}</span></div>
                <div><span className="text-gray-400">Gravity:</span> <span className="text-white font-medium">{character.homeworld_details.gravity} standard</span></div>
                <div><span className="text-gray-400">Diameter:</span> <span className="text-white font-medium">{formatValueWithUnit(character.homeworld_details.diameter, 'km')}</span></div>
                <div><span className="text-gray-400">Surface Water:</span> <span className="text-white font-medium">{character.homeworld_details.surface_water}%</span></div>
              </div>
            </div>
          )}
        </div>
      )}

      {renderExpandableSection('Species Details', character.species_details || [], (species) => (
        <div>
          <h5 className="font-bold text-white text-lg mb-2">{species.name}</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div><span className="text-gray-400">Classification:</span> <span className="text-white">{formatValue(species.classification)}</span></div>
            <div><span className="text-gray-400">Designation:</span> <span className="text-white">{formatValue(species.designation)}</span></div>
            <div><span className="text-gray-400">Average Lifespan:</span> <span className="text-white">{formatValueWithUnit(species.average_lifespan, 'years')}</span></div>
            <div><span className="text-gray-400">Language:</span> <span className="text-white">{formatValue(species.language)}</span></div>
            <div><span className="text-gray-400">Average Height:</span> <span className="text-white">{formatValueWithUnit(species.average_height, 'cm')}</span></div>
            <div><span className="text-gray-400">Eye Colors:</span> <span className="text-white">{formatValue(species.eye_colors)}</span></div>
          </div>
        </div>
      ), Dna)}

      {renderExpandableSection('Starships Piloted', character.starships || [], (starship) => (
        <div>
          <h5 className="font-bold text-white text-lg mb-2">{starship.name}</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div><span className="text-gray-400">Model:</span> <span className="text-white">{formatValue(starship.model)}</span></div>
            <div><span className="text-gray-400">Class:</span> <span className="text-white">{formatValue(starship.starship_class)}</span></div>
            <div><span className="text-gray-400">Manufacturer:</span> <span className="text-white">{formatValue(starship.manufacturer)}</span></div>
            <div><span className="text-gray-400">Length:</span> <span className="text-white">{formatValueWithUnit(starship.length, 'm')}</span></div>
            <div><span className="text-gray-400">Crew:</span> <span className="text-white">{formatValue(starship.crew)}</span></div>
            <div><span className="text-gray-400">Hyperdrive Rating:</span> <span className="text-white">{formatValue(starship.hyperdrive_rating)}</span></div>
          </div>
        </div>
      ), Car)}

      {renderExpandableSection('Vehicles Piloted', character.vehicles_piloted || [], (vehicle) => (
        <div>
          <h5 className="font-bold text-white text-lg mb-2">{vehicle.name}</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div><span className="text-gray-400">Model:</span> <span className="text-white">{formatValue(vehicle.model)}</span></div>
            <div><span className="text-gray-400">Class:</span> <span className="text-white">{formatValue(vehicle.vehicle_class)}</span></div>
            <div><span className="text-gray-400">Manufacturer:</span> <span className="text-white">{formatValue(vehicle.manufacturer)}</span></div>
            <div><span className="text-gray-400">Length:</span> <span className="text-white">{formatValueWithUnit(vehicle.length, 'm')}</span></div>
            <div><span className="text-gray-400">Crew:</span> <span className="text-white">{formatValue(vehicle.crew)}</span></div>
            <div><span className="text-gray-400">Max Speed:</span> <span className="text-white">{formatValue(vehicle.max_atmosphering_speed)}</span></div>
          </div>
        </div>
      ), Car)}
    </>
  );

  const renderLocationContent = (location: EnhancedLocation) => (
    <>
      {renderExpandableSection('Residents', location.residents || [], (resident) => (
        <div>
          <h5 className="font-bold text-white text-lg mb-2">{resident.name}</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div><span className="text-gray-400">Birth Year:</span> <span className="text-white">{resident.birth_year}</span></div>
            <div><span className="text-gray-400">Gender:</span> <span className="text-white">{formatValue(resident.gender)}</span></div>
            <div><span className="text-gray-400">Height:</span> <span className="text-white">{formatValueWithUnit(resident.height, 'cm')}</span></div>
            <div><span className="text-gray-400">Eye Color:</span> <span className="text-white">{formatValue(resident.eye_color)}</span></div>
          </div>
        </div>
      ), Users)}
    </>
  );

  const renderSpeciesContent = (species: EnhancedSpecies) => (
    <>
      {species.homeworld_details && (
        <div className="mb-4">
          <button
            onClick={() => toggleSection('homeworld')}
            className="flex items-center justify-between w-full p-4 bg-gray-800/50 rounded-lg border border-blue-500/20 hover:border-blue-400/40 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Globe size={20} className="text-blue-400" />
              <span className="text-blue-400 font-medium">Homeworld Details</span>
            </div>
            {expandedSections.has('homeworld') ? <ChevronUp size={20} className="text-blue-400" /> : <ChevronDown size={20} className="text-blue-400" />}
          </button>
          
          {expandedSections.has('homeworld') && (
            <div className="mt-3 bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <h5 className="font-bold text-white mb-3 text-lg">{species.homeworld_details.name}</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><span className="text-gray-400">Climate:</span> <span className="text-white font-medium">{formatValue(species.homeworld_details.climate)}</span></div>
                <div><span className="text-gray-400">Terrain:</span> <span className="text-white font-medium">{formatValue(species.homeworld_details.terrain)}</span></div>
                <div><span className="text-gray-400">Population:</span> <span className="text-white font-medium">{formatValue(species.homeworld_details.population)}</span></div>
                <div><span className="text-gray-400">Gravity:</span> <span className="text-white font-medium">{species.homeworld_details.gravity} standard</span></div>
              </div>
            </div>
          )}
        </div>
      )}

      {renderExpandableSection('Notable People', species.people || [], (person) => (
        <div>
          <h5 className="font-bold text-white text-lg mb-2">{person.name}</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div><span className="text-gray-400">Birth Year:</span> <span className="text-white">{person.birth_year}</span></div>
            <div><span className="text-gray-400">Gender:</span> <span className="text-white">{formatValue(person.gender)}</span></div>
            <div><span className="text-gray-400">Height:</span> <span className="text-white">{formatValueWithUnit(person.height, 'cm')}</span></div>
            <div><span className="text-gray-400">Eye Color:</span> <span className="text-white">{formatValue(person.eye_color)}</span></div>
          </div>
        </div>
      ), Users)}
    </>
  );

  const renderVehicleContent = (vehicle: EnhancedVehicle) => (
    <>
      {renderExpandableSection('Pilots', vehicle.pilots || [], (pilot) => (
        <div>
          <h5 className="font-bold text-white text-lg mb-2">{pilot.name}</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div><span className="text-gray-400">Birth Year:</span> <span className="text-white">{pilot.birth_year}</span></div>
            <div><span className="text-gray-400">Gender:</span> <span className="text-white">{formatValue(pilot.gender)}</span></div>
            <div><span className="text-gray-400">Height:</span> <span className="text-white">{formatValueWithUnit(pilot.height, 'cm')}</span></div>
            <div><span className="text-gray-400">Eye Color:</span> <span className="text-white">{formatValue(pilot.eye_color)}</span></div>
          </div>
        </div>
      ), Users)}
    </>
  );

  const Icon = getIcon();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 backdrop-blur-md border border-blue-500/30 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative">
          <img
            src={getImageUrl()}
            alt={data.name || 'Unknown'}
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
                <h2 className="text-3xl font-bold text-white">{data.name || 'Unknown'}</h2>
                <p className="text-blue-300 capitalize">{type.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Description */}
          {data.description && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-3">Description</h3>
              <p className="text-gray-300 leading-relaxed">{data.description}</p>
            </div>
          )}

          {/* Basic Information */}
          {renderBasicInfo()}

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