import { test, describe } from 'node:test';
import assert from 'node:assert';
import { isFeedbackStatus, validateFeedbackInput } from './feedback.ts';

const validInput = {
    type: 'suggestion',
    topic: 'schedule',
    rating: 4,
    subject: 'Weekend batches',
    message: 'Could you add weekend batches for students who work on weekdays?',
    name: 'Priya Sharma',
    email: 'priya@example.com',
};

function errorsFor(input: unknown) {
    const result = validateFeedbackInput(input);
    assert.strictEqual(result.success, false, 'expected validation to fail');
    return result.success ? {} : result.errors;
}

describe('validateFeedbackInput', () => {
    test('accepts valid input', () => {
        assert.deepStrictEqual(validateFeedbackInput(validInput), {
            success: true,
            data: validInput,
        });
    });

    test('trims fields and collapses whitespace in single-line fields', () => {
        const result = validateFeedbackInput({
            ...validInput,
            name: '  Priya   Sharma ',
            subject: 'Weekend\n  batches ',
            message: '  Line one\n\nLine two  ',
            email: ' priya@example.com ',
        });

        assert.ok(result.success);
        assert.strictEqual(result.data.name, 'Priya Sharma');
        assert.strictEqual(result.data.subject, 'Weekend batches');
        assert.strictEqual(result.data.message, 'Line one\n\nLine two');
        assert.strictEqual(result.data.email, 'priya@example.com');
    });

    test('treats a missing or null rating as not rated', () => {
        for (const rating of [undefined, null]) {
            const result = validateFeedbackInput({ ...validInput, rating });
            assert.ok(result.success);
            assert.ok(!('rating' in result.data));
        }
    });

    test('rejects ratings that are not whole numbers from 1 to 5', () => {
        for (const rating of [0, 6, 3.5, '4', -1]) {
            assert.ok(errorsFor({ ...validInput, rating }).rating, `rating ${rating}`);
        }
    });

    test('rejects unknown types and topics', () => {
        const errors = errorsFor({ ...validInput, type: 'spam', topic: 'anything' });
        assert.ok(errors.type);
        assert.ok(errors.topic);
    });

    test('requires contact details', () => {
        const errors = errorsFor({ ...validInput, name: '   ', email: '' });
        assert.strictEqual(errors.name, 'Please enter your name');
        assert.strictEqual(errors.email, 'Please enter your email address');
    });

    test('rejects invalid email addresses', () => {
        for (const email of [
            'not-an-email',
            'a@b',
            'a b@example.com',
            `${'a'.repeat(250)}@x.com`,
        ]) {
            assert.strictEqual(
                errorsFor({ ...validInput, email }).email,
                'Please enter a valid email address',
                email,
            );
        }
    });

    test('enforces length limits', () => {
        const errors = errorsFor({
            ...validInput,
            name: 'A',
            subject: 'x'.repeat(151),
            message: 'Too short',
        });
        assert.strictEqual(errors.name, 'Name must be at least 2 characters');
        assert.strictEqual(errors.subject, 'Subject must be 150 characters or fewer');
        assert.strictEqual(errors.message, 'Your message must be at least 10 characters');

        assert.strictEqual(
            errorsFor({ ...validInput, message: 'x'.repeat(2001) }).message,
            'Your message must be 2000 characters or fewer',
        );
    });

    test('rejects non-string values such as query operators', () => {
        const errors = errorsFor({ ...validInput, name: { $gt: '' }, email: ['a@b.com'] });
        assert.ok(errors.name);
        assert.ok(errors.email);
    });

    test('reports every required field for an empty or non-object body', () => {
        for (const input of [null, undefined, 'text', {}]) {
            assert.deepStrictEqual(Object.keys(errorsFor(input)), [
                'type',
                'topic',
                'subject',
                'message',
                'name',
                'email',
            ]);
        }
    });
});

describe('isFeedbackStatus', () => {
    test('accepts known statuses only', () => {
        assert.ok(isFeedbackStatus('in_review'));
        assert.ok(!isFeedbackStatus('archived'));
        assert.ok(!isFeedbackStatus(undefined));
    });
});
