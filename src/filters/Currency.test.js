import formatter from './Currency.js';

test('formats numbers as currency', () => {
    expect(formatter(-1)).toBe('-£1.00');
    expect(formatter(0)).toBe('£0.00');
    expect(formatter(0.5)).toBe('£0.50');
    expect(formatter(1)).toBe('£1.00');
    expect(formatter(1.5)).toBe('£1.50');
    expect(formatter(10)).toBe('£10.00');
});
