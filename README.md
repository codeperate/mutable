# `applyMutation`

A function for applying a series of mutations to an object without modifying the original object.

## Installation

To install `applyMutation` from npm, run the following command:

`npm install apply-mutation`

## Usage

To use `applyMutation`, import it from the `apply-mutation` module like this:

`import { applyMutation, deleteValue } from 'apply-mutation';`

The `applyMutation` function takes two arguments:

1. An array of condition strings, representing the list of mutations to apply to the object.
2. An object that implements the `Mutable` interface, representing the object to be mutated.

Here is an example of how to use `applyMutation`:

```ts
// Define the object to mutate
const obj = {
    a: 1,
    b: 2,
    c: 3,
    mutate: {
        condition1: { b: 4 },
        condition2: { c: deleteValue },
    },
};

// Apply the mutation to the object
const result = applyMutation(['condition1', 'condition2'], obj);

// The result should be { a: 1, b: 4 }
```

## Advanced Usage

The `applyMutation` function is designed to handle nested objects and to apply mutations to all properties of the object, regardless of whether or not they have a `mutate` property. This allows you to create complex mutations that span multiple levels of the object hierarchy.

Here is an example of how to use `applyMutation` with a nested object:

```ts
// Define the object to mutate
const obj = {
    a: 1,
    b: {
        c: 2,
        d: 3,
        mutate: {
            condition1: { c: 4 },
            condition2: { d: deleteValue },
        },
    },
};

// Apply the mutation to the object
const result = applyMutation(['condition1', 'condition2'], obj);

// The result should be { a: 1, b: { c: 4 } }
```

# License

# MIT

# Author

# Assistant (a large language model trained by OpenAI)
