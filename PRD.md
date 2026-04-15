Berikut aku buatkan **PRD + App Flow + MVP** untuk aplikasi chatbot general berbasis **Gemini API (free tier)** dengan stack yang kamu pilih. Aku buat dengan gaya yang bisa langsung dipakai untuk development 🚀

---

# 📄 PRODUCT REQUIREMENT DOCUMENT (PRD)

## 1. 🧩 Overview

Aplikasi ini adalah **AI Chatbot General** berbasis web yang memungkinkan user bertanya apa saja (seperti ChatGPT), menggunakan **Gemini API (free model)** sebagai engine utama.

Fokus utama:

* Simple
* Cepat digunakan (tanpa login di awal)
* UI modern (landing page + chat interface)
* Bisa di-scale jadi SaaS nanti

---

## 2. 🎯 Problem Statement

Banyak user ingin:

* Bertanya cepat ke AI tanpa ribet login
* UI yang clean & ringan
* Alternatif chatbot gratis selain platform besar

Masalah saat ini:

* Banyak chatbot terlalu kompleks
* Tidak customizable
* UX kurang smooth

---

## 3. 👥 Target User

* Mahasiswa
* Developer
* Pekerja umum
* User casual (tanya random)

---

## 4. 🧠 Solution

Membuat web chatbot dengan:

* Landing page menarik
* Chat realtime dengan Gemini API
* Riwayat chat tersimpan (opsional MVP+)
* UI smooth dengan animasi

---

## 5. ⭐ Core Features

### 5.1 Chat dengan AI (WAJIB)

* Input text
* Response dari Gemini API
* Typing indicator
* Streaming response (opsional)

### 5.2 Landing Page

* Hero section
* CTA “Mulai Chat”
* Preview chat UI

### 5.3 Chat UI

* Bubble chat user & bot
* Auto scroll
* Timestamp sederhana

### 5.4 Basic History (Optional MVP+)

* Simpan chat ke Supabase
* Load chat sebelumnya

---

## 6. 🚫 Out of Scope (Versi Awal)

* Login / Auth
* Multi-user session
* Voice input
* Fine-tuned AI
* File upload

---

# 🏗️ TECH STACK

## Frontend

* **Next.js (App Router)**
* Tailwind CSS
* Framer Motion

## Backend (BaaS)

* Supabase PostgreSQL

## AI

* Gemini API (free model, misalnya: `gemini-1.5-flash` / `gemini-1.5-pro` free tier)

## Deployment

* Vercel (Frontend + API routes Next.js)

---

# 🧱 SYSTEM ARCHITECTURE

```
User (Browser)
   ↓
Next.js (Frontend + API Route)
   ↓
Gemini API
   ↓
Response ke Frontend
   ↓
(Optional) Simpan ke Supabase
```

---

# 🔄 APP FLOW

## 1. Landing Page

```
User buka website
→ lihat hero section
→ klik "Start Chat"
→ masuk ke halaman /chat
```

---

## 2. Chat Flow

```
User ketik pesan
→ klik send
→ request ke API route Next.js
→ API call ke Gemini
→ response dikirim balik
→ ditampilkan di UI
```

---

## 3. (Optional) Save Chat

```
Setelah response
→ simpan ke Supabase:
   - message
   - role (user/bot)
   - timestamp
```

---

# 📱 UI STRUCTURE

## 1. Landing Page (`/`)

* Navbar
* Hero Section
* CTA Button
* Preview Chat Animation
* Footer

---

## 2. Chat Page (`/chat`)

* Header (judul chatbot)
* Chat container
* Input field
* Send button

---

# ⚙️ MVP (Minimum Viable Product)

## ✅ MVP Scope (WAJIB)

* Landing page
* Chat page
* Integrasi Gemini API
* UI chat basic
* Tanpa login
* Tanpa database dulu (optional)

---

## 🚀 MVP+ (Next Step)

* Simpan chat ke Supabase
* Chat history
* Dark mode
* Streaming response
* Prompt customization

---

# 📦 DATABASE DESIGN (OPTIONAL)

Kalau pakai Supabase:

### Table: `messages`

| Field      | Type      |
| ---------- | --------- |
| id         | uuid      |
| role       | text      |
| content    | text      |
| created_at | timestamp |

---

# 🔌 API DESIGN (Next.js Route)

### POST `/api/chat`

**Request:**

```json
{
  "message": "Apa itu AI?"
}
```

**Response:**

```json
{
  "reply": "AI adalah..."
}
```

---

# 🧑‍💻 DEVELOPMENT PLAN

## Phase 1 (MVP)

* Setup Next.js
* Setup Tailwind + Framer Motion
* Build landing page
* Build chat UI
* Integrasi Gemini API

## Phase 2

* Supabase integration
* Save chat
* Load history

## Phase 3

* UX improvement
* Streaming response
* Optimization

---

# 🎨 UX NOTES

* Gunakan animasi Framer Motion:

  * Fade in chat bubble
  * Typing effect
* Auto scroll ke bawah saat chat baru
* Input sticky di bawah

---

# ⚠️ RISKS

* Limit API Gemini free
* Latency response
* Tanpa auth → tidak bisa personalisasi
