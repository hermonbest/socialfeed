export const colors = {
  bg: '#0D0D0D',
  surface: '#1A1A1A',
  card: '#1A1A1A',
  primary: '#E5E5E5',
  accent: '#C8A97E',
  accentLight: '#2A2520',
  text: '#E5E5E5',
  textSecondary: '#9E9E9E',
  textTertiary: '#888888',
  border: '#333333',
  borderLight: '#2A2A2A',
  success: '#34C759',
  error: '#FF3B30',
  overlay: 'rgba(0,0,0,0.6)',
  overlayLight: 'rgba(255,255,255,0.05)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const typography = {
  h1: { fontSize: 34, fontWeight: '700', letterSpacing: 0.4, color: colors.text },
  h2: { fontSize: 28, fontWeight: '700', letterSpacing: 0.3, color: colors.text },
  h3: { fontSize: 22, fontWeight: '600', letterSpacing: 0.2, color: colors.text },
  subtitle: { fontSize: 17, fontWeight: '500', letterSpacing: 0.1, color: colors.text },
  body: { fontSize: 15, fontWeight: '400', color: colors.textSecondary },
  caption: { fontSize: 13, fontWeight: '400', color: colors.textSecondary },
  label: { fontSize: 13, fontWeight: '600', letterSpacing: 0.5, color: colors.textSecondary },
  price: { fontSize: 20, fontWeight: '700', letterSpacing: 0.2, color: colors.accent },
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 6,
  },
};
