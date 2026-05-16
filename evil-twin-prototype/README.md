# Πτυχιακή Εργασία — Επίθεση Evil Twin Access Point με Captive Portal

> **Φοιτητής:** Χαράλαμπος Στίκος
> **Αντικείμενο:** Κοινωνική Μηχανική σε Κινητές Συσκευές
> **Περιβάλλον:** Kali Linux | Node.js | hostapd | dnsmasq | iptables

---

## Περιγραφή

Η επίθεση **Evil Twin** αποτελεί μία από τις πιο διαδεδομένες τεχνικές κοινωνικής μηχανικής σε ασύρματα δίκτυα. Ο επιτιθέμενος δημιουργεί ένα ψεύτικο σημείο πρόσβασης (Access Point) που μιμείται νόμιμο δίκτυο Wi-Fi, ώστε να παρασύρει θύματα να συνδεθούν σε αυτό. Μόλις συνδεθεί μια συσκευή, όλη η κίνησή της διέρχεται μέσω του συστήματος του επιτιθέμενου.

Στο παρόν πρωτότυπο, η επίθεση υλοποιείται ως εξής:

1. Δημιουργείται ένα ανοιχτό Wi-Fi δίκτυο με το όνομα **"GUESS_Guest"**, σχεδιασμένο να μιμείται το εταιρικό δίκτυο επισκεπτών της GUESS, Inc.
2. Κάθε συσκευή που συνδέεται λαμβάνει IP από τον τοπικό DHCP server και ορίζει ως DNS server το `10.0.0.1` (τον επιτιθέμενο)
3. Το λειτουργικό σύστημα της συσκευής ανιχνεύει αυτόματα την ύπαρξη Captive Portal — είτε απευθείας μέσω της παραμέτρου DHCP option 114 (RFC 8910), είτε μέσω HTTP probe — και εμφανίζει την ειδοποίηση **"Σύνδεση στο δίκτυο"** χωρίς να χρειαστεί ο χρήστης να ανοίξει browser
4. Ο χρήστης βλέπει μία πειστική σελίδα σύνδεσης εταιρικού guest network με το branding της GUESS (λευκό φόντο, κόκκινο τριγωνικό λογότυπο, GUESS? wordmark) και επιλογές σύνδεσης μέσω **Google**, **Microsoft**, **Apple** ή ως **επισκέπτης** (ονοματεπώνυμο + email)
5. Τα εισαχθέντα στοιχεία καταγράφονται στο αρχείο `captures.txt` και ο χρήστης αποκτά κανονική πρόσβαση στο διαδίκτυο μέσω δυναμικής ενημέρωσης των κανόνων `iptables`

---

## Αρχιτεκτονική Συστήματος

```
[ Συσκευή Θύματος ]
        |
        |  Wi-Fi (Open, SSID: GUESS_Guest)
        |
[ wlan0 — 10.0.0.1 ]  ← Εξωτερικός WiFi Adapter (AP Mode)
        |
   +---------+----------+
   |         |          |
hostapd   dnsmasq    iptables
(AP)      (DHCP/DNS) (Firewall/NAT)
        |
[ Node.js Server ]
   HTTP :3000  ← Ανακατεύθυνση από :80 (PREROUTING REDIRECT)
        |
[ captures.txt ]  ← Καταγραφή στοιχείων
        |
[ eth0 ]  ← Σύνδεση στο πραγματικό internet (MASQUERADE)
```

### Ροή Επίθεσης

| Βήμα | Τι συμβαίνει |
|------|-------------|
| 1 | Συσκευή συνδέεται στο "GUESS_Guest" |
| 2 | Το `dnsmasq` αποδίδει IP (10.0.0.x), ορίζει DNS server το `10.0.0.1` και αποστέλλει την παράμετρο DHCP option 114 με το URL του portal (`http://10.0.0.1/`) |
| 3 | Το λ.σ. εντοπίζει το captive portal είτε απευθείας από το DHCP option 114 (Android 11+ / iOS 14+), είτε μέσω HTTP probe (`/generate_204`, `/hotspot-detect.html`, `/connecttest.txt`, κ.ά.) που ανακατευθύνεται από τους κανόνες iptables στον τοπικό server |
| 4 | Ο server επιστρέφει HTTP 302 redirect στο portal → το λ.σ. εμφανίζει αυτόματα την ειδοποίηση "Σύνδεση στο δίκτυο" |
| 5 | Ο χρήστης εισάγει στοιχεία (Google, Microsoft, Apple ή ως επισκέπτης) |
| 6 | Τα στοιχεία αποθηκεύονται στο `captures.txt` |
| 7 | Ο server εκτελεί `iptables -t nat -I PREROUTING -s [IP] -j RETURN` και `iptables -I FORWARD -s [IP] -j ACCEPT` → ο συγκεκριμένος χρήστης παρακάμπτει τους κανόνες του captive portal και αποκτά κανονική πρόσβαση στο internet |
| 8 | Η συσκευή επαναλαμβάνει το probe, αυτή τη φορά όμως η κίνησή της διαφεύγει του PREROUTING και φτάνει στους πραγματικούς διακομιστές Google/Apple/Microsoft. Λαμβάνει κανονική απάντηση HTTP 204 και η ένδειξη "Χωρίς πρόσβαση στο διαδίκτυο" εξαφανίζεται |
| 9 | Redirect στο `google.com` — ο χρήστης δεν αντιλαμβάνεται τίποτα |

---

## Προαπαιτούμενα

### Υλικό
- Εξωτερικός WiFi adapter με υποστήριξη **AP Mode** (π.χ. Alfa AWUS036ACH, TP-Link Archer T3U Plus)
- Ενσύρματη σύνδεση internet μέσω `eth0` (για NAT / internet sharing)
- Σύστημα Kali Linux με δικαιώματα root

### Λογισμικό
```bash
sudo apt update && sudo apt install -y hostapd dnsmasq nodejs npm
npm install
```

### Passwordless sudo για Node.js
Ο `server.js` εκτελεί δυναμικά εντολές `iptables` ώστε να αποδώσει internet στον κάθε χρήστη που αυθεντικοποιείται. Για να λειτουργεί αυτό χωρίς prompt κωδικού:

```bash
sudo visudo
# Προσθέστε στο τέλος:
<username> ALL=(ALL) NOPASSWD: /sbin/iptables
```

---

## Οδηγίες Εκτέλεσης

### Βήμα 1 — Ρύθμιση δικτύου

```bash
sudo chmod +x setup_network.sh
sudo ./setup_network.sh
```

Το script εκτελεί αυτόματα:
- Τερματίζει τον `NetworkManager` και όσες διεργασίες ανταγωνίζονται το `wlan0`
- Αποδίδει IP `10.0.0.1` στο `wlan0`
- Ανακατευθύνει όλες τις DNS ερωτήσεις (`UDP/TCP 53`) στο τοπικό `dnsmasq` — ακόμη και αν η συσκευή χρησιμοποιεί hardcoded DNS (π.χ. 8.8.8.8) ή Private DNS
- Ανακατευθύνει HTTP (`TCP 80 → 3000`) στον Node.js server ώστε να παγιδεύονται τα HTTP probes captive portal των συσκευών
- Απορρίπτει HTTPS (`TCP 443`) με `TCP RST` για μη-αυθεντικοποιημένες συσκευές. Έτσι το HTTPS probe των Android αποτυγχάνει ακαριαία και η ειδοποίηση captive portal εμφανίζεται αμέσως, αντί το λειτουργικό να παραμείνει σε παρατεταμένο timeout με ένδειξη "χωρίς internet"
- Απορρίπτει το DNS-over-TLS (port 853) ώστε οι συσκευές να επιστρέψουν σε κλασικό DNS, το οποίο είναι ήδη ανακατευθυνόμενο στο δικό μας `dnsmasq`
- Ενεργοποιεί NAT (internet sharing μέσω `eth0`)

### Βήμα 2 — Εκκίνηση υπηρεσιών (3 ξεχωριστά τερματικά)

```bash
# Τερματικό 1 — Εκπομπή Wi-Fi
sudo hostapd hostapd.conf

# Τερματικό 2 — DHCP & DNS
sudo dnsmasq -C dnsmasq.conf -d

# Τερματικό 3 — Captive Portal Server
sudo node server.js
```

---

## Αυτόματη Ανίχνευση Captive Portal

Τα σύγχρονα λειτουργικά συστήματα ελέγχουν την συνδεσιμότητά τους αμέσως μετά την σύνδεση σε Wi-Fi. Το παρόν πρωτότυπο χρησιμοποιεί **δύο παράλληλους μηχανισμούς** για να εξασφαλίσει την αυτόματη εμφάνιση του portal σε όλες τις συσκευές:

### 1. DHCP option 114 (RFC 8910)

Το `dnsmasq` αποστέλλει στις νέες συσκευές, μέσα στην DHCP απάντηση, την παράμετρο `captive-portal-uri` με τιμή `http://10.0.0.1/`. Το **Android 11+** και το **iOS 14+** ανοίγουν αυτό το URL **χωρίς να χρειαστεί καν probing** — ο χρήστης βλέπει το portal σχεδόν άμεσα μετά τη σύνδεση.

### 2. HTTP probes (fallback για παλαιότερες συσκευές)

Για Android 10 και παλαιότερα, iOS 13 και προγενέστερες εκδόσεις, καθώς και Windows, το σύστημα εκμεταλλεύεται τους HTTP probes:

| Λ.Σ. | Probe URL | Αντίδραση server |
|------|-----------|-----------------|
| Android | `connectivitycheck.gstatic.com/generate_204` | HTTP 302 → portal |
| iOS / macOS | `captive.apple.com/hotspot-detect.html` | HTTP 302 → portal |
| Windows | `www.msftconnecttest.com/connecttest.txt` | HTTP 302 → portal |

> **Σημείωση αρχιτεκτονικής:** Τα παραπάνω domains **δεν δεσμεύονται στο DNS level** — επιστρέφουν τις πραγματικές IP διευθύνσεις των Google/Apple/Microsoft. Ωστόσο, καθώς οι κανόνες `iptables` ανακατευθύνουν ολόκληρη την HTTP κίνηση (`TCP 80`) στον τοπικό Node.js server, τα probes παγιδεύονται ανεξαρτήτως προορισμού. Αυτή η προσέγγιση αποφεύγει τα προβλήματα που θα προκαλούσε ένας ψεύτικος HTTPS server με self-signed πιστοποιητικό: τα σύγχρονα Android θεωρούν την αποτυχία TLS επικύρωσης ως "ύποπτο / κατεστραμμένο δίκτυο" και παραμένουν μόνιμα σε κατάσταση "no internet" αντί να εμφανίσουν το portal.

### 3. Καθαρισμός της ένδειξης "χωρίς internet" μετά την αυθεντικοποίηση

Μόλις ο χρήστης αυθεντικοποιηθεί, ο server εισάγει δύο κανόνες iptables ειδικά για τη δική του IP:

```bash
iptables -t nat -I PREROUTING -s <IP> -j RETURN     # παρακάμπτει τα REDIRECTs
iptables -I FORWARD -s <IP> -j ACCEPT                # επιτρέπει forwarding προς eth0
```

Έτσι η επόμενη επανάληψη του probe δεν παγιδεύεται τοπικά: φτάνει στους πραγματικούς διακομιστές Google/Apple/Microsoft, λαμβάνει κανονική απάντηση **HTTP 204**, και η ένδειξη "Χωρίς πρόσβαση στο διαδίκτυο" εξαφανίζεται. Το λειτουργικό σύστημα μεταβαίνει σε κατάσταση κανονικής σύνδεσης, χωρίς κανένα προειδοποιητικό banner.

---

## Καταγραφή Δεδομένων

Όλα τα συλληφθέντα στοιχεία αποθηκεύονται στο `captures.txt`:

```
--- Session started: 22/4/2026, 14:32:05 ---

[22/4/2026, 14:33:18] GOOGLE - IP: 10.0.0.25
  email       : user@gmail.com
  password    : password123
==================================================

[22/4/2026, 14:35:02] MICROSOFT - IP: 10.0.0.31
  email       : user@outlook.com
  password    : mypassword
==================================================

[22/4/2026, 14:36:44] APPLE - IP: 10.0.0.27
  apple_id    : user@icloud.com
  password    : ********
==================================================

[22/4/2026, 14:37:10] GUEST - IP: 10.0.0.42
  name        : Γιώργος Παπαδόπουλος
  email       : guest@example.com
  purpose     : visitor
==================================================
```

---

## Δομή Αρχείων

```
evil-twin-prototype/
├── server.js          # Express backend: σύλληψη στοιχείων, διαχείριση iptables, captive portal probe handlers
├── index.html         # Captive portal UI με GUESS branding και Google/Microsoft/Apple modals
├── script.js          # Frontend JS: two-step login flows (Google/Microsoft), λογική modals, AUP toggle
├── style.css          # Styling: GUESS palette, responsive layout
├── hostapd.conf       # Ρυθμίσεις Access Point (SSID, κανάλι, driver nl80211)
├── dnsmasq.conf       # DHCP server + DHCP option 114 (RFC 8910) για captive portal ανίχνευση
├── setup_network.sh   # Αυτοματοποιημένη ρύθμιση δικτύου: IP, iptables, NAT, DNS redirect
├── package.json       # Node.js dependencies (express, body-parser)
├── captures.txt       # Δημιουργείται αυτόματα — καταγραφή συλληφθέντων στοιχείων
```

---

## Παραμετροποίηση

### SSID

Για πιο στοχευμένη επίθεση, αλλάξτε το SSID στο `hostapd.conf` ώστε να αντιστοιχεί στο ακριβές όνομα ενός νόμιμου δικτύου.

```
ssid=GUESS_Guest
```

### Branding του portal

Το portal (`index.html` + `style.css`) είναι σχεδιασμένο να μιμείται το εταιρικό guest network της **GUESS, Inc.** (λευκό φόντο, κόκκινο ανεστραμμένο τρίγωνο με λογότυπο "GUESS?" σε λευκή italic Georgia γραμματοσειρά). Για προσαρμογή σε διαφορετικό brand:

- Αντικαταστήστε το SVG λογότυπο στο `<header class="header">` του `index.html`
- Τροποποιήστε το primary color (`#cc0000`) στο `style.css` — χρησιμοποιείται στο submit button, στα links και στο AUP side-bar
- Ενημερώστε τα κείμενα της σελίδας, το `<title>` και το disclaimer του AUP

---

> Το παρόν έργο υλοποιήθηκε αποκλειστικά στα πλαίσια ακαδημαϊκής έρευνας, για την ανάλυση ευπαθειών ασύρματων δικτύων και τεχνικών κοινωνικής μηχανικής σε κινητές συσκευές. Η χρήση του επιτρέπεται μόνο σε ελεγχόμενο εργαστηριακό περιβάλλον, με ρητή άδεια του ιδιοκτήτη του δικτύου-στόχου.
