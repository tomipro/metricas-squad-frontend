import { getDaysFromPeriod } from '../periodUtils';

describe('periodUtils', () => {
  describe('getDaysFromPeriod', () => {
    it('should convert valid period string to number', () => {
      expect(getDaysFromPeriod('30')).toBe(30);
      expect(getDaysFromPeriod('90')).toBe(90);
      expect(getDaysFromPeriod('365')).toBe(365);
      expect(getDaysFromPeriod('7')).toBe(7);
    });

    it('should return default value (30) for invalid input', () => {
      expect(getDaysFromPeriod('')).toBe(30);
      expect(getDaysFromPeriod('invalid')).toBe(30);
      expect(getDaysFromPeriod('abc')).toBe(30);
      expect(getDaysFromPeriod('0')).toBe(30); // 0 is falsy, so defaults to 30
    });

    it('should handle numeric strings correctly', () => {
      expect(getDaysFromPeriod('123')).toBe(123);
      expect(getDaysFromPeriod('999')).toBe(999);
    });

    it('should handle edge cases', () => {
      expect(getDaysFromPeriod('1')).toBe(1);
      expect(getDaysFromPeriod('9999')).toBe(9999);
    });
  });
});

