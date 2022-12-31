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
export type ObjectOnly<T> = T extends object ? (T extends [] ? (T extends Function ? never : T) : never) : never;
export type Mutable<T extends object = any, K = any> = { [Key in keyof T]: T[Key] extends object ? Mutable<ObjectOnly<T>, K> | Exclude<T[Key], ObjectOnly<T>> : T[Key] } & {
    mutate?: { [key: string]: DeepPartial<Mutated<T, K>> | ((this: K, obj: T, ...args: any) => any) };
};
export type Mutated<T extends object, K = any> =
    | {
          [Key in keyof T]: T[Key] extends object ? Mutated<Exclude<T[Key], Function>> | Extract<T[Key], Function> : T[Key] | symbol;
      }
    | symbol;

export type MutableCondition = string | { condition: string; args?: () => any | any[] };
export const deleteValue = Symbol('deleteValue');
function deepAssign(currentObj: Record<any, any>, newObj: Record<any, any>) {
    if (!newObj) return currentObj;
    for (const [key, value] of Object.entries(newObj)) {
        if (!currentObj[key]) {
            continue;
        }

        if (typeof value == 'object' && value && value.constructor.name === 'Object') {
            newObj[key] = deepAssign(currentObj[key], newObj[key]);
        }
    }
    return { ...currentObj, ...newObj };
}
export function applyMutation<T extends Mutable<T>>(
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
                const mutation = result.mutate[mutateKey];
                if (mutation === deleteValue) {
                    result = deleteValue;
                } else if (typeof mutation == 'function') {
                    let args;
                    if (typeof matchCondition != 'string') {
                        args = matchCondition.args();
                    }
                    result = mutation.bind(this)(result, ...(Array.isArray(args) ? args : [args]));
                } else {
                    result = deepAssign(lastObjResult, mutation);
                }
                if (result && typeof result == 'object') lastObjResult = result;
            }
        }
    }
    for (const [key, value] of Object.entries(result)) {
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
