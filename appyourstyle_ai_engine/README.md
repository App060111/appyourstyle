# AppYourStyle AI Engine ZIP

Dieses Paket enthält eine direkt nutzbare Grundstruktur für die AppYourStyle-KI-Verbindung.

## Inhalt

- `prompts/master_prompt.md` – Hauptprompt für die KI
- `modules/fit_engine.js` – Größen- und Passformlogik
- `modules/style_engine.js` – Stil- und Outfitbewertung
- `modules/outfit_composer.js` – Zusammenführung der Artikel
- `modules/render_engine.js` – Prompt für Bildgenerierung
- `api/appyourstyle_ai_endpoint.js` – Beispiel-Endpunkt
- `examples/request_example.json` – Beispielinput
- `examples/response_schema.json` – Zielausgabe
- `config/env.example` – benötigte Umgebungsvariablen
- `docs/uebergeordnete_anmeldungen.md` – Integrations- und Login-Hinweise

## Ziel

AppYourStyle kann Artikel aus verschiedenen Websites aufnehmen, über KI zusammenführen, Größenunterschiede zwischen Labels bewerten und daraus ein einheitliches Fashion-Bild inklusive Größenempfehlung, Style Score und Shopping-Struktur erzeugen.

## Nächster technischer Schritt

Die Dateien können in ein bestehendes Node/Next.js Backend übernommen werden. Danach müssen echte Schnittstellen für OpenAI, Produktfeeds, Affiliate-Links und Nutzerprofile angeschlossen werden.
