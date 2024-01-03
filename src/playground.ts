import { applyMutation, deleteValue } from './index';

const obj = {
    a: 1,
    b: 2,
    collection: {
        $mutate: [
            {
                cond: 'test',
                mutation: deleteValue,
            },
        ],
    },
};

const _obj = applyMutation(['test'], obj);
console.log(JSON.stringify(_obj, null, 2));
