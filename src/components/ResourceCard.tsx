import React from 'react';
import { ExternalLink } from 'lucide-react';

interface ResourceCardProps {
  data: any;
  type: string;
  onViewDetails: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ data, type, onViewDetails }) => {
  console.log('ResourceCard data:', data, 'type:', type);
  
  const getImageUrl = () => {
    if (data.image && data.image.includes('http')) {
      return data.image;
    }
    // Fallback to a placeholder if no image
    return `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=top`;
  };

  const getDetails = () => {
    switch (type) {
      case 'films':
        return [
          { label: 'Episode', value: `Episode ${data.episode_id}` },
          { label: 'Director', value: data.director },
          { label: 'Producer', value: data.producer },
          { label: 'Release Date', value: data.release_date },
        ];
      case 'characters':
        return [
          { label: 'Species', value: data.species },
          { label: 'Homeworld', value: data.homeworld },
          { label: 'Gender', value: data.gender },
          { label: 'Height', value: data.height },
        ];
      case 'droids':
        return [
          { label: 'Model', value: data.model },
          { label: 'Manufacturer', value: data.manufacturer },
          { label: 'Class', value: data.class },
          { label: 'Height', value: data.height },
        ];
      case 'species':
        return [
          { label: 'Classification', value: data.classification },
          { label: 'Homeworld', value: data.homeworld },
          { label: 'Language', value: data.language },
          { label: 'Lifespan', value: data.average_lifespan },
        ];
      case 'locations':
        return [
          { label: 'Region', value: data.region },
          { label: 'Climate', value: data.climate },
          { label: 'Terrain', value: data.terrain },
          { label: 'Population', value: data.population },
        ];
      case 'organizations':
        return [
          { label: 'Type', value: data.type },
          { label: 'Founded', value: data.founded },
          { label: 'Headquarters', value: data.headquarters },
          { label: 'Leaders', value: data.leaders?.join(', ') },
        ];
      case 'vehicles':
        return [
          { label: 'Model', value: data.model },
          { label: 'Manufacturer', value: data.manufacturer },
          { label: 'Class', value: data.class },
          { label: 'Length', value: data.length },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-md border border-blue-500/20 rounded-xl overflow-hidden hover:border-blue-400/40 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
      <div className="relative overflow-hidden">
        <img
          src={getImageUrl()}
          alt={data.name}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=top`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-xl font-bold text-white mb-1">{data.name || 'Unknown'}</h3>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-gray-300 text-sm mb-4 line-clamp-3 min-h-[3rem]">
          {data.description || 'No description available.'}
        </p>
        
        <div className="space-y-2">
          {getDetails().slice(0, 3).map((detail, index) => (
            detail.value && (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-400">{detail.label}:</span>
                <span className="text-blue-300 font-medium">{detail.value}</span>
              </div>
            )
          ))}
        </div>
        
        <button 
          onClick={onViewDetails}
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <ExternalLink size={16} />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
};

export default ResourceCard;