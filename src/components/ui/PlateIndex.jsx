import Reveal from '../../motion/Reveal';
import { DUR } from '../../motion/tokens';
import { plateLabel } from '../../scenes/registry';

/**
 * PlateIndex — the Machine-voice rail that opens every plate:
 * `( 01 ) — EVIDENCE` left, an optional annotation right. Sticky, so
 * it rides the scroll as diegetic wayfinding.
 *
 * @param {object} props
 * @param {string} props.id     registry scene id
 * @param {string} [props.note] right-hand annotation
 * @param {boolean} [props.dark] true on ink-field scenes
 */
const PlateIndex = ({ id, note, dark = false }) => {
    const voice = dark ? 'label-dark' : 'label-light';

    return (
        <Reveal
            as="p"
            duration={DUR.plate}
            className={`${voice} sticky top-8 z-20 mb-16 md:mb-24 flex items-center justify-between gap-4 pr-16 md:pr-28`}
        >
            <span>{plateLabel(id)}</span>
            {note ? <span className="hidden md:block">{note}</span> : null}
        </Reveal>
    );
};

export default PlateIndex;
