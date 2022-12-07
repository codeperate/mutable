import { applyMutation, deleteValue } from '..';

test('applyMutation', () => {
    // Define the object to mutate
    const obj = {
        a: 1,
        b: { something: 'asdsad', mutate: { banana: { something: 'dsadsa' } } },
        c: 3,
        mutate: { banana: { c: 4 }, orange: { c: 2, d: 5 } },
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
            c: { d: 3, mutate: { condition1: { d: 4 }, condition2: { d: 5 } } },
        },
        mutate: {},
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
        mutate: {
            condition1: { b: 4 },
            condition2: { c: 5 },
        },
    };
    let expected = { a: 1, b: 4, c: 5 };
    expect(applyMutation(['condition1', 'condition2'], obj)).toEqual(expected);
});

test('applyMutation', () => {
    // Create the `deleteValue` symbol

    // Define the object to mutate
    const obj = {
        a: 1,
        b: 2,
        c: 3,
        mutate: {
            condition1: { b: 4 },
            condition2: { c: deleteValue },
        },
    };

    // Calculate the expected mutation result
    const expected = { a: 1, b: 4 };

    // Apply the mutation to the object and compare the result to the expected output
    expect(applyMutation(['condition1', 'condition2'], obj)).toEqual(expected);
});
