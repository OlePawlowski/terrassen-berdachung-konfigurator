import { useMemo } from 'react'
import { Vector3 } from 'three'
import { Configuration } from '../types'

interface TerrassendachModelProps {
  config: Configuration
}

const FRAME_COLORS = {
  RAL7016st: '#383e42', // Anthrazitgrau (RAL 7016) - dunkleres Grau
  RAL9007st: '#8f8f8f', // Graualuminium (RAL 9007) - silbriges Grau
  RAL9005st: '#0a0a0a', // Schwarz (RAL 9005) - tiefes Schwarz
  RAL9010st: '#f8f8f8', // Reinweiß (RAL 9010) - helles Grau wie Wand
  RAL7035st: '#c0c0c0', // Silbergrau - helles Silbergrau
  RAL7024st: '#545454', // Mittelgrau - mittleres Grau
}

const ROOF_COLORS = {
  'polycarbonat-opal': { color: '#f0f0f0', opacity: 0.5 },
  'polycarbonat-clear': { color: '#e8f4f8', opacity: 0.15 },
  'polycarbonat-reflex-pearl': { color: '#ffd700', opacity: 0.3 },
  'vsg-clear': { color: '#e8f4f8', opacity: 0.1 },
  'vsg-matt': { color: '#d0d0d0', opacity: 0.4 },
}

function TerrassendachModel({ config }: TerrassendachModelProps) {
  const {
    mountType,
    width,
    depth,
    gutterHeight,
    roofSlope,
    frameColor,
    roofCovering,
    sidePanelLeft,
    sidePanelRight,
  } = config

  // Skalierung: mm zu Meter
  const scale = 0.001 // Three.js arbeitet in Metern

  const frameColorHex = FRAME_COLORS[frameColor]
  const roofConfig = ROOF_COLORS[roofCovering] || ROOF_COLORS['polycarbonat-clear']

  // Berechne Höhen basierend auf Durchgangshöhe und Dachneigung
  // Dachneigung: z.B. 8 Grad = ca. 13-14 cm pro Meter
  const depthInMeters = depth * scale
  const slopePerMeter = Math.tan((roofSlope * Math.PI) / 180) // Höhenunterschied pro Meter
  const heightDifference = depthInMeters * slopePerMeter
  
  const frontHeight = gutterHeight * scale + heightDifference // Höhere Seite (vorne)
  const backHeight = gutterHeight * scale // Niedrigere Seite (hinten/Rinne)

  // Bei freistehend: hintere Pfosten haben backHeight (für Gefälle), vordere frontHeight
  // Bei Wandmontage: hintere Pfosten haben backHeight (an der Wand)
  const effectiveBackHeight = backHeight

  // Berechnung der Positionen - rechtsbündig (rechte Kante bei x=0)
  const postPositions = useMemo(() => {
    const fullWidth = width * scale
    const halfDepth = (depth * scale) / 2

    if (mountType === 'freestanding') {
      // Freistehend: 4 Pfosten an den Ecken - rechtsbündig
      // Vordere Pfosten: frontHeight (höher), Hintere Pfosten: backHeight (niedriger) für Gefälle
      return [
        // Vordere Pfosten (rechts bei x=0, links bei x=-fullWidth) - höher
        new Vector3(-fullWidth, frontHeight / 2, halfDepth),
        new Vector3(0, frontHeight / 2, halfDepth),
        // Hintere Pfosten - niedriger für Gefälle
        new Vector3(-fullWidth, backHeight / 2, -halfDepth),
        new Vector3(0, backHeight / 2, -halfDepth),
      ]
    } else {
      // Wandmontage: 2 Pfosten vorne, hinten an der Wand - rechtsbündig
      return [
        // Vordere Pfosten (rechts bei x=0, links bei x=-fullWidth)
        new Vector3(-fullWidth, frontHeight / 2, halfDepth),
        new Vector3(0, frontHeight / 2, halfDepth),
        // Hintere Pfosten (an der Wand) - bündig am Haus
        new Vector3(-fullWidth, effectiveBackHeight / 2, -halfDepth - 0.15),
        new Vector3(0, effectiveBackHeight / 2, -halfDepth - 0.15),
      ]
    }
  }, [width, depth, frontHeight, effectiveBackHeight, scale, mountType])

  const postSize = 0.10 // 10cm im Durchmesser - realistischer

  // Berechnung der Sparren - rechtsbündig
  const rafters = useMemo(() => {
    const rafterCount = Math.max(5, Math.floor(width / 600)) // Alle 600mm ein Sparren
    const rafterSpacing = width / rafterCount
    const fullWidth = width * scale
    
    return Array.from({ length: rafterCount + 1 }).map((_, i) => {
      const xPos = -fullWidth + (i * rafterSpacing * scale) // Von rechts (x=0) nach links (x=-fullWidth)
      // Sparren sollten das gleiche Gefälle wie das Dach haben
      // Vorne: frontHeight (mit Gefälle), Hinten: backHeight
      const frontY = frontHeight + postSize * 0.6 // Oben auf den vorderen Hauptbalken (frontHeight = backHeight + Gefälle)
      const backY = backHeight + postSize * 0.6 // Oben auf den hinteren Hauptbalken (backHeight für Gefälle)
      const frontZ = (depth * scale) / 2
      const backZ = mountType === 'freestanding' 
        ? -(depth * scale) / 2 // Bei freistehend: auf den Pfosten
        : -(depth * scale) / 2 - 0.15 // Bei Wandmontage: bündig am Haus
      
      // Berechnung der Diagonalen für den Sparren
      const rafterLength = Math.sqrt(
        Math.pow(frontZ - backZ, 2) + Math.pow(frontY - backY, 2)
      )
      const rafterAngle = Math.atan2(frontY - backY, frontZ - backZ)
      
      return {
        xPos,
        yPos: (frontY + backY) / 2,
        zPos: (frontZ + backZ) / 2,
        length: rafterLength,
        angle: rafterAngle,
      }
    })
  }, [width, depth, frontHeight, backHeight, scale, postSize, mountType])

  // Positionierung: Rechtsbündig am Haus, wächst nur nach links
  // Die rechte Kante der Überdachung bleibt bei x = 5.0 fixiert
  // Alle Elemente werden rechtsbündig positioniert (rechte Kante bei 0, dann nach links verschoben)
  const rightEdgeFixed = 5.0 // Rechte Kante bleibt immer hier
  
  return (
    <group position={[rightEdgeFixed, 0, 0]}>
      {/* Wand - nur bei Wandmontage */}
      {mountType === 'wall' && (
        <group>
          {/* Hauptwand - minimal breiter als die Überdachung, rechtsbündig */}
          <mesh
            position={[
              -(width * scale + 0.3) / 2, // Zentriert, aber relativ zur rechten Kante bei x=0
              (effectiveBackHeight + 0.6) / 2, 
              -(depth * scale) / 2 - 0.15
            ]}
            receiveShadow
            castShadow
          >
            <boxGeometry args={[width * scale + 0.3, effectiveBackHeight + 0.6, 0.3]} />
            <meshStandardMaterial 
              color="#f8f8f8" 
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>
          
          {/* Fenster links - rechtsbündig */}
          <mesh
            position={[-(width * scale + 0.3) / 3, effectiveBackHeight * 0.6, -(depth * scale) / 2 - 0.1]}
            receiveShadow
          >
            <boxGeometry args={[0.6, 1.2, 0.05]} />
            <meshStandardMaterial color="#4a90e2" opacity={0.7} transparent />
          </mesh>
          
          {/* Fensterrahmen links */}
          <mesh
            position={[-(width * scale + 0.3) / 3, effectiveBackHeight * 0.6, -(depth * scale) / 2 - 0.08]}
          >
            <boxGeometry args={[0.65, 1.25, 0.05]} />
            <meshStandardMaterial color="#2c3e50" />
          </mesh>
          
          {/* Tür/Großes Fenster rechts */}
          <mesh
            position={[-(width * scale + 0.3) / 3 * 2, effectiveBackHeight * 0.5, -(depth * scale) / 2 - 0.1]}
            receiveShadow
          >
            <boxGeometry args={[1.2, 1.8, 0.05]} />
            <meshStandardMaterial color="#4a90e2" opacity={0.6} transparent />
          </mesh>
          
          {/* Türrahmen rechts */}
          <mesh
            position={[-(width * scale + 0.3) / 3 * 2, effectiveBackHeight * 0.5, -(depth * scale) / 2 - 0.08]}
          >
            <boxGeometry args={[1.25, 1.85, 0.05]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        </group>
      )}

      {/* Pfosten - Höhe basierend auf Dachneigung */}
      {postPositions.map((position, index) => {
        // Bestimme, ob es ein vorderer Pfosten ist
        const isFrontPost = mountType === 'freestanding' 
          ? (index === 0 || index === 1) // Bei freistehend: erste beiden sind vorne
          : (index === 0 || index === 1) // Bei Wandmontage: erste beiden sind vorne
        
        // Pfostenhöhe: 
        // Vordere Pfosten: niedrigere Seite (Rinnenseite), müssen den vorderen Hauptbalken unterstützen
        // Die Sparren liegen vorne bei frontHeight + postSize * 0.6
        // Der vordere Hauptbalken hat seine Oberseite bei frontHeight + postSize * 0.6
        // Die vorderen Pfosten müssen bis zur Oberseite reichen: backHeight + postSize * 0.6 (niedrigere Seite)
        // Hintere Pfosten: müssen höher sein, um den Sparrenwinkel zu unterstützen
        // Die Sparren liegen hinten bei backHeight + postSize * 0.6, aber die Pfosten müssen höher sein
        // Die hinteren Pfosten müssen bis zur Oberseite reichen: frontHeight + postSize * 0.6 (höhere Seite für Winkel)
        const frontRafterTop = frontHeight + postSize * 0.6 // Oberseite der vorderen Sparren
        const backRafterTop = backHeight + postSize * 0.6 // Oberseite der hinteren Sparren
        const postHeight = isFrontPost ? backRafterTop : frontRafterTop
        const postYPosition = postHeight / 2
        
        // Vordere Pfosten heller machen
        const emissiveIntensity = isFrontPost ? 0.2 : 0.1
        
        return (
          <mesh 
            key={index} 
            position={[position.x, postYPosition, position.z]} 
            castShadow
          >
            <boxGeometry args={[postSize, postHeight, postSize]} />
            <meshStandardMaterial 
              color={frameColorHex} 
              roughness={0.2}
              metalness={0.1}
              emissive={frameColorHex}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
        )
      })}

      {/* Hauptbalken vorne - direkt auf den Pfosten aufliegend, rechtsbündig, heller */}
      {/* Die Sparren liegen vorne bei frontHeight + postSize * 0.6 */}
      {/* Der vordere Hauptbalken muss dort aufliegen, also Oberseite bei backHeight + postSize * 0.6 (niedrigere Seite) */}
      {/* Mitte des Balkens = backHeight + postSize * 0.6 - (postSize * 1.2) / 2 */}
      <mesh
        position={[
          -(width * scale) / 2, // Zentriert, aber relativ zur rechten Kante bei x=0
          backHeight + postSize * 0.6 - (postSize * 1.2) / 2, // Mitte des Balkens, damit Oberseite bei backHeight + postSize * 0.6 liegt
          (depth * scale) / 2,
        ]}
        castShadow
      >
        <boxGeometry args={[width * scale + postSize, postSize * 1.2, postSize * 1.2]} />
        <meshStandardMaterial 
          color={frameColorHex}
          roughness={0.2}
          metalness={0.1}
          emissive={frameColorHex}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Hauptbalken hinten - genau dort wo die Sparren hinten enden, abhängig von Dachneigung, rechtsbündig */}
      {/* Die Sparren liegen hinten bei backHeight + postSize * 0.6, aber der Hauptbalken muss höher sein für den Winkel */}
      {/* Der hintere Hauptbalken muss höher sein, um den Sparrenwinkel zu unterstützen */}
      {/* Oberseite des hinteren Hauptbalkens = frontHeight + postSize * 0.6 (höhere Seite für Winkel) */}
      {/* Mitte des Balkens = frontHeight + postSize * 0.6 - (postSize * 1.2) / 2 */}
      <mesh
        position={[
          -(width * scale) / 2, // Zentriert, aber relativ zur rechten Kante bei x=0
          frontHeight + postSize * 0.6 - (postSize * 1.2) / 2, // Mitte des Balkens, damit Oberseite bei frontHeight + postSize * 0.6 liegt (höher für Winkel)
          mountType === 'freestanding' 
            ? -(depth * scale) / 2 // Bei freistehend: auf den Pfosten
            : -(depth * scale) / 2 - 0.15, // Bei Wandmontage: bündig am Haus
        ]}
        castShadow
      >
        <boxGeometry args={[width * scale + postSize, postSize * 1.2, postSize * 1.2]} />
        <meshStandardMaterial 
          color={frameColorHex}
          roughness={0.2}
          metalness={0.1}
          emissive={frameColorHex}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Sparren (Rafters) */}
      {rafters.map((rafter, i) => {
        // Berechne die Mitte des Sparrens
        const midY = rafter.yPos
        const midZ = rafter.zPos
        
        return (
          <mesh
            key={`rafter-${i}`}
            position={[rafter.xPos, midY, midZ]}
            rotation={[rafter.angle, 0, 0]}
            castShadow
          >
            <boxGeometry args={[postSize * 0.7, postSize * 0.9, rafter.length]} />
            <meshStandardMaterial 
              color={frameColorHex}
              roughness={0.2}
              metalness={0.1}
              emissive={frameColorHex}
              emissiveIntensity={0.1}
            />
          </mesh>
        )
      })}

      {/* Dach - liegt auf den Hauptbalken, rechtsbündig */}
      <mesh
        position={[
          -(width * scale) / 2, // Zentriert, aber relativ zur rechten Kante bei x=0
          (frontHeight + backHeight) / 2 + postSize * 1.2, // Auf den Hauptbalken liegen (Balkenhöhe + kleine Überlappung)
          mountType === 'freestanding' ? 0 : -0.075, // Bei freistehend: zentriert, bei Wandmontage: angepasst für bündige Anbringung
        ]}
        rotation={[
          Math.atan2(
            frontHeight - backHeight,
            depth * scale + (mountType === 'freestanding' ? 0 : 0.15), // Bei freistehend: ohne Versatz
          ) - Math.PI / 2, // 90 Grad nach unten kippen
          0,
          0,
        ]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[
          width * scale + postSize * 2, 
          (depth * scale + (mountType === 'freestanding' ? 0 : 0.15)) * 1.05
        ]} />
        <meshStandardMaterial
          color={roofConfig.color}
          transparent
          opacity={roofConfig.opacity}
          roughness={0.1}
          metalness={roofCovering.includes('vsg') || roofCovering === 'polycarbonat-clear' ? 0.3 : 0.1}
        />
      </mesh>

      {/* Seitenteil links (von Innen gesehen) */}
      {sidePanelLeft !== 'none' && (
        <group>
          {sidePanelLeft === 'wedge-clear' && (
            // Seitenkeil mit Glas (dreieckig, 1 Feld) - links, rechtsbündig
            <mesh
              position={[
                -width * scale - 0.05, // Links von der Überdachung
                (frontHeight + effectiveBackHeight) / 2 + postSize * 0.6,
                0,
              ]}
              rotation={[0, Math.PI / 2, 0]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[0.1, frontHeight - gutterHeight * scale, depth * scale]} />
              <meshStandardMaterial
                color="#e8f4f8"
                transparent
                opacity={0.15}
                roughness={0.1}
                metalness={0.3}
              />
            </mesh>
          )}
          {sidePanelLeft === 'wall-clear' && (
            // Seitenwand mit Glas (vollständig, 3 Felder) - links, rechtsbündig
            <mesh
              position={[
                -width * scale - 0.05, // Links von der Überdachung
                (frontHeight + effectiveBackHeight) / 2 + postSize * 0.6,
                0,
              ]}
              rotation={[0, Math.PI / 2, 0]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[0.1, frontHeight, depth * scale]} />
              <meshStandardMaterial
                color="#e8f4f8"
                transparent
                opacity={0.15}
                roughness={0.1}
                metalness={0.3}
              />
            </mesh>
          )}
        </group>
      )}

      {/* Seitenteil rechts (von Innen gesehen) */}
      {sidePanelRight !== 'none' && (
        <group>
          {sidePanelRight === 'wedge-clear' && (
            // Seitenkeil mit Glas (dreieckig, 1 Feld) - rechts, rechtsbündig
            <mesh
              position={[
                0.05, // Rechts von der Überdachung (bei x=0)
                (frontHeight + effectiveBackHeight) / 2 + postSize * 0.6,
                0,
              ]}
              rotation={[0, -Math.PI / 2, 0]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[0.1, frontHeight - gutterHeight * scale, depth * scale]} />
              <meshStandardMaterial
                color="#e8f4f8"
                transparent
                opacity={0.15}
                roughness={0.1}
                metalness={0.3}
              />
            </mesh>
          )}
          {sidePanelRight === 'wall-clear' && (
            // Seitenwand mit Glas (vollständig, 3 Felder) - rechts, rechtsbündig
            <mesh
              position={[
                0.05, // Rechts von der Überdachung (bei x=0)
                (frontHeight + effectiveBackHeight) / 2 + postSize * 0.6,
                0,
              ]}
              rotation={[0, -Math.PI / 2, 0]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[0.1, frontHeight, depth * scale]} />
              <meshStandardMaterial
                color="#e8f4f8"
                transparent
                opacity={0.15}
                roughness={0.1}
                metalness={0.3}
              />
            </mesh>
          )}
        </group>
      )}
    </group>
  )
}

export default TerrassendachModel

