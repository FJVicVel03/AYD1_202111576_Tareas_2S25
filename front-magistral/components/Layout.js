import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LanguageContext } from "@/contexts/LanguageContext";
import styles from "@/styles/Layout.module.css";

const navLinks = [
  { href: "/", key: "home" },
  { href: "/mapa", key: "mapa" },
  { href: "/observatorio", key: "observatorio" },
  { href: "/denuncias", key: "denuncias" },
  { href: "/revisiones", key: "revisiones" },
  { href: "/notificaciones", key: "notificaciones" },
  { href: "/colaboracion", key: "colaboracion" },
  { href: "/perfil", key: "perfil" },
  { href: "/mockups", key: "mockups" }
];

const languageOptions = [{ value: "es" }, { value: "en" }, { value: "qu" }, { value: "kaq" }];

const translationsByLanguage = {
  es: {
    languages: { es: "Espanol", en: "Ingles", qu: "Kiche", kaq: "Kaqchikel" },
    nav: {
      home: "Inicio",
  mapa: "Mapa Seguro",
      observatorio: "Observatorio",
      denuncias: "Denuncias",
      revisiones: "Revisiones",
  notificaciones: "Notificaciones",
      colaboracion: "Colaboracion",
      perfil: "Perfil",
      mockups: "Mockups"
    },
    layout: {

      languageLabel: "Idioma",
      voiceAssist: "Modo voz",
      quickExit: "Salida rapida",
      quickExitAria: "Salir rapidamente a un sitio seguro",
      report: "Reportar incidente",
    },
    home: {
      hero: {
        subtitle: "Estrategia integral de prevencion y respuesta",
        title: "Seguridad ciudadana informada, colaborativa y centrada en las personas.",
        description:
          "Plataforma para monitorear indicadores de violencia, coordinar instituciones y activar la participacion ciudadana en tiempo real.",
        primaryCta: "Explorar datos en vivo",
        secondaryCta: "Conectar con la comunidad"
      },
      modules: {
        eyebrow: "Modulos principales",
        title: "Ecosistema digital para decisiones rapidas y coordinadas",
        description:
          "Prototipo de navegacion para articular instituciones publicas, municipalidades y ciudadania en la gestion de la seguridad."
      },
      inclusion: {
        eyebrow: "Inclusion y accesibilidad",
        title: "Tecnologia pensada para todas las personas",
        description:
          "Multilingue, soporte por voz y alertas multicanal para reducir brechas de alfabetizacion digital."
      },
      roadmap: {
        eyebrow: "Gestion agil",
        title: "Roadmap incremental y foco en valor",
        description:
          "Priorizamos un MVP medible, iteraciones quincenales y KPIs que guian la expansion del ecosistema.",
        storiesTitle: "Historias de usuario prioritarias",
        kpisTitle: "Indicadores de exito"
      }
    },
    denuncias: {
      hero: {
        eyebrow: "Denuncias",
        title: "Ruta digital para reportar incidentes y activar proteccion",
        description:
          "Diseno centrado en la persona denunciante, con orientacion clara, accesible y acompanamiento institucional."
      },
      identity: {
        title: "Control de identidad flexible",
        description:
          "El anonimato total es la configuracion predeterminada. Puedes activar tu perfil verificado cuando quieras sin perder el codigo seguro ni las evidencias asociadas.",
        note:
          "Aun con tu perfil verificado puedes alternar a modo anonimo antes de enviar la denuncia. Solo el equipo auditor conoce tu identidad y cada acceso queda notificado."
      },
      penalty: {
        title: "Advertencia sobre denuncias falsas",
        description:
          "El sistema cruza la informacion con unidades especializadas. Reportes maliciosos activan bloqueos de cuenta y pueden trasladarse al Ministerio Publico."
      },
      emergency: {
        title: "Boton de emergencia en campo",
        description:
          "Pensado para escenarios de riesgo inmediato. Se activa desde la interfaz, con botones fisicos o gestos configurables.",
        permitsTitle: "Permisos y seguridad tecnica",
        configure: "Configurar accesos",
        simulation: "Probar simulacro"
      },
      assistant: {
        title: "Asistente virtual IA",
        description:
          "Chat seguro que ofrece acompanamiento emocional, materiales educativos y derivacion a profesionales cuando detecta senales de riesgo.",
        followupTitle: "Escalonamiento y seguimiento",
        startChat: "Iniciar chat de apoyo",
        whatsapp: "Configurar alertas WhatsApp",
        guides: "Ver guias de autocuidado"
      }
    }
  },
  en: {
    languages: { es: "Spanish", en: "English", qu: "Kiche", kaq: "Kaqchikel" },
    nav: {
      home: "Home",
  mapa: "Safe Map",
      observatorio: "Observatory",
      denuncias: "Reports",
      revisiones: "Reviews",
  notificaciones: "Notifications",
      colaboracion: "Collaboration",
      perfil: "Profile",
      mockups: "Mockups"
    },
    layout: {
      tagline: "Digital ecosystem for safer communities",
      languageLabel: "Language",
      voiceAssist: "Voice mode",
      quickExit: "Quick exit",
      quickExitAria: "Leave the site and open a safe page",
      report: "Report incident",
    },
    home: {
      hero: {
        subtitle: "Integrated strategy for prevention and response",
        title: "Informed, collaborative and human centered public safety.",
        description:
          "A platform to monitor violence indicators, coordinate institutions and engage citizens in real time.",
        primaryCta: "Explore live data",
        secondaryCta: "Connect with the community"
      },
      modules: {
        eyebrow: "Core modules",
        title: "Digital ecosystem for fast and coordinated decisions",
        description:
          "Navigation prototype that connects public institutions, municipalities and citizens around security management."
      },
      inclusion: {
        eyebrow: "Inclusion and accessibility",
        title: "Technology designed for everyone",
        description:
          "Multilingual interface, voice guidance and multichannel alerts to bridge digital literacy gaps."
      },
      roadmap: {
        eyebrow: "Agile management",
        title: "Incremental roadmap focused on value",
        description:
          "A measurable MVP, biweekly iterations and KPIs that steer the program scaling.",
        storiesTitle: "Priority user stories",
        kpisTitle: "Success metrics"
      }
    },
    denuncias: {
      hero: {
        eyebrow: "Reports",
        title: "Digital pathway to report incidents and trigger protection",
        description:
          "Experience designed around the reporter with clear guidance, accessibility and institutional follow up."
      },
      identity: {
        title: "Flexible identity control",
        description:
          "Anonymous mode is enabled by default. Switch to a verified profile without losing the secure code or attached evidence.",
        note:
          "Even with a verified profile you can return to anonymous mode before submitting. Only the audit team sees your identity and every access is notified."
      },
      penalty: {
        title: "Warning about false reports",
        description:
          "Information is cross checked with specialized units. Malicious reports can lead to account blocks and referrals to the Public Ministry."
      },
      emergency: {
        title: "Field emergency button",
        description:
          "Designed for immediate risk scenarios. Trigger it from the UI, via hardware combos or configured gestures.",
        permitsTitle: "Permissions and safeguards",
        configure: "Configure access",
        simulation: "Run drill"
      },
      assistant: {
        title: "Virtual assistant AI",
        description:
          "Secure chat for emotional support, educational material and escalation to professionals when high risk language is detected.",
        followupTitle: "Escalation and follow up",
        startChat: "Start support chat",
        whatsapp: "Configure WhatsApp alerts",
        guides: "View self care guides"
      }
    }
  },
  qu: {
    languages: { es: "Kiche", en: "English", qu: "Kiche", kaq: "Kaqchikel" },
    nav: {
      home: "Tikirisaxik",
  mapa: "Mapa Seguro",
      observatorio: "Kitzij nikaj",
      denuncias: "Kitzij kamolo",
      revisiones: "Revisiones",
  notificaciones: "Notificaciones",
      colaboracion: "Kibanonem",
      perfil: "Kikolel",
      mockups: "Ruwachulew"
    },
    layout: {
      tagline: "Tz aqatal qachakulal richin jikib an ri qatetamanik",
      languageLabel: "Chabal",
      voiceAssist: "Qijomal tzij",
      quickExit: "Rutexik aninaq",
      quickExitAria: "Rutexik pa jun ruxaq aninaq",
      report: "Tatzijon kitzij",
    },
    home: {
      hero: {
        subtitle: "[Kiche] Kinb antaj ri qachoch",
        title: "[Kiche] Qachoch qak ulmataj richin chajin",
        description:
          "[Kiche] Wachib al richin nikomonij rutzijol, nikak utuj ri taq qamolonel chuqa qatinamit.",
        primaryCta: "[Kiche] Ke atz et taq kitzij",
        secondaryCta: "[Kiche] Katunak ri tinamit"
      },
      modules: {
        eyebrow: "[Kiche] Taq ruk aslemal",
        title: "[Kiche] Wachib al richin qachakunel",
        description:
          "[Kiche] Nikikomonij ri taq ajtikonel, tinamit chuqa winaqi pa chajin."
      },
      inclusion: {
        eyebrow: "[Kiche] Junam",
        title: "[Kiche] Kachoch richin ronojel",
        description:
          "[Kiche] Chabal, tzij pa qojom chuqa taq kitzijol WhatsApp/SMS."
      },
      roadmap: {
        eyebrow: "[Kiche] Runuk jun",
        title: "[Kiche] Roq onem richin qachakulal",
        description:
          "[Kiche] MVP nimalaj, jalajoj samaj chuqa taq pitz ib al richin jikib an ri ruk aslemal.",
        storiesTitle: "[Kiche] Taq rutzijol winq",
        kpisTitle: "[Kiche] Taq pitz ib al"
      }
    },
    denuncias: {
      hero: {
        eyebrow: "[Kiche] Kitzij",
        title: "[Kiche] Rub ey richin kitzij",
        description:
          "[Kiche] K aslemal rik in aj winq ri nuchajij."
      },
      identity: {
        title: "[Kiche] Rub anik k aslemal",
        description:
          "[Kiche] Rutzij anomino k o pa xe, ri rub anik yatik onaj richin nawajo'.",
        note:
          "[Kiche] We rub anik, yatikitojtob a chi atzolin pa anomino chuwach natzij."
      },
      penalty: {
        title: "[Kiche] Rutzijol man k achakul",
        description:
          "[Kiche] Ri tzij nikomonij ri keb an, ja ri, yetam pa Ministerio Publico."
      },
      emergency: {
        title: "[Kiche] Ruboton qamal",
        description:
          "[Kiche] Nikikamisaj pa q ichin qak ux. Tikatz ij pa wachib al, ruk ab al o tz olaj.",
        permitsTitle: "[Kiche] Taq ya",
        configure: "[Kiche] Titz ij",
        simulation: "[Kiche] Tz aqobil"
      },
      assistant: {
        title: "[Kiche] Ajtijonel IA",
        description:
          "[Kiche] Chat jikomal richin kachamanel, kitzijol chuqa kitzijoj q ajchak.",
        followupTitle: "[Kiche] Rutz aqal",
        startChat: "[Kiche] Titikirisaj chat",
        whatsapp: "[Kiche] Titz ij WhatsApp",
        guides: "[Kiche] Ke atz et soltzijol"
      }
    }
  },
  kaq: {
    languages: { es: "Espanol", en: "English", qu: "Kiche", kaq: "Kaqchikel" },
    nav: {
      home: "Rutikirisaxik",
  mapa: "Mapa Seguro",
      observatorio: "Ruk at q ij",
      denuncias: "Rutzijol",
      revisiones: "Revisiones",
  notificaciones: "Notificaciones",
      colaboracion: "Kaqk utunik",
      perfil: "Rubanikil",
      mockups: "Ruwachulew"
    },
    layout: {
      tagline: "Jun rukux qachoch richin chajin qate tamabal",
      languageLabel: "Chab al",
      voiceAssist: "Rutzij pa qojom",
      quickExit: "Tel pa yalan",
      quickExitAria: "Tel pa jun ruxaq aninaq",
      report: "Tatzijon b iaj",
    },
    home: {
      hero: {
        subtitle: "[Kaqchikel] Roq onem richin qachoch",
        title: "[Kaqchikel] Chajin qachoch ronojel",
        description:
          "[Kaqchikel] Wachib al richin nikib ij taq rutzijol, nikakojol ri taq qamolonel.",
        primaryCta: "[Kaqchikel] Ke atz et tzij",
        secondaryCta: "[Kaqchikel] Katik oj ri tinamit"
      },
      modules: {
        eyebrow: "[Kaqchikel] Taq ruk aslemal",
        title: "[Kaqchikel] Qak aslemal richin qachakun",
        description:
          "[Kaqchikel] Nikakojol ri ajtikonel, taq tinamit chuqa winaqi."
      },
      inclusion: {
        eyebrow: "[Kaqchikel] Junam",
        title: "[Kaqchikel] K aslemal chi ronojel",
        description:
          "[Kaqchikel] Chab al, tzij pa qojom chuqa kitzijol WhatsApp/SMS."
      },
      roadmap: {
        eyebrow: "[Kaqchikel] Runuk jun",
        title: "[Kaqchikel] Roq onem richin ruwachib al",
        description:
          "[Kaqchikel] MVP, jalajoj samaj chuqa taq pitz ib al pwaq.",
        storiesTitle: "[Kaqchikel] Rutzijol winak",
        kpisTitle: "[Kaqchikel] Pitz ib al"
      }
    },
    denuncias: {
      hero: {
        eyebrow: "[Kaqchikel] Rutzijol",
        title: "[Kaqchikel] Rub ey richin kitzij",
        description:
          "[Kaqchikel] Rutz etal richin ri winak pa tz ij qama.",
      },
      identity: {
        title: "[Kaqchikel] Rubanikil qachoch",
        description:
          "[Kaqchikel] Anomino k o pa xe, ri rubanikil ya talon richin natz ij ju.",
        note:
          "[Kaqchikel] Tikirel natzolin pa anomino chuwach natzij."
      },
      penalty: {
        title: "[Kaqchikel] Tzij man qachakul",
        description:
          "[Kaqchikel] Ri tzij nikib ij chi ri Ministerio Publico."
      },
      emergency: {
        title: "[Kaqchikel] Ruboton qamal",
        description:
          "[Kaqchikel] Nikatzij pa wachib al, ruk ab al o tz olaj.",
        permitsTitle: "[Kaqchikel] Ya taq tzij",
        configure: "[Kaqchikel] Tib an",
        simulation: "[Kaqchikel] Tz aqobil"
      },
      assistant: {
        title: "[Kaqchikel] Ajtijonel IA",
        description:
          "[Kaqchikel] Chat richin chajin qak ux, kitzijol chuqa kitzijoj ajchak.",
        followupTitle: "[Kaqchikel] Rutz aqal",
        startChat: "[Kaqchikel] Titikirisaj chat",
        whatsapp: "[Kaqchikel] Tib an WhatsApp",
        guides: "[Kaqchikel] Ke atz et soltzijol"
      }
    }
  }
};

const getNestedValue = (obj, key) =>
  key.split(".").reduce((acc, segment) => (acc && acc[segment] !== undefined ? acc[segment] : undefined), obj);

export default function Layout({ children }) {
  const router = useRouter();
  const [language, setLanguage] = useState("es");

  const translations = useMemo(() => translationsByLanguage, []);

  const t = useCallback(
    (key, fallback = "") => {
      const languagePack = translations[language] ?? translations.es;
      const translation = getNestedValue(languagePack, key);
      if (typeof translation === "string") {
        return translation;
      }
      return fallback || key;
    },
    [language, translations]
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const handleQuickExit = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.clear();
      window.sessionStorage.clear();
    } catch (error) {
      // Ignorar si el entorno restringe el acceso.
    }
    const safeUrl = "https://www.pnc.gob.gt/";
    window.open(safeUrl, "_blank", "noopener,noreferrer");
    window.location.replace(safeUrl);
  }, []);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles.branding}>
            <div className={styles.logoGroup}>
              <Image src={`${router.basePath || ""}/logo.svg`} alt="SeguridadGT logo" width={40} height={40} priority />
              <span className={styles.logo}>SeguridadGT</span>
            </div>

          </div>
          <nav className={styles.nav}>
            {navLinks.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                >
                  {t(`nav.${link.key}`, link.key)}
                </Link>
              );
            })}
          </nav>
          <div className={styles.actions}>
            <div className={styles.languageSwitch}>
              <label className={styles.languageLabel} htmlFor="language-toggle">
                
              </label>
              <select
                id="language-toggle"
                className={styles.languageSelect}
                value={language}
                onChange={handleLanguageChange}
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(`languages.${option.value}`, option.value.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <button type="button" className={styles.voiceAssist}>
              {t("layout.voiceAssist", "Modo voz")}
            </button>
            <button
              type="button"
              className={styles.quickExit}
              onClick={handleQuickExit}
              aria-label={t("layout.quickExitAria", "Salir rapidamente a un sitio seguro")}
            >
              {t("layout.quickExit", "Salida rapida")}
            </button>
            <Link className={styles.cta} href="/denuncias">
              {t("layout.report", "Reportar incidente")}
            </Link>
          </div>
        </header>

        <main className={styles.main}>{children}</main>

        <footer className={styles.footer}>
          <div>
            <strong>SeguridadGT</strong> - Prototipo para iniciativas de seguridad ciudadana en Guatemala.
          </div>
          <div className={styles.footerLinks}>
            <a href="#!">Privacidad</a>
            <a href="#!">Terminos</a>
            <a href="#!">Soporte</a>
          </div>
        </footer>
      </div>
    </LanguageContext.Provider>
  );
}

