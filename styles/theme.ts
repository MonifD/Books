export const colors = {
  // Couleur principale - Bleu profond
  primary: '#2C3E50',
  primaryDark: '#1A2530',
  primaryLight: '#34495E',
  
  // Couleur secondaire - Turquoise vif
  secondary: '#1ABC9C',
  secondaryDark: '#16A085',
  secondaryLight: '#48C9B0',
  
  // Accents
  accent1: '#E74C3C', // Rouge corail
  accent2: '#F1C40F', // Jaune soleil
  accent3: '#9B59B6', // Violet
  
  // États
  success: '#2ECC71',
  error: '#E74C3C',
  warning: '#F39C12',
  info: '#3498DB',
  
  // Arrière-plans et surfaces
  background: '#ECF0F1',
  surface: '#FFFFFF',
  surfaceAlt: '#F8F9FA',
  
  // Bordures et séparateurs
  border: '#BDC3C7',
  borderLight: '#E8EAED',
  
  // Texte
  text: {
    primary: '#2C3E50',
    secondary: '#7F8C8D',
    light: '#FFFFFF',
    disabled: '#95A5A6'
  },
  
  // États des boutons
  button: {
    default: '#3498DB',
    hover: '#2980B9',
    disabled: '#BDC3C7'
  },
  
  // Dégradés
  gradient: {
    start: '#2C3E50',
    end: '#3498DB'
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
    shadowColor: '#2C3E50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#2C3E50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#2C3E50',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 6,
  },
  xl: {
    shadowColor: '#2C3E50',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
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