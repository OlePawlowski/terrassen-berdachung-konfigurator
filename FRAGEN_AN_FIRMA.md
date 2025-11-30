# Fragen für die Firma - 3D-Modell Integration

## 📋 Checkliste: Was Sie von Ihrer Firma benötigen

### 1. Grundlegende Fragen zu vorhandenen Daten

**Frage 1: Welche CAD-Software verwenden Sie?**
- [ ] SolidWorks
- [ ] AutoCAD
- [ ] Inventor
- [ ] SketchUp
- [ ] Revit
- [ ] Fusion 360
- [ ] Andere: _______________

**Frage 2: Haben Sie bereits 3D-Modelle der Terrassenüberdachungen?**
- [ ] Ja, als 3D-Modell
- [ ] Nein, nur 2D-Zeichnungen
- [ ] Nur technische Zeichnungen/Pläne
- [ ] Unklar

**Frage 3: In welchem Format liegen die 3D-Modelle vor?**
- [ ] Native CAD-Format (z.B. .sldprt, .dwg, .ipt)
- [ ] STEP (.step, .stp)
- [ ] IGES (.iges, .igs)
- [ ] OBJ (.obj)
- [ ] STL (.stl)
- [ ] FBX (.fbx)
- [ ] 3DS (.3ds)
- [ ] Andere: _______________

### 2. Fragen zu Export-Möglichkeiten

**Frage 4: Können Sie die Modelle exportieren?**
- [ ] Ja, als STEP/IGES
- [ ] Ja, als OBJ/STL
- [ ] Ja, als GLTF/GLB (unwahrscheinlich, aber möglich)
- [ ] Nein, nur native Formate
- [ ] Unklar

**Frage 5: Wer hat Zugriff auf die CAD-Software für Export?**
- Name/Abteilung: _______________
- Kontakt: _______________

### 3. Fragen zu Modell-Details

**Frage 6: Wie detailliert sind die Modelle?**
- [ ] Sehr detailliert (alle Komponenten einzeln)
- [ ] Vereinfacht (nur Hauptkomponenten)
- [ ] Nur Rahmenstruktur
- [ ] Unklar

**Frage 7: Enthalten die Modelle Material-Informationen?**
- [ ] Ja, Materialien sind zugewiesen
- [ ] Nein, nur Geometrie
- [ ] Teilweise

**Frage 8: Gibt es verschiedene Varianten als separate Modelle?**
- [ ] Ja, verschiedene Größen
- [ ] Ja, verschiedene Materialien
- [ ] Ja, Wandmontage vs. freistehend
- [ ] Nein, nur ein Basis-Modell

### 4. Fragen zu Bau-Zeichnungen

**Frage 9: Falls nur 2D-Zeichnungen vorhanden sind:**
- Welche Software für die Zeichnungen? _______________
- Können diese in 3D umgewandelt werden? _______________
- Wer könnte das machen? _______________

**Frage 10: Gibt es technische Zeichnungen mit Maßen?**
- [ ] Ja, vollständige technische Zeichnungen
- [ ] Ja, aber unvollständig
- [ ] Nein

### 5. Praktische Fragen

**Frage 11: Wer ist der beste Ansprechpartner für 3D-Daten?**
- Name: _______________
- Abteilung: _______________
- E-Mail: _______________
- Telefon: _______________

**Frage 12: Wie schnell können wir die Daten erhalten?**
- Zeitrahmen: _______________

**Frage 13: Gibt es Datenschutz/Geheimhaltungsprobleme?**
- [ ] Nein
- [ ] Ja, aber lösbar
- [ ] Unklar

---

## 📧 Beispiel-E-Mail an die Firma

**Betreff: 3D-Modelle für Online-Konfigurator**

Sehr geehrte Damen und Herren,

für die Entwicklung unseres Online-Konfigurators für Terrassenüberdachungen benötigen wir Zugriff auf 3D-Modelle unserer Produkte.

**Konkret benötigen wir:**
1. 3D-Modelle der Terrassenüberdachungen (falls vorhanden)
2. Informationen über das verwendete CAD-Format
3. Möglichkeit, die Modelle zu exportieren (idealerweise als STEP, OBJ oder STL)

**Fragen:**
- Welche CAD-Software verwenden Sie für die Konstruktion?
- In welchem Format liegen die 3D-Modelle vor?
- Können Sie die Modelle exportieren? Falls ja, in welchen Formaten?
- Wer ist der beste Ansprechpartner für technische Daten?

**Ziel:**
Die Modelle sollen in einem Web-basierten Konfigurator verwendet werden, damit Kunden ihre Terrassenüberdachung online visualisieren können.

Vielen Dank für Ihre Unterstützung!

Mit freundlichen Grüßen
[Ihr Name]

---

## 🎯 Was Sie wirklich brauchen (Prioritäten)

### ✅ Minimum (funktioniert immer):
1. **STEP oder IGES Datei** - Kann in Blender importiert werden
2. **OBJ oder STL Datei** - Direkt verwendbar, aber weniger Details
3. **Native CAD-Datei** - Kann mit entsprechender Software exportiert werden

### ⭐ Ideal (beste Qualität):
1. **GLB/GLTF Datei** - Direkt für Web verwendbar (selten vorhanden)
2. **FBX Datei** - Gut für Web, kann konvertiert werden
3. **Modell mit Materialien** - Für realistische Darstellung

### ❌ Nicht ideal, aber machbar:
1. **Nur 2D-Zeichnungen** - Müssen in 3D umgewandelt werden (mehr Arbeit)
2. **Nur Fotos** - Kann als Referenz dienen, aber Modell muss neu erstellt werden

---

## 🔧 Typische CAD-Formate und ihre Verwendbarkeit

### Sehr gut für Web (nach Konvertierung):
- ✅ **STEP (.step, .stp)** - Industriestandard, sehr gut konvertierbar
- ✅ **IGES (.iges, .igs)** - Älterer Standard, aber gut konvertierbar
- ✅ **OBJ (.obj)** - Direkt verwendbar, aber oft ohne Materialien
- ✅ **FBX (.fbx)** - Gut für Web nach Konvertierung

### Gut nach Konvertierung:
- ⚠️ **STL (.stl)** - Nur Geometrie, keine Materialien
- ⚠️ **Native CAD-Formate** - Benötigen entsprechende Software zum Export

### Benötigt mehr Arbeit:
- ❌ **Nur 2D-Zeichnungen** - Muss in 3D umgewandelt werden
- ❌ **Nur PDFs/Bilder** - Kann als Referenz dienen

---

## 💡 Tipps für das Gespräch

### Wenn die Firma sagt: "Wir haben nur Bau-Zeichnungen"
**Antwort:** 
- "Das ist okay! Können Sie mir die Zeichnungen als PDF oder DWG schicken? Ich kann daraus ein 3D-Modell erstellen."
- "Oder: Können Sie mir die wichtigsten Maße geben? Dann erstelle ich ein vereinfachtes Modell."

### Wenn die Firma sagt: "Wir verwenden [CAD-Software]"
**Antwort:**
- "Perfekt! Können Sie die Modelle als STEP oder OBJ exportieren? Das ist ein Standard-Format, das ich verwenden kann."

### Wenn die Firma sagt: "Die Modelle sind sehr komplex/detailliert"
**Antwort:**
- "Das ist kein Problem! Ich kann das Modell vereinfachen, sodass es für den Web-Konfigurator optimiert ist. Wichtig sind hauptsächlich die Hauptkomponenten (Pfosten, Balken, Dach)."

### Wenn die Firma sagt: "Wir haben keine 3D-Modelle"
**Antwort:**
- "Kein Problem! Ich kann ein Modell basierend auf Ihren technischen Zeichnungen oder Maßen erstellen. Haben Sie technische Zeichnungen mit allen wichtigen Maßen?"

---

## 📦 Was Sie konkret anfragen sollten

**Kurzfassung für schnelle Anfrage:**

```
Hallo [Name],

für unseren Online-Konfigurator benötige ich:

1. 3D-Modelle der Terrassenüberdachungen (falls vorhanden)
   → Format: STEP, OBJ, STL oder natives CAD-Format

ODER

2. Technische Zeichnungen mit allen Maßen
   → Format: PDF, DWG oder ähnlich

Was haben Sie verfügbar?

Vielen Dank!
```

---

## ✅ Checkliste nach Erhalt der Daten

Nachdem Sie die Daten erhalten haben:

- [ ] Format identifiziert
- [ ] Dateigröße geprüft (< 50MB ideal)
- [ ] Modell in Viewer geöffnet (z.B. Blender, Online-Viewer)
- [ ] Komplexität geprüft (Anzahl Polygone)
- [ ] Materialien geprüft (falls vorhanden)
- [ ] Skalierung geprüft (cm vs. Meter)
- [ ] Konvertierung zu GLB geplant

---

## 🆘 Falls die Firma keine Daten hat

**Alternative Ansätze:**

1. **Vereinfachtes Modell erstellen**
   - Basierend auf Standard-Maßen
   - Kann später verfeinert werden

2. **Fotos als Referenz verwenden**
   - Modell nach Fotos modellieren
   - Für erste Version ausreichend

3. **Externe Hilfe**
   - 3D-Modellierer beauftragen
   - Basierend auf technischen Zeichnungen

---

## 📞 Nächste Schritte

1. ✅ Diese Fragenliste durchgehen
2. ✅ E-Mail an Firma senden
3. ✅ Daten erhalten und Format prüfen
4. ✅ Konvertierung planen (siehe MODELL_INTEGRATION.md)
5. ✅ Modell integrieren

