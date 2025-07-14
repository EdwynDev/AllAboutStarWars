import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ResourceGrid from './components/ResourceGrid';
import ResourceHeader from './components/ResourceHeader';
import LoadingSpinner from './components/LoadingSpinner';
import { StarWarsAPI } from './services/api';
import { ResourceType } from './types/starwars';

function App() {
  const [activeResource, setActiveResource] = useState<ResourceType>('characters');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const loadData = async (resource: ResourceType) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Loading data for: ${resource}`);
      const result = await StarWarsAPI.getResourceByType(resource);
      console.log(`Received data:`, result);
      
      if (Array.isArray(result)) {
        setData(result);
      } else {
        console.warn('Data is not an array:', result);
        setData([]);
      }
    } catch (err) {
      setError(`Failed to load ${resource}. Please try again.`);
      console.error('Error loading data:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(activeResource);
  }, [activeResource]);

  const handleResourceChange = (resource: ResourceType) => {
    setActiveResource(resource);
    setSearchQuery('');
    // Reset any pagination state when changing resources
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white font-['Electrolize']">
      {/* Background Stars Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,#1e3a8a_0%,transparent_50%)] opacity-30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,#7c3aed_0%,transparent_50%)] opacity-20"></div>
      </div>

      <Header 
        onSearch={handleSearch}
        searchQuery={searchQuery}
        onToggleMenu={toggleMenu}
        isMenuOpen={isMenuOpen}
      />

      <div className="flex">
        <Navigation 
          activeResource={activeResource}
          onResourceChange={handleResourceChange}
          isOpen={isMenuOpen}
          onClose={closeMenu}
        />
        
        <main className="flex-1 lg:ml-64 p-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <ResourceHeader resource={activeResource} count={data.length} />
            
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-400 text-lg mb-4">{error}</div>
                <button 
                  onClick={() => loadData(activeResource)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <ResourceGrid 
                data={data}
                type={activeResource}
                searchQuery={searchQuery}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;