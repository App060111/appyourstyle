# Hinweise für übergeordnete Anmeldungen und Integrationen

## 1. OpenAI / KI-Anbindung

Benötigt wird ein API-Key für Textlogik und Bildgenerierung.

Empfohlene Nutzung:

- Textmodell für Fit Engine, Style Engine und Outfit Composer
- Bildmodell für Render Engine
- getrennte System-Prompts pro Modul
- Logging der Confidence Scores
- keine sensiblen Kundendaten dauerhaft speichern ohne Einwilligung

## 2. Shop- und Produktdaten

Für echte Produktdaten sollten Shops über offizielle APIs, Affiliate-Netzwerke oder Produktfeeds angebunden werden.

Benötigte Daten pro Artikel:

- Produktname
- Marke
- Shop
- Preis
- Produkt-URL
- Bild-URL
- verfügbare Größen
- Größentabelle
- Material
- Fit-Angabe
- Kategorie

## 3. Affiliate- und Unified-Checkout-Struktur

Für zusammengeführte Kauf-Links sind nötig:

- Affiliate-Partnerkonto oder Commerce-API
- Produktfeed-Anbindung
- Tracking-ID pro Shop
- Warenkorb-Weiterleitung oder Sammel-Checkout-Logik

Wichtig: Ein echter gemeinsamer Checkout über mehrere externe Shops ist nur möglich, wenn die Shops dies über API, Marketplace-Struktur oder Partnervertrag erlauben. Andernfalls kann AppYourStyle einen einheitlichen Outfit-Link erzeugen, der alle Produkte gesammelt anzeigt und zu den jeweiligen Shops weiterleitet.

## 4. Nutzerkonto / Login

Empfohlene übergeordnete Login-Funktionen:

- E-Mail Login
- Apple Login
- Google Login
- optional TikTok/Instagram Login für Style-Import
- Nutzerprofil mit Körpermaßen
- Style-Vorlieben
- gespeicherte Outfits
- Größenhistorie

## 5. Datenschutz

Körperdaten, Style-Daten und Bilddaten sind besonders sensibel. AppYourStyle sollte klare Einwilligungen einholen für:

- Speicherung von Körpermaßen
- Nutzung von Profilbildern
- Verarbeitung durch KI-Modelle
- personalisierte Produktempfehlungen
- Affiliate-Tracking

## 6. Rechtliche Hinweise zu Markenbildern

Produktbilder, Logos und Markenmerkmale dürfen nur im Rahmen der jeweiligen Shop-, API-, Affiliate- und Lizenzbedingungen verarbeitet werden. Für kommerzielle Nutzung sollte AppYourStyle bevorzugt offizielle Produktfeeds und genehmigte Bildquellen nutzen.

## 7. Empfohlene technische Architektur

Frontend:

- Artikel-URL Eingabefelder für 4 Shops
- Upload-/Import-Funktion für Produktbilder
- Nutzerprofil mit Körperdaten
- Outfit-Vorschau
- Größenempfehlung
- Sammel-Link / Outfit-Link

Backend:

- Product Parser
- Size Normalizer
- Fit Engine
- Style Engine
- Outfit Composer
- Render Engine
- Affiliate Link Builder
- User Profile Service

## 8. Vier nutzbare Website-Felder

Im Frontend sollten mindestens vier Felder verfügbar sein:

1. Produkt-Link Oberteil
2. Produkt-Link Hose/Rock
3. Produkt-Link Schuhe
4. Produkt-Link Accessoire/Jacke

Jedes Feld sollte automatisch extrahieren:

- Marke
- Produktname
- Preis
- verfügbare Größen
- Hauptbild
- Material
- Fit
- Shop-Domain
