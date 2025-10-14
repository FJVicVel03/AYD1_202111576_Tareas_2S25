import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import SectionHeader from "@/components/SectionHeader";
import styles from "@/styles/Home.module.css";
import FadeIn from "@components/FadeIn";

// Datos de alertas
const alertas = [
  { zona: "Mixco - Zona 6", categoria: "Extorsiones", hora: "Hace 2 h", estado: "Coordinación con MP" },
  { zona: "Villa Nueva - Bárcena", categoria: "Violencia juvenil", hora: "Hace 4 h", estado: "Ruta de acompañamiento activada" },
  { zona: "Guatemala - Zona 18", categoria: "Robos a transporte", hora: "Hace 6 h", estado: "PNC en patrullaje preventivo" }
];


export default function HomePage() {
  const { t } = useLanguage();
  const [pressing, setPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(0);
  const LONG_MS = 3000;

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

  useEffect(()=>{
    if(!pressing){ setProgress(0); if(rafRef.current) cancelAnimationFrame(rafRef.current); return; }
    startRef.current = performance.now();
    const step = (ts)=>{
      const p = Math.min(1, (ts - startRef.current)/LONG_MS);
      setProgress(p);
      if(p<1){ rafRef.current = requestAnimationFrame(step); } else { alert('🚨 Alerta enviada (demo)'); setPressing(false); setProgress(0); }
    };
    rafRef.current = requestAnimationFrame(step);
    return ()=>{ if(rafRef.current) cancelAnimationFrame(rafRef.current); };
  },[pressing]);

  const cancelPress = ()=> setPressing(false);

  return (
    <div className={styles.page}>
      {/* Emergencia: Botón grande full-width con sirena */}
      <section className={styles.emerSection}>
        <div className={styles.emerHeader}>
          <h1 className={styles.emerTitle}>Emergencia inmediata</h1>
          <p className={styles.emerDesc}>{heroContent.description}</p>
        </div>
        <div className={styles.emerWrap}>
          <button
            className={styles.emerButton}
            onPointerDown={()=>setPressing(true)}
            onPointerUp={cancelPress}
            onPointerLeave={cancelPress}
            onContextMenu={(e)=>e.preventDefault()}
            aria-label="Botón de emergencia, mantener presionado 3 segundos"
          >
            <span className={styles.siren} aria-hidden>🚨</span> Emergencia
            {pressing && <span className={styles.emerProgress} style={{'--p':progress}} aria-hidden />}
          </button>
          {pressing && (
            <div className={styles.emerFeedback} role="status" aria-live="assertive">
              Enviando en {Math.ceil((1-progress)*3)}…
              <button className={styles.emerCancel} onClick={cancelPress}>Cancelar</button>
            </div>
          )}
        </div>
        <p className={styles.emerHelp}>
          Presione por 3 segundos para enviar señales de alerta, compartir su ubicación en tiempo real con vecinos y autoridades, y activar protocolos de ayuda.
        </p>
      </section>

      {/* CTA: Tarjeta Mapa Seguro */}
      <section className={styles.ctaLite}>
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaCardTitle}><span className={styles.ctaIcon}>📍</span> ¿Quieres navegar por la ciudad de forma segura?</h2>
          <p className={styles.ctaCardText}>Prueba Mapa Seguro para visualizar rutas y evitar zonas de riesgo.</p>
          <div className={styles.ctaCardActions}>
            <Link className={styles.primaryButton} href="/mapa/">Probar Mapa Seguro</Link>
          </div>
        </div>
      </section>

      {/* ALERTAS RECIENTES: full width */}
      <section>
        <FadeIn repeat className={`${styles.alertsCard} ${styles.alertsFull}`}>
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
          {/* Hero informativo clásico */}
      <section className={styles.heroFootnote}>
        <FadeIn className={styles.heroContent}>
          <p className={styles.heroSubtitle}>{heroContent.subtitle}</p>
          <h1 className={styles.heroTitle}>{heroContent.title}</h1>
          <p className={styles.heroSubtitle}>{heroContent.description}</p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryButton} href="/observatorio/">
              {heroContent.primaryCta}
            </Link>
            <Link className={styles.secondaryButton} href="/colaboracion/">
              {heroContent.secondaryCta}
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>

    
  );
}
