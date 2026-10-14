function NumerologyApp() {
    const [birthDate, setBirthDate] = React.useState(() => {
        return localStorage.getItem('vidia_birth_date') || '';
    });
    const [result, setResult] = React.useState(null);
    const resultsRef = React.useRef(null);

    const calculateNumerology = (dateString) => {
        if (!dateString) return null;
        const [year, month, day] = dateString.split('-').map(Number);

        // Cálculo de Edad Actual
        const today = new Date();
        let userAge = today.getFullYear() - year;
        const m = today.getMonth() - (month - 1);
        if (m < 0 || (m === 0 && today.getDate() < day)) {
            userAge--;
        }

        const reduceNumber = (num, keepMasters = true) => {
            let sum = num;
            while (sum > 9 && (!keepMasters || (sum !== 11 && sum !== 22 && sum !== 33))) {
                sum = String(sum).split('').reduce((acc, digit) => acc + Number(digit), 0);
            }
            return sum;
        };

        const reduceToSingleDigit = (num) => {
            let sum = num;
            while (sum > 9) {
                sum = String(sum).split('').reduce((acc, digit) => acc + Number(digit), 0);
            }
            return sum;
        };

        const rawDaySum = reduceNumber(day);
        const rawMonthSum = reduceNumber(month);
        const rawYearSum = reduceNumber(reduceNumber(year, false));
        const totalLifePathSum = rawDaySum + rawMonthSum + rawYearSum;
        const lifePathValue = reduceNumber(totalLifePathSum);
        const isLifePathMaster = [11, 22, 33].includes(lifePathValue);

        const birthDayReduced = reduceNumber(day);
        const attitudeValue = reduceNumber(day + month);
        const currentYear = new Date().getFullYear();
        const currentYearReduced = reduceNumber(currentYear, false);
        const personalYearValue = reduceNumber(day + month + currentYearReduced);

        const currentMonth = new Date().getMonth() + 1;
        const currentDay = new Date().getDate();
        const personalMonthValue = reduceNumber(personalYearValue + currentMonth);
        const personalDayValue = reduceNumber(personalMonthValue + currentDay);

        const pinacle1 = reduceNumber(reduceToSingleDigit(day) + reduceToSingleDigit(month));
        const pinacle2 = reduceNumber(reduceToSingleDigit(day) + reduceToSingleDigit(year));
        const pinacle3 = reduceNumber(pinacle1 + pinacle2);
        const pinacle4 = reduceNumber(reduceToSingleDigit(month) + reduceToSingleDigit(year));

        const lifePathBase = isLifePathMaster ? 11 : lifePathValue;
        const p1Age = 36 - lifePathBase;
        const p2Start = p1Age + 1;
        const p2End = p1Age + 9;
        const p3Start = p2End + 1;
        const p3End = p2End + 9;
        const p4Start = p3End + 1;

        // Determinar qué pináculo está activo hoy según la edad
        let activePhase = 4;
        if (userAge <= p1Age) activePhase = 1;
        else if (userAge >= p2Start && userAge <= p2End) activePhase = 2;
        else if (userAge >= p3Start && userAge <= p3End) activePhase = 3;

        const pinnacles = [
            { phase: 1, value: pinacle1, ageRange: `0 - ${p1Age} años`, minAge: 0, maxAge: p1Age },
            { phase: 2, value: pinacle2, ageRange: `${p2Start} - ${p2End} años`, minAge: p2Start, maxAge: p2End },
            { phase: 3, value: pinacle3, ageRange: `${p3Start} - ${p3End} años`, minAge: p3Start, maxAge: p3End },
            { phase: 4, value: pinacle4, ageRange: `${p4Start} a 99+ años`, minAge: p4Start, maxAge: 120 }
        ];

        const d1 = Math.abs(reduceToSingleDigit(day) - reduceToSingleDigit(month));
        const d2 = Math.abs(reduceToSingleDigit(day) - reduceToSingleDigit(year));
        const d3 = Math.abs(d1 - d2);
        const d4 = Math.abs(reduceToSingleDigit(month) - reduceToSingleDigit(year));

        const challenges = [
            { phase: 1, value: d1 },
            { phase: 2, value: d2 },
            { phase: 3, value: d3, isMain: true },
            { phase: 4, value: d4 }
        ];

        const karmicDebts = [];
        [totalLifePathSum, day, month, year].forEach(val => {
            if ([13, 14, 16, 19].includes(val)) {
                karmicDebts.push({ type: `${val}/${reduceNumber(val)}`, detectedIn: "Suma base" });
            }
        });

        return {
            birthDate: dateString,
            userAge,
            activePhase,
            lifePath: { value: lifePathValue, isMaster: isLifePathMaster, rawSum: totalLifePathSum },
            birthDay: { original: day, reduced: birthDayReduced },
            attitudeNumber: { value: attitudeValue },
            currentPersonalYear: { year: currentYear, value: personalYearValue },
            currentPersonalMonth: { value: personalMonthValue },
            currentPersonalDay: { value: personalDayValue },
            pinnacles,
            challenges,
            karmicDebts
        };
    };

    const handleCalculate = (e) => {
        e.preventDefault();
        if (birthDate) {
            localStorage.setItem('vidia_birth_date', birthDate);
            const data = calculateNumerology(birthDate);
            setResult(data);
            
            setTimeout(() => {
                if (resultsRef.current) {
                    resultsRef.current.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d0714] text-slate-100 flex flex-col justify-between font-sans-modern">
            
            {/* NAV / HEADER STICKY */}
            <header className="border-b border-purple-900/30 bg-[#0d0714]/80 backdrop-blur sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <a href="#" className="flex items-center gap-3 group">
                        <svg className="w-7 h-7 text-purple-300 glow-star group-hover:scale-105 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l2.9 6.8 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7-5.4-4.7 7.1-.6z"/>
                        </svg>
                        <span className="font-cinzel text-2xl font-bold tracking-widest text-white">VIDIA PORTAL</span>
                    </a>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-10 flex-1 w-full space-y-12">
                
                {/* HERO SECTION */}
                <section className="text-center space-y-3">
                    <span className="inline-block text-xs uppercase font-bold tracking-widest text-purple-300 bg-purple-950/50 px-3.5 py-1 rounded-full border border-purple-500/20">
                        Ecosistema Holístico Digital
                    </span>
                    <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-purple-300 tracking-tight">
                        ¿Qué te dice tu fecha de nacimiento?
                    </h1>
                    <p className="text-slate-300 font-semibold text-base sm:text-lg">
                        Descúbrete a través de la numerología.
                    </p>
                    <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed pt-1">
                        La numerología pitagórica traduce la vibración de tu fecha de nacimiento en información clave sobre tus talentos, aprendizajes y momentos decisivos.
                    </p>
                </section>

                {/* CALCULADORA / FORMULARIO */}
                <section className="bg-[#140b21] border border-purple-500/30 p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-purple-400 to-indigo-600"></div>
                    <form onSubmit={handleCalculate} className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                        <div className="w-full sm:w-auto flex-1">
                            <label className="block text-xs uppercase font-bold tracking-wider text-purple-300/80 mb-2">
                                Ingrese su Fecha de Nacimiento
                            </label>
                            <input 
                                type="date" 
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="w-full bg-[#0d0714] border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 font-medium"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full sm:w-auto mt-2 sm:mt-6 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold px-8 py-3.5 rounded-xl transition shadow-lg shadow-purple-500/20 cursor-pointer flex items-center justify-center gap-2 text-xs tracking-wider uppercase"
                        >
                            <span>Calcular Perfil</span>
                            <span>➔</span>
                        </button>
                    </form>
                </section>

                {/* RESULTADOS */}
                {result && (
                    <section ref={resultsRef} className="space-y-6 animate-fade-in scroll-mt-24">
                        <div className="flex items-center gap-3">
                            <h2 className="font-cinzel text-2xl font-bold text-purple-300">Tu Perfil Numerológico</h2>
                            <div className="h-px bg-purple-900/40 flex-1"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-[#140b21] border border-purple-500/30 p-6 rounded-2xl shadow-lg">
                                <span className="text-xs uppercase tracking-widest text-purple-400 font-semibold">Fuerza Vital</span>
                                <h3 className="text-xl font-bold mt-1 text-white">Camino de Vida</h3>
                                <div className="text-5xl font-black text-purple-300 my-3">{result.lifePath.value}</div>
                                <p className="text-xs text-slate-300">
                                    {result.lifePath.isMaster 
                                        ? '✨ Número Maestro. Posees una vibración de alto potencial espiritual y liderazgo.' 
                                        : 'Representa tu propósito central, aprendizajes y la lección principal en esta vida.'}
                                </p>
                            </div>

                            <div className="bg-[#140b21] border border-purple-500/30 p-6 rounded-2xl shadow-lg">
                                <span className="text-xs uppercase tracking-widest text-purple-400 font-semibold">Ciclo Actual ({result.currentPersonalYear.year})</span>
                                <h3 className="text-xl font-bold mt-1 text-white">Año Personal</h3>
                                <div className="text-5xl font-black text-purple-300 my-3">{result.currentPersonalYear.value}</div>
                                <p className="text-xs text-slate-300">
                                    La atmósfera y energía predominante que guía tus oportunidades durante los 12 meses en curso.
                                </p>
                            </div>

                            {/* TARJETA DE PINÁCULOS CON RESALTE DE ETAPA ACTIVA */}
                            <div className="bg-[#140b21] border border-purple-500/30 p-6 rounded-2xl shadow-lg md:col-span-2">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                    <h3 className="font-cinzel text-lg font-bold text-purple-300">Los 4 Pináculos (Fases de Evolución)</h3>
                                    <span className="text-xs font-semibold text-purple-300/80 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-500/20 w-fit">
                                        Edad actual: {result.userAge} años
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    {result.pinnacles.map((p) => {
                                        const isActive = p.phase === result.activePhase;
                                        return (
                                            <div 
                                                key={p.phase} 
                                                className={`p-4 rounded-xl text-center transition-all relative ${
                                                    isActive 
                                                        ? 'bg-[#1e1035] border-2 border-purple-400 shadow-lg shadow-purple-500/20 scale-[1.02]' 
                                                        : 'bg-[#0d0714] border border-purple-500/20 opacity-80'
                                                }`}
                                            >
                                                {isActive && (
                                                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-indigo-600 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full text-white shadow">
                                                        Etapa Activa
                                                    </span>
                                                )}
                                                <div className="text-xs text-slate-400 mb-1 pt-1">Etapa {p.phase}</div>
                                                <div className="text-3xl font-extrabold text-white mb-1">{p.value}</div>
                                                <div className={`text-xs font-medium ${isActive ? 'text-purple-300 font-bold' : 'text-purple-300/70'}`}>
                                                    {p.ageRange}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {result.karmicDebts.length > 0 && (
                                <div className="bg-[#180e29] border border-purple-500/40 p-6 rounded-2xl shadow-lg md:col-span-2">
                                    <h3 className="text-base font-bold text-purple-300 mb-2 flex items-center gap-2">
                                        <span>⚠️</span> Deuda Kármica Detectada
                                    </h3>
                                    <p className="text-xs text-slate-300 mb-3">
                                        Los números kármicos señalan memorias o desafíos específicos que requieres equilibrar conscientemente.
                                    </p>
                                    <ul className="list-disc list-inside text-xs text-purple-200 font-medium space-y-1">
                                        {result.karmicDebts.map((debt, index) => (
                                            <li key={index}>Número <strong>{debt.type}</strong> ({debt.detectedIn})</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* EXPLICACIÓN DIDÁCTICA */}
                <section className="bg-[#140b21]/70 border border-purple-500/20 p-8 rounded-3xl space-y-6">
                    <h2 className="font-cinzel text-xl font-bold text-purple-300 flex items-center gap-2">
                        <span>📚</span> ¿Cómo funciona la Numerología Pitagórica?
                    </h2>
                    <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                        Fundada por el filósofo y matemático <strong>Pitágoras</strong>, esta disciplina sostiene que los números del 1 al 9 (y los números maestros 11, 22 y 33) expresan cualidades energéticas únicas que moldean nuestra existencia.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                        <div className="bg-[#0d0714] p-4 rounded-xl border border-purple-500/20">
                            <h4 className="font-bold text-purple-300 text-xs mb-1">El Camino de Vida</h4>
                            <p className="text-xs text-slate-400">Calculado desde tu fecha completa. Muestra tu propósito central y los aprendizajes principales.</p>
                        </div>
                        <div className="bg-[#0d0714] p-4 rounded-xl border border-purple-500/20">
                            <h4 className="font-bold text-purple-300 text-xs mb-1">Los 4 Pináculos</h4>
                            <p className="text-xs text-slate-400">Muestran las cuatro grandes fases de tu vida y los desafíos o dones que se activarán en cada etapa.</p>
                        </div>
                        <div className="bg-[#0d0714] p-4 rounded-xl border border-purple-500/20">
                            <h4 className="font-bold text-purple-300 text-xs mb-1">El Año Personal</h4>
                            <p className="text-xs text-slate-400">Un ciclo de 9 años que te orienta sobre la atmósfera energética del año presente.</p>
                        </div>
                    </div>
                </section>

            </main>

            {/* FOOTER */}
            <footer className="border-t border-purple-900/30 bg-[#0d0714] py-6 text-center text-xs text-purple-300/40">
                <p>Vidia Portal © {new Date().getFullYear()} • Ecosistema Holístico Digital</p>
            </footer>

        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<NumerologyApp />);
