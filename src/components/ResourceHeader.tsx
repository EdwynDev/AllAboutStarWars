import React from 'react';
import { Users, Bot, Dna, MapPin, Shield, Car, Film } from 'lucide-react';
import { ResourceType } from '../types/starwars';

interface ResourceHeaderProps {
  resource: ResourceType;
  count: number;
}

const ResourceHeader: React.FC<ResourceHeaderProps> = ({ resource, count }) => {
  const getResourceInfo = () => {
    switch (resource) {
      case 'characters':
        return {
          icon: Users,
          title: 'Characters',
          description: 'Heroes, villains, and everyone in between from the Star Wars universe.',
          gradient: 'from-blue-500 to-cyan-500'
        };
      case 'films':
        return {
          icon: Film,
          title: 'Films',
          description: 'The epic saga of Star Wars movies and their stories.',
          gradient: 'from-yellow-500 to-amber-500'
        };
      case 'droids':
        return {
          icon: Bot,
          title: 'Droids',
          description: 'Mechanical beings that have shaped the galaxy\'s history.',
          gradient: 'from-yellow-500 to-orange-500'
        };
      case 'species':
        return {
          icon: Dna,
          title: 'Species',
          description: 'The diverse alien races that inhabit the Star Wars galaxy.',
          gradient: 'from-green-500 to-emerald-500'
        };
      case 'locations':
        return {
          icon: MapPin,
          title: 'Locations',
          description: 'Planets, systems, and important places across the galaxy.',
          gradient: 'from-purple-500 to-pink-500'
        };
      case 'organizations':
        return {
          icon: Shield,
          title: 'Organizations',
          description: 'Factions, governments, and groups that shape galactic politics.',
          gradient: 'from-red-500 to-rose-500'
        };
      case 'vehicles':
        return {
          icon: Car,
          title: 'Vehicles',
          description: 'Ships, speeders, and other vehicles from across the galaxy.',
          gradient: 'from-indigo-500 to-blue-500'
        };
      default:
        return {
          icon: Users,
          title: 'Unknown',
          description: 'Unknown resource type.',
          gradient: 'from-gray-500 to-gray-600'
        };
    }
  };

  const { icon: Icon, title, description, gradient } = getResourceInfo();

  return (
    <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-md border border-blue-500/20 rounded-xl p-6 mb-8">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${gradient}`}>
          <Icon size={32} className="text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
          <p className="text-gray-300 text-lg">{description}</p>
          <div className="mt-2">
            <span className="text-blue-400 font-medium">{count} items available</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceHeader;