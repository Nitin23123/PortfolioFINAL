/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // noth.in monochrome system
                ink: '#000000',        // pure black — dark sections, text on light
                paper: '#FFFFFF',      // pure white — light sections, text on dark
                greige: '#E3E1DE',     // warm gray — secondary surface
                go: '#0BA954',         // THE only color: availability dot

                // metadata grays (AA-safe per background)
                meta: '#6B6B6B',       // mono labels on white (≥4.5:1)
                'meta-dark': '#8E8E8E', // mono labels on black (≥5:1)

                // legacy aliases kept so untouched utilities don't break
                background: '#FFFFFF',
                foreground: '#000000',
                muted: '#6B6B6B',
            },
            fontFamily: {
                sans: ['Inter', 'Arial', 'sans-serif'],
                mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
            },
            fontSize: {
                // poster-scale fluid display sizes (clamp = accessible 1vw trick)
                'display': ['clamp(3rem, 9vw, 10rem)', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
                'display-sm': ['clamp(2rem, 5vw, 5rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
                'label': ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.03em' }],
            },
            letterSpacing: {
                tightest: '-0.05em',
                display: '-0.03em',
            },
            borderRadius: {
                pill: '6.25rem',
            },
            transitionTimingFunction: {
                'out-expo': 'cubic-bezier(0.22, 1, 0.36, 1)',
            },
        },
    },
    plugins: [],
}
