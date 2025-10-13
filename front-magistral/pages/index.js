import { useMemo, useCallback } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import SectionHeader from "@/components/SectionHeader";
import PanelSwitcher from "@/components/PanelSwitcher";
import styles from "@/styles/Home.module.css";
import dynamic from 'next/dynamic';
import FadeIn from "@components/FadeIn";
import ShowMoreList from '@/components/ShowMoreList';


const MockMap = dynamic(() => import('@/components/MockMap'), { ssr: false });

const heroStats = [
  { label: "Municipios monitoreados", value: "45", trend: "Cobertura prioritaria 2025" },
  { label: "Alertas comunitarias", value: "128", trend: "+18% participacion ciudadana" },
  { label: "Respuestas coordinadas", value: "36", trend: "En colaboracion con PNC y CONRED" }
];

const strategicModules = [
  {
    badge: "Analisis",
    title: "Observatorio de violencia y criminalidad",
    description:
      "Panel de inteligencia con datos abiertos, tendencias temporales, mapas de calor y segmentacion por genero y grupos vulnerables.",
    bullets: [
      "Indicadores clave: homicidios, extorsiones, violencia de genero",
      "Capas comparativas por departamento y municipio",
      "Alertas predictivas basadas en patrones historicos"
    ],
    href: "/observatorio"
  },
  {
    badge: "Atencion",
    title: "Ruta digital de denuncias",
    description:
      "Guia paso a paso para que la ciudadania registre incidentes, acceda a proteccion y reciba seguimiento transparente.",
    bullets: [
      "Formulario guiado y validacion de evidencia",
      "Integracion con lineas 110, 1572 y 1543",
      "Panel de estado para cada caso reportado"
    ],
    href: "/denuncias"
  },
  {
    badge: "Confianza",
    title: "Red de comunidades vigilantes",
    description:
      "Programas territoriales para fortalecer la organizacion local, brigadas juveniles y redes de lideresas comunitarias.",
    bullets: [
      "Calendario de capacitaciones y talleres",
      "Kit de herramientas para liderar reuniones seguras",
      "Historias de impacto y buenas practicas"
    ],
    href: "/colaboracion"
  }
];

const alertas = [
  { zona: "Mixco - Zona 6", categoria: "Extorsiones", hora: "Hace 2 h", estado: "Coordinacion con MP" },
  { zona: "Villa Nueva - Barcena", categoria: "Violencia juvenil", hora: "Hace 4 h", estado: "Ruta de acompanamiento activada" },
  { zona: "Guatemala - Zona 18", categoria: "Robos a transporte", hora: "Hace 6 h", estado: "PNC en patrullaje preventivo" }
];

const stepsColaboracion = [
  {
    title: "Diagnostico participativo",
    description:
      "Sesiones con lideres comunitarios, juventudes y autoridades locales para priorizar riesgos y recursos disponibles."
  },
  {
    title: "Plan de accion territorial",
    description:
      "Hoja de ruta con responsables, metricas de impacto y presupuesto compartido para prevencion social de la violencia."
  },
  {
    title: "Seguimiento y transparencia",
    description:
      "Tableros abiertos con progreso, historias de exito y espacios de retroalimentacion para mejorar continuamente."
  }
];

const mapLegend = [
  { label: "Muy alta incidencia", color: "#ff5f6d" },
  { label: "Alta incidencia", color: "#ff9966" },
  { label: "Media", color: "#ffd56f" },
  { label: "Baja", color: "#8bd46e" },
  { label: "Zona de riesgo", color: "#b91c1c" }
];

const inclusionFeatures = [
  {
    title: "Plataforma multilingue",
    description:
      "Interfaz disponible en espanol, ingles y lenguas mayas priorizadas. Traduccion contextual para terminos de seguridad.",
    tags: ["Espanol", "Ingles", "Kiche", "Kaqchikel"]
  },
  {
    title: "Soporte por voz y audio",
    description:
      "Lectura en voz alta, comandos por voz y guias grabadas para combatir el analfabetismo digital y apoyar a personas con discapacidad visual.",
    tags: ["Modo voz", "Guia auditiva", "Contraste alto"]
  },
  {
    title: "Alertas multicanal",
    description:
      "Notificaciones seguras via WhatsApp, SMS y push con confirmacion de entrega y opcion de apagarlas cuando la persona usuaria lo desee.",
    tags: ["WhatsApp", "SMS", "Push seguro"]
  }
];

const roadmapPhases = [
  {
    phase: "Fase 1 - MVP",
    focus: "Entregar valor inmediato a comunidades vulnerables.",
    deliverables: ["Denuncia anonima cifrada", "Boton de emergencia 360 grados", "Mapa de alertas comunitarias"]
  },
  {
    phase: "Fase 2 - IA predictiva",
    focus: "Utilizar datos para anticipar riesgos y optimizar la respuesta.",
    deliverables: ["Modelos de riesgo territorial", "Dashboards operativos en tiempo real", "Asistente IA para orientacion emocional"]
  },
  {
    phase: "Fase 3 - Integracion avanzada",
    focus: "Articular instituciones y evaluacion de impacto con analitica avanzada.",
    deliverables: ["Integraciones con PNC/MP", "Reportes de transparencia automatizados", "APIs abiertas para aliados"]
  }
];

const userStories = [
  "Como ciudadana, quiero enviar una denuncia anonima con evidencia segura para recibir ayuda sin revelar mi identidad.",
  "Como agente de la PNC, quiero recibir alertas geolocalizadas en tiempo real para responder antes de que escale el incidente.",
  "Como lider comunitario, quiero acceder a materiales en mi idioma para capacitar a vecinos sobre protocolos de seguridad."
];

const successMetrics = [
  { label: "Denuncias procesadas correctamente", target: ">= 85 % en municipios piloto" },
  { label: "Tiempo medio de respuesta", target: "<= 10 minutos desde la alerta" },
  { label: "Reduccion de incidentes", target: "-15 % en zonas priorizadas en 12 meses" }
];

export default function HomePage() {
  const { t } = useLanguage();

  const chunkArray = (items, size) => {
    const result = [];
    items.forEach((item, index) => {
      if (index % size === 0) {
        result.push([item]);
      } else {
        result[result.length - 1].push(item);
      }
    });
    return result;
  };

  const renderModuleCard = useCallback(
    (module, i = 0) => (
     <FadeIn repeat as="article" key={module.title} delay={120 * i} className={styles.moduleCard}>
        <span className={styles.badge}>{module.badge}</span>
        <h3 className={styles.moduleTitle}>{module.title}</h3>
        <p className={styles.moduleDescription}>{module.description}</p>
        <ShowMoreList
          items={module.bullets}
          initiallyVisible={2}
          listClassName={styles.moduleList}
          buttonClassName={styles.secondaryButton}
          moreLabel="Ver detalles"
          lessLabel="Ocultar"
        />
        <Link href={module.href} className={styles.secondaryButton}>
          {t('home.modules.cta', 'Ver prototipo')}
        </Link>
      </FadeIn>
    ),
    [t]
  );

  const renderInclusionCard = useCallback(
    (feature, i = 0) => (
      <FadeIn repeat as="article" key={feature.title} delay={120 * i} className={styles.inclusionCard}>
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
        <div className={styles.inclusionTags}>
          {feature.tags.map((tag) => (
            <span key={tag} className={styles.tagPill}>
              {tag}
            </span>
          ))}
        </div>
      </FadeIn>
    ),
    []
  );


  const renderRoadmapCard = useCallback(
    (phase, i = 0) => (
      <FadeIn repeat as="article" key={phase.phase} delay={120 * i} className={styles.roadmapCard}>
        <div className={styles.roadmapHeader}>
          <span>{phase.phase}</span>
          <p>{phase.focus}</p>
        </div>
        <ul className={styles.roadmapDeliverables}>
          {phase.deliverables.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </FadeIn>
    ),
    []
  );

  const heroContent = useMemo(
    () => ({
      subtitle: t("home.hero.subtitle", "Estrategia integral de prevencion y respuesta"),
      title: t(
        "home.hero.title",
        "Seguridad ciudadana informada, colaborativa y centrada en las personas."
      ),
      description: t(
        "home.hero.description",
        "Plataforma para monitorear indicadores de violencia, coordinar instituciones y activar la participacion ciudadana en tiempo real."
      ),
      primaryCta: t("home.hero.primaryCta", "Explorar datos en vivo"),
      secondaryCta: t("home.hero.secondaryCta", "Conectar con la comunidad")
    }),
    [t]
  );

  const modulesHeader = useMemo(
    () => ({
      eyebrow: t("home.modules.eyebrow", "Modulos principales"),
      title: t(
        "home.modules.title",
        "Ecosistema digital para decisiones rapidas y coordinadas"
      ),
      description: t(
        "home.modules.description",
        "Prototipo de navegacion para articular instituciones publicas, municipalidades y ciudadania en la gestion de la seguridad."
      )
    }),
    [t]
  );

  const inclusionHeader = useMemo(
    () => ({
      eyebrow: t("home.inclusion.eyebrow", "Inclusion y accesibilidad"),
      title: t("home.inclusion.title", "Tecnologia pensada para todas las personas"),
      description: t(
        "home.inclusion.description",
        "Multilingue, soporte por voz y notificaciones multicanal para reducir brechas de alfabetizacion digital."
      )
    }),
    [t]
  );

  const roadmapHeader = useMemo(
    () => ({
      eyebrow: t("home.roadmap.eyebrow", "Gestion agil"),
      title: t("home.roadmap.title", "Roadmap incremental y foco en valor"),
      description: t(
        "home.roadmap.description",
        "Priorizamos un MVP claro y entregas medibles por sprint, acompanadas de historias de usuario y KPIs que guian la evolucion del producto."
      ),
      storiesTitle: t("home.roadmap.storiesTitle", "Historias de usuario prioritarias"),
      kpisTitle: t("home.roadmap.kpisTitle", "Indicadores de exito")
    }),
    [t]
  );

  const strategicPanels = useMemo(
    () =>
      chunkArray(strategicModules, 1).map((chunk, index) => ({
        key: `module-${index}`,
        title: chunk[0].title,
        description: chunk[0].description,
        content: <div className={styles.panelGrid}>{chunk.map((module) => renderModuleCard(module))}</div>
      })),
    [renderModuleCard]
  );

  const inclusionPanels = useMemo(
    () =>
      chunkArray(inclusionFeatures, 1).map((chunk, index) => ({
        key: `inclusion-${index}`,
        title: chunk[0].title,
        description: chunk[0].description,
        content: <div className={styles.panelGrid}>{chunk.map((feature) => renderInclusionCard(feature))}</div>
      })),
    [renderInclusionCard]
  );

  const roadmapPanels = useMemo(
    () =>
      chunkArray(roadmapPhases, 1).map((chunk, index) => ({
        key: `roadmap-${index}`,
        title: chunk[0].phase,
        description: chunk[0].focus,
        content: <div className={styles.panelGrid}>{chunk.map((phase) => renderRoadmapCard(phase))}</div>
      })),
    [renderRoadmapCard]
  );

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <FadeIn className={styles.heroContent}>
          <p className={styles.heroSubtitle}>{heroContent.subtitle}</p>
          <h1 className={styles.heroTitle}>{heroContent.title}</h1>
          <p className={styles.heroSubtitle}>{heroContent.description}</p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryButton} href="/observatorio">
              {heroContent.primaryCta}
            </Link>
            <Link className={styles.secondaryButton} href="/colaboracion">
              {heroContent.secondaryCta}
            </Link>
          </div>
        </FadeIn>
        <div className={styles.heroStats}>
          {heroStats.map((stat, i) => (
            <FadeIn repeat as="article" key={stat.label} delay={100 * i} className={styles.statCard}>
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statTrend}>{stat.trend}</span>
            </FadeIn>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          eyebrow={modulesHeader.eyebrow}
          title={modulesHeader.title}
          description={modulesHeader.description}
        />
        <div className={styles.mobileOnly}>
          <PanelSwitcher panels={strategicPanels} />
        </div>
        <div className={`${styles.sectionsGrid} ${styles.desktopOnly}`}>
          {strategicModules.map((module, i) => renderModuleCard(module, i))}
        </div>
      </section>

      <section className={styles.mapPreview}>
        <FadeIn repeat className={styles.mapCard}>
          <SectionHeader
            eyebrow="Visualizacion territorial"
            title="Mapa dinamico de incidencia"
            description="Permite identificar zonas calientes, rutas de riesgo y puntos criticos de violencia para priorizar intervenciones."
          />
          <div className={styles.mapContainer}>
            <MockMap className={styles.mapContainer} />
          </div>
          <div className={styles.mapLegend}>
            {mapLegend.map((legend) => (
              <div key={legend.label} className={styles.legendItem}>
                <span className={styles.legendSwatch} style={{ background: legend.color }} />
                <span>{legend.label}</span>
              </div>
            ))}
          </div>
        </FadeIn>
        
        <FadeIn repeat className={styles.alertsCard}>
          <SectionHeader
            eyebrow="Alertas recientes"
            title="Eventos priorizados en las ultimas horas"
            description="Resumen de incidentes registrados por la ciudadania y las autoridades."
          />
          {alertas.map((alerta, i) => (
            <FadeIn repeat as="article" key={alerta.zona} delay={90 * i} className={styles.alertItem}>
              <span className={styles.alertLocation}>{alerta.zona}</span>
              <span>{alerta.categoria}</span>
              <span className={styles.alertMeta}>
                {alerta.hora} / {alerta.estado}
              </span>
            </FadeIn>
          ))}
        </FadeIn>
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
              {stepsColaboracion.map((step, i) => (
                <FadeIn repeat as="li" key={step.title} delay={100 * i} className={styles.timelineItem}>
                  <span className={styles.timelineStep}>{i + 1}</span>
                  <span className={styles.timelineTitle}>{step.title}</span>
                  <p className={styles.timelineDescription}>{step.description}</p>
                </FadeIn>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className={styles.inclusionSection}>
        <SectionHeader
          eyebrow={inclusionHeader.eyebrow}
          title={inclusionHeader.title}
          description={inclusionHeader.description}
        />
        <div className={styles.mobileOnly}>
          <PanelSwitcher panels={inclusionPanels} />
        </div>
        <div className={`${styles.inclusionGrid} ${styles.desktopOnly}`}>
          {inclusionFeatures.map((feature, i) => renderInclusionCard(feature, i))}
        </div>
      </section>

      <section className={styles.roadmapSection}>
        <SectionHeader
          eyebrow={roadmapHeader.eyebrow}
          title={roadmapHeader.title}
          description={roadmapHeader.description}
        />
        <div className={styles.mobileOnly}>
          <PanelSwitcher panels={roadmapPanels} />
        </div>
        <div className={`${styles.roadmapGrid} ${styles.desktopOnly}`}>
          {roadmapPhases.map((phase, i) => renderRoadmapCard(phase, i))}
        </div>
  
        <div className={styles.storyKpiGrid}>
          <FadeIn repeat as="article" className={styles.storyCard}>
            <h3>{roadmapHeader.storiesTitle}</h3>
            <ul className={styles.storyList}>
              {userStories.map((story, i) => (
                <FadeIn repeat as="li" key={story} delay={90 * i}>
                  {story}
                </FadeIn>
              ))}
            </ul>
          </FadeIn>
          
          <FadeIn repeat as="article" className={styles.kpiCard}>
            <h3>{roadmapHeader.kpisTitle}</h3>
            <ul className={styles.kpiList}>
              {successMetrics.map((metric, i) => (
                <FadeIn repeat as="li" key={metric.label} delay={90 * i}>
                  <strong>{metric.label}</strong>
                  <span>{metric.target}</span>
                </FadeIn>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}