import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/widget.js',
    format: 'iife',
    name: 'OpenChat',
  },
  plugins: [
    resolve({ browser: true }),
    terser(),
  ],
};