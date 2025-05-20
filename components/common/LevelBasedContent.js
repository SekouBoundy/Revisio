// components/common/LevelBasedContent.js
import React from 'react';
import { STUDENT_LEVELS, useUser } from '../../constants/UserContext';

/**
 * LevelBasedContent: A component that conditionally renders content based on the user's level
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - Content to render
 * @param {string[]} props.levels - Array of levels that should see this content
 * @param {React.ReactNode} props.fallback - Content to render if user's level doesn't match (optional)
 */
const LevelBasedContent = ({ children, levels = [], fallback = null }) => {
  const { studentLevel } = useUser();
  
  // If no levels specified, show content to everyone
  if (!levels || levels.length === 0) {
    return <>{children}</>;
  }
  
  // If user's level is in the allowed levels, show the content
  if (levels.includes(studentLevel)) {
    return <>{children}</>;
  }
  
  // Otherwise show fallback content or nothing
  return fallback ? <>{fallback}</> : null;
};

// Shorthand components for each level
export const BACOnly = ({ children, fallback }) => (
  <LevelBasedContent levels={[STUDENT_LEVELS.BAC]} fallback={fallback}>
    {children}
  </LevelBasedContent>
);

export const DEFOnly = ({ children, fallback }) => (
  <LevelBasedContent levels={[STUDENT_LEVELS.DEF]} fallback={fallback}>
    {children}
  </LevelBasedContent>
);

export const LanguageOnly = ({ children, fallback }) => (
  <LevelBasedContent levels={[STUDENT_LEVELS.LANGUAGE]} fallback={fallback}>
    {children}
  </LevelBasedContent>
);

export default LevelBasedContent;