import { useState } from "react";
import styles from "@/styles/PanelSwitcher.module.css";

const cx = (...values) => values.filter(Boolean).join(" ");

export default function PanelSwitcher({ panels, initialIndex = 0, className }) {
  const safePanels = Array.isArray(panels) ? panels : [];

  const [activeIndex, setActiveIndex] = useState(() => {
    if (initialIndex >= 0 && initialIndex < safePanels.length) return initialIndex;
    return 0;
  });

  if (!safePanels.length) return null;

  const handleChange = (index) => setActiveIndex(index);

  const activePanel = safePanels[activeIndex] ?? safePanels[0];
  const panelKey = activePanel?.key ?? activePanel?.title ?? `panel-${activeIndex}`;
  const tablistLabel = activePanel?.groupLabel ?? "Panel selector";

  return (
    <div className={cx(styles.switcher, className)}>
      {/* Tabs */}
      <div className={styles.controls} role="tablist" aria-label={tablistLabel}>
        {safePanels.map((panel, index) => {
          const key = panel.key ?? panel.title ?? index;
          const isActive = index === activeIndex;
          const tabId = `tab-${key}`;
          const panelId = `panel-${key}`;
          return (
            <button
              key={key}
              type="button"
              className={cx(styles.controlButton, isActive && styles.controlButtonActive)}
              onClick={() => handleChange(index)}
              role="tab"
              id={tabId}
              aria-selected={isActive}
              aria-controls={panelId}
            >
              <span>{panel.title ?? `Panel ${index + 1}`}</span>
              {panel.badge ? <span className={styles.controlBadge}>{panel.badge}</span> : null}
            </button>
          );
        })}
      </div>

      {/* Panel activo — con key para forzar remount al cambiar de pestaña */}
      <div
        className={styles.panel}
        role="tabpanel"
        key={panelKey}                // <- fuerza remount (crítico para FadeIn)
        id={`panel-${panelKey}`}
        aria-labelledby={`tab-${panelKey}`}
      >
        {activePanel.description ? (
          <p className={styles.panelDescription}>{activePanel.description}</p>
        ) : null}
        <div className={styles.panelContent}>
          {activePanel.content}
        </div>
      </div>
    </div>
  );
}
