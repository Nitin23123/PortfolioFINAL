import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperience, experienceActions } from '../state/experienceStore';
import { SITE } from '../content/site';
import { PROJECTS } from '../content/projects';
import { CAPABILITIES } from '../content/capabilities';
import { BIO, FACTS } from '../content/roles';

const QUICK_COMMANDS = ['help', 'skills', 'projects', 'card', 'bio', 'contact', 'resume', 'hire', 'clear'];

const INITIAL_GREETING = [
    {
        type: 'banner',
        content: `
   _  __________ ____  _    ____  _____ 
  / |/ /  _/_  //  _/ | |  / / / / / _ \\
 /    // /  / / _/ /  | | / / /_/ / // /
/_/|_/___/ /_/ /___/  |___/\\____/____/  
       [NITIN TANWAR // VS CODE TERMINAL v2.6]`,
    },
    {
        type: 'info',
        content: 'Type "help" for commands, or click quick actions below. Press ⌘K or ESC to minimize.',
    },
];

const DeveloperTerminal = () => {
    const terminalOpen = useExperience((s) => s.terminalOpen);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState(INITIAL_GREETING);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [commandHistory, setCommandHistory] = useState([]);
    const [isMaximized, setIsMaximized] = useState(false);
    const [activeTab, setActiveTab] = useState('terminal');
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    // Global Cmd+K / Ctrl+K and Backtick shortcut handler
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                experienceActions.toggleTerminal();
            } else if (e.key === '`' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
                e.preventDefault();
                experienceActions.toggleTerminal();
            } else if (e.key === 'Escape' && terminalOpen) {
                experienceActions.closeTerminal();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [terminalOpen]);

    // Auto-focus input and scroll down when terminal opens or history updates
    useEffect(() => {
        if (terminalOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [terminalOpen]);

    useEffect(() => {
        if (terminalOpen) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history, terminalOpen]);

    const executeCommand = (rawCmd) => {
        const cmd = rawCmd.trim().toLowerCase();
        if (!cmd) return;

        setCommandHistory((prev) => [...prev, rawCmd]);
        setHistoryIndex(-1);

        const newEntries = [{ type: 'command', content: rawCmd }];

        switch (cmd) {
            case 'help':
                newEntries.push({
                    type: 'output',
                    content: (
                        <div className="space-y-1 text-xs md:text-sm text-[#ECEAE5]">
                            <p className="text-[#DA7756] font-bold tracking-wide">AVAILABLE COMMANDS:</p>
                            <div className="grid grid-cols-[8.5rem_1fr] gap-x-4 gap-y-1 pt-1">
                                <span className="text-[#FAF9F5] font-semibold">skills / stack</span>
                                <span className="text-[#9C9A92]">Technical skills & system architecture</span>

                                <span className="text-[#FAF9F5] font-semibold">projects / work</span>
                                <span className="text-[#9C9A92]">Shipped production projects & live links</span>

                                <span className="text-[#FAF9F5] font-semibold">card / npx</span>
                                <span className="text-[#9C9A92]">CLI developer business card</span>

                                <span className="text-[#FAF9F5] font-semibold">bio / about</span>
                                <span className="text-[#9C9A92]">Candidate bio, current role & background</span>

                                <span className="text-[#FAF9F5] font-semibold">contact</span>
                                <span className="text-[#9C9A92]">Email, LinkedIn & GitHub coordinates</span>

                                <span className="text-[#FAF9F5] font-semibold">resume / cv</span>
                                <span className="text-[#9C9A92]">Open official PDF resume in new tab</span>

                                <span className="text-[#FAF9F5] font-semibold">hire</span>
                                <span className="text-[#9C9A92]">Recruiter spec & direct hiring thread</span>

                                <span className="text-[#FAF9F5] font-semibold">matrix</span>
                                <span className="text-[#9C9A92]">Cyber stream animation easter egg</span>

                                <span className="text-[#FAF9F5] font-semibold">clear / cls</span>
                                <span className="text-[#9C9A92]">Clear terminal buffer</span>

                                <span className="text-[#FAF9F5] font-semibold">exit / quit</span>
                                <span className="text-[#9C9A92]">Minimize this bottom terminal</span>
                            </div>
                        </div>
                    ),
                });
                break;

            case 'skills':
            case 'stack':
                newEntries.push({
                    type: 'output',
                    content: (
                        <div className="space-y-2.5 text-xs md:text-sm">
                            <p className="text-[#DA7756] font-bold tracking-wide">SYSTEM CAPABILITIES & STACK MATRIX:</p>
                            {CAPABILITIES.map((cap) => (
                                <div key={cap.id} className="border-l-2 border-[#DA7756]/50 pl-3">
                                    <p className="font-bold text-[#FAF9F5] uppercase tracking-wider">{cap.category}:</p>
                                    <p className="text-[#B8B6AD] font-mono">{cap.items.join(' · ')}</p>
                                </div>
                            ))}
                        </div>
                    ),
                });
                break;

            case 'projects':
            case 'work':
                newEntries.push({
                    type: 'output',
                    content: (
                        <div className="space-y-2 text-xs md:text-sm">
                            <p className="text-[#DA7756] font-bold tracking-wide">SHIPPED EXHIBITS (LIVE IN PROD):</p>
                            {PROJECTS.map((proj, idx) => (
                                <div key={proj.id} className="flex flex-col gap-0.5 border-b border-[#2E2D2B] pb-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-[#FAF9F5] uppercase">{`0${idx + 1}. ${proj.title}`}</span>
                                        <a
                                            href={proj.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#DA7756] hover:underline inline-flex items-center gap-1 font-semibold"
                                        >
                                            [ OPEN ↗ ]
                                        </a>
                                    </div>
                                    <p className="text-[#9C9A92] text-xs">{proj.line} — <span className="text-[#73716B]">{proj.category}</span></p>
                                </div>
                            ))}
                        </div>
                    ),
                });
                break;

            case 'bio':
            case 'about':
                newEntries.push({
                    type: 'output',
                    content: (
                        <div className="space-y-2 text-xs md:text-sm text-[#ECEAE5]">
                            <p className="text-[#DA7756] font-bold tracking-wide">ABOUT NITIN TANWAR:</p>
                            <p className="leading-relaxed">{BIO}</p>
                            <div className="pt-1 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                {FACTS.map((f) => (
                                    <div key={f.label} className="bg-[#1E1D1B] border border-[#33322E] p-2 rounded-md">
                                        <p className="text-[#9C9A92] font-mono uppercase text-[10px]">{f.label}</p>
                                        <p className="text-[#FAF9F5] font-semibold">{f.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ),
                });
                break;

            case 'contact':
            case 'email':
                newEntries.push({
                    type: 'output',
                    content: (
                        <div className="space-y-1.5 text-xs md:text-sm">
                            <p className="text-[#DA7756] font-bold tracking-wide">CONTACT COORDINATES:</p>
                            <p className="text-[#ECEAE5]">Email: <a href={`mailto:${SITE.email}`} className="text-[#FAF9F5] underline hover:text-[#DA7756]">{SITE.email}</a></p>
                            <p className="text-[#ECEAE5]">LinkedIn: <a href={SITE.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#DA7756] underline">{SITE.links.linkedin}</a></p>
                            <p className="text-[#ECEAE5]">GitHub: <a href={SITE.links.github} target="_blank" rel="noopener noreferrer" className="text-[#DA7756] underline">{SITE.links.github}</a></p>
                        </div>
                    ),
                });
                break;

            case 'resume':
            case 'cv':
                window.open(SITE.links.resume, '_blank');
                newEntries.push({
                    type: 'output',
                    content: <p className="text-[#DA7756]">✓ Resume opened in new tab. (<a href={SITE.links.resume} target="_blank" rel="noopener noreferrer" className="underline font-bold">Direct Link</a>)</p>,
                });
                break;

            case 'hire':
                newEntries.push({
                    type: 'output',
                    content: (
                        <div className="bg-[#1E1D1B] border border-[#DA7756]/60 p-3.5 rounded-lg space-y-2 text-xs md:text-sm">
                            <p className="text-[#DA7756] font-bold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#DA7756] animate-ping" />
                                CANDIDATE STATUS: AVAILABLE FOR FULL-STACK / FRONTEND ROLES
                            </p>
                            <p className="text-[#ECEAE5] leading-relaxed">
                                Production experience in React, Node.js, distributed system design, and security hardening.
                            </p>
                            <div className="pt-1">
                                <a
                                    href={`mailto:${SITE.email}?subject=Full-Stack%20Opportunity%20-%20Nitin%20Tanwar&body=Hi%20Nitin,%0D%0A%0D%0AWe%20came%20across%20your%20portfolio%20and%20would%20love%20to%20talk%20about%20an%20engineering%20role.`}
                                    className="inline-block bg-[#DA7756] text-[#141413] font-bold px-3.5 py-1.5 rounded-md text-xs uppercase tracking-wider hover:bg-[#E08B6E] transition-colors"
                                >
                                    Initiate Hiring Thread →
                                </a>
                            </div>
                        </div>
                    ),
                });
                break;

            case 'matrix':
                newEntries.push({
                    type: 'output',
                    content: (
                        <div className="font-mono text-[#DA7756] text-xs leading-tight animate-pulse space-y-0.5">
                            <p>01001110 01001001 01010100 01001001 01001110</p>
                            <p>SYSTEM ACCESS GRANTED // ZERO-TRUST PROTOCOLS VERIFIED</p>
                            <p>NITIN IS EVERYTHIN // REACT · NODE · POSTGRES · THREE.JS</p>
                        </div>
                    ),
                });
                break;

            case 'card':
            case 'npx':
            case 'npx nitin-tanwar':
                newEntries.push({
                    type: 'output',
                    content: (
                        <div className="border border-[#DA7756]/40 bg-[#1E1D1B] p-3 rounded-lg font-mono text-xs text-[#ECEAE5] space-y-1">
                            <p className="text-[#DA7756] font-bold">┌────────────────────────────────────────────────────────┐</p>
                            <p className="font-bold text-[#FAF9F5]">  Nitin Tanwar / Full Stack Engineer</p>
                            <p className="text-[#B8B6AD]">  Work: Novus Aegis AI (Texas, US)</p>
                            <p className="text-[#B8B6AD]">  Stack: React · Node · Postgres · Three.js · Docker</p>
                            <p className="text-[#B8B6AD]">  Location: Noida, UP (India) · Shipping worldwide</p>
                            <p className="text-[#B8B6AD]">  GitHub: <a href={SITE.links.github} target="_blank" rel="noopener noreferrer" className="text-[#DA7756] underline">{SITE.links.github}</a></p>
                            <p className="text-[#B8B6AD]">  LinkedIn: <a href={SITE.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#DA7756] underline">{SITE.links.linkedin}</a></p>
                            <p className="text-[#DA7756] font-bold">└────────────────────────────────────────────────────────┘</p>
                        </div>
                    ),
                });
                break;

            case 'sudo':
            case 'sudo su':
                newEntries.push({
                    type: 'output',
                    content: <p className="text-[#DA7756]">🛡️ Root access granted: Nitin Tanwar has permission to ship high-grade distributed software.</p>,
                });
                break;

            case 'clear':
            case 'cls':
                setHistory([]);
                setInput('');
                return;

            case 'exit':
            case 'quit':
                experienceActions.closeTerminal();
                setInput('');
                return;

            default:
                newEntries.push({
                    type: 'error',
                    content: `zsh: command not found: ${rawCmd}. Type "help" for available commands.`,
                });
                break;
        }

        setHistory((prev) => [...prev, ...newEntries]);
        setInput('');
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        executeCommand(input);
    };

    const handleKeyDownInput = (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length === 0) return;
            const nextIdx = historyIndex + 1;
            if (nextIdx < commandHistory.length) {
                setHistoryIndex(nextIdx);
                setInput(commandHistory[commandHistory.length - 1 - nextIdx]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const nextIdx = historyIndex - 1;
                setHistoryIndex(nextIdx);
                setInput(commandHistory[commandHistory.length - 1 - nextIdx]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setInput('');
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const matching = QUICK_COMMANDS.find((c) => c.startsWith(input.toLowerCase()));
            if (matching) setInput(matching);
        }
    };

    return (
        <AnimatePresence>
            {terminalOpen && (
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                    className={`fixed bottom-0 inset-x-0 z-50 bg-[#141413] border-t-2 border-[#DA7756]/80 shadow-[0_-15px_40px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden text-[#ECEAE5] font-mono select-text ${
                        isMaximized ? 'h-[85vh]' : 'h-[52vh] sm:h-[42vh] min-h-[270px] max-h-[550px]'
                    }`}
                >
                    {/* VS Code Top Tabs & Action Header */}
                    <div className="bg-[#1C1B1A] px-2.5 sm:px-4 py-1.5 border-b border-[#2E2D2B] flex items-center justify-between select-none text-xs">
                        {/* Left VS Code Panel Tabs */}
                        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-0.5">
                            <button
                                onClick={() => setActiveTab('problems')}
                                className={`px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold transition-colors flex items-center gap-1 sm:gap-1.5 shrink-0 ${
                                    activeTab === 'problems'
                                        ? 'text-[#FAF9F5] border-b-2 border-[#DA7756]'
                                        : 'text-[#73716B] hover:text-[#B8B6AD]'
                                }`}
                            >
                                <span>Problems</span>
                                <span className="bg-[#2E2D2B] text-[#9C9A92] text-[9px] px-1.5 py-0.2 rounded-full font-bold">0</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('output')}
                                className={`px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold transition-colors shrink-0 ${
                                    activeTab === 'output'
                                        ? 'text-[#FAF9F5] border-b-2 border-[#DA7756]'
                                        : 'text-[#73716B] hover:text-[#B8B6AD]'
                                }`}
                            >
                                Output
                            </button>

                            <button
                                onClick={() => setActiveTab('terminal')}
                                className={`px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold transition-colors flex items-center gap-1 sm:gap-1.5 shrink-0 ${
                                    activeTab === 'terminal'
                                        ? 'text-[#FAF9F5] border-b-2 border-[#DA7756]'
                                        : 'text-[#73716B] hover:text-[#B8B6AD]'
                                }`}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#DA7756]" />
                                <span>Terminal</span>
                                <span className="text-[10px] text-[#9C9A92] font-normal hidden sm:inline">( 1: zsh )</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('debug')}
                                className={`px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold transition-colors hidden md:inline-block shrink-0 ${
                                    activeTab === 'debug'
                                        ? 'text-[#FAF9F5] border-b-2 border-[#DA7756]'
                                        : 'text-[#73716B] hover:text-[#B8B6AD]'
                                }`}
                            >
                                Debug Console
                            </button>
                        </div>

                        {/* Right VS Code Terminal Control Actions */}
                        <div className="flex items-center gap-1.5 sm:gap-3 text-[#9C9A92] shrink-0 ml-2">
                            {/* Clear icon */}
                            <button
                                onClick={() => executeCommand('clear')}
                                className="hover:text-[#FAF9F5] p-1 text-xs"
                                title="Clear Terminal (clear)"
                            >
                                ⌫
                            </button>

                            {/* Maximize / Restore Toggle */}
                            <button
                                onClick={() => setIsMaximized(!isMaximized)}
                                className="hover:text-[#FAF9F5] p-1 text-xs hidden sm:inline-block"
                                title={isMaximized ? "Restore Size" : "Maximize Panel Size"}
                            >
                                {isMaximized ? '🗗' : '🗖'}
                            </button>

                            {/* Close / Minimize Panel */}
                            <button
                                onClick={experienceActions.closeTerminal}
                                className="hover:text-[#DA7756] p-1 text-sm font-bold leading-none"
                                title="Close Terminal (ESC)"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Terminal Buffer Output Area */}
                    <div
                        className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-2 select-text font-mono text-xs sm:text-sm bg-[#141413]"
                        onClick={() => inputRef.current?.focus()}
                    >
                        {activeTab === 'terminal' ? (
                            <>
                                {history.map((item, idx) => (
                                    <div key={idx}>
                                        {item.type === 'banner' && (
                                            <pre className="text-[#DA7756] font-bold leading-none overflow-x-auto text-[9px] sm:text-xs py-1">
                                                {item.content}
                                            </pre>
                                        )}
                                        {item.type === 'info' && (
                                            <p className="text-[#9C9A92] text-xs">{item.content}</p>
                                        )}
                                        {item.type === 'command' && (
                                            <div className="flex items-center gap-1.5 sm:gap-2 text-[#FAF9F5]">
                                                <span className="text-[#DA7756] font-bold text-xs shrink-0">
                                                    <span className="hidden sm:inline">nitin@dev-box:~/portfolio </span>$
                                                </span>
                                                <span className="font-semibold break-all">{item.content}</span>
                                            </div>
                                        )}
                                        {item.type === 'output' && (
                                            <div className="pl-1 sm:pl-3 my-1 sm:my-1.5">{item.content}</div>
                                        )}
                                        {item.type === 'error' && (
                                            <p className="text-[#E07A5F] pl-1 sm:pl-3 text-xs">{item.content}</p>
                                        )}
                                    </div>
                                ))}
                                <div ref={bottomRef} />
                            </>
                        ) : activeTab === 'problems' ? (
                            <div className="py-6 text-center text-[#73716B] text-xs">
                                <p className="text-[#DA7756] font-bold mb-1">✓ No problems detected in workspace.</p>
                                <p>0 TypeScript errors, 0 ESLint warnings, all 7 plates operating at 60 FPS.</p>
                            </div>
                        ) : (
                            <div className="py-6 text-center text-[#73716B] text-xs">
                                <p>[output]: Build status 200 OK. Vite client connected to HMR.</p>
                            </div>
                        )}
                    </div>

                    {/* VS Code Interactive Prompt Form */}
                    {activeTab === 'terminal' && (
                        <form
                            onSubmit={handleFormSubmit}
                            className="bg-[#1C1B1A] px-2.5 sm:px-5 py-2 border-t border-[#2E2D2B] flex items-center gap-1.5 sm:gap-2"
                        >
                            <span className="text-[#DA7756] font-bold text-xs shrink-0">
                                <span className="hidden sm:inline">nitin@dev-box:~/portfolio </span>$
                            </span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDownInput}
                                autoCapitalize="none"
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                                placeholder="type command (skills, projects, resume)..."
                                className="flex-1 bg-transparent text-[#FAF9F5] text-xs focus:outline-none placeholder:text-[#5E5D57] font-mono caret-[#DA7756]"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="text-[10px] sm:text-[11px] bg-[#2E2D2B] hover:bg-[#DA7756] hover:text-[#141413] text-[#ECEAE5] px-2.5 py-1 rounded font-mono uppercase tracking-wider transition-colors shrink-0"
                            >
                                Run ↵
                            </button>
                        </form>
                    )}

                    {/* Quick Command Chips Toolbar */}
                    <div className="bg-[#181716] px-2.5 sm:px-5 py-1.5 border-t border-[#242321] flex items-center gap-1.5 overflow-x-auto select-none">
                        <span className="text-[9px] text-[#73716B] uppercase tracking-widest shrink-0 mr-1 font-semibold">
                            Actions:
                        </span>
                        {QUICK_COMMANDS.map((cmd) => (
                            <button
                                key={cmd}
                                type="button"
                                onClick={() => {
                                    setActiveTab('terminal');
                                    executeCommand(cmd);
                                }}
                                className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#242321] border border-[#33322E] hover:bg-[#DA7756] hover:text-[#141413] hover:border-[#DA7756] text-[#B8B6AD] hover:font-bold transition-all shrink-0"
                            >
                                {cmd}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DeveloperTerminal;
