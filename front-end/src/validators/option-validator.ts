// bg-blue-950 border-blue-950
// bg-zinc-900 border-zinc-900
// bg-rose-950 border-rose-950

import { PRODUCT_PRICES } from "@/config/products";

export const COLORS = [
  { label: "Black", value: "black", tw: "zinc-900" },
  {
    label: "Blue",
    value: "blue",
    tw: "blue-950",
  },
  { label: "Rose", value: "rose", tw: "rose-950" },
] as const;

export const CITIES = {
  name: "cities",
  options: [
    {
      label: "New York",
      value: "66339c6df634f963321faaa5",
    },
    {
      label: "Los Angeles",
      value: "66339c6df634f963321faaa6",
    },
    {
      label: "California",
      value: "66339c6df634f963321faaa7",
    },
    {
      label: "Chicago",
      value: "66339c6df634f963321faaa8",
    },
    {
      label: "Toronto",
      value: "66339c6df634f963321faaa9",
    },
    {
      label: "Sibi",
      value: "66339c6df634f963321faaa0",
    },
  ],
} as const;

export const PAYMENT_OPTIONS = {
  name: "payment_options",
  options: [
    {
      label: "Cash",
      value: "Cash",
    },
    {
      label: "Credit Card",
      value: "Credit Card",
    },
  ],
} as const;

export const MATERIALS = {
  name: "material",
  options: [
    {
      label: "Silicone",
      value: "silicone",
      description: undefined,
      price: PRODUCT_PRICES.material.silicone,
    },
    {
      label: "Soft Polycarbonate",
      value: "polycarbonate",
      description: "Scratch-resistant coating",
      price: PRODUCT_PRICES.material.polycarbonate,
    },
  ],
} as const;

export const FINISHES = {
  name: "finish",
  options: [
    {
      label: "Smooth Finish",
      value: "smooth",
      description: undefined,
      price: PRODUCT_PRICES.finish.smooth,
    },
    {
      label: "Textured Finish",
      value: "textured",
      description: "Soft grippy texture",
      price: PRODUCT_PRICES.finish.textured,
    },
  ],
} as const;
