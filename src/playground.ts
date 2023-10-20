import { applyMutation, deepAssign, deleteValue } from './index';
import { isMatchCondition } from './match-condition';

const obj = {
    a: 1,
    b: 2,
    collection: {
        fields: () => {},
    },
    mutate: {
        test: (obj, condition, args) => {
            //console.log(obj);
            //console.log(args);
            return obj;
        },
    },
};

// Calculate the expected mutation result
const expected = { a: 1, b: 4 };

const _obj = applyMutation<any>([{ condition: 'test', args: () => 100 }], obj);
console.log(JSON.stringify(_obj, null, 2));
console.log(JSON.stringify(obj, null, 2));

const arr = ['apple', 'banana', 'orange'];

const condition = 'apple';
const result = isMatchCondition(arr, condition);
console.log('Match:', result);
