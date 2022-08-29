import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
export default {
  input: './tmp/index.js',
  plugins: [typescript(),commonjs()],
  output: {
    file: 'bundle.js',
    format: 'cjs',
  },
//   commonjs({ extensions: ['js', '.ts'] })
};
