import { useMemo, useState } from 'react';
import SectionHeader from '@/components/SectionHeader';
import FadeIn from '@/components/FadeIn';
import styles from '@/styles/Profile.module.css';

const safeWordOptions = ['Amatista', 'Ruta 72', 'Cantera Azul', 'Oasis 15'];

const caseHistory = [
  {
    code: 'AX18-72Q',
    title: 'Extorsion comercio zona 18',
    summary: 'Serie de cobros ilegales a comercio familiar con amenazas explicitas.',
    status: 'Validacion prioritaria',
    risk: 'Alto',
    mode: 'Anonimo',
    tags: ['Extorsion', 'Zona 18', 'Audio limpio'],
    progress: 72,
    timeline: [
      { time: '08:15', detail: 'Denuncia recibida con evidencia multimedia y modo anonimo.' },
      { time: '08:48', detail: 'Forense digital limpio metadatos y genero hash de integridad.' },
      { time: '09:35', detail: 'Supervisor regional evaluo traslado seguro para la familia.' }
    ],
    approvals: [
      { role: 'Forense digital', approved: true },
      { role: 'Coordinacion territorial', approved: true },
      { role: 'Supervisor regional', approved: false }
    ],
    nextAction: 'Coordinar reunion virtual con equipo de proteccion y compartir copia para abogado confiable.'
  },
  {
    code: 'CM45-109',
    title: 'Acompanamiento psicosocial Villa Nueva',
    summary: 'Caso de violencia de genero con medidas de resguardo temporal para la persona denunciante.',
    status: 'Acompanamiento continuo',
    risk: 'Medio',
    mode: 'Perfil',
    tags: ['VBG', 'Ruta 1572', 'Refugio'],
    progress: 54,
    timeline: [
      { time: '14:02', detail: 'Se activo modo sigiloso y se asigno trabajadora social.' },
      { time: '14:37', detail: 'Se habilito refugio aliado y plan de seguridad personalizado.' },
      { time: '15:05', detail: 'Notificacion sin datos personales a municipalidad para monitoreo.' }
    ],
    approvals: [
      { role: 'Forense digital', approved: true },
      { role: 'Coordinacion territorial', approved: true },
      { role: 'Supervisor regional', approved: true }
    ],
    nextAction: 'Actualizar bitacora semanal y evaluar salida definitiva del territorio.'
  },
  {
    code: 'OB12-204',
    title: 'Observacion de patrulla sospechosa',
    summary: 'Alertas vecinales sobre presencia de supuesto patrullero en horarios no oficiales.',
    status: 'En verificacion comunitaria',
    risk: 'Medio',
    mode: 'Anonimo',
    tags: ['Observatorio', 'Geocerca', 'Comunidad'],
    progress: 38,
    timeline: [
      { time: '18:22', detail: 'Mapa de calor detecto incremento de reportes en la zona.' },
      { time: '18:40', detail: 'Se compartio alerta discreta con red de lideres comunitarios.' },
      { time: '19:05', detail: 'PNC confirmo patrulla no registrada y activo monitoreo especial.' }
    ],
    approvals: [
      { role: 'Forense digital', approved: false },
      { role: 'Coordinacion territorial', approved: true },
      { role: 'Supervisor regional', approved: false }
    ],
    nextAction: 'Recolectar placas adicionales y validar con plataforma de vehiculos oficiales.'
  }
];

const recognitionRuns = [
  {
    id: 'REC-144',
    caseCode: 'AX18-72Q',
    file: 'frame_2024-10-08.png',
    score: 91,
    decision: 'Escalar a supervisor',
    reviewer: 'L. Juarez',
    timestamp: '09:58',
    status: 'Aprobado'
  },
  {
    id: 'REC-139',
    caseCode: 'CM45-109',
    file: 'captura_chat_seguimiento.jpg',
    score: 78,
    decision: 'Agregar a bitacora VBG',
    reviewer: 'M. Garcia',
    timestamp: 'Ayer 21:14',
    status: 'En revision'
  },
  {
    id: 'REC-131',
    caseCode: 'OB12-204',
    file: 'patrulla_sospechosa.svg',
    score: 65,
    decision: 'Sin coincidencias relevantes',
    reviewer: 'Equipo comunitario',
    timestamp: 'Ayer 18:10',
    status: 'Cerrado'
  }
];

const toolCards = [
  {
    title: 'Bitacora de extorsion cifrada',
    description:
      'Registra cada llamada, monto y numero recibido. Se cifra automaticamente y puedes compartir extractos anonimos para investigacion.',
    actions: ['Generar registro', 'Exportar reporte anonimo']
  },
  {
    title: 'Modo sigiloso instantaneo',
    description:
      'Convierte la interfaz en una calculadora y activa atajos de salida rapida. Ideal para casos de violencia de genero.',
    actions: ['Activar con atajo', 'Configurar pantalla espejo']
  },
  {
    title: 'Guardian digital 24/7',
    description:
      'Analiza palabras clave y patrones de riesgo en tus denuncias para sugerir rutas de proteccion y materiales personalizados.',
    actions: ['Revisar recomendaciones', 'Solicitar acompañamiento']
  }
];

const supportContacts = [
  {
    name: 'Red comunitaria El Carmen',
    channel: 'Chat seguro + geocerca',
    availability: '24/7',
    type: 'Comunitario'
  },
  {
    name: 'Mesa de proteccion mujeres 1572',
    channel: 'Videollamada y refugio',
    availability: 'Bajo demanda',
    type: 'Institucional'
  },
  {
    name: 'Crime Stoppers 1561',
    channel: 'Linea cifrada y WhatsApp',
    availability: '24/7',
    type: 'Aliado internacional'
  }
];

export default function ProfilePage() {
  const [anonymousMode, setAnonymousMode] = useState(true);
  const [aliasIndex, setAliasIndex] = useState(0);
  const [selectedCaseCode, setSelectedCaseCode] = useState(caseHistory[0].code);

  const selectedCase = useMemo(
    () => caseHistory.find((item) => item.code === selectedCaseCode) ?? caseHistory[0],
    [selectedCaseCode]
  );

  const totalReports = caseHistory.length;
  const resolvedReports = caseHistory.filter((item) => item.status.toLowerCase().includes('cerrado')).length;
  const activeReports = totalReports - resolvedReports;
  const anonymousReports = caseHistory.filter((item) => item.mode === 'Anonimo').length;
  const safeWord = safeWordOptions[aliasIndex % safeWordOptions.length];

  const rotateAlias = () => setAliasIndex((prev) => prev + 1);

  return (
    <div className={styles.page}>
      <FadeIn repeat>
        <SectionHeader
          eyebrow="Perfil"
          title="Panel personal y control de identidad"
          description="Gestiona tus denuncias, alterna entre anonimato y perfil verificado, y haz seguimiento a la cadena de aprobacion sin perder el control de tus datos."
        />
      </FadeIn>

      <section className={styles.summaryPanel}>
        <FadeIn repeat as="div" className={styles.identityCard}>
          <div>
            <h2>Identidad dinamica</h2>
            <p>
              Alterna entre perfil verificado y modo anonimo. Toda tu actividad se cifra y puedes borrar rastros locales con un
              clic.
            </p>
          </div>
          <div className={styles.toggleRow}>
            <span>Modo anonimo</span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={anonymousMode}
                onChange={(event) => setAnonymousMode(event.target.checked)}
              />
              <span className={styles.slider} />
            </label>
          </div>
          <div className={styles.safeWordBox}>
            <div>
              <span>Palabra clave vigente</span>
              <strong>{safeWord}</strong>
            </div>
            <button type="button" onClick={rotateAlias} className={styles.aliasButton}>
              Generar nueva
            </button>
          </div>
          <ul className={styles.identityList}>
            {[
              'Token OTP y llavero fisico disponibles para validar acceso de superiores.',
              'Historial de ingresos firmado digitalmente y exportable en PDF anonimo.',
              'Al desactivar el modo anonimo puedes compartir tu identidad solo con quien elijas.'
            ].map((txt, i) => (
              <FadeIn repeat as="li" key={i} delay={60 * i}>
                {txt}
              </FadeIn>
            ))}
          </ul>
        </FadeIn>

        <FadeIn repeat as="div" className={styles.statsCard}>
          <h3>Resumen rapido</h3>
          <div className={styles.statsGrid}>
            {[
              { label: 'Total de denuncias', val: totalReports },
              { label: 'Anonimas activas', val: anonymousReports },
              { label: 'Casos resueltos', val: resolvedReports },
              { label: 'En curso', val: activeReports },
              { label: 'Reconocimientos IA', val: recognitionRuns.length }
            ].map((s, i) => (
              <FadeIn repeat as="div" key={s.label} delay={70 * i}>
                <span>{s.label}</span>
                <strong>{s.val}</strong>
              </FadeIn>
            ))}
          </div>
          <p>
            Tus datos se almacenan en un vault cifrado. Puedes descargar respaldos protegidos o eliminarlos definitivamente en
            cualquier momento.
          </p>
          <div className={styles.quickActions}>
            <button type="button">Reportar nuevo incidente</button>
            <button type="button">Descargar constancia</button>
          </div>
        </FadeIn>
      </section>

      <section className={styles.caseSection}>
        <FadeIn repeat as="aside" className={styles.caseList}>
          <div className={styles.caseListHeader}>
            <h3>Tus casos</h3>
            <span>Selecciona para ver detalles y aprobaciones.</span>
          </div>
          <ul>
            {caseHistory.map((item, i) => (
              <FadeIn repeat as="li" key={item.code} delay={70 * i}>
                <button
                  type="button"
                  className={`${styles.caseButton} ${item.code === selectedCaseCode ? styles.caseButtonActive : ''}`}
                  onClick={() => setSelectedCaseCode(item.code)}
                >
                  <div className={styles.caseButtonHead}>
                    <strong>{item.code}</strong>
                    <span className={styles.caseStatus}>{item.status}</span>
                  </div>
                  <p>{item.title}</p>
                  <div className={styles.caseTags}>
                    {item.tags.map((tag, j) => (
                      <FadeIn repeat as="span" key={tag} delay={40 * j}>
                        {tag}
                      </FadeIn>
                    ))}
                  </div>
                </button>
              </FadeIn>
            ))}
          </ul>
        </FadeIn>

        <FadeIn repeat as="article" className={styles.caseDetail}>
          <header className={styles.caseDetailHeader}>
            <div>
              <h3>{selectedCase.title}</h3>
              <p>{selectedCase.summary}</p>
            </div>
            <div className={styles.progressWrap}>
              <span>Avance</span>
              <div className={styles.progressBar}>
                <span style={{ width: `${selectedCase.progress}%` }} />
              </div>
              <strong>{selectedCase.progress}%</strong>
            </div>
          </header>
          <div className={styles.caseMeta}>
            <span className={`${styles.riskPill} ${styles[`risk${selectedCase.risk}`]}`}>Riesgo {selectedCase.risk}</span>
            <span className={styles.modePill}>Modo {selectedCase.mode}</span>
          </div>
          <div className={styles.timeline}>
            <h4>Linea de tiempo</h4>
            <ul>
              {selectedCase.timeline.map((milestone, index) => (
                <FadeIn repeat as="li" key={`${selectedCase.code}-${index}`} delay={70 * index}>
                  <span>{milestone.time}</span>
                  <p>{milestone.detail}</p>
                </FadeIn>
              ))}
            </ul>
          </div>
          <div className={styles.approvals}>
            <h4>Aprobacion superior</h4>
            <ul>
              {selectedCase.approvals.map((approval, i) => (
                <FadeIn
                  repeat
                  as="li"
                  key={approval.role}
                  delay={70 * i}
                  className={approval.approved ? styles.approvalDone : styles.approvalPending}
                >
                  <strong>{approval.role}</strong>
                  <span>{approval.approved ? 'Firmado y auditado' : 'Pendiente de firma'}</span>
                </FadeIn>
              ))}
            </ul>
          </div>
          <div className={styles.nextAction}>
            <h4>Proxima accion</h4>
            <p>{selectedCase.nextAction}</p>
          </div>
        </FadeIn>
      </section>

      <section className={styles.toolsSection}>
        {toolCards.map((tool, i) => (
          <FadeIn repeat as="article" key={tool.title} delay={90 * i} className={styles.toolCard}>
            <h3>{tool.title}</h3>
            <p>{tool.description}</p>
            <div className={styles.toolActions}>
              {tool.actions.map((action, j) => (
                <FadeIn repeat as="button" key={action} type="button" delay={50 * j}>
                  {action}
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        ))}
      </section>

      <section className={styles.auditSection}>
        <FadeIn repeat className={styles.auditHeader}>
          <h3>Historial de reconocimiento y aprobaciones</h3>
          <p>Cada coincidencia registra hash, firma del revisor y caducidad del enlace compartido.</p>
        </FadeIn>
        <ul className={styles.auditList}>
          {recognitionRuns.map((item, i) => (
            <FadeIn repeat as="li" key={item.id} delay={80 * i}>
              <div className={styles.auditInfo}>
                <strong>{item.id}</strong>
                <span>Caso {item.caseCode} · {item.file}</span>
                <span>{item.decision}</span>
              </div>
              <div className={styles.auditMeta}>
                <span className={styles.auditScore}>{item.score}%</span>
                <span>{item.reviewer}</span>
                <span>{item.timestamp}</span>
                <span className={`${styles.auditStatus} ${styles[`status${item.status.replace(/\s/g, '')}`]}`}>
                  {item.status}
                </span>
              </div>
            </FadeIn>
          ))}
        </ul>
      </section>

      <section className={styles.supportSection}>
        <FadeIn repeat>
          <h3>Red de apoyo directa</h3>
        </FadeIn>
        <div className={styles.supportGrid}>
          {supportContacts.map((contact, i) => (
            <FadeIn repeat as="article" key={contact.name} delay={90 * i} className={styles.supportCard}>
              <h4>{contact.name}</h4>
              <p>{contact.channel}</p>
              <div className={styles.supportMeta}>
                <span>{contact.availability}</span>
                <span>{contact.type}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
