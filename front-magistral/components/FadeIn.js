import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

function isInView(el) {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const vw = window.innerWidth || document.documentElement.clientWidth;
    // margen de tolerancia para no exigir intersección perfecta
    return r.top < vh * 0.9 && r.bottom > vh * 0.1 && r.left < vw && r.right > 0;
}

/**
 * FadeIn
 * - repeat: si true, oculta/muestra según scroll (re-animable)
 * - delay: ms
 * - duration: ms
 * - distance: px de translateY inicial
 * - as: tipo de elemento (div, article, li, etc.)
 * - root: opcional (ref a contenedor scrolleable). Si no se pasa, usa viewport (window).
 */
export default function FadeIn({
    children,
    as: Tag = 'div',
    className = '',
    style,
    delay = 0,
    duration = 420,
    distance = 12,
    repeat = false,
    root = null, // ref de contenedor con overflow (opcional)
    ...rest
}) {
    const ref = useRef(null);
    const [shown, setShown] = useState(false);

    // estilos de transición controlados por estado
    const composedStyle = useMemo(() => {
        const base = {
            opacity: shown ? 1 : 0,
            transform: shown ? 'none' : `translateY(${distance}px)`,
            transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
            transitionDelay: `${delay}ms`,
            willChange: 'opacity, transform',
        };
        return style ? { ...base, ...style } : base;
    }, [shown, distance, duration, delay, style]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // 1) Chequeo inmediato en montaje (por si el panel se activa visible)
        if (isInView(el)) setShown(true);

        // 2) IntersectionObserver estándar
        let observer;
        if (!shown) {
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setShown(true);
                            if (!repeat && observer) observer.disconnect();
                        } else if (repeat) {
                            setShown(false);
                        }
                    });
                },
                {
                    root: root?.current || null, // si pasas un contenedor con overflow, úsalo
                    threshold: 0.1,
                    rootMargin: '0px 0px -10% 0px',
                }
            );
            observer.observe(el);
        }

        // 3) Fallbacks por cambios de layout/visibilidad o scroll en contenedores
        const onTick = () => {
            if (!shown && isInView(el)) setShown(true);
            else if (repeat && shown && !isInView(el)) setShown(false);
        };

        window.addEventListener('resize', onTick);
        // true: evento en captura para detectar scrolls de contenedores padres
        window.addEventListener('scroll', onTick, true);
        document.addEventListener('visibilitychange', onTick);

        return () => {
            if (observer) observer.disconnect();
            window.removeEventListener('resize', onTick);
            window.removeEventListener('scroll', onTick, true);
            document.removeEventListener('visibilitychange', onTick);
        };
    }, [repeat, shown, root]);

    return (
        <Tag ref={ref} className={className} style={composedStyle} {...rest}>
            {children}
        </Tag>
    );
}

FadeIn.propTypes = {
    children: PropTypes.node,
    as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
    className: PropTypes.string,
    style: PropTypes.object,
    delay: PropTypes.number,
    duration: PropTypes.number,
    distance: PropTypes.number,
    repeat: PropTypes.bool,
    root: PropTypes.shape({ current: PropTypes.any }),
};
