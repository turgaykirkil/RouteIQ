import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const colors = {
  primary: '#673AB7',  // Material Design default purple
  secondary: '#03dac6',
  error: '#b00020',
  white: '#FFFFFF',
  accent: '#FFA500',
  background: '#F5F5F5',
  text: '#333333',
  success: '#4CAF50',
  border: '#E0E0E0',
  placeholder: '#9E9E9E',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 14,
  },
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 3,
  },
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...colors,
  },
  spacing,
  shadows,
  typography,
};

export default theme;
