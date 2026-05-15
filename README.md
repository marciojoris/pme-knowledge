# PME · Base de Estudos e Conhecimento

Ferramenta interna com conteúdo em tempo real do ClickUp + Assistente IA.

---

## Deploy no Vercel

### 1. Suba para o GitHub
Substitua os arquivos no repositório GitHub que você já criou.

### 2. Variáveis de ambiente no Vercel
Em **Settings → Environment Variables**, adicione:

| Nome | Valor |
|------|-------|
| `CLICKUP_TOKEN` | seu token do ClickUp |
| `ANTHROPIC_API_KEY` | sua chave da Anthropic (console.anthropic.com) |

### 3. Redeploy
O Vercel detecta as mudanças automaticamente e republica.

---

## Como funciona
- O conteúdo é buscado **em tempo real** do ClickUp a cada consulta
- O token do ClickUp e a chave da Anthropic ficam **seguros no servidor**
- Nunca são expostos no browser
- O Assistente IA lê **todos os documentos** da base antes de responder
