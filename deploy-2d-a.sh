#!/usr/bin/env bash
# =============================================================================
# Phase 2D-A — Produktions-Deploy-Script
# =============================================================================
# Ausfuehren auf dem Produktionsserver:
#   cd /var/www/clients/client1/web5/web && bash deploy-2d-a.sh
#
# SICHERHEIT:
# - Kein db push --force-reset
# - Kein DB-Delete
# - Backup vor Migration
# - Abbruch bei Fehler
# =============================================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ok()   { echo -e "${GREEN}✔ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠ $1${NC}"; }
fail() { echo -e "${RED}✖ $1${NC}"; exit 1; }
sep()  { echo -e "\n${YELLOW}═══ $1 ═══${NC}"; }

# ---------------------------------------------------------------------------
sep "AUFGABE 1: Serverstatus"
# ---------------------------------------------------------------------------
echo "Projektordner: $(pwd)"
echo "Branch:        $(git branch --show-current)"
echo "Commit:        $(git log -1 --oneline)"
GIT_STATUS=$(git status --short)
if [ -z "$GIT_STATUS" ]; then
  ok "Working tree: clean"
else
  warn "Working tree hat Aenderungen:"
  echo "$GIT_STATUS"
fi

if grep -q 'DATABASE_URL' .env 2>/dev/null; then
  ok "DATABASE_URL vorhanden"
  DB_PATH=$(grep 'DATABASE_URL' .env | sed 's/.*file://' | tr -d '"' | tr -d "'" )
  echo "DB-Pfad (aus .env): $DB_PATH"
else
  fail "DATABASE_URL fehlt in .env"
fi

# Resolve DB path
if [[ "$DB_PATH" == ./* ]]; then
  DB_FILE="$(pwd)/${DB_PATH#./}"
else
  DB_FILE="$DB_PATH"
fi

if [ -f "$DB_FILE" ]; then
  DB_SIZE=$(ls -lh "$DB_FILE" | awk '{print $5}')
  ok "DB-Datei existiert: $DB_FILE ($DB_SIZE)"
else
  # Try common locations
  for P in data/mosaroma.db prisma/dev.db dev.db; do
    if [ -f "$P" ]; then
      DB_FILE="$P"
      DB_SIZE=$(ls -lh "$P" | awk '{print $5}')
      ok "DB-Datei gefunden: $P ($DB_SIZE)"
      break
    fi
  done
  if [ ! -f "$DB_FILE" ]; then
    fail "Keine DB-Datei gefunden"
  fi
fi

# ---------------------------------------------------------------------------
sep "AUFGABE 2: Backup"
# ---------------------------------------------------------------------------
BACKUP_NAME="${DB_FILE}.backup-$(date +%Y%m%d-%H%M%S)"
cp "$DB_FILE" "$BACKUP_NAME"
BACKUP_SIZE=$(ls -lh "$BACKUP_NAME" | awk '{print $5}')
ok "Backup erstellt: $BACKUP_NAME ($BACKUP_SIZE)"

if [ "$BACKUP_SIZE" = "0" ]; then
  fail "Backup hat Groesse 0 — Abbruch"
fi

# ---------------------------------------------------------------------------
sep "AUFGABE 3: Code aktualisieren"
# ---------------------------------------------------------------------------
git fetch origin
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "claude/add-logo-i2yFH" ]; then
  echo "Wechsle von '$CURRENT_BRANCH' zu 'claude/add-logo-i2yFH'..."
  git checkout claude/add-logo-i2yFH
fi
git pull origin claude/add-logo-i2yFH
LATEST_COMMIT=$(git log -1 --oneline)
echo "Aktueller Commit: $LATEST_COMMIT"
if echo "$LATEST_COMMIT" | grep -q "connect public contact form"; then
  ok "Phase 2D-A Commit vorhanden"
else
  warn "Commit-Message entspricht nicht der Erwartung — bitte pruefen"
fi

# ---------------------------------------------------------------------------
sep "AUFGABE 4: Dependencies installieren"
# ---------------------------------------------------------------------------
if [ -f package-lock.json ] && git diff --quiet HEAD -- package-lock.json 2>/dev/null; then
  echo "package-lock.json ist sauber — verwende npm ci"
  npm ci
else
  echo "package-lock.json geaendert — verwende npm install"
  npm install
fi
ok "Dependencies installiert"

echo "Generiere Prisma Client..."
npx prisma generate
ok "Prisma Client generiert"

# ---------------------------------------------------------------------------
sep "AUFGABE 5: Migration anwenden"
# ---------------------------------------------------------------------------
echo "Fuehre prisma migrate deploy aus..."
echo "(KEIN db push --force-reset!)"
if npx prisma migrate deploy 2>&1; then
  ok "Migration erfolgreich"
else
  fail "Migration fehlgeschlagen — STOPP. Backup vorhanden: $BACKUP_NAME"
fi

# ---------------------------------------------------------------------------
sep "AUFGABE 6: Seed ausfuehren"
# ---------------------------------------------------------------------------
if npx prisma db seed 2>&1; then
  ok "Seed erfolgreich"
else
  warn "Seed hatte Fehler — bitte Ausgabe pruefen"
fi

# Datenbank-Checks via Prisma
echo ""
echo "Pruefe Datenbank-Inhalte..."
npx tsx -e "
import { PrismaClient } from './lib/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const raw = process.env.DATABASE_URL ?? 'file:./dev.db';
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

async function check() {
  const productCount = await prisma.product.count();
  console.log('Produkte: ' + productCount + (productCount === 209 ? ' ✔' : ' ⚠ Erwartet: 209'));

  const form = await prisma.form.findUnique({
    where: { slug: 'contact' },
    include: { fields: { orderBy: { order: 'asc' } } },
  });

  if (form) {
    console.log('Form contact vorhanden: ja');
    console.log('Form contact isActive: ' + (form.isActive ? 'ja' : 'nein'));
    console.log('FormFields Anzahl: ' + form.fields.length + (form.fields.length === 7 ? ' ✔' : ' ⚠ Erwartet: 7'));
    console.log('Felder: ' + form.fields.map(f => f.name).join(', '));
  } else {
    console.log('Form contact vorhanden: NEIN ⚠');
  }

  // Check meta column exists by creating and deleting a test
  try {
    const testSub = await prisma.formSubmission.create({
      data: { formId: form!.id, data: '{}', meta: '{\"test\":true}' },
    });
    await prisma.formSubmission.delete({ where: { id: testSub.id } });
    console.log('FormSubmission.meta Spalte: vorhanden ✔');
  } catch (e) {
    console.log('FormSubmission.meta Spalte: FEHLT ⚠ — ' + (e as Error).message);
  }
}
check().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
"

# ---------------------------------------------------------------------------
sep "AUFGABE 7: SMTP-Konfiguration pruefen"
# ---------------------------------------------------------------------------
check_env() {
  if grep -qE "^${1}=.+" .env 2>/dev/null; then
    echo "$1 gesetzt: ja"
  else
    echo "$1 gesetzt: nein"
  fi
}
check_env SMTP_HOST
check_env SMTP_PORT
check_env SMTP_USER
check_env SMTP_PASS
check_env SMTP_FROM
check_env CONTACT_FORM_RECIPIENT_FALLBACK

if ! grep -qE "^SMTP_HOST=.+" .env 2>/dev/null; then
  warn "SMTP nicht konfiguriert — Mail wird uebersprungen, Submissions funktionieren trotzdem"
fi

# ---------------------------------------------------------------------------
sep "AUFGABE 8: Build"
# ---------------------------------------------------------------------------
if npm run build 2>&1; then
  ok "Build erfolgreich"
else
  fail "Build fehlgeschlagen — STOPP"
fi

# ---------------------------------------------------------------------------
sep "AUFGABE 9: PM2 Neustart"
# ---------------------------------------------------------------------------
echo "PM2 Status vor Neustart:"
pm2 status || warn "pm2 nicht gefunden oder kein Prozess"

# Try known app names
APP_NAME=""
for NAME in mosaroma mrweb2 web; do
  if pm2 describe "$NAME" &>/dev/null; then
    APP_NAME="$NAME"
    break
  fi
done

if [ -z "$APP_NAME" ]; then
  warn "Kein bekannter PM2-App-Name gefunden. Bitte manuell: pm2 restart <app-name>"
  echo "Verfuegbare PM2-Prozesse:"
  pm2 list
else
  pm2 restart "$APP_NAME"
  ok "PM2 App '$APP_NAME' neu gestartet"
  echo ""
  echo "Letzte Logs (30 Zeilen):"
  sleep 3
  pm2 logs "$APP_NAME" --lines 30 --nostream
fi

# ---------------------------------------------------------------------------
sep "AUFGABE 10-14: HTTP Tests"
# ---------------------------------------------------------------------------
SITE_URL="${SITE_URL:-https://web.mosaroma.de}"

echo "Teste $SITE_URL/kontakt ..."
HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' "$SITE_URL/kontakt" --max-time 15)
if [ "$HTTP_CODE" = "200" ]; then
  ok "/kontakt HTTP $HTTP_CODE"
else
  warn "/kontakt HTTP $HTTP_CODE — erwartet 200"
fi

# Check form fields in HTML
echo "Pruefe Formularfelder..."
KONTAKT_HTML=$(curl -s "$SITE_URL/kontakt" --max-time 15)
for FIELD in 'name="name"' 'name="email"' 'name="company"' 'name="phone"' 'name="subject"' 'name="message"' 'name="privacy"'; do
  if echo "$KONTAKT_HTML" | grep -q "$FIELD"; then
    ok "Feld $FIELD gefunden"
  else
    warn "Feld $FIELD NICHT gefunden"
  fi
done

if echo "$KONTAKT_HTML" | grep -q "btn-primary"; then
  ok "Submit Button sichtbar"
else
  warn "Submit Button nicht gefunden"
fi

# Test: empty required field
echo ""
echo "Teste Validierung: leeres Pflichtfeld..."
RESP=$(curl -s -X POST "$SITE_URL/api/forms/contact/submit" \
  -H "Content-Type: application/json" \
  -d '{"name":"","email":"test@test.de","message":"Test","privacy":true,"_t":1000000000000}')
if echo "$RESP" | grep -qi "pflichtfeld"; then
  ok "Pflichtfeld-Validierung funktioniert"
else
  warn "Pflichtfeld-Antwort: $RESP"
fi

# Test: invalid email
echo "Teste Validierung: ungueltige E-Mail..."
RESP=$(curl -s -X POST "$SITE_URL/api/forms/contact/submit" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"ungueltig","message":"Test","privacy":true,"_t":1000000000000}')
if echo "$RESP" | grep -qi "mail"; then
  ok "E-Mail-Validierung funktioniert"
else
  warn "E-Mail-Antwort: $RESP"
fi

# Test: consent missing
echo "Teste Validierung: Consent fehlt..."
RESP=$(curl -s -X POST "$SITE_URL/api/forms/contact/submit" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.de","message":"Test","privacy":false,"_t":1000000000000}')
if echo "$RESP" | grep -qi "akzeptiert\|consent\|Datenschutz"; then
  ok "Consent-Validierung funktioniert"
else
  warn "Consent-Antwort: $RESP"
fi

# Test: valid submission
echo "Teste: gueltige Submission..."
RESP=$(curl -s -X POST "$SITE_URL/api/forms/contact/submit" \
  -H "Content-Type: application/json" \
  -d '{"name":"Deploy-Test","email":"deploy-test@mosaroma.de","company":"Mosaroma","phone":"","subject":"Phase 2D-A Test","message":"Automatischer Test nach Deployment.","privacy":true,"_t":1000000000000}')
if echo "$RESP" | grep -q '"success":true'; then
  ok "Submission erfolgreich gespeichert"
else
  warn "Submission-Antwort: $RESP"
fi

# Test: nonexistent form
echo "Teste: nicht existierendes Formular..."
RESP=$(curl -s -X POST "$SITE_URL/api/forms/nonexistent/submit" \
  -H "Content-Type: application/json" \
  -d '{"_t":1000000000000}')
if echo "$RESP" | grep -q "nicht gefunden"; then
  ok "404 fuer unbekanntes Formular"
fi

# ---------------------------------------------------------------------------
sep "AUFGABE 17: Dokumentation pruefen"
# ---------------------------------------------------------------------------
if [ -f docs/admin-cms.md ]; then
  ok "docs/admin-cms.md vorhanden"
  if grep -q "Phase 2D-A" docs/admin-cms.md; then
    ok "Phase 2D-A Abschnitt dokumentiert"
  else
    warn "Phase 2D-A Abschnitt fehlt in docs/admin-cms.md"
  fi
fi

if grep -q "SMTP_HOST" .env.example 2>/dev/null; then
  ok ".env.example enthaelt SMTP Variablen"
else
  warn ".env.example fehlt SMTP Variablen"
fi

# Check no secrets in git
if git log -1 --format=%B | grep -iE "password|secret|smtp_pass" >/dev/null 2>&1; then
  warn "Commit-Message koennte Secrets enthalten"
else
  ok "Keine Secrets in letzter Commit-Message"
fi

# ---------------------------------------------------------------------------
sep "AUFGABE 18: Abschlussbericht"
# ---------------------------------------------------------------------------
echo ""
echo "1.  Branch auf Server:              $(git branch --show-current)"
echo "2.  Commit auf Server:              $(git log -1 --oneline)"
echo "3.  Produktions-DB Backup erstellt:  ja"
echo "4.  Backup-Pfad:                    $BACKUP_NAME"
echo "5.  Dependencies installiert:        ja"
echo "6.  Prisma generate:                 ja"
echo "7.  migrate deploy Ergebnis:         siehe oben"
echo "8.  Seed Ergebnis:                   siehe oben"
echo "9.  Produkte weiterhin 209:          siehe DB-Check oben"
echo "10. contact Form vorhanden:          siehe DB-Check oben"
echo "11. contact FormFields Anzahl:       siehe DB-Check oben"
echo "12. FormSubmission.meta vorhanden:   siehe DB-Check oben"
echo "13. SMTP konfiguriert:               $(grep -qE '^SMTP_HOST=.+' .env 2>/dev/null && echo 'ja' || echo 'nein')"
echo "14. npm run build Ergebnis:          erfolgreich (sonst waere Script abgebrochen)"
echo "15. PM2 Neustart:                    ${APP_NAME:-manuell}"
echo "16. /kontakt HTTP 200:               $HTTP_CODE"
echo "17. DB-Form auf /kontakt sichtbar:   siehe Feld-Check oben"
echo "18. Validierung getestet:            ja (4 Szenarien)"
echo "19. Submission gespeichert:          siehe Test oben"
echo "20. Admin Submissions getestet:      manuell pruefen: ${SITE_URL}/admin/forms/submissions"
echo "21. Verhalten ohne SMTP getestet:    $(grep -qE '^SMTP_HOST=.+' .env 2>/dev/null && echo 'SMTP ist gesetzt' || echo 'ja — Mail wird uebersprungen')"
echo "22. Verhalten mit SMTP getestet:     $(grep -qE '^SMTP_HOST=.+' .env 2>/dev/null && echo 'ja' || echo 'nein — SMTP nicht konfiguriert')"
echo "23. Honeypot/Rate Limit geprueft:    Code-seitig aktiv (kein Spam-Test auf Produktion)"
echo "24. Offene Fehler:                   siehe Warnungen oben"
echo "25. Naechste empfohlene Phase:       Phase 2D-B (Downloads/Measurements/News Frontend)"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo " Manuelle Pruefung empfohlen:"
echo " 1. ${SITE_URL}/kontakt — Formular visuell pruefen"
echo " 2. ${SITE_URL}/admin/forms/submissions — Test-Submission pruefen"
echo " 3. ${SITE_URL}/admin/forms/contact — Editor-Felder pruefen"
echo " 4. Falls SMTP gesetzt: Empfaenger-Postfach pruefen"
echo " 5. AUFGABE 16 (inactive Form) — nur manuell im Admin testen"
echo "═══════════════════════════════════════════════════════════"
