// app/index.js
import { Redirect } from 'expo-router';

export default function Home() {
  // For development, redirect straight to dashboard
  return <Redirect href="/_tabs/dashboard" />;
}