import { useState } from "react";
import styles from "@/styles/PanelSwitcher.module.css";

const cx = (...values) => values.filter(Boolean).join(" ");

export default function PanelSwitcher({ panels, initialIndex = 0, className }) {
  const safePanels = Array.isArray(panels) ? panels : [];
  const [activeIndex, setActiveIndex] = useState(() => {
    if (initialIndex >= 0 && initialIndex < safePanels.length) {
      return initialIndex;
    }
    return 0;
  });

  if (!safePanels.length) {
    return null;
  }

  const handleChange = (index) => {
    setActiveIndex(index);
  };

  const activePanel = safePanels[activeIndex] ?? safePanels[0];

  return (
    <div className={cx(styles.switcher, className)}>
      <div className={styles.controls} role="tablist" aria-label={activePanel?.groupLabel ?? "Panel selector"}>
        {safePanels.map((panel, index) => (
          <button
            key={panel.key ?? panel.title ?? index}
            type="button"
            className={cx(styles.controlButton, index === activeIndex && styles.controlButtonActive)}
            onClick={() => handleChange(index)}
            role="tab"
            aria-selected={index === activeIndex}
          >
            <span>{panel.title ?? `Panel ${index + 1}`}</span>
            {panel.badge ? <span className={styles.controlBadge}>{panel.badge}</span> : null}
          </button>
        ))}
      </div>

      <div className={styles.panel} role="tabpanel">
        {activePanel.description ? <p className={styles.panelDescription}>{activePanel.description}</p> : null}
        <div className={styles.panelContent}>{activePanel.content}</div>
      </div>
    </div>
  );
}
