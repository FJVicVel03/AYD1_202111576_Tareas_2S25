import styles from '@/styles/SectionHeader.module.css';

export default function SectionHeader({ eyebrow, title, description, actions }) {
  return (
    <div className={styles.wrapper}>
      <div>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
