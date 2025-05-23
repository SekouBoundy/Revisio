import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useUser } from '../../../constants/UserContext';

export default function QuizzesIndex() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/quizzes/${user.level}`);
  }, [router, user.level]);

  return null;
}
