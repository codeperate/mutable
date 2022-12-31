export type DeepPartial<T> = T extends Function
    ? T
    : T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;
export type NonMutable<T extends object> = {
    [Key in keyof Omit<T, 'mutate'>]: T[Key] extends object ? NonMutable<Exclude<T[Key], Function>> | Extract<T[Key], Function> : T[Key];
};
export type Mutable<T extends object = any, K = any> = { [Key in keyof T]: T[Key] extends object ? Mutable<Exclude<T[Key], Function>, K> | Extract<T[Key], Function> : T[Key] } & {
    mutate?: { [key: string]: DeepPartial<Mutated<T, K>> };
};
export type Mutated<T extends object, K = any> =
    | {
          [Key in keyof T]: (T[Key] extends object ? Mutated<Exclude<T[Key], Function>> | Extract<T[Key], Function> : T[Key]) | ((this: K, obj: T, ...args: any) => T) | symbol;
      }
    | ((this: K, obj: T, ...args: any) => T)
    | symbol;

export type MutableCondition = string | { condition: string; args?: () => any | any[] };
export const deleteValue = Symbol('deleteValue');
export function applyMutation<T extends Mutable<NonMutable<T>>>(
    conditions: MutableCondition[],
    obj: T,
    option: {
        keepMutation?: boolean;
    } = {},
) {
    const defaultOption = { keepMutation: false };
    Object.assign(defaultOption, option);
    // Create the `deleteValue` symbol

    // Start with a shallow copy of the original object

    let result = { ...obj };

    // Recursively apply the mutation to all properties of the object, regardless of
    // whether or not they have a `mutate` property
    for (const [key, value] of Object.entries(result)) {
        if (value && typeof value == 'object' && Array.isArray(value) == false) {
            result[key] = applyMutation(conditions, value as any, { ...option });
            if (result[key] == deleteValue) delete result[key];
        }
    }

    // Iterate over the list of conditions and apply the corresponding mutation
    // to the result object
    for (const condition of conditions) {
        let conditionKey: string;
        let args;
        if (typeof condition != 'string') {
            conditionKey = condition.condition;
            args = condition.args();
        } else conditionKey = condition;
        const mutation = obj?.mutate?.[conditionKey];
        if (mutation === deleteValue) return deleteValue;
        else if (typeof mutation == 'function') {
            return mutation.bind(this)(result, ...(Array.isArray(args) ? args : [args]));
        } else if (mutation) {
            for (const [key, value] of Object.entries(mutation)) {
                if (value === deleteValue) {
                    delete result[key];
                } else if (typeof value == 'function') {
                    result[key] = value.bind(this)(result[key], ...(Array.isArray(args) ? args : [args]));
                } else {
                    result[key] = value;
                }
            }
        }
    }

    // Remove any remaining `mutate` properties from the result
    if (!option.keepMutation) {
        for (const [key, value] of Object.entries(result)) {
            if (key === 'mutate') {
                delete result[key];
            }
        }
    }
    // Return the result
    return result;
}
type Union = {
    a: () => { b: number };
};
let a: Mutable<Union> = {
    a: null,
};
