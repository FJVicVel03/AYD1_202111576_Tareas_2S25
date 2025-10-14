import dynamic from 'next/dynamic';
import SectionHeader from '@/components/SectionHeader';
import styles from '@/styles/Home.module.css';

const MockMap = dynamic(()=>import('@/components/MockMap'),{ ssr:false });

const mapLegend = [
  { label: 'Muy alta incidencia', color: '#ff5f6d' },
  { label: 'Alta incidencia', color: '#ff9966' },
  { label: 'Media', color: '#ffd56f' },
  { label: 'Baja', color: '#8bd46e' },
  { label: 'Zona de riesgo', color: '#b91c1c' }
];

export default function MapaSeguro(){
  return (
    <div className={styles.mapViewport}>
      <section className={styles.mapShell}>
        <SectionHeader
          eyebrow="Visualización territorial"
          title="Mapa seguro"
          description="Consulta el mapa de incidencia, rutas y zonas de riesgo."
        />
        <div className={styles.mapCanvas}>
          <MockMap className={styles.mapCanvas} />
          <div className={styles.mapLegend}>
            {mapLegend.map(legend => (
              <div key={legend.label} className={styles.legendItem}>
                <span className={styles.legendSwatch} style={{ background: legend.color }} />
                <span>{legend.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
