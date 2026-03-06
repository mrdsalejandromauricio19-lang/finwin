import { useState } from "react";

const COLORS = {
  bg: "#0a0e1a",
  card: "#111827",
  cardBorder: "#1e2d3d",
  accent: "#00e5ff",
  gold: "#ffd700",
  green: "#00c896",
  red: "#ff4d6d",
  purple: "#a855f7",
  text: "#e2e8f0",
  muted: "#64748b",
};

const mockTransactions = [
  { id: 1, desc: "Supermercado", amount: -45.5, cat: "🛒", date: "Hoy" },
  { id: 2, desc: "Salario", amount: 1200, cat: "💼", date: "Ayer" },
  { id: 3, desc: "Netflix", amount: -12, cat: "🎬", date: "Lun" },
  { id: 4, desc: "Freelance", amount: 250, cat: "💻", date: "Dom" },
  { id: 5, desc: "Restaurante", amount: -28, cat: "🍔", date: "Sáb" },
];

const challenges = [
  { id: 1, title: "No gastar en lujos 3 días", pts: 150, done: false, icon: "🎯" },
  { id: 2, title: "Ahorra $50 esta semana", pts: 200, done: true, icon: "💰" },
  { id: 3, title: "Registra 7 gastos seguidos", pts: 100, done: false, icon: "📝" },
  { id: 4, title: "Reduce gastos un 10%", pts: 300, done: false, icon: "📉" },
];

const tips = [
  { icon: "💡", title: "Regla 50/30/20", body: "Destina 50% a necesidades, 30% a deseos y 20% al ahorro. Simple y efectivo." },
  { icon: "🔥", title: "Fondo de emergencia", body: "Tener 3-6 meses de gastos ahorrados te da tranquilidad ante cualquier imprevisto." },
  { icon: "📈", title: "Invierte desde $10", body: "No necesitas mucho para empezar. Lo importante es el hábito constante de invertir." },
];

const prizes = [
  { pts: 500, label: "Café gratis", icon: "☕", unlocked: true },
  { pts: 1000, label: "Mes Premium", icon: "⭐", unlocked: true },
  { pts: 2000, label: "Gift Card $20", icon: "🎁", unlocked: false },
  { pts: 5000, label: "Viaje sorpresa", icon: "✈️", unlocked: false },
];

export default function FinWinApp() {
  const [tab, setTab] = useState("dashboard");
  const [points, setPoints] = useState(1050);
  const [balance, setBalance] = useState(3240.5);
  const [showAdd, setShowAdd] = useState(false);
  const [newDesc, setNewDesc] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newType, setNewType] = useState("gasto");
  const [transactions, setTransactions] = useState(mockTransactions);
  const [completedChallenges, setCompletedChallenges] = useState([2]);
  const [savingsGoal] = useState(500);
  const [saved, setSaved] = useState(210);
  const [tipIdx, setTipIdx] = useState(0);
  const [debtAmount, setDebtAmount] = useState("");
  const [debtRate, setDebtRate] = useState("");
  const [debtMonths, setDebtMonths] = useState("");
  const [calcResult, setCalcResult] = useState(null);

  const level = Math.floor(points / 500) + 1;
  const levelProgress = ((points % 500) / 500) * 100;

  function addTransaction() {
    if (!newDesc || !newAmount) return;
    const amt = newType === "gasto" ? -Math.abs(parseFloat(newAmount)) : Math.abs(parseFloat(newAmount));
    setTransactions([{ id: Date.now(), desc: newDesc, amount: amt, cat: newType === "gasto" ? "💸" : "💰", date: "Ahora" }, ...transactions]);
    setBalance(b => b + amt);
    setPoints(p => p + 20);
    setSaved(s => newType === "ahorro" ? s + Math.abs(amt) : s);
    setNewDesc(""); setNewAmount(""); setShowAdd(false);
  }

  function completeChallenge(id, pts) {
    if (completedChallenges.includes(id)) return;
    setCompletedChallenges(c => [...c, id]);
    setPoints(p => p + pts);
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
    { id: "dashboard", icon: "🏠", label: "Inicio" },
    { id: "gastos", icon: "💳", label: "Gastos" },
    { id: "retos", icon: "🏆", label: "Retos" },
    { id: "tips", icon: "📚", label: "Tips" },
    { id: "premios", icon: "🎁", label: "Premios" },
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: COLORS.bg, minHeight: "100vh", color: COLORS.text, maxWidth: 420, margin: "0 auto", position: "relative", paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", padding: "20px 20px 16px", borderBottom: `1px solid ${COLORS.cardBorder}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              💎 FinWin
            </div>
            <div style={{ fontSize: 12, color: COLORS.muted }}>Controla · Ahorra · Gana</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
              <span style={{ fontSize: 18 }}>⚡</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.gold }}>{points.toLocaleString()}</span>
              <span style={{ fontSize: 12, color: COLORS.muted }}>pts</span>
            </div>
            <div style={{ fontSize: 12, color: COLORS.purple }}>Nivel {level} · {Math.round(levelProgress)}%</div>
          </div>
        </div>
        {/* Level bar */}
        <div style={{ marginTop: 10, height: 4, background: "#1e2d3d", borderRadius: 4 }}>
          <div style={{ height: "100%", width: `${levelProgress}%`, background: `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.accent})`, borderRadius: 4, transition: "width 0.5s ease" }} />
        </div>
      </div>

      {/* DASHBOARD */}
      {tab === "dashboard" && (
        <div style={{ padding: 16 }}>
          {/* Balance card */}
          <div style={{ background: `linear-gradient(135deg, #0c4a6e, #1e3a5f)`, borderRadius: 16, padding: "20px 24px", marginBottom: 16, border: `1px solid ${COLORS.accent}30` }}>
            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>Balance total</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "white" }}>${balance.toLocaleString("es", { minimumFractionDigits: 2 })}</div>
            <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>Ingresos</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.green }}>+$1,450</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>Gastos</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.red }}>-$85.50</div>
              </div>
            </div>
          </div>

          {/* Savings goal */}
          <div style={{ background: COLORS.card, borderRadius: 14, padding: 16, marginBottom: 16, border: `1px solid ${COLORS.cardBorder}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontWeight: 700 }}>🎯 Meta de ahorro</span>
              <span style={{ color: COLORS.accent, fontWeight: 700 }}>${saved} / ${savingsGoal}</span>
            </div>
            <div style={{ height: 8, background: "#1e2d3d", borderRadius: 8 }}>
              <div style={{ height: "100%", width: `${(saved / savingsGoal) * 100}%`, background: `linear-gradient(90deg, ${COLORS.green}, ${COLORS.accent})`, borderRadius: 8 }} />
            </div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 6 }}>{Math.round((saved / savingsGoal) * 100)}% completado — ¡Sigue así!</div>
          </div>

          {/* Quick actions */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[
              { label: "Agregar gasto", icon: "➕", color: COLORS.red, action: () => { setNewType("gasto"); setShowAdd(true); } },
              { label: "Registrar ingreso", icon: "💵", color: COLORS.green, action: () => { setNewType("ingreso"); setShowAdd(true); } },
            ].map(btn => (
              <button key={btn.label} onClick={btn.action} style={{ background: `${btn.color}15`, border: `1px solid ${btn.color}40`, borderRadius: 12, padding: "14px 10px", cursor: "pointer", color: btn.color, fontWeight: 700, fontSize: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 24 }}>{btn.icon}</span>
                {btn.label}
              </button>
            ))}
          </div>

          {/* Recent transactions */}
          <div style={{ background: COLORS.card, borderRadius: 14, padding: 16, border: `1px solid ${COLORS.cardBorder}` }}>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>Movimientos recientes</div>
            {transactions.slice(0, 4).map(t => (
              <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${COLORS.cardBorder}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{t.cat}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{t.desc}</div>
                    <div style={{ fontSize: 11, color: COLORS.muted }}>{t.date}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: t.amount > 0 ? COLORS.green : COLORS.red }}>
                  {t.amount > 0 ? "+" : ""}${Math.abs(t.amount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GASTOS */}
      {tab === "gastos" && (
        <div style={{ padding: 16 }}>
          <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 16 }}>💳 Mis Transacciones</div>
          <button onClick={() => setShowAdd(true)} style={{ width: "100%", background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.purple})`, border: "none", borderRadius: 12, padding: "14px", color: "#0a0e1a", fontWeight: 800, fontSize: 15, cursor: "pointer", marginBottom: 16 }}>
            + Nuevo registro (+20pts)
          </button>
          {transactions.map(t => (
            <div key={t.id} style={{ background: COLORS.card, borderRadius: 12, padding: "14px 16px", marginBottom: 10, border: `1px solid ${COLORS.cardBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 26 }}>{t.cat}</span>
                <div>
                  <div style={{ fontWeight: 700 }}>{t.desc}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>{t.date}</div>
                </div>
              </div>
              <div style={{ fontWeight: 800, fontSize: 17, color: t.amount > 0 ? COLORS.green : COLORS.red }}>
                {t.amount > 0 ? "+" : ""}${Math.abs(t.amount).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RETOS */}
      {tab === "retos" && (
        <div style={{ padding: 16 }}>
          <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>🏆 Retos Financieros</div>
          <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 16 }}>Completa retos y gana puntos canjeables</div>
          {challenges.map(c => {
            const done = completedChallenges.includes(c.id);
            return (
              <div key={c.id} style={{ background: COLORS.card, borderRadius: 14, padding: 16, marginBottom: 12, border: `1px solid ${done ? COLORS.gold + "60" : COLORS.cardBorder}`, opacity: done ? 0.8 : 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 28 }}>{c.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{c.title}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                        <span style={{ fontSize: 14 }}>⚡</span>
                        <span style={{ color: COLORS.gold, fontWeight: 700 }}>+{c.pts} puntos</span>
                      </div>
                    </div>
                  </div>
                  {done
                    ? <span style={{ background: `${COLORS.green}20`, color: COLORS.green, borderRadius: 20, padding: "4px 12px", fontSize: 13, fontWeight: 700 }}>✓ Listo</span>
                    : <button onClick={() => completeChallenge(c.id, c.pts)} style={{ background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.purple})`, border: "none", borderRadius: 20, padding: "6px 14px", color: "#0a0e1a", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Completar</button>
                  }
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TIPS */}
      {tab === "tips" && (
        <div style={{ padding: 16 }}>
          <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>📚 Educación Financiera</div>
          <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 16 }}>Aprende a manejar mejor tu dinero</div>

          {/* Tip cards */}
          {tips.map((t, i) => (
            <div key={i} style={{ background: `linear-gradient(135deg, ${COLORS.card}, #1a2332)`, borderRadius: 14, padding: 18, marginBottom: 12, border: `1px solid ${COLORS.cardBorder}` }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{t.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{t.title}</div>
              <div style={{ color: "#94a3b8", lineHeight: 1.6, fontSize: 14 }}>{t.body}</div>
            </div>
          ))}

          {/* Calculator */}
          <div style={{ background: COLORS.card, borderRadius: 14, padding: 18, border: `1px solid ${COLORS.purple}40` }}>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>🧮 Calculadora de deudas</div>
            {[
              { label: "Monto de deuda ($)", val: debtAmount, set: setDebtAmount },
              { label: "Tasa anual (%)", val: debtRate, set: setDebtRate },
              { label: "Meses a pagar", val: debtMonths, set: setDebtMonths },
            ].map(field => (
              <input key={field.label} type="number" placeholder={field.label} value={field.val} onChange={e => field.set(e.target.value)}
                style={{ width: "100%", background: "#1e2d3d", border: `1px solid ${COLORS.cardBorder}`, borderRadius: 10, padding: "10px 14px", color: COLORS.text, fontSize: 14, marginBottom: 10, boxSizing: "border-box", outline: "none" }} />
            ))}
            <button onClick={calcDebt} style={{ width: "100%", background: `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.accent})`, border: "none", borderRadius: 10, padding: 12, color: "#0a0e1a", fontWeight: 800, cursor: "pointer", fontSize: 15 }}>Calcular</button>
            {calcResult && (
              <div style={{ marginTop: 14, background: "#0f172a", borderRadius: 10, padding: 14 }}>
                {[["Cuota mensual", `$${calcResult.monthly}`, COLORS.accent], ["Total a pagar", `$${calcResult.total}`, COLORS.red], ["Total en intereses", `$${calcResult.interest}`, COLORS.gold]].map(([k, v, c]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ color: COLORS.muted, fontSize: 14 }}>{k}</span>
                    <span style={{ fontWeight: 700, color: c }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PREMIOS */}
      {tab === "premios" && (
        <div style={{ padding: 16 }}>
          <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>🎁 Tienda de Premios</div>
          <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 8 }}>Canjea tus puntos por recompensas reales</div>
          <div style={{ background: `linear-gradient(90deg, ${COLORS.gold}20, ${COLORS.purple}20)`, borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700 }}>⚡ Mis puntos</span>
            <span style={{ fontWeight: 900, fontSize: 22, color: COLORS.gold }}>{points.toLocaleString()}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {prizes.map(p => (
              <div key={p.pts} style={{ background: COLORS.card, borderRadius: 14, padding: 18, border: `1px solid ${p.unlocked ? COLORS.gold + "50" : COLORS.cardBorder}`, textAlign: "center", opacity: p.unlocked ? 1 : 0.5 }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>{p.icon}</div>
                <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 14 }}>{p.label}</div>
                <div style={{ fontSize: 13, color: COLORS.gold }}>⚡ {p.pts.toLocaleString()} pts</div>
                {p.unlocked
                  ? <button style={{ marginTop: 10, background: `linear-gradient(90deg, ${COLORS.gold}, #f59e0b)`, border: "none", borderRadius: 20, padding: "6px 16px", color: "#0a0e1a", fontWeight: 800, cursor: "pointer", fontSize: 13 }}>Canjear</button>
                  : <div style={{ marginTop: 10, fontSize: 12, color: COLORS.muted }}>Faltan {(p.pts - points).toLocaleString()} pts</div>
                }
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add modal */}
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "#000000bb", display: "flex", alignItems: "flex-end", zIndex: 50 }} onClick={() => setShowAdd(false)}>
          <div style={{ background: "#111827", borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxWidth: 420, margin: "0 auto", border: `1px solid ${COLORS.cardBorder}` }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 16 }}>{newType === "gasto" ? "💸 Nuevo Gasto" : "💵 Nuevo Ingreso"}</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {["gasto", "ingreso", "ahorro"].map(t => (
                <button key={t} onClick={() => setNewType(t)} style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: "none", background: newType === t ? COLORS.accent : "#1e2d3d", color: newType === t ? "#0a0e1a" : COLORS.muted, fontWeight: 700, cursor: "pointer", fontSize: 13, textTransform: "capitalize" }}>{t}</button>
              ))}
            </div>
            <input type="text" placeholder="Descripción" value={newDesc} onChange={e => setNewDesc(e.target.value)}
              style={{ width: "100%", background: "#1e2d3d", border: `1px solid ${COLORS.cardBorder}`, borderRadius: 10, padding: "12px 14px", color: COLORS.text, fontSize: 15, marginBottom: 12, boxSizing: "border-box", outline: "none" }} />
            <input type="number" placeholder="Monto ($)" value={newAmount} onChange={e => setNewAmount(e.target.value)}
              style={{ width: "100%", background: "#1e2d3d", border: `1px solid ${COLORS.cardBorder}`, borderRadius: 10, padding: "12px 14px", color: COLORS.text, fontSize: 15, marginBottom: 16, boxSizing: "border-box", outline: "none" }} />
            <button onClick={addTransaction} style={{ width: "100%", background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.purple})`, border: "none", borderRadius: 12, padding: 14, color: "#0a0e1a", fontWeight: 800, fontSize: 16, cursor: "pointer" }}>
              Guardar (+20 pts ⚡)
            </button>
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 420, background: "#0d1421", borderTop: `1px solid ${COLORS.cardBorder}`, display: "flex", justifyContent: "space-around", padding: "8px 0 12px" }}>
        {navItems.map(n => (
          <button key={n.id} onClick={() => setTab(n.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 8px" }}>
            <span style={{ fontSize: 22, filter: tab === n.id ? "none" : "grayscale(0.7)" }}>{n.icon}</span>
            <span style={{ fontSize: 10, color: tab === n.id ? COLORS.accent : COLORS.muted, fontWeight: tab === n.id ? 700 : 400 }}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
