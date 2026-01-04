import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { trackEvent, AnalyticsEvents } from '../../../lib/posthog';

type AuthMethod = 'phone' | 'email';

export const LoginScreen = () => {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setAuthenticatedUser } = useAuth();

  /**
   * Send OTP via phone or email
   */
  const handleSendOtp = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (authMethod === 'phone') {
        // Send phone OTP
        const { error } = await supabase.auth.signInWithOtp({
          phone: phoneNumber,
        });

        if (error) throw error;
      } else {
        // Send email magic link
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
          },
        });

        if (error) throw error;
      }

      setIsOtpSent(true);
      trackEvent(AnalyticsEvents.APP_LAUNCHED); // Track auth attempt
    } catch (err) {
      console.error('Failed to send OTP:', err);
      setError(err instanceof Error ? err.message : 'Failed to send code');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verify OTP code
   */
  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: authMethod === 'phone' ? phoneNumber : undefined,
        email: authMethod === 'email' ? email : undefined,
        token: otp,
        type: authMethod === 'phone' ? 'sms' : 'email',
      });

      if (error) throw error;

      if (data.session && data.user) {
        setAuthenticatedUser(data.user, data.session);
      }
    } catch (err) {
      console.error('Failed to verify OTP:', err);
      setError(err instanceof Error ? err.message : 'Invalid code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In to Rora Ride</Text>

      {!isOtpSent ? (
        <>
          {/* Auth method toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                authMethod === 'phone' && styles.toggleButtonActive,
              ]}
              onPress={() => setAuthMethod('phone')}
            >
              <Text
                style={[
                  styles.toggleText,
                  authMethod === 'phone' && styles.toggleTextActive,
                ]}
              >
                Phone
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                authMethod === 'email' && styles.toggleButtonActive,
              ]}
              onPress={() => setAuthMethod('email')}
            >
              <Text
                style={[
                  styles.toggleText,
                  authMethod === 'email' && styles.toggleTextActive,
                ]}
              >
                Email
              </Text>
            </TouchableOpacity>
          </View>

          {/* Phone input */}
          {authMethod === 'phone' && (
            <TextInput
              style={styles.input}
              placeholder="Phone number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              autoCapitalize="none"
              autoComplete="tel"
            />
          )}

          {/* Email input */}
          {authMethod === 'email' && (
            <TextInput
              style={styles.input}
              placeholder="Email address"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
            />
          )}

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={styles.button}
            onPress={handleSendOtp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {authMethod === 'phone' ? 'Send Code' : 'Send Link'}
              </Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* OTP input */}
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to{' '}
            {authMethod === 'phone' ? phoneNumber : email}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="000000"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            maxLength={6}
            autoComplete="sms-otp"
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={styles.button}
            onPress={handleVerifyOtp}
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify Code</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => {
              setIsOtpSent(false);
              setOtp('');
              setError(null);
            }}
          >
            <Text style={styles.linkText}>← Back</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#007AFF',
  },
  toggleText: {
    fontSize: 16,
    color: '#666',
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
  error: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
});
