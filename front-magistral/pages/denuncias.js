import SectionHeader from '@/components/SectionHeader';
import styles from '@/styles/Denuncias.module.css';

const requisitos = [
  'Datos basicos de la persona denunciante o representante.',
  'Descripcion detallada del incidente (lugar, fecha y hora).',
  'Evidencias disponibles: fotografias, videos, documentos, contactos.',
  'Seleccion de acompanamiento requerido: juridico, psicosocial o de proteccion.'
];

const pasos = [
  {
    title: 'Registro seguro',
    description:
      'Formulario guiado con lenguaje sencillo, autoguardado y soporte en tiempo real via chat. Permite denunciar de forma anonima o identificada.'
  },
  {
    title: 'Validacion y clasificacion',
    description:
      'Equipo especializado revisa la informacion, clasifica el tipo de delito y deriva a las instituciones responsables con prioridad definida.'
  },
  {
    title: 'Seguimiento transparente',
    description:
      'Panel de estado muestra cada etapa del proceso, tiempos de respuesta y documentos emitidos. Se habilitan notificaciones SMS y correo.'
  }
];

const canales = [
  { label: 'Emergencia inmediata - 110', meta: 'Coordinacion con PNC y sistema de camaras municipales.' },
  { label: 'Linea antiextorsiones - 1574', meta: 'Atencion especializada y seguimiento conjunto con MP.' },
  { label: 'Ruta mujeres - 1572', meta: 'Acompanamiento integral con OJ, MP y Secretaria contra la Violencia Sexual.' },
  { label: 'App SeguridadGT', meta: 'Reporte georreferenciado con evidencia multimedia y seguimiento digital.' }
];

export default function DenunciasPage() {
  return (
    <div className={styles.page}>
      <SectionHeader
        eyebrow="Denuncias"
        title="Ruta digital para reportar incidentes y activar proteccion"
        description="Diseno de experiencia centrada en la persona denunciante, con orientacion clara, accesible y acompanamiento institucional desde el primer contacto."
      />

      <section className={styles.grid}>
        <article className={styles.card}>
          <h3 className={styles.cardTitle}>Que necesito para iniciar?</h3>
          <p className={styles.description}>
            Puedes comenzar una denuncia aunque la informacion este incompleta. La plataforma sugiere que datos agregar y
            permite adjuntar testimonios o evidencias desde tu dispositivo.
          </p>
          <ul className={styles.checklist}>
            {requisitos.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className={`${styles.card} ${styles.cardDark}`}>
          <h3 className={styles.cardTitle}>Protocolos y confidencialidad</h3>
          <p className={styles.description}>
            Toda la informacion se cifra y se comparte unicamente con las instituciones autorizadas. Los datos sensibles se
            resguardan con medidas adicionales y se notifica cada acceso realizado.
          </p>
          <div className={styles.channels}>
            {canales.map((canal) => (
              <div key={canal.label} className={styles.channelCard}>
                <span className={styles.channelLabel}>{canal.label}</span>
                <span className={styles.channelMeta}>{canal.meta}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className={styles.card}>
        <SectionHeader
          eyebrow="Proceso acompanante"
          title="Tres pasos claros para recibir ayuda oportuna"
          description="Visualizacion simplificada para talleres y capacitaciones en comunidades."
        />
        <ul className={styles.stepper}>
          {pasos.map((paso, index) => (
            <li key={paso.title} className={styles.step}>
              <div className={styles.stepHeader}>
                <span className={styles.stepBadge}>{index + 1}</span>
                <span className={styles.stepTitle}>{paso.title}</span>
              </div>
              <p className={styles.stepDescription}>{paso.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.ctaBanner}>
        <SectionHeader
          eyebrow="Acompanamiento"
          title="Red de apoyo disponible 24/7"
          description="Una persona gestora te acompana durante todo el proceso, coordina traslados si son necesarios y asegura la proteccion de tus datos."
          actions={
            <div className={styles.ctaActions}>
              <a className={styles.ctaButton} href="#!">
                Agendar videollamada
              </a>
              <a className={`${styles.ctaButton} ${styles.ctaGhost}`} href="#!">
                Descargar materiales
              </a>
            </div>
          }
        />
      </section>
    </div>
  );
}
