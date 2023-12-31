import path from 'path'
import json from '@rollup/plugin-json'
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require(path.resolve(process.cwd(), './package.json'))
const name = pkg.exports ? pkg.exports.replace(/\.js$/, '') : './dist/index'

const bundle = (config) => ({
  ...config,
  input: 'src/index.ts',
  external: (id) => !/^[./]/.test(id),
})

export default [
  bundle({
    plugins: [json(), esbuild()],
    output: [
      {
        file: `${name}.js`,
        format: pkg.type === 'module' ? 'es' : 'cjs',
        sourcemap: Boolean(pkg.exports),
        exports: 'auto',
      },
    ],
  }),
  ...(pkg.types
    ? [
        bundle({
          plugins: [dts()],
          output: {
            file: `${name}.d.ts`,
            format: 'es',
          },
        }),
      ]
    : []),
]
