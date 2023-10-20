import { applyMutation, deleteValue } from '../index';

test('applyMutation', () => {
    // Define the object to mutate
    const obj = {
        a: 1,
        b: { something: 'asdsad', $mutate: [{ cond: 'banana', mutation: { something: 'dsadsa' } }] },
        c: 3,
        $mutate: [
            { cond: 'banana', mutation: { c: 4 } },
            { cond: 'orange', mutation: { c: 2, d: 5 } },
        ],
    };

    // Calculate the expected mutation result
    const expected = {
        a: 1,
        b: {
            something: 'dsadsa',
        },
        c: 2,
        d: 5,
    };

    // Apply the mutation to the object and compare the result to the expected output
    expect(applyMutation(['banana', 'orange'], obj)).toEqual(expected);
});
test('applyMutation', () => {
    // Define the object to mutate
    const obj = {
        a: {
            b: 2,
            c: {
                d: 3,
                $mutate: [
                    { cond: 'condition1', mutation: { d: 4 } },
                    { cond: 'condition2', mutation: { d: 5 } },
                ],
            },
        },
        $mutate: [],
    };

    // Calculate the expected mutation result
    const expected = {
        a: {
            b: 2,
            c: { d: 4 },
        },
    };

    // Apply the mutation to the object and compare the result to the expected output
    expect(applyMutation(['condition1', 'condition3'], obj)).toEqual(expected);
});

test('applyMutation', () => {
    // Test with a simple object with no nested properties
    let obj = {
        a: 1,
        b: 2,
        c: 3,
        $mutate: [
            { cond: 'condition1', mutation: { b: 4 } },
            { cond: 'condition2', mutation: { c: 5 } },
        ],
    };
    let expected = { a: 1, b: 4, c: 5 };
    expect(applyMutation(['condition1', 'condition2'], obj)).toEqual(expected);
});

test('applyMutation', () => {
    // Define the object to mutate
    const obj = {
        a: 1,
        b: 2,
        c: 3,
        $mutate: [
            { cond: 'condition1', mutation: { b: 4 } },
            { cond: 'condition2', mutation: { c: deleteValue } },
        ],
    };

    // Calculate the expected mutation result
    const expected = { a: 1, b: 4 };

    // Apply the mutation to the object and compare the result to the expected output
    expect(applyMutation(['condition1', 'condition2'], obj)).toEqual(expected);
});

describe('applyMutation', () => {
    it('should apply the specified mutations to the object', () => {
        const obj = {
            a: 1,
            b: 'hello',
            c: true,
            $mutate: [
                { cond: 'condition1', mutation: { a: 2 } },
                { cond: 'condition2', mutation: { b: 'hello' } },
            ],
        };

        const result = applyMutation(['condition1', 'condition2'], obj);

        expect(result).toEqual({
            a: 2,
            b: 'hello',
            c: true,
        });
    });
});

describe('applyMutation', () => {
    it('should apply the specified mutations to the object', () => {
        const obj = {
            a: 1,
            b: 'hello',
            c: true,
            $mutate: [
                { cond: 'condition1', mutation: { a: 2 } },
                { cond: 'condition2', mutation: { b: 'asd', c: false } },
            ],
        };

        const result = applyMutation(['condition1', 'condition2'], obj);

        expect(result).toEqual({
            a: 2,
            b: 'asd',
            c: false,
        });
    });
});

describe('keepMutation', () => {
    it('should apply the specified mutations to the object', () => {
        const obj = {
            a: 1,
            b: 'hello',
            c: true,
            $mutate: [
                { cond: 'condition1', mutation: { a: 2 } },
                { cond: 'condition2', mutation: { c: false } },
            ],
        };

        const result = applyMutation(['condition1', 'condition2'], obj, { keepMutation: true });

        expect(result).toEqual({
            a: 2,
            b: 'hello',
            c: false,
            $mutate: [
                { cond: 'condition1', mutation: { a: 2 } },
                { cond: 'condition2', mutation: { c: false } },
            ],
        });
    });
});

describe('apply nested condition', () => {
    it('should apply mutation', () => {
        const obj = {
            a: 1,
            b: 'hello',
            c: true,
            $mutate: [{ cond: { $and: ['condition1', 'condition2'] }, mutation: { a: 2 } }],
        };

        const result = applyMutation(['condition1', 'condition2'], obj);

        expect(result).toEqual({
            a: 2,
            b: 'hello',
            c: true,
        });
    });
});
