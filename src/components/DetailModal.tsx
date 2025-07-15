import React from 'react';
import { X, ExternalLink, Users, Bot, Dna, MapPin, Shield, Car, Film } from 'lucide-react';
import { ResourceType } from '../types/starwars';

interface DetailModalProps {
  data: any;
  type: ResourceType;
  isOpen: boolean;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ data, type, isOpen, onClose }) => {
  if (!isOpen || !data) return null;

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

  const getAllDetails = () => {
    const details = [];
    
    switch (type) {
      case 'films':
        if (data.episode_id) details.push({ label: 'Episode', value: `Episode ${data.episode_id}` });
        if (data.director) details.push({ label: 'Director', value: data.director });
        if (data.producer) details.push({ label: 'Producer', value: data.producer });
        if (data.release_date) details.push({ label: 'Release Date', value: data.release_date });
        if (data.opening_crawl) details.push({ label: 'Opening Crawl', value: data.opening_crawl });
        break;
      case 'characters':
        if (data.species) details.push({ label: 'Species', value: data.species });
        if (data.homeworld) details.push({ label: 'Homeworld', value: data.homeworld });
        if (data.gender) details.push({ label: 'Gender', value: data.gender });
        if (data.height) details.push({ label: 'Height', value: data.height });
        if (data.mass) details.push({ label: 'Mass', value: data.mass });
        if (data.hair_color) details.push({ label: 'Hair Color', value: data.hair_color });
        if (data.skin_color) details.push({ label: 'Skin Color', value: data.skin_color });
        if (data.eye_color) details.push({ label: 'Eye Color', value: data.eye_color });
        if (data.birth_year) details.push({ label: 'Birth Year', value: data.birth_year });
        if (data.affiliations?.length) details.push({ label: 'Affiliations', value: data.affiliations.join(', ') });
        break;
        
      case 'droids':
        if (data.model) details.push({ label: 'Model', value: data.model });
        if (data.manufacturer) details.push({ label: 'Manufacturer', value: data.manufacturer });
        if (data.class) details.push({ label: 'Class', value: data.class });
        if (data.height) details.push({ label: 'Height', value: data.height });
        if (data.mass) details.push({ label: 'Mass', value: data.mass });
        if (data.color) details.push({ label: 'Color', value: data.color });
        if (data.affiliations?.length) details.push({ label: 'Affiliations', value: data.affiliations.join(', ') });
        break;
        
      case 'species':
        if (data.classification) details.push({ label: 'Classification', value: data.classification });
        if (data.designation) details.push({ label: 'Designation', value: data.designation });
        if (data.homeworld) details.push({ label: 'Homeworld', value: data.homeworld });
        if (data.average_height) details.push({ label: 'Average Height', value: data.average_height });
        if (data.average_lifespan) details.push({ label: 'Average Lifespan', value: data.average_lifespan });
        if (data.language) details.push({ label: 'Language', value: data.language });
        if (data.skin_colors) details.push({ label: 'Skin Colors', value: data.skin_colors });
        if (data.hair_colors) details.push({ label: 'Hair Colors', value: data.hair_colors });
        if (data.eye_colors) details.push({ label: 'Eye Colors', value: data.eye_colors });
        break;
        
      case 'locations':
        if (data.region) details.push({ label: 'Region', value: data.region });
        if (data.sector) details.push({ label: 'Sector', value: data.sector });
        if (data.system) details.push({ label: 'System', value: data.system });
        if (data.terrain) details.push({ label: 'Terrain', value: data.terrain });
        if (data.climate) details.push({ label: 'Climate', value: data.climate });
        if (data.gravity) details.push({ label: 'Gravity', value: data.gravity });
        if (data.population) details.push({ label: 'Population', value: data.population });
        if (data.government) details.push({ label: 'Government', value: data.government });
        if (data.capital) details.push({ label: 'Capital', value: data.capital });
        if (data.language) details.push({ label: 'Language', value: data.language });
        break;
        
      case 'organizations':
        if (data.type) details.push({ label: 'Type', value: data.type });
        if (data.founded) details.push({ label: 'Founded', value: data.founded });
        if (data.dissolved) details.push({ label: 'Dissolved', value: data.dissolved });
        if (data.headquarters) details.push({ label: 'Headquarters', value: data.headquarters });
        if (data.leaders?.length) details.push({ label: 'Leaders', value: data.leaders.join(', ') });
        if (data.members?.length) details.push({ label: 'Members', value: data.members.join(', ') });
        if (data.affiliations?.length) details.push({ label: 'Affiliations', value: data.affiliations.join(', ') });
        break;
        
      case 'vehicles':
        if (data.model) details.push({ label: 'Model', value: data.model });
        if (data.manufacturer) details.push({ label: 'Manufacturer', value: data.manufacturer });
        if (data.class) details.push({ label: 'Class', value: data.class });
        if (data.length) details.push({ label: 'Length', value: data.length });
        if (data.width) details.push({ label: 'Width', value: data.width });
        if (data.height) details.push({ label: 'Height', value: data.height });
        if (data.max_speed) details.push({ label: 'Max Speed', value: data.max_speed });
        if (data.crew) details.push({ label: 'Crew', value: data.crew });
        if (data.passengers) details.push({ label: 'Passengers', value: data.passengers });
        if (data.cargo_capacity) details.push({ label: 'Cargo Capacity', value: data.cargo_capacity });
        if (data.consumables) details.push({ label: 'Consumables', value: data.consumables });
        if (data.cost) details.push({ label: 'Cost', value: data.cost });
        if (data.affiliations?.length) details.push({ label: 'Affiliations', value: data.affiliations.join(', ') });
        break;
    }
    
    return details;
  };

  const Icon = getIcon();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 backdrop-blur-md border border-blue-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
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
        <div className="p-6 max-h-96 overflow-y-auto">
          {/* Description */}
          {data.description && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-3">Description</h3>
              <p className="text-gray-300 leading-relaxed">{data.description}</p>
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getAllDetails().map((detail, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-blue-500/10">
                <div className="text-sm text-blue-400 font-medium mb-1">{detail.label}</div>
                <div className="text-white">{detail.value}</div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Data from Star Wars Databank API
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

export default DetailModal;