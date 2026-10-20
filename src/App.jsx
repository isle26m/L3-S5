import React, { useState } from 'react';

const emptyGrades = () => ({
  ihm: { td: '', tp: '', exam: '' },
  gl: { td: '', tp: '', exam: '' },
  asi: { td: '', tp: '', exam: '' },
  sad: { td: '', tp: '', exam: '' },
  sid: { td: '', tp: '', exam: '' },
  paweb: { td: '', tp: '', exam: '' },
  envs: { td: '', tp: '', exam: '' }
});

const toGrade = (value) => {
  if (value === '' || value === null || value === undefined) return 0;
  const n = parseFloat(value);
  if (Number.isNaN(n)) return 0;
  return Math.min(20, Math.max(0, n));
};

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

function App() {
  const [grades, setGrades] = useState(emptyGrades());
  const [copiedEmail, setCopiedEmail] = useState(null);

  const modules = [
    {
      id: 'ihm',
      name: 'Interface Homme-Machine (IHM)',
      coef: 2,
      desc: 'Conception, ergonomie et évaluation des interfaces utilisateur.',
      hasTD: true,
      hasTP: true,
      hasExam: true
    },
    {
      id: 'gl',
      name: 'Génie Logiciel (GL)',
      coef: 4,
      desc: 'Méthodologies de développement, UML, conception et gestion de projets logiciels.',
      hasTD: true,
      hasTP: true,
      hasExam: true
    },
    {
      id: 'asi',
      name: 'Architecture des Systèmes d\'Information (ASI)',
      coef: 2,
      desc: 'Conception, modélisation et intégration des architectures des systèmes d\'information.',
      hasTD: true,
      hasTP: false,
      hasExam: true
    },
    {
      id: 'sad',
      name: 'Système d\'Aide à la Décision (SAD)',
      coef: 2,
      desc: 'Entrepôts de données, OLAP et outils d\'analyse décisionnelle.',
      hasTD: false,
      hasTP: true,
      hasExam: true
    },
    {
      id: 'sid',
      name: 'Systèmes d\'Information Distribués (SID)',
      coef: 4,
      desc: 'Architectures distribuées, middleware, RPC et services web.',
      hasTD: true,
      hasTP: true,
      hasExam: true
    },
    {
      id: 'paweb',
      name: 'Programmation Avancée pour le Web (PAWEB)',
      coef: 2,
      desc: 'Frameworks web modernes, développement front-end et back-end avancé.',
      hasTD: true,
      hasTP: false,
      hasExam: true
    },
    {
      id: 'envs',
      name: 'Économie Numérique et Veille Stratégique (ENVS)',
      coef: 1,
      desc: 'Enjeux économiques du numérique, veille technologique et stratégique.',
      hasTD: false,
      hasTP: false,
      hasExam: true
    }
  ];

  const professors = [
    { module: 'GL', name: 'HENKOUCHE', email: 'dja_henk@yahoo.fr' },
    { module: 'ASI', name: 'MENAD', email: 'nadia.menad@gmail.com' },
    { module: 'PAWEB', name: 'SELKA', email: 'selka-sadika@yahoo.com' },
    { module: 'SAD', name: 'ALNAFIE', email: 'amdjed.alnafie@univ-usto.dz' },
    { module: 'IHM', name: 'GUERROUDJI', email: 'fguerroudji@yahoo.fr' },
    { module: 'ENVS', name: 'YEDJOUR. H', email: 'hyedjour@yahoo.fr' }
  ];

  const totalCoef = modules.reduce((sum, mod) => sum + mod.coef, 0);

  const calculateModuleAverage = (mod) => {
    const g = grades[mod.id];
    const ccGrades = [];
    if (mod.hasTD) ccGrades.push(toGrade(g.td));
    if (mod.hasTP) ccGrades.push(toGrade(g.tp));
    const exam = toGrade(g.exam);

    const cc = ccGrades.length > 0
      ? ccGrades.reduce((a, b) => a + b, 0) / ccGrades.length
      : null;

    if (!mod.hasExam) return round2(cc ?? 0);
    if (cc === null) return round2(exam);
    return round2(cc * 0.4 + exam * 0.6);
  };

  const calculateGeneralAverage = () => {
    const totalPoints = modules.reduce(
      (sum, mod) => sum + calculateModuleAverage(mod) * mod.coef,
      0
    );
    return round2(totalPoints / totalCoef);
  };

  const handleGradeChange = (moduleId, field, value) => {
    if (value !== '') {
      const n = parseFloat(value);
      if (Number.isNaN(n)) return;
      if (n > 20) value = '20';
      if (n < 0) value = '0';
    }
    setGrades(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [field]: value
      }
    }));
  };

  const handleReset = () => {
    setGrades(emptyGrades());
  };

  const handleCopy = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const generalAverage = calculateGeneralAverage();
  const isPassing = generalAverage >= 10;
  const averageColorClass = isPassing ? 'text-success' : 'text-error';
  const message = isPassing ? 'Bshtk bl3t !' : 'Ma bl3tch :(';

  return (
    <div className="min-h-screen bg-base-200 text-base-content p-3 sm:p-4 md:p-8 font-sans overflow-x-hidden">
      <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6 md:space-y-8">
        <header className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-neutral-content bg-neutral p-4 sm:p-6 rounded-box shadow-md">
            L3 Informatique USTO - Semestre 5
          </h1>
          <p className="text-sm sm:text-base md:text-lg opacity-80 px-2">
            Calculateur de moyenne, emails des profs, drive des cours/examens..
          </p>
          <a
            href="https://drive.google.com/drive/folders/1XlZa_eopne7QaIdQmrIl9PBMUfQIOjxk"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success btn-md md:btn-lg shadow-md w-full md:w-auto h-auto min-h-12 py-2 whitespace-normal"
          >
            Accéder au Google Drive (Cours, Examens, TD, TP)
          </a>
        </header>

        <section className="bg-base-100 p-4 sm:p-6 rounded-box shadow-md space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold border-b border-base-300 pb-2">
            Informations sur les Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map(mod => (
              <div key={mod.id} className="bg-base-200 p-4 rounded-box border border-base-300">
                <h3 className="font-bold text-base sm:text-lg break-words">{mod.name}</h3>
                <p className="text-sm opacity-70 mb-3">{mod.desc}</p>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  <span className="badge badge-neutral">Coefficient: {mod.coef}</span>
                  {mod.hasTD && <span className="badge badge-outline">TD</span>}
                  {mod.hasTP && <span className="badge badge-outline">TP</span>}
                  {mod.hasExam && <span className="badge badge-outline">Examen</span>}
                  {!mod.hasExam && <span className="badge badge-outline">CC 100%</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-base-100 p-4 sm:p-6 rounded-box shadow-md space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold border-b border-base-300 pb-2">
            Professeurs et Contacts
          </h2>
          <div className="hidden md:block overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Module</th>
                  <th>Professeur</th>
                  <th>Email</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {professors.map((prof) => (
                  <tr key={prof.module}>
                    <td className="font-bold">{prof.module}</td>
                    <td>{prof.name}</td>
                    <td className="font-mono text-sm break-all">{prof.email}</td>
                    <td className="text-center">
                      <button
                        onClick={() => handleCopy(prof.email)}
                        className="btn btn-success btn-sm text-white w-24"
                      >
                        {copiedEmail === prof.email ? 'Copié !' : 'Copier'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-3">
            {professors.map((prof) => (
              <div key={prof.module} className="bg-base-200 border border-base-300 rounded-box p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold">{prof.module}</span>
                  <span className="text-sm opacity-80">{prof.name}</span>
                </div>
                <div className="font-mono text-xs break-all opacity-80">{prof.email}</div>
                <button
                  onClick={() => handleCopy(prof.email)}
                  className="btn btn-success btn-sm text-white w-full"
                >
                  {copiedEmail === prof.email ? 'Copié !' : 'Copier'}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-base-100 p-4 sm:p-6 rounded-box shadow-md space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-base-300 pb-2 gap-3 md:gap-4">
            <h2 className="text-xl sm:text-2xl font-semibold self-start md:self-auto">
              Calculateur de Moyenne
            </h2>
            <button
              onClick={handleReset}
              className="btn btn-error btn-sm md:btn-md w-full md:w-auto"
            >
              Réinitialiser
            </button>
          </div>
          <div className="space-y-4 sm:space-y-6">
            {modules.map(mod => {
              const avg = calculateModuleAverage(mod).toFixed(2);
              return (
                <div key={mod.id} className="bg-base-200 p-3 sm:p-4 rounded-box space-y-3 border border-base-300">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                    <h3 className="font-bold text-sm sm:text-base break-words">{mod.name}</h3>
                    <span className="text-lg sm:text-xl font-mono font-bold text-neutral whitespace-nowrap">Moy: {avg} / 20</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {mod.hasTD && (
                      <div className="form-control">
                        <label className="label py-1">
                          <span className="label-text text-xs font-semibold">Note TD (/20)</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          step="0.25"
                          inputMode="decimal"
                          className="input input-bordered w-full bg-base-100 h-11 text-base"
                          placeholder="0.00"
                          value={grades[mod.id].td}
                          onChange={(e) => handleGradeChange(mod.id, 'td', e.target.value)}
                        />
                      </div>
                    )}
                    {mod.hasTP && (
                      <div className="form-control">
                        <label className="label py-1">
                          <span className="label-text text-xs font-semibold">Note TP (/20)</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          step="0.25"
                          inputMode="decimal"
                          className="input input-bordered w-full bg-base-100 h-11 text-base"
                          placeholder="0.00"
                          value={grades[mod.id].tp}
                          onChange={(e) => handleGradeChange(mod.id, 'tp', e.target.value)}
                        />
                      </div>
                    )}
                    {mod.hasExam && (
                      <div className="form-control">
                        <label className="label py-1">
                          <span className="label-text text-xs font-semibold">Examen (/20)</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          step="0.25"
                          inputMode="decimal"
                          className="input input-bordered w-full bg-base-100 h-11 text-base"
                          placeholder="0.00"
                          value={grades[mod.id].exam}
                          onChange={(e) => handleGradeChange(mod.id, 'exam', e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                  <div className="text-xs opacity-60 font-mono break-words">
                    {mod.hasExam
                      ? (mod.hasTD || mod.hasTP)
                        ? "Formule : (Moyenne CC × 0.4) + (Examen × 0.6)"
                        : "Formule : Examen 100%"
                      : "Formule : Évaluation continue 100%"}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="divider"></div>

          <div className="flex flex-col items-center justify-center space-y-4 p-4 sm:p-6 text-center bg-neutral text-neutral-content rounded-box shadow-lg">
            <div className="text-sm font-semibold uppercase tracking-widest opacity-80">
              Moyenne Générale Semestre 5
            </div>
            <div className={`text-4xl sm:text-5xl md:text-6xl font-bold font-mono ${averageColorClass}`}>
              {generalAverage.toFixed(2)} <span className="text-xl sm:text-2xl opacity-60">/ 20</span>
            </div>
            <div className={`text-lg sm:text-xl font-bold ${averageColorClass}`}>
              {message}
            </div>
            <div className="text-sm opacity-70">
              Total des coefficients pris en compte : {totalCoef}
            </div>
          </div>
        </section>

        <footer className="text-center py-4 sm:py-6 text-xs sm:text-sm opacity-60">
          made by isle26m
        </footer>
      </div>
    </div>
  );
}

export default App;