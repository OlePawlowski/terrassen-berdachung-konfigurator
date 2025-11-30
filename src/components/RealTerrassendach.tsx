import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import { Group, Mesh, MeshStandardMaterial } from 'three'
import { Configuration } from '../types'

interface RealTerrassendachProps {
  config: Configuration
  modelPath?: string // Optional: Standard ist '/models/terrassendach.glb'
}

const MATERIAL_COLORS: Record<string, string> = {
  anthracite: '#2c3e50',
  white: '#f8f8f8',
  black: '#1a1a1a',
  brown: '#8b4513',
  silver: '#c0c0c0',
  bronze: '#cd7f32',
}

/**
 * Beispiel-Komponente für die Integration eines realen Terrassendach-Modells
 * 
 * Diese Komponente zeigt, wie Sie Ihr eigenes 3D-Modell integrieren können.
 * 
 * Voraussetzungen:
 * 1. Modell als GLB-Datei in public/models/terrassendach.glb platzieren
 * 2. Modell sollte in Metern skaliert sein (oder Skalierung anpassen)
 * 3. Modell sollte zentriert sein (Ursprung bei 0,0,0)
 * 
 * Optional: Materialien im Modell benennen (z.B. "Frame_Material", "Roof_Material")
 * für bessere Kontrolle über Material-Änderungen.
 */
function RealTerrassendach({ 
  config, 
  modelPath = '/models/terrassendach.glb' 
}: RealTerrassendachProps) {
  const { scene } = useGLTF(modelPath)
  const modelRef = useRef<Group>(null)

  // Skalierung basierend auf Konfiguration
  // Passen Sie diese Werte an Ihr Modell an
  const modelScale = useMemo(() => {
    const baseScale = 0.01 // Wenn Modell in cm: 0.01, wenn in Metern: 1
    // Optional: Dynamische Skalierung basierend auf Größe
    // const lengthScale = config.length / 500 // Basis: 500cm
    // const depthScale = config.depth / 300 // Basis: 300cm
    // return baseScale * Math.min(lengthScale, depthScale)
    return baseScale
  }, [])

  // Materialien basierend auf config ändern
  useEffect(() => {
    if (!modelRef.current) return
    
    const clonedScene = modelRef.current
    
    clonedScene.traverse((child) => {
      if (child instanceof Mesh) {
        const material = child.material as MeshStandardMaterial
        if (material && material.color) {
          // Option 1: Alle Materialien ändern
          if (MATERIAL_COLORS[config.material]) {
            material.color.set(MATERIAL_COLORS[config.material])
          }
          
          // Option 2: Nur bestimmte Materialien ändern (nach Name)
          // if (material.name === 'Frame_Material' || material.name.includes('Frame')) {
          //   material.color.set(MATERIAL_COLORS[config.material])
          // }
        }
      }
    })
  }, [config.material])

  // Optional: Modell-Position basierend auf Konfiguration anpassen
  const position = useMemo(() => {
    return [0, 0, 0] as [number, number, number]
    // Beispiel für dynamische Positionierung:
    // return [0, config.frontHeight * 0.01 / 2, 0]
  }, [])

  return (
    <primitive
      ref={modelRef}
      object={scene.clone()}
      scale={modelScale}
      position={position}
      castShadow
      receiveShadow
    />
  )
}

// Vorspeichern des Modells für bessere Performance
// Entfernen Sie diese Zeile, wenn Sie einen anderen Pfad verwenden
useGLTF.preload('/models/terrassendach.glb')

export default RealTerrassendach

