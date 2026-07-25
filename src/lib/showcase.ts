import data from '@/data/data.json'

export interface ShowcaseRole {
  company: string
  /** Target of the in-page link to that role's card. */
  anchor: string
  /** Absent until a brand asset exists; the UI falls back to a wordmark. */
  logo?: string
}

/** Roles worth naming in the hero, newest first (source order is reverse-chronological). */
export const showcaseRoles: ShowcaseRole[] = data.experiences
  .filter((role) => 'showcase' in role && role.showcase === true)
  .map((role) => ({
    company: role.company,
    anchor: role.anchor,
    logo: 'logo' in role ? role.logo : undefined,
  }))

export function roleAnchor(anchor: string): string {
  return `role-${anchor}`
}
