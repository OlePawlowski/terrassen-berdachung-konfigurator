import { useGLTF } from '@react-three/drei'
import { Suspense, useMemo } from 'react'

interface HouseModelProps {
  modelUrl?: string // URL zum 3D-Modell oder lokaler Pfad
  scale?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
}

/**
 * Fallback-Komponente: Realistisches Haus-Modell direkt im Code
 * Wird verwendet wenn kein externes Modell geladen wird
 */
function DefaultHouseModel({ 
  position = [0, 0, -3],
  scale = 1 
}: { position?: [number, number, number], scale?: number }) {
  return (
    <group position={position} scale={scale} castShadow receiveShadow>
      {/* Hauptgebäude */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[6, 3, 4]} />
        <meshStandardMaterial 
          color="#f8f8f8" 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Dach */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[4.5, 2, 4]} />
        <meshStandardMaterial 
          color="#8b4513" 
          roughness={0.7}
        />
      </mesh>
      
      {/* Fenster links */}
      <mesh position={[-2, 1.5, 2.01]}>
        <boxGeometry args={[0.8, 1.2, 0.05]} />
        <meshStandardMaterial color="#4a90e2" opacity={0.7} transparent />
      </mesh>
      <mesh position={[-2, 1.5, 2.02]}>
        <boxGeometry args={[0.85, 1.25, 0.02]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      
      {/* Fenster rechts */}
      <mesh position={[2, 1.5, 2.01]}>
        <boxGeometry args={[0.8, 1.2, 0.05]} />
        <meshStandardMaterial color="#4a90e2" opacity={0.7} transparent />
      </mesh>
      <mesh position={[2, 1.5, 2.02]}>
        <boxGeometry args={[0.85, 1.25, 0.02]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      
      {/* Tür */}
      <mesh position={[0, 0.8, 2.01]}>
        <boxGeometry args={[1, 1.8, 0.05]} />
        <meshStandardMaterial color="#4a90e2" opacity={0.6} transparent />
      </mesh>
      <mesh position={[0, 0.8, 2.02]}>
        <boxGeometry args={[1.05, 1.85, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Kamin */}
      <mesh position={[2.5, 2.5, -1.5]} castShadow>
        <boxGeometry args={[0.4, 1.5, 0.4]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      
      {/* Holzverkleidung rechts */}
      <mesh position={[3.1, 1.5, 0]} receiveShadow>
        <boxGeometry args={[0.1, 3, 4]} />
        <meshStandardMaterial color="#8b7355" roughness={0.8} />
      </mesh>
    </group>
  )
}

/**
 * Komponente zum Laden eines externen 3D-Haus-Modells
 */
function HouseModelContent({ 
  modelUrl = '/models/modern_home.glb', // Standard: modern_home.glb
  scale = 0.0008,
  position = [0, 0, -3],
  rotation = [0, 0, 0]
}: HouseModelProps) {
  // Lade externes Modell - Materialien werden nur einmal beim Laden verarbeitet
  const { scene } = useGLTF(modelUrl, true)
  
  // Materialien verbessern für bessere Darstellung - nur einmal beim Laden
  const clonedScene = useMemo(() => {
    const cloned = scene.clone()
    cloned.traverse((child: any) => {
      if (child.isMesh && child.material) {
        // Materialien heller und lebendiger machen
        if (Array.isArray(child.material)) {
          child.material.forEach((mat: any) => {
            if (mat.color) {
              // Aufhellen und Sättigung erhöhen
              const hsl = { h: 0, s: 0, l: 0 }
              mat.color.getHSL(hsl)
              hsl.l = Math.min(0.9, hsl.l * 1.3) // Heller machen
              hsl.s = Math.min(1, hsl.s * 1.2) // Sättigung erhöhen
              mat.color.setHSL(hsl.h, hsl.s, hsl.l)
            }
            // Beleuchtung verbessern
            if (mat.roughness !== undefined) {
              mat.roughness = Math.max(0.3, mat.roughness * 0.8)
            }
            mat.needsUpdate = true
          })
        } else {
          if (child.material.color) {
            const hsl = { h: 0, s: 0, l: 0 }
            child.material.color.getHSL(hsl)
            hsl.l = Math.min(0.9, hsl.l * 1.3)
            hsl.s = Math.min(1, hsl.s * 1.2)
            child.material.color.setHSL(hsl.h, hsl.s, hsl.l)
          }
          if (child.material.roughness !== undefined) {
            child.material.roughness = Math.max(0.3, child.material.roughness * 0.8)
          }
          child.material.needsUpdate = true
        }
      }
    })
    return cloned
  }, [scene])
  
  return (
    <primitive
      object={clonedScene}
      scale={scale}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    />
  )
}

/**
 * Fallback-Komponente während das Modell lädt
 */
function HouseModelFallback() {
  return <DefaultHouseModel />
}

function HouseModel(props: HouseModelProps) {
  return (
    <Suspense fallback={<HouseModelFallback />}>
      <HouseModelContent {...props} />
    </Suspense>
  )
}

// Vorspeichern für bessere Performance
useGLTF.preload('/models/modern_home.glb')

export default HouseModel

