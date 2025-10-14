import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';
import FadeIn from '@components/FadeIn';
import home from '@/styles/Home.module.css';
import styles from '@/styles/Notificaciones.module.css';

export default function NotificacionesPage() {
  return (
    <div className={home.page}>
      <section className={styles.wrap}>
        <div className={styles.banner}>
          <SectionHeader
            eyebrow="Alertas y avisos"
            title="Demostración de notificaciones"
            description="Así se verían las notificaciones en la app para vecinos y para personas denunciantes."
          />
        </div>

        <FadeIn repeat as="section" className={styles.grid}>
          {/* Vecindario: botón de emergencia */}
          <article className={styles.card}>
            <header className={styles.cardHeader}>
              <h3>Alerta a vecinos</h3>
              <span className={styles.pill}>Tiempo real</span>
            </header>
            <div className={styles.notice}>
              <div className={styles.noticeIcon} aria-hidden>🚨</div>
              <div className={styles.noticeBody}>
                <strong>Emergencia</strong>
                <p>
                  Persona en peligro cerca de tu zona. Presiona esta notificación para abrir el mapa y ver su ubicación en tiempo real.
                </p>
                <div className={styles.actions}>
                  <Link className={styles.primary} href="/mapa/">Abrir mapa seguro</Link>
                </div>
              </div>
            </div>
            <footer className={styles.meta}>Hace 2 min • Z18 Guatemala</footer>
          </article>

          {/* Estado de denuncia */}
          <article className={styles.card}>
            <header className={styles.cardHeader}>
              <h3>Seguimiento de denuncia</h3>
              <span className={styles.pillAlt}>Avance</span>
            </header>
            <div className={styles.notice}>
              <div className={styles.noticeIcon} aria-hidden>✅</div>
              <div className={styles.noticeBody}>
                <strong>Tu denuncia pasó el segundo filtro</strong>
                <p>
                  Nuestro equipo la está investigando. Recibirás actualizaciones y podrás ver el estado en tu panel.
                </p>
                <div className={styles.actions}>
                  <Link className={styles.primary} href="/perfil/">Ver estado</Link>
                  <button type="button" className={styles.secondary}>Silenciar por 24h</button>
                </div>
              </div>
            </div>
            <footer className={styles.meta}>Hace 1 h • Caso SG-AB1C-99</footer>
          </article>
        </FadeIn>
      </section>
    </div>
  );
}
