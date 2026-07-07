/**
 * Single source of truth for the headline numbers that appear across the
 * site (stat bands, hero copy, llms.txt). Update here, not in page markup.
 *
 * NOTE: AGENTS.md's "canonical stats" note says 20 East Bay cities while the
 * site had standardized on 25+ before this file existed. 25+ is kept here so
 * nothing changes visually; reconcile with the real roster count and update
 * this one value (plus AGENTS.md) when confirmed.
 */
export const stats = {
  /** Kids on robotics teams each season. */
  kidsOnTeams: "~1,000",
  /** FIRST teams across all four levels. */
  teams: "125+",
  /** Schools those kids come from. */
  schools: "90+",
  /** East Bay cities those schools span. */
  cities: "25+",
  /** Share of LEGO League participants who are girls. */
  girlsInLegoLeague: "40%",
  /** Share of participants from Title 1 schools. */
  titleOneShare: "10%",
  /** Share of participants from outside Piedmont. */
  outsidePiedmontShare: "46%",
  /** Volunteer hours logged (about-us band). */
  volunteerHours: "1,900+",
} as const;

export type StatColor = "red" | "cyan" | "purple" | "cream";

export interface Stat {
  number: string;
  label: string;
  color?: StatColor;
}

/** Parse a "$25,694"-style display amount into a number. */
export const parseAmount = (s: string) => Number(s.replace(/[^0-9.]/g, ""));

/** Format a summed dollar amount as a floor-rounded "$81K+" style figure. */
export const formatAmountKPlus = (n: number) => `$${Math.floor(n / 1000)}K+`;

/** Format a summed count as a floor-to-ten "60+" style figure. */
export const formatCountPlus = (n: number) => `${Math.floor(n / 10) * 10}+`;
