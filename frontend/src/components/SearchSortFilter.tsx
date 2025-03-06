// SearchSortFilter.tsx
import React, { useState, KeyboardEvent } from "react";
import LoadingSpinner from "./LoadingSpinner";

type SearchSortFilterProps = {
  onSearchSubmit: (searchTerm: string) => void;
  onSortChange: (sortField: string, sortOrder: string) => void;
  onLimitChange: (limit: number) => void;
  isLoading?: boolean;
};

const SearchSortFilter = ({
  onSearchSubmit,
  onSortChange,
  onLimitChange,
  isLoading
}: SearchSortFilterProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [limit, setLimit] = useState(9);

  const handleSearchKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      triggerSearch();
    }
  };

  const triggerSearch = () => {
    if (!isLoading) {
      onSearchSubmit(searchTerm);
    }
  };

  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newField = e.target.value;
    setSortField(newField);
    onSortChange(newField, sortOrder);
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newOrder = e.target.value;
    setSortOrder(newOrder);
    onSortChange(sortField, newOrder);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    setLimit(newLimit);
    onLimitChange(newLimit);
  };

  return (
    <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Search components..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleSearchKeyPress}
          disabled={isLoading}
          style={{ paddingRight: "40px" }}
        />
        <button
          onClick={triggerSearch}
          disabled={isLoading}
          style={{ 
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer"
          }}
        >
          {isLoading ? (
            <LoadingSpinner size={20} color="#202020" />
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          )}
        </button>
      </div>

      <select 
        value={sortField} 
        onChange={handleSortFieldChange}
        disabled={isLoading}
      >
        <option value="created_at">Date</option>
        <option value="title">Title</option>
      </select>

      <select 
        value={sortOrder} 
        onChange={handleSortOrderChange}
        disabled={isLoading}
      >
        <option value="desc">Newest First</option>
        <option value="asc">Oldest First</option>
      </select>

      <select 
        value={limit} 
        onChange={handleLimitChange}
        disabled={isLoading}
      >
        <option value="9">Show 9</option>
        <option value="12">Show 12</option>
        <option value="20">Show 20</option>
      </select>
    </div>
  );
};

export default SearchSortFilter;