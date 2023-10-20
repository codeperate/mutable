export type ConditionOperator = {
    $and?: (ConditionOperator | string)[];
    $or?: (ConditionOperator | string)[];
    $not?: (ConditionOperator | string)[];
};
export type Condition = ConditionOperator | string[] | string;

export function isMatchCondition(arr: string[], condition: Condition): boolean {
    if (typeof condition == 'string') return arr.includes(condition);
    if (Array.isArray(condition)) return condition.every((condition) => arr.includes(condition));
    const { $and, $or, $not } = condition;
    let result: boolean[] = [];
    if ($and && $and.length > 0) {
        result.push($and.every((condition) => isMatchCondition(arr, condition)));
    }
    if ($or && $or.length > 0) {
        result.push($or.some((condition) => isMatchCondition(arr, condition)));
    }
    if ($not && $not.length > 0) {
        result.push($not.every((condition) => !isMatchCondition(arr, condition)));
    }
    if (result.length > 0) return result.every((v) => v);
    else return false;
}
