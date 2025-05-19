// app/index.js
import { Redirect } from 'expo-router';

export default function Home() {
  return <Redirect href="/_tabs/dashboard" />;
}