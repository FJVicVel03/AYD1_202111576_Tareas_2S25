# Especificación Funcional — Prototipo SeguridadGT

Versión: 0.1.0  
Fecha: 08/10/2025 
Alcance: Prototipo navegable en Next.js (frontend únicamente)

---

## 1. Propósito y contexto
El prototipo SeguridadGT modela una plataforma ciudadana e interinstitucional para: (a) observar indicadores de violencia, (b) facilitar la ruta digital de denuncias y (c) articular la colaboración territorial. No expone datos reales ni integra sistemas de terceros — su objetivo es validar navegación, contenido, componentes de UI y flujos clave.

## 2. Relación con artefactos entregados
- `Diagrama.png`: insumo principal para diseñar los flujos macro. Se mapea explícitamente en la sección 6.
- `journey.pdf`: referencia para el recorrido de personas usuarias (no procesado automáticamente aquí). Se asume que provee escenarios/insights que refuerzan los flujos definidos.
- `Informacion.pdf`: contexto, supuestos y líneas de acción (no procesado automáticamente aquí). Se refleja en requisitos de información, enlaces y narrativa.

## 3. Alcance del prototipo (v0)
Incluye vistas estáticas con contenido ficticio pero creíble:
- Landing / visión general (`/`): Hero, métricas, módulos, mapa/alertas.
- Observatorio (`/observatorio`): filtros simulados, tarjetas de tableros, placeholders de gráficas, reporte ejecutivo.
- Denuncias (`/denuncias`): requisitos, protocolos, canales de atención, pasos del proceso y banner de acompañamiento.
- Colaboración (`/colaboracion`): alianzas, roadmap por fases y casos piloto.
- Galería de mockups (`/mockups`): set de SVGs desktop/mobile con visor y descarga.

Fuera de alcance: autenticación, backend, persistencia real, integraciones operativas, analítica real, roles y permisos efectivos.

## 4. Personas y roles (de referencia)
- Ciudadanía reportante: inicia denuncias, consulta el estado, consume guías y canales.
- Gestor/a comunitario/a: brinda acompañamiento y facilita coordinación local.
- Operador/a institucional: triage, clasificación, derivación y cierre de casos.
- Analista (observatorio): prepara visualizaciones y reportes ejecutivos.

## 5. Arquitectura de módulos (frontend)
- Observatorio: panel de insights, filtros simulados y componentes de tarjetas/gráficas.
- Denuncias: flujo conceptual en tres pasos (registro, validación/derivación, seguimiento).
- Colaboración: alianzas, fases (diagnóstico, implementación, escalamiento) y resultados comunitarios.
- Alertas: listado corto de eventos priorizados (componente lateral/oscuro en home).
- Mockups: galería para presentaciones con filtro por orientación (desktop/mobile) y visor.

Código relevante: ver `pages/*.js`, `components/*`, `styles/*`, `public/mockups/*`.

## 6. Mapeo del flujo (Diagrama.png — Módulos)
1) Conciencia del riesgo — Observatorio (Home + KPIs)
- Señales: informes de asaltos, disparos, ansiedad.
- En el prototipo: métricas de cobertura, hero con CTA a datos, sección "Visualización territorial".

2) Prevención comunitaria — Colaboración
- Acciones: cambio de rutas, grupos vecinales, confianza ligera vs. desinformación.
- En el prototipo: alianzas institucionales, roadmap por fases, casos piloto y materiales.

3) Incidente — Denuncias
- Experiencia: asalto/extorsión, miedo/impotencia, amenaza a la vida.
- En el prototipo: requisitos, protocolos de confidencialidad, canales y formulario conceptual.

4) Acción inmediata — Denuncias + Alertas
- Acciones: llamar al 110, apoyo vecinal; fricciones: tardanza/burocracia.
- En el prototipo: tarjetas de canales (110/1574/1572) y "Alertas recientes" en Home/Observatorio.

5) Largo plazo — Colaboración + Observatorio
- Ajuste de rutinas, resignación, costos/desigualdad.
- En el prototipo: métricas de impacto (participación, instituciones articuladas) y reporte ejecutivo.

## 7. Historias de usuario y criterios de aceptación (prototipo)
- Como ciudadana, quiero ver un panorama claro de la seguridad para decidir rutas y horarios.
  - CA: La landing muestra 3-4 KPIs y acceso directo a Observatorio.
- Como persona denunciante, quiero un flujo comprensible y discreto para reportar.
  - CA: Se muestran requisitos, pasos con lenguaje claro y canales alternativos.
- Como gestor comunitario, quiero materiales y hoja de ruta para coordinar acciones.
  - CA: Colaboración incluye alianzas, fases y resultados piloto.
- Como analista, quiero un reporte ejecutivo con highlights.
  - CA: Observatorio incluye tarjeta de "Reporte ejecutivo" con métricas clave.

## 8. Información y contenido mínimo por módulo
- Observatorio
  - Filtros (período, indicadores, enfoque) simulados.
  - Tarjetas de tablero con: título, contexto/descripción, placeholder de gráfica, insights (bullets).
  - Reporte ejecutivo con highlights (casos, tiempo de respuesta, instituciones, alertas).
- Denuncias
  - Requisitos previos, políticas de confidencialidad y canales 24/7 (110, 1574, 1572).
  - Proceso en 3 pasos con CTA genérico (sin persistencia real).
- Colaboración
  - Alianzas (PNC, MP, SVET, municipalidades), roadmap por fases y casos piloto.
- Landing
  - Hero con CTAs, módulos, mapa/leyenda (placeholder) y alertas.

## 9. Modelo de datos (propuesta mock)
> No implementado en código. Útil para alinear backend futuro.

- IncidentReport
  - id, createdAt, channel (app/110/1574/1572), type (robo/extorsión/vif/otro),
  - location { lat, lng, municipio, zona },
  - reporter { anon:boolean, contactoOpcional },
  - evidence[] { id, type (foto/video/doc), urlTemporal },
  - status (nuevo/validando/derivado/en_seguimiento/cerrado),
  - history[] { at, action, by, note }.
- Alert
  - id, category, location, startedAt, status (activa/atendida), summary.
- KPI (time series)
  - id, indicator, scope (nacional/departamento/municipio), period, value.

## 10. Integraciones (futuras)
- Telefonía y líneas de atención (110/1574/1572): deep-links, IVR, o registro asistido.
- MP/PNC/CONRED: endpoints para derivación y estado de casos (push/pull) y anexos.
- Datos abiertos: INE/MINGOB/OG info relevante para KPIs.

## 11. Privacidad y seguridad
- Minimización de datos personales y opción de denuncia anónima.
- Cifrado en tránsito, segregación de roles e historial de accesos (a definir en backend).
- Retención limitada y saneamiento de archivos sensibles.

## 12. Accesibilidad y UX
- Contraste suficiente, tipografías legibles, navegación por teclado.
- Lenguaje claro y enfoque en estados vacíos/errores con orientación.
- Diseño responsive (mockups desktop/mobile incluidos).

## 13. Métricas de éxito (a validar)
- Tiempo a primera acción (observatorio — decisión comunitaria).
- Porcentaje de denuncias con seguimiento informado.
- Cobertura territorial y participación comunitaria activa.

## 14. Entregables en este repo (frontend)
- Páginas: `pages/index.js`, `pages/observatorio.js`, `pages/denuncias.js`, `pages/colaboracion.js`.
- Componentes: `components/Layout.js`, `components/SectionHeader.js`.
- Estilos: `styles/*.module.css`, `styles/globals.css`.
- Mockups: `public/mockups/*.svg` (desktop y mobile).
- Galería: `pages/mockups.js` y estilos `styles/Mockups.module.css`.

## 15. Roadmap sugerido
- v0.2: datos mock (JSON) para KPIs/alertas y listas.
- v0.3: formularios de denuncia en pasos con validación cliente.
- v0.4: autenticación y perfiles básicos (operador/gestor).
- v0.5: integración mínima con un servicio de almacenamiento seguro para evidencias.

## 16. Riesgos y supuestos
- Fuentes de datos heterogéneas y calidad variable.
- Disponibilidad de instituciones para interoperabilidad.
- Expectativas de tiempo de respuesta vs. capacidades reales.

## 17. Glosario
- VIF: Violencia intrafamiliar.
- KPI: Indicador clave de desempeño.
- Triage: Clasificación inicial de casos.

---

### Anexos
- Navegación: Inicio — (Observatorio | Denuncias | Colaboracion | Mockups).
- Mockups: ver `public/mockups/*.svg` o página `pages/mockups.js` para visor/descarga.

