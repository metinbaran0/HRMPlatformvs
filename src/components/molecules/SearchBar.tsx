// src/components/molecules/SearchBar.tsx
import React, { useState } from "react";
import Input from "../atoms/InputCompany";
import "../../styles/SearchBar.css";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="flex items-center gap-2 border p-2 rounded-lg">
      🔍
      <Input
        placeholder="Şirket Ara..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full"
      />
    </div>
  );
};

export default SearchBar;