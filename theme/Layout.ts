// constants/Layout.ts
// Define layout constants for consistent spacing and sizing

// Export directly as named exports
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999, // For fully rounded elements like circles
};

// Screen dimensions
export const window = {
  width: 0,   // These will be updated at runtime
  height: 0   // These will be updated at runtime
};

// Safe area insets (for notches, etc.)
export const safeArea = {
  top: 0,     // These will be updated at runtime
  right: 0,
  bottom: 0,
  left: 0
};

// Also export as default object
const Layout = {
  spacing,
  fontSize,
  borderRadius,
  window,
  safeArea
};

export default Layout;