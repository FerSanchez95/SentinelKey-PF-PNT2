# 🛡️ SentinelKey

---

**Proyecto final de la materia Prácticas de Nuevas Tecnologías 2**  
**Comisión 2-1-C | Año 2025**  
**Instituto Tecnológico ORT**

---

## 📑 Índice

- [👥 Integrantes](#-integrantes)
- [📄 Desarrollo](#-desarrollo)
  - [💡 Desarrollo](#integrantes)
  - [🔗 Enlaces útiles](#enlaces-útiles)
- [📋 Reglas de negocio](#-reglas-de-negocio)
- [⚙️ Cómo utilizar el proyecto](#️-cómo-utilizar-el-proyecto)
  - [🔐 Plantilla de archivos `.env`](#-plantilla-de-archivos-env)
  - [🌿 Ramas del proyecto](#-ramas-del-proyecto)
  - [🚀 Correr la aplicación](#-correr-la-aplicación)

---

## 👥 Integrantes

- Juan Mateo Alonso De Armio  
- Sebastián Rosenfeld  
- Federico Wainstein  
- Fernando Sánchez

---

## 💡 Desarrollo

### 📄 Introducción

**SentinelKey** es un gestor de contraseñas simple, desarrollado como proyecto final de la materia.  
Su objetivo es brindar una solución accesible, funcional y segura para almacenar claves personales.

Este proyecto fue desarrollado con las siguientes tecnologías:

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/) como bundler
- [Tailwind CSS](https://tailwindcss.com/) para estilos

### 🗂️ Estructura del proyecto

### 🔗 Enlaces útiles
```
my-react-app/
├── public/ # Archivos estáticos
├── src/
│ ├── assets/ # Imágenes, íconos y fuentes
│ ├── auth/ # Servicios de autenticación
│ ├── components/ # Componentes reutilizables
│ ├── features/ # Features pricipales
│ ├── hooks/ # Hooks personalizados
│ ├── routes/ # Definición de rutas 
│ ├── services/ # Conexión a APIs
│ ├── utils/ # Funciones de utilidad
│ ├── App.jsx # Componente raíz
│ ├── App.css # Estilos del componente raíz
│ ├── main.jsx # Punto de entrada
│ └── index.css # Estilos globales 
├── .gitignore
├── eslint.config.js
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) — utiliza [Babel](https://babeljs.io/) para Fast Refresh

---

## 📋 Reglas de negocio

> _(Aquí deberías detallar las reglas lógicas del sistema, como validaciones, restricciones, permisos, etc. Puedo ayudarte a redactarlas si me das el contenido.)_

---

## ⚙️ Cómo utilizar el proyecto

### 🔐 Plantilla de archivos `.env`

```env
# Ejemplo de archivo .env
VITE_API_URL=https://api.sentinelkey.com
VITE_TOKEN_SECRET=clave-super-secretarm 
```

> ⚠️ No subas este archivo al repositorio (está en `.gitignore` por seguridad).

### 🌿 Ramas del proyecto

- `main`: rama estable para producción
- `develop`: rama de desarrollo
- `rama-usuario`: La rama propia de cada contribuidor

### 🚀 Correr la aplicación

1. Cloná el repositorio:

```bash
git clone https://github.com/tu-usuario/sentinelkey.git
cd sentinelkey
```

2. Instalá las dependencias:

```bash
npm install
```

3. Corré el servidor de desarrollo:

```bash
npm run dev
```

---

## 📜 Licencia

Este proyecto se distribuye bajo la licencia MIT.

---
