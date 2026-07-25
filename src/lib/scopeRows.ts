import data from "@/data/data.json";

export interface ScopeRow {
  role: string;
  engineers: number;
  year: number;
  /** Headline scale of the problem at that role, in its own units. */
  note: string;
}

/** Newest first, so the chart reads top-down like the role list above it. */
export const scopeRows: ScopeRow[] = data.experiences
  .filter(
    (
      role,
    ): role is typeof role & {
      teamSize: number;
      startYear: number;
      scaleNote: string;
    } => "teamSize" in role && "startYear" in role && "scaleNote" in role,
  )
  .map((role) => ({
    role: `${role.company} ’${String(role.startYear).slice(2)}`,
    engineers: role.teamSize,
    year: role.startYear,
    note: role.scaleNote,
  }))
  .sort((a, b) => b.year - a.year);
