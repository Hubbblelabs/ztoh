import { test, describe } from 'node:test';
import assert from 'node:assert';
import { isFeedbackStatus, validateFeedbackInput } from './feedback.ts';

const validInput = {
    registrationType: 'parent',
    name: 'Priya Sharma',
    phone: '+91 98765 43210',
    alternativePhone: '0422 2345678',
    whatsapp: '98765 43210',
    email: 'priya@example.com',
    address: '12, Gandhi Road\nCoimbatore',
    needs: ['demo', 'enquiry'],
    curriculums: ['cbse', 'igcse'],
    exams: ['jee'],
    academicSupport: ['test_series'],
    jobTypes: [],
    productDemoInterest: false,
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
            phone: ' +91  98765\n43210 ',
            email: ' priya@example.com ',
            address: '  12, Gandhi Road\nCoimbatore  ',
        });

        assert.ok(result.success);
        assert.strictEqual(result.data.name, 'Priya Sharma');
        assert.strictEqual(result.data.phone, '+91 98765 43210');
        assert.strictEqual(result.data.email, 'priya@example.com');
        assert.strictEqual(result.data.address, '12, Gandhi Road\nCoimbatore');
    });

    test('leaves out blank optional fields', () => {
        const result = validateFeedbackInput({
            ...validInput,
            alternativePhone: '  ',
            address: '',
            curriculums: undefined,
            exams: null,
            academicSupport: [],
            productDemoInterest: null,
        });

        assert.ok(result.success);
        assert.ok(!('alternativePhone' in result.data));
        assert.ok(!('address' in result.data));
        assert.ok(!('productDemoInterest' in result.data));
        assert.deepStrictEqual(result.data.curriculums, []);
        assert.deepStrictEqual(result.data.exams, []);
        assert.deepStrictEqual(result.data.academicSupport, []);
    });

    test('reports every required field for an empty or non-object body', () => {
        for (const input of [null, undefined, 'text', {}]) {
            assert.deepStrictEqual(Object.keys(errorsFor(input)), [
                'registrationType',
                'name',
                'phone',
                'whatsapp',
                'email',
                'needs',
            ]);
        }
    });

    test('requires at least one need', () => {
        assert.strictEqual(
            errorsFor({ ...validInput, needs: [] }).needs,
            'Please choose at least one option',
        );
    });

    test('accepts common phone formats', () => {
        for (const phone of ['9876543210', '+91 98765 43210', '098765-43210', '(0422) 234 5678']) {
            assert.ok(validateFeedbackInput({ ...validInput, phone }).success, phone);
        }
    });

    test('rejects invalid phone numbers', () => {
        for (const phone of [
            '12345',
            'call me',
            '98765 4321x',
            '+91 98765 43210 123456',
            '++919876543210',
        ]) {
            assert.strictEqual(
                errorsFor({ ...validInput, phone }).phone,
                'Please enter a valid phone number',
                phone,
            );
        }
        assert.ok(errorsFor({ ...validInput, alternativePhone: '123' }).alternativePhone);
        assert.ok(errorsFor({ ...validInput, whatsapp: 'n/a' }).whatsapp);
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
        const errors = errorsFor({ ...validInput, name: 'A', address: 'x'.repeat(501) });
        assert.strictEqual(errors.name, 'Name must be at least 2 characters');
        assert.strictEqual(errors.address, 'Address must be 500 characters or fewer');
    });

    test('rejects unknown registration types and options', () => {
        const errors = errorsFor({
            ...validInput,
            registrationType: 'alien',
            needs: ['demo', 'free_money'],
            curriculums: 'cbse',
            exams: [{ $ne: null }],
        });
        assert.ok(errors.registrationType);
        assert.strictEqual(errors.needs, 'Please choose from the listed options');
        assert.strictEqual(errors.curriculums, 'Please choose from the listed options');
        assert.strictEqual(errors.exams, 'Please choose from the listed options');
    });

    test('removes duplicate options and keeps them in form order', () => {
        const result = validateFeedbackInput({
            ...validInput,
            needs: ['product', 'demo', 'product'],
            exams: ['cat', 'jee', 'cat'],
        });
        assert.ok(result.success);
        assert.deepStrictEqual(result.data.needs, ['demo', 'product']);
        assert.deepStrictEqual(result.data.exams, ['jee', 'cat']);
    });

    test('keeps role-specific answers only for the matching registration type', () => {
        const teacher = validateFeedbackInput({
            ...validInput,
            registrationType: 'teacher',
            jobTypes: ['part_time'],
            partnershipInterest: true,
        });
        assert.ok(teacher.success);
        assert.deepStrictEqual(teacher.data.jobTypes, ['part_time']);
        assert.ok(!('partnershipInterest' in teacher.data));

        const institution = validateFeedbackInput({
            ...validInput,
            registrationType: 'institution',
            jobTypes: ['full_time'],
            partnershipInterest: true,
        });
        assert.ok(institution.success);
        assert.deepStrictEqual(institution.data.jobTypes, []);
        assert.strictEqual(institution.data.partnershipInterest, true);
    });

    test('requires yes/no answers to be booleans', () => {
        const errors = errorsFor({
            ...validInput,
            partnershipInterest: 'yes',
            productDemoInterest: 1,
        });
        assert.strictEqual(errors.partnershipInterest, 'Please answer yes or no');
        assert.strictEqual(errors.productDemoInterest, 'Please answer yes or no');
    });

    test('rejects non-string values such as query operators', () => {
        const errors = errorsFor({ ...validInput, name: { $gt: '' }, email: ['a@b.com'] });
        assert.ok(errors.name);
        assert.ok(errors.email);
    });
});

describe('isFeedbackStatus', () => {
    test('accepts known statuses only', () => {
        assert.ok(isFeedbackStatus('follow_up'));
        assert.ok(isFeedbackStatus('not_interested'));
        assert.ok(!isFeedbackStatus('in_review'));
        assert.ok(!isFeedbackStatus(undefined));
    });
});
