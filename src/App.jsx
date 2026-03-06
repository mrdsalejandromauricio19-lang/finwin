import { useState, useEffect, useRef } from "react";

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
  { id: 1, title: "No gastar en lujos 3 días", pts: 150, icon: "🎯" },
  { id: 2, title: "Ahorra $50 esta semana", pts: 200, icon: "💰" },
  { id: 3, title: "Registra 7 gastos seguidos", pts: 100, icon: "📝" },
  { id: 4, title: "Reduce gastos un 10%", pts: 300, icon: "📉" },
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

// ── CONFETTI ─────────────────────────────────────────────────────────────────
function Confetti({ active, onDone }) {
  const pieces = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ["#ffd700","#00e5ff","#a855f7","#00c896","#ff4d6d","#fff"][i % 6],
    delay: Math.random() * 0.5,
    dur: 1 + Math.random() * 0.7,
    size: 6 + Math.random() * 9,
  }));
  useEffect(() => {
    if (active) { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }
  }, [active]);
  if (!active) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 200, overflow: "hidden" }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.x}%`, top: -16,
          width: p.size, height: p.size,
          borderRadius: p.id % 3 === 0 ? "50%" : 2,
          background: p.color,
          animation: `confettiFall ${p.dur}s ${p.delay}s ease-in forwards`,
        }} />
      ))}
    </div>
  );
}

// ── FLOATING POINTS ───────────────────────────────────────────────────────────
function FloatingPoints({ items }) {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 150 }}>
      {items.map(item => (
        <div key={item.id} style={{
          position: "absolute", left: item.x, top: item.y,
          color: COLORS.gold, fontWeight: 900, fontSize: 22,
          textShadow: `0 0 12px ${COLORS.gold}`,
          animation: "floatUp 1.5s ease-out forwards",
          whiteSpace: "nowrap",
        }}>{item.text}</div>
      ))}
    </div>
  );
}

// ── ACHIEVEMENT TOAST ─────────────────────────────────────────────────────────
function AchievementToast({ achievement, onClose }) {
  useEffect(() => {
    if (achievement) { const t = setTimeout(onClose, 3200); return () => clearTimeout(t); }
  }, [achievement]);
  if (!achievement) return null;
  return (
    <div style={{
      position: "fixed", top: 78, left: "50%",
      transform: "translateX(-50%)",
      zIndex: 180, pointerEvents: "none",
      width: "88%", maxWidth: 360,
      animation: "toastSlide 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #1a1000, #2d1f00)",
        border: `2px solid ${COLORS.gold}`,
        borderRadius: 18, padding: "14px 20px",
        display: "flex", alignItems: "center", gap: 14,
        boxShadow: `0 0 40px ${COLORS.gold}50, 0 8px 32px #00000090`,
      }}>
        <div style={{ fontSize: 44, animation: "spinPop 0.6s cubic-bezier(0.34,1.56,0.64,1)" }}>{achievement.icon}</div>
        <div>
          <div style={{ fontSize: 11, color: COLORS.gold, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>¡Logro desbloqueado!</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", marginTop: 2 }}>{achievement.title}</div>
          <div style={{ fontSize: 13, color: COLORS.gold, marginTop: 2 }}>+{achievement.pts} puntos ⚡</div>
        </div>
      </div>
    </div>
  );
}

// ── LEVEL UP MODAL ────────────────────────────────────────────────────────────
function LevelUpModal({ level, visible, onClose }) {
  useEffect(() => {
    if (visible) { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }
  }, [visible]);
  if (!visible) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000099", zIndex: 190, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{
        background: "linear-gradient(135deg, #0f172a, #1e1040)",
        border: `2px solid ${COLORS.purple}`,
        borderRadius: 24, padding: "36px 48px", textAlign: "center",
        animation: "levelUpPop 0.6s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow: `0 0 60px ${COLORS.purple}60`,
      }}>
        <div style={{ fontSize: 68, animation: "spinPop 0.8s cubic-bezier(0.34,1.56,0.64,1)" }}>🏅</div>
        <div style={{ fontSize: 13, color: COLORS.purple, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginTop: 10 }}>¡Subiste de nivel!</div>
        <div style={{ fontSize: 56, fontWeight: 900, color: "#fff", margin: "6px 0" }}>Nivel {level}</div>
        <div style={{ fontSize: 14, color: COLORS.muted }}>¡Increíble progreso, campeón! 🚀</div>
      </div>
    </div>
  );
}

// ── FLOATING MASCOT ───────────────────────────────────────────────────────────
function Mascot({ mood, onClick }) {
  const face = mood === "celebrate" ? "🤩" : mood === "excited" ? "😄" : mood === "sad" ? "😟" : "🤖";
  const anim = mood === "celebrate" ? "mascotCelebrate 0.35s ease infinite alternate"
    : mood === "excited" ? "mascotBounce 0.45s ease infinite alternate"
    : "mascotFloat 3.2s ease-in-out infinite";
  return (
    <div onClick={onClick} style={{
      position: "fixed", bottom: 94, right: 14, zIndex: 120,
      cursor: "pointer", userSelect: "none",
      animation: anim,
      filter: `drop-shadow(0 4px 18px ${COLORS.accent}55)`,
    }}>
      <div style={{
        width: 58, height: 58, borderRadius: "50%",
        background: "linear-gradient(135deg, #1a2540, #0f172a)",
        border: `2px solid ${COLORS.accent}80`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 30, position: "relative",
        boxShadow: `0 0 24px ${COLORS.accent}35`,
      }}>
        {face}
        <div style={{
          position: "absolute", bottom: 1, right: 1,
          width: 13, height: 13, borderRadius: "50%",
          background: mood === "celebrate" ? COLORS.gold : COLORS.green,
          border: `2px solid ${COLORS.bg}`,
          animation: "dotPulse 1.4s ease infinite",
        }} />
      </div>
    </div>
  );
}

// ── SPEECH BUBBLE ─────────────────────────────────────────────────────────────
function SpeechBubble({ text, visible }) {
  if (!visible || !text) return null;
  return (
    <div style={{
      position: "fixed", bottom: 164, right: 8, zIndex: 121,
      background: "linear-gradient(135deg, #1e2d3d, #111827)",
      border: `1px solid ${COLORS.accent}55`,
      borderRadius: "14px 14px 4px 14px",
      padding: "10px 14px", maxWidth: 195,
      fontSize: 13, color: COLORS.text, lineHeight: 1.45,
      pointerEvents: "none",
      animation: "bubblePop 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      boxShadow: "0 4px 20px #00000060",
    }}>{text}</div>
  );
}

// ── XP BAR ────────────────────────────────────────────────────────────────────
function XPBar({ progress }) {
  const [disp, setDisp] = useState(0);
  useEffect(() => { const t = setTimeout(() => setDisp(progress), 120); return () => clearTimeout(t); }, [progress]);
  return (
    <div style={{ marginTop: 10, height: 5, background: "#1e2d3d", borderRadius: 4, overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${disp}%`,
        background: `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.accent})`,
        borderRadius: 4,
        transition: "width 0.9s cubic-bezier(0.34,1.2,0.64,1)",
        boxShadow: `0 0 8px ${COLORS.accent}80`,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.28) 50%,transparent 100%)", animation: "shimmer 1.8s infinite" }} />
      </div>
    </div>
  );
}

// ── STREAK BADGE ──────────────────────────────────────────────────────────────
function StreakBadge({ streak }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 5,
      background: `linear-gradient(90deg, ${COLORS.red}18, ${COLORS.gold}18)`,
      border: `1px solid ${COLORS.gold}38`, borderRadius: 20,
      padding: "5px 12px",
      animation: "streakGlow 2.2s ease-in-out infinite",
    }}>
      <span style={{ fontSize: 16, animation: "flame 0.6s ease-in-out infinite alternate" }}>🔥</span>
      <span style={{ fontWeight: 900, color: COLORS.gold, fontSize: 14 }}>{streak}</span>
      <span style={{ fontSize: 11, color: COLORS.muted }}>días</span>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
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
  const [debtAmount, setDebtAmount] = useState("");
  const [debtRate, setDebtRate] = useState("");
  const [debtMonths, setDebtMonths] = useState("");
  const [calcResult, setCalcResult] = useState(null);
  const [streak] = useState(7);

  // Animation state
  const [confetti, setConfetti] = useState(false);
  const [floats, setFloats] = useState([]);
  const [achievement, setAchievement] = useState(null);
  const [mascotMood, setMascotMood] = useState("idle");
  const [speech, setSpeech] = useState("");
  const [showSpeech, setShowSpeech] = useState(false);
  const [levelUpVisible, setLevelUpVisible] = useState(false);
  const [levelUpNum, setLevelUpNum] = useState(null);
  const [completedId, setCompletedId] = useState(null);
  const [tabChanging, setTabChanging] = useState(false);
  const speechTimer = useRef(null);

  const level = Math.floor(points / 500) + 1;
  const levelProgress = ((points % 500) / 500) * 100;

  const mascotLines = [
    "¡Sigue así, campeón! 💪",
    `🔥 ${streak} días de racha. ¡No pares!`,
    "Registra un gasto y gana 20 pts ⚡",
    "¿Revisaste tu meta de ahorro hoy? 🎯",
    "¡Ya casi llegas al siguiente nivel! 🚀",
    "Tip: aplica la regla 50/30/20 💡",
  ];

  function spawnFloat(text, x = "44%", y = "38%") {
    const id = Date.now() + Math.random();
    setFloats(f => [...f, { id, text, x, y }]);
    setTimeout(() => setFloats(f => f.filter(i => i.id !== id)), 1700);
  }

  function triggerMascot(mood, msg) {
    setMascotMood(mood);
    setSpeech(msg);
    setShowSpeech(true);
    if (speechTimer.current) clearTimeout(speechTimer.current);
    speechTimer.current = setTimeout(() => { setShowSpeech(false); setMascotMood("idle"); }, 3000);
  }

  function addTransaction() {
    if (!newDesc || !newAmount) return;
    const amt = newType === "gasto" ? -Math.abs(parseFloat(newAmount)) : Math.abs(parseFloat(newAmount));
    setTransactions(prev => [{ id: Date.now(), desc: newDesc, amount: amt, cat: newType === "gasto" ? "💸" : "💰", date: "Ahora" }, ...prev]);
    setBalance(b => b + amt);
    const oldPts = points;
    const newPts = points + 20;
    setPoints(newPts);
    setSaved(s => newType === "ahorro" ? s + Math.abs(amt) : s);
    setNewDesc(""); setNewAmount(""); setShowAdd(false);
    spawnFloat("+20 ⚡");
    triggerMascot("excited", "¡Registrado! +20 puntos 🎉");
    const oldLvl = Math.floor(oldPts / 500) + 1;
    const newLvl = Math.floor(newPts / 500) + 1;
    if (newLvl > oldLvl) setTimeout(() => { setLevelUpNum(newLvl); setLevelUpVisible(true); setConfetti(true); triggerMascot("celebrate", "¡SUBISTE DE NIVEL! 🏅"); }, 350);
  }

  function completeChallenge(id, pts, icon, title) {
    if (completedChallenges.includes(id)) return;
    setCompletedChallenges(c => [...c, id]);
    const oldPts = points;
    const newPts = points + pts;
    setPoints(newPts);
    setCompletedId(id); setTimeout(() => setCompletedId(null), 700);
    setConfetti(true);
    spawnFloat(`+${pts} ⚡`);
    setAchievement({ icon, title, pts });
    triggerMascot("celebrate", `¡Reto completado! +${pts} pts 🏆`);
    const oldLvl = Math.floor(oldPts / 500) + 1;
    const newLvl = Math.floor(newPts / 500) + 1;
    if (newLvl > oldLvl) setTimeout(() => { setLevelUpNum(newLvl); setLevelUpVisible(true); }, 2200);
  }

  function calcDebt() {
    const P = parseFloat(debtAmount), r = parseFloat(debtRate) / 100 / 12, n = parseInt(debtMonths);
    if (!P || !r || !n) return;
    const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n;
    setCalcResult({ monthly: monthly.toFixed(2), total: total.toFixed(2), interest: (total - P).toFixed(2) });
    spawnFloat("🧮 ¡Calculado!", "36%", "55%");
  }

  function changeTab(id) {
    setTabChanging(true);
    setTimeout(() => { setTab(id); setTabChanging(false); }, 160);
  }

  const navItems = [
    { id: "dashboard", icon: "🏠", label: "Inicio" },
    { id: "gastos", icon: "💳", label: "Gastos" },
    { id: "retos", icon: "🏆", label: "Retos" },
    { id: "tips", icon: "📚", label: "Tips" },
    { id: "premios", icon: "🎁", label: "Premios" },
  ];

  const inp = { width: "100%", background: "#1e2d3d", border: `1px solid ${COLORS.cardBorder}`, borderRadius: 10, padding: "10px 14px", color: COLORS.text, fontSize: 14, marginBottom: 10, boxSizing: "border-box", outline: "none" };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: COLORS.bg, minHeight: "100vh", color: COLORS.text, maxWidth: 420, margin: "0 auto", position: "relative", paddingBottom: 80, overflowX: "hidden" }}>

      {/* Global animations */}
      <style>{`
        @keyframes confettiFall { 0%{transform:translateY(0) rotate(0);opacity:1} 100%{transform:translateY(110vh) rotate(720deg);opacity:0} }
        @keyframes floatUp { 0%{transform:translateY(0) scale(0.7);opacity:1} 45%{transform:translateY(-32px) scale(1.25);opacity:1} 100%{transform:translateY(-95px) scale(1);opacity:0} }
        @keyframes toastSlide { 0%{transform:translateX(-50%) translateY(-28px) scale(0.85);opacity:0} 100%{transform:translateX(-50%) translateY(0) scale(1);opacity:1} }
        @keyframes spinPop { 0%{transform:scale(0) rotate(-200deg)} 100%{transform:scale(1) rotate(0)} }
        @keyframes levelUpPop { 0%{transform:scale(0.4) rotate(-8deg);opacity:0} 100%{transform:scale(1) rotate(0);opacity:1} }
        @keyframes mascotFloat { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-11px) rotate(3deg)} }
        @keyframes mascotBounce { 0%{transform:translateY(0) scale(1)} 100%{transform:translateY(-15px) scale(1.12)} }
        @keyframes mascotCelebrate { 0%{transform:translateY(0) rotate(-14deg) scale(1)} 100%{transform:translateY(-13px) rotate(14deg) scale(1.16)} }
        @keyframes dotPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        @keyframes bubblePop { 0%{transform:scale(0.5) translateY(8px);opacity:0} 100%{transform:scale(1) translateY(0);opacity:1} }
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }
        @keyframes streakGlow { 0%,100%{box-shadow:none} 50%{box-shadow:0 0 14px ${COLORS.gold}38} }
        @keyframes flame { 0%{transform:scale(1) rotate(-6deg)} 100%{transform:scale(1.18) rotate(6deg)} }
        @keyframes slideInTab { 0%{opacity:0;transform:translateY(12px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes fadeOut { 0%{opacity:1} 100%{opacity:0} }
        @keyframes rowIn { 0%{opacity:0;transform:translateX(-10px)} 100%{opacity:1;transform:translateX(0)} }
        @keyframes challengeBurst { 0%{transform:scale(1)} 40%{transform:scale(1.07)} 100%{transform:scale(1)} }
        @keyframes popIn { 0%{transform:scale(0.8);opacity:0} 100%{transform:scale(1);opacity:1} }
        @keyframes sheetUp { 0%{transform:translateY(100%)} 100%{transform:translateY(0)} }
        @keyframes navDot { 0%{transform:scale(0)} 100%{transform:scale(1)} }
        @keyframes navIcon { 0%{transform:translateY(5px) scale(0.8)} 100%{transform:translateY(0) scale(1)} }
        @keyframes orbDrift { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(-8px) translateX(4px)} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 0 transparent} 50%{box-shadow:0 0 18px ${COLORS.gold}35} }
      `}</style>

      <Confetti active={confetti} onDone={() => setConfetti(false)} />
      <FloatingPoints items={floats} />
      <AchievementToast achievement={achievement} onClose={() => setAchievement(null)} />
      <LevelUpModal level={levelUpNum} visible={levelUpVisible} onClose={() => setLevelUpVisible(false)} />
      <Mascot mood={mascotMood} onClick={() => triggerMascot("excited", mascotLines[Math.floor(Math.random() * mascotLines.length)])} />
      <SpeechBubble text={speech} visible={showSpeech} />

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", padding: "20px 20px 16px", borderBottom: `1px solid ${COLORS.cardBorder}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>💎 FinWin</div>
            <div style={{ fontSize: 12, color: COLORS.muted }}>Controla · Ahorra · Gana</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 18, animation: "flame 0.8s ease-in-out infinite alternate" }}>⚡</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.gold }}>{points.toLocaleString()}</span>
              <span style={{ fontSize: 12, color: COLORS.muted }}>pts</span>
            </div>
            <StreakBadge streak={streak} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontSize: 11, color: COLORS.purple, fontWeight: 700 }}>Nivel {level}</span>
          <span style={{ fontSize: 11, color: COLORS.muted }}>{Math.round(levelProgress)}% → Nv. {level + 1}</span>
        </div>
        <XPBar progress={levelProgress} />
      </div>

      {/* Content */}
      <div style={{ animation: tabChanging ? "fadeOut 0.15s ease forwards" : "slideInTab 0.35s ease both" }}>

        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <div style={{ padding: 16 }}>
            <div style={{ background: "linear-gradient(135deg, #0c4a6e, #1e3a5f)", borderRadius: 16, padding: "20px 24px", marginBottom: 16, border: `1px solid ${COLORS.accent}30`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -24, right: -24, width: 110, height: 110, borderRadius: "50%", background: `${COLORS.accent}0c`, animation: "orbDrift 4s ease-in-out infinite" }} />
              <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>Balance total</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#fff" }}>${balance.toLocaleString("es", { minimumFractionDigits: 2 })}</div>
              <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
                <div><div style={{ fontSize: 11, color: "#94a3b8" }}>Ingresos</div><div style={{ fontSize: 16, fontWeight: 700, color: COLORS.green }}>+$1,450</div></div>
                <div><div style={{ fontSize: 11, color: "#94a3b8" }}>Gastos</div><div style={{ fontSize: 16, fontWeight: 700, color: COLORS.red }}>-$85.50</div></div>
              </div>
            </div>

            <div style={{ background: COLORS.card, borderRadius: 14, padding: 16, marginBottom: 16, border: `1px solid ${COLORS.cardBorder}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontWeight: 700 }}>🎯 Meta de ahorro</span>
                <span style={{ color: COLORS.accent, fontWeight: 700 }}>${saved} / ${savingsGoal}</span>
              </div>
              <div style={{ height: 8, background: "#1e2d3d", borderRadius: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(saved / savingsGoal) * 100}%`, background: `linear-gradient(90deg, ${COLORS.green}, ${COLORS.accent})`, borderRadius: 8, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)", animation: "shimmer 2s infinite" }} />
                </div>
              </div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 6 }}>{Math.round((saved / savingsGoal) * 100)}% completado — ¡Sigue así!</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[
                { label: "Agregar gasto", icon: "➕", color: COLORS.red, action: () => { setNewType("gasto"); setShowAdd(true); } },
                { label: "Registrar ingreso", icon: "💵", color: COLORS.green, action: () => { setNewType("ingreso"); setShowAdd(true); } },
              ].map(btn => (
                <button key={btn.label} onClick={btn.action}
                  style={{ background: `${btn.color}15`, border: `1px solid ${btn.color}40`, borderRadius: 12, padding: "14px 10px", cursor: "pointer", color: btn.color, fontWeight: 700, fontSize: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transition: "transform 0.12s" }}
                  onPointerDown={e => e.currentTarget.style.transform = "scale(0.93)"}
                  onPointerUp={e => e.currentTarget.style.transform = "scale(1)"}>
                  <span style={{ fontSize: 24 }}>{btn.icon}</span>{btn.label}
                </button>
              ))}
            </div>

            <div style={{ background: COLORS.card, borderRadius: 14, padding: 16, border: `1px solid ${COLORS.cardBorder}` }}>
              <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>Movimientos recientes</div>
              {transactions.slice(0, 4).map((t, i) => (
                <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${COLORS.cardBorder}`, animation: `rowIn 0.3s ${i * 0.07}s ease both` }}>
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

        {/* ── GASTOS ── */}
        {tab === "gastos" && (
          <div style={{ padding: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 16 }}>💳 Mis Transacciones</div>
            <button onClick={() => setShowAdd(true)}
              style={{ width: "100%", background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.purple})`, border: "none", borderRadius: 12, padding: 14, color: "#0a0e1a", fontWeight: 800, fontSize: 15, cursor: "pointer", marginBottom: 16, transition: "transform 0.12s" }}
              onPointerDown={e => e.currentTarget.style.transform = "scale(0.97)"}
              onPointerUp={e => e.currentTarget.style.transform = "scale(1)"}>
              + Nuevo registro (+20pts)
            </button>
            {transactions.map((t, i) => (
              <div key={t.id} style={{ background: COLORS.card, borderRadius: 12, padding: "14px 16px", marginBottom: 10, border: `1px solid ${COLORS.cardBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center", animation: `rowIn 0.25s ${i * 0.05}s ease both` }}>
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

        {/* ── RETOS ── */}
        {tab === "retos" && (
          <div style={{ padding: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>🏆 Retos Financieros</div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 16 }}>Completa retos y gana puntos canjeables</div>
            {challenges.map((c, i) => {
              const done = completedChallenges.includes(c.id);
              const justDone = completedId === c.id;
              return (
                <div key={c.id} style={{
                  background: COLORS.card, borderRadius: 14, padding: 16, marginBottom: 12,
                  border: `1px solid ${done ? COLORS.gold + "55" : COLORS.cardBorder}`,
                  opacity: done ? 0.82 : 1,
                  animation: justDone ? "challengeBurst 0.5s cubic-bezier(0.34,1.56,0.64,1)" : `rowIn 0.3s ${i * 0.09}s ease both`,
                  transition: "border-color 0.4s",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 28, animation: justDone ? "spinPop 0.5s ease" : "none" }}>{c.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{c.title}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                          <span style={{ fontSize: 14 }}>⚡</span>
                          <span style={{ color: COLORS.gold, fontWeight: 700 }}>+{c.pts} puntos</span>
                        </div>
                      </div>
                    </div>
                    {done
                      ? <span style={{ background: `${COLORS.green}20`, color: COLORS.green, borderRadius: 20, padding: "4px 12px", fontSize: 13, fontWeight: 700, animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>✓ Listo</span>
                      : <button onClick={() => completeChallenge(c.id, c.pts, c.icon, c.title)}
                          style={{ background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.purple})`, border: "none", borderRadius: 20, padding: "6px 14px", color: "#0a0e1a", fontWeight: 700, cursor: "pointer", fontSize: 13, transition: "transform 0.12s" }}
                          onPointerDown={e => e.currentTarget.style.transform = "scale(0.9)"}
                          onPointerUp={e => e.currentTarget.style.transform = "scale(1)"}>
                          Completar
                        </button>
                    }
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── TIPS ── */}
        {tab === "tips" && (
          <div style={{ padding: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>📚 Educación Financiera</div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 16 }}>Aprende a manejar mejor tu dinero</div>
            {tips.map((t, i) => (
              <div key={i} style={{ background: `linear-gradient(135deg, ${COLORS.card}, #1a2332)`, borderRadius: 14, padding: 18, marginBottom: 12, border: `1px solid ${COLORS.cardBorder}`, animation: `rowIn 0.3s ${i * 0.1}s ease both` }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{t.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{t.title}</div>
                <div style={{ color: "#94a3b8", lineHeight: 1.6, fontSize: 14 }}>{t.body}</div>
              </div>
            ))}
            <div style={{ background: COLORS.card, borderRadius: 14, padding: 18, border: `1px solid ${COLORS.purple}40` }}>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>🧮 Calculadora de deudas</div>
              {[
                { label: "Monto de deuda ($)", val: debtAmount, set: setDebtAmount },
                { label: "Tasa anual (%)", val: debtRate, set: setDebtRate },
                { label: "Meses a pagar", val: debtMonths, set: setDebtMonths },
              ].map(f => (
                <input key={f.label} type="number" placeholder={f.label} value={f.val} onChange={e => f.set(e.target.value)} style={inp} />
              ))}
              <button onClick={calcDebt} style={{ width: "100%", background: `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.accent})`, border: "none", borderRadius: 10, padding: 12, color: "#0a0e1a", fontWeight: 800, cursor: "pointer", fontSize: 15 }}>Calcular</button>
              {calcResult && (
                <div style={{ marginTop: 14, background: "#0f172a", borderRadius: 10, padding: 14, animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
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

        {/* ── PREMIOS ── */}
        {tab === "premios" && (
          <div style={{ padding: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>🎁 Tienda de Premios</div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 8 }}>Canjea tus puntos por recompensas reales</div>
            <div style={{ background: `linear-gradient(90deg, ${COLORS.gold}20, ${COLORS.purple}20)`, borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", animation: "glowPulse 2.5s ease-in-out infinite" }}>
              <span style={{ fontWeight: 700 }}>⚡ Mis puntos</span>
              <span style={{ fontWeight: 900, fontSize: 22, color: COLORS.gold }}>{points.toLocaleString()}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {prizes.map((p, i) => (
                <div key={p.pts} style={{ background: COLORS.card, borderRadius: 14, padding: 18, border: `1px solid ${p.unlocked ? COLORS.gold + "50" : COLORS.cardBorder}`, textAlign: "center", opacity: p.unlocked ? 1 : 0.5, animation: `rowIn 0.3s ${i * 0.08}s ease both`, transition: "transform 0.2s" }}
                  onPointerEnter={e => { if (p.unlocked) e.currentTarget.style.transform = "scale(1.05)"; }}
                  onPointerLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                  <div style={{ fontSize: 40, marginBottom: 8, animation: p.unlocked ? `orbDrift ${2.2 + i * 0.4}s ease-in-out infinite` : "none" }}>{p.icon}</div>
                  <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 14 }}>{p.label}</div>
                  <div style={{ fontSize: 13, color: COLORS.gold }}>⚡ {p.pts.toLocaleString()} pts</div>
                  {p.unlocked
                    ? <button
                        onClick={() => { setConfetti(true); spawnFloat("🎁 ¡Canjeado!", "38%", "42%"); triggerMascot("celebrate", "¡Disfuta tu premio! 🎉"); }}
                        style={{ marginTop: 10, background: `linear-gradient(90deg, ${COLORS.gold}, #f59e0b)`, border: "none", borderRadius: 20, padding: "6px 16px", color: "#0a0e1a", fontWeight: 800, cursor: "pointer", fontSize: 13, transition: "transform 0.12s" }}
                        onPointerDown={e => e.currentTarget.style.transform = "scale(0.9)"}
                        onPointerUp={e => e.currentTarget.style.transform = "scale(1)"}>
                        Canjear
                      </button>
                    : <div style={{ marginTop: 10, fontSize: 12, color: COLORS.muted }}>Faltan {(p.pts - points).toLocaleString()} pts</div>
                  }
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add modal */}
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "#000000bb", display: "flex", alignItems: "flex-end", zIndex: 50 }} onClick={() => setShowAdd(false)}>
          <div style={{ background: "#111827", borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxWidth: 420, margin: "0 auto", border: `1px solid ${COLORS.cardBorder}`, animation: "sheetUp 0.35s cubic-bezier(0.34,1.2,0.64,1)" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 16 }}>{newType === "gasto" ? "💸 Nuevo Gasto" : "💵 Nuevo Ingreso"}</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {["gasto", "ingreso", "ahorro"].map(t => (
                <button key={t} onClick={() => setNewType(t)} style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: "none", background: newType === t ? COLORS.accent : "#1e2d3d", color: newType === t ? "#0a0e1a" : COLORS.muted, fontWeight: 700, cursor: "pointer", fontSize: 13, textTransform: "capitalize", transition: "background 0.2s, transform 0.12s", transform: newType === t ? "scale(1.05)" : "scale(1)" }}>{t}</button>
              ))}
            </div>
            <input type="text" placeholder="Descripción" value={newDesc} onChange={e => setNewDesc(e.target.value)} style={{ ...inp, fontSize: 15, padding: "12px 14px", marginBottom: 12 }} />
            <input type="number" placeholder="Monto ($)" value={newAmount} onChange={e => setNewAmount(e.target.value)} style={{ ...inp, fontSize: 15, padding: "12px 14px", marginBottom: 16 }} />
            <button onClick={addTransaction}
              style={{ width: "100%", background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.purple})`, border: "none", borderRadius: 12, padding: 14, color: "#0a0e1a", fontWeight: 800, fontSize: 16, cursor: "pointer", transition: "transform 0.12s" }}
              onPointerDown={e => e.currentTarget.style.transform = "scale(0.97)"}
              onPointerUp={e => e.currentTarget.style.transform = "scale(1)"}>
              Guardar (+20 pts ⚡)
            </button>
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 420, background: "#0d1421", borderTop: `1px solid ${COLORS.cardBorder}`, display: "flex", justifyContent: "space-around", padding: "8px 0 12px" }}>
        {navItems.map(n => (
          <button key={n.id} onClick={() => changeTab(n.id)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 8px", transition: "transform 0.12s" }}
            onPointerDown={e => e.currentTarget.style.transform = "scale(0.82)"}
            onPointerUp={e => e.currentTarget.style.transform = "scale(1)"}>
            <span style={{ fontSize: 22, filter: tab === n.id ? "none" : "grayscale(0.7)", transition: "filter 0.2s", animation: tab === n.id ? "navIcon 0.35s cubic-bezier(0.34,1.56,0.64,1)" : "none" }}>{n.icon}</span>
            <span style={{ fontSize: 10, color: tab === n.id ? COLORS.accent : COLORS.muted, fontWeight: tab === n.id ? 700 : 400, transition: "color 0.2s" }}>{n.label}</span>
            {tab === n.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: COLORS.accent, animation: "navDot 0.3s ease" }} />}
          </button>
        ))}
      </div>
    </div>
  );
}
