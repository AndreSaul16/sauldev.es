# 🚀 SaulDev.es - Portfolio Profesional

<div align="center">

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-0.181.2-000000?style=for-the-badge&logo=three.js&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3.13.0-88CE02?style=for-the-badge&logo=greensock&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.23.24-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**Portfolio interactivo 3D con animaciones avanzadas y diseño moderno**

[🌐 Ver Demo](https://sauldev.es) • [📧 Contacto](mailto:andresaul16s@gmail.com) • [💼 LinkedIn](https://www.linkedin.com/in/sbriceño/)

</div>

---

## 📋 Tabla de Contenidos

- [Sobre el Proyecto](#-sobre-el-proyecto)
- [Características Principales](#-características-principales)
- [Stack Tecnológico](#-stack-tecnológico)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Componentes Clave](#-componentes-clave)
- [Arquitectura](#-arquitectura)
- [Despliegue](#-despliegue)
- [Contacto](#-contacto)
- [Licencia](#-licencia)

---

## 🎯 Sobre el Proyecto

**SaulDev.es** es mi portfolio profesional como Desarrollador de Software especializado en **Inteligencia Artificial** y **Cloud Computing**. Este proyecto representa un remake completo de mi presencia digital, combinando tecnologías web modernas con experiencias visuales inmersivas.

### ¿Por qué este proyecto?

- 🎨 **Diseño Premium**: Interfaz moderna con glassmorphism, gradientes dinámicos y animaciones fluidas
- 🌌 **Experiencia 3D**: Escena interactiva con Three.js que responde al scroll y movimiento del ratón
- ⚡ **Rendimiento Optimizado**: Carga rápida y animaciones suaves a 60 FPS
- 📱 **Totalmente Responsive**: Diseño adaptativo para todos los dispositivos
- ♿ **Accesible**: Cumple con estándares WCAG para accesibilidad web

---

## ✨ Características Principales

### 🎭 Interactividad Avanzada

- **Cursor Personalizado**: Cursor animado que reacciona a elementos interactivos
- **Scroll Animations**: Animaciones sincronizadas con el scroll usando GSAP y Framer Motion
- **Escena 3D Dinámica**: Fondo 3D con partículas y geometrías que responden al movimiento del usuario
- **Hover Effects**: Efectos visuales premium en todos los elementos interactivos
- **🤖 Chatbot con IA**: Asistente virtual interactivo con OpenAI que responde preguntas sobre Saúl, sus proyectos y habilidades

### 📊 Secciones del Portfolio

1. **Hero**: Presentación impactante con animación de texto y llamada a la acción
2. **About**: Información personal con efecto de seguimiento del ratón
3. **Skills**: Marquesina infinita con iconos de tecnologías (Devicon)
4. **Certifications**: Galería de certificaciones profesionales con enlaces a Credly
5. **Experience**: Línea de tiempo de experiencia laboral
6. **Projects**: Tarjetas interactivas de proyectos destacados
7. **Featured Projects**: Sección especial para proyectos principales (H.E.L.E.N, H.O.M.E, InnolandGame, etc.)
8. **Blog**: Sistema completo de blog con Markdown, editor para usuarios autenticados y lista pública de posts
9. **Newsletter**: Suscripción a newsletter integrado con el blog
10. **Contact**: Formulario de contacto con validación
11. **Autenticación**: Sistema de login sin contraseña usando WebAuthn (biometría) con persistencia segura de challenges en Firestore.

### 🎨 Diseño Visual

- **Glassmorphism**: Efectos de vidrio esmerilado en tarjetas y componentes
- **Gradientes Dinámicos**: Paleta de colores vibrante con transiciones suaves
- **Animaciones Staggered**: Elementos que aparecen secuencialmente
- **Responsive Grid**: Layouts adaptativos con Tailwind CSS

---

## 🛠️ Stack Tecnológico

### Frontend Core

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.2.0 | Framework principal para UI |
| **Vite** | 7.2.2 | Build tool y dev server |
| **TailwindCSS** | 3.4.17 | Framework CSS utility-first |

### Animaciones y 3D

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Three.js** | 0.181.2 | Renderizado 3D WebGL |
| **@react-three/fiber** | 9.4.0 | React renderer para Three.js |
| **@react-three/drei** | 10.7.7 | Helpers y abstracciones para R3F |
| **GSAP** | 3.13.0 | Animaciones de alto rendimiento |
| **Framer Motion** | 12.23.24 | Animaciones declarativas para React |

### Utilidades

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Lucide React** | 0.554.0 | Iconos SVG optimizados |
| **React Icons** | 5.5.0 | Biblioteca de iconos adicionales |
| **Leva** | 0.10.1 | GUI de debugging para Three.js |

### Backend / API

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Firebase/Firestore** | 12.6.0 | Base de datos NoSQL en tiempo real |
| **Firebase Admin** | 13.6.0 | SDK del lado del servidor para Firebase |
| **OpenAI** | 4.104.0 | API de Inteligencia Artificial para chatbot |
| **SimpleWebAuthn** | 13.2.2 | Autenticación sin contraseña (WebAuthn) |
| **Firestore** | - | Persistencia de desafíos (Challenges) y usuarios |
| **Netlify Functions** | - | Serverless functions para backend |

### Herramientas de Desarrollo

- **ESLint**: Linting de código JavaScript/React
- **PostCSS**: Procesamiento de CSS
- **Autoprefixer**: Prefijos CSS automáticos para compatibilidad

---

## 📦 Instalación

### Prerrequisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 o **yarn** >= 1.22.0

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/AndreSaul16/sauldev.es.git

# 2. Navegar al directorio
cd sauldev.es

# 3. Instalar dependencias
npm install
# o
yarn install

# 4. Configurar variables de entorno (OPCIONAL - Solo si usas el chatbot)
# Copiar .env.example a .env y añadir tus credenciales de OpenAI
cp .env.example .env
# Editar .env con tus valores:
# OPENAI_KEY_API=tu_api_key
# OPENAI_ASSISTANT_ID=tu_assistant_id

# 5. Iniciar servidor de desarrollo
npm run dev
# o
yarn dev
```

El proyecto estará disponible en `http://localhost:5173`

> **Nota sobre el Chatbot**: El chatbot con IA requiere credenciales de OpenAI. Si no las configuras, el resto del portfolio funcionará normalmente, pero el chatbot no estará operativo.

---

## 🚀 Uso

### Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo con HMR

# Producción
npm run build        # Genera build optimizado en /dist
npm run preview      # Preview del build de producción

# Calidad de Código
npm run lint         # Ejecuta ESLint para verificar código
```

### Personalización

#### Modificar Datos Personales

Edita el archivo `src/data.js` para actualizar:

- Información de perfil (`profile`)
- Habilidades (`skills`)
- Certificaciones (`certifications`)
- Logros (`achievements`)
- Experiencia laboral (`experience`)
- Educación (`education`)
- Proyectos (`projects`)

```javascript
// Ejemplo: src/data.js
export const profile = {
    name: "Tu Nombre",
    role: "Tu Rol",
    description: "Tu descripción...",
    // ...
};
```

#### Personalizar Colores

Modifica `tailwind.config.js` para cambiar la paleta de colores:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'deep-space': '#0a0e27',
        'neon-cyan': '#00f0ff',
        // Añade tus colores personalizados
      }
    }
  }
}
```

#### Ajustar Animaciones

Las animaciones se configuran en cada componente usando GSAP y Framer Motion. Consulta `architecture.md` para más detalles.

---

## 📁 Estructura del Proyecto

```
sauldev.es/
├── public/                    # Archivos estáticos
│   └── Badges/               # Imágenes de certificaciones
├── src/
│   ├── assets/               # Recursos (imágenes, fuentes, etc.)
│   ├── components/
│   │   ├── Auth/             # Sistema de autenticación
│   │   │   ├── AuthButton.jsx    # Botón de autenticación
│   │   │   └── Login.jsx         # Modal de login con WebAuthn
│   │   ├── Blog/             # Sistema de blog
│   │   │   ├── BlogEditor.jsx    # Editor Markdown para posts
│   │   │   ├── BlogList.jsx      # Lista de posts publicados
│   │   │   ├── BlogPost.jsx      # Vista individual de post
│   │   │   └── Newsletter.jsx    # Suscripción a newsletter
│   │   ├── Canvas/           # Componentes 3D
│   │   │   └── Scene.jsx         # Escena principal Three.js
│   │   └── UI/               # Componentes de interfaz
│   │       ├── About.jsx
│   │       ├── Chatbot.jsx       # Chatbot con OpenAI
│   │       ├── Contact.jsx
│   │       ├── CustomCursor.jsx
│   │       ├── Experience.jsx
│   │       ├── FeaturedProjects.jsx
│   │       ├── Hero.jsx
│   │       ├── Navbar.jsx
│   │       ├── Projects.jsx
│   │       └── Skills.jsx
│   ├── contexts/             # React Context API
│   ├── data/                 # Datos separados por dominio
│   ├── hooks/                # Custom React Hooks
│   ├── utils/                # Funciones de utilidad
│   ├── App.jsx               # Componente raíz
│   ├── App.css               # Estilos del componente App
│   ├── data.js               # Datos principales del portfolio
│   ├── index.css             # Estilos globales
│   └── main.jsx              # Punto de entrada
├── netlify/
│   └── functions/            # Serverless functions
│       ├── blog-upload.js    # API para subir posts al blog
│       ├── chat.js           # API del chatbot con OpenAI
│       ├── get-posts.js      # API para obtener posts del blog
│       ├── newsletter-subscribe.js  # API para suscripción a newsletter
│       ├── save-contact.js   # API para guardar mensajes de contacto
│       ├── webauthn-login.js # API para login con WebAuthn
│       ├── webauthn-register.js  # API para registro con WebAuthn
│       └── utils/
│           └── firebase.js   # Utilidades para Firebase
├── .env.example              # Ejemplo de variables de entorno
├── .gitignore
├── ejemplo-post.md           # Ejemplo de post para el blog
├── eslint.config.js          # Configuración ESLint
├── index.html                # HTML principal
├── netlify.toml              # Configuración de Netlify
├── package.json              # Dependencias y scripts
├── postcss.config.js         # Configuración PostCSS
├── tailwind.config.js        # Configuración Tailwind
├── vite.config.js            # Configuración Vite
├── README.md                 # Este archivo
└── architecture.md           # Documentación de arquitectura detallada
```

---

## 🧩 Componentes Clave

### `Scene.jsx` - Escena 3D

Renderiza el fondo 3D interactivo con partículas y geometrías animadas usando Three.js.

**Características:**
- Sistema de partículas dinámico
- Iluminación ambiental y direccional
- Respuesta al scroll y movimiento del ratón

### `CustomCursor.jsx` - Cursor Personalizado

Cursor animado que cambia de tamaño y color al interactuar con elementos.

**Características:**
- Seguimiento suave del ratón
- Estados hover para elementos interactivos
- Animaciones con Framer Motion

### `FeaturedProjects.jsx` - Proyectos Destacados

Sección especial para mostrar proyectos principales con diseño premium.

**Características:**
- Tarjetas con efecto glassmorphism
- Iconos contextuales por categoría
- Badges de tecnologías
- Animaciones staggered al scroll

### `Skills.jsx` - Habilidades

Marquesina infinita con iconos de tecnologías usando Devicon.

**Características:**
- Animación de scroll infinito
- Iconos SVG optimizados
- Responsive y accesible

### `Chatbot.jsx` - Asistente Virtual con IA

Chatbot interactivo flotante que usa OpenAI Assistant API.

**Características:**
- Botón flotante en esquina inferior derecha
- Ventana de chat con diseño glassmorphism
- Conversaciones persistentes por sesión
- Manejo de estados de carga
- Límite de 500 caracteres por mensaje
- Animaciones suaves con Framer Motion

---

## 🏗️ Arquitectura

Este proyecto sigue una arquitectura **Component-Based** con separación clara de responsabilidades:

- **Presentación (UI)**: Componentes React puros enfocados en la vista
- **Lógica 3D (Canvas)**: Componentes Three.js aislados del resto de la UI
- **Datos (data.js)**: Single source of truth para contenido del portfolio
- **Estilos**: Utility-first con Tailwind + CSS personalizado para animaciones

Para una explicación detallada de la arquitectura, patrones de diseño y buenas prácticas, consulta **[architecture.md](./architecture.md)**.

---

## 🌐 Despliegue

### Netlify (Recomendado)

```bash
# 1. Build del proyecto
npm run build

# 2. Desplegar carpeta dist/
# Netlify detectará automáticamente Vite
```

**Configuración Netlify:**
- Build command: `npm run build`
- Publish directory: `dist`

### Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel
```

### GitHub Pages

```bash
# 1. Instalar gh-pages
npm install --save-dev gh-pages

# 2. Añadir scripts a package.json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# 3. Configurar base en vite.config.js
export default {
  base: '/sauldev.es/'
}

# 4. Desplegar
npm run deploy
```

---

## 📧 Contacto

**Saúl Briceño**

- 🌐 Website: [sauldev.es](https://sauldev.es)
- 💼 LinkedIn: [linkedin.com/in/sbriceño](https://www.linkedin.com/in/sbriceño/)
- 🐙 GitHub: [github.com/AndreSaul16](https://github.com/AndreSaul16)

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

```
MIT License

Copyright (c) 2025 Saúl Briceño

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**⭐ Si te gusta este proyecto, dale una estrella en GitHub ⭐**

Hecho con ❤️ por [Saúl Briceño](https://sauldev.es)

</div>
