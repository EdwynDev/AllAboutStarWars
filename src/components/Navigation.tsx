import React from 'react';
import { Users, Bot, Dna, MapPin, Shield, Car, Film } from 'lucide-react';
import { ResourceType } from '../types/starwars';

interface NavigationProps {
  activeResource: ResourceType;
  onResourceChange: (resource: ResourceType) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  activeResource, 
  onResourceChange, 
  isOpen,
  onClose 
}) => {
  const resources = [
    { id: 'characters' as ResourceType, label: 'Characters', icon: Users, count: '900+' },
    { id: 'films' as ResourceType, label: 'Films', icon: Film, count: '6' },
    { id: 'droids' as ResourceType, label: 'Droids', icon: Bot, count: '50+' },
    { id: 'species' as ResourceType, label: 'Species', icon: Dna, count: '80+' },
    { id: 'locations' as ResourceType, label: 'Locations', icon: MapPin, count: '300+' },
    { id: 'organizations' as ResourceType, label: 'Organizations', icon: Shield, count: '100+' },
    { id: 'vehicles' as ResourceType, label: 'Vehicles', icon: Car, count: '200+' },
  ];

  const handleResourceClick = (resource: ResourceType) => {
    onResourceChange(resource);
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Navigation */}
      <nav className={`
        fixed lg:sticky top-0 left-0 h-screen bg-gray-900/95 backdrop-blur-md border-r border-blue-500/20 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-80 lg:w-64
      `}>
        <div className="p-6 pt-20 lg:pt-6">
          <div className="space-y-2">
            {resources.map((resource) => {
              const Icon = resource.icon;
              const isActive = activeResource === resource.id;
              
              return (
                <button
                  key={resource.id}
                  onClick={() => handleResourceClick(resource.id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{resource.label}</div>
                    <div className="text-sm text-gray-500">{resource.count}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;