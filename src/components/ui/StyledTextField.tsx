import { TextField, TextFieldProps, InputAdornment } from '@mui/material';

interface StyledTextFieldProps extends Omit<TextFieldProps, 'size' | 'variant'> {
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
}

export function StyledTextField({ 
  icon,
  iconPosition = 'start',
  multiline = false,
  rows,
  ...props 
}: StyledTextFieldProps) {
  const InputProps = icon ? {
    ...(iconPosition === 'start' ? {
      startAdornment: (
        <InputAdornment position="start">
          {icon}
        </InputAdornment>
      )
    } : {
      endAdornment: (
        <InputAdornment position="end">
          {icon}
        </InputAdornment>
      )
    }),
    ...props.InputProps,
  } : props.InputProps;

  // Remove icon and iconPosition from props to avoid passing them to DOM
  const { InputProps: inputPropsFromProps, ...restProps } = props;

  return (
    <TextField
      size="small"
      fullWidth
      multiline={multiline}
      rows={rows}
      {...restProps}
      InputProps={InputProps}
      sx={{
        '& .MuiOutlinedInput-root': {
          ...(multiline ? {} : { height: '32px' }),
          fontSize: '14px',
          '&:hover fieldset': {
            borderColor: '#d1d5db',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#5C1F3D',
            borderWidth: '2px',
          },
        },
        ...props.sx,
      }}
    />
  );
}

export { InputAdornment };