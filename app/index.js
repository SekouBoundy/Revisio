// app/index.js
import { Redirect } from 'expo-router';

// This is a simple redirect component that will check for authentication
// and redirect to the appropriate screen
export default function HomeScreen() {
  // We're simply redirecting to the tabs navigation or auth flow
  // No need to import Card or other components here
  return <Redirect href="/_tabs/courses" />;
}
