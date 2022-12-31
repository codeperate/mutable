import { applyMutation, deleteValue } from './index';

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

const _obj = applyMutation(['condition1', 'condition2'], obj);
console.log(_obj);
