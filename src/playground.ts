import { Mutable, applyMutation, deleteValue } from './index';

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

interface A {
    a?: string;
    b?: string;
    c?: string;
    d?: {
        e?: string;
        f?: {
            g?: string;
        };
    };
}

function test(a: Mutable<A>) {}
test({
    a: '5',
    d: {
        e: '5',
        f: {
            $mutate: [],
        },
        $mutate: [
            {
                cond: 'ads',
                mutation: {},
            },
        ],
    },
});
