<div align="center">

# 💬 SMS Phishing (Smishing) — Κλώνος FuelPass III

### Πτυχιακή Εργασία — Κοινωνική Μηχανική σε Κινητές Συσκευές

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![Target](https://img.shields.io/badge/Target-vouchers.gov.gr-003478?style=flat-square)

</div>

---

> **👤 Συγγραφέας:** Χαράλαμπος Στίκος
> **🎓 Αντικείμενο:** Κοινωνική Μηχανική σε Κινητές Συσκευές
> **🧪 Περιβάλλον:** Node.js · Express
> ⚠️ Πρωτότυπο smishing — αυστηρά για εργαστηριακή χρήση

---

## 📖 Περιγραφή

Πρωτότυπο επίθεσης **SMS phishing (smishing)** που στοχεύει την κρατική πλατφόρμα **FuelPass III** (`vouchers.gov.gr`). Το θύμα παρασύρεται μέσω SMS σε έναν πιστό κλώνο της landing σελίδας και, στη συνέχεια, της πύλης αυθεντικοποίησης **TaxisNet OAuth2** (`oauth2.gsis.gr`), όπου υποκλέπτονται τα διαπιστευτήριά του.

---

## 🖼️ Στιγμιότυπα

<div align="center">

| Landing FuelPass III | Πύλη TaxisNet OAuth2 | Ψεύτικο σφάλμα |
|:---:|:---:|:---:|
| ![Landing](./SMS-phishing-prototype-images/FUEL%20PASS%20III%20LANDING%20PAGE.png) | ![Taxis Login](./SMS-phishing-prototype-images/TAXIS%20USER%20LOGIN.png) | ![Taxis Error](./SMS-phishing-prototype-images/TAXIS%20ERROR.png) |

| Φόρμα TaxisNet | Σύλληψη διαπιστευτηρίων | Εξαγωγή captures |
|:---:|:---:|:---:|
| ![Taxis Form](./SMS-phishing-prototype-images/TAXIS%20FORM.png) | ![Credentials Capture](./SMS-phishing-prototype-images/USER%20CREDENTIALS%20CAPTURE.png) | ![Captures Export](./SMS-phishing-prototype-images/CAPTURES%20EXPORT%20FILE.png) |

</div>

---

## 🎯 Σενάριο Επίθεσης

1. Το θύμα λαμβάνει **SMS** με σύντομο URL που μιμείται το `vouchers.gov.gr/fuelpass/appfront`.
2. Ανοίγει το link σε mobile browser και φορτώνει τον **κλώνο της landing σελίδας** FuelPass III (πιστό gov.gr branding, ελληνική σημαία, FAQ).
3. Πατάει το CTA **«Είσοδος με κωδικούς Taxisnet»** και μεταβαίνει στον **κλώνο της πύλης TaxisNet OAuth2**.
4. Τα διαπιστευτήρια αποστέλλονται στον τοπικό listener (`server/server.js`) και καταγράφονται σε `captures.txt` και `captures.jsonl`.
5. Στην **πρώτη υποβολή** εμφανίζεται ψεύτικο μήνυμα **«Αποτυχία στην Αυθεντικοποίηση»**, ώστε να ξαναπληκτρολογήσει ο χρήστης. Στη **δεύτερη υποβολή** γίνεται redirect στο πραγματικό `https://www.vouchers.gov.gr/`, για να μην υποψιαστεί το θύμα.

---

## 📁 Δομή Φακέλου

```
SMS-phishing-prototype/
├── public/
│   ├── index.html       # Landing FuelPass III (gov.gr branding + FAQ)
│   ├── styles.css        # Styling landing σελίδας
│   ├── login.html        # Κλώνος TaxisNet OAuth2 + exfiltration script
│   └── login.css         # Styling πύλης αυθεντικοποίησης
├── server/
│   ├── server.js         # Express listener — σερβίρισμα σελίδων + endpoint /capture
│   ├── package.json
│   ├── captures.txt      # Καταγραφή (αναγνώσιμη μορφή) — δημιουργείται αυτόματα
│   ├── captures.jsonl    # Καταγραφή (JSON Lines) — δημιουργείται αυτόματα
│   └── .gitignore
└── README.md
```

---

## 🔗 Δομή URL

Ο listener σερβίρει τις σελίδες κάτω από **spoofed path** που μιμείται την πραγματική δομή του gov.gr (`BASE = /fuelpass/appfront`):

| Τύπος | URL |
|-------|-----|
| Πραγματικό | `https://vouchers.gov.gr/fuelpass/appfront` |
| Lab (local) | `http://localhost:3000/fuelpass/appfront` |
| Login (lab) | `http://localhost:3000/fuelpass/appfront/login` |
| Capture | `POST http://localhost:3000/fuelpass/appfront/capture` |

> Για ρεαλιστικό deployment μπορείτε να εκθέσετε το `localhost:3000` με **Cloudflare Tunnel** ή **ngrok** και να τοποθετήσετε το URL σε short link ή σε typosquat domain (π.χ. `vouchers-gov.gr`).

---

## ▶️ Εκτέλεση

```bash
cd server
npm install
npm start
```

Άνοιγμα σε mobile browser:

```
http://localhost:3000/fuelpass/appfront
```

<div align="center">

![Server Setup](./SMS-phishing-prototype-images/SERVER%20SETUP.png)

</div>

---

## 🔬 Τεχνικές Λεπτομέρειες

- **Exfiltration:** Το `login.html` χρησιμοποιεί `navigator.sendBeacon` για να σταλούν τα στοιχεία στο `/capture`. Αν δεν υπάρχει υποστήριξη, γίνεται fallback σε `fetch` με `keepalive: true`. Έτσι το request **επιβιώνει** ακόμη και αν η σελίδα κάνει redirect αμέσως μετά.
- **Content-Type:** Ο server δέχεται τόσο `application/json` όσο και `text/plain` (το `sendBeacon` με Blob αποστέλλει συχνά ως `text/plain`), κάνοντας parse το JSON payload και στις δύο περιπτώσεις.
- **Δύο προσπάθειες:** Στην πρώτη υποβολή εμφανίζεται error overlay και ξαναζητείται ο κωδικός — έτσι, αν το θύμα έγραψε λάθος, καταγράφονται **και οι δύο εκδοχές**. Μετά τη δεύτερη υποβολή γίνεται redirect στο πραγματικό `https://www.vouchers.gov.gr/`.
- **Καταγραφή IP:** Λαμβάνεται το `x-forwarded-for` ή το `socket.remoteAddress` (αφαιρώντας το πρόθεμα `::ffff:` για IPv4-mapped διευθύνσεις).
- **Καταγραφόμενα πεδία:** `username`, `password`, `attempt` (αριθμός προσπάθειας), `user-agent`, client timestamp και IP.

---

## 💾 Captures

Κάθε υποβολή καταγράφεται σε **δύο μορφές**:

- `server/captures.txt` — ανθρώπινα αναγνώσιμη μορφή (timestamp, IP, username, password, attempt, user-agent).
- `server/captures.jsonl` — μία γραμμή JSON ανά capture, για ανάλυση στην πτυχιακή.

Παρακολούθηση σε real time:

```bash
tail -f server/captures.txt
```

Παράδειγμα εγγραφής (`captures.txt`):

```
[6/5/2026, 6:31:29 μ.μ.] TAXISNET CAPTURE - IP: 127.0.0.1
  username    : TEST_NAME
  password    : password123456
  attempt     : 1
  user-agent  : Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) ...
============================================================
```

---

## ⚠️ Disclaimer

> Αυστηρά για **ερευνητικούς και εκπαιδευτικούς σκοπούς** στο πλαίσιο πτυχιακής εργασίας. Δεν επιτρέπεται η ανάπτυξη ή χρήση σε πραγματικό περιβάλλον ή σε στόχους τρίτων **χωρίς ρητή άδεια**.

---

<div align="center">

**Χαράλαμπος Στίκος** · Πτυχιακή Εργασία — Κοινωνική Μηχανική σε Κινητές Συσκευές

</div>
