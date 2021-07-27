import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'
import glob from 'glob'

const def = {
  input: glob.sync('{src/index.ts,src/**/index.ts}'),
  external: [
    ...Object.keys(pkg.dependencies || {})
  ]
}

const exclude = [
  'src/**/*.test.ts',
  'src/**/*.test.tsx',
]

export default [{
  ...def,
  output: {
    dir: 'lib',
    entryFileNames: '[name]' + pkg.main.replace('index', ''),
    format: 'cjs',
    preserveModules: true
  },
  plugins: [
    typescript({
      typescript: require('typescript'),
      tsconfigOverride: {exclude},
    })
  ]
}, {
  ...def,
  output: {
    dir: 'lib',
    entryFileNames: '[name]' + pkg.module.replace('index', ''),
    format: 'es',
    preserveModules: true
  },
  plugins: [
    typescript({
      typescript: require('typescript'),
      tsconfigOverride: {
        compilerOptions: {
          target: 'es6'
        },
        exclude,
      }
    })
  ]
}]
