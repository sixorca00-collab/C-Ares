# C-Ares
Proyecto de juego de video con tematica propuesto en la semana 2-3 de JS : https://sixorca00-collab.github.io/C-Ares/

# ⚔️ C-Ares – Juego de Combate por Turnos

C-Ares es un **videojuego web desarrollado en JavaScript** que simula un sistema de combate por turnos entre uno o dos jugadores. El proyecto implementa lógica de probabilidad, cálculo de daño y manipulación del DOM, siguiendo buenas prácticas del **desarrollo frontend** y del **ciclo de vida del desarrollo de software (SDLC)**.

🌐 **Aplicación desplegada (GitHub Pages):**  
https://sixorca00-collab.github.io/C-Ares/

---

## 📌 Tabla de Contenido

- [Descripción](#-descripción)
- [Objetivo del Proyecto](#-objetivo-del-proyecto)
- [Alcance](#-alcance)
- [Funcionalidades](#-funcionalidades)
- [Reglas del Combate](#-reglas-del-combate)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Uso Local](#-instalación-y-uso-local)
- [Pruebas y Validación](#-pruebas-y-validación)
- [Ciclo de Vida del Software](#-ciclo-de-vida-del-software)
- [Equipo de Desarrollo](#-equipo-de-desarrollo)
- [Estado del Proyecto](#-estado-del-proyecto)
- [Mejoras Futuras](#-mejoras-futuras)
- [Licencia](#-licencia)

---

## 📖 Descripción

C-Ares es un proyecto educativo enfocado en reforzar conceptos fundamentales de **JavaScript**, como:
- Uso de funciones
- Manejo de objetos
- Generación de valores aleatorios
- Control de flujo
- Actualización dinámica de la interfaz (DOM)

El juego presenta un sistema de combate donde cada ataque puede resultar en un **fallo**, **ataque normal** o **golpe crítico**, afectando directamente la vida del oponente.

---

## 🎯 Objetivo del Proyecto

- Aplicar lógica de programación en un entorno real
- Simular un sistema de combate por turnos
- Practicar manipulación del DOM
- Implementar probabilidad y reglas de negocio
- Documentar el ciclo de vida del desarrollo de software
- Trabajar de forma colaborativa usando GitHub

---

## 📦 Alcance

El proyecto cubre:
- Desarrollo **frontend**
- Lógica de juego en JavaScript
- Diseño visual básico
- Pruebas funcionales manuales
- Despliegue en GitHub Pages

No incluye backend ni persistencia de datos.

---

## 🕹️ Funcionalidades

- ✔️ Modo de juego individual
- ✔️ Modo de juego para dos jugadores
- ✔️ Sistema de combate por turnos
- ✔️ Cálculo de daño dinámico
- ✔️ Probabilidad de fallo y golpe crítico
- ✔️ Actualización visual de la vida del jugador
- ✔️ Interfaz simple e intuitiva

---

## ⚔️ Reglas del Combate

Cada ataque se rige por las siguientes probabilidades:

- ❌ **Fallo:** 15%  
- ⚡ **Golpe crítico:** 20% (daño multiplicado)  
- 🗡️ **Ataque normal:** 65%

El daño se descuenta directamente de la vida del enemigo y se refleja en pantalla en tiempo real.

---

## 🛠️ Tecnologías Utilizadas

- **HTML5** – Estructura del proyecto
- **CSS3** – Diseño y estilos
- **JavaScript (ES6)** – Lógica del juego
- **Git** – Control de versiones
- **GitHub** – Repositorio colaborativo
- **GitHub Pages** – Despliegue del proyecto

---

## 📂 Estructura del Proyecto

```text
C-Ares/
│
├── index.html            # Página de inicio
├── Combat.html           # Vista principal de combate
├── 2players.html         # Modo dos jugadores
├── sdlc.html             # Documentación del SDLC
│
├── Game.js               # Lógica general del juego
├── Battle.js             # Sistema de combate
│
├── styles.css            # Estilos generales
├── stylesStart.css       # Estilos de inicio
├── 2styles.css           # Estilos modo 2 jugadores
│
└── README.md             # Documentación del proyecto
