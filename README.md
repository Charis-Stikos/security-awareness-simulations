# Πτυχιακή Εργασία: Προσομοιώσεις Κυβερνοεπιθέσεων σε Mobile & WiFi Δίκτυα

**Φοιτητής:** Χαράλαμπος Στίκος
**Θέμα:** Η Κοινωνική Μηχανική σε κινητές συσκευές.

---

## Περιγραφή

Το repository περιέχει τρία ξεχωριστά σενάρια επιθέσεων που υλοποιήθηκαν για ερευνητικούς σκοπούς στο πλαίσιο της πτυχιακής εργασίας. Κάθε φάκελος είναι αυτόνομος, με δικές του οδηγίες εγκατάστασης και εκτέλεσης.

### WiFi Evil Twin Prototype (`evil-twin-prototype/`)
Επίθεση σε επίπεδο δικτύου.
- **Στόχος:** Δημιουργία ψεύτικου Access Point με captive portal που μιμείται εταιρικό guest network (GUESS, Inc.).
- **Περιβάλλον:** Kali Linux, hostapd, dnsmasq, iptables, Node.js (Express).
- **Τεχνική:** DHCP option 114 (RFC 8910) και HTTP probe redirection για αυτόματη εμφάνιση του portal. Επιλογές σύνδεσης μέσω Google, Microsoft, Apple ή ως επισκέπτης.

### Android App Exfiltration (`govgrwallet-prototype/`)
Επίθεση σε επίπεδο εφαρμογής (sideloaded mobile app).
- **Στόχος:** Υποκλοπή κωδικών TaxisNet μέσω κλώνου της εφαρμογής gov.gr Wallet.
- **Περιβάλλον:** Android (Kotlin / Jetpack Compose), Python listener.
- **Τεχνική:** WebView με JavaScript Interface bridge. Τα στοιχεία αποστέλλονται σε απομακρυσμένο Python listener μέσω Cloudflare Tunnel.

### SMS Phishing Prototype (`SMS-phishing-prototype/`)
Επίθεση μέσω SMS phishing (smishing).
- **Στόχος:** Κλώνος της σελίδας FuelPass III (vouchers.gov.gr) και της πύλης TaxisNet OAuth2.
- **Περιβάλλον:** Node.js (Express).
- **Τεχνική:** Spoofed path `/fuelpass/appfront`, exfiltration μέσω `navigator.sendBeacon` και ψεύτικη "αποτυχία σύνδεσης" στην πρώτη προσπάθεια ώστε να καταγραφούν δύο εκδοχές του κωδικού.

---

## Disclaimer

Τα projects προορίζονται **αποκλειστικά για εκπαιδευτική χρήση** και την ανάδειξη κενών ασφαλείας στο πλαίσιο πτυχιακής έρευνας. Η ανάπτυξη ή χρήση τους σε πραγματικά δίκτυα και σε συσκευές τρίτων χωρίς ρητή άδεια είναι παράνομη.
