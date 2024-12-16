import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/closeping.cjs.js',
            format: 'cjs',
        },
        {
            file: 'dist/closeping.esm.js',
            format: 'es',
        },
        {
            file: 'dist/closeping.min.js',
            format: 'iife',
            name: 'ClosePing',
            plugins: [terser()],
        },
    ],
    plugins: [resolve(), commonjs(), typescript()],
};
