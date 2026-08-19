// Teacher-grant awards by school year, shown on /teacher-grants. Routine
// edits live here: add a new year object when a round closes, following the
// shape of the most recent year, and add it to `allYears`. Totals are
// computed so they can't drift. The page layout is in
// src/pages/teacher-grants.astro.
//
// Donor-amount policy note: these are amounts the org GAVE OUT, which we
// publish for accountability. Never add per-donor dollar amounts here.

import { parseAmount, formatAmountKPlus, formatCountPlus } from "./stats";

export const grants_2025_26 = {
  total: "$25,694",
  schools: 6,
  projects: 20,
  applications: { submitted: 27, requested: "$62,000" },
  awards: [
    { school: "Beach Elementary", project: "4th Grade LED circuit project", amount: "$175" },
    { school: "Beach Elementary", project: "TK manipulatives", amount: "$904" },
    { school: "Havens Elementary", project: "Library maker space materials", amount: "$500" },
    { school: "Havens Elementary", project: "TK items", amount: "$525" },
    { school: "Havens Elementary", project: "Foam blocks", amount: "$1,000" },
    { school: "Havens Elementary", project: "5th grade math materials", amount: "$300" },
    { school: "Havens Elementary", project: "Sensory tools", amount: "$300" },
    { school: "Wildwood Elementary", project: "Library maker space", amount: "$500" },
    { school: "Piedmont Middle School", project: "Spanish piñata supplies", amount: "$300" },
    { school: "Piedmont Middle School", project: "Retablo supplies", amount: "$300" },
    { school: "Piedmont Middle School", project: "Rubik's cubes", amount: "$250" },
    { school: "Piedmont Middle School", project: "Math licenses", amount: "$2,784" },
    { school: "Millennium High School", project: "Room organization materials", amount: "$800" },
    { school: "Piedmont High School", project: "Ceramics kiln funding", amount: "$2,464" },
    { school: "Piedmont High School", project: "Anatomy kits", amount: "$6,192" },
    { school: "Piedmont High School", project: "Biology exoneration lab", amount: "$1,050" },
    { school: "Piedmont High School", project: "Food safety lab", amount: "$300" },
    { school: "Piedmont High School", project: "Chemistry labs", amount: "$350" },
    { school: "Piedmont High School", project: "Glassware", amount: "$1,200" },
    { school: "Piedmont High School", project: "Physics equipment", amount: "$5,000" },
  ],
};

export const grants_2024_25 = {
  total: "$31,472",
  schools: 6,
  projects: 24,
  applications: { submitted: 32, requested: "$60,000" },
  awards: [
    {
      group: "Tri-School (Beach, Havens, Wildwood)",
      subtotal: "$3,950",
      projects: [
        "Beach TK: manipulatives, activities, experiences",
        "Beach 4th grade: sewn LED circuit project",
        "Havens kindergarten: science books + math tiles",
        "Havens: Variquest die-cut machine needles",
        "Wildwood 4th grade: art supplies",
        "Library Maker/STEAM books (3 campuses)",
      ],
    },
    {
      group: "Piedmont Middle School",
      subtotal: "$6,980",
      projects: [
        "Science: solar-powered car kits",
        "Fab Lab: computer + monitor",
        "Fab Lab: projector",
        "Music: flex-arrangement chamber music",
        "Spanish: piñata-making supplies",
        "Slime Club + Fish Keeping Club materials",
      ],
    },
    {
      group: "Piedmont & Millennium High School",
      subtotal: "$20,542",
      projects: [
        "Health Science: cardiac dissection tissue",
        "Biology: gel electrophoresis boxes + micropipettes",
        "Guitar Engineering: speaker project parts",
        "Chemistry: ECG and blood pressure sensors",
        "AP Physics C: professional development",
        "Math: graphing calculators + tools",
        "Ceramics: special glazes for Japanese tea ceremony",
        "Computer Science: Raspberry Pi parts + Arduino PD",
      ],
    },
  ],
};

export const grants_2023_24 = {
  total: "$24,677",
  totalGrants: "$20,977",
  storageNote: "+ $3,700 for engineering lab storage infrastructure",
  schools: 5,
  projects: 19,
  awards: [
    {
      group: "Tri-School (Havens, Beach, Wildwood)",
      subtotal: "$3,196",
      projects: [
        "STEAM library books",
        "Playground blocks",
        "Engineering toys",
        "Resin keychain materials",
        "LED plushie materials",
      ],
    },
    {
      group: "Piedmont Middle School",
      subtotal: "$8,855",
      projects: ["Laser cutter", "Solar car kits", "Repair tools", "Piñata materials"],
    },
    {
      group: "Piedmont & Millennium High School",
      subtotal: "$8,926",
      projects: [
        "Gel electrophoresis machines",
        "Bluetooth speaker materials",
        "Robotics supplies",
        "3D printer filament",
        "Arduino components",
        "Tutoring",
        "Library books",
        "Art supplies",
      ],
    },
  ],
};

// Roll-ups for the totals strip, computed from the year data above so they
// can't drift when a new round is added.
export const allYears = [grants_2025_26, grants_2024_25, grants_2023_24];
export const totalAwarded = formatAmountKPlus(
  allYears.reduce((sum, y) => sum + parseAmount(y.total), 0)
);
export const totalProjects = formatCountPlus(allYears.reduce((sum, y) => sum + y.projects, 0));
