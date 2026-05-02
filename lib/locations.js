// lib/locations.js
// Curated list of Johannesburg areas used in the Admin scrape panel.
// Format: { label: display name, value: search string sent to SerpAPI }
// Value needs to be specific enough for Google Maps to resolve correctly.

export const LOCATIONS = [
  // === NORTH ===
  { group: 'North',  label: 'Sandton',            value: 'Sandton Johannesburg' },
  { group: 'North',  label: 'Randburg',            value: 'Randburg Johannesburg' },
  { group: 'North',  label: 'Fourways',            value: 'Fourways Johannesburg' },
  { group: 'North',  label: 'Midrand',             value: 'Midrand Johannesburg' },
  { group: 'North',  label: 'Bryanston',           value: 'Bryanston Johannesburg' },
  { group: 'North',  label: 'Sunninghill',         value: 'Sunninghill Johannesburg' },
  { group: 'North',  label: 'Douglasdale',         value: 'Douglasdale Johannesburg' },
  { group: 'North',  label: 'Northriding',         value: 'Northriding Johannesburg' },
  { group: 'North',  label: 'Kyalami',             value: 'Kyalami Johannesburg' },
  { group: 'North',  label: 'Diepsloot',           value: 'Diepsloot Johannesburg' },

  // === EAST ===
  { group: 'East',   label: 'Boksburg',            value: 'Boksburg Johannesburg' },
  { group: 'East',   label: 'Germiston',           value: 'Germiston Johannesburg' },
  { group: 'East',   label: 'Benoni',              value: 'Benoni Johannesburg' },
  { group: 'East',   label: 'Brakpan',             value: 'Brakpan Johannesburg' },
  { group: 'East',   label: 'Springs',             value: 'Springs Johannesburg' },
  { group: 'East',   label: 'Edenvale',            value: 'Edenvale Johannesburg' },
  { group: 'East',   label: 'Kempton Park',        value: 'Kempton Park Johannesburg' },
  { group: 'East',   label: 'Bedfordview',         value: 'Bedfordview Johannesburg' },
  { group: 'East',   label: 'Alberton',            value: 'Alberton Johannesburg' },
  { group: 'East',   label: 'Tembisa',             value: 'Tembisa Johannesburg' },
  { group: 'East',   label: 'Katlehong',           value: 'Katlehong Johannesburg' },
  { group: 'East',   label: 'Vosloorus',           value: 'Vosloorus Johannesburg' },

  // === WEST ===
  { group: 'West',   label: 'Krugersdorp',         value: 'Krugersdorp Johannesburg' },
  { group: 'West',   label: 'Roodepoort',          value: 'Roodepoort Johannesburg' },
  { group: 'West',   label: 'Florida',             value: 'Florida Johannesburg' },
  { group: 'West',   label: 'Westrand',            value: 'West Rand Johannesburg' },
  { group: 'West',   label: 'Lenasia',             value: 'Lenasia Johannesburg' },

  // === SOUTH ===
  { group: 'South',  label: 'Soweto',              value: 'Soweto Johannesburg' },
  { group: 'South',  label: 'Meyersdal',           value: 'Meyersdal Johannesburg' },
  { group: 'South',  label: 'Meyerton',            value: 'Meyerton Johannesburg' },
  { group: 'South',  label: 'Ennerdale',           value: 'Ennerdale Johannesburg' },

  // === CENTRAL ===
  { group: 'Central', label: 'Johannesburg CBD',   value: 'Johannesburg CBD' },
  { group: 'Central', label: 'Braamfontein',       value: 'Braamfontein Johannesburg' },
  { group: 'Central', label: 'Newtown',            value: 'Newtown Johannesburg' },
  { group: 'Central', label: 'Melville',           value: 'Melville Johannesburg' },
  { group: 'Central', label: 'Auckland Park',      value: 'Auckland Park Johannesburg' },
  { group: 'Central', label: 'Parktown',           value: 'Parktown Johannesburg' },
  { group: 'Central', label: 'Alexandra',          value: 'Alexandra Johannesburg' },
  { group: 'Central', label: 'Orange Farm',        value: 'Orange Farm Johannesburg' },
]

// Group labels in display order
export const LOCATION_GROUPS = ['North', 'East', 'West', 'South', 'Central']
