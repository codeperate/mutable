import { applyMutation } from './index';
let obj = {
    properties: {
        name: {
            mutate: {
                edit: {
                    hidden: true,
                },
            },
        },
        number: {
            items: {
                config: {},
            },
        },
        test: {
            config: {
                entity: 'test',
            },
        },
        tests: {
            config: {
                entity: 'test',
                multi: true,
            },
        },
    },
};
let result = applyMutation(['edit'], obj);
console.log(JSON.stringify(result, null, 2));
