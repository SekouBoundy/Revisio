// constants/Colors.ts
// Define color themes for light and dark mode

// Export directly as named exports instead of objects
export const dark = {
  background: '#121212',
  text: '#FFFFFF',
  card: '#1E1E1E',
  border: '#333333',
  notification: '#FF453A',
};

export const light = {
  background: '#FFFFFF',
  text: '#000000',
  card: '#F5F5F5',
  border: '#E0E0E0',
  notification: '#FF3B30',
};

// You can also export a default object if needed
const Colors = {
  dark,
  light
};

export default Colors;