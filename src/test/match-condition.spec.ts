import { isMatchCondition } from '../match-condition';

describe('isMatchCondition', () => {
    const arr = ['apple', 'banana', 'orange'];

    it('should return true when the condition is a string that exists in the array', () => {
        const condition = 'apple';
        const result = isMatchCondition(arr, condition);
        expect(result).toBe(true);
    });

    it('should return true when the condition is an array of strings that all exist in the array', () => {
        const condition = ['banana', 'orange'];
        const result = isMatchCondition(arr, condition);
        expect(result).toBe(true);
    });

    it('should return true when using $and operator and all conditions match', () => {
        const condition = {
            $and: ['banana', 'orange'],
        };
        const result = isMatchCondition(arr, condition);
        expect(result).toBe(true);
    });

    it('should return true when using $or operator and at least one condition matches', () => {
        const condition = {
            $or: ['banana', 'pear'],
        };
        const result = isMatchCondition(arr, condition);
        expect(result).toBe(true);
    });

    it('should return true when using $not operator and no conditions match', () => {
        const condition = {
            $not: ['pear', 'grape'],
        };
        const result = isMatchCondition(arr, condition);
        expect(result).toBe(true);
    });

    it('should return false when the condition is a string that does not exist in the array', () => {
        const condition = 'mango';
        const result = isMatchCondition(arr, condition);
        expect(result).toBe(false);
    });

    it('should return false when the condition is an array of strings and at least one does not exist in the array', () => {
        const condition = ['banana', 'mango'];
        const result = isMatchCondition(arr, condition);
        expect(result).toBe(false);
    });

    it('should return false when using $and operator and at least one condition does not match', () => {
        const condition = {
            $and: ['banana', 'mango'],
        };
        const result = isMatchCondition(arr, condition);
        expect(result).toBe(false);
    });

    it('should return false when using $or operator and no conditions match', () => {
        const condition = {
            $or: ['pear', 'grape'],
        };
        const result = isMatchCondition(arr, condition);
        expect(result).toBe(false);
    });

    it('should return false when using $not operator and at least one condition matches', () => {
        const condition = {
            $not: ['banana', 'orange'],
        };
        const result = isMatchCondition(arr, condition);
        expect(result).toBe(false);
    });

    it('should return true when using nested conditions with two $and operators within a $or operator', () => {
        const condition = {
            $or: [
                {
                    $and: ['apple', 'banana'],
                },
                {
                    $and: ['banana', 'orange'],
                },
            ],
        };
        const result = isMatchCondition(arr, condition);
        expect(result).toBe(true);
    });

    it('should return false when using nested conditions with two $and operators within a $or operator and no conditions match', () => {
        const condition = {
            $or: [
                {
                    $and: ['apple', 'mango'],
                },
                {
                    $and: ['pear', 'orange'],
                },
            ],
        };
        const result = isMatchCondition(arr, condition);
        expect(result).toBe(false);
    });

    it('should return true when using nested conditions with two $and operators within a $or operator and only one condition matches', () => {
        const condition = {
            $or: [
                {
                    $and: ['apple', 'mango'],
                },
                {
                    $and: ['banana', 'orange'],
                },
            ],
        };
        const result = isMatchCondition(arr, condition);
        expect(result).toBe(true);
    });
});
