import { applyMutation, deleteValue } from './index';

const obj = {
    a: 1,
    b: 2,
    c: {
        d: 1,
        mutate: {
            condition1: {
                f: 1,
            },
        },
    },
    mutate: {
        condition1: {
            b: 4,
        },
    },
};

// Calculate the expected mutation result
const expected = { a: 1, b: 4 };

const _obj = applyMutation(['condition1', 'condition2'], obj, { keepMutation: true });
console.log(JSON.stringify(_obj, null, 2));
