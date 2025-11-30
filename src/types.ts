export interface Configuration {
  // 01. Gestellfarbe
  frameColor: 'RAL7016st' | 'RAL9007st' | 'RAL9005st' | 'RAL9010st' | 'RAL7035st' | 'RAL7024st' // Anthrazitgrau, Graualuminium, Schwarz, Reinweiß, Silbergrau, Mittelgrau
  
  // 02. Bestellmaße
  width: number // Breite in mm (Min. 1000 mm / Max. 7060 mm)
  depth: number // Tiefe in mm (Max. 3000 mm mit Glas, Max. 3500 mm mit Polycarbonat)
  
  // 03. Durchgangshöhe Rinnenseite
  gutterHeight: number // Durchgangshöhe in mm (empfohlen 2200 mm)
  
  // 04. Konstruktionsart
  mountType: 'wall' | 'freestanding' // Wandmontage oder freistehend
  
  // 05. Pfostenlänge Rinnenseite
  postLength: 2500 | 3000 | 3500 // mm
  
  // 06. Pfostenbefestigung
  postMounting: 'alu-l' | 'alu-u-3' | 'alu-u-6' | 'steel-3' | 'steel-6'
  
  // 07. Dachneigung
  roofSlope: 5 | 6 | 7 | 8 | 9 | 10 // Grad
  
  // 08. Lieferoptionen
  deliveryOption: 'with-mounting-set' | 'without-mounting-set'
  
  // 09. Dacheindeckung
  roofCovering: 'polycarbonat-opal' | 'polycarbonat-clear' | 'polycarbonat-reflex-pearl' | 'vsg-clear' | 'vsg-matt'
  
  // 10. Seitenteil links
  sidePanelLeft: 'none' | 'wedge-clear' | 'wall-clear'
  
  // 11. Seitenteil rechts
  sidePanelRight: 'none' | 'wedge-clear' | 'wall-clear'
}

export interface PriceCalculation {
  basePrice: number // Preis exkl. Dacheindeckung
  roofCoveringPrice: number // Preis für Dacheindeckung
  freestandingPrice: number // Aufpreis für freistehend
  postLengthPrice: number // Aufpreis für Pfostenlänge
  postMountingPrice: number // Aufpreis für Pfostenbefestigung
  mountingSetPrice: number // Aufpreis für Montageset
  sidePanelLeftPrice: number // Aufpreis für Seitenteil links
  sidePanelRightPrice: number // Aufpreis für Seitenteil rechts
  totalPrice: number // Gesamtpreis
}
