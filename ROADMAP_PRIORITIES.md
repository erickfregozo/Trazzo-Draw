# Prioridades del Engine - DrawApp

## 📋 Visión General

Este documento detalla las prioridades de desarrollo para el engine de DrawApp, basado en un análisis exhaustivo del estado actual de los sistemas. Las prioridades están organizadas por impacto crítico en la funcionalidad y experiencia del usuario.

---

## 🎯 Estado Actual del Engine

### ✅ Sistemas Completamente Funcionales (80-100%)

#### **InputManager** - 100% implementado
- **Funcionalidad**: Manejo completo de eventos pointer (down, up, move, leave)
- **Soporte**: Mouse, pen y touch con detección de presión
- **Teclado**: Sistema de inputs de teclado funcional
- **Coordenadas**: Relativas al canvas correctamente calculadas

**Impacto**: Base sólida para cualquier herramienta de dibujo.

---

### ⚠️ Sistemas Parcialmente Implementados (40-70%)

#### **Engine Core** - 70% funcional
```typescript
// ✅ Funciona correctamente
- Loop principal con requestAnimationFrame
- Sistema de update/render cycle 
- Integración con LoopSystem interface
- Inicialización de canvas y contexto 2D

// ❌ Falta implementar
- Sistema de pausa
- Manejo de errores robusto
- Profiling y optimización
```

#### **ToolSystem** - 60% funcional
```typescript
// ✅ Funciona correctamente
- Dibujo básico de líneas con presión
- Smooth drawing con lastX/lastY
- Soporte para stylus pressure

// ❌ PROBLEMA CRÍTICO: Dibuja directamente al canvas principal
draw(state: EngineState, input: InputManager) {
    // Líneas 27-35: Dibuja directo a state.context2d
    state.context2d.lineWidth = pressure * 10;
    state.context2d.strokeStyle = "#f00";
    // ... dibuja directamente en canvas base
}
```

**🚨 PROBLEMA**: El ToolSystem dibuja en el canvas principal, no en layers. Esto significa:
- No hay persistencia del dibujo
- Cada frame pierde el trabajo anterior
- Imposible implementar undo/redo
- No se pueden usar múltiples layers

---

### ❌ Sistemas Críticos No Implementados (0-10%)

#### **RenderSystem** - 5% funcional
```typescript
// ✅ Estructura básica implementada
// ❌ Falta completamente:
- Composición de layers
- Efectos post-procesamiento  
- Optimización de render
```

#### **LayerManager** - 5% funcional
```typescript
// ✅ Estructura básica con array
// ❌ Falta completamente:
- CRUD operations (add, remove, get)
- Reordering de layers
- Integración con RenderSystem
```

#### **LayerSystem** - 0% funcional
```typescript
// ❌ Completamente vacío - Sistema crítico sin implementar
```

---

## 🔥 Prioridades Críticas (P0) - Bloqueadores de MVP

### **P0.1: LayerManager con Operaciones CRUD**
**Prioridad**: 🔥 **CRÍTICO** | **Tiempo**: 2-3 días | **Complejidad**: Baja

**¿Por qué es crítico?**
Sin LayerManager funcional:
- ❌ No hay persistencia del dibujo
- ❌ ToolSystem no tiene dónde dibujar
- ❌ RenderSystem no tiene qué componer
- ❌ Toda la arquitectura de layers se rompe

**Implementación requerida**:
```typescript
class LayerManager {
    private layers: Layer[] = [];
    private activeLayerId: string = '';
    
    // Operaciones CRUD esenciales
    addLayer(): Layer
    removeLayer(id: string): void  
    getActiveLayer(): Layer | null
    setActiveLayer(id: string): void
    getLayers(): Layer[]
    moveLayer(from: number, to: number): void
}
```

**Impacto**: Habilita todo el sistema de dibujo persistente.

---

### **P0.2: RenderSystem con Composición de Layers**
**Prioridad**: 🔥 **CRÍTICO** | **Tiempo**: 3-4 días | **Complejidad**: Media

**¿Por qué es crítico?**
Sin RenderSystem funcional:
- ❌ Los layers existen pero no se visualizan
- ❌ El usuario no ve su trabajo
- ❌ Imposible validar que el drawing funcione
- ❌ No hay composición visual

**Implementación requerida**:
```typescript
class RenderSystem implements LoopSystem {
    render(state: EngineState) {
        // Clear main canvas
        state.context2d.clearRect(0, 0, canvas.width, canvas.height);
        
        // Compose layers in order
        state.layerManager.getLayers().forEach(layer => {
            if (layer.visible) {
                state.context2d.globalAlpha = layer.opacity;
                state.context2d.drawImage(layer.canvas, 0, 0);
            }
        });
    }
}
```

**Impacto**: Convierte el trabajo invisible en visible.

---

### **P0.3: Integración ToolSystem → LayerSystem**
**Prioridad**: 🔥 **CRÍTICO** | **Tiempo**: 1-2 días | **Complejidad**: Baja

**¿Por qué es crítico?**
Actualmente el ToolSystem dibuja en el canvas principal:
```typescript
// 🚨 PROBLEMA: Dibuja directamente al canvas base
state.context2d.beginPath();
state.context2d.moveTo(this.lastX, this.lastY);
state.context2d.lineTo(x, y);
state.context2d.stroke();
```

**Cambio requerido**:
```typescript
// ✅ SOLUCIÓN: Dibujar en layer activo
draw(state: EngineState, input: InputManager) {
    const activeLayer = state.layerManager.getActiveLayer();
    if (!activeLayer) return;
    
    const ctx = activeLayer.getContext(); // Canvas del layer
    ctx.lineWidth = pressure * 10;
    ctx.strokeStyle = "#f00";
    // ... dibujar en el layer, no en canvas base
}
```

**Impacto**: El dibujo se vuelve persistente y funcional.

---

### **P0.4: EngineState Expandido**
**Prioridad**: 🔥 **CRÍTICO** | **Tiempo**: 1 día | **Complejidad**: Baja

**¿Por qué es crítico?**
El EngineState actual solo tiene canvas y toolId:
```typescript
class EngineState {
    canvas: HTMLCanvasElement | null = null;
    context2d: CanvasRenderingContext2D | null = null;
    toolId: string = 'brush'; // Muy básico
}
```

**Expansión requerida**:
```typescript
class EngineState {
    // Canvas existente
    canvas: HTMLCanvasElement | null = null;
    context2d: CanvasRenderingContext2D | null = null;
    
    // Nuevas propiedades críticas
    layerManager: LayerManager | null = null;
    activeLayerId: string = '';
    toolId: string = 'brush';
    
    // Configuración de herramientas
    brushSize: number = 5;
    brushColor: string = '#000000';
    opacity: number = 1.0;
}
```

**Impacto**: Conecta todos los sistemas con estado compartido.

---

## 🎯 Prioridades Importantes (P1) - Usabilidad Básica

### **P1.1: Sistema de Múltiples Herramientas**
**Prioridad**: 🎯 **IMPORTANTE** | **Tiempo**: 4-5 días | **Complejidad**: Media

**Herramientas mínimas requeridas**:
1. **Brush** (ya existe, necesita configuración)
2. **Eraser** (borrar en layer activo)
3. **Line Tool** (líneas rectas con preview)
4. **Rectangle/Ellipse** (shapes básicas)

**Implementación**:
```typescript
interface Tool {
    id: string;
    name: string;
    onPointerDown(state: EngineState, input: InputManager): void;
    onPointerMove(state: EngineState, input: InputManager): void;
    onPointerUp(state: EngineState, input: InputManager): void;
}
```

**Impacto**: Convierte el dibujo básico en una herramienta real.

---

### **P1.2: LayerSystem Completo**
**Prioridad**: 🎯 **IMPORTANTE** | **Tiempo**: 3-4 días | **Complejidad**: Media

**Funcionalidades requeridas**:
- **Reordering**: Drag & drop de layers
- **Blend modes**: Multiply, screen, overlay básicos
- **Opacity control**: Slider para transparencia
- **Visibility toggle**: Mostrar/ocultar layers

**Impacto**: Permite composición profesional de imágenes.

---

### **P1.3: UI Básica de Gestión**
**Prioridad**: 🎯 **IMPORTANTE** | **Tiempo**: 5-7 días | **Complejidad**: Alta

**Componentes requeridos**:
1. **Toolbar**: Selector de herramientas
2. **Layers Panel**: Lista de layers con controles
3. **Color Picker**: Selección de colores
4. **Brush Settings**: Tamaño, opacidad

**Impacto**: Hace la funcionalidad accesible al usuario.

---

## 🌟 Prioridades Adicionales (P2) - Features Profesionales

### **P2.1: Sistema de Undo/Redo Robusto**
**Prioridad**: 🌟 **DESEABLE** | **Tiempo**: 1 semana | **Complejidad**: Media-Alta

**Command Pattern Implementation**:
```typescript
interface Command {
    execute(): void;
    undo(): void;
}

class HistoryManager {
    private history: Command[] = [];
    private currentIndex = -1;
    
    executeCommand(command: Command): void;
    undo(): void;
    redo(): void;
}
```

**Impacto**: Experiencia profesional de edición.

---

### **P2.2: Herramientas Avanzadas**
**Prioridad**: 🌟 **DESEABLE** | **Tiempo**: 2-3 semanas | **Complejidad**: Alta

- **Selection Tool**: Marco de selección
- **Transform Tool**: Mover, escalar, rotar
- **Text Tool**: Añadir texto
- **Pen Tool**: Curvas bezier

**Impacto**: Aplicación de dibujo completa.

---

### **P2.3: Sistema de Archivos**
**Prioridad**: 🌟 **DESEABLE** | **Tiempo**: 1 semana | **Complejidad**: Media

- **Save/Load**: Formato nativo .drawapp
- **Import**: PNG, JPG, SVG
- **Export**: PNG, JPG, PDF
- **Auto-save**: Guardado automático

**Impacto**: Persistencia y portabilidad del trabajo.

---

## 📅 Roadmap Detallado

### **Semana 1: MVP Funcional (P0)**
- **Lunes**: LayerManager CRUD + EngineState expandido
- **Martes-Miércoles**: RenderSystem con composición
- **Jueves**: Integración ToolSystem → Layer
- **Viernes**: Testing y refactorización

**Resultado**: Aplicación que puede dibujar y persistir strokes en layers.

### **Semana 2: Herramientas Básicas (P1.1)**
- **Lunes-Martes**: Tool system refactorizado + Brush mejorado
- **Miércoles**: Eraser implementation
- **Jueves-Viernes**: Line + Rectangle tools

**Resultado**: Múltiples herramientas funcionales.

### **Semana 3: UI de Control (P1.3)**
- **Lunes-Martes**: Toolbar + selector de herramientas
- **Miércoles-Jueves**: Layers panel completo
- **Viernes**: Color picker + brush settings

**Resultado**: Interfaz usable y completa.

### **Semana 4+: Features Profesionales (P2)**
- Según demanda y priorización del usuario.

---

## ⚠️ Riesgos y Mitigación

### **Riesgo Crítico: Integración de Sistemas**
**Problema**: Los sistemas están diseñados modularmente pero la integración puede ser compleja.

**Mitigación**:
- Implementar P0.4 (EngineState) primero
- Testear integración cada componente
- Mantener arquitectura limpia con interfaces claras

### **Riesgo: Performance con Múltiples Layers**
**Problema**: Cada layer es un canvas separado, puede consumir memoria.

**Mitigación**:
- Implementar lazy loading de layers
- Limitar número máximo de layers inicialmente
- Optimizar render solo de layers visibles

### **Riesgo: Complejidad de UI**
**Problema**: Vue integration puede añadir complejidad no anticipada.

**Mitigación**:
- Empezar con UI mínima funcional
- Iterar gradualmente
- Mantener estado sincronizado entre engine y Vue

---

## 🎯 Métricas de Éxito

### **P0 - MVP Funcional**
- ✅ Usuario puede dibujar strokes
- ✅ Los strokes persisten entre frames
- ✅ Múltiples layers funcionan
- ✅ Renderizado es visible en pantalla

### **P1 - Usabilidad Básica**
- ✅ Mínimo 3 herramientas (brush, eraser, line)
- ✅ Panel de layers funcional
- ✅ Cambio de colores y tamaños
- ✅ UI intuitiva y responsive

### **P2 - Profesional**
- ✅ Undo/redo funcional
- ✅ Import/export de archivos
- ✅ Herramientas avanzadas
- ✅ Performance óptima

---

## 📝 Conclusiones

1. **El estado actual es sólido pero incompleto** - La arquitectura base está bien diseñada
2. **Las prioridades P0 son verdaderos bloqueadores** - Sin ellas, la app no funciona realmente
3. **El timeline es agresivo pero realista** - 1 semana para MVP, 3-4 semanas para funcionalidad completa
4. **El mayor riesgo es la integración** - No la complejidad individual de los componentes

**Recomendación**: Enfocarse 100% en P0 esta semana. Es fundamental tener un MVP funcional antes de añadir más características.

---

*Última actualización: 20 de Enero de 2026*  
*Basado en análisis del estado actual del engine*