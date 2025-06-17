import type { Dictionary } from "./dictionaries"

export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key]?.toString() || match
  })
}

export function t(dict: Dictionary, key: string, values?: Record<string, string | number>): string {
  const keys = key.split(".")
  let result: any = dict

  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = result[k]
    } else {
      console.warn(`Translation key not found: ${key}`)
      return key
    }
  }

  if (typeof result !== "string") {
    console.warn(`Translation key is not a string: ${key}`)
    return key
  }

  return values ? interpolate(result, values) : result
}

export function formatRelativeTime(date: Date | string, dict: Dictionary): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return t(dict, "time.just_now")
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    const key = minutes === 1 ? "time.minutes_ago" : "time.minutes_ago_plural"
    return t(dict, key, { count: minutes.toString() })
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    const key = hours === 1 ? "time.hours_ago" : "time.hours_ago_plural"
    return t(dict, key, { count: hours.toString() })
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    const key = days === 1 ? "time.days_ago" : "time.days_ago_plural"
    return t(dict, key, { count: days.toString() })
  }
}
