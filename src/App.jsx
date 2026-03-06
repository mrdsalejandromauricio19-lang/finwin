import { useState, useRef, useEffect, useCallback } from "react";

const C = {
  bg:"#050810",bg2:"#0a0d1a",card:"#0d1117",card2:"#111520",border:"#1a2035",
  blue:"#0066ff",blueEl:"#0099ff",blueBright:"#00c8ff",silver:"#b8c4d4",
  silverBright:"#dce8f5",green:"#00e676",red:"#ff1744",gold:"#ffc107",
  text:"#e8f0fe",muted:"#4a5568",white:"#ffffff",purple:"#7c3aed"
};

// ── DATA ──────────────────────────────────────────────────────────────────────
const challenges = [
  {id:1,title:"No gastar en lujos 3 días",pts:150,icon:"🎯",proof:"Foto de tu billetera o captura sin gastos de lujo"},
  {id:2,title:"Ahorra $50 esta semana",pts:200,icon:"💰",proof:"Captura de saldo o transferencia a ahorro"},
  {id:3,title:"Registra 5 gastos seguidos",pts:100,icon:"📝",proof:"Captura de tus 5 transacciones en la app"},
  {id:4,title:"Reduce gastos un 10%",pts:300,icon:"📉",proof:"Comparativa semana anterior vs esta semana"},
  {id:5,title:"Crea un presupuesto mensual",pts:250,icon:"📊",proof:"Foto de tu presupuesto con ingresos y gastos"},
];
const tips = [
  {icon:"💡",title:"Regla 50/30/20",body:"Destina 50% a necesidades, 30% a deseos y 20% al ahorro."},
  {icon:"🔥",title:"Fondo de emergencia",body:"Tener 3-6 meses de gastos ahorrados te da tranquilidad."},
  {icon:"📈",title:"Invierte desde $10",body:"Lo importante es el hábito constante de invertir."},
  {icon:"🧠",title:"Evita deudas de consumo",body:"Las tarjetas pueden cobrarte hasta 40% anual en intereses."},
];
const prizes = [
  {pts:500,label:"Café gratis",icon:"☕",desc:"En cafeterías aliadas"},
  {pts:1000,label:"Mes Premium",icon:"⭐",desc:"FinWin sin límites"},
  {pts:2000,label:"Gift Card $20",icon:"🎁",desc:"Amazon o similar"},
  {pts:5000,label:"Viaje sorpresa",icon:"✈️",desc:"Destino a revelar"},
];
const triviaQ = [
  {q:"¿Qué significa 'inflación'?",opts:["Subida de precios","Bajada de precios","Aumento de salarios","Reducción de impuestos"],ans:0,pts:50},
  {q:"¿Qué es un activo?",opts:["Una deuda","Algo que te da dinero","Un gasto fijo","Un impuesto"],ans:1,pts:50},
  {q:"¿Qué es el interés compuesto?",opts:["Interés sobre deuda","Interés sobre interés","Un tipo de cuenta","Un impuesto bancario"],ans:1,pts:75},
  {q:"¿Qué es un presupuesto?",opts:["Un tipo de inversión","Plan de ingresos y gastos","Un préstamo bancario","Un tipo de ahorro"],ans:1,pts:50},
  {q:"¿Qué es diversificar inversiones?",opts:["Poner todo en un lugar","Repartir riesgo en varios activos","Invertir solo en acciones","Guardar en efectivo"],ans:1,pts:75},
  {q:"¿Qué es el PIB?",opts:["Precio de bienes básicos","Producción total de un país","Impuesto bancario","Plan de inversión"],ans:1,pts:60},
  {q:"¿Qué significa liquidez?",opts:["Dinero en efectivo disponible","Inversiones a largo plazo","Tipo de préstamo","Deuda externa"],ans:0,pts:60},
  {q:"¿Qué es un fondo de emergencia?",opts:["Dinero para vacaciones","Ahorro para imprevistos","Inversión en bolsa","Seguro de vida"],ans:1,pts:50},
];
const hangmanWords = [
  {word:"AHORRO",hint:"Guardar dinero para el futuro"},
  {word:"PRESUPUESTO",hint:"Plan de ingresos y gastos"},
  {word:"INVERSION",hint:"Poner dinero para ganar más"},
  {word:"INFLACION",hint:"Subida general de precios"},
  {word:"LIQUIDEZ",hint:"Facilidad de convertir a efectivo"},
  {word:"DIVIDENDO",hint:"Ganancia repartida entre socios"},
  {word:"INTERES",hint:"Costo del dinero prestado"},
  {word:"ACTIVO",hint:"Bien que genera valor"},
];
const memoryCards = [
  {id:"a",emoji:"💰",label:"Ahorro"},
  {id:"b",emoji:"📈",label:"Inversión"},
  {id:"c",emoji:"💳",label:"Crédito"},
  {id:"d",emoji:"🏦",label:"Banco"},
  {id:"e",emoji:"💸",label:"Gasto"},
  {id:"f",emoji:"🪙",label:"Capital"},
];
const dailyChallenges = [
  "Revisa tus gastos de ayer","No compres nada innecesario hoy","Transfiere $5 a tu ahorro",
  "Lee un artículo sobre finanzas","Cancela una suscripción que no usas","Cocina en casa en vez de salir",
  "Anota 3 metas financieras","Compara precios antes de comprar","Ahorra el cambio de hoy",
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function useLocalStorage(key, initial) {
  const [val,setVal] = useState(()=>{
    try{const s=localStorage.getItem(key);return s?JSON.parse(s):initial;}catch{return initial;}
  });
  const set=(v)=>{setVal(prev=>{const next=typeof v==="function"?v(prev):v;try{localStorage.setItem(key,JSON.stringify(next));}catch{}return next;});};
  return [val,set];
}

// ── CONFETTI ──────────────────────────────────────────────────────────────────
function Confetti({active}) {
  if(!active) return null;
  const pieces = Array.from({length:40},(_,i)=>i);
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:999,overflow:"hidden"}}>
      {pieces.map(i=>(
        <div key={i} style={{
          position:"absolute",top:"-10px",
          left:`${Math.random()*100}%`,
          width:8,height:8,
          borderRadius:Math.random()>0.5?"50%":"0",
          background:["#0099ff","#00e676","#ffc107","#ff1744","#dce8f5","#7c3aed"][i%6],
          animation:`fall ${0.8+Math.random()*1.5}s ease-in forwards`,
          animationDelay:`${Math.random()*0.5}s`,
          transform:`rotate(${Math.random()*360}deg)`,
        }}/>
      ))}
      <style>{`@keyframes fall{to{transform:translateY(100vh) rotate(720deg);opacity:0;}}`}</style>
    </div>
  );
}

// ── ROBOT MASCOT ──────────────────────────────────────────────────────────────
function Robot({mood="idle",size=80}) {
  const moods = {
    idle:{eyes:"😐",color:C.blueEl,msg:"¡Hola! Soy Finbot 🤖"},
    happy:{eyes:"😄",color:C.green,msg:"¡Excelente trabajo!"},
    celebrate:{eyes:"🤩",color:C.gold,msg:"¡INCREÍBLE! 🎉"},
    thinking:{eyes:"🤔",color:C.silver,msg:"Hmm... piensa bien"},
    sad:{eyes:"😢",color:C.red,msg:"¡Inténtalo de nuevo!"},
    streak:{eyes:"🔥",color:C.gold,msg:"¡Racha activa!"},
  };
  const m = moods[mood]||moods.idle;
  const bounce = mood==="celebrate"||mood==="happy";
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
      <div style={{
        width:size,height:size,borderRadius:size*0.25,
        background:`linear-gradient(135deg,#0d1117,#111520)`,
        border:`2px solid ${m.color}`,
        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        position:"relative",
        boxShadow:`0 0 20px ${m.color}40`,
        animation:bounce?"robotBounce 0.5s ease infinite alternate":"none",
      }}>
        {/* antenna */}
        <div style={{position:"absolute",top:-16,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center"}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:m.color,boxShadow:`0 0 8px ${m.color}`}}/>
          <div style={{width:2,height:10,background:m.color}}/>
        </div>
        {/* face */}
        <div style={{fontSize:size*0.35}}>{m.eyes}</div>
        {/* mouth */}
        <div style={{width:size*0.35,height:4,borderRadius:4,background:m.color,marginTop:4,opacity:0.8}}/>
        {/* chest light */}
        <div style={{position:"absolute",bottom:10,width:8,height:8,borderRadius:"50%",background:m.color,boxShadow:`0 0 8px ${m.color}`,animation:"pulse 1s ease infinite"}}/>
      </div>
      <div style={{fontSize:11,color:m.color,fontWeight:700,textAlign:"center",maxWidth:120}}>{m.msg}</div>
      <style>{`
        @keyframes robotBounce{from{transform:translateY(0)}to{transform:translateY(-8px)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.8)}}
      `}</style>
    </div>
  );
}

// ── TRIVIA GAME ───────────────────────────────────────────────────────────────
function TriviaGame({onEarn}) {
  const [qi,setQi] = useState(()=>Math.floor(Math.random()*triviaQ.length));
  const [selected,setSelected] = useState(null);
  const [done,setDone] = useState(false);
  const [score,setScore] = useState(0);
  const [round,setRound] = useState(0);
  const [robotMood,setRobotMood] = useState("thinking");
  const q = triviaQ[qi];
  const maxRounds = 5;

  function answer(i) {
    if(selected!==null) return;
    setSelected(i);
    const correct = i===q.ans;
    setRobotMood(correct?"celebrate":"sad");
    if(correct){const s=score+q.pts;setScore(s);if(round+1>=maxRounds){setTimeout(()=>{onEarn(s);setDone(true);},900);}
    } else {if(round+1>=maxRounds){setTimeout(()=>{onEarn(score);setDone(true);},900);}}
    setTimeout(()=>{
      if(round+1<maxRounds){
        setQi(Math.floor(Math.random()*triviaQ.length));
        setSelected(null);setRound(r=>r+1);setRobotMood("thinking");
      }
    },900);
  }
  if(done) return (
    <div style={{textAlign:"center",padding:24}}>
      <Robot mood={score>0?"celebrate":"sad"} size={100}/>
      <div style={{fontSize:28,fontWeight:900,color:C.gold,marginTop:16}}>+{score} pts</div>
      <div style={{color:C.silver,fontSize:14,marginTop:8}}>Trivia completada</div>
    </div>
  );
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontSize:13,color:C.silver}}>Pregunta {round+1}/{maxRounds}</div>
        <div style={{color:C.gold,fontWeight:700}}>⚡ {score} pts</div>
      </div>
      <div style={{height:4,background:C.border,borderRadius:4,marginBottom:20}}>
        <div style={{height:"100%",width:`${((round)/maxRounds)*100}%`,background:`linear-gradient(90deg,${C.blue},${C.blueBright})`,borderRadius:4,transition:"width 0.4s"}}/>
      </div>
      <div style={{textAlign:"center",marginBottom:20}}><Robot mood={robotMood} size={70}/></div>
      <div style={{background:C.card2,borderRadius:14,padding:16,marginBottom:16,border:`1px solid ${C.border}`,fontSize:16,fontWeight:700,textAlign:"center",color:C.silverBright,lineHeight:1.5}}>{q.q}</div>
      {q.opts.map((o,i)=>{
        let bg=C.card,border=C.border,col=C.text;
        if(selected!==null){
          if(i===q.ans){bg=`${C.green}20`;border=C.green;col=C.green;}
          else if(i===selected&&selected!==q.ans){bg=`${C.red}20`;border=C.red;col=C.red;}
        }
        return <button key={i} onClick={()=>answer(i)} style={{width:"100%",background:bg,border:`1px solid ${border}`,borderRadius:12,padding:"12px 16px",color:col,fontWeight:600,fontSize:14,cursor:"pointer",marginBottom:8,textAlign:"left",transition:"all 0.2s"}}>{o}</button>;
      })}
    </div>
  );
}

// ── HANGMAN GAME ──────────────────────────────────────────────────────────────
function HangmanGame({onEarn}) {
  const [wi] = useState(()=>Math.floor(Math.random()*hangmanWords.length));
  const w = hangmanWords[wi];
  const [guessed,setGuessed] = useState([]);
  const [wrong,setWrong] = useState(0);
  const [done,setDone] = useState(false);
  const [won,setWon] = useState(false);
  const maxWrong = 6;
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const wordLetters = w.word.split("");
  const allGuessed = wordLetters.every(l=>guessed.includes(l));

  useEffect(()=>{
    if(allGuessed&&!done){setDone(true);setWon(true);onEarn(150);}
    if(wrong>=maxWrong&&!done){setDone(true);onEarn(0);}
  },[guessed,wrong]);

  function guess(l){
    if(guessed.includes(l)||done) return;
    setGuessed(g=>[...g,l]);
    if(!wordLetters.includes(l)) setWrong(x=>x+1);
  }
  return (
    <div>
      <div style={{textAlign:"center",marginBottom:16}}>
        <Robot mood={done?(won?"celebrate":"sad"):(wrong>3?"sad":"thinking")} size={70}/>
      </div>
      <div style={{textAlign:"center",marginBottom:8,color:C.silver,fontSize:13}}>💡 {w.hint}</div>
      <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:20,flexWrap:"wrap"}}>
        {wordLetters.map((l,i)=>(
          <div key={i} style={{width:28,height:36,borderBottom:`2px solid ${C.blueEl}`,display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:4}}>
            <span style={{fontSize:18,fontWeight:800,color:C.blueBright}}>{guessed.includes(l)?l:" "}</span>
          </div>
        ))}
      </div>
      <div style={{textAlign:"center",marginBottom:16}}>
        <span style={{fontSize:13,color:wrong>=maxWrong?C.red:C.silver}}>Errores: {wrong}/{maxWrong} {"💀".repeat(wrong)}</span>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center"}}>
        {letters.map(l=>{
          const used=guessed.includes(l);
          const correct=used&&wordLetters.includes(l);
          const incorrect=used&&!wordLetters.includes(l);
          return <button key={l} onClick={()=>guess(l)} disabled={used||done} style={{width:36,height:36,borderRadius:8,border:`1px solid ${correct?C.green:incorrect?C.red:C.border}`,background:correct?`${C.green}20`:incorrect?`${C.red}20`:C.card2,color:correct?C.green:incorrect?C.red:C.text,fontWeight:700,fontSize:13,cursor:used||done?"not-allowed":"pointer",opacity:used?0.5:1}}>{l}</button>;
        })}
      </div>
      {done&&<div style={{textAlign:"center",marginTop:20,padding:16,background:won?`${C.green}15`:`${C.red}15`,borderRadius:12,border:`1px solid ${won?C.green:C.red}`}}>
        <div style={{fontWeight:800,color:won?C.green:C.red,fontSize:16}}>{won?"🎉 ¡Correcto! +150 pts":"💀 Era: "+w.word}</div>
      </div>}
    </div>
  );
}

// ── MEMORY GAME ───────────────────────────────────────────────────────────────
function MemoryGame({onEarn}) {
  const [cards] = useState(()=>{
    const all=[...memoryCards,...memoryCards].map((c,i)=>({...c,uid:i,flipped:false,matched:false}));
    return all.sort(()=>Math.random()-0.5);
  });
  const [board,setBoard] = useState(cards);
  const [flipped,setFlipped] = useState([]);
  const [matches,setMatches] = useState(0);
  const [moves,setMoves] = useState(0);
  const [done,setDone] = useState(false);
  const [robotMood,setRobotMood] = useState("idle");

  function flip(uid){
    if(flipped.length>=2||board.find(c=>c.uid===uid)?.flipped) return;
    const nb=board.map(c=>c.uid===uid?{...c,flipped:true}:c);
    setBoard(nb);
    const nf=[...flipped,uid];
    setFlipped(nf);
    if(nf.length===2){
      setMoves(m=>m+1);
      const [a,b]=nf.map(id=>nb.find(c=>c.uid===id));
      if(a.id===b.id){
        setRobotMood("happy");
        const m=matches+1;setMatches(m);
        setBoard(prev=>prev.map(c=>nf.includes(c.uid)?{...c,matched:true}:c));
        setFlipped([]);
        if(m===memoryCards.length){const pts=Math.max(50,200-moves*10);setTimeout(()=>{onEarn(pts);setDone(true);},500);}
      } else {
        setRobotMood("sad");
        setTimeout(()=>{setBoard(prev=>prev.map(c=>nf.includes(c.uid)?{...c,flipped:false}:c));setFlipped([]);setRobotMood("thinking");},900);
      }
    }
  }
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
        <span style={{color:C.silver,fontSize:13}}>Pares: {matches}/{memoryCards.length}</span>
        <span style={{color:C.silver,fontSize:13}}>Movimientos: {moves}</span>
      </div>
      <div style={{textAlign:"center",marginBottom:16}}><Robot mood={done?"celebrate":robotMood} size={60}/></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
        {board.map(c=>(
          <button key={c.uid} onClick={()=>flip(c.uid)} style={{height:70,borderRadius:12,border:`1px solid ${c.matched?C.green:c.flipped?C.blueEl:C.border}`,background:c.flipped||c.matched?`${C.blue}20`:C.card2,cursor:c.flipped||c.matched?"default":"pointer",fontSize:c.flipped||c.matched?26:20,transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {c.flipped||c.matched?c.emoji:"❓"}
          </button>
        ))}
      </div>
      {done&&<div style={{textAlign:"center",marginTop:16,color:C.gold,fontWeight:800,fontSize:18}}>🎉 ¡Completado!</div>}
    </div>
  );
}

// ── SORT GAME ─────────────────────────────────────────────────────────────────
function SortGame({onEarn}){
  const items=[{label:"Café",val:3},{label:"Ropa",val:85},{label:"Arriendo",val:400},{label:"Netflix",val:12},{label:"Comida",val:150},{label:"Transporte",val:45}];
  const [order,setOrder]=useState(()=>[...items].sort(()=>Math.random()-0.5));
  const [done,setDone]=useState(false);
  const [checked,setChecked]=useState(false);
  const [dragging,setDragging]=useState(null);

  function moveUp(i){if(i===0)return;const a=[...order];[a[i-1],a[i]]=[a[i],a[i-1]];setOrder(a);}
  function moveDown(i){if(i===order.length-1)return;const a=[...order];[a[i],a[i+1]]=[a[i+1],a[i]];setOrder(a);}

  function check(){
    const sorted=[...order].sort((a,b)=>a.val-b.val);
    const correct=order.every((o,i)=>o.val===sorted[i].val);
    setChecked(true);setDone(true);onEarn(correct?120:30);
  }
  const sorted=[...order].sort((a,b)=>a.val-b.val);
  const correct=checked&&order.every((o,i)=>o.val===sorted[i].val);
  return (
    <div>
      <div style={{textAlign:"center",marginBottom:12}}><Robot mood={done?(correct?"celebrate":"sad"):"thinking"} size={60}/></div>
      <div style={{color:C.silver,fontSize:13,textAlign:"center",marginBottom:16}}>Ordena del menor al mayor gasto 👆👇</div>
      {order.map((item,i)=>(
        <div key={item.label} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <div style={{flex:1,background:checked?(item.val===sorted[i].val?`${C.green}20`:`${C.red}20`):C.card2,border:`1px solid ${checked?(item.val===sorted[i].val?C.green:C.red):C.border}`,borderRadius:12,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontWeight:700}}>{item.label}</span>
            {checked&&<span style={{color:C.silver,fontSize:12}}>${item.val}</span>}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            <button onClick={()=>moveUp(i)} disabled={done} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:6,width:28,height:28,cursor:"pointer",color:C.silver,fontSize:14}}>↑</button>
            <button onClick={()=>moveDown(i)} disabled={done} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:6,width:28,height:28,cursor:"pointer",color:C.silver,fontSize:14}}>↓</button>
          </div>
        </div>
      ))}
      {!done&&<button onClick={check} style={{width:"100%",background:`linear-gradient(135deg,${C.blue},${C.blueEl})`,border:"none",borderRadius:12,padding:14,color:C.white,fontWeight:800,fontSize:15,cursor:"pointer",marginTop:8,boxShadow:`0 4px 16px ${C.blue}40`}}>Verificar ✓</button>}
      {done&&<div style={{textAlign:"center",marginTop:12,padding:14,background:correct?`${C.green}15`:`${C.red}15`,borderRadius:12}}>
        <div style={{fontWeight:800,color:correct?C.green:C.red}}>{correct?"¡Perfecto! +120 pts":"Casi... +30 pts de consolación"}</div>
      </div>}
    </div>
  );
}

// ── SPIN WHEEL ────────────────────────────────────────────────────────────────
function SpinWheel({onEarn}){
  const [spinning,setSpinning]=useState(false);
  const [result,setResult]=useState(null);
  const [deg,setDeg]=useState(0);
  const today=new Date().toDateString();
  const [lastSpin,setLastSpin]=useLocalStorage("fw_lastspin","");
  const used=lastSpin===today;
  const prizes2=[
    {label:"50 pts",pts:50,color:C.blue},{label:"100 pts",pts:100,color:C.green},
    {label:"25 pts",pts:25,color:C.silver},{label:"200 pts",pts:200,color:C.gold},
    {label:"75 pts",pts:75,color:C.purple},{label:"150 pts",pts:150,color:C.blueEl},
    {label:"10 pts",pts:10,color:C.muted},{label:"300 pts",pts:300,color:C.red},
  ];
  function spin(){
    if(spinning||used) return;
    setSpinning(true);
    const idx=Math.floor(Math.random()*prizes2.length);
    const extra=3600+idx*(360/prizes2.length);
    setDeg(d=>d+extra);
    setTimeout(()=>{setResult(prizes2[idx]);setSpinning(false);setLastSpin(today);onEarn(prizes2[idx].pts);},3000);
  }
  const sliceAngle=360/prizes2.length;
  return (
    <div style={{textAlign:"center"}}>
      <div style={{textAlign:"center",marginBottom:12}}><Robot mood={result?"celebrate":spinning?"happy":"idle"} size={70}/></div>
      {/* Wheel */}
      <div style={{position:"relative",width:240,height:240,margin:"0 auto 16px"}}>
        <div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",fontSize:24,zIndex:10}}>▼</div>
        <svg width={240} height={240} style={{transform:`rotate(${deg}deg)`,transition:spinning?"transform 3s cubic-bezier(0.17,0.67,0.12,0.99)":"none",borderRadius:"50%",boxShadow:`0 0 30px ${C.blue}40`}}>
          {prizes2.map((p,i)=>{
            const start=i*sliceAngle;const end=start+sliceAngle;
            const s1=Math.sin((start*Math.PI)/180);const c1=Math.cos((start*Math.PI)/180);
            const s2=Math.sin((end*Math.PI)/180);const c2=Math.cos((end*Math.PI)/180);
            const r=120;const cx=120;const cy=120;
            const x1=cx+r*s1;const y1=cy-r*c1;const x2=cx+r*s2;const y2=cy-r*c2;
            const mid=(start+end)/2;const tx=cx+r*0.65*Math.sin((mid*Math.PI)/180);const ty=cy-r*0.65*Math.cos((mid*Math.PI)/180);
            return (
              <g key={i}>
                <path d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`} fill={p.color} opacity={0.85} stroke="#050810" strokeWidth={2}/>
                <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={11} fontWeight="bold">{p.label}</text>
              </g>
            );
          })}
          <circle cx={120} cy={120} r={16} fill="#050810" stroke={C.blueEl} strokeWidth={3}/>
        </svg>
      </div>
      {used
        ?<div style={{color:C.muted,fontSize:14,padding:12,background:C.card2,borderRadius:12,border:`1px solid ${C.border}`}}>⏰ Ya giraste hoy. Vuelve mañana.</div>
        :<button onClick={spin} disabled={spinning} style={{background:`linear-gradient(135deg,${C.blue},${C.blueEl})`,border:"none",borderRadius:14,padding:"14px 40px",color:C.white,fontWeight:800,fontSize:16,cursor:spinning?"not-allowed":"pointer",boxShadow:`0 4px 20px ${C.blue}40`}}>
          {spinning?"Girando...":"🎰 ¡Girar!"}
        </button>
      }
      {result&&<div style={{marginTop:16,padding:14,background:`${C.gold}20`,borderRadius:12,border:`1px solid ${C.gold}40`}}>
        <div style={{fontWeight:900,color:C.gold,fontSize:20}}>🎉 +{result.pts} puntos</div>
      </div>}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function FinWinApp() {
  const [tab,setTab]=useState("dashboard");
  const [points,setPoints]=useLocalStorage("fw_points",0);
  const [balance,setBalance]=useLocalStorage("fw_balance",0);
  const [transactions,setTransactions]=useLocalStorage("fw_transactions",[]);
  const [completedChallenges,setCompletedChallenges]=useLocalStorage("fw_challenges",[]);
  const [challengeProofs,setChallengeProofs]=useLocalStorage("fw_proofs",{});
  const [saved,setSaved]=useLocalStorage("fw_saved",0);
  const [streak,setStreak]=useLocalStorage("fw_streak",0);
  const [lastVisit,setLastVisit]=useLocalStorage("fw_lastvisit","");
  const [showAdd,setShowAdd]=useState(false);
  const [showProof,setShowProof]=useState(null);
  const [showRedeem,setShowRedeem]=useState(null);
  const [redeemName,setRedeemName]=useState("");
  const [redeemPhone,setRedeemPhone]=useState("");
  const [redeemSent,setRedeemSent]=useState(false);
  const [proofText,setProofText]=useState("");
  const [proofImg,setProofImg]=useState(null);
  const [newDesc,setNewDesc]=useState("");
  const [newAmount,setNewAmount]=useState("");
  const [newType,setNewType]=useState("gasto");
  const [savingsGoal]=useState(500);
  const [debtAmount,setDebtAmount]=useState("");
  const [debtRate,setDebtRate]=useState("");
  const [debtMonths,setDebtMonths]=useState("");
  const [calcResult,setCalcResult]=useState(null);
  const [confetti,setConfetti]=useState(false);
  const [robotMood,setRobotMood]=useState("idle");
  const [activeGame,setActiveGame]=useState(null);
  const fileRef=useRef();

  const today=new Date().toDateString();
  useEffect(()=>{
    if(lastVisit!==today){
      const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
      if(lastVisit===yesterday.toDateString()){setStreak(s=>s+1);}
      else if(lastVisit!==""){setStreak(1);}
      else{setStreak(1);}
      setLastVisit(today);
    }
  },[]);

  const level=Math.floor(points/500);
  const levelProgress=((points%500)/500)*100;
  const totalIncome=transactions.filter(t=>t.amount>0).reduce((a,t)=>a+t.amount,0);
  const totalExpense=Math.abs(transactions.filter(t=>t.amount<0).reduce((a,t)=>a+t.amount,0));

  function earnPoints(pts){
    if(pts<=0) return;
    setPoints(p=>p+pts);
    setConfetti(true);setRobotMood("celebrate");
    setTimeout(()=>{setConfetti(false);setRobotMood("idle");},2500);
  }

  function addTransaction(){
    if(!newDesc||!newAmount) return;
    const now=new Date();
    const fecha=now.toLocaleDateString("es",{day:"numeric",month:"short"});
    const amt=newType==="gasto"?-Math.abs(parseFloat(newAmount)):Math.abs(parseFloat(newAmount));
    const cat=newType==="gasto"?"💸":newType==="ahorro"?"🏦":"💰";
    setTransactions(prev=>[{id:Date.now(),desc:newDesc,amount:amt,cat,date:fecha,type:newType},...prev]);
    setBalance(b=>b+amt);
    earnPoints(20);
    if(newType==="ahorro") setSaved(s=>s+Math.abs(amt));
    setNewDesc("");setNewAmount("");setShowAdd(false);
  }

  function submitProof(challengeId,pts){
    if(!proofText&&!proofImg) return;
    setChallengeProofs(prev=>({...prev,[challengeId]:{text:proofText,img:proofImg,date:new Date().toLocaleDateString("es")}}));
    setCompletedChallenges(c=>[...c,challengeId]);
    earnPoints(pts);
    setProofText("");setProofImg(null);setShowProof(null);
  }

  function handleImgUpload(e){
    const file=e.target.files[0];if(!file) return;
    const reader=new FileReader();
    reader.onload=(ev)=>setProofImg(ev.target.result);
    reader.readAsDataURL(file);
  }

  function calcDebt(){
    const P=parseFloat(debtAmount),r=parseFloat(debtRate)/100/12,n=parseInt(debtMonths);
    if(!P||!r||!n) return;
    const monthly=(P*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
    const total=monthly*n;
    setCalcResult({monthly:monthly.toFixed(2),total:total.toFixed(2),interest:(total-P).toFixed(2)});
  }

  function sendRedeem(prize){
    if(!redeemName||!redeemPhone) return;
    const msg=encodeURIComponent(`🎁 *CANJE FINWIN*\n\n👤 ${redeemName}\n📱 ${redeemPhone}\n🏆 ${prize.icon} ${prize.label}\n⚡ ${prize.pts} pts`);
    setPoints(p=>p-prize.pts);setRedeemSent(true);
    setTimeout(()=>window.open(`https://wa.me/593981257047?text=${msg}`,"_blank"),500);
  }

  const inp={width:"100%",background:"#0a0d1a",border:"1px solid #1a2035",borderRadius:10,padding:"12px 14px",color:C.text,fontSize:15,marginBottom:12,boxSizing:"border-box",outline:"none",fontFamily:"'Segoe UI',sans-serif"};
  const navItems=[
    {id:"dashboard",icon:"⬡",label:"Inicio"},
    {id:"gastos",icon:"◈",label:"Gastos"},
    {id:"retos",icon:"◆",label:"Retos"},
    {id:"juegos",icon:"🎮",label:"Juegos"},
    {id:"premios",icon:"✦",label:"Premios"},
  ];
  const games=[
    {id:"trivia",icon:"🧠",label:"Trivia",desc:"5 preguntas de finanzas",pts:"hasta 375 pts",comp:TriviaGame},
    {id:"hangman",icon:"🔡",label:"Ahorcado",desc:"Adivina términos financieros",pts:"150 pts",comp:HangmanGame},
    {id:"memory",icon:"🃏",label:"Memoria",desc:"Encuentra los pares",pts:"hasta 200 pts",comp:MemoryGame},
    {id:"spin",icon:"🎰",label:"Ruleta",desc:"Gira una vez al día",pts:"hasta 300 pts",comp:SpinWheel},
    {id:"sort",icon:"📊",label:"Ordenar",desc:"Ordena los gastos",pts:"120 pts",comp:SortGame},
  ];

  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:C.bg,minHeight:"100vh",color:C.text,maxWidth:430,margin:"0 auto",position:"relative",paddingBottom:80}}>
      <Confetti active={confetti}/>
      <div style={{position:"fixed",top:-100,left:"50%",transform:"translateX(-50%)",width:300,height:300,background:`radial-gradient(circle,#0066ff15 0%,transparent 70%)`,pointerEvents:"none",zIndex:0}}/>

      {/* HEADER */}
      <div style={{position:"relative",zIndex:1,background:`linear-gradient(180deg,#080c18 0%,#0a0d1a 100%)`,padding:"16px 20px 12px",borderBottom:`1px solid #1a2035`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,#0066ff,#00c8ff)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,boxShadow:`0 0 12px #0066ff60`}}>💎</div>
              <div style={{fontSize:22,fontWeight:900,letterSpacing:"-0.5px",background:`linear-gradient(90deg,#00c8ff,#dce8f5)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>FinWin</div>
            </div>
            <div style={{fontSize:11,color:C.muted,marginTop:2,letterSpacing:"1px",textTransform:"uppercase"}}>Controla · Ahorra · Gana</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {/* Streak */}
            <div style={{background:`${C.gold}15`,border:`1px solid ${C.gold}40`,borderRadius:10,padding:"6px 10px",textAlign:"center"}}>
              <div style={{fontSize:16}}>🔥</div>
              <div style={{fontSize:11,color:C.gold,fontWeight:700}}>{streak}d</div>
            </div>
            {/* Points */}
            <div style={{background:`linear-gradient(135deg,#111520,#151a2e)`,border:`1px solid #0099ff30`,borderRadius:12,padding:"8px 14px",textAlign:"right"}}>
              <div style={{display:"flex",alignItems:"center",gap:5,justifyContent:"flex-end"}}>
                <span style={{fontSize:14,color:C.blueEl}}>⚡</span>
                <span style={{fontSize:20,fontWeight:900,background:`linear-gradient(90deg,#0099ff,#00c8ff)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{points.toLocaleString()}</span>
              </div>
              <div style={{fontSize:11,color:C.silver,marginTop:2}}>Nv.{level} · {Math.round(levelProgress)}%</div>
            </div>
          </div>
        </div>
        <div style={{marginTop:10,height:3,background:"#1a2035",borderRadius:4,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${levelProgress}%`,background:`linear-gradient(90deg,#0066ff,#00c8ff)`,borderRadius:4,transition:"width 0.6s ease",boxShadow:`0 0 8px #0066ff`}}/>
        </div>
      </div>

      {/* DASHBOARD */}
      {tab==="dashboard"&&(
        <div style={{padding:16,position:"relative",zIndex:1}}>
          {/* Robot greeting */}
          <div style={{display:"flex",alignItems:"center",gap:16,background:C.card,borderRadius:16,padding:16,marginBottom:16,border:`1px solid #1a2035`}}>
            <Robot mood={streak>=3?"streak":"idle"} size={70}/>
            <div>
              <div style={{fontWeight:800,fontSize:16,color:C.silverBright}}>¡Hola, campeón! 👋</div>
              <div style={{fontSize:13,color:C.silver,marginTop:4}}>Racha: <span style={{color:C.gold,fontWeight:700}}>{streak} días 🔥</span></div>
              <div style={{fontSize:12,color:C.muted,marginTop:4}}>Reto del día: {dailyChallenges[new Date().getDay()%dailyChallenges.length]}</div>
            </div>
          </div>

          {/* Balance */}
          <div style={{background:`linear-gradient(135deg,#080e20,#0a1428,#06101e)`,borderRadius:20,padding:24,marginBottom:16,border:`1px solid #0099ff30`,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-20,right:-20,width:120,height:120,background:`radial-gradient(circle,#0066ff20,transparent 70%)`,borderRadius:"50%"}}/>
            <div style={{fontSize:12,color:C.silver,letterSpacing:"1px",textTransform:"uppercase",marginBottom:6}}>Balance Total</div>
            <div style={{fontSize:38,fontWeight:900,color:C.white,letterSpacing:"-1px"}}>${balance.toLocaleString("es",{minimumFractionDigits:2})}</div>
            <div style={{display:"flex",gap:24,marginTop:16}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:28,height:28,borderRadius:8,background:`${C.green}20`,display:"flex",alignItems:"center",justifyContent:"center"}}>↑</div>
                <div><div style={{fontSize:11,color:C.muted}}>Ingresos</div><div style={{fontSize:15,fontWeight:700,color:C.green}}>+${totalIncome.toFixed(2)}</div></div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:28,height:28,borderRadius:8,background:`${C.red}20`,display:"flex",alignItems:"center",justifyContent:"center"}}>↓</div>
                <div><div style={{fontSize:11,color:C.muted}}>Gastos</div><div style={{fontSize:15,fontWeight:700,color:C.red}}>-${totalExpense.toFixed(2)}</div></div>
              </div>
            </div>
          </div>

          {/* Savings goal */}
          <div style={{background:C.card,borderRadius:16,padding:16,marginBottom:16,border:`1px solid #1a2035`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div><div style={{fontWeight:700,fontSize:14}}>🎯 Meta de ahorro</div><div style={{fontSize:12,color:C.muted,marginTop:2}}>Meta: ${savingsGoal}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontWeight:800,color:C.blueBright,fontSize:16}}>${saved.toFixed(0)}</div><div style={{fontSize:12,color:C.silver}}>{Math.round((saved/savingsGoal)*100)}%</div></div>
            </div>
            <div style={{height:6,background:"#1a2035",borderRadius:6,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${Math.min((saved/savingsGoal)*100,100)}%`,background:`linear-gradient(90deg,#0066ff,#00c8ff)`,borderRadius:6,boxShadow:`0 0 6px #0066ff`,transition:"width 0.6s"}}/>
            </div>
          </div>

          {/* Quick actions */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            {[{label:"Nuevo Gasto",icon:"💸",color:C.red,action:()=>{setNewType("gasto");setShowAdd(true);}},{label:"Nuevo Ingreso",icon:"💵",color:C.green,action:()=>{setNewType("ingreso");setShowAdd(true);}}].map(btn=>(
              <button key={btn.label} onClick={btn.action} style={{background:`${btn.color}10`,border:`1px solid ${btn.color}30`,borderRadius:14,padding:"16px 10px",cursor:"pointer",color:btn.color,fontWeight:700,fontSize:13,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                <span style={{fontSize:26}}>{btn.icon}</span>{btn.label}
              </button>
            ))}
          </div>

          {/* Recent */}
          <div style={{background:C.card,borderRadius:16,padding:16,border:`1px solid #1a2035`}}>
            <div style={{fontWeight:800,marginBottom:14,fontSize:15,color:C.silverBright}}>Movimientos recientes</div>
            {transactions.length===0
              ?<div style={{textAlign:"center",padding:"24px 0",color:C.muted,fontSize:14}}><div style={{fontSize:32,marginBottom:8}}>📭</div>Sin movimientos aún.</div>
              :transactions.slice(0,5).map(t=>(
                <div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid #1a2035`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:36,height:36,borderRadius:10,background:t.amount>0?`${C.green}15`:`${C.red}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{t.cat}</div>
                    <div><div style={{fontSize:14,fontWeight:600}}>{t.desc}</div><div style={{fontSize:11,color:C.muted}}>{t.date}</div></div>
                  </div>
                  <div style={{fontWeight:800,color:t.amount>0?C.green:C.red}}>{t.amount>0?"+":""}${Math.abs(t.amount).toFixed(2)}</div>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* GASTOS */}
      {tab==="gastos"&&(
        <div style={{padding:16,zIndex:1,position:"relative"}}>
          <div style={{fontWeight:900,fontSize:22,marginBottom:4,color:C.silverBright}}>Transacciones</div>
          <div style={{fontSize:13,color:C.muted,marginBottom:16}}>+20 pts por cada registro ⚡</div>
          <button onClick={()=>setShowAdd(true)} style={{width:"100%",background:`linear-gradient(135deg,#0066ff,#0099ff)`,border:"none",borderRadius:14,padding:15,color:C.white,fontWeight:800,fontSize:15,cursor:"pointer",marginBottom:16,boxShadow:`0 4px 20px #0066ff40`}}>+ Nuevo Registro</button>
          {transactions.length===0
            ?<div style={{textAlign:"center",padding:"50px 0",color:C.muted}}><div style={{fontSize:40,marginBottom:12}}>💳</div>Sin transacciones aún</div>
            :transactions.map(t=>(
              <div key={t.id} style={{background:C.card,borderRadius:14,padding:"14px 16px",marginBottom:10,border:`1px solid #1a2035`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:40,height:40,borderRadius:12,background:t.amount>0?`${C.green}15`:`${C.red}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{t.cat}</div>
                  <div><div style={{fontWeight:700,fontSize:15}}>{t.desc}</div><div style={{fontSize:12,color:C.muted}}>{t.date} · {t.type}</div></div>
                </div>
                <div style={{fontWeight:900,fontSize:16,color:t.amount>0?C.green:C.red}}>{t.amount>0?"+":""}${Math.abs(t.amount).toFixed(2)}</div>
              </div>
            ))
          }
        </div>
      )}

      {/* RETOS */}
      {tab==="retos"&&(
        <div style={{padding:16,zIndex:1,position:"relative"}}>
          <div style={{fontWeight:900,fontSize:22,marginBottom:4,color:C.silverBright}}>Retos Financieros</div>
          <div style={{fontSize:13,color:C.muted,marginBottom:16}}>Completa con prueba y gana puntos reales</div>
          <div style={{background:C.card,borderRadius:14,padding:"12px 16px",marginBottom:16,border:`1px solid #1a2035`,display:"flex",justifyContent:"space-around"}}>
            <div style={{textAlign:"center"}}><div style={{fontWeight:900,fontSize:22,color:C.blueBright}}>{completedChallenges.length}</div><div style={{fontSize:11,color:C.muted}}>Completados</div></div>
            <div style={{width:1,background:"#1a2035"}}/>
            <div style={{textAlign:"center"}}><div style={{fontWeight:900,fontSize:22,color:C.silver}}>{challenges.length-completedChallenges.length}</div><div style={{fontSize:11,color:C.muted}}>Pendientes</div></div>
            <div style={{width:1,background:"#1a2035"}}/>
            <div style={{textAlign:"center"}}><div style={{fontWeight:900,fontSize:22,color:C.gold}}>{challenges.filter(c=>completedChallenges.includes(c.id)).reduce((a,c)=>a+c.pts,0)}</div><div style={{fontSize:11,color:C.muted}}>Pts ganados</div></div>
          </div>
          {challenges.map(c=>{
            const done=completedChallenges.includes(c.id);const proof=challengeProofs[c.id];
            return(
              <div key={c.id} style={{background:done?`linear-gradient(135deg,#050e08,#081208)`:C.card,borderRadius:16,padding:16,marginBottom:12,border:`1px solid ${done?C.green+"40":"#1a2035"}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div style={{display:"flex",gap:12,alignItems:"flex-start",flex:1}}>
                    <div style={{width:44,height:44,borderRadius:12,background:done?`${C.green}20`:`${C.blueEl}10`,border:`1px solid ${done?C.green+"40":C.blueEl+"20"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{c.icon}</div>
                    <div style={{flex:1}}><div style={{fontWeight:700,fontSize:15,color:done?C.green:C.text}}>{c.title}</div><div style={{display:"flex",alignItems:"center",gap:4,marginTop:4}}><span style={{fontSize:12,color:C.blueEl}}>⚡</span><span style={{color:C.gold,fontWeight:700,fontSize:13}}>+{c.pts} puntos</span></div></div>
                  </div>
                  {done?<div style={{background:`${C.green}20`,color:C.green,borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:800,border:`1px solid ${C.green}40`}}>✓ LISTO</div>
                  :<button onClick={()=>{setShowProof(c);setProofText("");setProofImg(null);}} style={{background:`linear-gradient(135deg,#0066ff,#0099ff)`,border:"none",borderRadius:20,padding:"7px 14px",color:C.white,fontWeight:700,cursor:"pointer",fontSize:12,boxShadow:`0 2px 10px #0066ff40`}}>Completar</button>}
                </div>
                <div style={{background:done?`${C.green}08`:`${C.blueEl}08`,borderRadius:10,padding:"8px 12px",border:`1px solid ${done?C.green+"20":C.blueEl+"15"}`}}>
                  <div style={{fontSize:11,color:done?C.green:C.blueEl,fontWeight:700,marginBottom:3}}>📋 PRUEBA REQUERIDA</div>
                  <div style={{fontSize:12,color:C.silver}}>{c.proof}</div>
                </div>
                {done&&proof&&<div style={{marginTop:10,background:`${C.green}08`,borderRadius:10,padding:"10px 12px",border:`1px solid ${C.green}20`}}>
                  <div style={{fontSize:11,color:C.green,fontWeight:700,marginBottom:4}}>✅ ENVIADA — {proof.date}</div>
                  {proof.text&&<div style={{fontSize:13,color:C.silver}}>{proof.text}</div>}
                  {proof.img&&<img src={proof.img} alt="prueba" style={{marginTop:8,width:"100%",borderRadius:8,maxHeight:120,objectFit:"cover"}}/>}
                </div>}
              </div>
            );
          })}
        </div>
      )}

      {/* JUEGOS */}
      {tab==="juegos"&&(
        <div style={{padding:16,zIndex:1,position:"relative"}}>
          {!activeGame?(
            <>
              <div style={{fontWeight:900,fontSize:22,marginBottom:4,color:C.silverBright}}>Minijuegos 🎮</div>
              <div style={{fontSize:13,color:C.muted,marginBottom:16}}>Aprende finanzas jugando y gana puntos</div>
              <div style={{textAlign:"center",marginBottom:20}}><Robot mood="happy" size={90}/></div>
              {games.map(g=>(
                <button key={g.id} onClick={()=>setActiveGame(g.id)} style={{width:"100%",background:C.card,border:`1px solid #1a2035`,borderRadius:16,padding:16,marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",gap:14,textAlign:"left"}}>
                  <div style={{width:50,height:50,borderRadius:14,background:`${C.blue}15`,border:`1px solid ${C.blue}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{g.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800,fontSize:16,color:C.silverBright}}>{g.label}</div>
                    <div style={{fontSize:13,color:C.muted,marginTop:2}}>{g.desc}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:12,color:C.gold,fontWeight:700}}>⚡{g.pts}</div>
                    <div style={{fontSize:18,color:C.blueEl,marginTop:4}}>›</div>
                  </div>
                </button>
              ))}
            </>
          ):(
            <>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
                <button onClick={()=>setActiveGame(null)} style={{background:C.card2,border:`1px solid #1a2035`,borderRadius:10,padding:"8px 14px",color:C.silver,cursor:"pointer",fontWeight:700,fontSize:14}}>← Volver</button>
                <div style={{fontWeight:800,fontSize:18,color:C.silverBright}}>{games.find(g=>g.id===activeGame)?.label}</div>
              </div>
              {activeGame==="trivia"&&<TriviaGame onEarn={(pts)=>{earnPoints(pts);setTimeout(()=>setActiveGame(null),2000);}}/>}
              {activeGame==="hangman"&&<HangmanGame onEarn={(pts)=>{earnPoints(pts);setTimeout(()=>setActiveGame(null),2000);}}/>}
              {activeGame==="memory"&&<MemoryGame onEarn={(pts)=>{earnPoints(pts);setTimeout(()=>setActiveGame(null),2000);}}/>}
              {activeGame==="spin"&&<SpinWheel onEarn={(pts)=>{earnPoints(pts);}}/>}
              {activeGame==="sort"&&<SortGame onEarn={(pts)=>{earnPoints(pts);setTimeout(()=>setActiveGame(null),2000);}}/>}
            </>
          )}
        </div>
      )}

      {/* PREMIOS */}
      {tab==="premios"&&(
        <div style={{padding:16,zIndex:1,position:"relative"}}>
          <div style={{fontWeight:900,fontSize:22,marginBottom:4,color:C.silverBright}}>Tienda de Premios</div>
          <div style={{fontSize:13,color:C.muted,marginBottom:12}}>Canjea puntos por recompensas reales</div>
          <div style={{background:`linear-gradient(135deg,#080e20,#0a1428)`,borderRadius:16,padding:"16px 20px",marginBottom:20,border:`1px solid #0099ff30`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:12,color:C.silver,letterSpacing:"1px",textTransform:"uppercase"}}>Mis puntos</div><div style={{fontSize:32,fontWeight:900,background:`linear-gradient(90deg,#0099ff,#00c8ff)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{points.toLocaleString()}</div></div>
            <div style={{fontSize:40}}>⚡</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {prizes.map(p=>{
              const unlocked=points>=p.pts;
              return(
                <div key={p.pts} style={{background:unlocked?`linear-gradient(135deg,#050e08,#081410)`:C.card,borderRadius:16,padding:18,border:`1px solid ${unlocked?C.green+"40":"#1a2035"}`,textAlign:"center",opacity:unlocked?1:0.6}}>
                  <div style={{fontSize:38,marginBottom:8}}>{p.icon}</div>
                  <div style={{fontWeight:800,marginBottom:2,fontSize:14,color:unlocked?C.white:C.silver}}>{p.label}</div>
                  <div style={{fontSize:12,color:C.muted,marginBottom:8}}>{p.desc}</div>
                  <div style={{fontSize:12,color:C.gold,marginBottom:10,fontWeight:700}}>⚡ {p.pts.toLocaleString()} pts</div>
                  {unlocked
                    ?<button onClick={()=>{setShowRedeem(p);setRedeemName("");setRedeemPhone("");setRedeemSent(false);}} style={{background:`linear-gradient(135deg,${C.green},#00a060)`,border:"none",borderRadius:20,padding:"7px 18px",color:C.bg,fontWeight:800,cursor:"pointer",fontSize:13}}>Canjear 🎁</button>
                    :<div style={{fontSize:11,color:C.muted,background:"#1a2035",borderRadius:20,padding:"5px 10px",display:"inline-block"}}>Faltan {(p.pts-points).toLocaleString()} pts</div>
                  }
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PROOF MODAL */}
      {showProof&&(
        <div style={{position:"fixed",inset:0,background:"#000000cc",display:"flex",alignItems:"flex-end",zIndex:100}} onClick={()=>setShowProof(null)}>
          <div style={{background:"#0a0d1a",borderRadius:"24px 24px 0 0",padding:24,width:"100%",maxWidth:430,margin:"0 auto",border:`1px solid #0099ff30`,borderBottom:"none"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:40,height:4,background:"#1a2035",borderRadius:4,margin:"0 auto 20px"}}/>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:6}}><span style={{fontSize:24}}>{showProof.icon}</span><div style={{fontWeight:800,fontSize:17,color:C.silverBright}}>{showProof.title}</div></div>
            <div style={{color:C.gold,fontWeight:700,fontSize:13,marginBottom:16}}>⚡ +{showProof.pts} puntos al completar</div>
            <div style={{background:`#0099ff10`,borderRadius:12,padding:"10px 14px",marginBottom:16,border:`1px solid #0099ff20`}}>
              <div style={{fontSize:12,color:C.blueEl,fontWeight:700,marginBottom:4}}>📋 PRUEBA REQUERIDA</div>
              <div style={{fontSize:13,color:C.silver}}>{showProof.proof}</div>
            </div>
            <textarea placeholder="Describe cómo completaste el reto..." value={proofText} onChange={e=>setProofText(e.target.value)} style={{...inp,minHeight:80,resize:"vertical",marginBottom:12}}/>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImgUpload} style={{display:"none"}}/>
            <button onClick={()=>fileRef.current.click()} style={{width:"100%",background:"#111520",border:`1px dashed #0099ff40`,borderRadius:12,padding:12,color:C.silver,cursor:"pointer",fontSize:14,marginBottom:8}}>
              📷 {proofImg?"✅ Foto cargada":"Seleccionar foto"}
            </button>
            {proofImg&&<img src={proofImg} alt="preview" style={{width:"100%",borderRadius:10,marginBottom:12,maxHeight:150,objectFit:"cover"}}/>}
            <button onClick={()=>submitProof(showProof.id,showProof.pts)} disabled={!proofText&&!proofImg} style={{width:"100%",background:proofText||proofImg?`linear-gradient(135deg,#0066ff,#0099ff)`:"#1a2035",border:"none",borderRadius:14,padding:15,color:proofText||proofImg?C.white:C.muted,fontWeight:800,fontSize:16,cursor:proofText||proofImg?"pointer":"not-allowed",boxShadow:proofText||proofImg?`0 4px 20px #0066ff40`:"none"}}>
              Enviar Prueba · Ganar ⚡{showProof.pts} pts
            </button>
          </div>
        </div>
      )}

      {/* REDEEM MODAL */}
      {showRedeem&&(
        <div style={{position:"fixed",inset:0,background:"#000000cc",display:"flex",alignItems:"flex-end",zIndex:100}} onClick={()=>setShowRedeem(null)}>
          <div style={{background:"#0a0d1a",borderRadius:"24px 24px 0 0",padding:24,width:"100%",maxWidth:430,margin:"0 auto",border:`1px solid #00e67630`,borderBottom:"none"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:40,height:4,background:"#1a2035",borderRadius:4,margin:"0 auto 20px"}}/>
            {!redeemSent?(
              <>
                <div style={{textAlign:"center",marginBottom:20}}>
                  <div style={{fontSize:50,marginBottom:8}}>{showRedeem.icon}</div>
                  <div style={{fontWeight:900,fontSize:20,color:C.silverBright}}>{showRedeem.label}</div>
                  <div style={{color:C.gold,fontWeight:700,fontSize:14,marginTop:8}}>⚡ {showRedeem.pts.toLocaleString()} puntos</div>
                </div>
                <input type="text" placeholder="Tu nombre completo" value={redeemName} onChange={e=>setRedeemName(e.target.value)} style={inp}/>
                <input type="tel" placeholder="Tu número WhatsApp" value={redeemPhone} onChange={e=>setRedeemPhone(e.target.value)} style={{...inp,marginBottom:16}}/>
                <button onClick={()=>sendRedeem(showRedeem)} disabled={!redeemName||!redeemPhone} style={{width:"100%",background:redeemName&&redeemPhone?`linear-gradient(135deg,${C.green},#00a060)`:"#1a2035",border:"none",borderRadius:14,padding:15,color:redeemName&&redeemPhone?C.bg:C.muted,fontWeight:800,fontSize:16,cursor:redeemName&&redeemPhone?"pointer":"not-allowed"}}>
                  Confirmar Canje 🎁
                </button>
              </>
            ):(
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:60,marginBottom:16}}>🎉</div>
                <div style={{fontWeight:900,fontSize:22,color:C.green,marginBottom:8}}>¡Canje enviado!</div>
                <div style={{fontSize:14,color:C.silver,lineHeight:1.6,marginBottom:20}}>Te contactaremos por WhatsApp para entregarte tu premio.</div>
                <button onClick={()=>setShowRedeem(null)} style={{background:`linear-gradient(135deg,#0066ff,#0099ff)`,border:"none",borderRadius:14,padding:"12px 30px",color:C.white,fontWeight:800,fontSize:15,cursor:"pointer"}}>Cerrar</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD TRANSACTION MODAL */}
      {showAdd&&(
        <div style={{position:"fixed",inset:0,background:"#000000cc",display:"flex",alignItems:"flex-end",zIndex:100}} onClick={()=>setShowAdd(false)}>
          <div style={{background:"#0a0d1a",borderRadius:"24px 24px 0 0",padding:24,width:"100%",maxWidth:430,margin:"0 auto",border:`1px solid #1a2035`,borderBottom:"none"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:40,height:4,background:"#1a2035",borderRadius:4,margin:"0 auto 20px"}}/>
            <div style={{fontWeight:900,fontSize:20,marginBottom:16,color:C.silverBright}}>Nuevo Registro</div>
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              {["gasto","ingreso","ahorro"].map(t=>(
                <button key={t} onClick={()=>setNewType(t)} style={{flex:1,padding:"10px 0",borderRadius:12,border:`1px solid ${newType===t?C.blueEl:"#1a2035"}`,background:newType===t?`#0066ff30`:"transparent",color:newType===t?C.blueBright:C.muted,fontWeight:700,cursor:"pointer",fontSize:13,textTransform:"capitalize"}}>{t}</button>
              ))}
            </div>
            <input type="text" placeholder="Descripción" value={newDesc} onChange={e=>setNewDesc(e.target.value)} style={inp}/>
            <input type="number" placeholder="Monto ($)" value={newAmount} onChange={e=>setNewAmount(e.target.value)} style={{...inp,marginBottom:16}}/>
            <button onClick={addTransaction} style={{width:"100%",background:`linear-gradient(135deg,#0066ff,#0099ff)`,border:"none",borderRadius:14,padding:15,color:C.white,fontWeight:800,fontSize:16,cursor:"pointer",boxShadow:`0 4px 20px #0066ff40`}}>
              Guardar · +20 pts ⚡
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"#070a12",borderTop:`1px solid #1a2035`,display:"flex",justifyContent:"space-around",padding:"10px 0 14px",zIndex:10}}>
        {navItems.map(n=>(
          <button key={n.id} onClick={()=>{setTab(n.id);setActiveGame(null);}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"4px 8px",position:"relative"}}>
            {tab===n.id&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",width:30,height:2,background:`linear-gradient(90deg,#0066ff,#00c8ff)`,borderRadius:2,boxShadow:`0 0 8px #0066ff`}}/>}
            <span style={{fontSize:16,color:tab===n.id?C.blueBright:C.muted}}>{n.icon}</span>
            <span style={{fontSize:10,color:tab===n.id?C.blueBright:C.muted,fontWeight:tab===n.id?700:400,letterSpacing:"0.3px"}}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
