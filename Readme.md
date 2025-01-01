# 📊 Discord Stats Bot


![Bot Monitor Banner](https://images.piclumen.com/normal/20250101/18/852b9097f2e04b44b03c679dd68b9e9f.webp)

¡Bienvenido a **Discord Stats Bot**! Este bot está diseñado para recopilar estadísticas clave sobre tu servidor de Discord, como el total de cuentas, miembros humanos, bots, roles y emotes. Todo esto se muestra en canales de voz, actualizándose automáticamente en tiempo real. 🎉

---

## 🚀 Características

- **Comando Slash:** 
  - `/stats-server (canal1) (canal2) ...` te permite elegir los canales para las estadísticas.
  - Se asegura de que solo los usuarios con permisos de administrador puedan ejecutarlo.

- **Estadísticas en Tiempo Real:**
  - Cuenta y actualiza el total de cuentas, miembros humanos, bots, roles y emotes del servidor.

- **Base de Datos MySQL2:**
  - Almacena datos de estadísticas usando la ID del servidor.

- **Actualización Automática:**
  - Monitorea constantemente el servidor para reflejar cualquier cambio en las estadísticas.

- **Interfaz Visual Hermosa:**
  - Todos los mensajes de éxito, errores y permisos están diseñados con embeds atractivos.

---

## 📦 Instalación

### 1️⃣ Requisitos Previos

- Node.js v16 o superior.
- Una base de datos MySQL configurada.
- Permisos de administrador en tu servidor de Discord.

### 2️⃣ Clonar el Repositorio

```bash
# Clona este repositorio
git clone https://github.com/Rexyto/discord-stats-bot.git
cd discord-stats-bot
```

### 3️⃣ Instalar Dependencias

```bash
# Instalar las dependencias necesarias
npm install
```

### 4️⃣ Posibles Errores al Instalar Dependencias

- **Error: "node: not found"**
  - Asegúrate de tener Node.js correctamente instalado. Puedes descargarlo desde [Node.js](https://nodejs.org/).

- **Error: "mysql2: not found"**
  - Si el módulo MySQL2 no se instala correctamente, intenta ejecutar:
    ```bash
    npm install mysql2
    ```

- **Error: "Permisos denegados"**
  - Ejecuta el comando con privilegios de administrador:
    ```bash
    sudo npm install
    ```

- **Error: "Version mismatch"**
  - Asegúrate de usar Node.js v16 o superior:
    ```bash
    node -v
    ```

Si encuentras más problemas, consulta la [documentación de Node.js](https://nodejs.org/) o abre un issue en el repositorio.

### 5️⃣ Configurar el Bot

1. Abre el archivo `config.json` y completa la información:

```json
{
  "token": "TU_TOKEN_DEL_BOT",
  "clientId": "ID_DEL_CLIENTE_DEL_BOT",
  "mysql": {
    "host": "localhost",
    "user": "root",
    "password": "tu_password",
    "database": "nombre_de_la_base"
  }
}
```

2. Configura tu base de datos MySQL:

```sql
CREATE DATABASE IF NOT EXISTS nombre_de_la_base;
USE nombre_de_la_base;
CREATE TABLE IF NOT EXISTS stats (
  server_id VARCHAR(255) NOT NULL,
  total_accounts INT DEFAULT 0,
  members INT DEFAULT 0,
  bots INT DEFAULT 0,
  roles INT DEFAULT 0,
  emotes INT DEFAULT 0,
  PRIMARY KEY (server_id)
);
```

### 6️⃣ Registrar Comandos Slash

Ejecuta el siguiente comando para registrar los comandos slash:

```bash
node .
```

---

## 🛠️ Uso

1. **Inicia el Bot:**

```bash
node .
```

2. **Comando Principal:**

Usa `/stats-server (canal1) (canal2) ...` para seleccionar los canales donde se mostrarán las estadísticas.

3. **Permisos:**
   - Solo los usuarios con permiso de administrador pueden usar el comando.
   - Si un usuario sin permisos intenta usar el comando, recibirá un mensaje embed decorado indicando la falta de permisos.

---

## 🌟 Ejemplo de Configuración

Imagina que tienes los siguientes canales de voz:
- **📊 Total Cuentas**
- **👤 Miembros**
- **🤖 Bots**
- **🎭 Roles**
- **😀 Emotes**

Usa el comando:

```bash
/stats-server #total-cuentas #miembros #bots #roles #emotes
```

El bot configurará estos canales automáticamente y comenzará a mostrar las estadísticas en tiempo real.

---

## 📋 Notas Importantes

- Asegúrate de que el bot tiene permisos para administrar los canales de voz seleccionados.
- Si necesitas ayuda adicional, revisa los logs de la consola al iniciar el bot.

---

## 💻 Contribuciones

¡Las contribuciones son bienvenidas! Si encuentras algún error o tienes ideas para nuevas funciones, no dudes en abrir un issue o un pull request.

---

## ❤️ Agradecimientos

Gracias por usar **Discord Stats Bot**. ¡Esperamos que sea útil para tu comunidad! ✨
