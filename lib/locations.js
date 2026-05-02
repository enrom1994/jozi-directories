// lib/locations.js
// Curated list of Johannesburg areas used in the Admin scrape panel.
//
// IMPORTANT: values must EXACTLY match the 'location' column in the Scrape Queue
// Google Sheet so Code – Find Row (Webhook) can mark queue rows as done.
// Sheet format: "{Area} Johannesburg Gauteng South Africa"
//
// If you scrape a location NOT in the sheet it still works (data → GitHub)
// but the queue row won't be marked done and will be re-scraped by the manual trigger.

export const LOCATIONS = [
  // === NORTH ===
  { group: 'North',   label: 'Sandton',          value: 'Sandton Johannesburg Gauteng South Africa' },
  { group: 'North',   label: 'Randburg',          value: 'Randburg Johannesburg Gauteng South Africa' },
  { group: 'North',   label: 'Fourways',          value: 'Fourways Johannesburg Gauteng South Africa' },
  { group: 'North',   label: 'Midrand',           value: 'Midrand Johannesburg Gauteng South Africa' },
  { group: 'North',   label: 'Bryanston',         value: 'Bryanston Johannesburg Gauteng South Africa' },
  { group: 'North',   label: 'Sunninghill',       value: 'Sunninghill Johannesburg Gauteng South Africa' },
  { group: 'North',   label: 'Douglasdale',       value: 'Douglasdale Johannesburg Gauteng South Africa' },
  { group: 'North',   label: 'Northriding',       value: 'Northriding Johannesburg Gauteng South Africa' },
  { group: 'North',   label: 'Kyalami',           value: 'Kyalami Johannesburg Gauteng South Africa' },
  { group: 'North',   label: 'Centurion',         value: 'Centurion Johannesburg Gauteng South Africa' },
  { group: 'North',   label: 'Diepsloot',         value: 'Diepsloot Johannesburg Gauteng South Africa' },

  // === EAST ===
  { group: 'East',    label: 'Boksburg',          value: 'Boksburg Johannesburg Gauteng South Africa' },
  { group: 'East',    label: 'Germiston',         value: 'Germiston Johannesburg Gauteng South Africa' },
  { group: 'East',    label: 'Benoni',            value: 'Benoni Johannesburg Gauteng South Africa' },
  { group: 'East',    label: 'Brakpan',           value: 'Brakpan Johannesburg Gauteng South Africa' },
  { group: 'East',    label: 'Springs',           value: 'Springs Johannesburg Gauteng South Africa' },
  { group: 'East',    label: 'Edenvale',          value: 'Edenvale Johannesburg Gauteng South Africa' },
  { group: 'East',    label: 'Kempton Park',      value: 'Kempton Park Johannesburg Gauteng South Africa' },
  { group: 'East',    label: 'Bedfordview',       value: 'Bedfordview Johannesburg Gauteng South Africa' },
  { group: 'East',    label: 'Alberton',          value: 'Alberton Johannesburg Gauteng South Africa' },
  { group: 'East',    label: 'Tembisa',           value: 'Tembisa Johannesburg Gauteng South Africa' },
  { group: 'East',    label: 'Katlehong',         value: 'Katlehong Johannesburg Gauteng South Africa' },
  { group: 'East',    label: 'Vosloorus',         value: 'Vosloorus Johannesburg Gauteng South Africa' },

  // === WEST ===
  { group: 'West',    label: 'Krugersdorp',       value: 'Krugersdorp Johannesburg Gauteng South Africa' },
  { group: 'West',    label: 'Roodepoort',        value: 'Roodepoort Johannesburg Gauteng South Africa' },
  { group: 'West',    label: 'Florida',           value: 'Florida Johannesburg Gauteng South Africa' },
  { group: 'West',    label: 'Lenasia',           value: 'Lenasia Johannesburg Gauteng South Africa' },

  // === SOUTH ===
  { group: 'South',   label: 'Soweto',            value: 'Soweto Johannesburg Gauteng South Africa' },
  { group: 'South',   label: 'Meyersdal',         value: 'Meyersdal Johannesburg Gauteng South Africa' },
  { group: 'South',   label: 'Meyerton',          value: 'Meyerton Johannesburg Gauteng South Africa' },
  { group: 'South',   label: 'Ennerdale',         value: 'Ennerdale Johannesburg Gauteng South Africa' },
  { group: 'South',   label: 'Orange Farm',       value: 'Orange Farm Johannesburg Gauteng South Africa' },

  // === CENTRAL ===
  { group: 'Central', label: 'Johannesburg CBD',  value: 'Johannesburg CBD Gauteng South Africa' },
  { group: 'Central', label: 'Braamfontein',      value: 'Braamfontein Johannesburg Gauteng South Africa' },
  { group: 'Central', label: 'Newtown',           value: 'Newtown Johannesburg Gauteng South Africa' },
  { group: 'Central', label: 'Melville',          value: 'Melville Johannesburg Gauteng South Africa' },
  { group: 'Central', label: 'Auckland Park',     value: 'Auckland Park Johannesburg Gauteng South Africa' },
  { group: 'Central', label: 'Parktown',          value: 'Parktown Johannesburg Gauteng South Africa' },
  { group: 'Central', label: 'Alexandra',         value: 'Alexandra Johannesburg Gauteng South Africa' },
]

// Group labels in display order
export const LOCATION_GROUPS = ['North', 'East', 'West', 'South', 'Central']
