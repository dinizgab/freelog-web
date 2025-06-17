export const defaultLocale = "en" as const
export const locales = ["en", "pt"] as const

export type Locale = (typeof locales)[number]

export const localeNames: Record<Locale, string> = {
  en: "English",
  pt: "Português",
}

export const localeFlags: Record<Locale, string> = {
  en: "🇺🇸",
  pt: "🇧🇷",
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}
