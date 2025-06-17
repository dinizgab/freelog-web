import type { Locale } from "./config"

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  pt: () => import("./dictionaries/pt.json").then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => {
  const dict = await dictionaries[locale]()
  return dict
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>
