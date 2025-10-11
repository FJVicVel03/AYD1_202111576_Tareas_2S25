# Plan Ágil de SeguridadGT

Este resumen recopila los hallazgos de las encuestas, las preguntas frecuentes del jurado y las sugerencias del equipo para estructurar la entrega de valor de forma incremental.

## MVP priorizado

- **Objetivo**: demostrar confianza y utilidad en las primeras 4 semanas.
- **Alcance**:
  - Denuncia anónima con evidencia cifrada y seguimiento por código.
  - Botón de emergencia 360° (app, gestos físicos, fallback SMS/WhatsApp).
  - Mapa de alertas comunitarias con filtros de riesgo.
- **Criterios de aceptación**:
  - Flujo completo probado con al menos 10 personas de comunidades piloto.
  - Integración funcional con líneas 110, 1572 y 1543 mediante protocolos acordados.

## Roadmap incremental

| Fase | Horizonte | Objetivo | Entregables clave |
| --- | --- | --- | --- |
| Fase 1 · MVP | 0-3 meses | Validar hipótesis de adopción y confianza | Denuncia anónima, botón de emergencia, mapa de alertas, panel básico de casos |
| Fase 2 · IA predictiva | 3-6 meses | Anticipar riesgos y optimizar respuesta | Modelos de riesgo territorial, dashboards operativos, asistente virtual IA + voz |
| Fase 3 · Integración avanzada | 6-12 meses | Escalar con instituciones y medir impacto | Integraciones con PNC/MP, APIs abiertas, reportes de transparencia automatizados |

## Historias de usuario prioritarias

1. Como **ciudadana**, quiero enviar una denuncia anónima con evidencia segura para recibir ayuda sin revelar mi identidad.
2. Como **agente de la PNC**, quiero recibir alertas geolocalizadas en tiempo real para responder antes de que el incidente escale.
3. Como **líder comunitario**, quiero acceder a materiales en mi idioma para capacitar a vecinos sobre protocolos de seguridad y uso del botón de emergencia.

## KPIs y métricas de impacto

- ≥ 85 % de denuncias procesadas correctamente en los municipios piloto.
- ≤ 10 minutos de tiempo medio de respuesta desde la activación de la alerta.
- Reducción del 15 % de incidentes violentos en zonas priorizadas al cabo de 12 meses.
- ≥ 25 % de participación ciudadana recurrente (denuncias + retroalimentación) tras 6 meses.

## Plan de validación con usuarios

- **Sprint 1:** test de prototipo navegable enfocándose en flujo de denuncia y botón de emergencia con 8-10 personas (mitad mujeres) de comunidades vulnerables.
- **Sprint 2:** co-creación de mejoras con policías locales y gestores comunitarios; incorporar retroalimentación en el MVP.
- **Sprint 3:** pilotos controlados en Mixco, Villa Nueva y Quiché con monitoreo de KPIs y retroalimentación semanal.

## Gestión de riesgos y salvaguardas

- **Seguridad de datos:** cifrado AES-256, hashing SHA-512 para integridad y acceso por roles auditado. Auditorías externas trimestrales.
- **Resiliencia operativa:** redundancia en nube + backups automáticos + modo offline que sincroniza al recuperar conectividad.
- **Prevención de abuso interno:** doble autenticación para personal institucional, registros de acceso visibles para la persona denunciante, separación de funciones.

## Inclusión y accesibilidad

- Interfaz multilingüe (español, inglés, K’iche’, Kaqchikel) con planeación para sumar más idiomas mayas.
- Guiado por voz, lectura automática y modo de contraste alto para combatir el analfabetismo digital.
- Capacitación comunitaria presencial y materiales descargables (audio, video, infografías) para reforzar la adopción.

## Siguientes pasos recomendados

1. Consolidar backlog del MVP con estimaciones y dependencias técnicas (back-end, IA, integración con PNC/MP).
2. Agendar sesiones de investigación con comunidades y autoridades locales antes del Sprint 1.
3. Definir comité de ética y seguridad que supervise denuncias falsas, gobernanza de datos y procesos de escalamiento.
