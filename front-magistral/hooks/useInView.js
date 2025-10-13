import { useEffect, useRef, useState } from "react";

/**
 * @param {object} options IntersectionObserver options + control:
 *  - root, rootMargin, threshold (IO)
 *  - once: boolean (true = dispara 1 sola vez y se desuscribe; false = entra/sale re-animable)
 */
export default function useInView(
    { root = null, rootMargin = "0px", threshold = 0.1, once = true } = {}
) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined" || !ref.current) return;

        const el = ref.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    if (once) observer.unobserve(el); // una sola vez
                } else if (!once) {
                    // cuando sale del viewport, permite re-animar al volver a entrar
                    setVisible(false);
                }
            },
            { root, rootMargin, threshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [root, rootMargin, threshold, once]);

    return { ref, visible };
}