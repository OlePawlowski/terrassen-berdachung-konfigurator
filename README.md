# Terrassendach Konfigurator

Ein interaktiver 3D-Konfigurator für Terrassenüberdachungen, mit dem Kunden individuelle Terrassendächer konfigurieren können.

## Features

- 🎨 **3D-Visualisierung** - Interaktive 3D-Darstellung mit Three.js
- ⚙️ **Konfigurierbare Parameter**:
  - Länge (200-1000 cm)
  - Tiefe (200-600 cm)
  - Höhe vorne/hinten (für geneigtes Dach)
  - Material (Anthrazit, Weiß, Schwarz, Braun)
  - Dachtyp (Transparent, Polycarbonat, Opak)
  - Wandüberstand
- 💰 **Preisberechnung** - Automatische Preisberechnung basierend auf Konfiguration
- 📱 **Responsive Design** - Funktioniert auf Desktop und Tablet

## Installation

```bash
npm install
```

## Entwicklung

```bash
npm run dev
```

Die Anwendung läuft dann auf `http://localhost:5173`

## Build

```bash
npm run build
```

## Technologien

- **React** - UI Framework
- **TypeScript** - Type Safety
- **Three.js** - 3D Visualisierung
- **@react-three/fiber** - React Renderer für Three.js
- **@react-three/drei** - Nützliche Three.js Komponenten
- **Vite** - Build Tool

## Projektstruktur

```
src/
├── components/
│   ├── TerrassendachModel.tsx  # 3D Modell Komponente
│   ├── ConfigPanel.tsx         # Konfigurationspanel
│   └── ConfigPanel.css          # Styles für ConfigPanel
├── types.ts                     # TypeScript Typen
├── App.tsx                      # Hauptkomponente
├── App.css                      # App Styles
├── main.tsx                     # Entry Point
└── index.css                    # Globale Styles
```

## Verwendung

1. Öffnen Sie den Konfigurator im Browser
2. Passen Sie die Parameter im rechten Panel an
3. Die 3D-Visualisierung aktualisiert sich automatisch
4. Der Preis wird basierend auf Ihrer Konfiguration berechnet
5. Klicken Sie auf "In den Warenkorb" um die Konfiguration zu speichern

## Anpassungen

### Preise anpassen

Die Preisberechnung kann in `src/components/ConfigPanel.tsx` in der Funktion `calculatePrice` angepasst werden.

### Materialien hinzufügen

Neue Materialien können in `src/types.ts` und `src/components/TerrassendachModel.tsx` hinzugefügt werden.

### Dachtypen erweitern

Neue Dachtypen können in `src/types.ts` und den entsprechenden Komponenten hinzugefügt werden.



