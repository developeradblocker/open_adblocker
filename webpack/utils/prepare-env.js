const envs = Object.freeze({
  development_chrome: './webpack/env/.env.dev.chrome',
  development_edge: './webpack/env/.env.dev.edge',
  production_chrome: './webpack/env/.env.prod.chrome',
  production_edge: './webpack/env/.env.prod.edge'
})

export const prepareEnv = (mode, browser) => envs[`${mode}_${browser}`]
