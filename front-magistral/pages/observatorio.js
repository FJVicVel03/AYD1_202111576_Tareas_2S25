import SectionHeader from '@/components/SectionHeader';
import FadeIn from '@/components/FadeIn';
import styles from '@/styles/Observatorio.module.css';
import { LineChart, BarChart, DonutChart, StackedBarChart, FunnelChart } from '@/components/Charts';

const filters = {
  periodo: ['Ultimos 7 dias', 'Ultimos 30 dias', '2025 (YTD)', 'Comparativo anual'],
  indicadores: ['Homicidios', 'Extorsiones', 'Violencia intrafamiliar', 'Robos'],
  enfoque: ['Juventud', 'Mujeres', 'Diversidad', 'Personas migrantes']
};

const tableros = [
  {
    title: 'Tendencia de homicidios por departamento',
    description:
      'Comparativo trimestral con promedio movil para identificar picos atipicos y activar respuestas preventivas.',
    insights: [
      'Alta Verapaz muestra reduccion de 12% respecto al trimestre anterior.',
      'Guatemala concentra 34% de los casos reportados a nivel nacional.',
      'Huehuetenango presenta un repunte asociado a fronteras y rutas migratorias.'
    ]
  },
  {
    title: 'Mapa de densidad de extorsiones',
    description: 'Visualizacion por zona urbana con niveles de riesgo, rutas de transporte y focos empresariales.',
    insights: [
      'Zona 6 de Mixco y zonas 18 y 21 capitalinas permanecen en alerta roja.',
      'Incremento de reportes ciudadanos via app en Villa Nueva (+22%).',
      'Correlacion detectada con corte de energia y horarios nocturnos.'
    ]
  },
  {
    title: 'Violencia contra mujeres',
    description: 'Indicadores enfocados en denuncias, medidas de proteccion y rutas de acompanamiento psicosocial.',
    insights: [
      'Escuintla supera la media nacional con 3.4 denuncias por cada 10k mujeres.',
      'Refugios aliados en Coban operan al 86% de su capacidad.',
      'Incremento sostenido en solicitudes de medidas de proteccion (+9%).'
    ]
  }
];

const reportHighlights = [
  { label: 'Casos georreferenciados', value: '5,164' },
  { label: 'Median time to response', value: '2.3 h' },
  { label: 'Instituciones coordinadas', value: '18' },
  { label: 'Alertas preventivas activas', value: '42' }
];

export default function ObservatorioPage() {
  return (
    <div className={styles.page}>
      <section className={styles.intro}>
        <FadeIn repeat>
          <SectionHeader
            eyebrow="Observatorio"
            title="Datos unificados para decisiones basadas en evidencia"
            description="Explora indicadores criticos de seguridad ciudadana, cruza variables socioeconomicas y descubre zonas de riesgo con analitica interactiva."
          />
        </FadeIn>
        <FadeIn repeat className={styles.filterPanel}>
          {Object.entries(filters).map(([label, items], i) => (
            <FadeIn repeat key={label} as="div" delay={80 * i} className={styles.filterGroup}>
              <strong>{label.toUpperCase()}</strong>
              <div className={styles.chips}>
                {items.map((item, j) => (
                  <FadeIn repeat key={item} as="span" delay={40 * j} className={styles.chip}>
                    {item}
                  </FadeIn>
                ))}
              </div>
            </FadeIn>
          ))}
        </FadeIn>
      </section>

      <section className={styles.boards}>
        {/* 1. Tendencia de homicidios */}
        <FadeIn repeat as="article" className={styles.boardCard}>
          <header>
            <h3>{tableros[0].title}</h3>
            <p>{tableros[0].description}</p>
          </header>
          <LineChart
            labels={["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]}
            series={[
              { label: 'Guatemala', values: [120, 110, 125, 118, 130, 128, 122, 116, 124, 129, 121, 117] },
              { label: 'Alta Verapaz', values: [44, 40, 38, 36, 34, 33, 31, 29, 30, 28, 27, 26] },
              { label: 'Huehuetenango', values: [35, 36, 38, 40, 43, 42, 41, 45, 47, 46, 44, 43] }
            ]}
            height={240}
          />
        <ul className={styles.insightsList}>
          {tableros[0].insights.map((insight, i) => (
            <FadeIn repeat as="li" key={insight} delay={80 * i} className={styles.insightItem}>
              {insight}
            </FadeIn>
          ))}
        </ul>
      </FadeIn>

        {/* 2. Densidad de extorsiones (por zonas/municipios) */}
        <FadeIn repeat as="article" className={styles.boardCard}>
          <header>
            <h3>{tableros[1].title}</h3>
            <p>{tableros[1].description}</p>
          </header>
          <BarChart
            data={[
              { label: 'Zona 18', value: 86 },
              { label: 'Zona 6 Mixco', value: 74 },
              { label: 'Zona 21', value: 65 },
              { label: 'Villa Nueva', value: 59 },
              { label: 'Centro', value: 42 }
            ]}
            height={240}
            color="#ef4444"
          />
        <ul className={styles.insightsList}>
          {tableros[1].insights.map((insight, i) => (
            <FadeIn repeat as="li" key={insight} delay={80 * i} className={styles.insightItem}>
              {insight}
            </FadeIn>
          ))}
        </ul>
      </FadeIn>

        {/* 3. Violencia contra mujeres (Embudo de atención) */}
        <FadeIn repeat as="article" className={styles.boardCard}>
          <header>
            <h3>{tableros[2].title}</h3>
            <p>{tableros[2].description}</p>
          </header>
          <FunnelChart
            steps={[
              { label: 'Denuncias registradas', value: 100, color: '#ef4444' },
              { label: 'Medidas de protección', value: 40, color: '#f59e0b' },
              { label: 'Acompañamiento psicosocial', value: 25, color: '#a855f7' },
            ]}
            height={240}
          />
        <ul className={styles.insightsList}>
            {tableros[2].insights.map((insight, i) => (
              <FadeIn repeat as="li" key={insight} delay={80 * i} className={styles.insightItem}>
                {insight}
              </FadeIn>
            ))}
          </ul>
        </FadeIn>
      </section>

      <section className={styles.reportCard}>
        <FadeIn repeat>
          <SectionHeader
            eyebrow="Reporte ejecutivo"
            title="Concentra la informacion clave para el gabinete de seguridad"
            description="Generacion automatica de reportes con narrativa, graficas y recomendaciones priorizadas."
          />
        </FadeIn>
        <div className={styles.reportHighlights}>
          {reportHighlights.map((h, i) => (
            <FadeIn repeat key={h.label} as="div" delay={90 * i} className={styles.highlight}>
              <span className={styles.highlightValue}>{h.value}</span>
              <span>{h.label}</span>
            </FadeIn>
          ))}
        </div>
      </section>

    </div>

  );
}
