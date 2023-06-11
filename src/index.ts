import { Condition, isMatchCondition } from './match-condition';

export type DeepPartial<T> = T extends Function
    ? T
    : T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;
export type NonMutable<T extends object> = {
    [Key in keyof Omit<T, '$mutate'>]: T[Key] extends object ? NonMutable<ObjectOnly<T>> | Exclude<T[Key], ObjectOnly<T>> : T[Key];
};
export type ObjectOnly<T> = T extends object ? (T extends Array<infer U> ? never : T extends CallableFunction ? never : T) : never;

// export type Mutable<T extends object = any, K = any> = {
//     [Key in keyof T]: Key extends '$mutate' ? T[Key] : T[Key] extends object ? Mutable<ObjectOnly<T[Key]>, K> | Exclude<T[Key], ObjectOnly<T[Key]>> : T[Key];
// } & {
//     $mutate?: { [key: string]: DeepPartial<Mutated<T, K>> | ((this: K, obj: T, conditions: MutableCondition[], ...args: any) => any) };
// };

export type Mutable<T extends object = any, K = any> = {
    [Key in keyof T]: Key extends '$mutate' ? T[Key] : T[Key] extends object ? Mutable<ObjectOnly<T[Key]>, K> | Exclude<T[Key], ObjectOnly<T[Key]>> : T[Key];
} & {
    $mutate?: { cond: Condition; mutation: DeepPartial<Mutated<T>> | symbol | ((this: K, obj: T, extra: { conditions: MutableCondition[] }) => any) }[];
};

export type Mutated<T extends object> =
    | {
          [Key in keyof T]: (T[Key] extends object ? Mutated<Exclude<T[Key], CallableFunction>> | Extract<T[Key], CallableFunction> : T[Key]) | symbol;
      };

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
    } = {},
) {
    const defaultOption = { keepMutation: false, top: true };
    Object.assign(defaultOption, option);
    let result: any = { ...obj };
    let lastObjResult = result;
    if (result.$mutate) {
        for (let i = 0; i < result.$mutate.length; i++) {
            const mutateObj = result.$mutate[i];
            const { cond } = mutateObj;
            if (
                isMatchCondition(
                    conditions.map((c) => (typeof c == 'object' ? c.condition : c)),
                    cond,
                )
            ) {
                const mutation = lastObjResult.$mutate[i]['mutation'];
                if (mutation === deleteValue) {
                    result = deleteValue;
                } else if (typeof mutation == 'function') {
                    result = mutation.bind(this)(result, { conditions });
                } else {
                    result = deepAssign(lastObjResult, mutation);
                }
                if (result && typeof result == 'object') lastObjResult = result;
            }
        }
    }
    for (const [key, value] of Object.entries(result)) {
        if (key == '$mutate') continue;
        if (value && typeof value == 'object' && value.constructor.name === 'Object') {
            result[key] = applyMutation.bind(this)(conditions, value as any, { ...option, top: false });
        }
        if (result[key] == deleteValue) delete result[key];
    }
    if (!option.keepMutation) {
        if (typeof result == 'object' && '$mutate' in result) delete result['$mutate'];
    }
    if (option.top && result == deleteValue) result = undefined;
    return result;
}
