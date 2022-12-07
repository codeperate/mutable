import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => {
    return {
        verbose: true,
        roots: ['src/test'],
        preset: 'ts-jest',
    };
};
