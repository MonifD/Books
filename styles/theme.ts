export const colors = {
  primary: '#1976D2',
  primaryDark: '#1565C0',
  primaryLight: '#42A5F5',
  secondary: '#FF4081',
  secondaryDark: '#C51162',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  border: '#E0E0E0',
  text: {
    primary: '#212121',
    secondary: '#757575',
    light: '#FFFFFF',
    disabled: '#9E9E9E'
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 1000
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  }
};

export const typography = {
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700'
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700'
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600'
  },
  body1: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400'
  },
  body2: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400'
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400'
  }
};

export const layout = {
  maxWidth: 800,
  containerPadding: spacing.md
};