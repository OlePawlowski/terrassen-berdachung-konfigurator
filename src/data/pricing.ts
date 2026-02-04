/**
 * Preis-Tabelle basierend auf Orangeline Polycarbonat Preisliste
 * Preise in Euro, exkl. MwSt.
 */

// Basispreise exkl. Dacheindeckung (Breite x Tiefe in mm)
export const BASE_PRICES: Record<number, Record<number, number>> = {
  3000: {
    2000: 682.05,
    2500: 782.05,
    3000: 882.05,
    3500: 982.05,
    4000: 1082.05,
    4500: 1182.05,
    5000: 1437.04,
  },
  4000: {
    2000: 811.19,
    2500: 911.19,
    3000: 1011.19,
    3500: 1111.19,
    4000: 1211.19,
    4500: 1311.19,
    5000: 1852.67,
  },
  5000: {
    2000: 1004.76,
    2500: 1104.76,
    3000: 1204.76,
    3500: 1304.76,
    4000: 1404.76,
    4500: 1504.76,
    5000: 2203.86,
  },
  6000: {
    2000: 1133.89,
    2500: 1233.89,
    3000: 1333.89,
    3500: 1433.89,
    4000: 1533.89,
    4500: 1633.89,
    5000: 2555.06,
  },
}

// Hilfsfunktionen: Berechnungsmaße aus frei wählbaren Bestellmaßen ableiten
// Breite wird in vollen Metern (1000 mm) nach oben gerundet,
// Tiefe in 0,5 m Schritten (500 mm) nach oben gerundet.
// Damit bleibt jede beliebige Eingabe möglich, die Preisberechnung erfolgt aber in definierten Rastermaßen.
function getBillingWidth(width: number): number {
  const minWidth = 3000
  const maxWidth = 6000
  const rounded = Math.ceil(width / 1000) * 1000
  return Math.min(maxWidth, Math.max(minWidth, rounded))
}

function getBillingDepth(depth: number): number {
  const minDepth = 2000
  const maxDepth = 5000
  const rounded = Math.ceil(depth / 500) * 500
  return Math.min(maxDepth, Math.max(minDepth, rounded))
}

// Polycarbonat klar/opal Preise (16mm, 980mm Breite)
export const POLYCARBONAT_PRICES: Record<number, Record<number, number>> = {
  3000: {
    2000: 132.0,
    2500: 165.0,
    3000: 198.0,
    3500: 231.0,
    4000: 264.0,
    4500: 297.0,
    5000: 330.0,
  },
  4000: {
    2000: 176.0,
    2500: 220.0,
    3000: 264.0,
    3500: 308.0,
    4000: 352.0,
    4500: 396.0,
    5000: 440.0,
  },
  5000: {
    2000: 220.0,
    2500: 275.0,
    3000: 330.0,
    3500: 385.0,
    4000: 440.0,
    4500: 495.0,
    5000: 550.0,
  },
  6000: {
    2000: 264.0,
    2500: 330.0,
    3000: 396.0,
    3500: 462.0,
    4000: 528.0,
    4500: 594.0,
    5000: 660.0,
  },
}

// IR-Gold Aufpreise (für REFLEX PEARL)
export const IR_GOLD_SURCHARGES: Record<number, Record<number, number>> = {
  3000: {
    2000: 42.0,
    2500: 52.5,
    3000: 63.0,
    3500: 73.5,
    4000: 84.0,
    4500: 94.5,
    5000: 105.0,
  },
  4000: {
    2000: 56.0,
    2500: 70.0,
    3000: 84.0,
    3500: 98.0,
    4000: 112.0,
    4500: 126.0,
    5000: 140.0,
  },
  5000: {
    2000: 70.0,
    2500: 87.5,
    3000: 105.0,
    3500: 122.5,
    4000: 140.0,
    4500: 157.5,
    5000: 175.0,
  },
  6000: {
    2000: 84.0,
    2500: 105.0,
    3000: 126.0,
    3500: 147.0,
    4000: 168.0,
    4500: 189.0,
    5000: 210.0,
  },
}

export function getBasePrice(width: number, depth: number): number {
  const billingWidth = getBillingWidth(width)
  const billingDepth = getBillingDepth(depth)
  return BASE_PRICES[billingWidth]?.[billingDepth] ?? 0
}

export function getPolycarbonatPrice(width: number, depth: number): number {
  const billingWidth = getBillingWidth(width)
  const billingDepth = getBillingDepth(depth)
  return POLYCARBONAT_PRICES[billingWidth]?.[billingDepth] ?? 0
}

export function getIRGoldSurcharge(width: number, depth: number): number {
  const billingWidth = getBillingWidth(width)
  const billingDepth = getBillingDepth(depth)
  return IR_GOLD_SURCHARGES[billingWidth]?.[billingDepth] ?? 0
}

// Zusatzkosten
export const ADDITIONAL_COSTS = {
  freestanding: 981.0, // Freistehende Konstruktion
  postLength3000: 90.0, // Pfostenlänge 3000 mm
  postLength3500: 180.0, // Pfostenlänge 3500 mm
  postMountingAluU3: 66.0, // Alu U-Profil Set 3 Stück
  postMountingAluU6: 132.0, // Alu U-Profil Set 6 Stück
  postMountingSteel3: 285.0, // Pfostenträger verzinkter Stahl Set 3 Stück
  postMountingSteel6: 570.0, // Pfostenträger verzinkter Stahl Set 6 Stück
  mountingSet: 105.0, // Montageset für Heimwerker
  sidePanelWedgeClear: 1010.0, // Seitenkeil mit 44.2 Glas KLAR (1 Feld)
  sidePanelWallClear: 2542.0, // Seitenwand mit 44.2 Glas KLAR (3 Felder)
  vsgClear8Fields: 1488.0, // VSG 44.2 KLAR (8 Felder)
  vsgMatt8Fields: 2117.0, // VSG 44.2 MATT (8 Felder)
  customSize: 100.0, // Maßanfertigung Zuschnitte in Breite und Tiefe
}

// Aufdach-/Unterdachmarkisen ZIP (Preise laut Tabelle „Aufdachmarkise ZIP“ / „Unterdachmarkise mit ZIP“)
// Schlüssel: Breite (mm), Wert: Record<Tiefe (mm), Preis in €>
const ROOF_AWNING_ZIP_PRICES: Record<number, Record<number, number>> = {
  3000: { 2500: 1602, 3000: 1673, 3500: 1746, 4000: 1834, 4500: 1908, 5000: 1979 },
  3500: { 2500: 1710, 3000: 1790, 3500: 1873, 4000: 1970, 4500: 2053, 5000: 2133 },
  4000: { 2500: 1810, 3000: 1900, 3500: 1991, 4000: 2097, 4500: 2189, 5000: 2278 },
  4500: { 2500: 1902, 3000: 2000, 3500: 2101, 4000: 2216, 4500: 2317, 5000: 2416 },
  5000: { 2500: 2002, 3000: 2110, 3500: 2220, 4000: 2344, 4500: 2454, 5000: 2595 },
  5500: { 2500: 2112, 3000: 2229, 3500: 2348, 4000: 2481, 4500: 2600, 5000: 2717 },
  6000: { 2500: 2229, 3000: 2355, 3500: 2483, 4000: 2626, 4500: 2754, 5000: 2879 },
}

function getAwningBillingWidth(width: number): number {
  const minWidth = 3000
  const maxWidth = 6000
  const rounded = Math.ceil(width / 500) * 500
  const clamped = Math.min(maxWidth, Math.max(minWidth, rounded))
  return (ROOF_AWNING_ZIP_PRICES[clamped] ? clamped : 6000)
}

function getAwningBillingDepth(depth: number): number {
  const steps = [2500, 3000, 3500, 4000, 4500, 5000]
  const minDepth = steps[0]
  const maxDepth = steps[steps.length - 1]
  const rounded = Math.ceil(depth / 500) * 500
  const clamped = Math.min(maxDepth, Math.max(minDepth, rounded))
  return clamped
}

export function getRoofAwningZipPrice(width: number, depth: number): number {
  const billingWidth = getAwningBillingWidth(width)
  const billingDepth = getAwningBillingDepth(depth)
  return ROOF_AWNING_ZIP_PRICES[billingWidth]?.[billingDepth] ?? 0
}

// Vereinfachte Senkrechtmarkise Front:
// Wir nutzen als Referenz die Reihe Ausfall 2500 mm und Breiten 3000 mm bzw. 5000 mm
// und interpolieren linear nach Breite.
const VERTICAL_AWNING_REF_WIDTH_MIN = 3000
const VERTICAL_AWNING_REF_WIDTH_MAX = 5000
const VERTICAL_AWNING_REF_PRICE_MIN = 1124.29 // 2500 x 3000 mm
const VERTICAL_AWNING_REF_PRICE_MAX = 1297.14 // 2500 x 5000 mm

export function getVerticalAwningFrontPrice(width: number, gutterHeight: number): number {
  // Nur sinnvoll, wenn Höhe >= 1800 mm
  if (gutterHeight < 1800) return 0

  const w = Math.min(
    VERTICAL_AWNING_REF_WIDTH_MAX,
    Math.max(VERTICAL_AWNING_REF_WIDTH_MIN, width),
  )
  const ratio =
    (w - VERTICAL_AWNING_REF_WIDTH_MIN) /
    (VERTICAL_AWNING_REF_WIDTH_MAX - VERTICAL_AWNING_REF_WIDTH_MIN)
  const price =
    VERTICAL_AWNING_REF_PRICE_MIN +
    (VERTICAL_AWNING_REF_PRICE_MAX - VERTICAL_AWNING_REF_PRICE_MIN) * ratio

  return price
}

// Frontverglasung (Aluminium Frontwand, 44.2 VSG klar, Höhe 2200/2400 mm)
const FRONT_GLASS_PRICES: Record<number, number> = {
  1000: 577,
  2000: 820,
  3000: 1076,
  4000: 1332,
  5000: 1599,
  6000: 1745,
  7000: 1965,
}

export function getFrontGlazingPrice(width: number): number {
  const steps = Object.keys(FRONT_GLASS_PRICES)
    .map((v) => parseInt(v, 10))
    .sort((a, b) => a - b)

  const minWidth = steps[0]
  const maxWidth = steps[steps.length - 1]
  const rounded = Math.ceil(width / 1000) * 1000
  const clamped = Math.min(maxWidth, Math.max(minWidth, rounded))
  return FRONT_GLASS_PRICES[clamped] ?? 0
}

// Beleuchtung: einfache Linearisierung anhand Breite
// Annahme: LED-Paket pro laufendem Meter Rinne
const LIGHTING_PRICE_PER_METER = 35 // € / m – Schätzwert basierend auf Teilepreisen

export function getLightingPrice(width: number): number {
  const minMeters = 3
  const maxMeters = 7
  const meters = Math.min(maxMeters, Math.max(minMeters, width / 1000))
  return meters * LIGHTING_PRICE_PER_METER
}