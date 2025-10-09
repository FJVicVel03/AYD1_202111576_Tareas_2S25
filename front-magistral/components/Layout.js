import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@/styles/Layout.module.css';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/observatorio', label: 'Observatorio' },
  { href: '/denuncias', label: 'Denuncias' },
  { href: '/colaboracion', label: 'Colaboracion' },
  { href: '/mockups', label: 'Mockups' }
];

export default function Layout({ children }) {
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.branding}>
          <div className={styles.logoGroup}>
            <Image src="/logo.svg" alt="SeguridadGT logo" width={40} height={40} priority />
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
        <Link className={styles.cta} href="/denuncias">
          Reportar incidente
        </Link>
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
