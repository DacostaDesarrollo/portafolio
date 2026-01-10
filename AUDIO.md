# 🔊 Sistema de Audio - Portafolio

## Descripción

El sistema de audio utiliza **JavaScript puro** con **Web Audio API** para generar sonidos sintéticos que se reproducen en diferentes interacciones del usuario. Como fallback, usa **HTML5 Audio** para navegadores que no soporten Web Audio API.

## Características

- ✅ **Sonidos sintéticos**: Generados programáticamente, no requieren archivos externos
- ✅ **Web Audio API**: Para mejor control y calidad de audio
- ✅ **Fallback HTML5**: Compatibilidad con navegadores antiguos
- ✅ **Control de volumen**: Ajustable programáticamente
- ✅ **Toggle on/off**: Activar/desactivar con botón o atajo de teclado
- ✅ **Eventos automáticos**: Se reproduce en clicks, hovers, typing, etc.
- ✅ **Responsive**: Funciona en dispositivos móviles

## Sonidos Implementados

### 🎵 Tipos de Sonido

1. **Click** (`800Hz, 0.1s, square`)
   - Se reproduce al hacer click en enlaces, botones, cards
   - Sonido sharp y definido

2. **Hover** (`600Hz, 0.05s, sine`) 
   - Se reproduce al pasar el mouse sobre elementos interactivos
   - Sonido suave y sutil

3. **Typing** (`400-450Hz, 0.08s, square`)
   - Se reproduce al escribir en inputs/textareas
   - Frecuencia aleatoria para variedad

4. **Error** (`200Hz, 0.3s, sawtooth`)
   - Para errores o validaciones fallidas
   - Sonido grave y de atención

5. **Success** (`400-800Hz, 0.3s, sine`)
   - Al enviar formularios exitosamente
   - Sonido ascendente y positivo

## Uso

### Automático
El sistema se activa automáticamente al cargar la página y reproduce sonidos en:
- Clicks en enlaces y botones
- Hover sobre elementos interactivos
- Escribir en formularios
- Envío de formularios

### Manual
```javascript
// Reproducir sonidos específicos
audioManager.play('click');
audioManager.play('hover');
audioManager.play('typing');
audioManager.play('error');
audioManager.play('success');

// Control de audio
audioManager.toggle(); // Activar/desactivar
audioManager.setVolume(0.5); // Volumen 0-1

// Sonido personalizado
audioManager.playCustom(440, 0.2, 'sine'); // La musical por 0.2s
```

### Controles de Usuario

#### Botón en Header
- 🔊 = Audio activado
- 🔇 = Audio desactivado
- Click para toggle

#### Atajo de Teclado
- `Ctrl + M` = Toggle audio on/off

## Configuración

### Volumen por Defecto
```javascript
this.volume = 0.3; // 30% del volumen máximo
```

### Elementos con Audio
```javascript
// Clicks
const clickableElements = [
    'a', 'button', '.project-card', '#logo', 
    'input', 'textarea', '.terminal-command'
];

// Hovers
const hoverElements = ['a', 'button', '.project-card'];
```

## Compatibilidad

### Navegadores Soportados
- ✅ Chrome 66+
- ✅ Firefox 60+
- ✅ Safari 14+
- ✅ Edge 79+

### Fallbacks
- **Web Audio API no disponible**: Usa HTML5 Audio
- **Audio bloqueado**: Se activa en primera interacción del usuario
- **Sin soporte de audio**: Funciona silenciosamente sin errores

## Performance

### Optimizaciones
- **Preload**: Sonidos preparados al cargar la página
- **Contexto compartido**: Un solo AudioContext para todos los sonidos
- **Cleanup**: Oscillators se eliminan automáticamente
- **Throttling**: Evita reproducir demasiados sonidos simultáneos

### Recursos
- **Memoria**: ~50KB de JavaScript adicional
- **CPU**: Mínimo impacto (síntesis en tiempo real)
- **Red**: 0 bytes (sonidos sintéticos)

## Personalización

### Cambiar Frecuencias
```javascript
// En createSyntheticSounds()
this.sounds.click = this.createBeepSound(1000, 0.1, 'square'); // Más agudo
this.sounds.hover = this.createBeepSound(400, 0.05, 'sine');   // Más grave
```

### Agregar Nuevos Elementos
```javascript
// En setupAudioEvents()
document.addEventListener('click', (e) => {
    if (e.target.matches('.mi-nuevo-elemento')) {
        this.play('click');
    }
});
```

### Crear Sonidos Complejos
```javascript
// Sonido con múltiples tonos
createComplexSound() {
    return () => {
        this.playCustom(440, 0.1); // La
        setTimeout(() => this.playCustom(554, 0.1), 100); // Do#
        setTimeout(() => this.playCustom(659, 0.1), 200); // Mi
    };
}
```

## Debugging

### Console Commands
```javascript
// Verificar estado
console.log(audioManager.isEnabled);
console.log(audioManager.volume);

// Test de sonidos
audioManager.play('click');
audioManager.play('success');

// AudioContext info
console.log(audioManager.audioContext.state);
```

### Logs Automáticos
El sistema muestra en consola:
- ✅ Inicialización exitosa
- ⚠️ Errores y fallbacks
- 🔊 Cambios de estado (on/off)
- 📊 Cambios de volumen

## Consideraciones UX

### Buenas Prácticas
- **Volumen moderado**: No molestar al usuario
- **Toggle visible**: Permitir desactivar fácilmente
- **Feedback visual**: Notificaciones de estado
- **Contexto apropiado**: Solo sonidos relevantes

### Accesibilidad
- **Respeta preferencias del sistema**: Podría integrarse con `prefers-reduced-motion`
- **Control granular**: Usuario puede desactivar completamente
- **No interfiere**: Funciona con lectores de pantalla

## Integración con GSAP

El sistema de audio se integra perfectamente con las animaciones GSAP:

```javascript
// Sonido + animación
gsap.to(element, {
    scale: 1.1,
    duration: 0.3,
    onStart: () => audioManager.play('hover')
});
```

## Futuras Mejoras

- 🔄 **Temas de sonido**: Diferentes sets de frecuencias
- 🎚️ **EQ simple**: Bass/treble controls
- 🎵 **Melodías**: Secuencias de notas para acciones complejas
- 💾 **Persistencia**: Recordar preferencias del usuario
- 📱 **Vibración**: Feedback táctil en móviles

---

**Tip**: Usa `Ctrl+M` para activar/desactivar el audio mientras navegas por el portafolio. ¡Disfruta de la experiencia auditiva! 🎵
