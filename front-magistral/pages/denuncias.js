import { useEffect, useMemo, useRef, useState } from 'react';
import SectionHeader from '@/components/SectionHeader';
import styles from '@/styles/Denuncias.module.css';

const requisitos = [
  'Datos basicos de la persona denunciante o representante.',
  'Descripcion detallada del incidente (lugar, fecha y hora).',
  'Evidencias disponibles: fotografias, videos, documentos, contactos.',
  'Seleccion de acompanamiento requerido: juridico, psicosocial o de proteccion.'
];

const anonimatoPrincipios = [
  {
    title: 'Anonimato activo por defecto',
    detail:
      'No se solicita ningun dato identificable a menos que la persona lo habilite. Cada sesion se ejecuta en un contenedor seguro y se purga automaticamente tras 15 minutos de inactividad.'
  },
  {
    title: 'Cifrado doble y limpieza de metadatos',
    detail:
      'Los archivos adjuntos eliminan de forma automatica datos EXIF y se cifran con claves efimeras. Los servidores registran accesos con trazabilidad independiente.'
  },
  {
    title: 'Modo sigiloso y proteccion inmediata',
    detail:
      'Un panel rapido permite bloquear pantalla, cambiar a un sitio neutro y activar contactos de confianza sin salir del flujo principal.'
  }
];

const seguridadRapida = [
  'Abre la plataforma en una ventana privada e introduce un PIN de cierre rapido para dispositivos compartidos.',
  'Define dos contactos de emergencia. Si detectamos riesgo alto, enviamos un enlace de verificacion sin exponer tu nombre.',
  'Utiliza el boton "Salida rapida" del encabezado para redirigirte a un sitio neutro si percibes peligro.'
];

const seguimientoCasos = {
  'AX18-72Q': {
    status: 'Validacion prioritaria',
    risk: 'Alto',
    lastUpdate: 'Actualizado hace 3 horas',
    nextStep: 'Unidad de Proteccion Comunitaria coordina refugio temporal.',
    timeline: [
      '08:15 - Registro anonimo recibido con evidencia multimedia.',
      '08:48 - Equipo forense digital limpio metadatos y valido documentos.',
      '09:35 - Se notifico a fiscalia especial y se solicito escolta preventiva.'
    ]
  },
  'CM45-109': {
    status: 'Acompanamiento psicosocial en curso',
    risk: 'Medio',
    lastUpdate: 'Actualizado hace 1 hora',
    nextStep: 'Llamada de seguimiento para actualizar plan de seguridad.',
    timeline: [
      '14:02 - Denuncia comunitaria integrada al expediente colectivo.',
      '14:37 - Se asigno trabajadora social con presencia en territorio.',
      '15:05 - Se compartio nota preventiva con autoridades municipales.'
    ]
  }
};

const incidentTypes = [
  { value: 'asalto', label: 'Asalto o robo violento' },
  { value: 'extorsion', label: 'Extorsion o cobro ilegal' },
  { value: 'violencia-genero', label: 'Violencia contra mujeres o ninas' },
  { value: 'amenaza', label: 'Amenazas o intimidaciones' },
  { value: 'corrupcion', label: 'Abuso de autoridad o corrupcion' }
];

const incidentLocations = [
  { value: 'guatemala-zona-18', label: 'Guatemala - Zona 18 (Metropolitano)' },
  { value: 'mixco-zona-6', label: 'Mixco - Zona 6 (Belencito)' },
  { value: 'villa-nueva-barcena', label: 'Villa Nueva - Barcena (Sur)' },
  { value: 'quiche-santa-cruz', label: 'Santa Cruz del Quiche (Occidente)' },
  { value: 'peten-flores', label: 'Flores, Peten (Norte)' }
];

const supportNeeds = [
  { value: 'proteccion', label: 'Proteccion y traslado inmediato' },
  { value: 'juridico', label: 'Asesoria juridica' },
  { value: 'psicosocial', label: 'Apoyo psicosocial' },
  { value: 'comunitario', label: 'Acompanamiento comunitario' }
];

const recognitionCatalog = [
  {
    id: 'match-01',
    alias: 'Perfil 2023-EXT-096',
    confidence: 0.91,
    context: 'Coincidencia con red de extorsion Barrio San Rafael',
    lastSeen: 'Reporte verificado - Zona 5, jun 2024'
  },
  {
    id: 'match-02',
    alias: 'Registro 2024-VBG-044',
    confidence: 0.82,
    context: 'Antecedente de violencia reiterada documentado por ONG aliada',
    lastSeen: 'Ruta de apoyo - Villa Nueva, ago 2024'
  },
  {
    id: 'match-03',
    alias: 'Referencia comunitaria 18-Alpha',
    confidence: 0.73,
    context: 'Coincidencia parcial con base comunitaria de lideres vecinales',
    lastSeen: 'Observatorio urbano - Mixco, may 2024'
  }
];

const supervisorPipeline = [
  {
    id: 'forense',
    label: 'Forense digital',
    status: 'completado',
    detail: 'Metadatos eliminados y evidencia cifrada en vault seguro.',
    timestamp: '09:32'
  },
  {
    id: 'territorial',
    label: 'Coordinacion territorial',
    status: 'en-progreso',
    detail: 'Validando relato con red comunitaria y mapa de calor.',
    timestamp: '09:58'
  },
  {
    id: 'supervision',
    label: 'Supervisor regional',
    status: 'pendiente',
    detail: 'Autorizacion de medidas de proteccion y enlace con PNC.',
    timestamp: '10:20 estimado'
  }
];

const profileSnapshot = {
  name: 'Camila Ortega',
  alias: 'Gestora comunitaria',
  totalReports: 9,
  resolved: 6,
  active: 3,
  trustedLevel: 'Verificacion biometrica activa',
  lastCode: 'AX18-72Q'
};

const safeWords = ['Amatista', 'Ruta 72', 'Luna Verde', 'Oasis 15'];

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) {
    return '';
  }
  if (bytes === 0) {
    return '0 B';
  }
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const quotient = bytes / 1024 ** exponent;
  return `${quotient.toFixed(1)} ${units[exponent]}`;
}

function generateTrackingCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const pick = (length) =>
    Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
  return `SG-${pick(2)}${pick(1)}-${pick(2)}${pick(1)}`;
}

const respuestaCrisis = [
  {
    title: 'Boton de panico inteligente',
    bullets: [
      'Envio simultaneo de alerta geolocalizada a red de confianza definida por la persona usuaria.',
      'Activa modo silencioso: oculta la interfaz y habilita grabacion discreta de audio para evidencia.',
      'Permite cancelar la alerta con una combinacion secreta para evitar represalias.'
    ]
  },
  {
    title: 'Guardian digital 24/7',
    bullets: [
      'Motor de riesgo que analiza palabras clave y patrones para sugerir rutas de proteccion inmediatas.',
      'Integra chat seguro con especialistas y acceso directo a refugios y asesorias juridicas.',
      'Recomienda material educativo personalizado segun el tipo de violencia detectada.'
    ]
  }
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
  const [reportMode, setReportMode] = useState('anonimo');
  const [credentials, setCredentials] = useState({ email: '', password: '', otp: '' });
  const [incidentForm, setIncidentForm] = useState({
    type: incidentTypes[0].value,
    location: incidentLocations[0].value,
    support: supportNeeds[0].value,
    datetime: '',
    description: ''
  });
  const [evidenceList, setEvidenceList] = useState([]);
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [suspectPreview, setSuspectPreview] = useState(null);
  const [recognitionState, setRecognitionState] = useState('idle');
  const [recognitionMatches, setRecognitionMatches] = useState([]);
  const [suspectInputKey, setSuspectInputKey] = useState(0);
  const recognitionTimerRef = useRef(null);
  const suspectPreviewUrlRef = useRef(null);
  const [trackingCode, setTrackingCode] = useState('');
  const sanitizedCode = trackingCode.trim().toUpperCase();
  const caseInfo = useMemo(() => seguimientoCasos[sanitizedCode] ?? null, [sanitizedCode]);
  const anonymousCode = useMemo(() => generateTrackingCode(), []);
  const [safeWordIndex, setSafeWordIndex] = useState(() => Math.floor(Math.random() * safeWords.length));
  const safeWord = safeWords[safeWordIndex];

  const handleRotateSafeWord = () => setSafeWordIndex((prev) => (prev + 1) % safeWords.length);

  const handleCredentialsChange = (field) => (event) =>
    setCredentials((prev) => ({ ...prev, [field]: event.target.value }));

  const handleIncidentChange = (field) => (event) =>
    setIncidentForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleDescriptionChange = (event) =>
    setIncidentForm((prev) => ({ ...prev, description: event.target.value.slice(0, 1200) }));

  const handleEvidenceNotesChange = (event) => setEvidenceNotes(event.target.value.slice(0, 240));

  const handleEvidenceUpload = (event) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) {
      setEvidenceList([]);
      return;
    }
    const mapped = files.map((file) => ({
      id: `${file.name}-${file.lastModified}`,
      name: file.name,
      kind: file.type || 'Archivo',
      size: formatFileSize(file.size)
    }));
    setEvidenceList(mapped);
    // Limpiar input para permitir volver a seleccionar el mismo archivo si es necesario
    event.target.value = '';
  };

  const handleSuspectUpload = (event) => {
    const [file] = event.target.files ?? [];
    if (recognitionTimerRef.current) {
      clearTimeout(recognitionTimerRef.current);
      recognitionTimerRef.current = null;
    }
    if (!file) {
      setSuspectPreview(null);
      setRecognitionMatches([]);
      setRecognitionState('idle');
      return;
    }
    if (suspectPreviewUrlRef.current) {
      URL.revokeObjectURL(suspectPreviewUrlRef.current);
      suspectPreviewUrlRef.current = null;
    }
    const objectUrl = URL.createObjectURL(file);
    suspectPreviewUrlRef.current = objectUrl;
    setSuspectPreview({
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type || 'imagen',
      src: objectUrl
    });
    setRecognitionMatches([]);
    setRecognitionState('ready');
    event.target.value = '';
  };

  const triggerRecognition = () => {
    if (!suspectPreview) {
      return;
    }
    if (recognitionTimerRef.current) {
      clearTimeout(recognitionTimerRef.current);
    }
    setRecognitionState('processing');
    recognitionTimerRef.current = setTimeout(() => {
      const matches = recognitionCatalog.slice(0, 3).map((match, index) => {
        const jitter = index === 0 ? 0.03 : index === 1 ? -0.02 : 0.01;
        const confidence = Math.max(0, Math.min(1, match.confidence + jitter));
        return {
          ...match,
          confidence: Math.round(confidence * 100)
        };
      });
      setRecognitionMatches(matches);
      setRecognitionState('done');
    }, 1400);
  };

  const resetRecognition = () => {
    if (recognitionTimerRef.current) {
      clearTimeout(recognitionTimerRef.current);
      recognitionTimerRef.current = null;
    }
    if (suspectPreviewUrlRef.current) {
      URL.revokeObjectURL(suspectPreviewUrlRef.current);
      suspectPreviewUrlRef.current = null;
    }
    setSuspectPreview(null);
    setRecognitionMatches([]);
    setRecognitionState('idle');
    setSuspectInputKey((prev) => prev + 1);
  };

  useEffect(() => () => {
    if (recognitionTimerRef.current) {
      clearTimeout(recognitionTimerRef.current);
    }
    if (suspectPreviewUrlRef.current) {
      URL.revokeObjectURL(suspectPreviewUrlRef.current);
    }
  }, []);

  const analysing = recognitionState === 'processing';
  const canRunRecognition = recognitionState === 'ready' || recognitionState === 'done';
  const riskLevel = useMemo(() => {
    if (incidentForm.type === 'violencia-genero') {
      return 'Critico';
    }
    if (incidentForm.type === 'asalto') {
      return 'Alto';
    }
    if (incidentForm.type === 'extorsion') {
      return 'Alto';
    }
    if (incidentForm.type === 'amenaza') {
      return 'Medio';
    }
    return 'Medio';
  }, [incidentForm.type]);

  return (
    <div className={styles.page}>
      <SectionHeader
        eyebrow="Denuncias"
        title="Ruta digital para reportar incidentes y activar proteccion"
        description="Diseno de experiencia centrada en la persona denunciante, con orientacion clara, accesible y acompanamiento institucional desde el primer contacto."
      />

      <section className={styles.accessSection}>
        <article className={styles.accessCard}>
          <header className={styles.accessHeader}>
            <h2>Control de identidad flexible</h2>
            <p>
              El anonimato total es la configuracion predeterminada. Puedes activar tu perfil verificado cuando quieras sin
              perder el codigo seguro ni las evidencias asociadas.
            </p>
          </header>
          <div className={styles.modeToggle}>
            <button
              type="button"
              className={`${styles.modeButton} ${reportMode === 'anonimo' ? styles.modeButtonActive : ''}`}
              onClick={() => setReportMode('anonimo')}
            >
              Denuncia anonima
            </button>
            <button
              type="button"
              className={`${styles.modeButton} ${reportMode === 'identificado' ? styles.modeButtonActive : ''}`}
              onClick={() => setReportMode('identificado')}
            >
              Ingresar con perfil
            </button>
          </div>

          {reportMode === 'anonimo' ? (
            <div className={styles.anonymousPanel}>
              <div className={styles.codeSummary}>
                <div>
                  <span className={styles.codeLabel}>Codigo de seguimiento efimero</span>
                  <p className={styles.codeDescription}>
                    Guarda este codigo en un lugar seguro. Solo tu podrás consultar el avance sin exponer tus datos.
                  </p>
                </div>
                <span className={styles.codeBadge}>{anonymousCode}</span>
              </div>
              <div className={styles.safeWordBox}>
                <div>
                  <span className={styles.safeWordLabel}>Palabra clave para contacto telefonico</span>
                  <p className={styles.safeWordDescription}>
                    Sirve para validar tu identidad sin revelar nombre ni numero. Cambiala tantas veces como necesites.
                  </p>
                </div>
                <div className={styles.safeWordActions}>
                  <span className={styles.safeWord}>{safeWord}</span>
                  <button type="button" className={styles.safeWordButton} onClick={handleRotateSafeWord}>
                    Generar nueva
                  </button>
                </div>
              </div>
              <ul className={styles.accessBullets}>
                <li>Sesiones en contenedor seguro: cierre automatico tras 15 minutos de inactividad.</li>
                <li>Encriptacion extremo a extremo y limpieza automatica de metadatos en cada archivo adjunto.</li>
                <li>Salida rapida: un clic cambia a un sitio de cobertura y bloquea notificaciones sensibles.</li>
              </ul>
            </div>
          ) : (
            <div className={styles.loginPanel}>
              <div className={styles.loginFields}>
                <label className={styles.loginLabel} htmlFor="perfil-email">
                  Correo cifrado
                </label>
                <input
                  id="perfil-email"
                  type="email"
                  className={styles.loginInput}
                  placeholder="nombre@seguridad.gt"
                  value={credentials.email}
                  onChange={handleCredentialsChange('email')}
                />
                <label className={styles.loginLabel} htmlFor="perfil-password">
                  Frase de acceso con doble factor
                </label>
                <input
                  id="perfil-password"
                  type="password"
                  className={styles.loginInput}
                  placeholder="Ingresa tu clave unica"
                  value={credentials.password}
                  onChange={handleCredentialsChange('password')}
                />
                <label className={styles.loginLabel} htmlFor="perfil-otp">
                  Codigo OTP (app o llavero fisico)
                </label>
                <input
                  id="perfil-otp"
                  type="text"
                  className={styles.loginInput}
                  placeholder="000000"
                  maxLength={6}
                  value={credentials.otp}
                  onChange={handleCredentialsChange('otp')}
                />
              </div>
              <div className={styles.loginNotes}>
                <p>
                  Aun con tu perfil verificado puedes alternar a modo anonimo antes de enviar la denuncia. Solo el equipo
                  auditor conoce tu identidad y cada acceso queda notificado.
                </p>
                <ul>
                  <li>Firma digital para solicitudes de medidas de proteccion.</li>
                  <li>Historial cifrado: descarga constancias sin revelar datos personales.</li>
                  <li>Control granular para compartir expedientes con superior o abogado.</li>
                </ul>
              </div>
            </div>
          )}
        </article>

        <article className={styles.profileCard}>
          {reportMode === 'identificado' ? (
            <div className={styles.profileContent}>
              <header className={styles.profileHeader}>
                <div className={styles.profileAvatar}>{profileSnapshot.name.slice(0, 2)}</div>
                <div>
                  <h3>{profileSnapshot.name}</h3>
                  <span>{profileSnapshot.alias}</span>
                </div>
              </header>
              <dl className={styles.profileStats}>
                <div>
                  <dt>Reportes enviados</dt>
                  <dd>{profileSnapshot.totalReports}</dd>
                </div>
                <div>
                  <dt>Casos resueltos</dt>
                  <dd>{profileSnapshot.resolved}</dd>
                </div>
                <div>
                  <dt>Activos</dt>
                  <dd>{profileSnapshot.active}</dd>
                </div>
              </dl>
              <div className={styles.profileBadge}>
                <strong>Confianza avanzada</strong>
                <span>{profileSnapshot.trustedLevel}</span>
              </div>
              <p className={styles.profileFootnote}>
                Ultimo codigo en seguimiento: <strong>{profileSnapshot.lastCode}</strong>. Puedes migrar cualquier denuncia a
                modo anonimo desde tu panel sin perder evidencias.
              </p>
            </div>
          ) : (
            <div className={styles.profileContent}>
              <h3>Anonimato reforzado</h3>
              <p>
                No almacenamos cookies de rastreo ni direccion IP. Cada informe se cifra con claves efimeras y se destruye
                si decides no enviarlo.
              </p>
              <ul className={styles.profileGuarantees}>
                <li>Comite independiente audita los accesos y publica reportes trimestrales.</li>
                <li>Copia segura opcional para entregar a tu red de confianza fuera de linea.</li>
                <li>Integracion con linea 1574 y Crime Stoppers sin revelar tu dispositivo.</li>
              </ul>
            </div>
          )}
        </article>
      </section>

      <section className={styles.formGrid}>
        <article className={styles.reportComposer}>
          <header className={styles.composerHeader}>
            <div>
              <h2>Compone tu denuncia con guia segura</h2>
              <p>
                Creamos un flujo guiado que valida coherencia, elimina metadatos y genera hashes de integridad para cada
                archivo adjunto.
              </p>
            </div>
            <span className={`${styles.riskBadge} ${styles[`risk${riskLevel}`]}`}>Riesgo {riskLevel}</span>
          </header>

          <div className={styles.formRow}>
            <label className={styles.formLabel} htmlFor="tipo-incidente">
              Tipo de incidente
            </label>
            <select
              id="tipo-incidente"
              className={styles.formControl}
              value={incidentForm.type}
              onChange={handleIncidentChange('type')}
            >
              {incidentTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.dualRow}>
            <div className={styles.formRow}>
              <label className={styles.formLabel} htmlFor="ubicacion-incidente">
                Zona o municipio
              </label>
              <select
                id="ubicacion-incidente"
                className={styles.formControl}
                value={incidentForm.location}
                onChange={handleIncidentChange('location')}
              >
                {incidentLocations.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formRow}>
              <label className={styles.formLabel} htmlFor="fecha-incidente">
                Fecha y hora aproximada
              </label>
              <input
                id="fecha-incidente"
                type="datetime-local"
                className={styles.formControl}
                value={incidentForm.datetime}
                onChange={handleIncidentChange('datetime')}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <label className={styles.formLabel} htmlFor="descripcion-incidente">
              Relato principal
            </label>
            <textarea
              id="descripcion-incidente"
              className={`${styles.formControl} ${styles.textArea}`}
              rows={5}
              placeholder="Describe lo ocurrido, quienes estaban presentes y si hubo armas, placas o rutas identificables."
              value={incidentForm.description}
              onChange={handleDescriptionChange}
            />
            <div className={styles.helperRow}>
              <span>Se cifrara en reposo con AES-256 y solo un equipo reducido podra acceder.</span>
              <span>{incidentForm.description.length} / 1200</span>
            </div>
          </div>

          <div className={styles.dualRow}>
            <div className={styles.formRow}>
              <label className={styles.formLabel} htmlFor="soporte-incidente">
                Que apoyo necesitas
              </label>
              <select
                id="soporte-incidente"
                className={styles.formControl}
                value={incidentForm.support}
                onChange={handleIncidentChange('support')}
              >
                {supportNeeds.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formRow}>
              <label className={styles.formLabel} htmlFor="notas-evidencia">
                Nota confidencial para el equipo superior
              </label>
              <textarea
                id="notas-evidencia"
                className={`${styles.formControl} ${styles.textArea}`}
                rows={2}
                placeholder="Incluye palabra clave, riesgos inmediatos o datos para contactar a tu red de apoyo."
                value={evidenceNotes}
                onChange={handleEvidenceNotesChange}
              />
              <div className={styles.helperRow}>
                <span>Solo visible para personal con doble autorizacion.</span>
                <span>{evidenceNotes.length} / 240</span>
              </div>
            </div>
          </div>

          <div className={styles.evidenceBlock}>
            <div className={styles.evidenceHeader}>
              <div>
                <h3>Adjunta evidencia segura</h3>
                <p>Limpiamos geolocalizacion, marcas de agua y generamos codigo hash para auditoria independiente.</p>
              </div>
              <button type="button" className={styles.cleanButton} onClick={() => setEvidenceList([])}>
                Vaciar adjuntos
              </button>
            </div>
            <label className={styles.dropzone}>
              <input type="file" multiple onChange={handleEvidenceUpload} className={styles.fileInput} />
              <span>Arrastra o haz clic para cargar fotos, audio o documentos (max 250 MB)</span>
            </label>
            {evidenceList.length > 0 ? (
              <ul className={styles.evidenceList}>
                {evidenceList.map((item) => (
                  <li key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.kind}</span>
                    </div>
                    <span>{item.size}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.evidencePlaceholder}>
                Tus archivos se procesaran en un entorno aislado. Puedes pegarlos tambien desde tu portapapeles.
              </div>
            )}
          </div>

          <div className={styles.composerFooter}>
            <ul>
              <li>Cada evidencia obtiene un hash SHA-512 compartido con la fiscalia para validar integridad.</li>
              <li>Elimina datos EXIF, borra ruido identificable y permite marcar rostros que deban difuminarse.</li>
              <li>Solicita clasificacion rapida si temes represalias en las proximas 24 horas.</li>
            </ul>
          </div>
        </article>

        <article className={styles.recognitionCenter}>
          <header className={styles.recognitionHeader}>
            <div>
              <h2>Reconocimiento asistido y aprobacion superior</h2>
              <p>
                Subimos la fotografia o fotograma del sospechoso para generar coincidencias con AWS Rekognition y bases
                comunitarias sin comprometer tu anonimato.
              </p>
            </div>
            <div className={styles.enginePill}>Motor IA + validacion humana</div>
          </header>

          <div className={styles.suspectUpload}>
            <label className={styles.formLabel} htmlFor="sospechoso-foto">
              Carga foto o fotograma del sospechoso
            </label>
            <div className={styles.suspectDrop}>
              <input
                key={suspectInputKey}
                id="sospechoso-foto"
                type="file"
                accept="image/*"
                onChange={handleSuspectUpload}
                className={styles.fileInput}
              />
              <span>JPG, PNG o frame de video. Se difuminaran rostros de victimas automaticamente.</span>
            </div>
            {suspectPreview ? (
              <div className={styles.suspectPreview}>
                {/* eslint-disable-next-line @next/next/no-img-element -- se requiere <img> para renderizar blob:// locales */}
                <img src={suspectPreview.src} alt="Sospechoso cargado" />
                <div>
                  <strong>{suspectPreview.name}</strong>
                  <span>{suspectPreview.type}</span>
                  <span>{suspectPreview.size}</span>
                </div>
              </div>
            ) : (
              <div className={styles.suspectPlaceholder}>
                Sin archivos cargados. Puedes pegar una imagen directamente desde tu portapapeles (Ctrl + V).
              </div>
            )}
            <div className={styles.recognitionActions}>
              <button
                type="button"
                className={styles.analyseButton}
                onClick={triggerRecognition}
                disabled={!canRunRecognition || analysing}
              >
                {analysing ? 'Analizando coincidencias...' : 'Analizar con IA y validar'}
              </button>
              <button type="button" className={styles.clearButton} onClick={resetRecognition} disabled={!suspectPreview}>
                Limpiar
              </button>
            </div>
            <div className={styles.recognitionStatus}>
              {recognitionState === 'idle' && <span>Carga una imagen para activar el analisis.</span>}
              {recognitionState === 'ready' && <span>Listo para analizar. El proceso tarda aprox. 8 segundos.</span>}
              {recognitionState === 'processing' && <span>Ejecutando comparacion contra bases verificadas...</span>}
              {recognitionState === 'done' &&
                (recognitionMatches.length ? (
                  <span>
                    {recognitionMatches.length} coincidencias encontradas. Revisa y decide si escalar a tu superior de
                    confianza.
                  </span>
                ) : (
                  <span>No se encontraron coincidencias exactas. Puedes solicitar apoyo a la red comunitaria.</span>
                ))}
            </div>
          </div>

          {recognitionMatches.length > 0 && (
            <div className={styles.matchList}>
              <h3>Coincidencias probables</h3>
              <ul>
                {recognitionMatches.map((match) => (
                  <li key={match.id}>
                    <div>
                      <strong>{match.alias}</strong>
                      <span>{match.context}</span>
                    </div>
                    <div className={styles.matchMeta}>
                      <span className={styles.matchScore}>{match.confidence}%</span>
                      <span className={styles.matchSeen}>Ultimo registro: {match.lastSeen}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.supervisorBoard}>
            <h3>Ruta de aprobacion y acompanamiento</h3>
            <ul>
              {supervisorPipeline.map((stage) => {
                const statusClass =
                  stage.status === 'completado'
                    ? styles.stageCompleted
                    : stage.status === 'en-progreso'
                    ? styles.stageActive
                    : styles.stagePending;
                return (
                  <li key={stage.id} className={`${styles.supervisorStage} ${statusClass}`}>
                    <div>
                      <strong>{stage.label}</strong>
                      <span>{stage.detail}</span>
                    </div>
                    <span className={styles.stageTime}>{stage.timestamp}</span>
                  </li>
                );
              })}
            </ul>
            <p>
              Cada aprobacion requiere doble factor y firma digital. Tu evidencia solo se comparte con la cadena autorizada y
              puedes revocar permisos en cualquier momento.
            </p>
          </div>

          <div className={styles.recognitionFootnote}>
            <ul>
              <li>El sistema registra hash y cadena de custodia para auditorias externas.</li>
              <li>Los superiores reciben alertas con version difuminada hasta aprobar medidas.</li>
              <li>Integra panel de entrenamiento para mejorar la precision con bucles de retroalimentacion.</li>
            </ul>
          </div>
        </article>
      </section>

      <section className={styles.securityIntro}>
        <SectionHeader
          eyebrow="Anonimato genuino"
          title="Proteccion tecnica y protocolos para denunciar sin miedo"
          description="Inspirado en las recomendaciones del equipo de investigacion: anonimizacion automatica, cifrado de extremo a extremo y salidas de emergencia accesibles."
        />
        <div className={styles.securityGrid}>
          {anonimatoPrincipios.map((item) => (
            <article key={item.title} className={styles.securityCard}>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
        <div className={styles.securityChecklist}>
          <h4>Antes de iniciar una denuncia:</h4>
          <ul>
            {seguridadRapida.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.trackingModule}>
        <div className={styles.trackingCard}>
          <SectionHeader
            eyebrow="Seguimiento anonimo"
            title="Consulta el estado de tu caso con un codigo de 8 caracteres"
            description="El codigo se genera al finalizar el registro y puedes compartirlo con una persona de apoyo sin revelar tus datos."
          />
          <form
            className={styles.trackingForm}
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <label htmlFor="trackingCode" className={styles.trackingLabel}>
              Ingresa tu codigo
            </label>
            <div className={styles.trackingFieldset}>
              <input
                id="trackingCode"
                name="trackingCode"
                placeholder="Ejemplo: AX18-72Q"
                value={trackingCode}
                onChange={(event) => setTrackingCode(event.target.value.toUpperCase())}
                className={styles.trackingInput}
                autoComplete="off"
              />
              <button type="submit" className={styles.trackingButton}>
                Revisar estado
              </button>
            </div>
          </form>

          <div className={styles.trackingStatus}>
            {caseInfo ? (
              <>
                <div className={styles.statusHeader}>
                  <span className={styles.statusBadge}>{caseInfo.status}</span>
                  <span className={styles.statusMeta}>
                    Riesgo {caseInfo.risk} · {caseInfo.lastUpdate}
                  </span>
                </div>
                <ul className={styles.statusTimeline}>
                  {caseInfo.timeline.map((milestone) => (
                    <li key={milestone}>{milestone}</li>
                  ))}
                </ul>
                <div className={styles.statusNext}>
                  <strong>Accion siguiente:</strong> {caseInfo.nextStep}
                </div>
              </>
            ) : (
              <div className={styles.statusPlaceholder}>
                <p>Introduce tu codigo para ver el detalle de hitos, documentos liberados y alertas enviadas.</p>
                <span>Si perdiste el codigo, solicita uno nuevo en la linea segura 1574 con tu palabra clave.</span>
              </div>
            )}
          </div>
        </div>
        <aside className={styles.trackingTips}>
          <h3>Transparencia radical</h3>
          <p>
            Cada acceso al expediente queda auditado por un comite independiente y se notifica a la persona denunciante.
            Los reportes pueden compartirse en modo lectura para acompanantes comunitarios.
          </p>
          <ul>
            <li>Opciones para pausar o reactivar el expediente sin perder evidencia.</li>
            <li>Descarga de constancias anonimas para presentar ante otras instituciones.</li>
            <li>Registro de apoyo psicologico y juridico que se habilita segun el nivel de riesgo.</li>
          </ul>
        </aside>
      </section>

      <section className={styles.supportGrid}>
        {respuestaCrisis.map((card) => (
          <article key={card.title} className={styles.supportCard}>
            <h3>{card.title}</h3>
            <ul>
              {card.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

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
