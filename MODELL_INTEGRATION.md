# 3D-Modell Integration Guide

## Unterstützte Dateiformate

### ✅ Empfohlen: GLB Format
- **GLB** (`.glb`) - **EMPFOHLEN** für Web-Anwendungen
  - Binäres Format, alles in einer Datei (Modell + Texturen)
  - Schnelleres Laden
  - Kleinere Dateigröße
  - Einfacher zu verwenden

### ✅ Alternative: GLTF Format
- **GLTF** (`.gltf`) - Textbasiert
  - Benötigt separate Textur-Dateien
  - Gut für Entwicklung/Debugging
  - Größere Dateigröße

### ⚠️ Andere Formate
- **OBJ** - Unterstützt, aber nicht empfohlen (veraltet)
- **FBX** - Unterstützt, aber größere Dateien
- **3DS, DAE** - Können konvertiert werden

## Workflow: Von CAD zu Web

### 1. Modell vorbereiten

**Aus CAD-Programmen (SolidWorks, AutoCAD, etc.):**
```
CAD-Datei → Export als OBJ/STL → Konvertierung zu GLB
```

**Aus 3D-Modellierungsprogrammen:**
```
Blender, 3ds Max, Maya → Export als GLB
```

### 2. Konvertierung zu GLB

**Option A: Blender (Kostenlos)**
1. Blender öffnen
2. Datei → Import → [Ihr Format]
3. Datei → Export → glTF 2.0
4. Format: GLB auswählen
5. Exportieren

**Option B: Online-Konverter**
- https://products.aspose.app/3d/conversion
- https://www.creators3d.com/online-viewer
- https://glb-converter.com/

**Option C: Command Line Tools**
```bash
# Mit gltf-pipeline (Node.js)
npm install -g gltf-pipeline
gltf-pipeline -i model.obj -o model.glb
```

### 3. Modell optimieren

**Wichtig für Web:**
- ✅ Polygone reduzieren (wenn möglich)
- ✅ Texturen komprimieren
- ✅ Dateigröße < 5MB (idealerweise < 2MB)
- ✅ Modell sollte in Metern skaliert sein (nicht cm/mm)

**Blender Optimierung:**
1. Modifiers → Decimate (Polygone reduzieren)
2. Texturen → Komprimierung auf 512x512 oder 1024x1024
3. Unnötige Materialien entfernen

### 4. Modell in Projekt integrieren

#### Schritt 1: Modell-Datei platzieren

Erstellen Sie einen `public/models/` Ordner:
```
terrassendach-konfigurator/
├── public/
│   └── models/
│       └── terrassendach.glb  ← Ihr Modell hier
```

#### Schritt 2: Modell laden

**Option A: Mit der ModelLoader-Komponente**

```tsx
import ModelLoader from './components/ModelLoader'

// In App.tsx oder TerrassendachModel.tsx
<ModelLoader
  config={config}
  modelPath="/models/terrassendach.glb"
  scale={0.01}  // Anpassen je nach Modell-Skalierung
  position={[0, 0, 0]}
  rotation={[0, 0, 0]}
/>
```

**Option B: Direkt mit useGLTF**

```tsx
import { useGLTF } from '@react-three/drei'

function CustomModel({ config }: { config: Configuration }) {
  const { scene } = useGLTF('/models/terrassendach.glb')
  
  return (
    <primitive
      object={scene}
      scale={0.01}
      position={[0, 0, 0]}
    />
  )
}

// Vorspeichern für bessere Performance
useGLTF.preload('/models/terrassendach.glb')
```

## Modell-Struktur für Konfigurator

### Ideale Modell-Struktur

Für einen funktionierenden Konfigurator sollte das Modell folgende Struktur haben:

```
Terrassendach-Modell
├── Pfosten (separate Meshes)
│   ├── Pfosten_Vorne_Links
│   ├── Pfosten_Vorne_Rechts
│   ├── Pfosten_Hinten_Links (optional)
│   └── Pfosten_Hinten_Rechts (optional)
├── Rahmen
│   ├── Hauptbalken_Vorne
│   ├── Hauptbalken_Hinten
│   └── Sparren (können instanziert werden)
└── Dach
    └── Dachfläche
```

### Material-Namen für dynamische Änderung

Benennen Sie Materialien im Modell konsistent:
- `Frame_Material` - Für Rahmen/Pfosten
- `Roof_Material` - Für Dach
- `Wall_Material` - Für Wand (optional)

Dann können Sie diese im Code ändern:

```tsx
scene.traverse((child) => {
  if (child instanceof Mesh) {
    const material = child.material as MeshStandardMaterial
    if (material.name === 'Frame_Material') {
      material.color.set(MATERIAL_COLORS[config.material])
    }
  }
})
```

## Skalierung und Positionierung

### Skalierung

**Wichtig:** Three.js arbeitet in Metern, nicht Zentimetern!

Wenn Ihr Modell in Zentimetern erstellt wurde:
```tsx
scale={0.01}  // cm → Meter
```

Wenn Ihr Modell bereits in Metern ist:
```tsx
scale={1}  // Keine Skalierung nötig
```

### Positionierung

Das Modell sollte zentriert sein:
- X: 0 (links/rechts)
- Y: 0 (oben/unten) - Boden sollte bei y=0 sein
- Z: 0 (vor/hinten)

## Beispiel: Vollständige Integration

```tsx
// src/components/RealTerrassendach.tsx
import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import { Mesh, MeshStandardMaterial } from 'three'
import { Configuration } from '../types'

interface RealTerrassendachProps {
  config: Configuration
}

const MATERIAL_COLORS = {
  anthracite: '#2c3e50',
  white: '#f8f8f8',
  black: '#1a1a1a',
  brown: '#8b4513',
  silver: '#c0c0c0',
  bronze: '#cd7f32',
}

function RealTerrassendach({ config }: RealTerrassendachProps) {
  const { scene } = useGLTF('/models/terrassendach.glb')
  
  // Materialien basierend auf config ändern
  useMemo(() => {
    scene.traverse((child) => {
      if (child instanceof Mesh) {
        const material = child.material as MeshStandardMaterial
        if (material && material.name.includes('Frame')) {
          material.color.set(MATERIAL_COLORS[config.material])
        }
      }
    })
  }, [config.material, scene])
  
  // Skalierung basierend auf Größe
  const scale = useMemo(() => {
    const baseScale = 0.01 // cm zu Meter
    const lengthScale = config.length / 500 // Basis: 500cm
    const depthScale = config.depth / 300 // Basis: 300cm
    
    return baseScale * Math.min(lengthScale, depthScale)
  }, [config.length, config.depth])
  
  return (
    <primitive
      object={scene.clone()}
      scale={scale}
      position={[0, 0, 0]}
      castShadow
      receiveShadow
    />
  )
}

// Vorspeichern
useGLTF.preload('/models/terrassendach.glb')

export default RealTerrassendach
```

## Troubleshooting

### Problem: Modell wird nicht angezeigt
- ✅ Prüfen Sie die Dateipfade (müssen in `public/` sein)
- ✅ Prüfen Sie die Skalierung (vielleicht zu klein/groß)
- ✅ Prüfen Sie die Browser-Konsole auf Fehler
- ✅ Prüfen Sie, ob das Modell zentriert ist

### Problem: Modell ist zu groß/klein
- ✅ Skalierung anpassen: `scale={0.01}` oder `scale={1}`
- ✅ Modell in Blender neu skalieren

### Problem: Materialien werden nicht geändert
- ✅ Prüfen Sie die Material-Namen im Modell
- ✅ Verwenden Sie `scene.traverse()` um alle Meshes zu finden
- ✅ Materialien müssen `MeshStandardMaterial` sein

### Problem: Modell lädt langsam
- ✅ Dateigröße reduzieren
- ✅ Polygone reduzieren
- ✅ Texturen komprimieren
- ✅ `useGLTF.preload()` verwenden

## Nützliche Tools

- **Blender** - Kostenlose 3D-Software: https://www.blender.org/
- **glTF Validator** - Modell validieren: https://github.khronos.org/glTF-Validator/
- **glTF Viewer** - Online Viewer: https://gltf-viewer.donmccurdy.com/
- **Draco Compression** - Für kleinere Dateien (erfordert zusätzliche Konfiguration)

## Beispiel-Workflow

1. **Modell aus CAD exportieren** → OBJ/STL
2. **In Blender importieren**
3. **Optimieren:**
   - Polygone reduzieren
   - Texturen hinzufügen/optimieren
   - Materialien benennen
4. **Als GLB exportieren**
5. **In `public/models/` platzieren**
6. **In Code integrieren** mit `ModelLoader` oder `useGLTF`
7. **Skalierung und Position anpassen**
8. **Materialien dynamisch ändern** basierend auf config

## Fragen?

Bei Problemen:
1. Browser-Konsole prüfen (F12)
2. Modell in Online-Viewer testen
3. Skalierung anpassen
4. Dateipfade überprüfen

