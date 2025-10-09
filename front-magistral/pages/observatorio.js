import SectionHeader from '@/components/SectionHeader';
import styles from '@/styles/Observatorio.module.css';

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
        <div>
          <SectionHeader
            eyebrow="Observatorio"
            title="Datos unificados para decisiones basadas en evidencia"
            description="Explora indicadores criticos de seguridad ciudadana, cruza variables socioeconomicas y descubre zonas de riesgo con analitica interactiva."
          />
        </div>
        <div className={styles.filterPanel}>
          {Object.entries(filters).map(([label, items]) => (
            <div key={label} className={styles.filterGroup}>
              <strong>{label.toUpperCase()}</strong>
              <div className={styles.chips}>
                {items.map((item) => (
                  <span key={item} className={styles.chip}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.boards}>
        {tableros.map((tablero) => (
          <article key={tablero.title} className={styles.boardCard}>
            <header>
              <h3>{tablero.title}</h3>
              <p>{tablero.description}</p>
            </header>
            <div className={styles.chartPlaceholder}>Grafica interactiva</div>
            <ul className={styles.insightsList}>
              {tablero.insights.map((insight) => (
                <li key={insight} className={styles.insightItem}>
                  {insight}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className={styles.reportCard}>
        <SectionHeader
          eyebrow="Reporte ejecutivo"
          title="Concentra la informacion clave para el gabinete de seguridad"
          description="Generacion automatica de reportes con narrativa, graficas y recomendaciones priorizadas."
        />
        <div className={styles.reportHighlights}>
          {reportHighlights.map((highlight) => (
            <div key={highlight.label} className={styles.highlight}>
              <span className={styles.highlightValue}>{highlight.value}</span>
              <span>{highlight.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
