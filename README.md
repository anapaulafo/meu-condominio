# 🏢 App de Gestão de Condomínio

Aplicativo desenvolvido em **React Native (Expo)** com backend em **Supabase**, para gerenciamento de condomínios.  
O sistema permite controle de **reservas de áreas comuns**, **avisos do condomínio** e **encomendas recebidas pelo porteiro**.

---

## 🚀 Funcionalidades

### 👤 Morador
- Visualizar avisos do condomínio
- Realizar reservas de áreas comuns (piscina, academia, cinema, salão de festas)
- Visualizar suas encomendas

### 🛎️ Porteiro
- Publicar avisos para todos os moradores
- Registrar encomendas com foto
- Visualizar reservas realizadas

---

## ⚙️ Como rodar o projeto

### 1. Clonar o repositório

```bash
git clone https://seu-repositorio-aqui.git
cd meu-condominio
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Adicione um arquivo **.env** na raiz do projeto:

```env
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

### 4. Rodar o projeto

```bash
npx expo start
```

Depois escaneie o QR Code no app **Expo Go**.

---
