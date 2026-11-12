# 🚀 Guia de Deploy — Projeto Sombrinha ☂️

Este repositório está estruturado como um monorepo limpo contendo `frontend/` e `backend/`.

---

## 1. Deploy do Frontend na Vercel (Gratuito)

1. Acesse [vercel.com](https://vercel.com) e conecte com o GitHub.
2. Clique em **"Add New..."** > **"Project"** e selecione o repositório `Artur-Leone/rede-solidaria` (ou `sombrinha`).
3. Nas configurações do projeto:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Clique em *Edit* e selecione `frontend`.
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Em **Environment Variables**:
   - `VITE_API_URL`: Insira a URL do seu backend no Render (ex: `https://sombrinha-api.onrender.com`).
5. Clique em **Deploy**! Em menos de 1 minuto o site estará no ar com HTTPS gratuito.

---

## 2. Deploy do Backend no Render (Gratuito)

1. Acesse [render.com](https://render.com) e crie uma conta gratuita com o GitHub.
2. Clique em **"New +"** > **"Web Service"**.
3. Selecione o repositório do projeto.
4. Configure os campos:
   - **Name:** `sombrinha-api`
   - **Region:** Ohio (US East) ou Oregon
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan Type:** `Free`
5. Em **Environment Variables** (clique em *Add Environment Variable*):
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (ou deixe o Render injetar automaticamente)
   - `CORS_ORIGIN` = `*` (ou a URL do seu frontend na Vercel)
6. Clique em **Create Web Service**. 
7. Assim que terminar, teste abrindo `https://SEU-APP.onrender.com/api/health`.

---

## 3. Integração Automática (CI)
O arquivo `.github/workflows/ci.yml` já está configurado. A cada push na branch `main`:
- O backend executa todos os testes automatizados com Vitest.
- O frontend executa o build com Vite para garantir que não há erros de compilação.
