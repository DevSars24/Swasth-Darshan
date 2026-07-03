# 🩺 Swasth Darshan — Simple, Shippable Plan

> Same vision. Simpler engineering. Built to actually get finished in 2 months by one person.

---

## 📖 The Vision (unchanged)

Healthcare access in India is broken for the people who need it most — elderly patients, less-literate patients, pregnant women, and anyone in a rural or underserved area.

Swasth Darshan fixes this by being:

- 🗣️ **Voice-first & multilingual** — speak your symptoms, no typing needed
- ⭐ **Trust-first doctors** — ranked only by real, unpaid, post-visit ratings
- 🛡️ **Verified-only doctors** — fake credentials get rejected
- 💛 **Philanthropy-funded** — no government money, no political interference
- 🤝 **Companion care** — daily check-in calls for pregnant/elderly/critical patients
- ⏰ **Health timelines** — automatic medicine reminders
- 🎨 **Radically simple UI** — built for a first-time smartphone user

---

## 🧠 The One Big Change

The old plan had **14 microservices in 3 different languages** (Go + .NET + Node) with a message queue and API gateway. That's a great architecture for a funded team scaling to millions of users.

It is the **wrong** architecture for one developer with 8 weeks.

So: **one app, one language, clean sections inside it.** Think of it like one house with well-organized rooms, instead of 14 separate houses connected by a courier service. Same rooms, same purpose — just far less to build, deploy, and debug.

### Old vs New, at a glance

```mermaid
flowchart LR
    subgraph OLD["❌ Old: 14 microservices, 3 languages"]
        direction TB
        O1[Go services x8]
        O2[.NET services x5]
        O3[Node service x1]
        O4[(RabbitMQ)]
        O5[API Gateway]
        O1 --- O4
        O2 --- O4
        O3 --- O4
        O4 --- O5
    end

    subgraph NEW["✅ New: 1 app, 1 language, clean modules"]
        direction TB
        N1[NestJS App]
        N2[Auth module]
        N3[Patient module]
        N4[Doctor module]
        N5[Rating module]
        N6[... etc]
        N1 --> N2 & N3 & N4 & N5 & N6
    end

    OLD -. "same features, way more moving parts" .-> NEW
```

---

## 🛠️ New Tech Stack (simple version)

| Piece | What we use | Why |
|---|---|---|
| Backend | **Node.js + NestJS** (one app, organized into modules: Auth, Patient, Doctor, Rating, etc.) | One language to learn/debug. NestJS naturally keeps code organized like separate services, without the deployment pain. |
| Database | **Postgres** (Supabase free tier) | One database, one connection. No cross-service data headaches. |
| Cache / live scores | **Redis** (Upstash free tier) | Fast doctor trust-score lookups |
| Background jobs (reminders, calls, notifications) | **BullMQ** (built on Redis) | Replaces RabbitMQ — one less moving part |
| Chat | **Socket.io** | Simple, well-documented, works out of the box |
| Video calls | **Jitsi** (free embed) | Don't build your own video signaling — just embed it |
| Voice-to-text / text-to-voice | **Web Speech API** (built into the browser, free) | Zero setup |
| Translation | **Google Translate free tier** or **LibreTranslate** | Same as before |
| Auth (login/OTP) | **Supabase Auth** or **Firebase Auth** | Don't build your own login system — huge time saver |
| Payments (donations) | **Razorpay test mode** | Same as before |
| Frontend | **One Next.js app** with sections `/patient`, `/doctor`, `/admin` | One app instead of three — easier to build and deploy |
| Deployment | **Docker Compose** (just the app + Postgres + Redis) | Simple `docker compose up` — no Kubernetes needed yet |

**One-line stack:** NestJS + Postgres + Redis + BullMQ + Socket.io + Jitsi + Next.js + Supabase Auth + Razorpay.

### System architecture (how the pieces actually connect)

```mermaid
flowchart TB
    subgraph CLIENT["📱 Frontend — one Next.js app"]
        P["/patient"]
        D["/doctor"]
        A["/admin"]
    end

    subgraph SERVER["🧠 Backend — one NestJS app"]
        AU[Auth module]
        PA[Patient module]
        DO[Doctor module]
        RA[Rating module]
        AP[Appointment module]
        CH[Chat module]
        NO[Notification module]
        HT[Health Timeline module]
        CC[Companion Care module]
        VT[Voice/Translation module]
        DN[Donation module]
    end

    subgraph DATA["💾 Data & Infra"]
        PG[(Postgres<br/>Supabase)]
        RD[(Redis<br/>Upstash)]
        BQ[BullMQ<br/>background jobs]
    end

    subgraph EXT["🌐 External free-tier services"]
        SB[Supabase/Firebase Auth]
        JI[Jitsi video]
        WS[Web Speech API]
        TR[Translate API]
        TW[Twilio SMS/Call]
        FB[Firebase Push]
        RZ[Razorpay test mode]
    end

    CLIENT -->|REST / WebSocket| SERVER

    AU --> SB
    VT --> WS
    VT --> TR
    CH --> JI
    NO --> TW
    NO --> FB
    DN --> RZ

    AU & PA & DO & RA & AP & CH & HT & CC & DN --> PG
    RA --> RD
    NO & HT & CC --> BQ
    BQ --> RD
```

---

## ❌ What We're Cutting (for now)

These aren't "wrong" ideas — they're just **too early**. Add them later if the product actually grows and needs them.

- ~~API Gateway~~ — Next.js handles routing fine at this size
- ~~RabbitMQ~~ — BullMQ does the same job with less setup
- ~~Kubernetes~~ — Docker Compose is enough for a demo/early product
- ~~3 programming languages~~ — pick one, go deep
- ~~14 separate deployable services~~ — one app, organized folders

> When the product actually gets real traffic and a real team, *then* you pull pieces out into separate services — one at a time, only the ones that actually need it (probably Chat/Video first, since real-time stuff scales differently).

---

## 📂 Simple Folder Structure

```
swasth-darshan/
├── frontend/
│   └── app/                    # One Next.js app
│       ├── patient/
│       ├── doctor/
│       └── admin/
│
├── backend/
│   └── src/
│       ├── auth/
│       ├── patient/
│       ├── doctor/
│       ├── rating/
│       ├── appointment/
│       ├── chat/
│       ├── notification/
│       ├── health-timeline/
│       ├── companion-care/
│       ├── voice-translation/
│       └── donation/
│
├── docker-compose.yml          # app + Postgres + Redis, one command
└── docs/
    └── future-microservices.md # roadmap for later, not now
```

Every "service" from the old plan still exists — just as a **folder/module** instead of a **separate deployed app**.

```mermaid
flowchart LR
    ROOT["swasth-darshan/"] --> FE["frontend/app/"]
    ROOT --> BE["backend/src/"]
    ROOT --> DC["docker-compose.yml"]
    ROOT --> DOCS["docs/"]

    FE --> FEP["patient/"]
    FE --> FED["doctor/"]
    FE --> FEA["admin/"]

    BE --> B1["auth/"]
    BE --> B2["patient/"]
    BE --> B3["doctor/"]
    BE --> B4["rating/"]
    BE --> B5["appointment/"]
    BE --> B6["chat/"]
    BE --> B7["notification/"]
    BE --> B8["health-timeline/"]
    BE --> B9["companion-care/"]
    BE --> B10["voice-translation/"]
    BE --> B11["donation/"]
```

---

## 🔀 Core Flows (how each feature actually works)

### 1️⃣ Patient onboarding & voice-first symptom intake

```mermaid
sequenceDiagram
    actor Patient
    participant App as Next.js app
    participant Auth as Auth module
    participant VT as Voice/Translation module
    participant PA as Patient module
    participant DB as Postgres

    Patient->>App: Open app, tap "Sign up"
    App->>Auth: OTP request
    Auth-->>Patient: OTP sent via SMS
    Patient->>Auth: Enter OTP
    Auth->>DB: Create user record
    Auth-->>App: Logged in (JWT)

    Patient->>App: Choose language + font size
    App->>PA: Save preferences
    PA->>DB: Store patient profile

    Patient->>App: Tap mic, speak symptoms
    App->>VT: Audio stream
    VT->>VT: Speech-to-text (Web Speech API)
    VT->>VT: Translate to English (if needed)
    VT-->>App: Symptom text
    App-->>Patient: "Got it — searching doctors for you"
```

### 2️⃣ Doctor onboarding — "no fake records" verification

```mermaid
flowchart TD
    A[Doctor signs up] --> B[Uploads credentials/documents]
    B --> C[Doctor module saves docs to Cloudinary]
    C --> D{Admin reviews in dashboard}
    D -->|Looks fake or incomplete| E[Rejected — doctor notified]
    D -->|Verified| F[Doctor status = Approved]
    F --> G[Doctor now searchable by patients]
    E --> H[Doctor can resubmit with correct docs]
    H --> B
```

### 3️⃣ Real-time, unpaid doctor rating

```mermaid
flowchart TD
    A[Appointment marked Completed] --> B{Was appointment real & verified?}
    B -->|No| Z[Rating rejected — no rating without a real visit]
    B -->|Yes| C[Patient shown rating prompt]
    C --> D[Patient submits 1-5 stars + optional note]
    D --> E[Rating module writes event to Postgres]
    E --> F[Rating module recalculates doctor trust score]
    F --> G[(Redis: live trust score cache)]
    G --> H[Doctor Search shows updated score instantly]
```

### 4️⃣ Philanthropy funding & transparency loop

```mermaid
flowchart LR
    A[Philanthropist donates] --> B[Donation module: Razorpay test mode]
    B --> C[(Postgres: donation record)]
    C --> D[Scheduled job tallies fund allocation]
    D --> E[Public Transparency Report page]
    E --> F[Anyone can see where money went]
    C --> G[Contributor recognized on public page]
```

### 5️⃣ Companion care — "no loneliness" daily check-ins

```mermaid
flowchart TD
    A[Patient flagged: pregnant / elderly / critical] --> B[Companion Care module creates daily schedule]
    B --> C[BullMQ job queued for each day]
    C --> D{Job runs at scheduled time}
    D --> E[Notification module triggers Twilio Voice call]
    E --> F{Call answered?}
    F -->|Yes| G[Check-in logged — streak continues]
    F -->|No| H[Retry later / flag for human follow-up]
```

### 6️⃣ Health timeline & medicine reminders

```mermaid
flowchart TD
    A[Doctor writes prescription] --> B[Health Timeline module parses medicine schedule]
    B --> C[BullMQ jobs scheduled per dose]
    C --> D{Reminder time reached}
    D --> E[Push notification / SMS sent to patient]
    E --> F{Patient marks as taken?}
    F -->|Yes| G[Logged in timeline]
    F -->|No, missed| H[Escalation: reminder again / notify companion-care]
```

---

## 🗓️ 2-Month Plan (Simplified)

```mermaid
gantt
    title 8-Week Solo Build Plan
    dateFormat  YYYY-MM-DD
    axisFormat  Wk %W

    section Phase 1 - Foundation
    Setup + Docker + Auth        :p1, 2026-07-06, 7d
    Patient app shell            :p2, after p1, 7d

    section Phase 2 - Doctors & Booking
    Doctor verification flow     :p3, after p2, 6d
    Doctor search                :p4, after p3, 4d
    Appointment booking          :p5, after p4, 6d
    Doctor portal UI             :p6, after p5, 5d

    section Phase 3 - Talking & Trust
    Rating + trust score         :p7, after p6, 5d
    Chat + video                 :p8, after p7, 4d
    Notifications                :p9, after p8, 4d
    Voice + translation          :p10, after p9, 6d

    section Phase 4 - Care Layer
    Health timeline + reminders  :p11, after p10, 4d
    Companion care check-ins     :p12, after p11, 4d
    Donation flow                :p13, after p12, 5d
    Transparency reports         :p14, after p13, 4d

    section Phase 5 - Polish & Ship
    Admin/donor dashboard        :p15, after p14, 4d
    Accessibility pass           :p16, after p15, 3d
    Testing + bug fixing         :p17, after p16, 4d
    Final deploy + demo          :p18, after p17, 4d
```

### Week 1–2: Foundation
- Set up Next.js + NestJS + Postgres + Docker Compose
- Supabase Auth: signup/login/OTP working
- Patient can sign up, pick language + accessibility settings
- **Milestone:** Patient can log in and see an empty dashboard, deployed live

### Week 3–4: Doctors & Booking
- Doctor signup + document upload + admin approval screen
- Doctor search (Postgres full-text search — no need for a separate search engine yet)
- Appointment booking, rescheduling, cancellation
- **Milestone:** A verified doctor can be found and booked

### Week 5–6: Talking & Trust
- Post-appointment-only ratings, live trust score (Redis)
- Chat (Socket.io) + Video (Jitsi embed)
- Notifications (Firebase push + Twilio SMS trial)
- Voice input + translation wired into patient app
- **Milestone:** Full loop works — search, book, talk, rate — in multiple languages

### Week 7: Care & Trust Features
- Medicine reminder scheduling (BullMQ)
- Companion care: flag patients, schedule daily check-in calls
- Donation flow (Razorpay test mode)
- Public transparency report page
- **Milestone:** "No loneliness" and "transparent funding" are real, working features

### Week 8: Polish & Ship
- Admin/donor dashboard
- Accessibility pass: big fonts, voice navigation, simple mode
- Bug fixes, load test, final deploy
- Record demo video
- **Milestone:** Live, working product — built solo, on time

---

## 🗄️ Simple Data Model (high level)

```mermaid
erDiagram
    USER ||--o| PATIENT_PROFILE : has
    USER ||--o| DOCTOR_PROFILE : has
    DOCTOR_PROFILE ||--o{ APPOINTMENT : receives
    PATIENT_PROFILE ||--o{ APPOINTMENT : books
    APPOINTMENT ||--o| RATING : generates
    APPOINTMENT ||--o| PRESCRIPTION : produces
    PRESCRIPTION ||--o{ REMINDER : schedules
    PATIENT_PROFILE ||--o{ COMPANION_CHECKIN : flagged_for
    USER ||--o{ DONATION : makes

    USER {
        uuid id
        string phone
        string role
        string language
    }
    PATIENT_PROFILE {
        uuid id
        uuid user_id
        string accessibility_mode
    }
    DOCTOR_PROFILE {
        uuid id
        uuid user_id
        string specialty
        string verification_status
        float trust_score
    }
    APPOINTMENT {
        uuid id
        uuid patient_id
        uuid doctor_id
        datetime slot_time
        string status
    }
    RATING {
        uuid id
        uuid appointment_id
        int stars
        string note
    }
    PRESCRIPTION {
        uuid id
        uuid appointment_id
        text medicines
    }
    REMINDER {
        uuid id
        uuid prescription_id
        datetime due_at
        string status
    }
    COMPANION_CHECKIN {
        uuid id
        uuid patient_id
        date scheduled_date
        string call_status
    }
    DONATION {
        uuid id
        uuid user_id
        float amount
        string allocation
    }
```

---

## 🎯 Guiding Principle

**Build it boring first. Make it fancy later — only if it needs to be.**

Every "advanced" idea from the original plan (multi-language microservices, message queues, API gateways, Kubernetes) is still valid — it's just saved for *after* the product proves people want it. Right now, the job is to ship something real that a patient in a village can actually use.

---

## 🚀 Later, If It Grows (optional roadmap)

```mermaid
flowchart LR
    A[Modular Monolith<br/>Today] --> B{Real traffic<br/>+ real team?}
    B -->|Not yet| A
    B -->|Yes| C[Pull out Chat/Video<br/>as first microservice]
    C --> D[Add API Gateway]
    D --> E[Move to Kubernetes]
    E --> F[Split more modules<br/>as needed]
```

- [ ] Pull Chat/Video into its own service (first candidate — real-time load is different from the rest)
- [ ] Add a proper API Gateway once there's more than one frontend team
- [ ] Move to Kubernetes once you have real, sustained traffic
- [ ] Add DigiLocker doctor verification
- [ ] Offline-first PWA mode for low-connectivity areas

---

*Same mission. Same features. Just built the way one determined developer can actually finish it.*
