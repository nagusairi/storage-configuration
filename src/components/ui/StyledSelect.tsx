import { Select, MenuItem, FormControl, SelectProps } from '@mui/material';
import { ReactNode, Children, isValidElement } from 'react';

interface StyledSelectProps extends Omit<SelectProps, 'size'> {
  children?: ReactNode;
  minWidth?: number | string;
  fullWidth?: boolean;
}

export function StyledSelect({ 
  children, 
  minWidth = 120,
  fullWidth = true, // Default to true for 100% width
  ...props 
}: StyledSelectProps) {
  // Ultra-defensive safety guard for MUI Select children
  // MUI Select internally uses React.Children.map() which can fail with undefined
  let safeChildren: ReactNode = [];
  
  try {
    if (children !== null && children !== undefined) {
      const childArray = Children.toArray(children);
      safeChildren = childArray.filter(child => {
        try {
          return isValidElement(child);
        } catch {
          return false;
        }
      });
    }
  } catch (error) {
    // If Children.toArray fails for any reason, fallback to empty array
    console.warn('StyledSelect: Error processing children', error);
    safeChildren = [];
  }
  
  return (
    <FormControl size="small" fullWidth={fullWidth} sx={{ minWidth: fullWidth ? undefined : minWidth }}>
      <Select
        displayEmpty
        fullWidth={fullWidth}
        {...props}
        sx={{
          height: '33px', // Standard height: 33px
          fontSize: '14px',
          backgroundColor: 'white',
          '& .MuiSelect-select': {
            paddingLeft: '12px',
            paddingRight: '12px',
          },
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#d1d5db',
            },
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#5C1F3D',
            borderWidth: '2px',
          },
          ...props.sx,
        }}
      >
        {safeChildren}
      </Select>
    </FormControl>
  );
}

export { MenuItem };