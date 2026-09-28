export const galleryPhotos = Array.from({ length: 7 }, (_, index) => ({
  id: `gallery-ls-${index + 1}`,
  src: `/images/gallery/gallery-ls-${index + 1}.png`,
  alt: `Rizki Ramadhan gallery photo ${index + 1}`,
  position: "center center",
}));

export const galleryFilterOptions = [
  { id: "none", label: "None", filter: "none" },
  {
    id: "natural",
    label: "Natural",
    filter: "saturate(1.03) contrast(1.02) brightness(1.01)",
  },
  {
    id: "warm",
    label: "Warm",
    filter: "sepia(0.16) saturate(1.18) hue-rotate(-8deg) brightness(1.02)",
  },
  {
    id: "cool",
    label: "Cool",
    filter: "saturate(0.95) hue-rotate(14deg) brightness(1.02) contrast(1.02)",
  },
  {
    id: "vivid",
    label: "Vivid",
    filter: "saturate(1.5) contrast(1.14) brightness(1.02)",
  },
  {
    id: "soft",
    label: "Soft",
    filter: "saturate(0.88) contrast(0.9) brightness(1.08)",
  },
  {
    id: "vintage",
    label: "Vintage",
    filter: "sepia(0.38) saturate(0.78) contrast(0.96) brightness(0.96)",
  },
  {
    id: "mono",
    label: "Mono",
    filter: "grayscale(1) contrast(1.08) brightness(0.98)",
  },
  {
    id: "color-pop",
    label: "Color Pop",
    filter: "saturate(1.8) contrast(1.2) brightness(1.01)",
  },
  {
    id: "duotone",
    label: "Duo Tone",
    filter: "grayscale(0.45) sepia(0.62) saturate(1.55) hue-rotate(165deg) contrast(1.1)",
  },
];
