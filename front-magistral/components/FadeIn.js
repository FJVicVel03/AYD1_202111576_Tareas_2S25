// components/FadeIn.jsx
import React from "react";
import useInView from "@/hooks/useInView";
import styles from "@styles/Home.module.css";

/**
 * Componente de revelado con fade + slide.
 *
 * Props:
 *  - as: string | React.ElementType  (por defecto "div")
 *  - delay: number                   (ms para escalonar; por defecto 0)
 *  - className: string               (clases adicionales)
 *  - repeat: boolean                 (si true, re-anima cada vez que entra al viewport)
 *  - ioOptions: object               (opciones para IntersectionObserver: { root, rootMargin, threshold })
 *  - children: ReactNode
 */
export default function FadeIn({
    as: Tag = "div",
    delay = 0,
    className = "",
    repeat = false,
    ioOptions, // opcional: { root, rootMargin, threshold }
    children,
    ...rest
}) {
    // once = !repeat → si repeat=true, vuelve a animar en cada entrada al viewport
    const { ref, visible } = useInView({
        once: !repeat,
        ...(ioOptions || {}), // permite ajustar rootMargin/threshold puntualmente
    });

    return (
        <Tag
            ref={ref}
            className={[
                styles.fadeInBase,
                visible ? styles.fadeInVisible : "",
                className,
            ].filter(Boolean).join(" ")}
            style={{ transitionDelay: `${delay}ms` }}
            {...rest}
        >
            {children}
        </Tag>
    );
}
