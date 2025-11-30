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

/**
 * Interpoliert den Preis für nicht-standard Größen
 */
export function getBasePrice(width: number, depth: number): number {
  // Runde auf nächste Standard-Breite
  const standardWidths = [3000, 4000, 5000, 6000]
  let lowerWidth = 3000
  let upperWidth = 6000
  
  for (let i = 0; i < standardWidths.length - 1; i++) {
    if (width >= standardWidths[i] && width <= standardWidths[i + 1]) {
      lowerWidth = standardWidths[i]
      upperWidth = standardWidths[i + 1]
      break
    }
  }
  
  if (width <= 3000) {
    lowerWidth = upperWidth = 3000
  } else if (width >= 6000) {
    lowerWidth = upperWidth = 6000
  }
  
  // Runde auf nächste Standard-Tiefe
  const standardDepths = [2000, 2500, 3000, 3500, 4000, 4500, 5000]
  let lowerDepth = 2000
  let upperDepth = 5000
  
  for (let i = 0; i < standardDepths.length - 1; i++) {
    if (depth >= standardDepths[i] && depth <= standardDepths[i + 1]) {
      lowerDepth = standardDepths[i]
      upperDepth = standardDepths[i + 1]
      break
    }
  }
  
  if (depth <= 2000) {
    lowerDepth = upperDepth = 2000
  } else if (depth >= 5000) {
    lowerDepth = upperDepth = 5000
  }
  
  // Wenn exakte Standard-Größe, direkt zurückgeben
  if (
    BASE_PRICES[lowerWidth] &&
    BASE_PRICES[lowerWidth][depth] !== undefined
  ) {
    return BASE_PRICES[lowerWidth][depth]
  }
  
  // Interpolation
  const lowerLower = BASE_PRICES[lowerWidth]?.[lowerDepth] || 0
  const lowerUpper = BASE_PRICES[lowerWidth]?.[upperDepth] || 0
  const upperLower = BASE_PRICES[upperWidth]?.[lowerDepth] || 0
  const upperUpper = BASE_PRICES[upperWidth]?.[upperDepth] || 0
  
  // Bilineare Interpolation
  const widthRatio = (width - lowerWidth) / (upperWidth - lowerWidth || 1)
  const depthRatio = (depth - lowerDepth) / (upperDepth - lowerDepth || 1)
  
  const lower = lowerLower + (lowerUpper - lowerLower) * depthRatio
  const upper = upperLower + (upperUpper - upperLower) * depthRatio
  
  return lower + (upper - lower) * widthRatio
}

export function getPolycarbonatPrice(width: number, depth: number): number {
  const standardWidths = [3000, 4000, 5000, 6000]
  let lowerWidth = 3000
  let upperWidth = 6000
  
  for (let i = 0; i < standardWidths.length - 1; i++) {
    if (width >= standardWidths[i] && width <= standardWidths[i + 1]) {
      lowerWidth = standardWidths[i]
      upperWidth = standardWidths[i + 1]
      break
    }
  }
  
  if (width <= 3000) {
    lowerWidth = upperWidth = 3000
  } else if (width >= 6000) {
    lowerWidth = upperWidth = 6000
  }
  
  const standardDepths = [2000, 2500, 3000, 3500, 4000, 4500, 5000]
  let lowerDepth = 2000
  let upperDepth = 5000
  
  for (let i = 0; i < standardDepths.length - 1; i++) {
    if (depth >= standardDepths[i] && depth <= standardDepths[i + 1]) {
      lowerDepth = standardDepths[i]
      upperDepth = standardDepths[i + 1]
      break
    }
  }
  
  if (depth <= 2000) {
    lowerDepth = upperDepth = 2000
  } else if (depth >= 5000) {
    lowerDepth = upperDepth = 5000
  }
  
  if (
    POLYCARBONAT_PRICES[lowerWidth] &&
    POLYCARBONAT_PRICES[lowerWidth][depth] !== undefined
  ) {
    return POLYCARBONAT_PRICES[lowerWidth][depth]
  }
  
  const lowerLower = POLYCARBONAT_PRICES[lowerWidth]?.[lowerDepth] || 0
  const lowerUpper = POLYCARBONAT_PRICES[lowerWidth]?.[upperDepth] || 0
  const upperLower = POLYCARBONAT_PRICES[upperWidth]?.[lowerDepth] || 0
  const upperUpper = POLYCARBONAT_PRICES[upperWidth]?.[upperDepth] || 0
  
  const widthRatio = (width - lowerWidth) / (upperWidth - lowerWidth || 1)
  const depthRatio = (depth - lowerDepth) / (upperDepth - lowerDepth || 1)
  
  const lower = lowerLower + (lowerUpper - lowerLower) * depthRatio
  const upper = upperLower + (upperUpper - upperLower) * depthRatio
  
  return lower + (upper - lower) * widthRatio
}

export function getIRGoldSurcharge(width: number, depth: number): number {
  const standardWidths = [3000, 4000, 5000, 6000]
  let lowerWidth = 3000
  let upperWidth = 6000
  
  for (let i = 0; i < standardWidths.length - 1; i++) {
    if (width >= standardWidths[i] && width <= standardWidths[i + 1]) {
      lowerWidth = standardWidths[i]
      upperWidth = standardWidths[i + 1]
      break
    }
  }
  
  if (width <= 3000) {
    lowerWidth = upperWidth = 3000
  } else if (width >= 6000) {
    lowerWidth = upperWidth = 6000
  }
  
  const standardDepths = [2000, 2500, 3000, 3500, 4000, 4500, 5000]
  let lowerDepth = 2000
  let upperDepth = 5000
  
  for (let i = 0; i < standardDepths.length - 1; i++) {
    if (depth >= standardDepths[i] && depth <= standardDepths[i + 1]) {
      lowerDepth = standardDepths[i]
      upperDepth = standardDepths[i + 1]
      break
    }
  }
  
  if (depth <= 2000) {
    lowerDepth = upperDepth = 2000
  } else if (depth >= 5000) {
    lowerDepth = upperDepth = 5000
  }
  
  if (
    IR_GOLD_SURCHARGES[lowerWidth] &&
    IR_GOLD_SURCHARGES[lowerWidth][depth] !== undefined
  ) {
    return IR_GOLD_SURCHARGES[lowerWidth][depth]
  }
  
  const lowerLower = IR_GOLD_SURCHARGES[lowerWidth]?.[lowerDepth] || 0
  const lowerUpper = IR_GOLD_SURCHARGES[lowerWidth]?.[upperDepth] || 0
  const upperLower = IR_GOLD_SURCHARGES[upperWidth]?.[lowerDepth] || 0
  const upperUpper = IR_GOLD_SURCHARGES[upperWidth]?.[upperDepth] || 0
  
  const widthRatio = (width - lowerWidth) / (upperWidth - lowerWidth || 1)
  const depthRatio = (depth - lowerDepth) / (upperDepth - lowerDepth || 1)
  
  const lower = lowerLower + (lowerUpper - lowerLower) * depthRatio
  const upper = upperLower + (upperUpper - upperLower) * depthRatio
  
  return lower + (upper - lower) * widthRatio
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

