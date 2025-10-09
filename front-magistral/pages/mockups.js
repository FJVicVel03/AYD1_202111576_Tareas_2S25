import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import SectionHeader from '@/components/SectionHeader';
import styles from '@/styles/Mockups.module.css';

const MOCKUPS = [
  { key: 'home-desktop', module: 'Inicio', orientation: 'desktop', src: '/mockups/home-desktop.svg', size: '1440x900' },
  { key: 'home-mobile', module: 'Inicio', orientation: 'mobile', src: '/mockups/home-mobile.svg', size: '420x880' },
  { key: 'observatorio-desktop', module: 'Observatorio', orientation: 'desktop', src: '/mockups/observatorio-desktop.svg', size: '1440x900' },
  { key: 'observatorio-mobile', module: 'Observatorio', orientation: 'mobile', src: '/mockups/observatorio-mobile.svg', size: '420x880' },
  { key: 'denuncias-desktop', module: 'Denuncias', orientation: 'desktop', src: '/mockups/denuncias-desktop.svg', size: '1440x900' },
  { key: 'denuncias-mobile', module: 'Denuncias', orientation: 'mobile', src: '/mockups/denuncias-mobile.svg', size: '420x880' },
  { key: 'colaboracion-desktop', module: 'Colaboracion', orientation: 'desktop', src: '/mockups/colaboracion-desktop.svg', size: '1440x900' },
  { key: 'colaboracion-mobile', module: 'Colaboracion', orientation: 'mobile', src: '/mockups/colaboracion-mobile.svg', size: '420x880' }
];

const ORIENTATION_FILTERS = [
  { id: 'all', label: 'Todo' },
  { id: 'desktop', label: 'Desktop' },
  { id: 'mobile', label: 'Mobile' }
];

export default function MockupsPage() {
  const router = useRouter();
  const base = router.basePath || '';
  const [activeMockup, setActiveMockup] = useState(null);
  const [orientationFilter, setOrientationFilter] = useState('all');

  const filteredMockups = useMemo(() => {
    if (orientationFilter === 'all') {
      return MOCKUPS;
    }
    return MOCKUPS.filter((item) => item.orientation === orientationFilter);
  }, [orientationFilter]);

  return (
    <div className={styles.page}>
      <SectionHeader
        eyebrow="Mockups"
        title="Galeria de pantallas"
        description="Versiones estaticas de las vistas principales. Descarga los SVG o reemplazalos con exportaciones desde tu herramienta de diseno."
        actions={
          <div className={styles.filterGroup}>
            {ORIENTATION_FILTERS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`${styles.filterButton} ${orientationFilter === option.id ? styles.filterButtonActive : ''}`}
                onClick={() => setOrientationFilter(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        }
      />

      <div className={styles.grid}>
        {filteredMockups.map((mockup) => (
          <article key={mockup.key} className={styles.card}>
            <button type="button" className={styles.thumbButton} onClick={() => setActiveMockup(mockup)}>
              {/* eslint-disable-next-line @next/next/no-img-element -- Requerimos <img> para cargar recursos locales SVG */}
              <img className={styles.thumb} src={`${base}${mockup.src}`} alt={`${mockup.module} ${mockup.orientation}`} />
            </button>
            <div className={styles.meta}>
              <div>
                <p className={styles.moduleLabel}>{mockup.module}</p>
                <p className={styles.metaSecondary}>
                  {mockup.orientation.toUpperCase()} · {mockup.size}
                </p>
              </div>
              <div className={styles.actions}>
                <a className={styles.secondaryButton} href={`${base}${mockup.src}`} download>
                  Descargar
                </a>
                <button className={styles.primaryButton} type="button" onClick={() => setActiveMockup(mockup)}>
                  Ver
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div
        className={`${styles.viewer} ${activeMockup ? styles.viewerOpen : ''}`}
        onClick={() => setActiveMockup(null)}
        role="presentation"
      >
        {activeMockup && (
          <div className={styles.viewerContent} onClick={(event) => event.stopPropagation()}>
            <header className={styles.viewerHeader}>
              <div>
                <p className={styles.moduleLabel}>{activeMockup.module}</p>
                <p className={styles.metaSecondary}>
                  {activeMockup.orientation.toUpperCase()} · {activeMockup.size}
                </p>
              </div>
              <button className={styles.viewerClose} type="button" onClick={() => setActiveMockup(null)}>
                Cerrar
              </button>
            </header>
            {/* eslint-disable-next-line @next/next/no-img-element -- Vista en vivo de SVG locales */}
            <img className={styles.viewerImg} src={`${base}${activeMockup.src}`} alt={`${activeMockup.module} ${activeMockup.orientation}`} />
            <a className={styles.viewerDownload} href={`${base}${activeMockup.src}`} download>
              Descargar SVG
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
