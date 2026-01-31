import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import TerrassendachModel from './components/TerrassendachModel'
import Environment from './components/Environment'
import ConfigPanel from './components/ConfigPanel'
import { Configuration } from './types'
import './App.css'

const defaultConfig: Configuration = {
  frameColor: 'RAL7024st', // Mittelgrau (#545454) als Standard
  width: 5000, // mm
  depth: 3000, // mm
  gutterHeight: 2200, // mm
  mountType: 'wall',
  postLength: 2500, // mm
  postMounting: 'alu-l',
  roofSlope: 8, // Grad
  deliveryOption: 'without-mounting-set',
  roofCovering: 'polycarbonat-clear',
  sidePanelLeft: 'none',
  sidePanelRight: 'none',
}

function App() {
  const [config, setConfig] = useState<Configuration>(defaultConfig)

  return (
    <div className="app">
      <header className="app-header">
        <h1>Terrassendach Konfigurator</h1>
        <p>Konfigurieren Sie Ihre individuelle Terrassenüberdachung</p>
      </header>
      
      <div className="app-content">
        <ConfigPanel config={config} onConfigChange={setConfig} />
        
        <div className="visualization-container">
          <Canvas shadows camera={{ position: [8, 4, 10], fov: 50 }}>
            <ambientLight intensity={0.7} />
            <directionalLight
              position={[5, 10, 5]}
              intensity={1.5}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-far={50}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
            />
            <pointLight position={[-5, 6, -5]} intensity={0.4} />
            <hemisphereLight intensity={0.3} color="#e8e8e8" />
            <Environment config={config} />
            <TerrassendachModel config={config} />
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={6}
              maxDistance={30}
              target={[2.5, 1.2, 0]}
              autoRotate={false}
            />
          </Canvas>
        </div>
      </div>
    </div>
  )
}

export default App

