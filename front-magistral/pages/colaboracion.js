import { useState } from 'react';
import SectionHeader from '@/components/SectionHeader';
import styles from '@/styles/Colaboracion.module.css';

const aliados = [
  {
    nombre: 'PNC - Ministerio de Gobernacion',
    enfoque: 'Despliegue operativo y patrullajes coordinados con alertas ciudadanas.',
    rol: 'Centro de mando conectado con rutas de patrullaje inteligente.'
  },
  {
    nombre: 'Ministerio Publico',
    enfoque: 'Judicializacion oportuna, fortalecimiento de fiscalias de distrito.',
    rol: 'Recibe expedientes digitales con evidencia clasificada y cadena de custodia.'
  },
  {
    nombre: 'Secretaria contra la Violencia Sexual (SVET)',
    enfoque: 'Acompanamiento integral para mujeres, ninez y adolescencia.',
    rol: 'Activa protocolos de proteccion y seguimiento psicosocial.'
  },
  {
    nombre: 'Municipalidades y comites comunitarios',
    enfoque: 'Prevencion social, recuperacion de espacios publicos y apoyo logistico.',
    rol: 'Coordina brigadas de iluminacion, camaras y actividades comunitarias.'
  }
];

const roadmap = [
  {
    fase: 'Fase 1 - Diagnóstico',
    items: [
      {
        title: 'Laboratorio de datos',
        description: 'Consolidar informacion institucional y ciudadana para detectar brechas y duplicidades.'
      },
      {
        title: 'Mapeo de actores',
        description: 'Identificar rutas criticas, capacidad de respuesta y canales de comunicacion en municipios priorizados.'
      },
      {
        title: 'Taller de priorizacion',
        description: 'Definir riesgos prioritarios y recursos con autoridades locales y liderazgos comunitarios.'
      }
    ]
  },
  {
    fase: 'Fase 2 - Implementacion',
    items: [
      {
        title: 'Pilotos municipales',
        description: 'Tableros operativos integrados y app ciudadana activa en tres municipios seleccionados.'
      },
      {
        title: 'Entrenamiento de gestores',
        description: 'Formacion en protocolos, acompanamiento y manejo de informacion sensible.'
      },
      {
        title: 'Integracion tecnologica',
        description: 'Conexion con centros de monitoreo, camaras y boton de panico municipal.'
      }
    ]
  },
  {
    fase: 'Fase 3 - Escalamiento',
    items: [
      {
        title: 'Expansion departamental',
        description: 'Replicar la metodologia en departamentos priorizados por el CONASIG.'
      },
      {
        title: 'Monitoreo publico',
        description: 'Publicar indicadores de impacto y reportes de rendicion de cuentas periodicos.'
      },
      {
        title: 'Fondo compartido',
        description: 'Consolidar recursos para mantenimiento tecnologico y sostenibilidad comunitaria.'
      }
    ]
  }
];

const comunidades = [
  { nombre: 'Mixco - Zona 6', resultado: 'Reduccion de incidentes armados en 14% tras intervenciones focales.' },
  { nombre: 'Coban - Barrio La Libertad', resultado: '35 lideresas formadas en protocolos de denuncia y autoproteccion.' },
  { nombre: 'Villa Nueva - Barcena', resultado: 'Implementacion de rutas seguras para transporte hacia centros educativos.' },
  { nombre: 'Quetzaltenango - La Esperanza', resultado: 'Nucleo juvenil mapea riesgos y coordina jornadas de recuperacion de espacios.' },
  { nombre: 'Chimaltenango - El Tejar', resultado: 'Capacitacion comunitaria logra disminuir robos a comercios en un 20%.' },
  { nombre: 'Escuintla - Santa Lucía Cotzumalguapa', resultado: 'Alianzas locales fortalecen respuesta ante emergencias y violencia domestica.' }
];

export default function ColaboracionPage() {
  const [flipped, setFlipped] = useState({});

  const toggleFlip = (nombre) => {
    setFlipped((prev) => ({ ...prev, [nombre]: !prev[nombre] }));
  };

  return (
    <div className={styles.page}>
      <section className={styles.introCard}>
        <SectionHeader
          eyebrow="Alianzas Estratégicas"
          title="Articulación interinstitucional y comunitaria"
          description="El prototipo plantea cómo las instituciones y comunidades trabajan juntas para prevenir, responder y reconstruir confianza en la seguridad ciudadana."
        />
        <p>
          Cada mesa técnica cuenta con un tablero compartido, acuerdos de intercambio de información y un calendario de acciones territoriales.
          La plataforma facilita reportes automáticos, bitácoras de coordinación y métricas de impacto social.
        </p>
        <div className={styles.warningBox}>
          ⚠️ Advertencia: Los datos mostrados son simulados y se usan únicamente para propósitos de demostración del prototipo.
        </div>
      </section>

      <section className={styles.alliances}>
        {aliados.map((aliado) => (
          <div
            key={aliado.nombre}
            className={`${styles.flipCard} ${flipped[aliado.nombre] ? styles.flipped : ''}`}
            onClick={() => toggleFlip(aliado.nombre)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && toggleFlip(aliado.nombre)}
          >
            <div className={styles.flipInner}>
              <div className={styles.flipFront}>
                <h3 className={styles.allyTitle}>{aliado.nombre}</h3>
                <p className={styles.allyDescription}>{aliado.enfoque}</p>
                <span className={styles.clickHint}>Haz clic para ver el rol clave</span>
              </div>
              <div className={styles.flipBack}>
                <span className={styles.pill}>Rol clave</span>
                <p className={styles.allyDescription}>{aliado.rol}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className={styles.roadmap}>
        {roadmap.map((fase) => (
          <article key={fase.fase} className={styles.roadmapCard}>
            <span className={styles.pill}>{fase.fase}</span>
            <ul className={styles.timeline}>
              {fase.items.map((item) => (
                <li key={item.title} className={styles.timelineRow}>
                  <span className={styles.timelineTitle}>{item.title}</span>
                  <p className={styles.timelineDescription}>{item.description}</p>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className={styles.communityShowcase}>
        <SectionHeader
          eyebrow="Casos piloto"
          title="Resultados iniciales de la red comunitaria"
          description="Historias que inspiran confianza y muestran el potencial de las alianzas locales."
        />
        <div className={styles.communityGrid}>
          {comunidades.map((comunidad) => (
            <article key={comunidad.nombre} className={styles.communityCard}>
              <span className={styles.communityLabel}>{comunidad.nombre}</span>
              <span className={styles.communityMeta}>{comunidad.resultado}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}