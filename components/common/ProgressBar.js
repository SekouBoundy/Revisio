/**
 * File: components/common/ProgressBar.js
 * Reusable progress bar component for displaying progress
 */

import { StyleSheet, Text, View } from 'react-native';
import Theme from '../../constants/Theme';

/**
 * ProgressBar component for displaying progress
 * 
 * @param {number} progress - Progress value (0-100)
 * @param {string} color - Custom color for the progress bar
 * @param {boolean} showPercentage - Whether to show percentage text
 * @param {string} label - Optional label to display above the progress bar
 * @param {number} height - Custom height for the progress bar
 * @param {object} style - Additional styles for the container
 */
const ProgressBar = ({
  progress = 0,
  color,
  showPercentage = false,
  label,
  height = 8,
  style,
}) => {
  // Ensure progress is between 0-100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  // Determine the color based on progress if not provided
  const getProgressColor = () => {
    if (color) return color;
    
    if (clampedProgress < 30) return Theme.colors.error;
    if (clampedProgress < 70) return Theme.colors.warning;
    return Theme.colors.success;
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[styles.progressContainer, { height }]}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${clampedProgress}%`,
              backgroundColor: getProgressColor(),
              height,
            },
          ]}
        />
      </View>
      
      {showPercentage && (
        <Text style={styles.percentageText}>{Math.round(clampedProgress)}%</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Theme.layout.spacing.xs,
  },
  label: {
    fontSize: Theme.layout.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.layout.spacing.xs,
  },
  progressContainer: {
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    borderRadius: 4,
  },
  percentageText: {
    fontSize: Theme.layout.fontSize.xs,
    color: Theme.colors.textSecondary,
    marginTop: Theme.layout.spacing.xs,
    textAlign: 'right',
  },
});

export default ProgressBar;