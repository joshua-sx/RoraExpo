import React from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../primitives/Text';
import { colors } from '../tokens/colors';

type Props = {
  children: React.ReactNode;
  onRetry?: () => void;
};

type State = {
  hasError: boolean;
  error?: Error;
  isRetrying: boolean;
};

export class MapErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, isRetrying: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, isRetrying: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[MapErrorBoundary] Map rendering error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ isRetrying: true });

    // Call custom retry handler if provided
    if (this.props.onRetry) {
      this.props.onRetry();
    }

    // Reset error state after short delay
    setTimeout(() => {
      this.setState({ hasError: false, isRetrying: false });
    }, 100);
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Ionicons
            name="map-outline"
            size={48}
            color={colors.textSecondary}
            style={styles.icon}
          />
          <Text variant="body" style={styles.errorTitle}>
            Unable to load map
          </Text>
          <Text variant="caption" style={styles.errorMessage}>
            {this.state.error?.message || 'An error occurred while loading the map'}
          </Text>
          <Pressable
            style={styles.retryButton}
            onPress={this.handleRetry}
            disabled={this.state.isRetrying}
          >
            {this.state.isRetrying ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="refresh" size={20} color="#FFFFFF" />
                <Text variant="body" style={styles.retryText}>
                  Try Again
                </Text>
              </>
            )}
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 32,
  },
  icon: {
    marginBottom: 16,
    opacity: 0.6,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    color: colors.text,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 140,
    minHeight: 44,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
