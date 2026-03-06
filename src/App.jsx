import { useState, useRef } from "react";

const C = {
  bg: "#050810",
  bg2: "#0a0d1a",
  card: "#0d1117",
  card2: "#111520",
  border: "#1a2035",
  blue: "#0066ff",
  blueEl: "#0099ff",
  blueBright: "#00c8ff",
  silver: "#b8c4d4",
  silverBright: "#dce8f5",
  green: "#00e676",
  red: "#ff1744",
  gold: "#ffc107",
  text: "#e8f0fe",
  muted: "#4a5568",
  white: "#ffffff",
};

const challenges = [
  { id: 1, title: "No gastar en lujos 3 días", pts: 150, icon: "🎯", proof: "Sube una foto de tu billetera o captura de cuenta sin gastos de lujo" },
  { id: 2, title: "Ahorra $50 esta semana", pts: 200, icon: "💰", proof: "Captura de pantalla de tu saldo o transferencia a cuenta de ahorro" },
  { id: 3, title: "Registra 5 gastos seguidos", pts: 100, icon: "📝", proof: "Captura de tus 5 transacciones registradas en la app" },
  { id: 4, title: "Reduce gastos un 10%", pts: 300, icon: "📉", proof: "Comparativa de gastos: semana anterior vs esta semana" },
  { id: 5, title: "Crea un presupuesto mensual", pts: 250, icon: "📊", proof: "Foto de tu presupuesto escrito o digital con ingresos y gastos" },
];

const tips = [
  { icon: "💡", title: "Regla 50/30/20", body: "Destina 50% a necesidades, 30% a deseos y 20% al ahorro. Simple y efectivo para empezar." },
  { icon: "🔥", title: "Fondo de emergencia", body: "Tener 3-6 meses de gastos ahorrados te da tranquilidad ante cualquier imprevisto." },
  { icon: "📈", title: "Invierte desde $10", body: "No necesitas mucho para empezar. Lo importante es el hábito constante de invertir." },
  { icon: "🧠", title: "Evita deudas de consumo", body: "Las tarjetas de crédito con saldo pendiente pueden cobrarte hasta 40% anual en intereses." },
];

const prizes = [
  { pts: 500, label: "Café gratis", icon: "☕", desc: "En cafeterías aliadas" },
  { pts: 1000, label: "Mes Premium", icon: "⭐", desc: "FinWin sin límites" },
  { pts: 2000, label: "Gift Card $20", icon: "🎁", desc: "Amazon o similar" },
  { pts: 5000, label: "Viaje sorpresa", icon: "✈️", desc: "Destino a revelar" },
];

function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  const set = (v) => {
    setVal(prev => {
      const next = typeof v === "function" ? v(prev) : v;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  };
  return [val, set];
}

export default function FinWinApp() {
  const [tab, setTab] = useState("dashboard");
  const [points, setPoints] = useLocalStorage("fw_points", 0);
  const [balance, setBalance] = useLocalStorage("fw_balance", 0);
  const [transactions, setTransactions] = useLocalStorage("fw_transactions", []);
  const [completedChallenges, setCompletedChallenges] = useLocalStorage("fw_challenges", []);
  const [challengeProofs, setChallengeProofs] = useLocalStorage("fw_proofs", {});
  const [saved, setSaved] = useLocalStorage("fw_saved", 0);
  const [showAdd, setShowAdd] = useState(false);
  const [showProof, setShowProof] = useState(null);
  const [proofText, setProofText] = useState("");
  const [proofImg, setProofImg] = useState(null);
  const [newDesc, setNewDesc] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newType, setNewType] = useState("gasto");
  const [savingsGoal] = useState(500);
  const [debtAmount, setDebtAmount] = useState("");
  const [debtRate, setDebtRate] = useState("");
  const [debtMonths, setDebtMonths] = useState("");
  const [calcResult, setCalcResult] = useState(null);
  const fileRef = useRef();

  const level = Math.floor(points / 500);
  const levelProgress = ((points % 500) / 500) * 100;
  const totalIncome = transactions.filter(t => t.amount > 0).reduce((a, t) => a + t.amount, 0);
  const totalExpense = Math.abs(transactions.filter(t => t.amount < 0).reduce((a, t) => a + t.amount, 0));

  function addTransaction() {
    if (!newDesc || !newAmount) return;
    const now = new Date();
    const fecha = now.toLocaleDateString("es", { day: "numeric", month: "short" });
    const amt = newType === "gasto" ? -Math.abs(parseFloat(newAmount)) : Math.abs(parseFloat(newAmount));
    const cat = newType === "gasto" ? "💸" : newType === "ahorro" ? "🏦" : "💰";
    setTransactions(prev => [{ id: Date.now(), desc: newDesc, amount: amt, cat, date: fecha, type: newType }, ...prev]);
    setBalance(b => b + amt);
    setPoints(p => p + 20);
    if (newType === "ahorro") setSaved(s => s + Math.abs(amt));
    setNewDesc(""); setNewAmount(""); setShowAdd(false);
  }

  function submitProof(challengeId, pts) {
    if (!proofText && !proofImg) return;
    setChallengeProofs(prev => ({ ...prev, [challengeId]: { text: proofText, img: proofImg, date: new Date().toLocaleDateString("es") } }));
    setCompletedChallenges(c => [...c, challengeId]);
    setPoints(p => p + pts);
    setProofText(""); setProofImg(null); setShowProof(null);
  }

  function handleImgUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setProofImg(ev.target.result);
    reader.readAsDataURL(file);
  }

  function calcDebt() {
    const P = parseFloat(debtAmount);
    const r = parseFloat(debtRate) / 100 / 12;
    const n = parseInt(debtMonths);
    if (!P || !r || !n) return;
    const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n;
    setCalcResult({ monthly: monthly.toFixed(2), total: total.toFixed(2), interest: (total - P).toFixed(2) });
  }

  const navItems = [
    { id: "dashboard", icon: "⬡", label: "Inicio" },
    { id: "gastos", icon: "◈", label: "Gastos" },
    { id: "retos", icon: "◆", label: "Retos" },
    { id: "tips", icon: "◉", label: "Tips" },
    { id: "premios", icon: "✦", label: "Premios" },
  ];

  const inputStyle = {
    width: "100%", background: "#0a0d1a", border: `1px solid #1a2035`,
    borderRadius: 10, padding: "12px 14px", color: C.text, fontSize: 15,
    marginBottom: 12, boxSizing: "border-box", outline: "none",
    fontFamily: "'Segoe UI', sans-serif",
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: C.bg, minHeight: "100vh", color: C.text, maxWidth: 430, margin: "0 auto", position: "relative", paddingBottom: 80 }}>

      <div style={{ position: "fixed", top: -100, left: "50%", transform: "translateX(-50%)", width: 300, height: 300, background: `radial-gradient(circle, #0066ff15 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />

      {/* HEADER */}
      <div style={{ position: "relative", zIndex: 1, background: `linear-gradient(180deg, #080c18 0%, #0a0d1a 100%)`, padding: "18px 20px 14px", borderBottom: `1px solid #1a2035` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, #0066ff, #00c8ff)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: `0 0 12px #0066ff60` }}>💎</div>
              <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px", background: `linear-gradient(90deg, #00c8ff, #dce8f5)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>FinWin</div>
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2, letterSpacing: "1px", textTransform: "uppercase" }}>Controla · Ahorra · Gana</div>
          </div>
          <div style={{ background: `linear-gradient(135deg, #111520, #151a2e)`, border: `1px solid #0099ff30`, borderRadius: 12, padding: "8px 14px", textAlign: "right" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end" }}>
              <span style={{ fontSize: 14, color: C.blueEl }}>⚡</span>
              <span style={{ fontSize: 20, fontWeight: 900, background: `linear-gradient(90deg, #0099ff, #00c8ff)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{points.toLocaleString()}</span>
            </div>
            <div style={{ fontSize: 11, color: C.silver, marginTop: 2 }}>Nivel {level} · {Math.round(levelProgress)}%</div>
          </div>
        </div>
        <div style={{ marginTop: 12, height: 3, background: "#1a2035", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${levelProgress}%`, background: `linear-gradient(90deg, #0066ff, #00c8ff)`, borderRadius: 4, transition: "width 0.6s ease", boxShadow: `0 0 8px #0066ff` }} />
        </div>
      </div>

      {/* DASHBOARD */}
      {tab === "dashboard" && (
        <div style={{ padding: 16, position: "relative", zIndex: 1 }}>
          <div style={{ background: `linear-gradient(135deg, #080e20, #0a1428, #06101e)`, borderRadius: 20, padding: 24, marginBottom: 16, border: `1px solid #0099ff30`, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, background: `radial-gradient(circle, #0066ff20, transparent 70%)`, borderRadius: "50%" }} />
            <div style={{ fontSize: 12, color: C.silver, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Balance Total</div>
            <div style={{ fontSize: 38, fontWeight: 900, color: C.white, letterSpacing: "-1px" }}>${balance.toLocaleString("es", { minimumFractionDigits: 2 })}</div>
            <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${C.green}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>↑</div>
                <div>
                  <div style={{ fontSize: 11, color: C.muted }}>Ingresos</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.green }}>+${totalIncome.toFixed(2)}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${C.red}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>↓</div>
                <div>
                  <div style={{ fontSize: 11, color: C.muted }}>Gastos</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.red }}>-${totalExpense.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 16, border: `1px solid #1a2035` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>🎯 Meta de ahorro</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Meta: ${savingsGoal}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800, color: C.blueBright, fontSize: 16 }}>${saved.toFixed(0)}</div>
                <div style={{ fontSize: 12, color: C.silver }}>{Math.round((saved / savingsGoal) * 100)}%</div>
              </div>
            </div>
            <div style={{ height: 6, background: "#1a2035", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min((saved / savingsGoal) * 100, 100)}%`, background: `linear-gradient(90deg, #0066ff, #00c8ff)`, borderRadius: 6, boxShadow: `0 0 6px #0066ff` }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              { label: "Nuevo Gasto", icon: "💸", color: C.red, action: () => { setNewType("gasto"); setShowAdd(true); } },
              { label: "Nuevo Ingreso", icon: "💵", color: C.green, action: () => { setNewType("ingreso"); setShowAdd(true); } },
            ].map(btn => (
              <button key={btn.label} onClick={btn.action} style={{ background: `${btn.color}10`, border: `1px solid ${btn.color}30`, borderRadius: 14, padding: "16px 10px", cursor: "pointer", color: btn.color, fontWeight: 700, fontSize: 13, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 26 }}>{btn.icon}</span>
                {btn.label}
              </button>
            ))}
          </div>

          <div style={{ background: C.card, borderRadius: 16, padding: 16, border: `1px solid #1a2035` }}>
            <div style={{ fontWeight: 800, marginBottom: 14, fontSize: 15, color: C.silverBright }}>Movimientos recientes</div>
            {transactions.length === 0
              ? <div style={{ textAlign: "center", padding: "24px 0", color: C.muted, fontSize: 14 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                  Sin movimientos aún.<br />Registra tu primer gasto o ingreso.
                </div>
              : transactions.slice(0, 5).map(t => (
                <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid #1a2035` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: t.amount > 0 ? `${C.green}15` : `${C.red}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{t.cat}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{t.desc}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{t.date}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, color: t.amount > 0 ? C.green : C.red }}>
                    {t.amount > 0 ? "+" : ""}${Math.abs(t.amount).toFixed(2)}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* GASTOS */}
      {tab === "gastos" && (
        <div style={{ padding: 16, zIndex: 1, position: "relative" }}>
          <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 4, color: C.silverBright }}>Transacciones</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>+20 pts por cada registro ⚡</div>
          <button onClick={() => setShowAdd(true)} style={{ width: "100%", background: `linear-gradient(135deg, #0066ff, #0099ff)`, border: "none", borderRadius: 14, padding: 15, color: C.white, fontWeight: 800, fontSize: 15, cursor: "pointer", marginBottom: 16, boxShadow: `0 4px 20px #0066ff40` }}>
            + Nuevo Registro
          </button>
          {transactions.length === 0
            ? <div style={{ textAlign: "center", padding: "50px 0", color: C.muted }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>💳</div>
                Sin transacciones aún
              </div>
            : transactions.map(t => (
              <div key={t.id} style={{ background: C.card, borderRadius: 14, padding: "14px 16px", marginBottom: 10, border: `1px solid #1a2035`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: t.amount > 0 ? `${C.green}15` : `${C.red}15`, border: `1px solid ${t.amount > 0 ? C.green : C.red}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{t.cat}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{t.desc}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{t.date} · {t.type}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 900, fontSize: 16, color: t.amount > 0 ? C.green : C.red }}>
                  {t.amount > 0 ? "+" : ""}${Math.abs(t.amount).toFixed(2)}
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* RETOS */}
      {tab === "retos" && (
        <div style={{ padding: 16, zIndex: 1, position: "relative" }}>
          <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 4, color: C.silverBright }}>Retos Financieros</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Completa con prueba y gana puntos reales</div>

          <div style={{ background: C.card, borderRadius: 14, padding: "12px 16px", marginBottom: 16, border: `1px solid #1a2035`, display: "flex", justifyContent: "space-around" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 900, fontSize: 22, color: C.blueBright }}>{completedChallenges.length}</div>
              <div style={{ fontSize: 11, color: C.muted }}>Completados</div>
            </div>
            <div style={{ width: 1, background: "#1a2035" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 900, fontSize: 22, color: C.silver }}>{challenges.length - completedChallenges.length}</div>
              <div style={{ fontSize: 11, color: C.muted }}>Pendientes</div>
            </div>
            <div style={{ width: 1, background: "#1a2035" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 900, fontSize: 22, color: C.gold }}>{challenges.filter(c => completedChallenges.includes(c.id)).reduce((a, c) => a + c.pts, 0)}</div>
              <div style={{ fontSize: 11, color: C.muted }}>Pts ganados</div>
            </div>
          </div>

          {challenges.map(c => {
            const done = completedChallenges.includes(c.id);
            const proof = challengeProofs[c.id];
            return (
              <div key={c.id} style={{ background: done ? `linear-gradient(135deg, #050e08, #081208)` : C.card, borderRadius: 16, padding: 16, marginBottom: 12, border: `1px solid ${done ? C.green + "40" : "#1a2035"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flex: 1 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: done ? `${C.green}20` : `${C.blueEl}10`, border: `1px solid ${done ? C.green + "40" : C.blueEl + "20"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{c.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: done ? C.green : C.text }}>{c.title}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                        <span style={{ fontSize: 12, color: C.blueEl }}>⚡</span>
                        <span style={{ color: C.gold, fontWeight: 700, fontSize: 13 }}>+{c.pts} puntos</span>
                      </div>
                    </div>
                  </div>
                  {done
                    ? <div style={{ background: `${C.green}20`, color: C.green, borderRadius: 20, padding: "5px 12px", fontSize: 12, fontWeight: 800, border: `1px solid ${C.green}40` }}>✓ LISTO</div>
                    : <button onClick={() => { setShowProof(c); setProofText(""); setProofImg(null); }} style={{ background: `linear-gradient(135deg, #0066ff, #0099ff)`, border: "none", borderRadius: 20, padding: "7px 14px", color: C.white, fontWeight: 700, cursor: "pointer", fontSize: 12, boxShadow: `0 2px 10px #0066ff40` }}>Completar</button>
                  }
                </div>

                <div style={{ background: done ? `${C.green}08` : `${C.blueEl}08`, borderRadius: 10, padding: "8px 12px", border: `1px solid ${done ? C.green + "20" : C.blueEl + "15"}` }}>
                  <div style={{ fontSize: 11, color: done ? C.green : C.blueEl, fontWeight: 700, marginBottom: 3 }}>📋 PRUEBA REQUERIDA</div>
                  <div style={{ fontSize: 12, color: C.silver }}>{c.proof}</div>
                </div>

                {done && proof && (
                  <div style={{ marginTop: 10, background: `${C.green}08`, borderRadius: 10, padding: "10px 12px", border: `1px solid ${C.green}20` }}>
                    <div style={{ fontSize: 11, color: C.green, fontWeight: 700, marginBottom: 4 }}>✅ PRUEBA ENVIADA — {proof.date}</div>
                    {proof.text && <div style={{ fontSize: 13, color: C.silver }}>{proof.text}</div>}
                    {proof.img && <img src={proof.img} alt="prueba" style={{ marginTop: 8, width: "100%", borderRadius: 8, maxHeight: 120, objectFit: "cover" }} />}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TIPS */}
      {tab === "tips" && (
        <div style={{ padding: 16, zIndex: 1, position: "relative" }}>
          <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 4, color: C.silverBright }}>Educación Financiera</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Aprende a manejar mejor tu dinero</div>
          {tips.map((t, i) => (
            <div key={i} style={{ background: `linear-gradient(135deg, #0d1117, #111520)`, borderRadius: 16, padding: 18, marginBottom: 12, border: `1px solid #1a2035` }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `#0066ff15`, border: `1px solid #0066ff25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 12 }}>{t.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6, color: C.silverBright }}>{t.title}</div>
              <div style={{ color: C.silver, lineHeight: 1.7, fontSize: 14 }}>{t.body}</div>
            </div>
          ))}

          <div style={{ background: C.card, borderRadius: 16, padding: 18, border: `1px solid #0099ff25`, marginTop: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `#0099ff15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🧮</div>
              <div style={{ fontWeight: 800, fontSize: 16, color: C.silverBright }}>Calculadora de Deudas</div>
            </div>
            {[
              { label: "Monto de deuda ($)", val: debtAmount, set: setDebtAmount },
              { label: "Tasa de interés anual (%)", val: debtRate, set: setDebtRate },
              { label: "Número de meses", val: debtMonths, set: setDebtMonths },
            ].map(field => (
              <input key={field.label} type="number" placeholder={field.label} value={field.val} onChange={e => field.set(e.target.value)} style={inputStyle} />
            ))}
            <button onClick={calcDebt} style={{ width: "100%", background: `linear-gradient(135deg, #0066ff, #0099ff)`, border: "none", borderRadius: 12, padding: 14, color: C.white, fontWeight: 800, cursor: "pointer", fontSize: 15, boxShadow: `0 4px 16px #0066ff40` }}>Calcular</button>
            {calcResult && (
              <div style={{ marginTop: 14, background: C.bg2, borderRadius: 12, padding: 14, border: `1px solid #1a2035` }}>
                {[["Cuota mensual", `$${calcResult.monthly}`, C.blueBright], ["Total a pagar", `$${calcResult.total}`, C.red], ["Total en intereses", `$${calcResult.interest}`, C.gold]].map(([k, v, col]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid #1a2035` }}>
                    <span style={{ color: C.silver, fontSize: 14 }}>{k}</span>
                    <span style={{ fontWeight: 800, color: col, fontSize: 15 }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PREMIOS */}
      {tab === "premios" && (
        <div style={{ padding: 16, zIndex: 1, position: "relative" }}>
          <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 4, color: C.silverBright }}>Tienda de Premios</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>Canjea puntos por recompensas reales</div>
          <div style={{ background: `linear-gradient(135deg, #080e20, #0a1428)`, borderRadius: 16, padding: "16px 20px", marginBottom: 20, border: `1px solid #0099ff30`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 12, color: C.silver, letterSpacing: "1px", textTransform: "uppercase" }}>Mis puntos</div>
              <div style={{ fontSize: 32, fontWeight: 900, background: `linear-gradient(90deg, #0099ff, #00c8ff)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{points.toLocaleString()}</div>
            </div>
            <div style={{ fontSize: 40 }}>⚡</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {prizes.map(p => {
              const unlocked = points >= p.pts;
              return (
                <div key={p.pts} style={{ background: unlocked ? `linear-gradient(135deg, #050e08, #081410)` : C.card, borderRadius: 16, padding: 18, border: `1px solid ${unlocked ? C.green + "40" : "#1a2035"}`, textAlign: "center", opacity: unlocked ? 1 : 0.6 }}>
                  <div style={{ fontSize: 38, marginBottom: 8 }}>{p.icon}</div>
                  <div style={{ fontWeight: 800, marginBottom: 2, fontSize: 14, color: unlocked ? C.white : C.silver }}>{p.label}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>{p.desc}</div>
                  <div style={{ fontSize: 12, color: C.gold, marginBottom: 10, fontWeight: 700 }}>⚡ {p.pts.toLocaleString()} pts</div>
                  {unlocked
                    ? <button style={{ background: `linear-gradient(135deg, ${C.green}, #00a060)`, border: "none", borderRadius: 20, padding: "7px 18px", color: C.bg, fontWeight: 800, cursor: "pointer", fontSize: 13 }}>Canjear</button>
                    : <div style={{ fontSize: 11, color: C.muted, background: "#1a2035", borderRadius: 20, padding: "5px 10px", display: "inline-block" }}>Faltan {(p.pts - points).toLocaleString()} pts</div>
                  }
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PROOF MODAL */}
      {showProof && (
        <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "flex-end", zIndex: 100 }} onClick={() => setShowProof(null)}>
          <div style={{ background: "#0a0d1a", borderRadius: "24px 24px 0 0", padding: 24, width: "100%", maxWidth: 430, margin: "0 auto", border: `1px solid #0099ff30`, borderBottom: "none" }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 40, height: 4, background: "#1a2035", borderRadius: 4, margin: "0 auto 20px" }} />
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 24 }}>{showProof.icon}</span>
              <div style={{ fontWeight: 800, fontSize: 17, color: C.silverBright }}>{showProof.title}</div>
            </div>
            <div style={{ color: C.gold, fontWeight: 700, fontSize: 13, marginBottom: 16 }}>⚡ +{showProof.pts} puntos al completar</div>
            <div style={{ background: `#0099ff10`, borderRadius: 12, padding: "10px 14px", marginBottom: 16, border: `1px solid #0099ff20` }}>
              <div style={{ fontSize: 12, color: C.blueEl, fontWeight: 700, marginBottom: 4 }}>📋 PRUEBA REQUERIDA</div>
              <div style={{ fontSize: 13, color: C.silver }}>{showProof.proof}</div>
            </div>
            <div style={{ fontSize: 13, color: C.silver, fontWeight: 700, marginBottom: 8 }}>Describe tu prueba:</div>
            <textarea placeholder="Escribe cómo completaste el reto..." value={proofText} onChange={e => setProofText(e.target.value)}
              style={{ ...inputStyle, minHeight: 80, resize: "vertical", fontFamily: "'Segoe UI', sans-serif", marginBottom: 12 }} />
            <div style={{ fontSize: 13, color: C.silver, fontWeight: 700, marginBottom: 8 }}>Adjunta una foto (opcional):</div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImgUpload} style={{ display: "none" }} />
            <button onClick={() => fileRef.current.click()} style={{ width: "100%", background: "#111520", border: `1px dashed #0099ff40`, borderRadius: 12, padding: 12, color: C.silver, cursor: "pointer", fontSize: 14, marginBottom: 8 }}>
              📷 {proofImg ? "✅ Foto cargada" : "Seleccionar foto"}
            </button>
            {proofImg && <img src={proofImg} alt="preview" style={{ width: "100%", borderRadius: 10, marginBottom: 12, maxHeight: 150, objectFit: "cover" }} />}
            <button onClick={() => submitProof(showProof.id, showProof.pts)} disabled={!proofText && !proofImg}
              style={{ width: "100%", background: proofText || proofImg ? `linear-gradient(135deg, #0066ff, #0099ff)` : "#1a2035", border: "none", borderRadius: 14, padding: 15, color: proofText || proofImg ? C.white : C.muted, fontWeight: 800, fontSize: 16, cursor: proofText || proofImg ? "pointer" : "not-allowed", boxShadow: proofText || proofImg ? `0 4px 20px #0066ff40` : "none" }}>
              Enviar Prueba · Ganar ⚡{showProof.pts} pts
            </button>
          </div>
        </div>
      )}

      {/* ADD TRANSACTION MODAL */}
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "flex-end", zIndex: 100 }} onClick={() => setShowAdd(false)}>
          <div style={{ background: "#0a0d1a", borderRadius: "24px 24px 0 0", padding: 24, width: "100%", maxWidth: 430, margin: "0 auto", border: `1px solid #1a2035`, borderBottom: "none" }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 40, height: 4, background: "#1a2035", borderRadius: 4, margin: "0 auto 20px" }} />
            <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 16, color: C.silverBright }}>Nuevo Registro</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {["gasto", "ingreso", "ahorro"].map(t => (
                <button key={t} onClick={() => setNewType(t)} style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: `1px solid ${newType === t ? C.blueEl : "#1a2035"}`, background: newType === t ? `#0066ff30` : "transparent", color: newType === t ? C.blueBright : C.muted, fontWeight: 700, cursor: "pointer", fontSize: 13, textTransform: "capitalize" }}>{t}</button>
              ))}
            </div>
            <input type="text" placeholder="Descripción" value={newDesc} onChange={e => setNewDesc(e.target.value)} style={inputStyle} />
            <input type="number" placeholder="Monto ($)" value={newAmount} onChange={e => setNewAmount(e.target.value)} style={{ ...inputStyle, marginBottom: 16 }} />
            <button onClick={addTransaction} style={{ width: "100%", background: `linear-gradient(135deg, #0066ff, #0099ff)`, border: "none", borderRadius: 14, padding: 15, color: C.white, fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: `0 4px 20px #0066ff40` }}>
              Guardar · +20 pts ⚡
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "#070a12", borderTop: `1px solid #1a2035`, display: "flex", justifyContent: "space-around", padding: "10px 0 14px", zIndex: 10 }}>
        {navItems.map(n => (
          <button key={n.id} onClick={() => setTab(n.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "4px 12px", position: "relative" }}>
            {tab === n.id && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", width: 30, height: 2, background: `linear-gradient(90deg, #0066ff, #00c8ff)`, borderRadius: 2, boxShadow: `0 0 8px #0066ff` }} />}
            <span style={{ fontSize: 18, color: tab === n.id ? C.blueBright : C.muted }}>{n.icon}</span>
            <span style={{ fontSize: 10, color: tab === n.id ? C.blueBright : C.muted, fontWeight: tab === n.id ? 700 : 400, letterSpacing: "0.3px" }}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
