// Standard pharmacy categories, based on the therapeutic groups of Tanzania's National
// Essential Medicines List plus common non-medicine stock. The English name is what is stored.
export const MEDICINE_CATEGORIES = [
  ["Pain & fever", "Dawa za maumivu na homa"],
  ["Antibiotics", "Viuavijasumu"],
  ["Antimalarials", "Dawa za malaria"],
  ["HIV medicines (ARVs)", "Dawa za VVU (ARV)"],
  ["TB medicines", "Dawa za kifua kikuu"],
  ["Antifungals", "Dawa za fangasi"],
  ["Dewormers & antiparasitics", "Dawa za minyoo na vimelea"],
  ["Cough, cold & allergy", "Kikohozi, mafua na mzio"],
  ["Asthma & respiratory", "Pumu na mfumo wa hewa"],
  ["Heart & blood pressure", "Moyo na shinikizo la damu"],
  ["Diabetes", "Kisukari"],
  ["Stomach & digestion", "Tumbo na mmeng'enyo"],
  ["Vitamins & supplements", "Vitamini na virutubisho"],
  ["Skin treatments", "Dawa za ngozi"],
  ["Eye & ear drops", "Dawa za macho na masikio"],
  ["Family planning & reproductive health", "Uzazi wa mpango na afya ya uzazi"],
  ["Hormones & steroids", "Homoni na steroidi"],
  ["Mental health & epilepsy", "Afya ya akili na kifafa"],
  ["Muscle, joint & gout", "Misuli, viungo na gauti"],
  ["IV fluids & electrolytes", "Maji ya drip na elektroliti"],
  ["Vaccines", "Chanjo"],
  ["Mother & baby care", "Huduma ya mama na mtoto"],
  ["Medical supplies", "Vifaa tiba"],
  ["Personal care & cosmetics", "Usafi na vipodozi"],
  ["Herbal medicines", "Dawa za asili"],
  ["Other", "Nyingine"],
] as const;

const STANDARD = new Map(MEDICINE_CATEGORIES.map(([en, sw]) => [en.toLowerCase(), { en, sw }]));

export function categoryLabel(category: string, lang: "en" | "sw") {
  const standard = STANDARD.get(category.trim().toLowerCase());
  return standard ? standard[lang] : category;
}

// Standard categories first, then any custom ones already used on products.
export function categoryOptions(used: string[]) {
  const custom = [
    ...new Set(
      used
        .map((value) => value.trim())
        .filter((value) => value && !STANDARD.has(value.toLowerCase())),
    ),
  ].sort((a, b) => a.localeCompare(b));
  return [...MEDICINE_CATEGORIES.map(([en]) => en as string), ...custom];
}

// Maps "antibiotics" or the Swahili name to the stored English name; unknown text is kept as typed.
export function canonicalCategory(value: string) {
  const wanted = value.trim().toLowerCase();
  const match = MEDICINE_CATEGORIES.find(
    ([en, sw]) => en.toLowerCase() === wanted || sw.toLowerCase() === wanted,
  );
  return match ? match[0] : value.trim();
}
