import React, { useState, useMemo } from 'react';
import {
  Select,
  MenuItem,
  ListSubheader,
  TextField,
  InputAdornment,
  Box
} from '@mui/material';
import { Search } from 'lucide-react';

const SearchableSelect = ({ children, onChange, value, label, ...props }) => {
  const [searchText, setSearchText] = useState("");

  // Helper to extract text from MenuItem children
  const getLabelFromChild = (child) => {
    if (!child.props || !child.props.children) return "";
    
    const extractText = (content) => {
      if (typeof content === 'string') return content;
      if (typeof content === 'number') return content.toString();
      if (Array.isArray(content)) return content.map(extractText).join(' ');
      if (React.isValidElement(content)) {
        // Handle elements like Box, Typography, or fragments
        return extractText(content.props.children);
      }
      return "";
    };

    return extractText(child.props.children);
  };

  const displayedOptions = useMemo(() => {
    if (!searchText) return children;
    
    return React.Children.toArray(children).filter((child) => {
      // Check for MenuItem or components that accept a value prop
      if (child.type === MenuItem || (child.props && child.props.value !== undefined)) {
        const labelText = getLabelFromChild(child);
        return labelText.toLowerCase().includes(searchText.toLowerCase());
      }
      return true;
    });
  }, [children, searchText]);

  return (
    <Select
      {...props}
      value={value}
      onChange={onChange}
      label={label}
      MenuProps={{
        autoFocus: false,
        disableAutoFocusItem: true,
        PaperProps: {
          sx: {
            maxHeight: 400,
            '& .MuiList-root': {
              paddingTop: 0,
            },
            '& .MuiListSubheader-root': {
              backgroundColor: 'white',
              zIndex: 2,
              padding: '8px 12px',
              borderBottom: '1px solid #f0f0f0',
              position: 'sticky',
              top: 0,
            }
          }
        },
        ...props.MenuProps
      }}
      onClose={() => {
        setSearchText("");
        if (props.onClose) props.onClose();
      }}
    >
      <ListSubheader>
        <TextField
          size="small"
          autoFocus
          placeholder="Search..."
          fullWidth
          variant="outlined"
          autoComplete="off"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={16} className="text-gray-400" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: '8px',
              backgroundColor: '#f9fafb',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e5e7eb'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d1d5db'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3b82f6'
              }
            }
          }}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Escape') {
              e.stopPropagation();
            }
          }}
        />
      </ListSubheader>
      {displayedOptions.length > 0 ? displayedOptions : (
        <MenuItem disabled>
          <Box sx={{ color: 'text.secondary', fontSize: '0.875rem', py: 1 }}>
            No results found for "{searchText}"
          </Box>
        </MenuItem>
      )}
    </Select>
  );
};

export default SearchableSelect;
