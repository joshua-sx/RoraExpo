import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useAuth } from '../../../hooks/useAuth';
import { useGuestToken } from '../../../hooks/useGuestToken';
import { supabase } from '../../../lib/supabase';
import { trackEvent, AnalyticsEvents } from '../../../lib/posthog';

interface GuestClaimPromptProps {
  visible: boolean;
  onDismiss: () => void;
  onSignUp: () => void;
}

export const GuestClaimPrompt: React.FC<GuestClaimPromptProps> = ({
  visible,
  onDismiss,
  onSignUp,
}) => {
  const { user } = useAuth();
  const { guestToken } = useGuestToken();
  const [isMigrating, setIsMigrating] = React.useState(false);

  /**
   * Migrate guest rides when user signs up
   */
  const handleMigrateRides = async (userId: string) => {
    if (!guestToken) return;

    setIsMigrating(true);

    try {
      const { data, error } = await supabase.functions.invoke(
        'migrate-guest-rides',
        {
          body: {
            guestToken,
            userId,
          },
        }
      );

      if (error) {
        console.error('Failed to migrate guest rides:', error);
        return;
      }

      if (data?.success) {
        console.log(`Migrated ${data.migratedRides} rides to authenticated account`);
        trackEvent(AnalyticsEvents.GUEST_HISTORY_CLAIMED, {
          rides_migrated: data.migratedRides,
        });
      }
    } catch (err) {
      console.error('Migration error:', err);
    } finally {
      setIsMigrating(false);
    }
  };

  // Auto-migrate when user becomes authenticated
  React.useEffect(() => {
    if (user && guestToken && !isMigrating) {
      handleMigrateRides(user.id);
    }
  }, [user, guestToken]);

  // Track when prompt is shown
  React.useEffect(() => {
    if (visible) {
      trackEvent(AnalyticsEvents.GUEST_CLAIM_PROMPT_SHOWN);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Save Your Ride History</Text>
          <Text style={styles.message}>
            Create an account to save your ride history and access it from any device.
          </Text>

          <TouchableOpacity style={styles.primaryButton} onPress={onSignUp}>
            <Text style={styles.primaryButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onDismiss}>
            <Text style={styles.secondaryButtonText}>Not Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    padding: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
