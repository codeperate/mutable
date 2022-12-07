export type Mutable<T> = {
    mutate?: { [key: string]: T };
};
export const deleteValue = Symbol('deleteValue');
export function applyMutation<T extends object>(conditions: string[], obj: Mutable<T>) {
    // Create the `deleteValue` symbol

    // Start with a shallow copy of the original object
    let result = { ...obj };

    // Recursively apply the mutation to all properties of the object, regardless of
    // whether or not they have a `mutate` property
    for (const [key, value] of Object.entries(obj)) {
        if (value && typeof value == 'object') {
            result[key] = applyMutation(conditions, value);
        }
    }

    // Iterate over the list of conditions and apply the corresponding mutation
    // to the result object
    for (const condition of conditions) {
        const mutation = obj.mutate?.[condition];
        if (mutation) {
            for (const [key, value] of Object.entries(mutation)) {
                if (value === deleteValue) {
                    delete result[key];
                } else {
                    result[key] = value;
                }
            }
        }
    }

    // Remove any remaining `mutate` properties from the result
    for (const [key, value] of Object.entries(result)) {
        if (key === 'mutate') {
            delete result[key];
        }
    }

    // Return the result
    return result;
}
