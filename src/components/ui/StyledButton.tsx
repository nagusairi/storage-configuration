import { Button, ButtonProps } from '@mui/material';
import { ReactNode, forwardRef } from 'react';

interface StyledButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
  children?: ReactNode;
}

export const StyledButton = forwardRef<HTMLButtonElement, StyledButtonProps>(({ 
  variant = 'primary',
  icon,
  iconPosition = 'start',
  children,
  ...props 
}, ref) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#5C1F3D',
          color: 'white',
          textTransform: 'none',
          padding: '8px 16px',
          borderRadius: '3px',
          height: '32px',
          fontSize: '12px',
          '&:hover': {
            backgroundColor: '#4A1831',
          },
        };
      case 'secondary':
        return {
          backgroundColor: 'white',
          color: '#5C1F3D',
          textTransform: 'none',
          padding: '8px 16px',
          borderRadius: '3px',
          border: '1px solid #5C1F3D',
          height: '32px',
          fontSize: '12px',
          '&:hover': {
            backgroundColor: '#f3e8ff',
          },
        };
      case 'outline':
        return {
          backgroundColor: '#FFF',
          color: '#374151',
          textTransform: 'none',
          padding: '8px 16px',
          borderRadius: '3px',
          border: '1px solid #D1D5DB',
          height: '32px',
          fontSize: '12px',
          '&:hover': {
            backgroundColor: 'rgba(9, 30, 66, 0.06)',
            borderColor: '#9CA3AF',
          },
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: '#374151',
          textTransform: 'none',
          padding: '8px 16px',
          borderRadius: '3px',
          fontSize: '12px',
          '&:hover': {
            backgroundColor: '#f9fafb',
          },
        };
      default:
        return {};
    }
  };

  return (
    <Button
      ref={ref}
      {...props}
      {...(icon && iconPosition === 'start' ? { startIcon: icon } : {})}
      {...(icon && iconPosition === 'end' ? { endIcon: icon } : {})}
      sx={{
        ...getVariantStyles(),
        fontSize: '12px',
        ...props.sx,
      }}
    >
      {children}
    </Button>
  );
});

StyledButton.displayName = 'StyledButton';