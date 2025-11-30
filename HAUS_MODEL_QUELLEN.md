# Kostenlose 3D-Haus-Modelle für den Konfigurator

## 🏠 Empfohlene Quellen

### 1. **Poly Haven** (Sehr empfehlenswert)
- **URL:** https://polyhaven.com/models
- **Lizenz:** CC0 (komplett kostenlos, keine Attribution nötig)
- **Formate:** GLB, GLTF, OBJ, FBX
- **Qualität:** Sehr hoch
- **Vorteile:** Direkt als GLB downloadbar, optimiert für Web

**Beispiel-Modelle:**
- Modern House: https://polyhaven.com/a/modern_house_01
- Residential Building: https://polyhaven.com/a/residential_building_01

### 2. **Sketchfab** (Große Auswahl)
- **URL:** https://sketchfab.com/
- **Lizenz:** Filter auf CC0 oder CC-BY (kostenlos)
- **Formate:** GLB, GLTF
- **Vorteile:** Sehr große Auswahl, viele moderne Häuser

**So finden Sie kostenlose Modelle:**
1. Gehen Sie zu https://sketchfab.com/
2. Suchen Sie nach "house" oder "modern house"
3. Filter: License → CC0 oder CC-BY
4. Download → GLB Format

**Beispiel-Suche:**
- https://sketchfab.com/search?q=modern+house&type=models&features=downloadable&sort_by=-likeCount

### 3. **Free3D**
- **URL:** https://free3d.com/
- **Lizenz:** Verschiedene (prüfen!)
- **Formate:** Verschiedene (oft OBJ, FBX)
- **Vorteile:** Große Auswahl kostenloser Modelle

### 4. **TurboSquid** (Kostenlose Modelle verfügbar)
- **URL:** https://www.turbosquid.com/
- **Lizenz:** Verschiedene (Filter auf "Free")
- **Formate:** Verschiedene
- **Vorteile:** Professionelle Qualität

### 5. **CGTrader** (Kostenlose Modelle)
- **URL:** https://www.cgtrader.com/free-3d-models
- **Lizenz:** Verschiedene (prüfen!)
- **Formate:** Verschiedene
- **Vorteile:** Große Auswahl

## 📥 Download und Integration

### Schritt 1: Modell herunterladen

**Empfohlenes Format:** GLB (.glb)
- Alles in einer Datei (Modell + Texturen)
- Optimiert für Web
- Schnelles Laden

### Schritt 2: Modell platzieren

**Option A: Lokales Modell**
```
terrassendach-konfigurator/
├── public/
│   └── models/
│       └── house.glb  ← Haus-Modell hier
```

**Option B: Externe URL verwenden**
- Modell von URL direkt laden (siehe unten)

### Schritt 3: In Code integrieren

**Mit lokaler Datei:**
```tsx
// In App.tsx
<Environment 
  config={config} 
  houseModelUrl="/models/house.glb"
/>
```

**Mit externer URL:**
```tsx
// In App.tsx
<Environment 
  config={config} 
  houseModelUrl="https://polyhaven.com/api/models/modern_house_01/glb"
/>
```

## 🎯 Empfohlene Modelle (Beispiele)

### Modernes Einfamilienhaus
- **Quelle:** Poly Haven
- **URL:** https://polyhaven.com/a/modern_house_01
- **Format:** GLB verfügbar
- **Größe:** ~2-5MB typisch

### Minimalistisches Haus
- **Quelle:** Sketchfab (CC0)
- **Suche:** "minimalist house"
- **Format:** GLB

### Wohnhaus mit Terrasse
- **Quelle:** Sketchfab (CC0)
- **Suche:** "house with terrace"
- **Format:** GLB

## ⚙️ Konfiguration

### Skalierung anpassen

Das Haus-Modell muss möglicherweise skaliert werden:

```tsx
// In HouseModel.tsx
scale={1}  // Standard
scale={0.5}  // Kleiner
scale={2}  // Größer
```

### Position anpassen

```tsx
// In Environment.tsx
position={[0, 0, -(depth * scale) / 2 - 2]}  // Standard
position={[0, 0, -(depth * scale) / 2 - 3]}  // Weiter weg
```

## 🔧 Modell optimieren (optional)

Falls das Modell zu groß ist:

1. **In Blender öffnen**
2. **Modifiers → Decimate** (Polygone reduzieren)
3. **Texturen komprimieren** (512x512 oder 1024x1024)
4. **Als GLB exportieren**

## 📝 Lizenz-Hinweise

### CC0 (Public Domain)
- ✅ Komplett kostenlos
- ✅ Keine Attribution nötig
- ✅ Kommerzielle Nutzung erlaubt
- **Empfohlen für Produktion**

### CC-BY (Attribution)
- ✅ Kostenlos
- ⚠️ Attribution nötig (Quelle erwähnen)
- ✅ Kommerzielle Nutzung erlaubt
- **Akzeptabel, aber Attribution nötig**

### Andere Lizenzen
- ⚠️ Immer prüfen!
- ⚠️ Kommerzielle Nutzung möglicherweise nicht erlaubt

## 🚀 Schnellstart

### Option 1: Poly Haven Modell verwenden

1. Gehen Sie zu https://polyhaven.com/models
2. Suchen Sie nach "house"
3. Wählen Sie ein Modell
4. Download → GLB Format
5. Datei in `public/models/house.glb` speichern
6. Fertig! (Code ist bereits vorbereitet)

### Option 2: Sketchfab Modell verwenden

1. Gehen Sie zu https://sketchfab.com/
2. Suchen Sie nach "modern house"
3. Filter: License → CC0
4. Download → GLB Format
5. Datei in `public/models/house.glb` speichern
6. Fertig!

### Option 3: Externe URL verwenden

```tsx
// In App.tsx
<Environment 
  config={config} 
  houseModelUrl="https://example.com/models/house.glb"
/>
```

## 🐛 Troubleshooting

### Problem: Modell wird nicht angezeigt
- ✅ Prüfen Sie die Dateipfade
- ✅ Prüfen Sie die Browser-Konsole (F12)
- ✅ Prüfen Sie die Skalierung (vielleicht zu klein/groß)

### Problem: Modell ist zu groß/klein
- ✅ Skalierung in `HouseModel.tsx` anpassen
- ✅ `scale={0.5}` für kleiner
- ✅ `scale={2}` für größer

### Problem: Modell lädt langsam
- ✅ Dateigröße reduzieren (in Blender optimieren)
- ✅ Polygone reduzieren
- ✅ Texturen komprimieren

## 💡 Tipps

1. **GLB Format bevorzugen** - Alles in einer Datei
2. **Dateigröße < 5MB** - Für schnelles Laden
3. **CC0 Lizenzen bevorzugen** - Keine Attribution nötig
4. **Modell testen** - In Online-Viewer vor Integration prüfen
5. **Skalierung anpassen** - Modell sollte zur Terrasse passen

## 📚 Nützliche Links

- **GLB Viewer:** https://gltf-viewer.donmccurdy.com/
- **Poly Haven:** https://polyhaven.com/models
- **Sketchfab:** https://sketchfab.com/
- **Blender:** https://www.blender.org/ (kostenlos für Optimierung)

