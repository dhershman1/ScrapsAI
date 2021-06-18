import { terser } from 'rollup-plugin-terser'

export default {
  input: './src/index.js',
  plugins: [
    terser()
  ],
  output: {
    file: 'dist/main.js',
    format: 'cjs',
    name: 'scraps-ai',
    exports: 'default'
  }
}
