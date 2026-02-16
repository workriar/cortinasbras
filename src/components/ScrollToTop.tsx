'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
    const pathname = usePathname();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth',
            });
        }, 500); // Atraso aumentado para 500ms solicitado pelo usuário

        return () => clearTimeout(timeoutId);
    }, [pathname]);

    return null;
}
