# 🚀 Portafolio de Daniel Acosta

Un portafolio personal moderno con estilo terminal/developer, construido con **TailwindCSS** y **GSAP** para animaciones fluidas y efectos de scroll avanzados.

## ✨ Características

- 🎨 **Diseño Terminal/Developer**: Estética inspirada en terminales de comandos
- 🌊 **Animaciones GSAP**: Transiciones fluidas y efectos de scroll avanzados
- 📱 **Responsive Design**: Optimizado para todos los dispositivos
- ⚡ **Performance**: Carga rápida y animaciones optimizadas
- 🎭 **Efectos Especiales**: Matrix background, glitch effects, typing animations
- 🛠️ **Tecnologías Modernas**: TailwindCSS + GSAP + Vanilla JS

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **TailwindCSS**: Framework CSS utilitario
- **GSAP**: Librería de animaciones JavaScript
- **ScrollTrigger**: Plugin de GSAP para animaciones basadas en scroll
- **JavaScript ES6+**: Funcionalidades interactivas

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js (para gestión de dependencias)
- Python 3 (para servidor local de desarrollo)

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/danielacosta/portafolio.git
   cd portafolio
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```
   
   El sitio estará disponible en `http://localhost:3000`

### Scripts Disponibles

- `npm run dev` - Servidor de desarrollo en puerto 3000
- `npm run start` - Servidor de producción en puerto 8080
- `npm run build` - Preparar para deployment

## 📁 Estructura del Proyecto

```
portafolio/
├── index.html          # Página principal
├── package.json        # Configuración y dependencias
├── css/
│   └── style.css      # Estilos personalizados
├── js/
│   └── main.js        # Lógica JavaScript y animaciones GSAP
└── README.md          # Documentación
```

## 🎯 Secciones

### 🏠 Home (Hero)
- Presentación personal con estilo terminal
- Animaciones de aparición secuencial
- Imagen de perfil con efectos 3D
- Enlaces a redes sociales

### 👨‍💻 Acerca de Mí
- Información personal y profesional
- Skills en formato JSON
- Animaciones de scroll

### 💼 Proyectos
- Galería de proyectos con hover effects
- Cards con animaciones staggered
- Enlaces a demos y código fuente

### 📬 Contacto
- Formulario de contacto interactivo
- Información de contacto
- Animaciones de focus en inputs

## 🎨 Animaciones Implementadas

### Hero Section
- **Fade in escalonado**: Aparición secuencial de elementos
- **Rotación 3D**: Efectos de rotación en nombre y perfil
- **Parallax**: Movimiento diferencial en scroll

### Scroll Animations
- **ScrollTrigger**: Animaciones activadas por scroll
- **Parallax Background**: Efecto de profundidad
- **Stagger Effects**: Animaciones escalonadas en grupos

### Efectos Especiales
- **Matrix Rain**: Efecto de lluvia de caracteres
- **Glitch Effect**: Efecto de interferencia en el nombre
- **Typing Animation**: Efecto de escritura de máquina
- **Hover Effects**: Respuestas interactivas

### Transiciones
- **Page Navigation**: Navegación suave entre secciones
- **Micro-interactions**: Feedback visual en interacciones
- **Loading States**: Estados de carga animados

## 🎛️ Personalización

### Colores
Los colores principales se definen en la configuración de Tailwind:

```javascript
colors: {
    'terminal-green': '#00ff41',
    'terminal-bg': '#0d1117',
    'terminal-gray': '#21262d'
}
```

### Fuentes
Se utiliza **JetBrains Mono** como fuente principal para el estilo developer.

### Animaciones
Las animaciones GSAP se pueden personalizar en `js/main.js`:

- **Duración**: Ajustar `duration` en las animaciones
- **Easing**: Cambiar funciones de easing (power2.out, back.out, etc.)
- **Delays**: Modificar tiempos de delay entre animaciones

## 📱 Responsive Design

El portafolio está optimizado para:
- 📱 **Mobile**: 320px - 768px
- 📱 **Tablet**: 768px - 1024px
- 💻 **Desktop**: 1024px+

## 🔧 Optimizaciones

- **Lazy Loading**: Carga diferida de elementos
- **Debounced Scroll**: Optimización de eventos de scroll
- **Efficient Animations**: Uso de transforms y opacity para mejor performance
- **Minimal DOM Queries**: Cacheo de selectores DOM

## 🚀 Deployment

### Netlify
1. Conectar repositorio de GitHub
2. Deploy automático desde main branch

### Vercel
1. Importar proyecto desde GitHub
2. Deploy automático

### GitHub Pages
1. Habilitar GitHub Pages en configuración del repositorio
2. Seleccionar branch main como fuente

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crear una feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

**Daniel Acosta** - Full Stack Developer

- 🌐 Website: [danielacosta.dev](https://danielacosta.dev)
- 📧 Email: daniel@example.com
- 💼 LinkedIn: [/in/daniel-acosta](https://linkedin.com/in/daniel-acosta)
- 🐙 GitHub: [danielacosta](https://github.com/danielacosta)

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!

```bash
$ git clone https://github.com/danielacosta/portafolio.git
$ cd portafolio
$ npm run dev
# ¡Disfruta explorando el código! 🚀
```
