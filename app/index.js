import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../components/common/Button';
import Theme from '../constants/Theme';

export default function HomeScreen() {
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync('user_token');
        
        // If token exists, redirect to tabs
        if (token) {
          router.replace('/_tabs');
        }
      } catch (error) {
        console.log('Error checking auth status:', error);
      }
    };

    checkAuthStatus();
  }, []);

  const handleGetStarted = () => {
    router.push('/_auth/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Revisio</Text>
        <Text style={styles.tagline}>Learn, Practice, Achieve</Text>
      </View>
      
      <View style={styles.featuresContainer}>
        <FeatureItem 
          title="Prep for BAC & DEF" 
          description="Comprehensive study materials for exams" 
        />
        <FeatureItem 
          title="Language Learning" 
          description="Master English and Arabic effectively" 
        />
        <FeatureItem 
          title="Interactive Quizzes" 
          description="Test your knowledge and track progress" 
        />
      </View>
      
      <View style={styles.buttonsContainer}>
        <Button 
          onPress={handleGetStarted}
          fullWidth
          variant="primary"
          size="large"
        >
          Get Started
        </Button>
        
        <Button
          onPress={() => router.push('/_auth/register')}
          fullWidth
          variant="outline"
          size="large"
          style={styles.registerButton}
        >
          Create an Account
        </Button>
      </View>
    </View>
  );
}

// Feature item component
const FeatureItem = ({ title, description }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIcon}>
      <Text style={styles.featureIconText}>✓</Text>
    </View>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
    padding: Theme.layout.spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Theme.layout.spacing.xxl * 2,
    marginBottom: Theme.layout.spacing.xxl,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  tagline: {
    fontSize: Theme.layout.fontSize.lg,
    color: Theme.colors.textSecondary,
    marginTop: Theme.layout.spacing.sm,
  },
  featuresContainer: {
    marginBottom: Theme.layout.spacing.xxl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.layout.spacing.lg,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.layout.spacing.md,
  },
  featureIconText: {
    color: Theme.colors.white,
    fontSize: Theme.layout.fontSize.lg,
    fontWeight: 'bold',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: Theme.layout.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: Theme.layout.fontSize.sm,
    color: Theme.colors.textSecondary,
  },
  buttonsContainer: {
    marginTop: 'auto',
    marginBottom: Theme.layout.spacing.xl,
  },
  registerButton: {
    marginTop: Theme.layout.spacing.md,
  },
});