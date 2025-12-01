# Embed-Variante des Terrassendach Konfigurators

Diese Anleitung erklärt, wie Sie die Embed-Variante des Konfigurators in Ihre Website integrieren können.

## Entwicklung

Um die Embed-Variante lokal zu testen:

```bash
npm run dev
```

Dann öffnen Sie im Browser: `http://localhost:5173/embed.html`

## Produktion

Nach dem Build können Sie die Embed-Variante wie folgt einbinden:

### Option 1: Iframe-Einbindung

```html
<iframe 
  src="https://ihre-domain.de/embed.html" 
  width="100%" 
  height="800px" 
  frameborder="0"
  style="border: none;"
></iframe>
```

### Option 2: Direkte Integration

Wenn Sie die Build-Dateien auf Ihrem Server haben:

1. Kopieren Sie die Build-Dateien aus dem `dist`-Ordner
2. Erstellen Sie eine HTML-Seite mit einem Container:

```html
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Konfigurator</title>
    <style>
        #konfigurator-container {
            width: 100%;
            height: 800px;
            border: none;
        }
    </style>
</head>
<body>
    <div id="konfigurator-container">
        <!-- Hier wird der Konfigurator geladen -->
    </div>
    
    <!-- Laden Sie die JavaScript-Dateien aus dem Build -->
    <script type="module" src="./assets/embed-[hash].js"></script>
</body>
</html>
```

## Unterschiede zur normalen Version

- **Kein Header**: Die Embed-Variante hat keine Überschrift oder Header-Bereich
- **Kompakteres Layout**: Weniger Padding für bessere Integration
- **Gleiche Funktionalität**: Alle Konfigurationsoptionen bleiben erhalten

## Anpassungen

Falls Sie das Design anpassen möchten, können Sie die Datei `src/EmbedApp.css` bearbeiten.

