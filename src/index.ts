export type DeepPartial<T> = T extends Function
    ? T
    : T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;
export type NonMutable<T extends object> = {
    [Key in keyof Omit<T, 'mutate'>]: T[Key] extends object ? NonMutable<ObjectOnly<T>> | Exclude<T[Key], ObjectOnly<T>> : T[Key];
};
export type ObjectOnly<T> = T extends object ? (T extends Array<infer U> ? never : T extends CallableFunction ? never : T) : never;

export type Mutable<T extends object = any, K = any> = {
    [Key in keyof T]: Key extends 'mutate' ? T[Key] : T[Key] extends object ? Mutable<ObjectOnly<T[Key]> | Exclude<T[Key], ObjectOnly<T[Key]>>, K> : T[Key];
} & {
    mutate?: { [key: string]: DeepPartial<Mutated<T, K>> | ((this: K, obj: T, conditions: MutableCondition[], ...args: any) => any) };
};
export type Mutated<T extends object, K = any> =
    | {
          [Key in keyof T]: T[Key] extends object ? Mutated<Exclude<T[Key], CallableFunction>> | Extract<T[Key], CallableFunction> : T[Key] | symbol;
      }
    | symbol;

export type MutableCondition = string | { condition: string; args?: () => any | any[] };
export const deleteValue = Symbol('deleteValue');
export function deepAssign(currentObj: Record<any, any>, newObj: Record<any, any>) {
    let _newObj = { ...newObj };
    if (!newObj) return currentObj;
    for (const [key, value] of Object.entries(_newObj)) {
        if (!currentObj[key]) {
            continue;
        }

        if (typeof value == 'object' && value && value.constructor.name === 'Object') {
            _newObj[key] = deepAssign(currentObj[key], _newObj[key]);
        }
    }
    return { ...currentObj, ..._newObj };
}
export function applyMutation<T extends object>(
    conditions: MutableCondition[],
    obj: T,
    option: {
        keepMutation?: boolean;
        top?: boolean;
    } = { top: true },
) {
    const defaultOption = { keepMutation: false };
    Object.assign(defaultOption, option);
    let result: any = { ...obj };
    let lastObjResult = result;
    if (result.mutate) {
        for (const mutateKey of Object.keys(result.mutate)) {
            const matchCondition = conditions.find((c) => (typeof c == 'string' ? c : c.condition) == mutateKey);
            if (matchCondition) {
                const mutation = lastObjResult.mutate[mutateKey];
                if (mutation === deleteValue) {
                    result = deleteValue;
                } else if (typeof mutation == 'function') {
                    let args;
                    if (typeof matchCondition != 'string') {
                        args = matchCondition.args();
                    }
                    result = mutation.bind(this)(result, conditions, ...(Array.isArray(args) ? args : [args]));
                } else {
                    result = deepAssign(lastObjResult, mutation);
                }
                if (result && typeof result == 'object') lastObjResult = result;
            }
        }
    }
    for (const [key, value] of Object.entries(result)) {
        if (key == 'mutate') continue;
        if (value && typeof value == 'object' && value.constructor.name === 'Object') {
            result[key] = applyMutation(conditions, value as any, { ...option, top: false });
        }
        if (result[key] == deleteValue) delete result[key];
    }
    if (!option.keepMutation) {
        if (typeof result == 'object' && 'mutate' in result) delete result['mutate'];
    }
    if (option.top && result == deleteValue) result = undefined;
    return result;
}
let a: Mutable<{ a: (() => { b: number }) | { b: number } }>;
a = { a: { b: 6, mutate: { test: () => {} } } };
applyMutation(['asd'], a);
