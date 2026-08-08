import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ArrowRight, Building, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ElevatorEstimator = () => {
  const [serviceCategory, setServiceCategory] = useState<'installation' | 'amc' | 'modernization'>('installation');
  const [buildingType, setBuildingType] = useState<'residential' | 'commercial' | 'hospital'>('residential');
  const [floors, setFloors] = useState<number>(4);

  return (
    <section className="py-16 bg-slate-100/80 text-slate-900 relative overflow-hidden border-y border-slate-200/80">
      {/* Background glowing shapes */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <Calculator className="w-4 h-4 text-amber-600" />
            <span>Instant Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Plan Your <span className="bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">Elevator Project</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            Select your building parameters and request a free on-site technical survey for new installation, AMC maintenance, or modernization.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* Service Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                1. Select Service Required
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'installation', label: 'New Lift', icon: Building },
                  { id: 'amc', label: 'AMC Service', icon: ShieldCheck },
                  { id: 'modernization', label: 'Modernize', icon: Zap },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setServiceCategory(item.id as any)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-sm font-semibold transition-all ${
                      serviceCategory === item.id
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/30 scale-105'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 mb-1 ${serviceCategory === item.id ? 'text-amber-300' : 'text-amber-600'}`} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Building Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                2. Building Category
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'residential', label: 'Residential' },
                  { id: 'commercial', label: 'Commercial' },
                  { id: 'hospital', label: 'Hospital/Goods' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setBuildingType(item.id as any)}
                    className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                      buildingType === item.id
                        ? 'bg-amber-500/15 border-amber-500 text-amber-800 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Floors slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  3. Number of Floors (Stops)
                </label>
                <span className="text-sm font-extrabold text-amber-700 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                  {floors} Floors
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={20}
                value={floors}
                onChange={(e) => setFloors(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>2 Floors</span>
                <span>10 Floors</span>
                <span>20 Floors</span>
              </div>
            </div>
          </div>

          {/* Quote CTA Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 to-indigo-950 border border-blue-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between items-center text-center shadow-xl text-white">
            <div>
              <span className="text-xs font-semibold text-blue-200 uppercase tracking-widest block mb-1">
                Free Technical Consultation
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 my-3 tracking-tight">
                Get a Custom Quote
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Share your building details and our engineers will prepare a tailored proposal after an on-site technical inspection.
              </p>

              <ul className="text-left space-y-2 text-xs text-slate-200 mb-6 bg-slate-950/40 p-4 rounded-xl border border-white/10">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Includes 1-Year Full Guarantee & Support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Free Pre-Installation Site Measurement</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>24/7 Breakdown Assistance Coverage</span>
                </li>
              </ul>
            </div>

            <Link
              to="/contact"
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <span>Request Official Site Audit & Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ElevatorEstimator;
