// Community quotes for the VoicesBand on the home page. With one entry the
// band renders a centered pull-quote; with 2+ it switches to a 3-column
// grid. Only real quotes from real people — no placeholders.

export interface Voice {
  quote: string;
  name: string;
  role: string;
  accentColor: "red" | "cyan" | "purple";
}

export const voices: Voice[] = [
  {
    quote: "Piedmont Makers is what makes this community special.",
    name: "Roy",
    role: "father of 3",
    accentColor: "red",
  },
];
