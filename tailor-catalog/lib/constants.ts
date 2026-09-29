// Central place for filter option lists shown in the admin form and
// the customer-facing filter sidebar. Edit these lists to add new
// options — no schema change required, since these are plain text
// columns in the database.

export const FABRICS = [
  "Cotton",
  "Silk",
  "Georgette",
  "Chiffon",
  "Velvet",
  "Net",
  "Crepe",
  "Linen",
  "Satin",
];

export const NECK_TYPES = [
  "Boat Neck",
  "Round Neck",
  "V Neck",
  "Halter Neck",
  "Sweetheart Neck",
  "High Neck",
  "Square Neck",
  "Collar Neck",
];

export const SLEEVE_TYPES = [
  "Sleeveless",
  "Cap Sleeve",
  "Short Sleeve",
  "Elbow Sleeve",
  "Full Sleeve",
  "Bell Sleeve",
  "Puff Sleeve",
];

export const OCCASIONS = [
  "Casual",
  "Office Wear",
  "Party Wear",
  "Bridal",
  "Festive",
  "Wedding Guest",
];

export const WORK_TYPES = [
  "Plain",
  "Embroidery",
  "Maggam Work",
  "Mirror Work",
  "Zari Work",
  "Sequin Work",
  "Applique",
];

export const COLORS = [
  "Red",
  "Maroon",
  "Green",
  "Blue",
  "Black",
  "White",
  "Yellow",
  "Pink",
  "Orange",
  "Purple",
  "Gold",
  "Multicolor",
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
] as const;
