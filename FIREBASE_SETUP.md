# 🔥 Guía de Configuración de Firebase para Contactos

Esta guía te ayudará a configurar Firebase para el sistema de captación de contactos del chatbot.

## 📋 Pasos de Configuración

### 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Click en "Añadir proyecto" o "Add project"
3. Nombre del proyecto: `sauldev-portfolio` (o el que prefieras)
4. (Opcional) Habilitar Google Analytics
5. Click en "Crear proyecto"

###2. Crear Base de Datos Firestore

1. En el menú lateral, click en "Firestore Database"
2. Click en "Crear base de datos"
3. Selecciona **"Modo de producción"** (production mode)
4. Selecciona la ubicación más cercana (ej: `europe-west1` para España)
5. Click en "Habilitar"

### 3. Configurar Reglas de Seguridad

En la pestaña "Reglas" de Firestore, pega estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir solo escritura en la colección contacts
    match /contacts/{contactId} {
      // Permitir solo creación (no lectura, actualización o eliminación)
      allow create: if request.auth == null;
      allow read, update, delete: if false;
    }
  }
}
```

### 4. Obtener Credenciales de Service Account

1. En Firebase Console, click en el ⚙️ (Settings) → "Configuración del proyecto"
2. Ve a la pestaña "Cuentas de servicio"
3. Click en "Generar nueva clave privada"
4. Se descargará un archivo JSON con tus credenciales

### 5. Configurar Variables de Entorno en Netlify

1. Ve a tu proyecto en [Netlify](https://app.netlify.com/)
2. Ve a "Site settings" → "Environment variables"
3. Añade estas 3 variables del archivo JSON descargado:

**FIREBASE_PROJECT_ID**  
→ Valor de `project_id` del JSON

**FIREBASE_CLIENT_EMAIL**  
→ Valor de `client_email` del JSON

**FIREBASE_PRIVATE_KEY**  
→ Valor de `private_key` del JSON (incluye BEGIN y END)

---

## 📊 Estructura de Datos Optimizada

### Colección: `contacts`

Los documentos usan el **nombre normalizado como ID** para evitar duplicados.

**ID del Documento:**
- Se genera normalizando el nombre
- Ejemplo: "José María" → `jose-maria`

**Estructura:**
```javascript
contacts/{nombre-normalizado} = {
  name: "Nombre Original",
  email: "email@ejemplo.com" o null,
  phone: "+34 123 456 789" o null,
  messages: [
    {
      content: "Mensaje 1",
      timestamp: Timestamp,
      ip: "192.168.1.1",
      userAgent: "Mozilla/5.0..."
    }
  ],
  createdAt: Timestamp,
  lastContactAt: Timestamp
}
```

**Ventajas:**
- ✅ Sin duplicados (una persona = un documento)
- ✅ Historial completo de mensajes
- ✅ Email/teléfono se actualiza automáticamente
- ✅ Fácil de query

---

## 🔍 Ver Contactos Guardados

### Firebase Console

1. Ve a Firebase Console → Firestore Database
2. Click en colección `contacts`
3. Verás cada contacto con su ID normalizado
4. Click en un documento para ver su historial de mensajes

**Ejemplo de lo que verás:**
```
contacts/
  ├── jose-garcia/
  │   ├── name: "José García"
  │   ├── email: "jose@email.com"
  │   ├── messages: Array(2)
  │   └── createdAt: timestamp
  │
  ├── maria-lopez/
  │   ├── name: "María López"
  │   └── messages: Array(1)
```

---

## 🔒 Seguridad

✅ **ID basado en nombre**: Previene duplicados  
✅ **Rate limiting**: 3 envíos/hora por IP  
✅ **Validación**: Email y teléfono validados  
✅ **Sanitización**: Anti-XSS  
✅ **Backend only**: Solo servidor puede escribir  

---

## 🚨 Troubleshooting

**Error: "Missing Firebase environment variables"**
→ Verifica las 3 variables en Netlify

**Los contactos se duplican**
→ Ya no se duplican con esta estructura. Mismo nombre = mismo documento

**¿Cuántos mensajes puede tener un contacto?**
→ Firebase soporta hasta 1MB por documento (aprox. 1000 mensajes)

---

## 📈 Extras

### Ver Estadísticas

Consulta en Firestore Console:
- Número total de contactos únicos
- Mensajes por persona (ver array length)
- Fecha de primer/último contacto

### Exportar Datos

Firebase Console → Exportar → CSV/JSON

---

**¡Listo para capturar leads!** 🚀
