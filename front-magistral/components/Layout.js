import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import styles from '@/styles/Layout.module.css';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/observatorio', label: 'Observatorio' },
  { href: '/denuncias', label: 'Denuncias' },
  { href: '/colaboracion', label: 'Colaboracion' },
  { href: '/perfil', label: 'Perfil' },
  { href: '/mockups', label: 'Mockups' }
];

export default function Layout({ children }) {
  const router = useRouter();
  const handleQuickExit = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.clear();
      window.sessionStorage.clear();
    } catch (error) {
      // Opcional: ignorar si el entorno bloquea el acceso.
    }
    const safeUrl = 'https://www.pnc.gob.gt/';
    // Abre una pestaña neutra y redirige la actual.
    window.open(safeUrl, '_blank', 'noopener,noreferrer');
    window.location.replace(safeUrl);
  }, []);

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.branding}>
          <div className={styles.logoGroup}>
            <Image src={`${router.basePath || ''}/logo.svg`} alt="SeguridadGT logo" width={40} height={40} priority />
            <span className={styles.logo}>SeguridadGT</span>
          </div>
          <span className={styles.tagline}>Ecosistema digital para comunidades seguras</span>
        </div>
        <nav className={styles.nav}>
          {navLinks.map((link) => {
            const isActive = router.pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.quickExit}
            onClick={handleQuickExit}
            aria-label="Salir rapidamente a un sitio seguro"
          >
            Salida rapida
          </button>
          <div className={styles.safetyCopy}>
            <span className={styles.safetyDot} />
            Navegacion segura
          </div>
          <Link className={styles.cta} href="/denuncias">
            Reportar incidente
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
  );
}
