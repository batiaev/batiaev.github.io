import data from '@/data/data.json'

export interface ShowcaseRole {
  company: string
  /** Target of the in-page link to that role's card. */
  anchor: string
  /** Absent until a brand asset exists; the UI falls back to a wordmark. */
  logo?: string
}

/** Roles worth naming in the hero, newest first (source order is reverse-chronological). */
const showcased = data.experiences
  .filter((role) => 'showcase' in role && role.showcase === true)
  .map((role) => ({
    company: role.company,
    anchor: role.anchor,
    logo: 'logo' in role ? role.logo : undefined,
    current: 'current' in role && role.current === true,
  }))

export const currentRoles: ShowcaseRole[] = showcased.filter((r) => r.current)
export const previousRoles: ShowcaseRole[] = showcased.filter((r) => !r.current)

export function roleAnchor(anchor: string): string {
  return `role-${anchor}`
}
