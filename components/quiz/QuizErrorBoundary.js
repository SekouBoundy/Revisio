// components/quiz/QuizErrorBoundary.js - ERROR HANDLING
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

class QuizErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Quiz Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback 
          error={this.state.error}
          resetError={() => this.setState({ hasError: false, error: null })}
          theme={this.props.theme}
        />
      );
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error, resetError, theme }) => {
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.errorCard, { backgroundColor: theme.surface }]}>
        <View style={[styles.errorIcon, { backgroundColor: theme.error + '20' }]}>
          <Ionicons name="alert-circle" size={48} color={theme.error} />
        </View>
        
        <Text style={[styles.errorTitle, { color: theme.text }]}>
          Erreur inattendue
        </Text>
        
        <Text style={[styles.errorMessage, { color: theme.textSecondary }]}>
          Une erreur s'est produite lors du chargement du quiz. 
          Veuillez réessayer ou retourner à l'accueil.
        </Text>
        
        <View style={styles.errorActions}>
          <TouchableOpacity 
            style={[styles.errorButton, { backgroundColor: theme.primary }]}
            onPress={resetError}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.errorButtonText}>Réessayer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.errorButton, { backgroundColor: theme.textSecondary }]}
            onPress={() => router.push('/quizzes')}
          >
            <Ionicons name="home" size={20} color="#fff" />
            <Text style={styles.errorButtonText}>Accueil Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorCard: {
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorActions: {
    gap: 12,
    width: '100%',
  },
  errorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default QuizErrorBoundary;