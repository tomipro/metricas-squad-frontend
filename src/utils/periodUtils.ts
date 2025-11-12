/**
 * Utility functions for handling period conversions
 */

/**
 * Converts a period string to number of days
 * @param period - Period string (e.g., "30", "90", "365")
 * @returns Number of days, defaults to 30 if parsing fails
 */
export const getDaysFromPeriod = (period: string): number => {
  return parseInt(period, 10) || 30; // Default to 30 days if parsing fails
};

