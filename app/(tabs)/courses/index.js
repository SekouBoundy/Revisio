import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useUser } from '../../../constants/UserContext';

export default function CoursesIndex() {
  const { user } = useUser(); // user.level = "DEF" or "BAC"
  const router = useRouter();

  useEffect(() => {
    router.replace(`/courses/${user.level}`);
  }, [router, user.level]);

  return null;
}
