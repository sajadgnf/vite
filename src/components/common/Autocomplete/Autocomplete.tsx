import React, { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import "./Autocomplete.scss";

interface AutocompleteProps {
  suggestions: string[];
  onSelect: (selectedItem: string) => void;
  placeholder: string;
  startIcon?: React.ReactNode;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  suggestions,
  onSelect,
  placeholder,
  startIcon,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const autocompleteRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleClearInput = () => {
    setInputValue("");
    inputRef.current?.focus();
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setHighlightedIndex(-1); // Reset highlight when typing
  };

  const handleSelectItem = (item: string) => {
    onSelect(item);
    closeDropdown();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) =>
        prevIndex < filteredSuggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      handleSelectItem(filteredSuggestions[highlightedIndex]);
    } else if (e.key === "Escape") {
      closeDropdown();
    }
  };

  // Filter suggestions based on input
  useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredSuggestions(suggestions);
    } else {
      const filtered = suggestions.filter((item) =>
        item.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    }
  }, [inputValue, suggestions]);

  // Close dropdown when clicking outside the autocomplete
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="autocomplete" ref={autocompleteRef}>
      <div className="autocomplete__input-wrapper">
        {startIcon && (
          <span
            className="autocomplete__start-icon"
            onClick={handleToggleDropdown}
          >
            {startIcon}
          </span>
        )}

        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="autocomplete__input"
          onClick={handleToggleDropdown}
        />

        {inputValue && (
          <FiX
            size={20}
            onClick={handleClearInput}
            className="autocomplete__clear-icon"
          />
        )}
      </div>

      {isDropdownOpen && (
        <ul className="autocomplete__suggestions">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((item, index) => (
              <li
                key={item}
                onClick={() => handleSelectItem(item)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`autocomplete__suggestion ${
                  highlightedIndex === index
                    ? "autocomplete__suggestion--highlighted"
                    : ""
                }`}
              >
                {item}
              </li>
            ))
          ) : (
            <li className="autocomplete__no-options">No options</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
