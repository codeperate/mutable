import { applyMutation } from './index';
let obj = {
    object: {
        type: 'object',
        properties: {
            a: {
                type: 'string',
                mutate: {
                    test: { type: 'number' },
                },
            },
        },
        required: ['a'],
    },
};
let result = applyMutation(['test'], obj);
console.log(JSON.stringify(result, null, 2));
