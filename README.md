#  Solitario 2048

Juego web donde el jugador debe colocar cartas numeradas en columnas, fusionándolas para alcanzar el valor 2048 y evitar que las columnas se llenen.

---

##  Demo

🔗 [Ver juego en vivo](https://nath-ucab.github.io/juego-solitario/)

---

##  Mecánica del Juego

A diferencia del 2048 clásico, aquí el jugador recibe una carta a la vez (como en un mazo) y debe elegir en cuál de las 4 columnas disponibles colocarla.

- Si la carta cae sobre otra del mismo valor, se fusionan (2+2=4)
- Si la nueva carta resultante tiene el mismo valor que la que está debajo, ocurre una reacción en cadena (fusión múltiple)
- El objetivo es sumar puntos y limpiar columnas antes de que estas lleguen al límite inferior

###  Reglas

| Regla | Descripción |
|-------|-------------|
| **Fusión** | Dos cartas del mismo valor se combinan en una con el doble de valor |
| **Fusión en cadena** | Si al fusionarse se crea un número igual al que hay debajo, se siguen fusionando automáticamente |
| **Derrota** | Si una columna excede 8 cartas y no puede fusionarse más, el juego termina |
| **Victoria** | Si se alcanza el 2048 en una columna, esa columna completa se "limpia" (desaparece) |

---

## 📋 Características

###  Interfaz de Usuario
- 4 columnas verticales claramente definidas
- Carta actual visible (siguiente carta a colocar)
- Cartas con imágenes personalizadas (carta1.png a carta12.png)
- Colores dinámicos según el valor de la carta
- Marcador de puntos acumulados
- Botón de reinicio

### Lógica de Programación
- Generación de cartas aleatorias (2, 4, 8, 16, 32)
- Interacción mediante clic en columnas
- Sistema de fusión recursiva
- Animación de caída de cartas
- Condición de derrota al llenar columnas (8 cartas)
- Limpieza automática al alcanzar 2048

---

## Tecnologías

- **HTML5** - Estructura semántica
- **CSS3** - Estilos y animaciones (variables CSS, flexbox, grid)
- **JavaScript (Vanilla)** - Lógica del juego
- **GitHub Pages** - Despliegue en servidor web

---

##  Instalación y uso local

### 1. Clonar el repositorio
```bash
git clone https://github.com/nath-ucab/juego-solitario.git
cd juego-solitario