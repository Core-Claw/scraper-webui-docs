import { readFile } from 'node:fs/promises'

const componentPath = new URL('../src/components/ApiPlayground.astro', import.meta.url)
const generatorPath = new URL('./generate-api-v2-docs.mjs', import.meta.url)

const component = await readFile(componentPath, 'utf8')
const generator = await readFile(generatorPath, 'utf8')

const failures = []

function expectIncludes(source, needle, label) {
    if (!source.includes(needle)) failures.push(label)
}

expectIncludes(
    component,
    "name === 'workerId' || name === 'worker_id'",
    'ApiPlayground must normalize both workerId path params and worker_id query params.'
)
expectIncludes(
    component,
    "decodeURIComponent",
    'ApiPlayground must handle pasted owner%2Fname values, not only literal owner/name.'
)
expectIncludes(
    component,
    ".replace(/\\//g, '~')",
    'ApiPlayground must convert owner/name worker identifiers to owner~name before URL encoding.'
)
expectIncludes(
    component,
    'the playground sends it as `owner~name`',
    'ApiPlayground worker parameter hint must tell users that the playground auto-converts owner/name.'
)
expectIncludes(
    component,
    'delete out.version',
    'ApiPlayground must not send version: latest by default for direct Worker runs.'
)
expectIncludes(
    component,
    'hydrateWorkerInputDefaults',
    'ApiPlayground must hydrate empty direct-run input from the selected Worker input schema.'
)
expectIncludes(
    component,
    'parameters: { custom: {} }',
    'ApiPlayground direct-run examples must put Worker form fields under input.parameters.custom.'
)
expectIncludes(
    component,
    'custom: defaults',
    'ApiPlayground must hydrate Worker schema defaults into input.parameters.custom.'
)
expectIncludes(
    generator,
    'the playground sends it as `owner~name`',
    'API docs generator must preserve the auto-conversion hint when API docs are regenerated.'
)

if (failures.length) {
    console.error('API playground worker identifier regression check failed:')
    for (const failure of failures) console.error(`- ${failure}`)
    process.exit(1)
}

console.log('API playground worker identifier regression check passed.')
