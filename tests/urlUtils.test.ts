import isValidUrl from '../src/utils/urlUtils';

describe('URL Utility Functions', () => {
  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isValidUrl('https://www.example.com')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidUrl('not-a-valid-url')).toBe(false);
    });

    it.todo('should handle edge cases gracefully');
  });
});
