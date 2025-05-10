import { DeepPartial, Immutable, Mutable, applyMutation, deleteValue } from './index';

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
    d?: Immutable<{
        e?: string;
        f?: {
            g?: string;
        };
    }>;
}

function test4(a: Mutable<A>) { }
test4({
    a: 'a',
    $mutate: [{ cond: 'test', mutation: { a: 'b' } }],
    d: {
        e: "",

    }

})
export interface DefaultEntityConfig extends Omit<EntityConfig, 'title' | 'description' | 'dataViewer' | 'form' | 'name'> {
    dataViewer: Omit<EntityDataViewer, 'fields'>;
}

type WithDefault<T, U> = {
    [K in keyof T & keyof U]?: T[K] extends object ? WithDefault<T[K], U[K]> : T[K];
} & { [K in Exclude<keyof T, keyof U>]: T[K] };

function test(a: Mutable<WithDefault<EntityConfig, DefaultEntityConfig>>) { }
function test2(a: WithDefault<EntityConfig, DefaultEntityConfig>) { }
function test3(a: Mutable<DeepPartial<EntityConfig>>) { }
test3({
    name: 'test',
    title: 'test',
    description: 'asd',
    dataViewer: {
        $mutate: [{ cond: 'test', mutation: 'asd' }],
    },
    create: {
        //submit: (ctx) => {},
    },
    form: {},
    requests: { $mutate: [{ cond: 'test', mutation: {} }] },
});
interface FormSchema { }
interface EntityDataViewer { }
interface Component { }
interface EntityEditContext { }
interface OrderByState { }
interface EntityContext { }
export interface EntityConfig {
    name: string;
    title: string;
    description?: string;
    idField: string;
    displayField: (item: object) => string;
    requests: {
        fetchAll: (arg: { query?: string; limit: number; offset: number; filter?; orderBy?: OrderByState }) => Promise<any>;
        fetchOne: (id) => Promise<any>;
        create: (data) => Promise<any>;
        update: (id, data) => Promise<any>;
        delete: (id) => Promise<any>;
        //exportAll?: (arg: { filter; fields: string[]; format?: string }) => Promise<any>;
    };
    dataViewer: EntityDataViewer;
    form: Mutable<FormSchema>;
    create: {
        enable: boolean | (() => boolean);
        submit: (ctx: EntityContext) => Promise<void>;
        success: (ctx: EntityContext, res: any) => Promise<void>;
        fail: (ctx: EntityContext, error: any) => Promise<void>;
        saveTxt: string;
        expandTxt: string;
        clearTxt: string;
        collapseTxt: string;
        recoverTxt: string;
        saveHisTxt: string;
        menuTxt: string;
        createTxt: string;
        createBtnFn: (ctx: EntityContext) => Promise<void>;
        contextMenu?: Component;
        onMounted?: (ctx: EntityContext) => void;
    };
    edit: {
        enable: boolean | (() => boolean);
        editTxt: string;
        saveTxt: string;
        viewTxt: string;
        expandTxt: string;
        deleteTxt: string;
        collapseTxt: string;
        menuTxt: string;
        submit: (ctx: EntityEditContext) => Promise<void>;
        success: (ctx: EntityEditContext, res: any) => Promise<void>;
        fail: (ctx: EntityEditContext, error: any) => Promise<void>;
        contextMenu?: Component;
    };
    delete: {
        enable: boolean | ((ctx: EntityEditContext) => boolean);
        submit: (ctx: EntityEditContext) => Promise<void>;
        success: (ctx: EntityEditContext, res: any) => Promise<void>;
        fail: (ctx: EntityEditContext, error: any) => Promise<void>;
        deleteBtn: string;
    };
}
