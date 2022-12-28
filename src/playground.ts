import { applyMutation, deleteValue } from './index';
let obj = {
    properties: {
        name: {
            mutate: {
                edit: () => ({ label: 'Name' }),
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
let result = applyMutation(['edit'], obj as any);
console.log(JSON.stringify(result, null, 2));
