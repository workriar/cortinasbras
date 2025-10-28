# 🏠 Cortinas Brás - Landing Page Profissional

Landing page moderna e profissional para Cortinas Brás, desenvolvida com **Flask (Backend)** e **React (Frontend)**.

## 🚀 Tecnologias

### Backend
- **Flask 3.0** - Framework web Python
- **Flask-CORS** - Suporte a CORS para API
- **Gunicorn** - Servidor WSGI de produção

### Frontend
- **React 18** - Biblioteca JavaScript para UI
- **CSS3** - Estilização moderna e responsiva
- **Componentização** - Arquitetura modular

## 📁 Estrutura do Projeto

```
meu-projeto/
├── backend/
│   ├── app.py              # API Flask
│   ├── build/              # Build do React
│   └── requirements.txt
├── frontend/
│   ├── public/
│   │   ├── logobras.png
│   │   └── slide*.jpg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js/css
│   │   │   ├── Carousel.js/css
│   │   │   ├── Hero.js/css
│   │   │   ├── QuoteForm.js/css
│   │   │   ├── Map.js/css
│   │   │   └── Footer.js/css
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
├── deploy/
│   ├── cortinas-bras-new.service
│   └── nginx_cortinas.conf
└── build.sh
```

## 🛠️ Desenvolvimento

### Pré-requisitos
- Python 3.8+
- Node.js 14+
- npm ou yarn

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm start
```

O frontend rodará em `http://localhost:3000` com proxy para o backend em `http://localhost:5000`.

## 📦 Build para Produção

```bash
# Build completo
./build.sh

# Ou manualmente:
cd frontend
npm run build
cd ..
cp -r frontend/build backend/
```

## 🚀 Deploy

### Systemd Service
```bash
sudo cp deploy/cortinas-bras-new.service /etc/systemd/system/cortinas-bras.service
sudo systemctl daemon-reload
sudo systemctl enable cortinas-bras
sudo systemctl start cortinas-bras
```

### Nginx
O projeto já está configurado para rodar em produção na porta 8000, com Nginx fazendo proxy reverso.

## 🎨 Features

- ✅ Design moderno e responsivo
- ✅ Carrossel de imagens automático
- ✅ Formulário de orçamento integrado com WhatsApp
- ✅ Mapa de localização do Google Maps
- ✅ Otimização para SEO
- ✅ Performance otimizada
- ✅ API RESTful com Flask
- ✅ Componentização React

## 📱 Integração WhatsApp

O formulário de orçamento envia automaticamente uma mensagem formatada para o WhatsApp da empresa:
- Nome do cliente
- Telefone
- Dimensões da parede (largura x altura)

## 🌐 Endpoints da API

- `GET /api/config` - Configurações do site
- `GET /api/slides` - Imagens do carrossel
- `GET /` - Serve o aplicativo React

## 📄 Licença

© 2025 Cortinas Brás - Todos os direitos reservados.

## 👨‍💻 Desenvolvimento

Desenvolvido com ❤️ usando Flask + React
