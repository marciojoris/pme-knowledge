# PME · Base de Estudos e Conhecimento

Ferramenta interna de consulta à base de conhecimento PME com assistente IA.

---

## Deploy no Vercel (passo a passo)

### 1. Crie uma conta no Vercel
Acesse https://vercel.com e crie uma conta gratuita (pode entrar com Google).

### 2. Faça upload do projeto
- No painel do Vercel, clique em **"Add New Project"**
- Escolha **"Upload"** (ou conecte ao GitHub se preferir)
- Arraste a pasta `pme-knowledge` inteira para o Vercel

### 3. Configure a variável de ambiente (IMPORTANTE)
Antes de finalizar o deploy:
- Vá em **"Environment Variables"**
- Adicione:
  - **Name:** `VITE_ANTHROPIC_API_KEY`
  - **Value:** sua chave da API da Anthropic (obtida em https://console.anthropic.com)

### 4. Deploy
- Clique em **"Deploy"**
- Aguarde ~1 minuto
- Você receberá uma URL do tipo `pme-knowledge-xxxx.vercel.app`

### 5. Compartilhe com a equipe
Envie a URL gerada para toda a equipe. Não é necessário login.

---

## Desenvolvimento local

```bash
npm install
npm run dev
```

Crie um arquivo `.env.local` com:
```
VITE_ANTHROPIC_API_KEY=sua_chave_aqui
```

---

## Atualizar o conteúdo

Quando novos documentos forem adicionados no ClickUp, solicite uma atualização
no chat do Claude — o conteúdo será rebuscado e um novo `App.jsx` será gerado.
