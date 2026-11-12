# 🤝 Rede Solidária

> **Hackathon Antena na Lama — APONTI Academy**  
> *Caminho 3 — Mobilizar e recuperar (depois da crise)*

Plataforma inteligente para conectar pedidos de ajuda e ofertas de doações em situações de eventos climáticos extremos na Região Metropolitana do Recife (RMR).

---

## 👥 Equipe
- **Artur Leone** ([@Artur-Leone](https://github.com/Artur-Leone))
- **Madu Barretto** ([@madubt](https://github.com/madubt))
- *(Membros da equipe)*

---

## 🎯 O Problema
Após eventos climáticos extremos (chuvas torrenciais, alagamentos, deslizamentos), muitas pessoas precisam com urgência de itens básicos (alimentos, água potável, colchões, roupas, abrigo). Ao mesmo tempo, voluntários e organizações estão dispostos a doar, mas os pedidos e ofertas ficam espalhados de forma caótica em grupos de WhatsApp e redes sociais, atrasando o socorro a quem mais precisa.

## 💡 A Solução
A **Rede Solidária** centraliza pedidos de socorro e ofertas de voluntários em uma plataforma web simples e acessível. A Inteligência Artificial atua como assistente:
1. Interpreta o pedido em linguagem natural.
2. Sugere automaticamente a categoria e prioridade.
3. Extrai dados chave (bairro, pessoas afetadas, urgência).
4. Sugere correspondências (matches) inteligentes entre doações disponíveis e pedidos.
5. **Supervisão Humana Obrigatória:** Nenhuma decisão ou doação é aprovada autonomamente pela IA. Toda correspondência é validada por um responsável humano.

---

## 🛠️ Stack Tecnológica
- **Frontend:** React.js, Vite, HTML5, CSS3, Fetch/Axios.
- **Backend:** Node.js (ES Modules), Express.js, API REST.
- **Banco de Dados:** PostgreSQL + Prisma ORM.
- **Inteligência Artificial:** `AIService` desacoplado com suporte a fallback simulado (Mock).
- **Dados Territoriais / Abertos:** OpenStreetMap & Dados Abertos Recife.
- **DevOps & Deploy:** Vercel (Frontend), Render (Backend), GitHub Actions (CI).

---

## ⚡ Como Rodar o Projeto Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/Artur-Leone/rede-solidaria.git
cd rede-solidaria
```
