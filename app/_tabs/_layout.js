// app/_tabs/_layout.js
import { Slot } from 'expo-router';

// This is an empty layout that doesn't add any UI
// It just renders child routes without adding a tab navigator
export default function TabsLayout() {
  return <Slot />;
}