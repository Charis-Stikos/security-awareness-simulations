<div align="center">

# 🛡️ Προσομοιώσεις Κυβερνοεπιθέσεων σε Mobile & Wi-Fi Δίκτυα

### Πτυχιακή Εργασία — Η Κοινωνική Μηχανική σε Κινητές Συσκευές

![Kali Linux](https://img.shields.io/badge/Kali_Linux-557C94?style=flat-square&logo=kalilinux&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?style=flat-square&logo=android&logoColor=white)
![Kotlin](https://img.shields.io/badge/Kotlin-7F52FF?style=flat-square&logo=kotlin&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![License](https://img.shields.io/badge/Χρήση-Εκπαιδευτική_μόνο-red?style=flat-square)

</div>

---

> **👤 Συγγραφέας:** Χαράλαμπος Στίκος
> **🎓 Αντικείμενο:** Η Κοινωνική Μηχανική (Social Engineering) σε Κινητές Συσκευές
> **🧪 Πλαίσιο:** Πτυχιακή Εργασία — Ανάδειξη ευπαθειών ασφαλείας σε ελεγχόμενο εργαστηριακό περιβάλλον

---

## 📖 Περιγραφή

Το repository περιέχει **τρία αυτόνομα σενάρια επιθέσεων**, υλοποιημένα για ερευνητικούς σκοπούς στο πλαίσιο της πτυχιακής εργασίας. Καθένα από τα τρία προσεγγίζει την κλοπή διαπιστευτηρίων (credential harvesting) από **διαφορετικό επίπεδο** της αλυσίδας επίθεσης — δίκτυο, εφαρμογή και μήνυμα — με κοινό άξονα την **κοινωνική μηχανική** και την εκμετάλλευση της εμπιστοσύνης του χρήστη.

Κάθε φάκελος είναι πλήρως αυτόνομος, με δικό του αναλυτικό `README.md`, οδηγίες εγκατάστασης, εκτέλεσης και στιγμιότυπα λειτουργίας.

---

## 🗂️ Τα Τρία Σενάρια

| # | Project | Επίπεδο Επίθεσης | Stack | Στόχος |
|---|---------|------------------|-------|--------|
| 1 | [**Evil Twin Access Point**](./evil-twin-prototype/) | 📡 Δίκτυο (Wi-Fi) | Kali Linux · hostapd · dnsmasq · iptables · Node.js | Captive portal κλώνος εταιρικού guest Wi-Fi (GUESS, Inc.) |
| 2 | [**Gov.gr Wallet Clone**](./govgrwallet-prototype/) | 📱 Εφαρμογή (Android) | Kotlin · Jetpack Compose · WebView · Python | Υποκλοπή κωδικών TaxisNet μέσω sideloaded app |
| 3 | [**SMS Phishing (Smishing)**](./SMS-phishing-prototype/) | 💬 Μήνυμα (SMS) | Node.js · Express | Κλώνος FuelPass III + πύλης TaxisNet OAuth2 |

---

### 📡 1. WiFi Evil Twin Prototype — `evil-twin-prototype/`

Επίθεση σε **επίπεδο δικτύου**.

- **Στόχος:** Δημιουργία ψεύτικου Access Point με captive portal που μιμείται εταιρικό guest network (**GUESS, Inc.**).
- **Περιβάλλον:** Kali Linux, `hostapd`, `dnsmasq`, `iptables`, Node.js (Express).
- **Τεχνική:** Αυτόματη εμφάνιση του portal μέσω **DHCP option 114 (RFC 8910)** και **HTTP probe redirection**. Επιλογές σύνδεσης μέσω **Google**, **Microsoft**, **Apple** ή ως **επισκέπτης**. Μετά την υποκλοπή, δυναμική απόδοση πραγματικού internet με per-IP κανόνες `iptables`.

### 📱 2. Android App Exfiltration — `govgrwallet-prototype/`

Επίθεση σε **επίπεδο εφαρμογής** (sideloaded mobile app).

- **Στόχος:** Υποκλοπή κωδικών **TaxisNet** μέσω πιστού κλώνου της εφαρμογής **gov.gr Wallet**.
- **Περιβάλλον:** Android (Kotlin / Jetpack Compose), Python listener.
- **Τεχνική:** Native UI που φορτώνει κλώνο της πύλης OAuth2 σε **WebView** με **JavaScript Interface bridge**. Τα στοιχεία αποθηκεύονται τοπικά και αποστέλλονται σε απομακρυσμένο **Python listener** μέσω **Cloudflare Tunnel**.

### 💬 3. SMS Phishing Prototype — `SMS-phishing-prototype/`

Επίθεση μέσω **SMS phishing (smishing)**.

- **Στόχος:** Κλώνος της σελίδας **FuelPass III** (`vouchers.gov.gr`) και της πύλης **TaxisNet OAuth2**.
- **Περιβάλλον:** Node.js (Express).
- **Τεχνική:** Spoofed path `/fuelpass/appfront`, exfiltration μέσω `navigator.sendBeacon` και ψεύτικη «αποτυχία σύνδεσης» στην πρώτη προσπάθεια, ώστε να καταγραφούν δύο εκδοχές του κωδικού.

---

## 🧩 Κοινό Μοτίβο Επίθεσης

Παρά τις διαφορετικές τεχνολογίες, και τα τρία σενάρια ακολουθούν την ίδια λογική κοινωνικής μηχανικής:

```
Δόλωμα εμπιστοσύνης  →  Πιστός κλώνος γνωστής υπηρεσίας  →  Υποβολή διαπιστευτηρίων
        →  Σιωπηλή υποκλοπή & καταγραφή  →  Ανακατεύθυνση στο πραγματικό site
```

Το τελευταίο βήμα —η ομαλή ανακατεύθυνση στον πραγματικό προορισμό— είναι κοινό και στα τρία και αποσκοπεί στο να **μην αντιληφθεί το θύμα** ότι έπεσε θύμα επίθεσης.

---

## ⚠️ Disclaimer — Δήλωση Αποποίησης Ευθύνης

> Τα projects προορίζονται **αποκλειστικά για εκπαιδευτική και ερευνητική χρήση**, για την ανάδειξη κενών ασφαλείας στο πλαίσιο πτυχιακής έρευνας.
>
> Η ανάπτυξη, εγκατάσταση ή χρήση τους σε **πραγματικά δίκτυα** ή σε **συσκευές τρίτων** χωρίς **ρητή και έγγραφη άδεια** είναι **παράνομη**. Ο συγγραφέας δεν φέρει καμία ευθύνη για τυχόν κακή χρήση του κώδικα.

---

<div align="center">

**Χαράλαμπος Στίκος** · Πτυχιακή Εργασία — Η Κοινωνική Μηχανική σε Κινητές Συσκευές
</div>
