import { useMemo } from 'react'
import { Vector3, Shape } from 'three'
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

  // Berechnung der Positionen - rechtsbündig (rechte Kante bei x=0), hinten fixiert, nur nach vorne wachsend
  // Verschiebung nach hinten: zOffset
  const zOffset = -1.45 // Verschiebung nach hinten
  const postPositions = useMemo(() => {
    const fullWidth = width * scale
    const fullDepth = depth * scale

    if (mountType === 'freestanding') {
      // Freistehend: 4 Pfosten an den Ecken - rechtsbündig
      // Vordere Pfosten: frontHeight (höher), Hintere Pfosten: backHeight (niedriger) für Gefälle
      // Hinten fixiert bei z=zOffset, vorne wachsend bis z=fullDepth+zOffset
      return [
        // Vordere Pfosten (rechts bei x=0, links bei x=-fullWidth) - vorne wachsend
        new Vector3(-fullWidth, frontHeight / 2, fullDepth + zOffset),
        new Vector3(0, frontHeight / 2, fullDepth + zOffset),
        // Hintere Pfosten - hinten fixiert bei z=zOffset, niedriger für Gefälle
        new Vector3(-fullWidth, backHeight / 2, zOffset),
        new Vector3(0, backHeight / 2, zOffset),
      ]
    } else {
      // Wandmontage: 2 Pfosten vorne, hinten an der Wand - rechtsbündig
      // Hinten fixiert bei z=-0.15+zOffset, vorne wachsend bis z=fullDepth+zOffset
      return [
        // Vordere Pfosten (rechts bei x=0, links bei x=-fullWidth) - vorne wachsend
        new Vector3(-fullWidth, frontHeight / 2, fullDepth + zOffset),
        new Vector3(0, frontHeight / 2, fullDepth + zOffset),
        // Hintere Pfosten (an der Wand) - hinten fixiert bei z=-0.15+zOffset, bündig am Haus
        new Vector3(-fullWidth, effectiveBackHeight / 2, -0.15 + zOffset),
        new Vector3(0, effectiveBackHeight / 2, -0.15 + zOffset),
      ]
    }
  }, [width, depth, frontHeight, effectiveBackHeight, scale, mountType, zOffset])

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
      const frontZ = depth * scale + zOffset // Vorne wachsend
      const backZ = mountType === 'freestanding' 
        ? zOffset // Bei freistehend: hinten fixiert bei z=zOffset
        : -0.15 + zOffset // Bei Wandmontage: hinten fixiert bei z=-0.15+zOffset, bündig am Haus
      
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
          {/* Hauptwand - minimal breiter als die Überdachung, rechtsbündig, hinten fixiert */}
          <mesh
            position={[
              -(width * scale + 0.3) / 2, // Zentriert, aber relativ zur rechten Kante bei x=0
              (effectiveBackHeight + 0.6) / 2, 
              -0.15 + zOffset // Hinten fixiert bei z=-0.15+zOffset, bündig am Haus
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
          
          {/* Fenster links - rechtsbündig, hinten fixiert */}
          <mesh
            position={[-(width * scale + 0.3) / 3, effectiveBackHeight * 0.6, -0.1 + zOffset]}
            receiveShadow
          >
            <boxGeometry args={[0.6, 1.2, 0.05]} />
            <meshStandardMaterial color="#4a90e2" opacity={0.7} transparent />
          </mesh>
          
          {/* Fensterrahmen links */}
          <mesh
            position={[-(width * scale + 0.3) / 3, effectiveBackHeight * 0.6, -0.08 + zOffset]}
          >
            <boxGeometry args={[0.65, 1.25, 0.05]} />
            <meshStandardMaterial color="#2c3e50" />
          </mesh>
          
          {/* Tür/Großes Fenster rechts */}
          <mesh
            position={[-(width * scale + 0.3) / 3 * 2, effectiveBackHeight * 0.5, -0.1 + zOffset]}
            receiveShadow
          >
            <boxGeometry args={[1.2, 1.8, 0.05]} />
            <meshStandardMaterial color="#4a90e2" opacity={0.6} transparent />
          </mesh>
          
          {/* Türrahmen rechts */}
          <mesh
            position={[-(width * scale + 0.3) / 3 * 2, effectiveBackHeight * 0.5, -0.08 + zOffset]}
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
          depth * scale + zOffset, // Vorne wachsend
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
            ? zOffset // Bei freistehend: hinten fixiert bei z=zOffset
            : -0.15 + zOffset, // Bei Wandmontage: hinten fixiert bei z=-0.15+zOffset, bündig am Haus
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
          (depth * scale) / 2 + zOffset + (mountType === 'freestanding' ? 0 : -0.075), // Mitte zwischen hinten (z=zOffset oder -0.15+zOffset) und vorne (z=depth*scale+zOffset)
        ]}
        rotation={[
          Math.atan2(
            frontHeight - backHeight,
            depth * scale + (mountType === 'freestanding' ? 0 : 0.15), // Horizontale Distanz von hinten (z=0 oder -0.15) nach vorne (z=depth*scale)
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
          {sidePanelLeft === 'wedge-clear' && (() => {
            // Seitenkeil mit Glas - angepasst wie die Leisten
            const horizontalDist = depth * scale + (mountType === 'freestanding' ? 0 : 0.15)
            
            // Höhe der Sparren an den jeweiligen Positionen (vertikale Leisten)
            const frontRafterY = frontHeight + postSize * 0.6 // Vordere Sparrenhöhe (bei z = depth * scale + zOffset)
            const backRafterY = backHeight + postSize * 0.6 // Hintere Sparrenhöhe (bei z = zOffset oder -0.15 + zOffset)
            // Angepasste Höhen: größere niedriger, niedrigere höher
            const heightDiff = frontRafterY - backRafterY
            const frontStripHeight = backRafterY + heightDiff * 0.3 // Niedrigere wird höher
            const backStripHeight = frontRafterY - heightDiff * 0.3 // Größere wird niedriger
            
            // Glasscheibe: vertikal wie die Beine, oben schräg abgeschnitten im Sparrenwinkel
            const glassTopYFront = frontRafterY // Oben vorne: Sparrenhöhe (bei z = depth * scale + zOffset)
            const glassTopYBack = backRafterY // Oben hinten: Sparrenhöhe (bei z = zOffset oder -0.15 + zOffset)
            
            // Trapez-Geometrie: unten rechteckig, oben schräg - genau an Sparrenhöhen anschließend
            // Von hinten (z=0) nach vorne (z=horizontalDist) wachsend
            const shape = new Shape()
            // Unten links (Boden, hinten bei z=0)
            shape.moveTo(0, 0)
            // Unten rechts (Boden, vorne bei z=horizontalDist)
            shape.lineTo(horizontalDist, 0)
            // Oben rechts (höher, vorne) - genau an vordere Sparrenhöhe
            shape.lineTo(horizontalDist, glassTopYFront)
            // Oben links (niedriger, schräg, hinten) - genau an hintere Sparrenhöhe
            shape.lineTo(0, glassTopYBack)
            shape.lineTo(0, 0) // Zurück zum Start
            
            return (
              <group key="wedge-left-group">
                {/* Glaspanel - vertikal mit schrägem Abschnitt oben, beginnt am Boden */}
                <mesh
                  position={[
                    -width * scale - 0.05, // Links von der Überdachung
                    0, // Unterseite bei y=0 (Boden)
                    mountType === 'freestanding' ? zOffset : -0.075 + zOffset, // Hinten fixiert bei z=zOffset oder -0.15+zOffset
                  ]}
                  rotation={[
                    0, // Vertikal bleiben (wie die Beine)
                    Math.PI / 2, // 90 Grad um Y-Achse drehen
                    0,
                  ]}
                  castShadow
                  receiveShadow
                >
                  <shapeGeometry args={[shape]} />
                  <meshStandardMaterial
                    color="#e8f4f8"
                    transparent
                    opacity={0.15}
                    roughness={0.1}
                    metalness={0.3}
                    side={2} // DoubleSide
                  />
                </mesh>
                
                {/* Vertikale Rahmenleisten - nebeneinander, zusammen zentriert */}
                {/* Erste Leiste - vorne (vertikal, angepasste Höhe) */}
                <mesh
                  position={[
                    -width * scale - 0.05, // Mittig beim Panel
                    frontStripHeight / 2, // Von oben nach unten
                    mountType === 'freestanding' 
                      ? depth * scale + zOffset - (postSize / 2 + 0.85) // Vorne, ganz vorne bei z=depth*scale+zOffset
                      : depth * scale + zOffset - (postSize / 2 + 0.85) - 0.075, // Bei Wandmontage
                  ]}
                  castShadow
                >
                  <boxGeometry args={[postSize, frontStripHeight, postSize]} />
                  <meshStandardMaterial 
                    color={frameColorHex}
                    roughness={0.2}
                    metalness={0.1}
                    emissive={frameColorHex}
                    emissiveIntensity={0.1}
                  />
                </mesh>
                
                {/* Zweite Leiste - hinten (vertikal, angepasste Höhe) */}
                <mesh
                  position={[
                    -width * scale - 0.05, // Mittig beim Panel
                    backStripHeight / 2, // Von oben nach unten
                    mountType === 'freestanding' 
                      ? zOffset + postSize / 2 + 0.85 // Hinten, hinten fixiert bei z=zOffset
                      : zOffset + postSize / 2 + 0.85 - 0.075, // Bei Wandmontage: hinten fixiert
                  ]}
                  castShadow
                >
                  <boxGeometry args={[postSize, backStripHeight, postSize]} />
                  <meshStandardMaterial 
                    color={frameColorHex}
                    roughness={0.2}
                    metalness={0.1}
                    emissive={frameColorHex}
                    emissiveIntensity={0.1}
                  />
                </mesh>
              </group>
            )
          })()}
          {sidePanelLeft === 'wall-clear' && (() => {
            // Seitenwand mit Glas - angepasst wie die Leisten
            const horizontalDist = depth * scale + (mountType === 'freestanding' ? 0 : 0.15)
            
            // Höhe der Sparren an den jeweiligen Positionen (vertikale Leisten)
            const frontRafterY = frontHeight + postSize * 0.6 // Vordere Sparrenhöhe (bei z = depth * scale + zOffset)
            const backRafterY = backHeight + postSize * 0.6 // Hintere Sparrenhöhe (bei z = zOffset oder -0.15 + zOffset)
            // Angepasste Höhen: größere niedriger, niedrigere höher
            const heightDiff = frontRafterY - backRafterY
            const frontStripHeight = backRafterY + heightDiff * 0.3 // Niedrigere wird höher
            const backStripHeight = frontRafterY - heightDiff * 0.3 // Größere wird niedriger
            
            // Glasscheibe: von unten (Boden) bis zu den Sparrenhöhen, mit Sparrenwinkel
            const glassTopYFront = frontRafterY // Oben vorne: Sparrenhöhe
            const glassTopYBack = backRafterY // Oben hinten: Sparrenhöhe
            const glassHeight = Math.max(glassTopYFront, glassTopYBack) // Maximale Höhe
            const glassCenterY = glassHeight / 2 // Mitte der Scheibe
            // Neigung entsprechend Sparrenwinkel (wie die Sparren)
            const glassAngle = Math.atan2(
              frontHeight - backHeight,
              horizontalDist
            )
            
            return (
              <group key="wall-left-group">
                {/* Glaspanel */}
                <mesh
                  position={[
                    -width * scale - 0.05, // Links von der Überdachung
                    glassCenterY, // Mitte der angepassten Scheibe
                    mountType === 'freestanding' ? 0 : -0.075, // Zentriert oder angepasst für Wandmontage
                  ]}
                  rotation={[
                    glassAngle, // Neigung entsprechend angepassten Höhen
                    Math.PI / 2, // 90 Grad um Y-Achse drehen
                    0,
                  ]}
                  castShadow
                  receiveShadow
                >
                  <planeGeometry args={[
                    horizontalDist,
                    glassHeight // Höhe der angepassten Scheibe
                  ]} />
                  <meshStandardMaterial
                    color="#e8f4f8"
                    transparent
                    opacity={0.15}
                    roughness={0.1}
                    metalness={0.3}
                    side={2} // DoubleSide
                  />
                </mesh>
                
                {/* Vertikale Rahmenleisten mittig - nebeneinander in Z-Richtung (vorne/hinten) */}
                {/* Erste Leiste hinten */}
                <mesh
                  position={[
                    -width * scale - 0.05, // Mittig in X-Richtung
                    backStripHeight / 2, // Von oben nach unten, angepasste Höhe
                    mountType === 'freestanding' 
                      ? zOffset - postSize / 2 - 0.02 // Hinten fixiert bei z=zOffset, mit kleiner Lücke
                      : zOffset - 0.15 - postSize / 2 - 0.02, // Bei Wandmontage: hinten fixiert bei z=-0.15+zOffset
                  ]}
                  castShadow
                >
                  <boxGeometry args={[postSize, backStripHeight, postSize]} />
                  <meshStandardMaterial 
                    color={frameColorHex}
                    roughness={0.2}
                    metalness={0.1}
                    emissive={frameColorHex}
                    emissiveIntensity={0.1}
                  />
                </mesh>
                
                {/* Vertikale Rahmenleisten - nebeneinander, zusammen zentriert */}
                {/* Erste Leiste - vorne (vertikal, angepasste Höhe) */}
                <mesh
                  position={[
                    -width * scale - 0.05, // Mittig beim Panel
                    frontStripHeight / 2, // Von oben nach unten
                    mountType === 'freestanding' 
                      ? depth * scale + zOffset - (postSize / 2 + 0.85) // Vorne, ganz vorne bei z=depth*scale+zOffset
                      : depth * scale + zOffset - (postSize / 2 + 0.85) - 0.075, // Bei Wandmontage
                  ]}
                  castShadow
                >
                  <boxGeometry args={[postSize, frontStripHeight, postSize]} />
                  <meshStandardMaterial 
                    color={frameColorHex}
                    roughness={0.2}
                    metalness={0.1}
                    emissive={frameColorHex}
                    emissiveIntensity={0.1}
                  />
                </mesh>
                
                {/* Zweite Leiste - hinten (vertikal, angepasste Höhe) */}
                <mesh
                  position={[
                    -width * scale - 0.05, // Mittig beim Panel
                    backStripHeight / 2, // Von oben nach unten
                    mountType === 'freestanding' 
                      ? zOffset + postSize / 2 + 0.85 // Hinten, hinten fixiert bei z=zOffset
                      : zOffset + postSize / 2 + 0.85 - 0.075, // Bei Wandmontage: hinten fixiert
                  ]}
                  castShadow
                >
                  <boxGeometry args={[postSize, backStripHeight, postSize]} />
                  <meshStandardMaterial 
                    color={frameColorHex}
                    roughness={0.2}
                    metalness={0.1}
                    emissive={frameColorHex}
                    emissiveIntensity={0.1}
                  />
                </mesh>
              </group>
            )
          })()}
        </group>
      )}

      {/* Seitenteil rechts (von Innen gesehen) */}
      {sidePanelRight !== 'none' && (
        <group>
          {sidePanelRight === 'wedge-clear' && (() => {
            // Seitenkeil mit Glas - angepasst wie die Leisten
            const horizontalDist = depth * scale + (mountType === 'freestanding' ? 0 : 0.15)
            
            // Höhe der Sparren an den jeweiligen Positionen (vertikale Leisten)
            const frontRafterY = frontHeight + postSize * 0.6 // Vordere Sparrenhöhe (bei z = depth * scale + zOffset)
            const backRafterY = backHeight + postSize * 0.6 // Hintere Sparrenhöhe (bei z = zOffset oder -0.15 + zOffset)
            // Angepasste Höhen: größere niedriger, niedrigere höher
            const heightDiff = frontRafterY - backRafterY
            const frontStripHeight = backRafterY + heightDiff * 0.3 // Niedrigere wird höher
            const backStripHeight = frontRafterY - heightDiff * 0.3 // Größere wird niedriger
            
            // Glasscheibe: vertikal wie die Beine, oben schräg abgeschnitten im Sparrenwinkel
            const glassTopYFront = frontRafterY // Oben vorne: Sparrenhöhe (bei z = depth * scale + zOffset)
            const glassTopYBack = backRafterY // Oben hinten: Sparrenhöhe (bei z = zOffset oder -0.15 + zOffset)
            
            // Trapez-Geometrie: unten rechteckig, oben schräg - genau an Sparrenhöhen anschließend
            // Von hinten (z=0) nach vorne (z=horizontalDist) wachsend (Höhen gespiegelt für rechte Seite)
            const shape = new Shape()
            // Unten links (Boden, hinten bei z=0)
            shape.moveTo(0, 0)
            // Unten rechts (Boden, vorne bei z=horizontalDist)
            shape.lineTo(horizontalDist, 0)
            // Oben rechts (höher, vorne) - aber mit hinterer Höhe für rechte Seite
            shape.lineTo(horizontalDist, glassTopYBack)
            // Oben links (niedriger, schräg, hinten) - aber mit vorderer Höhe für rechte Seite
            shape.lineTo(0, glassTopYFront)
            shape.lineTo(0, 0) // Zurück zum Start
            
            return (
              <group key="wedge-right-group">
                {/* Glaspanel - vertikal mit schrägem Abschnitt oben, beginnt am Boden */}
                <mesh
                  position={[
                    0.05, // Rechts von der Überdachung (bei x=0)
                    0, // Unterseite bei y=0 (Boden)
                    mountType === 'freestanding' ? zOffset : -0.075 + zOffset, // Hinten fixiert bei z=zOffset oder -0.15+zOffset
                  ]}
                  rotation={[
                    0, // Vertikal bleiben (wie die Beine)
                    -Math.PI / 2, // -90 Grad um Y-Achse drehen
                    0,
                  ]}
                  castShadow
                  receiveShadow
                >
                  <shapeGeometry args={[shape]} />
                  <meshStandardMaterial
                    color="#e8f4f8"
                    transparent
                    opacity={0.15}
                    roughness={0.1}
                    metalness={0.3}
                    side={2} // DoubleSide
                  />
                </mesh>
                
                {/* Vertikale Rahmenleisten - nebeneinander, zusammen zentriert */}
                {/* Erste Leiste - vorne (vertikal, angepasste Höhe) */}
                <mesh
                  position={[
                    0.05, // Mittig beim Panel
                    frontStripHeight / 2, // Von oben nach unten
                    mountType === 'freestanding' 
                      ? depth * scale + zOffset - (postSize / 2 + 0.85) // Vorne, ganz vorne bei z=depth*scale+zOffset
                      : depth * scale + zOffset - (postSize / 2 + 0.85) - 0.075, // Bei Wandmontage
                  ]}
                  castShadow
                >
                  <boxGeometry args={[postSize, frontStripHeight, postSize]} />
                  <meshStandardMaterial 
                    color={frameColorHex}
                    roughness={0.2}
                    metalness={0.1}
                    emissive={frameColorHex}
                    emissiveIntensity={0.1}
                  />
                </mesh>
                
                {/* Zweite Leiste - hinten (vertikal, angepasste Höhe) */}
                <mesh
                  position={[
                    0.05, // Mittig beim Panel
                    backStripHeight / 2, // Von oben nach unten
                    mountType === 'freestanding' 
                      ? zOffset + postSize / 2 + 0.85 // Hinten, hinten fixiert bei z=zOffset
                      : zOffset + postSize / 2 + 0.85 - 0.075, // Bei Wandmontage: hinten fixiert
                  ]}
                  castShadow
                >
                  <boxGeometry args={[postSize, backStripHeight, postSize]} />
                  <meshStandardMaterial 
                    color={frameColorHex}
                    roughness={0.2}
                    metalness={0.1}
                    emissive={frameColorHex}
                    emissiveIntensity={0.1}
                  />
                </mesh>
              </group>
            )
          })()}
          {sidePanelRight === 'wall-clear' && (() => {
            // Seitenwand mit Glas - angepasst wie die Leisten
            const horizontalDist = depth * scale + (mountType === 'freestanding' ? 0 : 0.15)
            
            // Höhe der Sparren an den jeweiligen Positionen (vertikale Leisten)
            const frontRafterY = frontHeight + postSize * 0.6 // Vordere Sparrenhöhe (bei z = depth * scale + zOffset)
            const backRafterY = backHeight + postSize * 0.6 // Hintere Sparrenhöhe (bei z = zOffset oder -0.15 + zOffset)
            // Angepasste Höhen: größere niedriger, niedrigere höher
            const heightDiff = frontRafterY - backRafterY
            const frontStripHeight = backRafterY + heightDiff * 0.3 // Niedrigere wird höher
            const backStripHeight = frontRafterY - heightDiff * 0.3 // Größere wird niedriger
            
            // Glasscheibe: vertikal wie die Beine, oben schräg abgeschnitten im Sparrenwinkel
            const glassTopYFront = frontRafterY // Oben vorne: Sparrenhöhe (bei z = depth * scale + zOffset)
            const glassTopYBack = backRafterY // Oben hinten: Sparrenhöhe (bei z = zOffset oder -0.15 + zOffset)
            
            // Trapez-Geometrie: unten rechteckig, oben schräg - genau an Sparrenhöhen anschließend (wie linke Seite)
            const shape = new Shape()
            const halfWidth = horizontalDist / 2
            // Unten links (Boden)
            shape.moveTo(-halfWidth, 0)
            // Unten rechts (Boden)
            shape.lineTo(halfWidth, 0)
            // Oben rechts (höher) - genau an vordere Sparrenhöhe
            shape.lineTo(halfWidth, glassTopYFront)
            // Oben links (niedriger, schräg) - genau an hintere Sparrenhöhe
            shape.lineTo(-halfWidth, glassTopYBack)
            shape.lineTo(-halfWidth, 0) // Zurück zum Start
            
            return (
              <group key="wall-right-group">
                {/* Glaspanel - vertikal mit schrägem Abschnitt oben, beginnt am Boden */}
                <mesh
                  position={[
                    0.05, // Rechts von der Überdachung (bei x=0)
                    0, // Unterseite bei y=0 (Boden)
                    mountType === 'freestanding' ? zOffset : -0.075 + zOffset, // Hinten fixiert bei z=zOffset oder -0.15+zOffset
                  ]}
                  rotation={[
                    0, // Vertikal bleiben (wie die Beine)
                    -Math.PI / 2, // -90 Grad um Y-Achse drehen
                    0,
                  ]}
                  castShadow
                  receiveShadow
                >
                  <shapeGeometry args={[shape]} />
                  <meshStandardMaterial
                    color="#e8f4f8"
                    transparent
                    opacity={0.15}
                    roughness={0.1}
                    metalness={0.3}
                    side={2} // DoubleSide
                  />
                </mesh>
                
                {/* Vertikale Rahmenleisten - nebeneinander, zusammen zentriert */}
                {/* Erste Leiste - vorne (vertikal, angepasste Höhe) */}
                <mesh
                  position={[
                    0.05, // Mittig beim Panel
                    frontStripHeight / 2, // Von oben nach unten
                    mountType === 'freestanding' 
                      ? depth * scale + zOffset - (postSize / 2 + 0.85) // Vorne, ganz vorne bei z=depth*scale+zOffset
                      : depth * scale + zOffset - (postSize / 2 + 0.85) - 0.075, // Bei Wandmontage
                  ]}
                  castShadow
                >
                  <boxGeometry args={[postSize, frontStripHeight, postSize]} />
                  <meshStandardMaterial 
                    color={frameColorHex}
                    roughness={0.2}
                    metalness={0.1}
                    emissive={frameColorHex}
                    emissiveIntensity={0.1}
                  />
                </mesh>
                
                {/* Zweite Leiste - hinten (vertikal, angepasste Höhe) */}
                <mesh
                  position={[
                    0.05, // Mittig beim Panel
                    backStripHeight / 2, // Von oben nach unten
                    mountType === 'freestanding' 
                      ? zOffset + postSize / 2 + 0.85 // Hinten, hinten fixiert bei z=zOffset
                      : zOffset + postSize / 2 + 0.85 - 0.075, // Bei Wandmontage: hinten fixiert
                  ]}
                  castShadow
                >
                  <boxGeometry args={[postSize, backStripHeight, postSize]} />
                  <meshStandardMaterial 
                    color={frameColorHex}
                    roughness={0.2}
                    metalness={0.1}
                    emissive={frameColorHex}
                    emissiveIntensity={0.1}
                  />
                </mesh>
              </group>
            )
          })()}
        </group>
      )}
    </group>
  )
}

export default TerrassendachModel

