function NumerologyApp() {
    const [birthDate, setBirthDate] = React.useState('');
    const [result, setResult] = React.useState(null);

    const calculateNumerology = (dateString) => {
        if (!dateString) return null;
        const [year, month, day] = dateString.split('-').map(Number);

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

        const pinnacles = [
            { phase: 1, value: pinacle1, ageRange: `0 - ${p1Age} años` },
            { phase: 2, value: pinacle2, ageRange: `${p1Age + 1} - ${p1Age + 9} años` },
            { phase: 3, value: pinacle3, ageRange: `${p1Age + 10} - ${p1Age + 18} años` },
            { phase: 4, value: pinacle4, ageRange: `${p1Age + 19}+ años` }
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
            const data = calculateNumerology(birthDate);
            setResult(data);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
            <div className="max-w-3xl mx-auto">
                <header className="text-center mb-10 pt-6">
                    <h1 className="text-4xl font-extrabold text-amber-400 tracking-wider mb-2">VIDIA PORTAL</h1>
                    <p className="text-slate-400">Calculadora de Numerología Pitagórica Interativa</p>
                </header>

                <form onSubmit={handleCalculate} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl mb-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <div className="w-full sm:w-auto flex-1">
                        <label className="block text-sm font-medium text-slate-400 mb-1">Fecha de Nacimiento</label>
                        <input 
                            type="date" 
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-400"
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full sm:w-auto mt-5 sm:mt-0 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-lg hover:from-amber-400 hover:to-amber-500 transition shadow-lg cursor-pointer"
                    >
                        Calcular Perfil
                    </button>
                </form>

                {result && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                            <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold">Esencial</span>
                            <h3 className="text-xl font-bold mt-1">Camino de Vida</h3>
                            <div className="text-5xl font-black text-amber-400 my-3">{result.lifePath.value}</div>
                            <p className="text-sm text-slate-400">
                                {result.lifePath.isMaster ? '✨ Número Maestro detectado.' : 'Suma reducida de tu fecha de nacimiento.'}
                            </p>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                            <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold">Ciclo Actual ({result.currentPersonalYear.year})</span>
                            <h3 className="text-xl font-bold mt-1">Año Personal</h3>
                            <div className="text-5xl font-black text-amber-400 my-3">{result.currentPersonalYear.value}</div>
                            <p className="text-sm text-slate-400">Energía predominante para ti en el año en curso.</p>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg md:col-span-2">
                            <h3 className="text-xl font-bold mb-4 text-amber-400">Los 4 Pináculos (Etapas Vitales)</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                {result.pinnacles.map((p) => (
                                    <div key={p.phase} className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                                        <div className="text-xs text-slate-500 mb-1">Fase {p.phase}</div>
                                        <div className="text-3xl font-extrabold text-white mb-1">{p.value}</div>
                                        <div className="text-xs text-amber-400">{p.ageRange}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {result.karmicDebts.length > 0 && (
                            <div className="bg-amber-950/30 border border-amber-900/50 p-6 rounded-2xl shadow-lg md:col-span-2">
                                <h3 className="text-lg font-bold text-amber-400 mb-2">⚠️ Deuda Kármica Detectada</h3>
                                <ul className="list-disc list-inside text-sm text-amber-200/80">
                                    {result.karmicDebts.map((debt, index) => (
                                        <li key={index}>Número <strong>{debt.type}</strong> ({debt.detectedIn})</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<NumerologyApp />);
