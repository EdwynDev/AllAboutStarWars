import React, { useState, useMemo } from 'react';
import ResourceCard from './ResourceCard';
import Pagination from './Pagination';
import EnhancedDetailModal from './EnhancedDetailModal';
import { ResourceType } from '../types/starwars';

interface ResourceGridProps {
  data: any[];
  type: ResourceType;
  searchQuery: string;
}

const ResourceGrid: React.FC<ResourceGridProps> = ({ data, type, searchQuery }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 20;

  const filteredData = useMemo(() => {
    return data.filter(item => 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Reset to page 1 when search query changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleViewDetails = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };
  if (filteredData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg">
          {searchQuery ? 'No results found for your search.' : 'No data available.'}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentData.map((item) => (
          <ResourceCard
            key={item.id || item.name}
            data={item}
            type={type}
            onViewDetails={() => handleViewDetails(item)}
          />
        ))}
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
      />
      
      <EnhancedDetailModal
        data={selectedItem}
        type={type}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default ResourceGrid;