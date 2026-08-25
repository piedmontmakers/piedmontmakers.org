// Board roster shown on /about-us. Routine edits live here: add, remove,
// or retitle people in the matching group. `role` is optional for at-large
// members. The page layout is in src/pages/about-us.astro.

export interface BoardMember {
  name: string;
  // A string for one title; an array when someone holds two, which
  // about-us.astro renders on separate lines under their name.
  role?: string | string[];
}

// 2026–27 board slate. Paul Morrison wears two hats (Secretary + VP FTC)
// and appears in both Officers and Robotics — that's intentional.
export const board = {
  officers: [
    { name: "Kevin Clark", role: "Co-President" },
    { name: "Ben Stein", role: "Co-President" },
    { name: "Dave Ragones", role: "Co-Founder & Treasurer (Interim)" },
    { name: "Paul Morrison", role: "Secretary" },
  ],
  robotics: [
    { name: "Paul Morrison", role: "VP, FIRST Tech Challenge" },
    { name: "Lara Oliver", role: "VP, FIRST Tech Challenge" },
    { name: "Pat Holder", role: "VP, FIRST LEGO League Challenge" },
    { name: "Shelley Rea", role: "VP, FIRST LEGO League Challenge" },
    { name: "Marta Lusky", role: "VP, FIRST LEGO League Explore" },
    { name: "Dave Koslow", role: "VP, FIRST LEGO League Explore" },
    { name: "Natalia Feretti", role: "VP, FIRST Robotics Competition" },
  ],
  programs: [
    { name: "Ella Grossberg", role: "VP, School Maker Faire" },
    { name: "Brian Van Osdol", role: "VP, School Maker Faire" },
    { name: "Rebecca Heywood", role: "VP, Grants" },
    { name: "Margaret Bridges", role: "VP, Grants" },
    { name: "Julie Veit", role: "VP, Operations" },
    { name: "Mallory Casperson", role: "VP, Fundraising" },
    { name: "Keren Khouri", role: "10th St Coordination" },
    { name: "Ken Khouri", role: "10th St Tech Lead" },
    { name: "Dave Ragones", role: "Destination Imagination" },
  ],
  atLarge: [
    { name: "Greg Wolff", role: "Master Maker" },
    { name: "Alex Seiden" },
    { name: "Larraine Seiden" },
    { name: "Joel Tornatore" },
    { name: "Dave McMurtry" },
  ],
  staff: [
    { name: "Alya Hameed", role: "FLL/FTC Program Manager" },
  ],
} satisfies Record<string, BoardMember[]>;

// Unique people on the board proper (staff listed separately); Paul
// Morrison's two hats count once.
export const boardMemberCount = new Set(
  [...board.officers, ...board.robotics, ...board.programs, ...board.atLarge].map((m) => m.name)
).size;
