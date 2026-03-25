import { test, describe, afterEach } from 'node:test';
import assert from 'node:assert';
import { generateTrackingId } from './utils.ts';

describe('generateTrackingId', () => {
    const originalDate = global.Date;
    const originalRandom = Math.random;

    afterEach(() => {
        global.Date = originalDate;
        Math.random = originalRandom;
    });

    test('should generate tracking ID with correct date and random suffix', () => {
        // Mock Date
        const mockDate = new Date('2023-12-01T12:00:00Z');
        // @ts-ignore
        global.Date = class extends originalDate {
            constructor() {
                super();
                return mockDate;
            }
        };

        // Mock Math.random to return 0.5
        // Math.floor(1000 + 0.5 * 9000) = Math.floor(1000 + 4500) = 5500
        Math.random = () => 0.5;

        const id = generateTrackingId('contact');

        // The rationale says it should be YYYYMMDD-XXXX (e.g., 20231201-1234)
        // Current implementation is YYYYMMDDXXXX
        // We expect the version with hyphen
        assert.strictEqual(id, '20231201-5500');
    });

    test('should pad month and day correctly', () => {
        // Mock Date to January 1st
        const mockDate = new Date('2023-01-01T12:00:00Z');
        // @ts-ignore
        global.Date = class extends originalDate {
            constructor() {
                super();
                return mockDate;
            }
        };

        // Mock Math.random to return 0
        // Math.floor(1000 + 0 * 9000) = 1000
        Math.random = () => 0;

        const id = generateTrackingId('join');
        assert.strictEqual(id, '20230101-1000');
    });

    test('should generate a 4 digit random number at the end', () => {
        Math.random = () => 0.9999;
        // Math.floor(1000 + 0.9999 * 9000) = Math.floor(1000 + 8999.1) = 9999

        const id = generateTrackingId('contact');
        const randomPart = id.split('-')[1] || id.slice(8); // Handle both current and fixed versions for now in this internal variable
        assert.strictEqual(randomPart.length, 4);
    });
});
