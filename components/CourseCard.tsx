// components/CourseCard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Course } from '../types/types';

export default function CourseCard({ course }: { course: Course }) {
  return (
    <View>
      <Text>{course.title}</Text>
      {/* Add more course info as needed */}
    </View>
  );
}
