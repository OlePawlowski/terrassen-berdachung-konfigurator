import { useMemo } from 'react'
import { Configuration } from '../types'
import HouseModel from './HouseModel'

interface EnvironmentProps {
  config: Configuration
  houseModelUrl?: string // Optional: URL zum Haus-Modell
}

function Environment({ config, houseModelUrl }: EnvironmentProps) {
  const scale = 0.001 // mm zu Meter
  const length = config.width * scale
  const depth = config.depth * scale
  
  // Positionierung: Rechtsbündig am Haus, wächst nur nach links
  // Die rechte Kante bleibt bei x = 3.5 fixiert
  const rightEdgeFixed = 5.0 // Rechte Kante bleibt immer hier
  
  // Terrasse: genau unter der Überdachung mit Padding links und rechts
  const padding = 0.3 // 30cm Padding links und rechts
  const terraceWidth = length + padding * 2 // Breite der Überdachung + Padding
  
  return (
    <group position={[rightEdgeFixed, 0, 0]}>
      {/* Terrasse-Basis (unsichtbar, nur für Schatten) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-terraceWidth / 2, -0.015, 0]} // Etwas tiefer als Fliesen
        receiveShadow
      >
        <planeGeometry args={[terraceWidth, depth + 1]} />
        <meshStandardMaterial 
          color="#d4d4d4" 
          roughness={0.7}
          metalness={0.1}
          visible={false} // Unsichtbar, nur für Schatten
        />
      </mesh>
      
      {/* Fliesen-Muster auf der Terrasse - symmetrisch mit Padding links und rechts */}
      {useMemo(() => {
        const tileSize = 0.4 // 40cm Fliesen
        // Fliesen sollen die gesamte Terrasse abdecken (terraceWidth breit)
        // Die Überdachung geht von x=0 (rechts) bis x=-length (links)
        // Die Terrasse geht von x=padding (rechts) bis x=-length-padding (links)
        // Fliesen sollen symmetrisch sein: gleich weit über die Überdachung hinaus
        const tilesX = Math.ceil(terraceWidth / tileSize) // Anzahl Fliesen für gesamte Terrasse
        const tilesZ = Math.ceil((depth + 1) / tileSize)
        
        // Startposition: Rechte Kante der ersten Fliese bei x=padding (rechte Kante der Terrasse)
        // Die Terrasse ist bei [-terraceWidth/2, ...] zentriert, also:
        // Rechte Kante der Terrasse: x = terraceWidth/2
        // Linke Kante der Terrasse: x = -terraceWidth/2
        // Aber wir wollen rechtsbündig zur Überdachung: rechte Kante bei x=padding
        const startX = padding // Rechte Kante der Terrasse (padding rechts von Überdachung)
        const startZ = -(depth + 1) / 2 + tileSize / 2
        
        const tiles = []
        for (let i = 0; i < tilesX; i++) {
          for (let j = 0; j < tilesZ; j++) {
            // Positionierung: von rechts nach links, symmetrisch
            // Rechte Kante der Fliese bei x=padding, dann nach links bis x=-length-padding
            const x = startX - i * tileSize - tileSize / 2 // Zentrum der Fliese
            const z = startZ + j * tileSize
            
            tiles.push(
              <mesh
                key={`tile-${i}-${j}-${Math.floor(terraceWidth * 100)}-${Math.floor(depth * 100)}`}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[x, -0.009, z]}
              >
                <planeGeometry args={[tileSize * 0.95, tileSize * 0.95]} />
                <meshStandardMaterial 
                  color={(i + j) % 2 === 0 ? "#d4d4d4" : "#c8c8c8"}
                  roughness={0.8}
                />
              </mesh>
            )
          }
        }
        
        return tiles
      }, [terraceWidth, depth, length, padding])}
      
      {/* Garten/Gras vor der Terrasse - größer mit verbesserter Textur, rechtsbündig */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-(length + 8) / 2, -0.01, depth / 2 + 2]} // Zentriert relativ zur rechten Kante
        receiveShadow
      >
        <planeGeometry args={[length + 8, 6, 20, 20]} />
        <meshStandardMaterial 
          color="#5a7a1a" 
          roughness={0.95}
          metalness={0.0}
          emissive="#4a6a0a"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Gras seitlich rechts - größer mit verbesserter Textur, rechtsbündig */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[1, -0.01, 0]} // Rechts von der Terrasse
        receiveShadow
      >
        <planeGeometry args={[4, depth + 5, 10, 20]} />
        <meshStandardMaterial 
          color="#5a7a1a" 
          roughness={0.95}
          metalness={0.0}
          emissive="#4a6a0a"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Gras seitlich links - größer mit verbesserter Textur, rechtsbündig */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-length - 1, -0.01, 0]} // Links von der Terrasse
        receiveShadow
      >
        <planeGeometry args={[4, depth + 5, 10, 20]} />
        <meshStandardMaterial 
          color="#5a7a1a" 
          roughness={0.95}
          metalness={0.0}
          emissive="#4a6a0a"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* 3D-Haus-Modell (nur bei Wandmontage) - Position ausgleichen, damit es nicht verschoben wird */}
      {config.mountType === 'wall' && (
        <HouseModel
          modelUrl={houseModelUrl}
          scale={0.0008}
          position={[-5.0, 0, -(depth * scale) / 2 - 0.5]}
          rotation={[0, ((-23 + 360) * Math.PI) / 180, 0]}
        />
      )}
    </group>
  )
}

export default Environment

