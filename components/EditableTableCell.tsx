import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface EditableTableCellProps {
  value: string;
  onUpdate: (newValue: string) => void;
  className?: string;
  isNote?: boolean;
  isPresetCell?: boolean;
  columnLabel: string;
  suggestions?: string[];
}

const EditableTableCell: React.FC<EditableTableCellProps> = ({ value, onUpdate, className, isNote = false, isPresetCell = false, columnLabel, suggestions = [] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const cellRef = useRef<HTMLTableCellElement>(null);

  useEffect(() => {
    if (isEditing) {
      setCurrentValue(value); // Reset to original value when opening modal
      setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.select();
      }, 0);
    }
  }, [isEditing, value]);

  const handleSave = () => {
    if (currentValue !== value) {
      onUpdate(currentValue);
    }
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    setFilteredSuggestions([]);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCloseModal();
    }
  };

  // Effect to handle clicks outside the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleCloseModal();
      }
    };
    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing]);

  // Effect to handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cellRef.current && !cellRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);


  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const term = e.target.value;
    setCurrentValue(term);
    if (term && suggestions.length > 0) {
        const filtered = suggestions.filter(s => 
            s.toLowerCase().includes(term.toLowerCase()) && 
            s.toLowerCase() !== term.toLowerCase()
        ).slice(0, 5); // Limit to 5 suggestions
        setFilteredSuggestions(filtered);
    } else {
        setFilteredSuggestions([]);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setCurrentValue(suggestion);
    setFilteredSuggestions([]);
    textareaRef.current?.focus();
  }

  const baseClasses = `px-4 py-2 text-sm text-text-primary align-top transition-colors`;
  const dynamicClasses = isNote ? 'whitespace-normal' : 'whitespace-nowrap';

  return (
    <>
      {isPresetCell ? (
        <td
          ref={cellRef}
          onClick={() => setIsDropdownOpen(prev => !prev)}
          className={`${baseClasses} cursor-pointer relative min-h-[44px] ${className || ''} ${dynamicClasses}`}
        >
          <div className="flex items-center justify-between w-full">
            <span>{value || <span className="text-gray-600 italic">...</span>}</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-500 ml-2 flex-shrink-0" />
          </div>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-max min-w-full bg-surface-light border border-border rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion}
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdate(suggestion);
                    setIsDropdownOpen(false);
                  }}
                  className="px-3 py-2 text-sm text-text-primary hover:bg-primary hover:text-black cursor-pointer"
                >
                  {suggestion}
                </div>
              ))}
              {suggestions.length > 0 && <div className="border-t border-border my-1"></div>}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(false);
                  setIsEditing(true);
                }}
                className="px-3 py-2 text-sm text-text-primary hover:bg-primary hover:text-black cursor-pointer"
              >
                Custom...
              </div>
            </div>
          )}
        </td>
      ) : (
        <td
          onClick={() => setIsEditing(true)}
          className={`${baseClasses} cursor-cell min-h-[44px] ${className || ''} ${dynamicClasses}`}
        >
          {value || <span className="text-gray-600 italic">...</span>}
        </td>
      )}

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div ref={modalRef} className="bg-surface w-full max-w-md rounded-lg shadow-xl border border-border p-6" onKeyDown={handleKeyDown}>
            <h2 className="text-xl font-semibold text-text-primary mb-4">Edit {columnLabel}</h2>
            <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={currentValue}
                  onChange={handleInputChange}
                  className="w-full h-32 bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                />
                {filteredSuggestions.length > 0 && (
                    <div className="absolute w-full mt-1 bg-surface-light border border-border rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                        {filteredSuggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-4 py-2 text-text-primary hover:bg-primary hover:text-black cursor-pointer"
                            >
                                {suggestion}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="bg-surface-light hover:bg-gray-600 text-text-primary font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-primary hover:bg-primary-focus text-black font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditableTableCell;