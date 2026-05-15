import { useState, useRef, useEffect } from "react";


const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || "";

const B = {
  orange: "#E8860A", orangeLt: "#FDF3E3", orangeMd: "#F5A623",
  green: "#27AE60", greenLt: "#E9F7EF",
  gray900: "#1A1A2E", gray700: "#3D3D5C", gray500: "#6B6B8A",
  gray300: "#C8C8D8", gray200: "#E8E8F0", gray100: "#F4F4F8",
  white: "#FFFFFF", sidebar: "#1E1E2F", sidebarHover: "#2A2A42",
};

// ─── All content pre-loaded from ClickUp ─────────────────────────────────────
const CONTENT = {
  "8cqb3aq-13357": { name: "Federal", content: "" },
  "8cqb3aq-13397": { name: "PIS e COFINS", content: "" },
  "8cqb3aq-13417": { name: "IRPJ e CSLL", content: "" },
  "8cqb3aq-13437": { name: "Imunidade na cadeia de exportação", content: "Seção dedicada a conceitos e casos relacionados a imunidade na cadeia de exportação" },
  "8cqb3aq-13737": { name: "Conceitos básicos e legais", content: `A desoneração das exportações constitui diretriz estruturante do sistema tributário brasileiro, alinhada aos princípios da neutralidade fiscal, da competitividade internacional e do estímulo ao desenvolvimento econômico. No âmbito das contribuições ao **PIS/Pasep e à COFINS**, tal diretriz manifesta-se por meio de **imunidade constitucional incidente sobre as receitas de exportação**, cujo alcance irradia efeitos por toda a cadeia exportadora.

### 1. Fundamento Constitucional
A base constitucional da imunidade encontra-se no **art. 149, § 2º, inciso I, da Constituição Federal**, que dispõe:

*"As contribuições sociais e de intervenção no domínio econômico de que trata o caput **não incidirão sobre as receitas decorrentes de exportação**."*

Esse dispositivo consagra verdadeira **imunidade tributária**, e não mera isenção ou alíquota zero, restringindo diretamente a competência tributária da União para exigir contribuições sociais sobre as receitas vinculadas à exportação de bens e serviços.

### 2. Tratamento Legal do PIS e da COFINS nas Exportações
No plano infraconstitucional, a imunidade foi operacionalizada pelas Leis nº **10.637/2002** (PIS) e **10.833/2003** (COFINS), que instituíram o regime da não cumulatividade. Ambas estabelecem a **alíquota zero** para receitas de exportação.

### 3. Manutenção de Créditos e a Cadeia de Exportação
O **art. 17 da Lei nº 11.033/2004** assegura a **manutenção dos créditos de PIS e COFINS** relativos a operações com alíquota zero, isenção, não incidência ou suspensão, inclusive nas hipóteses de exportação.

### 4. Exportações Diretas e Indiretas
A imunidade também se estende às **exportações indiretas**, realizadas por meio de empresas comerciais exportadoras ou tradings companies, desde que comprovada a efetiva destinação da mercadoria ao exterior.` },
  "8cqb3aq-13457": { name: "Insumos", content: "Seção dedicada a conceitos e casos envolvendo a parte de insumos na apuração de PIS e COFINS" },
  "8cqb3aq-14497": { name: "Créditos sobre combustíveis (Refinaria)", content: `Foi enviada uma consulta a Econet questionando como seriam os créditos de PIS e COFINS sobre combustíveis do regime monofásico, e tivemos esse retorno:

Os créditos de PIS/Pasep e de Cofins são determinados pelo artigo 3° da Lei n° 10.637/2002 e artigo 3° da Lei n° 10.833/2003 sobre bens e serviços utilizados como insumo na prestação de serviços e na produção ou fabricação de bens ou produtos destinados à venda, inclusive combustíveis e lubrificantes.

Para que seja considerado insumo, deverá ser observada a sua relevância ou essencialidade no processo produtivo ou da prestação do serviço (Parecer Normativo Cosit n° 05/2018).

| DESCRIÇÃO | CONDIÇÃO | BASE LEGAL |
|---|---|---|
| Combustíveis e lubrificantes | Desde que utilizados em veículos empregados diretamente no serviço de transporte | IN RFB n° 2.121/2022, art. 176, § 1°, inciso III |

Ademais, há previsão na **Solução de Consulta COSIT 16/2024**: a pessoa jurídica submetida à incidência não cumulativa que adquire produtos sujeitos à tributação concentrada a serem utilizados como insumos pode apurar créditos mediante a aplicação do percentual de 1,65% (PIS) — não a alíquota concentrada da cadeia.` },
  "8cqb3aq-13617": { name: "Exclusão ICMS ST da Base de Cálculo", content: `**Solução de Consulta COSIT Nº 100 DE 24/06/2025**

Em virtude da decisão proferida pelo Superior Tribunal de Justiça no julgamento do Tema 1125, o ICMS-ST **não compõe a base de cálculo de PIS e COFINS** devida pelo contribuinte substituído no regime de substituição tributária progressiva.

O montante do ICMS e do ICMS-ST a ser excluído da base de cálculo é aquele **destacado nas notas fiscais**.

Houve modulação dos efeitos da decisão, cuja produção se dá a partir da data de julgamento do mérito do RE nº 574.706 pelo STF (em 15/3/2017), ressalvadas as ações judiciais e administrativas protocolizadas até então.` },
  "8cqb3aq-13477": { name: "Estadual", content: "" },
  "8cqb3aq-13517": { name: "ICMS", content: "" },
  "8cqb3aq-13537": { name: "PR", content: "" },
  "8cqb3aq-13577": { name: "Resumo Operacional ICMS no Transporte — PR", content: `## PARANÁ – RESUMO OPERACIONAL ICMS TRANSPORTE

### 🔹 Regime de Apuração
- Créditos só permitidos no **regime normal (débito x crédito)**
  - **Vedado crédito** se optar por **crédito presumido** — Convênio ICMS 106/96
  - Itens 46 e 47 do Anexo VII do RICMS/PR

---

### 🔹 Insumos que Geram Crédito (PR)
✅ Permitidos, quando usados **diretamente na prestação do transporte**:
- Combustíveis
- Lubrificantes
- Aditivos e fluidos
- **ARLA 32**
- Pneus e câmaras
- Peças utilizadas nos veículos

📌 Base legal: Art. 25, §4º do RICMS/PR (Dec. 7.871/2017) · Consulta SEFA/PR nº **51/2023**

---

### 🔹 ARLA 32 – Tratamento Específico
- **Gera crédito de ICMS no PR**
- Considerado **insumo essencial** ao transporte rodoviário
- Permitido somente no **regime normal**
- Vedado para empresas no crédito presumido

📌 Reconhecimento expresso: Consulta SEFA/PR nº 51/2023

---

### 🔹 Condições para Aproveitamento do Crédito
A transportadora deve:
- Estar inscrita no **CAD/ICMS PR**
- Apurar ICMS pelo regime normal
- Utilizar o insumo **na prestação tributada**

Crédito não permitido:
- Em prestações isentas
- Em operações com redução de base
- Quando o **Paraná não for sujeito ativo**

---

### 🔹 Proporcionalidade dos Créditos
Obrigatória quando parte das prestações não tem o PR como sujeito ativo, é isenta, ou é interestadual.

✅ Crédito integral **somente se 100% da receita for tributada pelo PR**

📌 Base legal: Art. 25, §5º do RICMS/PR

**Fórmula:**
- Crédito aproveitável = Crédito total × (Receita tributada pelo PR ÷ Receita total)
- Crédito a estornar = Crédito total − Crédito aproveitável

---

### ✅ Resumo Rápido
- Pode creditar ARLA 32? **SIM**
- ARLA é insumo? **SIM**
- Regime exigido? **Normal**
- Crédito presumido permite crédito real? **NÃO**
- Existe proporcionalidade? **SIM**
- Base legal principal: **Art. 25 RICMS/PR + Consulta 51/2023**` },
  "8cqb3aq-13757": { name: "SP", content: "" },
  "8cqb3aq-13777": { name: "Resumo Operacional ICMS no Transporte — SP", content: `### 1️⃣ Identificação da Prestação
- Serviço **intermunicipal ou interestadual** → incide ICMS
- Serviço **intramunicipal** → ISS (não ICMS)
- Prestação **destinada à exportação** → possível isenção (Art. 149)

---

### 2️⃣ Crédito de ICMS – Análise Rápida
✅ **Pode gerar crédito:**
- Combustíveis (diesel, gasolina, etanol)
- ARLA
- Lubrificantes
- Insumos essenciais e diretamente consumidos

❌ **Não gera crédito:**
- Pneus
- Peças de manutenção
- Materiais rodantes
- Uso e consumo (limpeza, escritório, apoio adm.)

---

### 3️⃣ Regime de Crédito
- **Crédito Real (normal):** Pode aproveitar insumos + CIAP
- **Crédito Outorgado (20%):** Vedado qualquer outro crédito (insumos + CIAP)

⚠️ Atenção: crédito outorgado exige **estorno proporcional** de créditos comuns.

---

### 4️⃣ Ativo Imobilizado (CIAP)
- Crédito em **48 parcelas (1/48 ao mês)**
- Não optante pelo crédito outorgado
- Controle no **SPED Fiscal – Bloco G**

---

### 5️⃣ Subcontratação / Redespacho
- Prestação e trecho subcontratado iniciam em SP → ICMS recolhido pela **subcontratante**
- Subcontratada emite CT-e **sem destaque**
- Subcontratante **não pode se creditar** da prestação

---

### CONVÊNIO ICMS 106/96
Concede aos estabelecimentos prestadores de serviço de transporte um crédito de **20% do valor do ICMS devido na prestação**, em substituição ao sistema de tributação previsto na legislação estadual.

⚠️ **O contribuinte que optar pelo benefício não poderá aproveitar quaisquer outros créditos.** A opção deve alcançar todos os estabelecimentos do contribuinte localizados no território nacional.` },
  "8cqb3aq-14017": { name: "SC", content: "" },
  "8cqb3aq-14037": { name: "Resumo operacional do ICMS no Transporte — SC", content: `## 1) Insumos que dão direito a crédito
SC ampliou expressamente o direito de crédito para transportadoras pelo **Decreto 490/2024** (Alteração 4.714 do RICMS/SC-01).

Geram crédito (quando usados em prestação tributada iniciada em SC):
- Combustíveis (diesel, gasolina, etanol)
- Lubrificantes, aditivos e fluidos
- Pneus e câmaras de ar
- Peças de reposição efetivamente utilizadas nos veículos

📌 Base: § 8º do art. 29 do RICMS/SC-01

**Condições formais:** Nota fiscal deve conter identificação da placa do veículo abastecido. Há consulta COPAT 12/2025 confirmando que pneus, protetores e câmaras (mesmo sujeitos a ST) são insumos creditáveis para transportadoras.

---

## 2) Insumos sem crédito
- Despesas administrativas (escritório, telefone, internet)
- Despesas com pessoal (salários, diárias, hospedagem, alimentação)
- Multas e penalidades

---

## 3) Crédito presumido
Transportadoras podem optar por **crédito presumido de 20%** do ICMS devido na prestação, em vez do regime puro de débito/crédito, com base no art. 23 do RICMS/SC e Convênio 106/96.

Em regra, a opção pelo crédito presumido **impede o aproveitamento de créditos "reais" de insumos**, salvo exceções previstas.

---

## 4) CIAP
Bens do ativo imobilizado (caminhões, semirreboques, implementos) geram crédito via CIAP — **1/48 ao mês** (48 meses), conforme LC 87/1996 e RICMS/SC.

---

## 5) Estorno de créditos / proporcionalidade
Créditos de insumos vinculados a prestações isentas ou não tributadas (exportação, por exemplo) devem ser estornados proporcionalmente à receita não tributada, com base no art. 20 da LC 87/1996.` },
  "8cqb3aq-13977": { name: "RS", content: "" },
  "8cqb3aq-13997": { name: "Resumo operacional do ICMS no Transporte — RS", content: `### 🔹 Regime de Apuração
- **Regime Normal (Crédito x Débito):** Permite créditos reais de insumos e CIAP
- **Crédito Presumido:** Substitui integralmente os créditos reais — vedado o aproveitamento de insumos e CIAP

---

### 🔹 Insumos que Geram Crédito (RS)
✅ Permitidos quando **essenciais e diretamente aplicados** à prestação tributada:
- Combustíveis, Lubrificantes, Aditivos e fluídos
- **ARLA 32**
- Pneus e câmaras
- Peças e materiais de manutenção vinculados à atividade-fim

❌ Vedados: uso e consumo administrativo, itens sem vínculo direto com a prestação

📌 Fundamentação: princípio da não cumulatividade (LC 87/96 + RICMS/RS)

---

### 🔹 Proporcionalidade dos Créditos
Obrigatória quando parte das prestações é isenta, não tributada, tributada por outro Estado ou com redução de base de cálculo.

**Fórmula:**
- Crédito aproveitável = Crédito total × (Receita tributada pelo RS ÷ Receita total)
- Crédito a estornar = Crédito total − Crédito aproveitável

📌 Base legal: Art. 20, §1º – LC 87/96 + RICMS/RS

---

### 🔹 Ativo Imobilizado – CIAP
- Crédito em **48 parcelas mensais**, proporcional ao uso em operações tributadas
- Controle obrigatório no **Bloco G**

---

### 🔹 Escrituração Fiscal
- Créditos: **Bloco C** · Apuração: **E110** · Ajustes/Estornos: **E111 / E113** · CIAP: **Bloco G**` },
  "8cqb3aq-13937": { name: "GO", content: "" },
  "8cqb3aq-13957": { name: "Resumo operacional ICMS no Transporte — GO", content: `### 🔹 Insumos que Geram Crédito (GO)
✅ Permitidos quando vinculados a **prestação tributada iniciada em GO**:
- Combustíveis (diesel, gasolina, etanol)
- Lubrificantes, Aditivos e fluidos
- Pneus e câmaras de ar
- Peças de reposição e manutenção (quando essenciais à atividade-fim)

❌ Vedado: **ARLA** (não reconhecido como combustível para crédito em GO) · Uso e consumo sem vínculo direto

📌 Regra de apuração: **IN GSF nº 1.125/2012**

---

### 🔹 Regimes de Crédito
- **Crédito Normal:** Insumos + Ativo Imobilizado (CIAP)
- **Crédito Presumido – 20%:** Substitui todos os demais créditos (base: Convênio ICMS 106/96)

---

### 🔹 Proporcionalidade de Créditos
Obrigatória quando há prestações tributadas + isentas/não tributadas.

Fórmula: Crédito aproveitável = Crédito total × Receita tributada / Receita total

📌 Base legal: RCTE-GO art. 46, §4º · LC 87/96 art. 20, §1º

---

### 🔹 Alíquotas Goiás
- Alíquota interna padrão: **19%**
- Interestadual: 7% ou 12% conforme destino · Importados: **4%**

📌 Base legal: Lei GO nº 22.460/2023

---

### 🔹 Escrituração – Pontos Críticos
- Créditos: **Bloco C** · Apuração: **E110** · Ajustes/Estornos: **E111/E113** · CIAP: **Bloco G**` },
  "8cqb3aq-13897": { name: "PA", content: "" },
  "8cqb3aq-13917": { name: "Resumo operacional do ICMS no Transporte — PA", content: `### 🔹 Incidência do ICMS
ICMS incide somente sobre prestação de serviço de transporte **intermunicipal** e **interestadual**.

📌 Base legal: RICMS/PA – Decreto nº 4.676/2001

---

### 🔹 Subcontratação de Transporte (PA)
- Responsável pelo ICMS: transportadora que **emitiu o CT-e original**
- Subcontratada: não destaca ICMS, não gera débito nem crédito
- CFOP da subcontratada: **5.353 ou 6.353**

---

### 🔹 Direito a Crédito de ICMS – Insumos
✅ O PA **permite crédito** de ICMS sobre insumos utilizados na prestação **tributada**:
- Combustíveis, Lubrificantes, Aditivos e fluídos
- Pneus, Câmaras de ar, Peças de reposição

📌 O RICMS/PA **não traz lista taxativa de insumos** — o crédito é admitido com base no art. 55 do regulamento e na comprovação do vínculo com a operação tributada.

---

### 🔹 Estorno Proporcional de Créditos — Art. 68 RICMS/PA
Estorno de crédito é exigido quando o insumo for utilizado em:
1. Prestação **não tributada ou isenta**
2. Operação com produto final **isento ou não tributado**
3. Saída com **redução de base de cálculo**
4. Insumo furtado, roubado, extraviado ou deteriorado

✅ **Não há estorno** quando a operação for destinada à **exportação**

**Fórmula:** Estorno = Crédito apropriado × (Valor das operações não tributadas / Valor total das operações do período)` },
  "8cqb3aq-13657": { name: "IPVA", content: "" },
  "8cqb3aq-13677": { name: "TO", content: "" },
  "8cqb3aq-13717": { name: "Isenção — IPVA/TO", content: `Para se usufruir do benefício da **isenção do IPVA no estado do Tocantins**, o veículo deve ser novo, adquirido de revendedora ou montadora localizada dentro do estado, e a empresa adquirente deve exercer **atividade principal de locação de veículos**.

Exigências dadas pelo Art. 71, inciso XV da Lei 1.287/2001 (Código Tributário do estado do Tocantins).

---

**Caso real — Pergunta do cliente Magnabosco:** Existe benefício fiscal no estado do Tocantins na aquisição de caminhões?

**Resposta da Rumo:** Em consulta realizada, foi constatado que:
- Para o **ICMS na aquisição**: não existe benefício
- Para o **IPVA**: existe benefício de isenção, desde que a empresa tenha adquirido de uma montadora ou revendedora de dentro do estado, exercesse a atividade principal de **locação de veículos**, e o bem adquirido fosse **novo**

Requisitos estabelecidos pelo art. 71, Inciso XV da Lei n° 1.287/2001 (Código tributário do estado).` },
  "8cqb3aq-13637": { name: "Reforma Tributária", content: "Esta seção está em construção. Em breve será disponibilizado o conteúdo sobre a Reforma Tributária e seus impactos para o setor de transporte." },
  "8cqb3aq-14057": { name: "Valuation", content: "Seção dedicada a conceitos e estudos sobre as rotinas de valuation." },
  "8cqb3aq-14097": { name: "Conceitos de Valuation", content: `## 1. O que é Valuation
**Valuation** é o processo de **estimativa do valor econômico de uma empresa, ativo ou projeto**, com base em dados financeiros, premissas e expectativas futuras. Não representa um "preço exato", mas sim **uma faixa de valor razoável**.

---

## 2. Objetivos do Valuation
Um valuation pode ser elaborado para:
- Avaliar compra ou venda de empresas
- Fusões e aquisições (M&A)
- Entrada de investidores
- Reorganizações societárias
- Avaliação de projetos de investimento
- Suporte a decisões estratégicas e financeiras

---

## 3. Princípios Fundamentais

### a) Valor do Dinheiro no Tempo
R$ 1 hoje vale mais do que R$ 1 no futuro, devido a risco, inflação e custo de oportunidade.

### b) Risco e Retorno
Quanto maior o risco do negócio, **maior deve ser a taxa de retorno exigida**, impactando negativamente o valor da empresa.

### c) Capacidade de Geração de Caixa
O valor de uma empresa está ligado à **sua capacidade de gerar caixa no futuro**, e não apenas ao lucro contábil atual.` },
  "8cqb3aq-14157": { name: "Metodologias de Valuations", content: `## Principais Métodos de Valuation

### Fluxo de Caixa Descontado (DCF – Discounted Cash Flow)
É o método mais utilizado e conceitualmente mais robusto.

**Ideia central:** Projetar os fluxos de caixa futuros e descontá-los a valor presente por uma taxa adequada ao risco.

Componentes principais:
- Fluxo de Caixa Livre (FCFF ou FCFE)
- Taxa de desconto (WACC ou custo do capital próprio)
- Valor residual (perpetuidade ou saída)

---

### Avaliação por Múltiplos
Compara a empresa com outras semelhantes do segmento no mercado.

Exemplos de múltiplos: EV/EBITDA · P/L (Preço/Lucro) · EV/Receita

Características:
- Mais simples e rápida
- Depende fortemente da comparabilidade entre empresas
- Muito usada como método **complementar**

---

### Valor Patrimonial
Baseia-se nos ativos e passivos da empresa: Ativos – Passivos = Patrimônio Líquido

- Pouco adequado para empresas em funcionamento
- Mais comum em empresas imobiliárias ou em liquidação` },
  "8cqb3aq-14117": { name: "Prestação de contas", content: `A prestação e aprovação de contas é um processo anual, onde os sócios devem se reunir **anualmente**, até **4 meses após o encerramento do exercício social**, para:
- Tomar as contas dos administradores
- Deliberar sobre o **Balanço Patrimonial e DRE**
- Destinar o resultado (lucro ou prejuízo)
- Eleger administradores (se aplicável)

Normalmente essa aprovação ocorre por **Reunião de sócios** ou **Ata / Instrumento Particular de Aprovação de Contas** (posteriormente registrado na junta comercial).

Esse procedimento é obrigatório pelo art. 1.078 do Código Civil, porém não há consequência severa como multa para o não cumprimento.

---

**Caso real — Jund Transportes**

*Pergunta:* Recebemos um email do escritório de contabilidade nos solicitando a realização da aprovação anual de contas. Poderiam nos auxiliar?

*Resposta da Rumo:* A aprovação anual de contas refere-se a um procedimento societário exigido para sociedades limitadas e sociedades anônimas, sendo mais relevante e rigorosamente exigido no caso das SAs.

No caso específico das **sociedades limitadas**, a ausência desse registro não costuma gerar penalidade direta, podendo ocasionar questionamentos apenas em situações pontuais como auditorias ou operações societárias (compra e venda).` },
  "8cqb3aq-14137": { name: "Piso mínimo do frete", content: `O piso mínimo do frete é uma exigência legal da ANTT, com o valor mínimo a ser pago em cada operação de frete, tabelado dependendo do tipo de carga transportada. O não cumprimento pode ocasionar multas.

---

## Como está funcionando a fiscalização da ANTT hoje?
Desde **outubro/2025**, a ANTT faz **fiscalização automática** por meio do cruzamento eletrônico de dados do: MDF-e · CT-e · CIOT · Tabela vigente do Piso Mínimo

👉 Não depende mais de fiscalização presencial. Se o sistema identificar valor abaixo do mínimo, a **autuação é automática**.

---

## ✅ Quem é multado?
A responsabilidade é **solidária**: Embarcador · Transportadora · Cooperativa · Quem contrata ou subcontrata

Mesmo que o erro tenha sido combinado, todos respondem pela infração.

---

## Caso real — Sucesso Transportes
*Pergunta:* O pedágio tem que ser acrescido acima do piso mínimo?

*Resposta da Rumo:* O pedágio **NÃO pode estar incluído** dentro do piso mínimo. Ele deve ser acrescentado **acima** do piso mínimo.

**Base legal:** Lei nº 10.209/2001 (Vale-Pedágio Obrigatório) · Resolução ANTT nº 5.867/2020

**Exemplo prático:**
- Piso mínimo (tabela ANTT): R$ 4.500,00
- Pedágios do percurso: R$ 380,00
- ✅ Total correto: **R$ 4.880,00**

Se o contratante pagar R$ 4.500 já com pedágio incluso, a operação fica irregular e gera multa.` },
  "8cqb3aq-14397": { name: "Perguntas e respostas de casos reais", content: `## Caso 1 — Aprovação anual de contas (Jund Transportes)

*Pergunta:* Recebemos um email do escritório de contabilidade nos solicitando a realização da aprovação anual de contas. Poderiam nos auxiliar?

*Resposta da Rumo:* A aprovação anual de contas refere-se a um procedimento societário exigido para sociedades limitadas e SAs. Para as **sociedades limitadas**, a ausência desse registro não costuma gerar penalidade direta, podendo ocasionar questionamentos apenas em auditorias independentes ou operações de compra e venda.

---

## Caso 2 — Piso mínimo do frete e pedágio (Sucesso Transportes)

*Pergunta:* Como está funcionando a fiscalização em relação ao valor mínimo pela ANTT? O pedágio tem que ser acrescido acima do piso mínimo?

*Resposta da Rumo:* O pedágio **NÃO pode estar incluído** dentro do piso mínimo. Ele deve ser acrescentado **acima** do piso mínimo.

**Base legal:** Lei nº 10.209/2001 · Resolução ANTT nº 5.867/2020

Exemplo:
- Piso mínimo: R$ 4.500,00 + Pedágio: R$ 380,00 = **Total correto: R$ 4.880,00**

Se pagar R$ 4.500 já com pedágio incluso → operação irregular → **multa automática** (fiscalização eletrônica desde outubro/2025).` },
};

// ─── Tree structure ───────────────────────────────────────────────────────────
const TREE = [
  { folder: "Tributário", icon: "📊", id: "f-trib", docs: [
    { id: "8cqb3aq-212717", name: "Federal", pages: [
      { pageId: "8cqb3aq-13417", name: "IRPJ e CSLL" },
      { pageId: "8cqb3aq-13397", name: "PIS e COFINS", children: [
        { pageId: "8cqb3aq-13437", name: "Imunidade na cadeia de exportação", children: [
          { pageId: "8cqb3aq-13737", name: "Conceitos básicos e legais" }
        ]},
        { pageId: "8cqb3aq-13457", name: "Insumos", children: [
          { pageId: "8cqb3aq-14497", name: "Créditos sobre combustíveis (Refinaria)" }
        ]},
        { pageId: "8cqb3aq-13617", name: "Exclusão ICMS ST da Base de Cálculo" },
      ]},
    ]},
    { id: "8cqb3aq-212737", name: "Estadual", pages: [
      { pageId: "8cqb3aq-13517", name: "ICMS", children: [
        { pageId: "8cqb3aq-13537", name: "PR", children: [{ pageId: "8cqb3aq-13577", name: "Resumo Operacional ICMS no Transporte" }] },
        { pageId: "8cqb3aq-13757", name: "SP", children: [{ pageId: "8cqb3aq-13777", name: "Resumo Operacional ICMS no Transporte" }] },
        { pageId: "8cqb3aq-14017", name: "SC", children: [{ pageId: "8cqb3aq-14037", name: "Resumo operacional ICMS no Transporte" }] },
        { pageId: "8cqb3aq-13977", name: "RS", children: [{ pageId: "8cqb3aq-13997", name: "Resumo operacional ICMS no Transporte" }] },
        { pageId: "8cqb3aq-13937", name: "GO", children: [{ pageId: "8cqb3aq-13957", name: "Resumo operacional ICMS no Transporte" }] },
        { pageId: "8cqb3aq-13897", name: "PA", children: [{ pageId: "8cqb3aq-13917", name: "Resumo operacional ICMS no Transporte" }] },
      ]},
      { pageId: "8cqb3aq-13657", name: "IPVA", children: [
        { pageId: "8cqb3aq-13677", name: "TO", children: [{ pageId: "8cqb3aq-13717", name: "Isenção" }] }
      ]},
    ]},
    { id: "8cqb3aq-212757", name: "Reforma Tributária", pages: [{ pageId: "8cqb3aq-13637", name: "Reforma Tributária" }] },
  ]},
  { folder: "Financeiro", icon: "💰", id: "f-fin", docs: [
    { id: "8cqb3aq-212797", name: "Valuation", pages: [
      { pageId: "8cqb3aq-14057", name: "Valuation" },
      { pageId: "8cqb3aq-14097", name: "Conceitos" },
      { pageId: "8cqb3aq-14157", name: "Metodologias de Valuations" },
    ]},
  ]},
  { folder: "Legal e Jurídico", icon: "⚖️", id: "f-legal", docs: [
    { id: "8cqb3aq-212817", name: "Prestação de contas", pages: [{ pageId: "8cqb3aq-14117", name: "Prestação de contas" }] },
  ]},
  { folder: "Operacional do Transporte", icon: "🚛", id: "f-oper", docs: [
    { id: "8cqb3aq-212837", name: "Piso mínimo do frete", pages: [{ pageId: "8cqb3aq-14137", name: "Piso mínimo do frete" }] },
  ]},
  { folder: "Perguntas e Respostas", icon: "💬", id: "f-qa", docs: [
    { id: "8cqb3aq-217277", name: "Casos reais", pages: [{ pageId: "8cqb3aq-14397", name: "Perguntas e respostas de casos reais" }] },
  ]},
];

const ALL_DOCS = TREE.flatMap(f => f.docs);
function flattenPages(pages) { return pages.flatMap(p => [p, ...(p.children ? flattenPages(p.children) : [])]); }
function findDocForPage(pageId) { return ALL_DOCS.find(d => flattenPages(d.pages).some(p => p.pageId === pageId)); }
function clickupUrl(docId, pageId) { return `https://app.clickup.com/9017068887/docs/${docId}/${pageId}`; }

// ─── Markdown renderer ────────────────────────────────────────────────────────
function MdLine({ text }) {
  const html = text
    .replace(/\*\*(.+?)\*\*/g, `<strong style="color:#1A1A2E">$1</strong>`)
    .replace(/\*(.+?)\*/g, `<em>$1</em>`);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function renderMd(md) {
  if (!md) return <p style={{ color: B.gray500, fontSize: 13 }}>Sem conteúdo para esta página.</p>;
  return md.split("\n").map((line, i) => {
    if (line.startsWith("## ")) return <h2 key={i} style={{ fontSize: 16, fontWeight: 700, color: B.gray900, margin: "20px 0 8px", paddingBottom: 6, borderBottom: `2px solid ${B.orange}` }}><MdLine text={line.slice(3)} /></h2>;
    if (line.startsWith("### ")) return <h3 key={i} style={{ fontSize: 14, fontWeight: 700, color: B.gray900, margin: "16px 0 6px" }}><MdLine text={line.slice(4)} /></h3>;
    if (line.match(/^---+$/)) return <hr key={i} style={{ border: "none", borderTop: `1px solid ${B.gray200}`, margin: "14px 0" }} />;
    if (line.match(/^\|.+\|$/)) return <p key={i} style={{ fontSize: 12, color: B.gray700, fontFamily: "monospace", background: B.gray100, padding: "4px 8px", borderRadius: 3, margin: "2px 0" }}><MdLine text={line} /></p>;
    if (line.match(/^-\s+/)) {
      const indent = 0;
      return <div key={i} style={{ display: "flex", gap: 8, padding: "2px 0", paddingLeft: indent }}><span style={{ color: B.orange, flexShrink: 0 }}>•</span><span style={{ fontSize: 13, lineHeight: 1.7, color: B.gray700 }}><MdLine text={line.replace(/^-\s+/, "")} /></span></div>;
    }
    if (line.trim() === "") return <div key={i} style={{ height: 6 }} />;
    return <p key={i} style={{ fontSize: 13, lineHeight: 1.75, color: B.gray700, margin: "2px 0" }}><MdLine text={line} /></p>;
  });
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function PageNode({ page, depth, onSelect, selectedId }) {
  const [open, setOpen] = useState(depth < 1);
  const hasChildren = page.children?.length > 0;
  const isSelected = selectedId === page.pageId;
  const pl = 14 + depth * 12;
  return (
    <div>
      <div onClick={() => { onSelect(page); if (hasChildren) setOpen(o => !o); }}
        style={{ display: "flex", alignItems: "center", gap: 5, padding: `5px 10px 5px ${pl}px`, borderRadius: 4, cursor: "pointer", background: isSelected ? B.orange : "transparent", color: isSelected ? B.white : "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: isSelected ? 600 : 400, borderLeft: isSelected ? `3px solid ${B.orangeMd}` : "3px solid transparent", transition: "all .12s" }}
        onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.background = B.sidebarHover; e.currentTarget.style.color = B.white; } }}
        onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; } }}>
        {hasChildren ? <span style={{ fontSize: 8, opacity: .7, transform: open ? "rotate(90deg)" : "rotate(0)", display: "inline-block", transition: "transform .15s", flexShrink: 0 }}>▶</span> : <span style={{ width: 10, flexShrink: 0 }} />}
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{page.name}</span>
      </div>
      {hasChildren && open && page.children.map(c => <PageNode key={c.pageId} page={c} depth={depth + 1} onSelect={onSelect} selectedId={selectedId} />)}
    </div>
  );
}

function Sidebar({ onSelectPage, selectedPage, visible }) {
  const [openFolders, setOpenFolders] = useState(Object.fromEntries(TREE.map(f => [f.id, true])));
  const [openDocs, setOpenDocs] = useState({});
  const [search, setSearch] = useState("");
  if (!visible) return null;
  const match = n => !search || n.toLowerCase().includes(search.toLowerCase());
  return (
    <div style={{ width: 230, minWidth: 230, background: B.sidebar, display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto" }}>
      <div style={{ padding: "14px 14px 10px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: B.orange }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Base de Conhecimento</span>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..."
          style={{ width: "100%", padding: "6px 10px", borderRadius: 5, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.07)", color: B.white, fontSize: 12, outline: "none", fontFamily: "inherit" }} />
      </div>
      <div style={{ padding: "8px 6px", flex: 1 }}>
        {TREE.map(folder => {
          const filteredDocs = folder.docs.filter(doc => match(doc.name) || flattenPages(doc.pages).some(p => match(p.name)));
          if (search && !filteredDocs.length) return null;
          return (
            <div key={folder.id} style={{ marginBottom: 3 }}>
              <div onClick={() => setOpenFolders(p => ({ ...p, [folder.id]: !p[folder.id] }))}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 10px", borderRadius: 5, cursor: "pointer", color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 700 }}
                onMouseEnter={e => e.currentTarget.style.background = B.sidebarHover}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <span style={{ fontSize: 13 }}>{folder.icon}</span>
                <span style={{ flex: 1 }}>{folder.folder}</span>
                <span style={{ fontSize: 8, opacity: .45, transform: openFolders[folder.id] ? "rotate(90deg)" : "rotate(0)", display: "inline-block", transition: "transform .15s" }}>▶</span>
              </div>
              {(openFolders[folder.id] || search) && filteredDocs.map(doc => (
                <div key={doc.id} style={{ marginLeft: 6 }}>
                  <div onClick={() => setOpenDocs(p => ({ ...p, [doc.id]: p[doc.id] === false ? true : false }))}
                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 4, cursor: "pointer", color: "rgba(255,255,255,0.55)", fontSize: 12 }}
                    onMouseEnter={e => { e.currentTarget.style.background = B.sidebarHover; e.currentTarget.style.color = B.white; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}>
                    <span style={{ fontSize: 10 }}>📄</span>
                    <span style={{ flex: 1, fontWeight: 500 }}>{doc.name}</span>
                    <span style={{ fontSize: 8, opacity: .4, transform: openDocs[doc.id] !== false ? "rotate(90deg)" : "rotate(0)", display: "inline-block", transition: "transform .15s" }}>▶</span>
                  </div>
                  {openDocs[doc.id] !== false && doc.pages.map(p => <PageNode key={p.pageId} page={p} depth={2} onSelect={onSelectPage} selectedId={selectedPage?.pageId} />)}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(255,255,255,0.07)", fontSize: 10, color: "rgba(255,255,255,0.25)" }}>
        PME · {ALL_DOCS.length} documentos indexados
      </div>
    </div>
  );
}

// ─── Content Viewer ───────────────────────────────────────────────────────────
function ContentViewer({ page, onAskAboutPage }) {
  if (!page) return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: B.gray100, gap: 10 }}>
      <div style={{ fontSize: 40 }}>📚</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: B.gray700 }}>Selecione uma página</div>
      <div style={{ fontSize: 12, color: B.gray500, textAlign: "center", maxWidth: 260 }}>Clique em qualquer item da barra lateral para visualizar o conteúdo</div>
    </div>
  );

  const doc = findDocForPage(page.pageId);
  const data = CONTENT[page.pageId];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: B.white }}>
      <div style={{ padding: "12px 24px", borderBottom: `3px solid ${B.orange}`, background: B.white, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: B.gray900 }}>{page.name}</div>
          <div style={{ fontSize: 11, color: B.gray500, marginTop: 2 }}>{doc?.name} · Base de Conhecimento PME</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button onClick={() => onAskAboutPage(page)}
            style={{ fontSize: 12, padding: "5px 14px", borderRadius: 4, border: `1px solid ${B.orange}`, color: B.orange, background: B.orangeLt, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>
            ✦ Perguntar sobre esta página
          </button>
          <a href={clickupUrl(doc?.id, page.pageId)} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 12, padding: "5px 14px", borderRadius: 4, border: `1px solid ${B.gray300}`, color: B.gray700, background: B.gray100, textDecoration: "none", fontWeight: 600 }}>
            Abrir no ClickUp ↗
          </a>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22, paddingBottom: 14, borderBottom: `1px solid ${B.gray200}` }}>
          <div style={{ width: 4, height: 18, background: B.orange, borderRadius: 2 }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: B.gray500, textTransform: "uppercase", letterSpacing: "0.08em" }}>Conteúdo · {data?.name || page.name}</span>
        </div>
        {renderMd(data?.content)}
      </div>
    </div>
  );
}

// ─── Chat ─────────────────────────────────────────────────────────────────────
const SUGGESTIONS = [
  "Como funciona o ICMS no transporte no PR?",
  "Quais créditos de PIS/COFINS sobre insumos?",
  "O que é imunidade na cadeia de exportação?",
  "Quais metodologias de valuation existem?",
  "Como funciona o piso mínimo do frete?",
];

function ChatPanel({ selectedPage }) {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Olá! Sou o assistente da base de conhecimento PME. Selecione uma página ou faça uma pergunta.", sources: [] }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const prevPageId = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (selectedPage && selectedPage.pageId !== prevPageId.current) {
      prevPageId.current = selectedPage.pageId;
      setMessages(prev => [...prev, { role: "assistant", isNav: true, content: `Contexto definido: "${selectedPage.name}". Suas perguntas serão respondidas com prioridade nesta página.`, sources: [{ name: selectedPage.name, pageId: selectedPage.pageId }] }]);
    }
  }, [selectedPage]);

  async function send(overrideQ) {
    const q = (overrideQ || input).trim();
    if (!q || loading) return;
    setInput(""); setLoading(true);
    setMessages(prev => [...prev, { role: "user", content: q }, { role: "loading", content: "Consultando a base de conhecimento..." }]);
    try {
      // Build context from pre-loaded content
      const allContent = Object.entries(CONTENT)
        .filter(([, v]) => v.content)
        .map(([id, v]) => `### ${v.name}\n${v.content}`)
        .join("\n\n---\n\n");

      const contextualContent = selectedPage && CONTENT[selectedPage.pageId]?.content
        ? `PÁGINA ATUAL: ${selectedPage.name}\n${CONTENT[selectedPage.pageId].content}\n\n---\n\n` + allContent
        : allContent;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json", "x-api-key": ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: `Você é o assistente da base de estudos e conhecimento PME (RumoBrasil), especializado em tributário, transporte e finanças.
Responda EXCLUSIVAMENTE com base no conteúdo dos documentos fornecidos abaixo.
Se a informação não estiver nos documentos, diga claramente que não encontrou.
Seja objetivo, claro e use linguagem profissional em português brasileiro.
Não invente informações. Não use headings com # no início.${selectedPage ? `\n\nO usuário está visualizando a página: "${selectedPage.name}".` : ""}`,
          messages: [{ role: "user", content: `BASE DE CONHECIMENTO PME:\n\n${contextualContent}\n\n---\n\nPergunta: ${q}` }]
        })
      });
      const data = await res.json();
      const answer = data.content?.find(b => b.type === "text")?.text || "Não consegui gerar uma resposta.";
      const sources = selectedPage ? [{ name: selectedPage.name, pageId: selectedPage.pageId }] : [];
      setMessages(prev => prev.filter(m => m.role !== "loading").concat({ role: "assistant", content: answer, sources }));
    } catch {
      setMessages(prev => prev.filter(m => m.role !== "loading").concat({ role: "assistant", content: "Erro ao consultar. Tente novamente.", sources: [] }));
    }
    setLoading(false);
  }

  const doc = selectedPage ? findDocForPage(selectedPage.pageId) : null;

  return (
    <div style={{ width: 360, minWidth: 300, display: "flex", flexDirection: "column", borderLeft: `1px solid ${B.gray200}`, background: B.gray100 }}>
      <div style={{ padding: "12px 16px", borderBottom: `3px solid ${B.orange}`, background: B.white, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 4, background: B.orangeLt, border: `1px solid ${B.orangeMd}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✦</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: B.gray900 }}>Assistente <span style={{ color: B.orange }}>PME</span></div>
          <div style={{ fontSize: 10, color: B.gray500 }}>{selectedPage ? <><span style={{ color: B.green }}>●</span> {selectedPage.name}</> : "Busca inteligente"}</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 6px", display: "flex", flexDirection: "column" }}>
        {messages.length === 1 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: B.gray500, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 3, height: 10, background: B.orange, borderRadius: 2 }} /> Sugestões
            </div>
            {SUGGESTIONS.map(q => (
              <button key={q} onClick={() => send(q)}
                style={{ display: "block", width: "100%", textAlign: "left", fontSize: 11, padding: "7px 10px", borderRadius: 4, border: `1px solid ${B.gray300}`, background: B.white, color: B.gray700, cursor: "pointer", lineHeight: 1.4, fontFamily: "inherit", marginBottom: 5 }}>
                {q}
              </button>
            ))}
          </div>
        )}
        {messages.map((msg, i) => {
          if (msg.role === "user") return (
            <div key={i} style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
              <div style={{ background: B.orange, color: B.white, borderRadius: "10px 10px 2px 10px", padding: "8px 12px", maxWidth: "85%", fontSize: 12, lineHeight: 1.6, fontWeight: 500 }}>{msg.content}</div>
            </div>
          );
          if (msg.role === "loading") return (
            <div key={i} style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: 3, background: B.orangeLt, border: `1px solid ${B.orangeMd}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>✦</div>
              <div style={{ background: B.white, border: `1px solid ${B.gray300}`, borderRadius: "2px 10px 10px 10px", padding: "8px 12px", fontSize: 12, color: B.gray500, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ display: "inline-flex", gap: 3 }}>{[0, .18, .36].map((d, idx) => <span key={idx} style={{ animation: `pulse 1.1s ${d}s infinite`, fontSize: 6, color: B.orange }}>●</span>)}</span>
                {msg.content}
              </div>
            </div>
          );
          return (
            <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: 3, background: msg.isNav ? B.greenLt : B.orangeLt, border: `1px solid ${msg.isNav ? B.green : B.orangeMd}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>{msg.isNav ? "📄" : "✦"}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ background: B.white, border: `1px solid ${B.gray300}`, borderLeft: `3px solid ${msg.isNav ? B.green : B.orange}`, borderRadius: "0 7px 7px 7px", padding: "9px 12px", fontSize: 12, lineHeight: 1.75, color: B.gray900 }}>{msg.content}</div>
                {msg.sources?.length > 0 && (
                  <div style={{ marginTop: 5, display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {msg.sources.map((s, idx) => {
                      const d = s.pageId ? findDocForPage(s.pageId) : null;
                      return (
                        <a key={idx} href={d ? clickupUrl(d.id, s.pageId) : "#"} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: 10, padding: "2px 8px", borderRadius: 3, border: `1px solid ${B.orangeMd}`, color: B.orange, background: B.orangeLt, textDecoration: "none", fontWeight: 600 }}>
                          📄 {s.name}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: "10px 12px 14px", borderTop: `1px solid ${B.gray300}`, background: B.white }}>
        <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={selectedPage ? `Pergunte sobre "${selectedPage.name}"...` : "Faça uma pergunta..."}
            rows={2}
            style={{ flex: 1, padding: "8px 10px", borderRadius: 5, border: `1px solid ${B.gray300}`, fontSize: 12, lineHeight: 1.5, fontFamily: "inherit", color: B.gray900, background: B.gray100, resize: "none", outline: "none" }} />
          <button onClick={() => send()} disabled={loading || !input.trim()}
            style={{ height: 40, padding: "0 14px", borderRadius: 4, border: "none", background: loading || !input.trim() ? B.gray300 : B.orange, color: B.white, fontSize: 12, fontWeight: 700, cursor: loading || !input.trim() ? "default" : "pointer", fontFamily: "inherit" }}>
            {loading ? "..." : "↑"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [selectedPage, setSelectedPage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("content");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:.2} 50%{opacity:1} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea:focus { border-color: ${B.orange} !important; box-shadow: 0 0 0 2px ${B.orangeLt}; }
        input:focus { border-color: ${B.orange} !important; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${B.gray300}; border-radius: 2px; }
      `}</style>

      <div style={{ height: 48, background: B.gray900, display: "flex", alignItems: "center", padding: "0 16px", gap: 12, flexShrink: 0, borderBottom: `2px solid ${B.orange}` }}>
        <button onClick={() => setSidebarOpen(o => !o)}
          style={{ width: 30, height: 30, borderRadius: 4, border: "1px solid rgba(255,255,255,0.15)", background: sidebarOpen ? "rgba(255,255,255,0.08)" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "rgba(255,255,255,0.7)" }}>☰</button>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: B.orange }}>PME</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginLeft: 4 }}>Base de Estudos e Conhecimento</span>
        </div>
        {selectedPage && <>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 14 }}>›</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedPage.name}</span>
        </>}
        <div style={{ marginLeft: "auto", display: "flex", gap: 2, background: "rgba(255,255,255,0.08)", borderRadius: 6, padding: 3 }}>
          {[{ id: "content", label: "📄 Conteúdo" }, { id: "chat", label: "✦ Assistente" }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ fontSize: 11, padding: "4px 12px", borderRadius: 4, border: "none", background: activeTab === tab.id ? B.orange : "transparent", color: activeTab === tab.id ? B.white : "rgba(255,255,255,0.55)", cursor: "pointer", fontWeight: 600, fontFamily: "inherit", transition: "all .15s" }}>
              {tab.label}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginLeft: 8 }}>RumoBrasil</div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <Sidebar onSelectPage={p => { setSelectedPage(p); setActiveTab("content"); }} selectedPage={selectedPage} visible={sidebarOpen} />
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div style={{ flex: 1, display: activeTab === "content" ? "flex" : "none", overflow: "hidden" }}>
            <ContentViewer page={selectedPage} onAskAboutPage={p => { setSelectedPage(p); setActiveTab("chat"); }} />
          </div>
          <div style={{ flex: 1, display: activeTab === "chat" ? "flex" : "none", overflow: "hidden" }}>
            <ChatPanel selectedPage={selectedPage} />
          </div>
        </div>
      </div>
    </div>
  );
}
