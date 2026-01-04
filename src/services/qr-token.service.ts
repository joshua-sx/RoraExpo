/**
 * QR Token Service
 *
 * Generates JWT-based QR tokens for ride sessions
 * Tokens contain ride metadata and expire in 10 minutes
 */

import { QRTokenPayload } from '../types/ride';
import { QR_TOKEN_EXPIRY_MS } from '../utils/constants';

// NOTE: For production, JWT signing/verification should be done server-side
// This is a client-side implementation for MVP

/**
 * Generate a QR token payload
 */
export const generateQRTokenPayload = (
  rideSessionId: string,
  originLabel: string,
  destinationLabel: string,
  roraFareAmount: number
): QRTokenPayload => {
  const now = Math.floor(Date.now() / 1000); // Unix timestamp in seconds

  return {
    jti: crypto.randomUUID(), // Unique token ID
    ride_session_id: rideSessionId,
    origin_label: originLabel,
    destination_label: destinationLabel,
    rora_fare_amount: roraFareAmount,
    iat: now, // Issued at
    exp: now + Math.floor(QR_TOKEN_EXPIRY_MS / 1000), // Expires in 10 minutes
  };
};

/**
 * Encode QR token payload as JSON string
 * (In production, this would be a signed JWT)
 */
export const encodeQRToken = (payload: QRTokenPayload): string => {
  // For MVP, we'll use base64-encoded JSON
  // In production, use proper JWT signing with a secret
  const jsonString = JSON.stringify(payload);
  return btoa(jsonString);
};

/**
 * Decode QR token from string
 */
export const decodeQRToken = (token: string): QRTokenPayload | null => {
  try {
    const jsonString = atob(token);
    return JSON.parse(jsonString) as QRTokenPayload;
  } catch (error) {
    console.error('Failed to decode QR token:', error);
    return null;
  }
};

/**
 * Validate QR token expiry
 */
export const isQRTokenExpired = (token: QRTokenPayload): boolean => {
  const now = Math.floor(Date.now() / 1000);
  return now >= token.exp;
};

/**
 * Generate a complete QR token string for a ride session
 */
export const generateQRTokenForRide = (
  rideSessionId: string,
  originLabel: string,
  destinationLabel: string,
  roraFareAmount: number
): string => {
  const payload = generateQRTokenPayload(
    rideSessionId,
    originLabel,
    destinationLabel,
    roraFareAmount
  );
  return encodeQRToken(payload);
};
