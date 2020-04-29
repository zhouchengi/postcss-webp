const postcss = require('postcss')

const plugin = require('./')

async function run(input, output, opts) {
  const result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

it('background', async () => {
  await run(
    'a { background: #000 url(./test.png) no-repeat; }',
    'a { background: #000 url(./test.png) no-repeat; }\n.webp a { background-image: url(./test.png?x-oss-process=image/format,webp); }',
    {}
  )
})

it('background-image', async () => {
  await run(
    'a { background-image: url(./test.png); }',
    'a { background-image: url(./test.png); }\n.webp a { background-image: url(./test.png?x-oss-process=image/format,webp); }',
    {}
  )
})

it('prefix', async () => {
  await run(
    'a { background-image: url(./test.png); }',
    'a { background-image: url(./test.png); }\n.webp a { background-image: url(./test.png?x-oss-process=test); }',
    { prefix: 'x-oss-process=test' }
  )
})

it('pattern', async () => {
  await run('a { background-image: url(./test.png); }', 'a { background-image: url(./test.png); }', {
    pattern: /\.gif/
  })
})

it('cssModules', async () => {
  await run(
    'a { background-image: url(./test.png); }',
    'a { background-image: url(./test.png); }\n:global(.webp) a { background-image: url(./test.png?x-oss-process=image/format,webp); }',
    {
      cssModules: true
    }
  )
})

it('ignoreComment', async () => {
  await run(
    'a { background-image: url(./test.png); /* webp-disable */ }',
    'a { background-image: url(./test.png); /* webp-disable */ }',
    {
      ignoreComment: 'webp-disable'
    }
  )
})
