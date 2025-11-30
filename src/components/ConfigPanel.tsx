import { useMemo } from 'react'
import { Configuration, PriceCalculation } from '../types'
import {
  getBasePrice,
  getPolycarbonatPrice,
  getIRGoldSurcharge,
  ADDITIONAL_COSTS,
} from '../data/pricing'
import './ConfigPanel.css'

interface ConfigPanelProps {
  config: Configuration
  onConfigChange: (config: Configuration) => void
}

function calculatePrice(config: Configuration): PriceCalculation {
  // Basispreis exkl. Dacheindeckung
  const basePrice = getBasePrice(config.width, config.depth)
  
  // Dacheindeckung Preis
  let roofCoveringPrice = 0
  if (config.roofCovering === 'polycarbonat-opal' || config.roofCovering === 'polycarbonat-clear') {
    roofCoveringPrice = getPolycarbonatPrice(config.width, config.depth)
  } else if (config.roofCovering === 'polycarbonat-reflex-pearl') {
    roofCoveringPrice = getPolycarbonatPrice(config.width, config.depth) + getIRGoldSurcharge(config.width, config.depth)
  } else if (config.roofCovering === 'vsg-clear') {
    roofCoveringPrice = ADDITIONAL_COSTS.vsgClear8Fields
  } else if (config.roofCovering === 'vsg-matt') {
    roofCoveringPrice = ADDITIONAL_COSTS.vsgMatt8Fields
  }
  
  // Freistehend Aufpreis
  const freestandingPrice = config.mountType === 'freestanding' ? ADDITIONAL_COSTS.freestanding : 0
  
  // Pfostenlänge Aufpreis
  let postLengthPrice = 0
  if (config.postLength === 3000) {
    postLengthPrice = ADDITIONAL_COSTS.postLength3000
  } else if (config.postLength === 3500) {
    postLengthPrice = ADDITIONAL_COSTS.postLength3500
  }
  
  // Pfostenbefestigung Aufpreis
  let postMountingPrice = 0
  if (config.postMounting === 'alu-u-3') {
    postMountingPrice = ADDITIONAL_COSTS.postMountingAluU3
  } else if (config.postMounting === 'alu-u-6') {
    postMountingPrice = ADDITIONAL_COSTS.postMountingAluU6
  } else if (config.postMounting === 'steel-3') {
    postMountingPrice = ADDITIONAL_COSTS.postMountingSteel3
  } else if (config.postMounting === 'steel-6') {
    postMountingPrice = ADDITIONAL_COSTS.postMountingSteel6
  }
  
  // Montageset Aufpreis
  const mountingSetPrice = config.deliveryOption === 'with-mounting-set' ? ADDITIONAL_COSTS.mountingSet : 0
  
  // Seitenteil links Aufpreis
  let sidePanelLeftPrice = 0
  if (config.sidePanelLeft === 'wedge-clear') {
    sidePanelLeftPrice = ADDITIONAL_COSTS.sidePanelWedgeClear
  } else if (config.sidePanelLeft === 'wall-clear') {
    sidePanelLeftPrice = ADDITIONAL_COSTS.sidePanelWallClear
  }
  
  // Seitenteil rechts Aufpreis
  let sidePanelRightPrice = 0
  if (config.sidePanelRight === 'wedge-clear') {
    sidePanelRightPrice = ADDITIONAL_COSTS.sidePanelWedgeClear
  } else if (config.sidePanelRight === 'wall-clear') {
    sidePanelRightPrice = ADDITIONAL_COSTS.sidePanelWallClear
  }
  
  // Maßanfertigung Aufpreis (wenn nicht Standard-Maß)
  const standardWidths = [3000, 4000, 5000, 6000]
  const standardDepths = [2000, 2500, 3000, 3500, 4000, 4500, 5000]
  const isCustomSize = !standardWidths.includes(config.width) || !standardDepths.includes(config.depth)
  const customSizePrice = isCustomSize ? ADDITIONAL_COSTS.customSize : 0
  
  const totalPrice = basePrice + 
    roofCoveringPrice + 
    freestandingPrice + 
    postLengthPrice + 
    postMountingPrice + 
    mountingSetPrice + 
    sidePanelLeftPrice + 
    sidePanelRightPrice +
    customSizePrice
  
  return {
    basePrice,
    roofCoveringPrice,
    freestandingPrice,
    postLengthPrice,
    postMountingPrice,
    mountingSetPrice,
    sidePanelLeftPrice,
    sidePanelRightPrice,
    totalPrice: Math.round(totalPrice * 100) / 100,
  }
}

function ConfigPanel({ config, onConfigChange }: ConfigPanelProps) {
  const price = useMemo(() => calculatePrice(config), [config])

  const updateConfig = (updates: Partial<Configuration>) => {
    onConfigChange({ ...config, ...updates })
  }
  
  // Berechne maximale Tiefe basierend auf Dacheindeckung
  const maxDepth = config.roofCovering === 'vsg-clear' || config.roofCovering === 'vsg-matt' 
    ? 3000 
    : config.roofCovering === 'polycarbonat-reflex-pearl' || config.roofCovering === 'polycarbonat-opal' || config.roofCovering === 'polycarbonat-clear'
    ? 3500
    : 3000

  return (
    <div className="config-panel">
      <div className="config-section">
        <h2>Konfiguration</h2>
        
        {/* 01. Gestellfarbe */}
        <div className="config-group">
          <label>
            01. Gestellfarbe
            <select
              value={config.frameColor}
              onChange={(e) =>
                updateConfig({
                  frameColor: e.target.value as Configuration['frameColor'],
                })
              }
            >
              <option value="RAL7016st">RAL 7016st (Anthrazitgrau mit Feinstruktur) - Bestseller</option>
              <option value="RAL9007st">RAL 9007st (Graualuminium mit Feinstruktur)</option>
              <option value="RAL9005st">RAL 9005st (Schwarz mit Feinstruktur)</option>
              <option value="RAL9010st">RAL 9010st (Reinweiß mit Feinstruktur) - wie Wand</option>
              <option value="RAL7035st">RAL 7035st (Silbergrau mit Feinstruktur) - #c0c0c0</option>
              <option value="RAL7024st">RAL 7024st (Mittelgrau mit Feinstruktur) - #545454</option>
            </select>
          </label>
        </div>

        {/* 02. Bestellmaße */}
        <div className="config-group">
          <label>
            02. Breite (mm)
            <input
              type="number"
              min="1000"
              max="7060"
              step="10"
              value={config.width}
              onChange={(e) => {
                const width = parseInt(e.target.value) || 1000
                updateConfig({ width: Math.max(1000, Math.min(7060, width)) })
              }}
            />
          </label>
          <span className="config-value">{config.width.toLocaleString('de-DE')} mm</span>
          <span className="config-hint">Standardmaße: 3060, 4060, 5060, 6060 mm</span>
        </div>

        <div className="config-group">
          <label>
            02. Tiefe (mm)
            <input
              type="number"
              min="1000"
              max={maxDepth}
              step="50"
              value={config.depth}
              onChange={(e) => {
                const depth = parseInt(e.target.value) || 1000
                updateConfig({ depth: Math.max(1000, Math.min(maxDepth, depth)) })
              }}
            />
          </label>
          <span className="config-value">{config.depth.toLocaleString('de-DE')} mm</span>
          <span className="config-hint">
            Max. {maxDepth} mm mit {config.roofCovering.includes('vsg') ? 'Glas' : 'Polycarbonat'}
          </span>
        </div>

        {/* 03. Durchgangshöhe Rinnenseite */}
        <div className="config-group">
          <label>
            03. Durchgangshöhe Rinnenseite (mm)
            <input
              type="number"
              min="2000"
              max="3000"
              step="50"
              value={config.gutterHeight}
              onChange={(e) =>
                updateConfig({ gutterHeight: parseInt(e.target.value) || 2200 })
              }
            />
          </label>
          <span className="config-value">{config.gutterHeight.toLocaleString('de-DE')} mm</span>
          <span className="config-hint">Empfehlung: 2200 mm</span>
        </div>

        {/* 04. Konstruktionsart */}
        <div className="config-group">
          <label>
            04. Konstruktionsart
            <select
              value={config.mountType}
              onChange={(e) =>
                updateConfig({
                  mountType: e.target.value as Configuration['mountType'],
                })
              }
            >
              <option value="wall">Terrassendach für Wandmontage</option>
              <option value="freestanding">
                Terrassendach als freistehende Konstruktion (+€981,00)
              </option>
            </select>
          </label>
        </div>

        {/* 05. Pfostenlänge Rinnenseite */}
        <div className="config-group">
          <label>
            05. Pfostenlänge Rinnenseite
            <select
              value={config.postLength}
              onChange={(e) =>
                updateConfig({
                  postLength: parseInt(e.target.value) as Configuration['postLength'],
                })
              }
            >
              <option value={2500}>2500 mm (3 Stück 111x111 mm)</option>
              <option value={3000}>3000 mm (3 Stück 111x111 mm) (+€90,00)</option>
              <option value={3500}>3500 mm (3 Stück 111x111 mm) (+€180,00)</option>
            </select>
          </label>
        </div>

        {/* 06. Pfostenbefestigung */}
        <div className="config-group">
          <label>
            06. Pfostenbefestigung
            <select
              value={config.postMounting}
              onChange={(e) =>
                updateConfig({
                  postMounting: e.target.value as Configuration['postMounting'],
                })
              }
            >
              <option value="alu-l">Alu L-Profil (inklusive)</option>
              <option value="alu-u-3">Alu U-Profil (Set 3 Stück) (+€66,00)</option>
              <option value="alu-u-6">Alu U-Profil (Set 6 Stück) (+€132,00)</option>
              <option value="steel-3">Pfostenträger verzinkter Stahl (Set 3 Stück) (+€285,00)</option>
              <option value="steel-6">Pfostenträger verzinkter Stahl (Set 6 Stück) (+€570,00)</option>
            </select>
          </label>
        </div>

        {/* 07. Dachneigung */}
        <div className="config-group">
          <label>
            07. Dachneigung
            <select
              value={config.roofSlope}
              onChange={(e) =>
                updateConfig({
                  roofSlope: parseInt(e.target.value) as Configuration['roofSlope'],
                })
              }
            >
              <option value={5}>5 Grad - Gefälle ca. 10 cm pro Meter</option>
              <option value={6}>6 Grad - Gefälle ca. 11 cm pro Meter</option>
              <option value={7}>7 Grad - Gefälle ca. 12 cm pro Meter</option>
              <option value={8}>8 Grad - Gefälle ca. 13-14 cm pro Meter (Empfehlung bei Polycarbonat)</option>
              <option value={9}>9 Grad - Gefälle ca. 15-16 cm pro Meter</option>
              <option value={10}>10 Grad - Gefälle ca. 17-18 cm pro Meter</option>
            </select>
          </label>
        </div>

        {/* 08. Lieferoptionen */}
        <div className="config-group">
          <label>
            08. Lieferoptionen
            <select
              value={config.deliveryOption}
              onChange={(e) =>
                updateConfig({
                  deliveryOption: e.target.value as Configuration['deliveryOption'],
                })
              }
            >
              <option value="without-mounting-set">Lieferung als Bausatzpaket OHNE Montageset</option>
              <option value="with-mounting-set">
                Lieferung als Bausatzpaket INKL. Montageset für Heimwerker (+€105,00)
              </option>
            </select>
          </label>
        </div>

        {/* 09. Dacheindeckung */}
        <div className="config-group">
          <label>
            09. Dacheindeckung
            <select
              value={config.roofCovering}
              onChange={(e) => {
                const newRoofCovering = e.target.value as Configuration['roofCovering']
                updateConfig({ roofCovering: newRoofCovering })
                // Max-Tiefe anpassen
                if (newRoofCovering.includes('vsg') && config.depth > 3000) {
                  updateConfig({ depth: 3000 })
                } else if (newRoofCovering.includes('polycarbonat') && config.depth > 3500) {
                  updateConfig({ depth: Math.min(config.depth, 3500) })
                }
              }}
            >
              <option value="polycarbonat-opal">16mm Polycarbonat OPAL - Platte mit X-Struktur (milchig)</option>
              <option value="polycarbonat-clear">16mm Polycarbonat KLAR - Platte mit X-Struktur (optimale Lichtdurchlässigkeit)</option>
              <option value="polycarbonat-reflex-pearl">16mm Polycarbonat REFLEX PEARL (Heatblock) - schlagfest und hitzeabweisend (+Aufpreis)</option>
              <option value="vsg-clear">VSG 44.2 KLAR (Verbundsicherheitsglas, 8 Felder) (+€1.488,00)</option>
              <option value="vsg-matt">VSG 44.2 MATT (Verbundsicherheitsglas, 8 Felder) (+€2.117,00)</option>
            </select>
          </label>
        </div>

        {/* 10. Seitenteil links */}
        <div className="config-group">
          <label>
            10. Seitenteil links (von Innen gesehen)
            <select
              value={config.sidePanelLeft}
              onChange={(e) =>
                updateConfig({
                  sidePanelLeft: e.target.value as Configuration['sidePanelLeft'],
                })
              }
            >
              <option value="none">Ohne Seitenteil</option>
              <option value="wedge-clear">Seitenkeil mit 44.2 Glas KLAR (FW300, 1 Feld) (+€1.010,00)</option>
              <option value="wall-clear">Seitenwand mit 44.2 Glas KLAR (FW300, 3 Felder) (+€2.542,00)</option>
            </select>
          </label>
        </div>

        {/* 11. Seitenteil rechts */}
        <div className="config-group">
          <label>
            11. Seitenteil rechts (von Innen gesehen)
            <select
              value={config.sidePanelRight}
              onChange={(e) =>
                updateConfig({
                  sidePanelRight: e.target.value as Configuration['sidePanelRight'],
                })
              }
            >
              <option value="none">Ohne Seitenteil</option>
              <option value="wedge-clear">Seitenkeil mit 44.2 Glas KLAR (FW300, 1 Feld) (+€1.010,00)</option>
              <option value="wall-clear">Seitenwand mit 44.2 Glas KLAR (FW300, 3 Felder) (+€2.542,00)</option>
            </select>
          </label>
        </div>
      </div>

      <div className="price-section">
        <h2>Preisberechnung</h2>
        <div className="price-details">
          <div className="price-row">
            <span>Preis exkl. Dacheindeckung:</span>
            <span>{price.basePrice.toFixed(2)} €</span>
          </div>
          {price.roofCoveringPrice > 0 && (
            <div className="price-row">
              <span>Dacheindeckung:</span>
              <span>+{price.roofCoveringPrice.toFixed(2)} €</span>
            </div>
          )}
          {price.freestandingPrice > 0 && (
            <div className="price-row">
              <span>Freistehende Konstruktion:</span>
              <span>+{price.freestandingPrice.toFixed(2)} €</span>
            </div>
          )}
          {price.postLengthPrice > 0 && (
            <div className="price-row">
              <span>Pfostenlänge {config.postLength}mm:</span>
              <span>+{price.postLengthPrice.toFixed(2)} €</span>
            </div>
          )}
          {price.postMountingPrice > 0 && (
            <div className="price-row">
              <span>Pfostenbefestigung:</span>
              <span>+{price.postMountingPrice.toFixed(2)} €</span>
            </div>
          )}
          {price.mountingSetPrice > 0 && (
            <div className="price-row">
              <span>Montageset:</span>
              <span>+{price.mountingSetPrice.toFixed(2)} €</span>
            </div>
          )}
          {price.sidePanelLeftPrice > 0 && (
            <div className="price-row">
              <span>Seitenteil links:</span>
              <span>+{price.sidePanelLeftPrice.toFixed(2)} €</span>
            </div>
          )}
          {price.sidePanelRightPrice > 0 && (
            <div className="price-row">
              <span>Seitenteil rechts:</span>
              <span>+{price.sidePanelRightPrice.toFixed(2)} €</span>
            </div>
          )}
          <div className="price-total">
            <span>Gesamtpreis:</span>
            <span className="total-amount">{price.totalPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
          </div>
        </div>
        
        <div className="specs">
          <h3>Spezifikationen</h3>
          <div className="spec-item">
            <span>Fläche:</span>
            <span>{((config.width * config.depth) / 1000000).toFixed(2)} m²</span>
          </div>
          <div className="spec-item">
            <span>Dachneigung:</span>
            <span>{config.roofSlope}°</span>
          </div>
          <div className="spec-item">
            <span>Konstruktionsart:</span>
            <span>{config.mountType === 'wall' ? 'Wandmontage' : 'Freistehend'}</span>
          </div>
          <div className="spec-item">
            <span>Gestellfarbe:</span>
            <span>
              {config.frameColor === 'RAL7016st' && 'RAL 7016st (Anthrazitgrau)'}
              {config.frameColor === 'RAL9007st' && 'RAL 9007st (Graualuminium)'}
              {config.frameColor === 'RAL9005st' && 'RAL 9005st (Schwarz)'}
              {config.frameColor === 'RAL9010st' && 'RAL 9010st (Reinweiß - wie Wand)'}
              {config.frameColor === 'RAL7035st' && 'RAL 7035st (Silbergrau - #c0c0c0)'}
              {config.frameColor === 'RAL7024st' && 'RAL 7024st (Mittelgrau - #545454)'}
            </span>
          </div>
        </div>

        <button className="cta-button">In den Warenkorb</button>
      </div>
    </div>
  )
}

export default ConfigPanel
