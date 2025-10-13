import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

export default function ShowMoreList({
    items = [],                 // array de strings o ReactNodes
    initiallyVisible = 3,       // cuántos ítems se muestran al inicio
    moreLabel = 'Ver más',
    lessLabel = 'Ver menos',
    listClassName = '',
    itemClassName = '',
    buttonClassName = '',
}) {
    const [open, setOpen] = useState(false);

    const head = useMemo(() => items.slice(0, initiallyVisible), [items, initiallyVisible]);
    const tail = useMemo(() => items.slice(initiallyVisible), [items, initiallyVisible]);

    return (
        <div>
            <ul className={listClassName}>
                {head.map((node, i) => (
                    <li key={`head-${i}`} className={itemClassName}>
                        {typeof node === 'string' ? <span>{node}</span> : node}
                    </li>
                ))}
            </ul>

            {tail.length > 0 && (
                <>
                    {open && (
                        <ul className={listClassName}>
                            {tail.map((node, i) => (
                                <li key={`tail-${i}`} className={itemClassName}>
                                    {typeof node === 'string' ? <span>{node}</span> : node}
                                </li>
                            ))}
                        </ul>
                    )}

                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className={buttonClassName}
                        aria-expanded={open}
                    >
                        {open ? lessLabel : moreLabel}
                    </button>
                </>
            )}
        </div>
    );
}

ShowMoreList.propTypes = {
    items: PropTypes.array,
    initiallyVisible: PropTypes.number,
    moreLabel: PropTypes.string,
    lessLabel: PropTypes.string,
    listClassName: PropTypes.string,
    itemClassName: PropTypes.string,
    buttonClassName: PropTypes.string,
};
