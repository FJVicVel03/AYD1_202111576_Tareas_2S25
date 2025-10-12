import { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionHeader from '@/components/SectionHeader';
import PanelSwitcher from '@/components/PanelSwitcher';
import styles from '@/styles/Denuncias.module.css';

const requisitos = [
  'Datos basicos de la persona denunciante o representante.',
  'Descripcion detallada del incidente (lugar, fecha y hora).',
  'Evidencias disponibles: fotografias, videos, documentos, contactos.',
  'Seleccion de Acompanamiento requerido: juridico, psicosocial o de proteccion.'
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
  'Utiliza el boton "Salida rapida" del encabezado para abrir el portal oficial de la PNC y cerrar tu sesion activa.'
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

const registrationChecklist = [
  'Fotografia frontal reciente sin mascarilla ni gafas oscuras.',
  'Numero de DPI unico validado contra bases oficiales.',
  'Clave robusta: minimo 12 caracteres, mayuscula, numero y simbolo.'
];

const penaltyGuidelines = [
  'Toda denuncia pasa por analisis automatizado y revision humana para detectar inconsistencias.',
  'El envio intencional de informacion falsa puede derivar en acciones legales y suspension del acceso.',
  'Cuando exista sospecha, se verificara el DPI y la fotografia del perfil con aliados institucionales.'
];

const emergencyFlow = [
  'Activalo desde la interfaz, con triple pulsacion del boton de encendido o agitando el dispositivo.',
  'Envia coordenadas cada 3-5 segundos por WebSocket y genera fallback por SMS si no hay datos.',
  'Mantiene el rastreo hasta que el caso se marca como resuelto y se genera informe de auditoria.'
];

const emergencyPermits = [
  'Requiere permisos de ubicacion en primer y segundo plano para monitoreo continuo.',
  'Necesita acceso a notificaciones y servicios de accesibilidad para gestos configurables.',
  'Cifra coordenadas y datos del usuario antes de transmitirlos a autoridades o contactos confiables.',
  'Puede enviar alertas discretas a WhatsApp o SMS verificados cuando no haya datos.'
];

const assistantCapabilities = [
  'Chat seguro 24/7 con IA entrenada en primeros auxilios emocionales y protocolos de atencion.',
  'Identifica nivel de riesgo y deriva a profesionales humanos cuando detecta palabras clave criticas.',
  'Entrega planes personalizados de autocuidado y educacion con seguimiento discreto.',
  'Disponible en espanol, ingles y lenguas mayas priorizadas; interfaz guiada por voz para alfabetizacion digital baja.',
  'Envia notificaciones silenciosas a WhatsApp y SMS con autorizacion explicita de la persona usuaria.'
];

const assistantEscalations = [
  'Escala a videollamada con psicologos o medicos aliados cuando el riesgo es alto (previo consentimiento).',
  'Registra notas cifradas para que el equipo clinico tenga contexto sin exponer al usuario.',
  'Compatible con lectura en voz alta, contraste alto y traducciones para asegurar accesibilidad.',
  'Ofrece guias narradas y respuestas por voz para personas con dificultades de lectura.'
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
    title: 'Boton de emergencia 360 grados',
    bullets: [
      'Disponible en la interfaz, triple pulsacion del boton fisico o gesto de agitar el dispositivo.',
      'Mantiene transmision de ubicacion cada pocos segundos hasta marcar el incidente como resuelto.',
      'Cifra coordenadas y contacto de emergencia antes de compartirlos con autoridades o aliados.'
    ]
  },
  {
    title: 'Asistente virtual IA',
    bullets: [
      'Chat seguro que ofrece primeros auxilios emocionales y guias de respiracion en segundos.',
      'Activa escalamiento con psicologos o medicos aliados cuando detecta lenguaje de alto riesgo.',
      'Genera bitacora anonima para que la persona usuaria decida que compartir con el equipo clinico.'
    ]
  },
  {
    title: 'Guardian digital 24/7',
    bullets: [
      'Motor de riesgo analiza patrones para sugerir protocolos inmediatos y materiales educativos.',
      'Sincroniza con comunidades vigilantes y refugios para coordinar respuesta.',
      'Permite activar modo sigiloso y salida rapida sin abandonar la sesion segura.'
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
  const { t } = useLanguage();
  const [reportMode, setReportMode] = useState('anonimo');
  const [credentials, setCredentials] = useState({ email: '', password: '', otp: '', dpi: '', selfie: '' });
  const [incidentForm, setIncidentForm] = useState({
    type: incidentTypes[0].value,
    location: incidentLocations[0].value,
    support: supportNeeds[0].value,
    datetime: '',
    description: ''
  });
  const [evidenceList, setEvidenceList] = useState([]);
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [suspectPreview, setSuspectPreview] = useState(null);
  const [recognitionState, setRecognitionState] = useState('idle');
  const [recognitionMatches, setRecognitionMatches] = useState([]);
  const [selfieInputKey, setSelfieInputKey] = useState(0);
  const [suspectInputKey, setSuspectInputKey] = useState(0);
  const recognitionTimerRef = useRef(null);
  const selfiePreviewUrlRef = useRef(null);
  const suspectPreviewUrlRef = useRef(null);
  const [trackingCode, setTrackingCode] = useState('');
  const sanitizedCode = trackingCode.trim().toUpperCase();
  const caseInfo = useMemo(() => seguimientoCasos[sanitizedCode] ?? null, [sanitizedCode]);
  const [anonymousCode, setAnonymousCode] = useState('SG-XXXX-000');
  const [safeWordIndex, setSafeWordIndex] = useState(0);
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

  const handleSelfieUpload = (event) => {
    const [file] = event.target.files ?? [];
    if (selfiePreviewUrlRef.current) {
      URL.revokeObjectURL(selfiePreviewUrlRef.current);
      selfiePreviewUrlRef.current = null;
    }
    if (!file) {
      setSelfiePreview(null);
      setCredentials((prev) => ({ ...prev, selfie: '' }));
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    selfiePreviewUrlRef.current = objectUrl;
    setSelfiePreview({
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type || 'imagen',
      src: objectUrl
    });
    setCredentials((prev) => ({ ...prev, selfie: file.name }));
    event.target.value = '';
  };

  const clearSelfie = () => {
    if (selfiePreviewUrlRef.current) {
      URL.revokeObjectURL(selfiePreviewUrlRef.current);
      selfiePreviewUrlRef.current = null;
    }
    setSelfiePreview(null);
    setCredentials((prev) => ({ ...prev, selfie: '' }));
    setSelfieInputKey((prev) => prev + 1);
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
    if (selfiePreviewUrlRef.current) {
      URL.revokeObjectURL(selfiePreviewUrlRef.current);
    }
  }, []);

  useEffect(() => {
    setAnonymousCode(generateTrackingCode());
  }, []);

  useEffect(() => {
    setSafeWordIndex(Math.floor(Math.random() * safeWords.length));
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

  const identityPanelContent = (
    <>
      <section className={styles.accessSection}>
        <article className={styles.accessCard}>
          <header className={styles.accessHeader}>
            <h2>{t('denuncias.identity.title', 'Control de identidad flexible')}</h2>
            <p>
              {t(
                'denuncias.identity.description',
                'El anonimato total es la configuracion predeterminada. Puedes activar tu perfil verificado cuando quieras sin perder el codigo seguro ni las evidencias asociadas.'
              )}
            </p>
          </header>
          <div className={styles.modeToggle}>
            <button
              type="button"
              className={`${styles.modeButton} ${reportMode === 'anonimo' ? styles.modeButtonActive : ''}`}
              onClick={() => setReportMode('anonimo')}
            >
              {t('denuncias.identity.anonymous', 'Denuncia anonima')}
            </button>
            <button
              type="button"
              className={`${styles.modeButton} ${reportMode === 'identificado' ? styles.modeButtonActive : ''}`}
              onClick={() => setReportMode('identificado')}
            >
              {t('denuncias.identity.identified', 'Ingresar con perfil')}
            </button>
          </div>

          {reportMode === 'anonimo' ? (
            <div className={styles.anonymousPanel}>
              <div className={styles.codeSummary}>
                <div>
                  <span className={styles.codeLabel}>{t('denuncias.identity.codeLabel', 'codigo de seguimiento efimero')}</span>
                  <p className={styles.codeDescription}>
                    {t(
                      'denuncias.identity.codeDescription',
                      'Guarda este codigo en un lugar seguro. Solo tu podras consultar el avance sin exponer tus datos.'
                    )}
                  </p>
                </div>
                <span className={styles.codeBadge}>{anonymousCode}</span>
              </div>
              <div className={styles.safeWordBox}>
                <div>
                  <span className={styles.safeWordLabel}>{t('denuncias.identity.safeWord', 'Palabra clave para contacto telefonico')}</span>
                  <p className={styles.safeWordDescription}>
                    {t(
                      'denuncias.identity.safeWordDescription',
                      'Sirve para validar tu identidad sin revelar nombre ni Numero. Cmbiala tantas veces como necesites.'
                    )}
                  </p>
                </div>
                <div className={styles.safeWordActions}>
                  <span className={styles.safeWord}>{safeWord}</span>
                  <button type="button" className={styles.safeWordButton} onClick={handleRotateSafeWord}>
                    {t('denuncias.identity.safeWordButton', 'Generar nueva')}
                  </button>
                </div>
              </div>
              <ul className={styles.accessBullets}>
                <li>{t('denuncias.identity.bullet1', 'Sesiones en contenedor seguro: cierre automatico tras 15 minutos de inactividad.')}</li>
                <li>
                  {t(
                    'denuncias.identity.bullet2',
                    'Encriptacion extremo a extremo y limpieza automtica de metadatos en cada archivo adjunto.'
                  )}
                </li>
                <li>{t('denuncias.identity.bullet3', 'Salida rapida: un clic abre el portal de la PNC y bloquea notificaciones sensibles.')}</li>
                <li>{t('denuncias.identity.bullet4', 'Denuncias maliciosas generan alertas y podran derivar en acciones legales.')}</li>
              </ul>
            </div>
          ) : (
            <div className={styles.loginPanel}>
              <div className={styles.loginFields}>
                <label className={styles.loginLabel} htmlFor="perfil-dpi">
                  {t('denuncias.identity.dpi', 'Numero de DPI')}
                </label>
                <input
                  id="perfil-dpi"
                  type="text"
                  inputMode="numeric"
                  maxLength={13}
                  className={styles.loginInput}
                  placeholder="0000000000000"
                  value={credentials.dpi}
                  onChange={handleCredentialsChange('dpi')}
                />
                <label className={styles.loginLabel} htmlFor="perfil-email">
                  {t('denuncias.identity.email', 'Correo cifrado')}
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
                  {t('denuncias.identity.password', 'Frase de acceso con doble factor')}
                </label>
                <input
                  id="perfil-password"
                  type="password"
                  className={styles.loginInput}
                  placeholder={t('denuncias.identity.passwordPlaceholder', 'Ingresa tu clave unica')}
                  value={credentials.password}
                  onChange={handleCredentialsChange('password')}
                />
                <label className={styles.loginLabel} htmlFor="perfil-otp">
                  {t('denuncias.identity.otp', 'codigo OTP (app o llavero fisico)')}
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
              <div className={styles.selfieUpload}>
                <label className={styles.loginLabel} htmlFor="perfil-selfie">
                  {t('denuncias.identity.selfie', 'Fotografia frontal (JPG/PNG)')}
                </label>
                <div className={styles.selfieDrop}>
                  <input
                    key={selfieInputKey}
                    id="perfil-selfie"
                    type="file"
                    accept="image/*"
                    onChange={handleSelfieUpload}
                    className={styles.fileInput}
                  />
                  <span>
                    {t(
                      'denuncias.identity.selfieHint',
                      'Sube una imagen sin mascarilla ni lentes oscuros para validar identidad.'
                    )}
                  </span>
                </div>
                {selfiePreview ? (
                  <div className={styles.selfiePreview}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selfiePreview.src} alt="Selfie de verificacion" />
                    <div>
                      <strong>{selfiePreview.name}</strong>
                      <span>{selfiePreview.type}</span>
                      <span>{selfiePreview.size}</span>
                    </div>
                    <button type="button" className={styles.selfieClear} onClick={clearSelfie}>
                      {t('denuncias.identity.selfieReplace', 'Reemplazar')}
                    </button>
                  </div>
                ) : (
                  <p className={styles.selfieHint}>
                    {t(
                      'denuncias.identity.selfieStorage',
                      'Se utilizar exclusivamente para evitar suplantaciones y se almacenar cifrada (AES-256 + claves efmeras).'
                    )}
                  </p>
                )}
              </div>
              <div className={styles.loginNotes}>
                <p>
                  {t(
                    'denuncias.identity.note',
                    'An con tu perfil verificado puedes alternar a modo anonimo antes de enviar la denuncia. Solo el equipo auditor conoce tu identidad y cada acceso queda notificado.'
                  )}
                </p>
                <ul className={styles.loginChecklist}>
                  {registrationChecklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <ul className={styles.loginNotesList}>
                  <li>{t('denuncias.identity.feature1', 'Firma digital para solicitudes de medidas de proteccion.')}</li>
                  <li>
                    {t(
                      'denuncias.identity.feature2',
                      'Historial cifrado: descarga constancias sin revelar datos personales.'
                    )}
                  </li>
                  <li>
                    {t(
                      'denuncias.identity.feature3',
                      'Control granular para compartir expedientes con superior o abogado.'
                    )}
                  </li>
                  <li>
                    {t(
                      'denuncias.identity.feature4',
                      'Contraseas almacenadas con hashing fuerte y sesiones protegidas con tokens de corta duracin.'
                    )}
                  </li>
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
                  <dt>{t('denuncias.identity.statsSent', 'Reportes enviados')}</dt>
                  <dd>{profileSnapshot.totalReports}</dd>
                </div>
                <div>
                  <dt>{t('denuncias.identity.statsResolved', 'Casos resueltos')}</dt>
                  <dd>{profileSnapshot.resolved}</dd>
                </div>
                <div>
                  <dt>{t('denuncias.identity.statsActive', 'Activos')}</dt>
                  <dd>{profileSnapshot.active}</dd>
                </div>
              </dl>
              <div className={styles.profileBadge}>
                <strong>{t('denuncias.identity.confidence', 'Confianza avanzada')}</strong>
                <span>{profileSnapshot.trustedLevel}</span>
              </div>
              <p className={styles.profileFootnote}>
                {t('denuncias.identity.lastCode', 'ultimo codigo en seguimiento:')}{' '}
                <strong>{profileSnapshot.lastCode}</strong>.{' '}
                {t(
                  'denuncias.identity.lastCodeNote',
                  'Puedes migrar cualquier denuncia a modo anonimo desde tu panel sin perder evidencias.'
                )}
              </p>
            </div>
          ) : (
            <div className={styles.profileContent}>
              <h3>{t('denuncias.identity.anonymousTitle', 'Anonimato reforzado')}</h3>
              <p>
                {t(
                  'denuncias.identity.anonymousDescription',
                  'No almacenamos cookies de rastreo ni direccin IP. Cada informe se cifra con claves efmeras y se destruye si decides no enviarlo.'
                )}
              </p>
              <ul className={styles.profileGuarantees}>
                <li>{t('denuncias.identity.guard1', 'Comite independiente audita los accesos y publica reportes trimestrales.')}</li>
                <li>{t('denuncias.identity.guard2', 'Copia segura opcional para entregar a tu red de confianza fuera de linea.')}</li>
                <li>
                  {t(
                    'denuncias.identity.guard3',
                    'Integracion con linea 1574 y Crime Stoppers sin revelar tu dispositivo.'
                  )}
                </li>
              </ul>
            </div>
          )}
        </article>
      </section>

      <aside className={styles.penaltyNotice}>
        <h3>{t('denuncias.penalty.title', 'Advertencia sobre denuncias falsas')}</h3>
        <p>
          {t(
            'denuncias.penalty.description',
            'El sistema cruza la informacion con unidades especializadas. Reportes maliciosos activan bloqueos de cuenta y pueden trasladarse al Ministerio Pblico.'
          )}
        </p>
        <ul>
          {penaltyGuidelines.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </aside>
    </>
  );

  const reportPanelContent = (
    <>
      <section className={styles.formGrid}>
        <article className={styles.reportComposer}>
          <header className={styles.composerHeader}>
            <div>
              <h2>{t('denuncias.form.title', 'Compone tu denuncia con gua segura')}</h2>
              <p>
                {t(
                  'denuncias.form.description',
                  'Creamos un flujo guiado que valida coherencia, elimina metadatos y genera hashes de integridad para cada archivo adjunto.'
                )}
              </p>
            </div>
            <span className={`${styles.riskBadge} ${styles[`risk${riskLevel}`]}`}>{t('denuncias.form.risk', 'Riesgo')} {riskLevel}</span>
          </header>

          <div className={styles.formRow}>
            <label className={styles.formLabel} htmlFor="tipo-incidente">
              {t('denuncias.form.type', 'Tipo de incidente')}
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
                {t('denuncias.form.location', 'Zona o municipio')}
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
                {t('denuncias.form.datetime', 'Fecha y hora aproximada')}
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
              {t('denuncias.form.descriptionLabel', 'Relato principal')}
            </label>
            <textarea
              id="descripcion-incidente"
              className={`${styles.formControl} ${styles.textArea}`}
              rows={5}
              placeholder={t(
                'denuncias.form.descriptionPlaceholder',
                'Describe lo ocurrido, quines estaban presentes y si hubo armas, placas o rutas identificables.'
              )}
              value={incidentForm.description}
              onChange={handleDescriptionChange}
            />
            <div className={styles.helperRow}>
              <span>
                {t(
                  'denuncias.form.descriptionHelper',
                  'Se cifrar en reposo con AES-256 y solo un equipo reducido podra acceder.'
                )}
              </span>
              <span>{incidentForm.description.length} / 1200</span>
            </div>
          </div>

          <div className={styles.dualRow}>
            <div className={styles.formRow}>
              <label className={styles.formLabel} htmlFor="soporte-incidente">
                {t('denuncias.form.support', 'Qu apoyo necesitas')}
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
                {t('denuncias.form.notesLabel', 'Nota confidencial para el equipo superior')}
              </label>
              <textarea
                id="notas-evidencia"
                className={`${styles.formControl} ${styles.textArea}`}
                rows={2}
                placeholder={t(
                  'denuncias.form.notesPlaceholder',
                  'Incluye palabra clave, riesgos inmediatos o datos para contactar a tu red de apoyo.'
                )}
                value={evidenceNotes}
                onChange={handleEvidenceNotesChange}
              />
              <div className={styles.helperRow}>
                <span>{t('denuncias.form.notesHelper', 'Solo visible para personal con doble autorizacion.')}</span>
                <span>{evidenceNotes.length} / 240</span>
              </div>
            </div>
          </div>

          <div className={styles.evidenceBlock}>
            <div className={styles.evidenceHeader}>
              <div>
                <h3>{t('denuncias.form.evidenceTitle', 'Adjunta evidencia segura')}</h3>
                <p>
                  {t(
                    'denuncias.form.evidenceDescription',
                    'Limpiamos geolocalizacin, marcas de agua y generamos codigo hash para auditora independiente.'
                  )}
                </p>
              </div>
              <button type="button" className={styles.cleanButton} onClick={() => setEvidenceList([])}>
                {t('denuncias.form.clearAttachments', 'Vaciar adjuntos')}
              </button>
            </div>
            <label className={styles.dropzone}>
              <input type="file" multiple onChange={handleEvidenceUpload} className={styles.fileInput} />
              <span>
                {t(
                  'denuncias.form.dropzone',
                  'Arrastra o haz clic para cargar fotos, audio o documentos (max. 250 MB)'
                )}
              </span>
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
                {t(
                  'denuncias.form.placeholder',
                  'Tus archivos se procesaran en un entorno aislado. Puedes pegarlos tambin desde tu portapapeles.'
                )}
              </div>
            )}
          </div>

          <div className={styles.composerFooter}>
            <ul>
              <li>
                {t(
                  'denuncias.form.footer1',
                  'Cada evidencia obtiene un hash SHA-512 compartido con la fiscala para validar integridad.'
                )}
              </li>
              <li>
                {t(
                  'denuncias.form.footer2',
                  'Eliminamos datos EXIF, borramos ruido identificable y puedes marcar rostros que deban difuminarse.'
                )}
              </li>
              <li>
                {t(
                  'denuncias.form.footer3',
                  'Solicita clasificacin rapida si temes represalias en las proximas 24 horas.'
                )}
              </li>
            </ul>
          </div>
        </article>
      </section>

      <section className={styles.securityIntro}>
        <SectionHeader
          eyebrow={t('denuncias.security.eyebrow', 'Anonimato genuino')}
          title={t('denuncias.security.title', 'proteccion tcunica y protocolos para denunciar sin miedo')}
          description={t(
            'denuncias.security.description',
            'Basado en recomendaciones del equipo de investigacin: anonimizacin automtica, cifrado de extremo a extremo y salidas de emergencia accesibles.'
          )}
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
          <h4>{t('denuncias.security.beforeTitle', 'Antes de iniciar una denuncia:')}</h4>
          <ul>
            {seguridadRapida.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );

  const emergencyPanelContent = (
    <>
      <section className={styles.emergencySection}>
        <article className={styles.emergencyCard}>
          <h2>{t('denuncias.emergency.title', 'boton de emergencia en campo')}</h2>
          <p>
            {t(
              'denuncias.emergency.description',
              'Pensado para escenarios de riesgo inmediato. Puede activarse en pantalla, con combinaciones de botones fisicos o mediante gestos configurables.'
            )}
          </p>
          <ul>
            {emergencyFlow.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className={styles.emergencyCard}>
          <h3>{t('denuncias.emergency.permitsTitle', 'Permisos y seguridad tcunica')}</h3>
          <ul>
            {emergencyPermits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className={styles.emergencyActions}>
            <button type="button">{t('denuncias.emergency.configure', 'Configurar accesos')}</button>
            <button type="button" className={styles.emergencyGhost}>
              {t('denuncias.emergency.simulation', 'Probar simulacro')}
            </button>
          </div>
        </article>
      </section>

      <section className={styles.assistantSection}>
        <article className={styles.assistantCard}>
          <h2>{t('denuncias.assistant.title', 'Asistente virtual IA')}</h2>
          <p>
            {t(
              'denuncias.assistant.description',
              'Chat seguro que ofrece Acompanamiento emocional, material educativo y deriva a profesionales cuando detecta senales de riesgo.'
            )}
          </p>
          <ul>
            {assistantCapabilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className={styles.assistantCard}>
          <h3>{t('denuncias.assistant.followupTitle', 'Escalonamiento y seguimiento')}</h3>
          <ul>
            {assistantEscalations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className={styles.assistantActions}>
            <button type="button">{t('denuncias.assistant.startChat', 'Iniciar chat de apoyo')}</button>
            <button type="button">{t('denuncias.assistant.whatsapp', 'Configurar alertas WhatsApp')}</button>
            <button type="button" className={styles.assistantGhost}>
              {t('denuncias.assistant.guides', 'Ver guas de autocuidado')}
            </button>
          </div>
        </article>
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
    </>
  );

  const followupPanelContent = (
    <>
      <section className={styles.trackingModule}>
        <div className={styles.trackingCard}>
          <div className={styles.trackingForm}>
            <label className={styles.trackingLabel} htmlFor="codigo-seguimiento">
              {t('denuncias.followup.codeTitle', 'Introduce tu codigo de seguimiento')}
            </label>
            <div className={styles.trackingFieldset}>
              <input
                id="codigo-seguimiento"
                className={styles.trackingInput}
                value={trackingCode}
                onChange={(event) => setTrackingCode(event.target.value)}
                placeholder="AX18-72Q"
              />
              <button type="button" className={styles.trackingButton}>
                {t('denuncias.followup.checkButton', 'Consultar estado')}
              </button>
            </div>
            <p className={styles.trackingHint}>
              {t(
                'denuncias.followup.hint',
                'Comparte este codigo unicamente con personas de confianza. Puedes regenerar uno nuevo desde tu panel.'
              )}
            </p>
          </div>
          <div className={styles.trackingStatus}>
            {caseInfo ? (
              <>
                <div className={styles.statusHeader}>
                  <span className={styles.statusBadge}>{caseInfo.status}</span>
                  <span className={styles.statusMeta}>
                    {t('denuncias.followup.risk', 'Riesgo')} {caseInfo.risk}  {caseInfo.lastUpdate}
                  </span>
                </div>
                <ul className={styles.statusTimeline}>
                  {caseInfo.timeline.map((milestone) => (
                    <li key={milestone}>{milestone}</li>
                  ))}
                </ul>
                <div className={styles.statusNext}>
                  <strong>{t('denuncias.followup.next', 'Accin siguiente:')}</strong> {caseInfo.nextStep}
                </div>
              </>
            ) : (
              <div className={styles.statusPlaceholder}>
                <p>
                  {t(
                    'denuncias.followup.placeholder',
                    'Introduce tu codigo para ver el detalle de hitos, documentos liberados y alertas enviadas.'
                  )}
                </p>
                <span>
                  {t(
                    'denuncias.followup.placeholderHelp',
                    'Si perdiste el codigo, solicita uno nuevo en la linea segura 1574 con tu palabra clave.'
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
        <aside className={styles.trackingTips}>
          <h3>{t('denuncias.followup.tipsTitle', 'Transparencia radical')}</h3>
          <p>
            {t(
              'denuncias.followup.tipsDescription',
              'Cada acceso al expediente queda auditado por un Comite independiente y se notifica a la persona denunciante. Los reportes pueden compartirse en modo lectura para acompaantes comunitarios.'
            )}
          </p>
          <ul>
            <li>{t('denuncias.followup.tip1', 'Opciones para pausar o reactivar el expediente sin perder evidencia.')}</li>
            <li>{t('denuncias.followup.tip2', 'Descarga de constancias anonimas para presentar ante otras instituciones.')}</li>
            <li>{t('denuncias.followup.tip3', 'Registro de apoyo psicolgico y jurdico que se habilita segn el nivel de riesgo.')}</li>
          </ul>
        </aside>
      </section>

      <section className={styles.grid}>
        <article className={styles.card}>
          <h3 className={styles.cardTitle}>{t('denuncias.resources.startTitle', 'Qu necesito para iniciar?')}</h3>
          <p className={styles.description}>
            {t(
              'denuncias.resources.startDescription',
              'Puedes comenzar una denuncia aunque la informacion est incompleta. La plataforma sugiere qu datos agregar y permite adjuntar testimonios o evidencias desde tu dispositivo.'
            )}
          </p>
          <ul className={styles.checklist}>
            {requisitos.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className={`${styles.card} ${styles.cardDark}`}>
          <h3 className={styles.cardTitle}>{t('denuncias.resources.protocolTitle', 'Protocolos y confidencialidad')}</h3>
          <p className={styles.description}>
            {t(
              'denuncias.resources.protocolDescription',
              'Toda la informacion se cifra y se comparte unicamente con las instituciones autorizadas. Los datos sensibles se resguardan con medidas adicionales y se notifica cada acceso realizado.'
            )}
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
          eyebrow={t('denuncias.resources.stepsEyebrow', 'Proceso acompaante')}
          title={t('denuncias.resources.stepsTitle', 'Tres pasos claros para recibir ayuda oportuna')}
          description={t(
            'denuncias.resources.stepsDescription',
            'Visualizacin simplificada para talleres y capacitaciones en comunidades.'
          )}
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
          eyebrow={t('denuncias.resources.ctaEyebrow', 'Acompanamiento')}
          title={t('denuncias.resources.ctaTitle', 'Red de apoyo disponible 24/7')}
          description={t(
            'denuncias.resources.ctaDescription',
            'Una persona gestora te acompaa durante todo el proceso, coordina traslados si son necesarios y asegura la proteccion de tus datos.'
          )}
          actions={
            <div className={styles.ctaActions}>
              <a className={styles.ctaButton} href="#!">
                {t('denuncias.resources.ctaPrimary', 'Agendar videollamada')}
              </a>
              <a className={`${styles.ctaButton} ${styles.ctaGhost}`} href="#!">
                {t('denuncias.resources.ctaSecondary', 'Descargar materiales')}
              </a>
            </div>
          }
        />
      </section>
    </>
  );

  const panelItems = [
    {
      key: 'identity',
      title: t('denuncias.panels.identityTitle', 'Identidad y seguridad'),
      description: t(
        'denuncias.panels.identityDescription',
        'Activa modo anonimo o perfil verificado, gestiona codigos efimeros y conoce las politicas contra denuncias falsas.'
      ),
      content: identityPanelContent
    },
    {
      key: 'report',
      title: t('denuncias.panels.reportTitle', 'Denuncia y evidencia'),
      description: t(
        'denuncias.panels.reportDescription',
        'Completa el formulario guiado, adjunta evidencia protegida y revisa las medidas de anonimato recomendadas.'
      ),
      content: reportPanelContent
    },
    {
      key: 'emergency',
      title: t('denuncias.panels.emergencyTitle', 'Emergencias y asistencia IA'),
      description: t(
        'denuncias.panels.emergencyDescription',
        'Configura el boton de panico 360, recibe Acompanamiento virtual y coordina respuestas multicanal.'
      ),
      content: emergencyPanelContent
    },
    {
      key: 'followup',
      title: t('denuncias.panels.followupTitle', 'Seguimiento y recursos'),
      description: t(
        'denuncias.panels.followupDescription',
        'Consulta el estado del caso, accede a protocolos y material descargable para Acompanamiento comunitario.'
      ),
      content: followupPanelContent
    }
  ];
  return (
    <div className={styles.page}>
      <SectionHeader
        eyebrow={t('denuncias.hero.eyebrow', 'Denuncias')}
        title={t('denuncias.hero.title', 'Ruta digital para reportar incidentes y activar proteccion')}
        description={t('denuncias.hero.description', 'Diseno de experiencia centrada en la persona denunciante, con orientacion clara, accesible y Acompanamiento institucional desde el primer contacto.')}
      />

      <PanelSwitcher panels={panelItems} />
    </div>
  );
}






