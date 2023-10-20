# Mutable Library

Mutable is a JavaScript library that provides a set of utility functions and types for working with mutable and condition-based object mutations. It offers a flexible and extensible way to apply mutations to objects based on specified conditions, making it easier to manage and modify complex data structures.

## Installation

You can install Mutable using npm:

```bash
npm install @codeperate/mutable
```

## Features

Mutable offers the following features:

### 1. `Mutable` Type

The `Mutable` type allows you to define objects with mutable properties. It can specify conditions and mutations to apply to the object.

```typescript
type Mutable<T extends object = any, K = any> = {
    [Key in keyof T]: Key extends '$mutate' ? T[Key] : T[Key] extends object ? Mutable<ObjectOnly<T[Key]>, K> | Exclude<T[Key], ObjectOnly<T[Key]>> : T[Key];
} & {
    $mutate?: { cond: Condition; key?: string; mutation: DeepPartial<Mutated<T>> | symbol | ((this: K, obj: T, extra: { conditions: MutableCondition[] }) => any) }[];
};
```

### 2. `DeepPartial` Type

The `DeepPartial` type allows you to create a deep partial copy of an object, preserving the object's structure while making selected properties optional.

```typescript
type DeepPartial<T> = T extends Function
    ? T
    : T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;
```

### 3. `applyMutation` Function

The `applyMutation` function is used to apply mutations to an object based on specified conditions. It supports deep object merging and provides options to control the mutation process.

### 4. Conditional Mutations

MutateJS supports conditional mutations, allowing you to define conditions that determine whether a mutation should be applied to an object.

### 5. `Condition` Type and `isMatchCondition` Function

The `Condition` type allows you to define conditions using logical operators such as `$and`, `$or`, and `$not`. The `isMatchCondition` function checks if an array of conditions matches a given condition.

## Usage

Here's a quick example of how to use MutateJS:

```typescript
import { applyMutation, Condition, isMatchCondition, Mutable, MutableCondition, deleteValue } from 'mutatejs';

// Define your data structure
const data: Mutable<MyData> = {
    name: 'John',
    age: 30,
    $mutate: [
        {
            cond: 'nameEqualsAlice',
            mutation: {
                name: 'Alice',
            },
        },
    ],
};

// Define conditions
const conditions: MutableCondition[] = ['nameEqualsAlice'];

// Apply mutations based on conditions
const mutatedData = applyMutation(conditions, data);

console.log(mutatedData);
```

In this example, we defined a mutable object `data` with a condition-based mutation. We then used the `applyMutation` function to apply mutations based on specified conditions.

## About

Mutable is developed and maintained by Mathew and is hosted on GitHub.

---

Thank you for using Mutable! We hope it simplifies your object mutation needs and enhances your JavaScript projects. If you have any feedback or suggestions, please let us know.
