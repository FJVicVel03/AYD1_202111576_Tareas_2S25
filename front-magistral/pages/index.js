import Link from "next/link";
import dynamic from "next/dynamic";
import { useLanguage } from "@/contexts/LanguageContext";
import SectionHeader from "@/components/SectionHeader";
import styles from "@/styles/Home.module.css";
import FadeIn from "@components/FadeIn";

// Carga del mapa de manera dinámica (sin SSR)
const MockMap = dynamic(() => import("@/components/MockMap"), { ssr: false });

// Datos de alertas
const alertas = [
  { zona: "Mixco - Zona 6", categoria: "Extorsiones", hora: "Hace 2 h", estado: "Coordinación con MP" },
  { zona: "Villa Nueva - Bárcena", categoria: "Violencia juvenil", hora: "Hace 4 h", estado: "Ruta de acompañamiento activada" },
  { zona: "Guatemala - Zona 18", categoria: "Robos a transporte", hora: "Hace 6 h", estado: "PNC en patrullaje preventivo" }
];

// Leyenda del mapa
const mapLegend = [
  { label: "Muy alta incidencia", color: "#ff5f6d" },
  { label: "Alta incidencia", color: "#ff9966" },
  { label: "Media", color: "#ffd56f" },
  { label: "Baja", color: "#8bd46e" }
];

export default function HomePage() {
  const { t } = useLanguage();

  const heroContent = {
    subtitle: t("home.hero.subtitle", "Estrategia integral de prevención y respuesta"),
    title: t("home.hero.title", "Seguridad ciudadana informada, colaborativa y centrada en las personas."),
    description: t(
      "home.hero.description",
      "Plataforma para monitorear indicadores de violencia, coordinar instituciones y activar la participación ciudadana en tiempo real."
    ),
    primaryCta: t("home.hero.primaryCta", "Explorar datos en vivo"),
    secondaryCta: t("home.hero.secondaryCta", "Conectar con la comunidad")
  };

  return (
    <div className={styles.page}>
      {/* HERO PRINCIPAL */}
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
      </section>

      {/* MAPA DINÁMICO DE INCIDENCIA */}
      <section className={styles.mapPreview}>
        <FadeIn repeat className={styles.mapCard}>
          <SectionHeader
            eyebrow="Visualización territorial"
            title="Mapa dinámico de incidencia"
            description="Permite identificar zonas calientes, rutas de riesgo y puntos críticos de violencia para priorizar intervenciones."
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

        {/* ALERTAS RECIENTES */}
        <FadeIn repeat className={styles.alertsCard}>
          <SectionHeader
            eyebrow="Actualizaciones"
            title="Alertas recientes"
            description="Eventos priorizados en las últimas horas registrados por la ciudadanía y las autoridades."
          />
          {alertas.map((alerta, i) => (
            <FadeIn repeat as="article" key={alerta.zona} delay={90 * i} className={styles.alertItem}>
              <div className={styles.alertHeader}>
                <span className={styles.alertLocation}>{alerta.zona}</span>
                <span className={styles.alertCategory}>{alerta.categoria}</span>
              </div>
              <div className={styles.alertMeta}>
                <span>{alerta.hora}</span> • <span>{alerta.estado}</span>
              </div>
            </FadeIn>
          ))}
        </FadeIn>
      </section>

      {/* CTA FINAL */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>Únete a la seguridad ciudadana</h2>
          <p className={styles.heroSubtitle}>Contribuye con reportes o explora más recursos.</p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryButton} href="/colaboracion">
              {t("home.footer.cta", "Explorar comunidad")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
