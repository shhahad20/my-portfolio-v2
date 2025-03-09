import React, { useState, KeyboardEvent } from "react";
import LoadingSpinner from "./LoadingSpinner";
import "../styles/searchSort.scss";

type SearchSortFilterProps = {
  onSearchSubmit: (searchTerm: string) => void;
  onSortChange: (sortField: string, sortOrder: string) => void;
  onLimitChange: (limit: number) => void;
  isLoading?: boolean;
};

const SearchSortFilter = ({
  onSearchSubmit,
  onSortChange,
  // onLimitChange,
  isLoading,
}: SearchSortFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("created_at");
  // const [sortOrder, setSortOrder] = useState('desc');
  // const [limit, setLimit] = useState(9);

  const handleSearchKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
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

  // const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const newOrder = e.target.value;
  //   setSortOrder(newOrder);
  //   onSortChange(sortField, newOrder);
  // };

  // const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const newLimit = Number(e.target.value);
  //   setLimit(newLimit);
  //   onLimitChange(newLimit);
  // };

  return (
    <div className="search-sort-filter">
      <div className="search-sort-filter__search-container">
        <input
          type="text"
          className="search-sort-filter__input"
          placeholder="Search ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleSearchKeyPress}
          disabled={isLoading}
        />
        <div className="search-sort-filter__icons-container">
          {isLoading ? (
            <LoadingSpinner size={20} color="#d3d354" />
          ) : (
            <>
              {/* <svg
              className="search-sort-filter__icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d3d354"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg> */}
              {/* <div className="search-sort-filter__divider" /> */}
              <div className="search-sort-filter__icons">
                {/* <img src="/Command.svg" alt="Command icon" /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 21 21"
                  fill="none"
                >
                  <path
                    d="M7.875 13.125V15.75C7.875 17.1997 6.69975 18.375 5.25 18.375C3.80025 18.375 2.625 17.1997 2.625 15.75C2.625 14.3003 3.80025 13.125 5.25 13.125H7.875ZM7.875 13.125H13.125M7.875 13.125V7.875M13.125 13.125V15.75C13.125 17.1997 14.3003 18.375 15.75 18.375C17.1997 18.375 18.375 17.1997 18.375 15.75C18.375 14.3003 17.1997 13.125 15.75 13.125H13.125ZM13.125 13.125V7.875M13.125 7.875H7.875M13.125 7.875V5.25C13.125 3.80025 14.3003 2.625 15.75 2.625C17.1997 2.625 18.375 3.80025 18.375 5.25C18.375 6.69975 17.1997 7.875 15.75 7.875H13.125ZM7.875 7.875V5.25C7.875 3.80025 6.69975 2.625 5.25 2.625C3.80025 2.625 2.625 3.80025 2.625 5.25C2.625 6.69975 3.80025 7.875 5.25 7.875H7.875Z"
                    stroke="#818180"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <p>K</p>
              </div>
            </>
          )}
        </div>
      </div>

      <select
        value={sortField}
        onChange={handleSortFieldChange}
        disabled={isLoading}
        className="search-sort-filter__select"
      >
        <option value="created_at">Date</option>
        <option value="title">Title</option>
      </select>
      {/* 
      <select 
        value={sortOrder} 
        onChange={handleSortOrderChange}
        disabled={isLoading}
        className="search-sort-filter__select"
      >
        <option value="desc">Newest First</option>
        <option value="asc">Oldest First</option>
      </select> */}

      {/* <select 
        value={limit} 
        onChange={handleLimitChange}
        disabled={isLoading}
        className="search-sort-filter__select"
      >
        <option value="9">Show 9</option>
        <option value="12">Show 12</option>
        <option value="20">Show 20</option>
      </select> */}
    </div>
  );
};

export default SearchSortFilter;
