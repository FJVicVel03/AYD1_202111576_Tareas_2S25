import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';
import styles from '@/styles/Home.module.css';

const heroStats = [
  { label: 'Municipios monitoreados', value: '45', trend: 'Cobertura prioritaria 2025' },
  { label: 'Alertas comunitarias', value: '128', trend: '+18% participacion ciudadana' },
  { label: 'Respuestas coordinadas', value: '36', trend: 'En colaboracion con PNC y CONRED' }
];

const strategicModules = [
  {
    badge: 'Analisis',
    title: 'Observatorio de violencia y criminalidad',
    description:
      'Panel de inteligencia con datos abiertos, tendencias temporales, mapas de calor y segmentacion por genero y grupos vulnerables.',
    bullets: [
      'Indicadores clave: homicidios, extorsiones, violencia de genero',
      'Capas comparativas por departamento y municipio',
      'Alertas predictivas basadas en patrones historicos'
    ],
    href: '/observatorio'
  },
  {
    badge: 'Atencion',
    title: 'Ruta digital de denuncias',
    description:
      'Guia paso a paso para que la ciudadania registre incidentes, acceda a proteccion y reciba seguimiento transparente.',
    bullets: [
      'Formulario guiado y validacion de evidencia',
      'Integracion con lineas 110, 1572 y 1543',
      'Panel de estado para cada caso reportado'
    ],
    href: '/denuncias'
  },
  {
    badge: 'Confianza',
    title: 'Red de comunidades vigilantes',
    description:
      'Programas territoriales para fortalecer la organizacion local, brigadas juveniles y redes de lideresas comunitarias.',
    bullets: [
      'Calendario de capacitaciones y talleres',
      'Kit de herramientas para liderar reuniones seguras',
      'Historias de impacto y buenas practicas'
    ],
    href: '/colaboracion'
  }
];

const alertas = [
  { zona: 'Mixco - Zona 6', categoria: 'Extorsiones', hora: 'Hace 2 h', estado: 'Coordinacion con MP' },
  { zona: 'Villa Nueva - Barcena', categoria: 'Violencia juvenil', hora: 'Hace 4 h', estado: 'Ruta de acompanamiento activada' },
  { zona: 'Guatemala - Zona 18', categoria: 'Robos a transporte', hora: 'Hace 6 h', estado: 'PNC en patrullaje preventivo' }
];

const stepsColaboracion = [
  {
    title: 'Diagnostico participativo',
    description:
      'Sesiones con lideres comunitarios, juventudes y autoridades locales para priorizar riesgos y recursos disponibles.'
  },
  {
    title: 'Plan de accion territorial',
    description:
      'Hoja de ruta con responsables, metricas de impacto y presupuesto compartido para prevencion social de la violencia.'
  },
  {
    title: 'Seguimiento y transparencia',
    description:
      'Tableros abiertos con progreso, historias de exito y espacios de retroalimentacion para mejorar continuamente.'
  }
];

const mapLegend = [
  { label: 'Muy alta incidencia', color: '#ff5f6d' },
  { label: 'Alta incidencia', color: '#ff9966' },
  { label: 'Media', color: '#ffd56f' },
  { label: 'Baja', color: '#8bd46e' }
];

export default function HomePage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.heroSubtitle}>Estrategia integral de prevencion y respuesta</p>
          <h1 className={styles.heroTitle}>Seguridad ciudadana informada, colaborativa y centrada en las personas.</h1>
          <p className={styles.heroSubtitle}>
            Plataforma para monitorear los indicadores de violencia en Guatemala, coordinar acciones entre instituciones y
            activar la participacion de la ciudadania en tiempo real.
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryButton} href="/observatorio">
              Explorar datos en vivo
            </Link>
            <Link className={styles.secondaryButton} href="/colaboracion">
              Conectar con la comunidad
            </Link>
          </div>
        </div>
        <div className={styles.heroStats}>
          {heroStats.map((stat) => (
            <article key={stat.label} className={styles.statCard}>
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statTrend}>{stat.trend}</span>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          eyebrow="Modulos principales"
          title="Ecosistema digital para decisiones rapidas y coordinadas"
          description="Prototipo de navegacion para los modulos clave que articularan a instituciones publicas, municipalidades y ciudadania en la gestion de la seguridad."
        />
        <div className={styles.sectionsGrid}>
          {strategicModules.map((module) => (
            <article key={module.title} className={styles.moduleCard}>
              <span className={styles.badge}>{module.badge}</span>
              <h3 className={styles.moduleTitle}>{module.title}</h3>
              <p className={styles.moduleDescription}>{module.description}</p>
              <ul className={styles.moduleList}>
                {module.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link href={module.href} className={styles.secondaryButton}>
                Ver prototipo
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.mapPreview}>
        <div className={styles.mapCard}>
          <SectionHeader
            eyebrow="Visualizacion territorial"
            title="Mapa dinamico de incidencia"
            description="Permite identificar zonas calientes, rutas de riesgo y puntos criticos de violencia para priorizar intervenciones."
          />
          <div className={styles.mapPlaceholder}>Mapa de calor interactivo</div>
          <div className={styles.mapLegend}>
            {mapLegend.map((legend) => (
              <div key={legend.label} className={styles.legendItem}>
                <span className={styles.legendSwatch} style={{ background: legend.color }} />
                <span>{legend.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.alertsCard}>
          <SectionHeader
            eyebrow="Alertas recientes"
            title="Eventos priorizados en las ultimas horas"
            description="Resumen de incidentes registrados por la ciudadania y las autoridades."
          />
          {alertas.map((alerta) => (
            <article key={alerta.zona} className={styles.alertItem}>
              <span className={styles.alertLocation}>{alerta.zona}</span>
              <span>{alerta.categoria}</span>
              <span className={styles.alertMeta}>
                {alerta.hora} / {alerta.estado}
              </span>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          eyebrow="Accion comunitaria"
          title="Como fortalecemos la seguridad desde el territorio"
          description="Inspirado en experiencias exitosas en municipios con alta incidencia, este recorrido muestra la articulacion entre instituciones y comunidades."
        />
        <div className={styles.communitySection}>
          <article className={styles.communityCard}>
            <h3 className={styles.moduleTitle}>Metodologia de intervencion</h3>
            <p className={styles.moduleDescription}>
              Cada municipio cuenta con un equipo de enlace institucional y facilitadores comunitarios que impulsan espacios de dialogo,
              reunen informacion y activan protocolos de respuesta oportuna.
            </p>
            <ul className={styles.moduleList}>
              <li>Mapeo de actores clave: liderazgos comunitarios, instituciones y aliados.</li>
              <li>Protocolos diferenciados para mujeres, ninez y juventudes.</li>
              <li>Monitoreo ciudadano con tableros accesibles y lenguaje sencillo.</li>
            </ul>
          </article>
          <article className={styles.communityCard}>
            <h3 className={styles.moduleTitle}>Ruta colaborativa</h3>
            <ul className={styles.timeline}>
              {stepsColaboracion.map((step, index) => (
                <li key={step.title} className={styles.timelineItem}>
                  <span className={styles.timelineStep}>{index + 1}</span>
                  <span className={styles.timelineTitle}>{step.title}</span>
                  <p className={styles.timelineDescription}>{step.description}</p>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </div>
  );
}
