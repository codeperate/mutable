import { applyMutation } from './';
let obj = {
    object: {
        type: 'object',
        properties: {
            a: {
                type: 'string',
            },
        },
        required: ['a'],
    },
} as any;
let result = applyMutation(['test'], obj);
console.log(JSON.stringify(result, null, 2));
