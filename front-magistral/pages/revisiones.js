import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';
import FadeIn from '@components/FadeIn';
import home from '@/styles/Home.module.css';
import styles from '@/styles/Moderacion.module.css';

const MOCK_REPORTS = [
  {
    id: 'AX18-72Q',
    zona: 'Guatemala - Zona 18',
    categoria: 'Robos a transporte',
    riesgo: 'Alto',
    hora: 'Hace 3 h',
    descripcion: 'Asalto en bus ruta 203, reportado con video y placa parcial.',
    evidencias: 3
  },
  {
    id: 'CM45-109',
    zona: 'Villa Nueva - Bárcena',
    categoria: 'Violencia juvenil',
    riesgo: 'Medio',
    hora: 'Hace 1 h',
    descripcion: 'Pandillas grafiteando y extorsión en comercios cercanos.',
    evidencias: 2
  },
  {
    id: 'SR12-507',
    zona: 'Mixco - Zona 6',
    categoria: 'Extorsiones',
    riesgo: 'Alto',
    hora: 'Hace 5 h',
    descripcion: 'Llamadas intimidatorias a ruta de transporte escolar.',
    evidencias: 1
  }
];

const STORAGE_KEY = 'revisiones-estado-v1';

export default function RevisionesPage() {
  const [items, setItems] = useState(MOCK_REPORTS);
  const [decisiones, setDecisiones] = useState({}); // { id: 'aceptado'|'rechazado' }

  // Cargar decisiones previas (persistencia ligera para demo estática)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDecisiones(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(decisiones));
    } catch {}
  }, [decisiones]);

  const pendientes = useMemo(
    () => items.filter((it) => !decisiones[it.id]),
    [items, decisiones]
  );
  const procesadas = useMemo(
    () => items.filter((it) => !!decisiones[it.id]),
    [items, decisiones]
  );

  const decidir = (id, valor) => {
    setDecisiones((prev) => ({ ...prev, [id]: valor }));
  };
  const deshacer = (id) => {
    setDecisiones((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <div className={home.page}>
      <section className={styles.wrap}>
        <div className={styles.banner}>
          <SectionHeader
            eyebrow="Moderación"
            title="Revisión de denuncias"
            description="Aprueba o rechaza reportes enviados por la comunidad. Esta vista usa datos de ejemplo."
          />
        </div>

        {/* Pendientes */}
        <FadeIn repeat as="section" className={styles.card}>
          <header className={styles.cardHeader}>
            <h2>Pendientes de revisión</h2>
            <span className={styles.badge}>{pendientes.length}</span>
          </header>
          <div className={styles.list}>
            {pendientes.length === 0 && (
              <div className={styles.empty}>No hay reportes pendientes en este momento.</div>
            )}
            {pendientes.map((r, i) => (
              <FadeIn repeat as="article" key={r.id} delay={60 * i} className={styles.item}>
                <div className={styles.itemHead}>
                  <div className={styles.itemMeta}>
                    <strong className={styles.itemZona}>{r.zona}</strong>
                    <span className={styles.itemCategoria}>{r.categoria}</span>
                  </div>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemChip} data-risk={r.riesgo.toLowerCase()}>
                      Riesgo: {r.riesgo}
                    </span>
                    <span className={styles.itemHora}>{r.hora}</span>
                  </div>
                </div>
                <p className={styles.itemDesc}>{r.descripcion}</p>
                <div className={styles.itemFoot}>
                  <span className={styles.itemEvid}>Evidencias: {r.evidencias}</span>
                  <div className={styles.actions}>
                    <button type="button" className={styles.reject} onClick={() => decidir(r.id, 'rechazado')}>
                      Rechazar
                    </button>
                    <button type="button" className={styles.accept} onClick={() => decidir(r.id, 'aceptado')}>
                      Aceptar
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>

        {/* Procesadas */}
        <FadeIn repeat as="section" className={styles.card}>
          <header className={styles.cardHeader}>
            <h2>Procesadas</h2>
            <span className={styles.badge}>{procesadas.length}</span>
          </header>
          <div className={styles.list}>
            {procesadas.length === 0 && (
              <div className={styles.empty}>Aún no hay decisiones registradas.</div>
            )}
            {procesadas.map((r, i) => (
              <FadeIn repeat as="article" key={r.id} delay={60 * i} className={`${styles.item} ${styles.itemDisabled}`}>
                <div className={styles.itemHead}>
                  <div className={styles.itemMeta}>
                    <strong className={styles.itemZona}>{r.zona}</strong>
                    <span className={styles.itemCategoria}>{r.categoria}</span>
                  </div>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemChip} data-risk={r.riesgo.toLowerCase()}>
                      Riesgo: {r.riesgo}
                    </span>
                    <span className={styles.itemHora}>{r.hora}</span>
                  </div>
                </div>
                <p className={styles.itemDesc}>{r.descripcion}</p>
                <div className={styles.itemFoot}>
                  <span className={styles.itemEvid}>Evidencias: {r.evidencias}</span>
                  <div className={styles.proceso}>
                    <span className={styles.estado} data-estado={decisiones[r.id]}> {decisiones[r.id] === 'aceptado' ? 'Aceptada' : 'Rechazada'} </span>
                    <button type="button" className={styles.undo} onClick={() => deshacer(r.id)}>
                      Deshacer
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>

        <div className={styles.footerNav}>
          <Link className={styles.link} href="/denuncias/">Ir a Denuncias</Link>
          <Link className={styles.link} href="/mapa/">Ver Mapa Seguro</Link>
        </div>
      </section>
    </div>
  );
}
