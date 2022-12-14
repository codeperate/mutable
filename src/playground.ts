import { applyMutation, deepAssign, deleteValue } from './index';

const obj = {
    a: 1,
    b: 2,
    collection: {
        fields: {
            d: 1,
            f: 2,
        },
    },
    mutate: {
        collection: {
            collection: { fields: { g: 1, d: null } },
        },
    },
};

// Calculate the expected mutation result
const expected = { a: 1, b: 4 };

const _obj = applyMutation<any>(['collection'], deepAssign(obj, { mutate: { collection: { collection: { fields: { k: 3 } } } } }));
console.log(JSON.stringify(_obj, null, 2));
console.log(JSON.stringify(obj, null, 2));
