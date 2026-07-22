import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import Providers, { useCapabilities, markLoaderSeen } from './app/providers';
import { useExperience, experienceActions } from './state/experienceStore';
import { SCENES } from './scenes/registry';

import S00Loader from './scenes/S00Loader/S00Loader';
import Intermission from './scenes/Intermission/Intermission';
import S01Hero from './scenes/S01Hero/S01Hero';
import S02Evidence from './scenes/S02Evidence/S02Evidence';
import S03Author from './scenes/S03Author/S03Author';
import S04Invitation from './scenes/S04Invitation/S04Invitation';
import S05Credits from './scenes/S05Credits/S05Credits';

/**
 * Tracks which registry scene occupies the frame and writes it to the
 * store (~once per scene change — well under the 1Hz state budget).
 * The Intermission reads it to mark the current plate.
 */
const useActiveSceneTracking = (enabled) => {
    useEffect(() => {
        if (!enabled) return undefined;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) experienceActions.setActiveScene(entry.target.id);
                });
            },
            { threshold: 0.25 },
        );

        SCENES.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [enabled]);
};

/**
 * The film. Scene 00 gates it once per session; the Intermission
 * floats above every frame; the reels run in registry order.
 */
const Film = () => {
    const phase = useExperience((s) => s.phase);
    const { reducedMotion } = useCapabilities();
    const skipLoader = reducedMotion;

    useEffect(() => {
        if (skipLoader) experienceActions.ready();
    }, [skipLoader]);

    // The page holds still while the count runs.
    useEffect(() => {
        if (phase === 'ready') return undefined;
        const { documentElement } = document;
        const previous = documentElement.style.overflow;
        documentElement.style.overflow = 'hidden';
        return () => {
            documentElement.style.overflow = previous;
        };
    }, [phase]);

    useActiveSceneTracking(phase === 'ready');

    const handleLoaderComplete = () => {
        markLoaderSeen();
        experienceActions.ready();
    };

    return (
        <div className="bg-paper min-h-screen text-ink font-sans">
            <AnimatePresence>
                {phase === 'loading' && !skipLoader && (
                    <S00Loader key="s00" onComplete={handleLoaderComplete} />
                )}
            </AnimatePresence>

            {phase === 'ready' && (
                <>
                    <Intermission />
                    <S01Hero />
                    <S02Evidence />
                    <S03Author />
                    <S04Invitation />
                    <S05Credits />
                </>
            )}
        </div>
    );
};

const App = () => (
    <Providers>
        <Film />
    </Providers>
);

export default App;
