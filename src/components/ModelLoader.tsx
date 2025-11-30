import { useGLTF } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { Group, Mesh, MeshStandardMaterial } from 'three'
import { Configuration } from '../types'

interface ModelLoaderProps {
  config: Configuration
  modelPath: string // Pfad zum 3D-Modell (z.B. '/models/terrassendach.glb')
  scale?: number // Skalierung des Modells (Standard: 1)
  position?: [number, number, number] // Position [x, y, z]
  rotation?: [number, number, number] // Rotation [x, y, z] in Radiant
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
 * Komponente zum Laden von 3D-Modellen (GLTF/GLB Format)
 * 
 * Unterstützte Formate:
 * - GLTF (.gltf) - Textbasiert, benötigt separate Texturen
 * - GLB (.glb) - Binär, alles in einer Datei (EMPFOHLEN)
 * 
 * Verwendung:
 * <ModelLoader 
 *   config={config}
 *   modelPath="/models/terrassendach.glb"
 *   scale={0.01}
 *   position={[0, 0, 0]}
 * />
 */
function ModelLoader({ 
  config, 
  modelPath, 
  scale = 1, 
  position = [0, 0, 0],
  rotation = [0, 0, 0]
}: ModelLoaderProps) {
  const { scene } = useGLTF(modelPath)
  const modelRef = useRef<Group>(null)

  // Materialien dynamisch ändern basierend auf config
  useEffect(() => {
    if (!modelRef.current) return
    
    const clonedScene = modelRef.current
    
    clonedScene.traverse((child) => {
      if (child instanceof Mesh) {
        const material = child.material as MeshStandardMaterial
        if (material && material.color) {
          // Materialfarbe basierend auf config ändern
          // Sie können auch nach Material-Namen filtern:
          // if (material.name === 'Frame_Material' || material.name.includes('Frame'))
          if (MATERIAL_COLORS[config.material]) {
            material.color.set(MATERIAL_COLORS[config.material])
          }
        }
      }
    })
  }, [config.material])

  return (
    <primitive
      ref={modelRef}
      object={scene.clone()}
      scale={scale}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    />
  )
}

export default ModelLoader

