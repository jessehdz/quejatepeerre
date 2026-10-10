import { useState, useEffect } from 'react';

const KEY = 'qpr-theme';
const systemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

function apply(pref) {
    const t = pref === 'system' ? systemTheme() : pref;
    document.documentElement.dataset.theme = t;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'dark' ? '#0E2B2A' : '#E8E5D2');
}

export function useTheme() {
    const [pref, setPref] = useState(() => localStorage.getItem(KEY) || 'system');

    useEffect(() => {
        apply(pref);
        if (pref === 'system') localStorage.removeItem(KEY);
        else localStorage.setItem(KEY, pref);
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const onChange = () => pref === 'system' && apply('system');
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, [pref]);

    return [pref, setPref];
}

// for components that react to the theme
export function useNewTheme() {
    const [theme, setTheme] = useState(() => 
        document.documentElement.dataset.theme || 'dark');
        useEffect(() => {
            const obs = new MutationObserver(() => setTheme(document.documentElement.dataset.theme || 'dark'));
            obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
            return () => obs.disconnect();
        }, []);
        return theme;
}