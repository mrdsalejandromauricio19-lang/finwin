import { useState, useRef, useEffect } from "react";

/* ══════════════════════════════════════════════════════════
   THEME  — Black Obsidian × Bright Platinum
══════════════════════════════════════════════════════════ */
const T={
  bg:"#020509",bg2:"#050810",card:"#080c18",card2:"#0c1020",
  border:"#12192e",borderHi:"#1c2840",
  cyan:"#00e5cc",cyanDim:"#009e8e",
  blue:"#0066ff",blueHi:"#2288ff",
  plat:"#b8ccee",platBright:"#ddeeff",platDim:"#506070",
  green:"#00d97e",red:"#ff2d55",gold:"#ffb300",purple:"#8b5cf6",
  text:"#d8eeff",muted:"#283848",white:"#ffffff",
  gCyan:"rgba(0,229,204,.15)",gBlue:"rgba(0,102,255,.15)",
};

/* ── local storage ─────────────────────────────────────── */
function useLS(k,init){
  const[v,sv]=useState(()=>{try{const s=localStorage.getItem(k);return s?JSON.parse(s):init;}catch{return init;}});
  const set=x=>sv(p=>{const n=typeof x==="function"?x(p):x;try{localStorage.setItem(k,JSON.stringify(n));}catch{}return n;});
  return[v,set];
}

/* ══════════════════════════════════════════════════════════
   STATIC DATA
══════════════════════════════════════════════════════════ */
const challenges=[
  {id:1,title:"No gastar en lujos 3 días",pts:150,icon:"🎯",proof:"Foto de billetera o captura sin gastos de lujo"},
  {id:2,title:"Ahorra $10 esta semana",pts:200,icon:"💰",proof:"Captura de saldo o transferencia a ahorro"},
  {id:3,title:"Registra 5 gastos seguidos",pts:100,icon:"📝",proof:"Captura de tus 5 transacciones en la app"},
  {id:4,title:"Reduce gastos un 10%",pts:300,icon:"📉",proof:"Comparativa semana anterior vs actual"},
  {id:5,title:"Crea un presupuesto mensual",pts:250,icon:"📊",proof:"Foto del presupuesto con ingresos y gastos"},
];

const prizes=[
  {pts:200,label:"Dulces Sorpresa",icon:"🍬",desc:"Paquete de dulces a tu elección"},
  {pts:400,label:"Chocolate Especial",icon:"🍫",desc:"Una barra de chocolate premium"},
  {pts:700,label:"Snack Misterioso",icon:"🎁",desc:"Un snack sorpresa de nuestra parte"},
  {pts:1200,label:"Desayuno Sorpresa",icon:"🥐",desc:"Desayuno especial para ti"},
];

const triviaAll=[
  {q:"¿Qué significa inflación?",o:["Subida general de precios","Bajada de precios","Aumento de salarios","Reducción de impuestos"],a:0,p:50},
  {q:"¿Qué es un activo financiero?",o:["Una deuda bancaria","Algo que genera valor o dinero","Un gasto fijo mensual","Un tipo de impuesto"],a:1,p:50},
  {q:"¿Qué es el interés compuesto?",o:["Interés sobre capital inicial","Interés que se acumula sobre interés","Un tipo de cuenta bancaria","Un impuesto bancario"],a:1,p:75},
  {q:"¿Cuál es la regla del 50/30/20?",o:["50 trabajo, 30 descanso, 20 ejercicio","50 necesidades, 30 deseos, 20 ahorro","50 ahorro, 30 inversión, 20 gastos","50 ingresos, 30 impuestos, 20 resto"],a:1,p:60},
  {q:"¿Qué es diversificar inversiones?",o:["Concentrar en un activo seguro","Repartir riesgo en varios activos","Invertir solo en acciones","Guardar todo en efectivo"],a:1,p:75},
  {q:"¿Para qué sirve un fondo de emergencia?",o:["Para vacaciones anuales","Para cubrir imprevistos sin endeudarse","Para invertir en bolsa","Como seguro de vida"],a:1,p:50},
  {q:"¿Qué significa liquidez?",o:["Facilidad de convertir activo a efectivo","Inversiones a largo plazo","Tipo de préstamo hipotecario","Deuda externa del país"],a:0,p:60},
  {q:"¿Qué es el PIB?",o:["Precio de bienes básicos","Valor de bienes y servicios de un país","Impuesto sobre bienes","Plan de inversión estatal"],a:1,p:60},
  {q:"¿Qué es una tarjeta de débito?",o:["Pide dinero prestado","Usa tu propio dinero del banco","Es igual a una de crédito","Solo sirve para compras online"],a:1,p:40},
  {q:"¿Qué es el ahorro?",o:["Gastar menos de lo que ganas","Guardar parte de tus ingresos","Invertir en bolsa","Pedir un préstamo"],a:1,p:40},
  {q:"¿Qué es un presupuesto personal?",o:["Un tipo de inversión bursátil","Plan que organiza ingresos y gastos","Un préstamo bancario","Un fondo de inversión"],a:1,p:50},
  {q:"¿Qué significa ROI?",o:["Retorno sobre inversión","Registro de intereses","Ratio de operaciones inversas","Resultado operativo inmediato"],a:0,p:80},
];

const hangmanWords=[
  {w:"AHORRO",h:"Guardar dinero para el futuro"},
  {w:"PRESUPUESTO",h:"Plan de ingresos y gastos"},
  {w:"INVERSION",h:"Poner dinero para ganar más"},
  {w:"INFLACION",h:"Subida general de precios"},
  {w:"LIQUIDEZ",h:"Facilidad de convertir a efectivo"},
  {w:"DIVIDENDO",h:"Ganancia repartida entre socios"},
  {w:"INTERES",h:"Costo del dinero prestado"},
  {w:"ACTIVO",h:"Bien que genera valor económico"},
  {w:"PASIVO",h:"Bien que genera gastos"},
  {w:"CAPITAL",h:"Recursos financieros disponibles"},
];

const memCards=[
  {id:"a",e:"💰",l:"Ahorro"},{id:"b",e:"📈",l:"Inversión"},
  {id:"c",e:"💳",l:"Crédito"},{id:"d",e:"🏦",l:"Banco"},
  {id:"e",e:"💸",l:"Gasto"}, {id:"f",e:"🪙",l:"Capital"},
  {id:"g",e:"📊",l:"Presupuesto"},{id:"h",e:"💹",l:"Interés"},
];

const wheelSlices=[
  {label:"20 pts",pts:20,color:"#0066ff"},
  {label:"50 pts",pts:50,color:"#00d97e"},
  {label:"10 pts",pts:10,color:"#506070"},
  {label:"100 pts",pts:100,color:"#ffb300"},
  {label:"30 pts",pts:30,color:"#8b5cf6"},
  {label:"75 pts",pts:75,color:"#00e5cc"},
  {label:"5 pts",pts:5,color:"#283848"},
  {label:"150 pts",pts:150,color:"#ff2d55"},
];

const dailyChallenges=[
  "Revisa tus gastos de ayer","No compres nada innecesario hoy",
  "Transfiere $1 a tu ahorro hoy","Lee sobre finanzas 10 minutos",
  "Cancela una suscripción que no usas","Cocina en casa hoy",
  "Escribe 3 metas financieras","Compara precios antes de comprar",
  "Guarda el cambio de tus compras",
];

/* ══════════════════════════════════════════════════════════
   CONFETTI
══════════════════════════════════════════════════════════ */
function Confetti({active}){
  if(!active) return null;
  return(
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,overflow:"hidden"}}>
      {Array.from({length:60},(_,i)=>(
        <div key={i} style={{
          position:"absolute",top:"-10px",left:`${Math.random()*100}%`,
          width:7,height:7,borderRadius:Math.random()>.5?"50%":"2px",
          background:[T.cyan,T.green,T.gold,T.red,T.platBright,T.purple][i%6],
          animation:`cffall ${.6+Math.random()*1.6}s ease-in forwards`,
          animationDelay:`${Math.random()*.6}s`,
        }}/>
      ))}
      <style>{`@keyframes cffall{to{transform:translateY(110vh) rotate(720deg);opacity:0;}}`}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   NEO — Floating SVG Robot (matches the image style)
══════════════════════════════════════════════════════════ */
function NeoRobot({mood="idle",size=80,floating=false}){
  const eyes={idle:T.cyan,happy:T.green,celebrate:T.gold,thinking:T.plat,sad:T.red,chat:T.cyan};
  const eyeColor=eyes[mood]||T.cyan;
  const bounce=mood==="celebrate"||mood==="happy";
  return(
    <div style={{
      width:size,height:size*1.15,
      animation:bounce?"neoJump .5s ease infinite alternate":floating?"neoFloat 3s ease-in-out infinite":"none",
      filter:`drop-shadow(0 0 ${size*.12}px ${eyeColor}60)`,
      display:"flex",alignItems:"center",justifyContent:"center",
    }}>
      <svg width={size} height={size*1.15} viewBox="0 0 100 115" fill="none">
        {/* Signal waves */}
        <path d="M38 12 Q50 5 62 12" stroke={T.gold} strokeWidth="3" fill="none" strokeLinecap="round"
          opacity={mood==="idle"||mood==="chat"?".85":".2"} style={{transition:"opacity .4s"}}/>
        <path d="M32 17 Q50 7 68 17" stroke={T.gold} strokeWidth="2.5" fill="none" strokeLinecap="round"
          opacity={mood==="idle"||mood==="chat"?".5":".1"} style={{transition:"opacity .4s"}}/>
        {/* Antenna */}
        <line x1="50" y1="22" x2="50" y2="8" stroke="#8899bb" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="50" cy="6" r="6" fill={T.cyan} opacity=".9"/>
        <circle cx="50" cy="6" r="3" fill="#eef8ff"/>
        {/* Head body — white rounded rectangle like in image */}
        <rect x="14" y="22" width="72" height="52" rx="16" fill="#d4ddf5" stroke="#e8f0ff" strokeWidth=".8"/>
        <rect x="14" y="22" width="72" height="52" rx="16" fill="url(#headGrad)"/>
        {/* Screen area */}
        <rect x="20" y="28" width="60" height="40" rx="10" fill="#2a3555"/>
        {/* Eyes — teal rectangles like in image */}
        <rect x="26" y="36" width="18" height="22" rx="5" fill={eyeColor} opacity=".9"/>
        <rect x="56" y="36" width="18" height="22" rx="5" fill={eyeColor} opacity=".9"/>
        {/* Eye shine */}
        <rect x="29" y="39" width="6" height="6" rx="2" fill="white" opacity=".4"/>
        <rect x="59" y="39" width="6" height="6" rx="2" fill="white" opacity=".4"/>
        {/* Sad mouth */}
        {mood==="sad"&&<path d="M38 63 Q50 57 62 63" stroke={T.red} strokeWidth="2.5" fill="none" strokeLinecap="round"/>}
        {/* Happy mouth */}
        {(mood==="happy"||mood==="celebrate")&&<path d="M38 60 Q50 67 62 60" stroke={T.green} strokeWidth="2.5" fill="none" strokeLinecap="round"/>}
        {/* Chest / body */}
        <rect x="22" y="72" width="56" height="28" rx="12" fill="#d4ddf5" stroke="#e8f0ff" strokeWidth=".8"/>
        <rect x="22" y="72" width="56" height="28" rx="12" fill="url(#bodyGrad)"/>
        {/* Chest button */}
        <rect x="38" y="82" width="24" height="10" rx="5" fill={T.cyan} opacity=".8"/>
        {/* Left arm */}
        <path d="M14 75 Q4 80 6 90" stroke="#8899bb" strokeWidth="5" strokeLinecap="round"/>
        <path d="M14 75 Q4 80 6 90" stroke="#6677aa" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 3"/>
        {/* Left claw */}
        <circle cx="6" cy="93" r="7" fill={T.cyan} opacity=".85"/>
        <path d="M2 90 Q-1 86 2 83" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M10 90 Q13 86 10 83" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        {/* Right arm */}
        <path d="M86 75 Q96 80 94 90" stroke="#8899bb" strokeWidth="5" strokeLinecap="round"/>
        <path d="M86 75 Q96 80 94 90" stroke="#6677aa" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 3"/>
        {/* Right claw */}
        <circle cx="94" cy="93" r="7" fill={T.cyan} opacity=".85"/>
        <path d="M90 90 Q87 86 90 83" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M98 90 Q101 86 98 83" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        {/* Gradients */}
        <defs>
          <linearGradient id="headGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="white" stopOpacity=".25"/>
            <stop offset="1" stopColor="#a0b0d0" stopOpacity=".1"/>
          </linearGradient>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="white" stopOpacity=".2"/>
            <stop offset="1" stopColor="#8090b0" stopOpacity=".05"/>
          </linearGradient>
        </defs>
      </svg>
      <style>{`
        @keyframes neoJump{from{transform:translateY(0)}to{transform:translateY(-10px)}}
        @keyframes neoFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   FLOATING NEO (bounces around screen)
══════════════════════════════════════════════════════════ */
function FloatingNeoMascot({mood}){
  const posRef=useRef({x:30,y:100,vx:.6,vy:.4});
  const[pos,setPos]=useState({x:30,y:100});
  const animRef=useRef();
  const[wave,setWave]=useState(false);

  useEffect(()=>{
    const loop=()=>{
      const p=posRef.current;
      const W=Math.max(300,window.innerWidth-90);
      const H=Math.max(400,window.innerHeight-150);
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<=10||p.x>=W){p.vx*=-1;p.x=Math.max(10,Math.min(W,p.x));}
      if(p.y<=60||p.y>=H){p.vy*=-1;p.y=Math.max(60,Math.min(H,p.y));}
      setPos({x:Math.round(p.x),y:Math.round(p.y)});
      animRef.current=requestAnimationFrame(loop);
    };
    animRef.current=requestAnimationFrame(loop);
    const wi=setInterval(()=>{setWave(true);setTimeout(()=>setWave(false),900);},5000);
    return()=>{cancelAnimationFrame(animRef.current);clearInterval(wi);};
  },[]);

  return(
    <div style={{
      position:"fixed",left:pos.x,top:pos.y,zIndex:45,
      pointerEvents:"none",
      filter:`drop-shadow(0 4px 16px rgba(0,229,204,.3))`,
    }}>
      <NeoRobot mood={wave?"celebrate":mood} size={62}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   NEO CHATBOT
══════════════════════════════════════════════════════════ */
function NeoChat({points}){
  const[msgs,setMsgs]=useLS("fw_neomsgs",[{
    role:"assistant",
    text:"¡Hola! 👋 Soy **Neo**, tu asistente financiero personal con IA.\n\nEstoy aquí para enseñarte sobre dinero de forma sencilla, sin juicios y con mucha paciencia. No hay preguntas tontas — cada duda que resuelves te hace más sabio. 💡\n\n¿Sobre qué quieres aprender hoy?"
  }]);
  const[input,setInput]=useState("");
  const[loading,setLoading]=useState(false);
  const[neoMood,setNeoMood]=useState("chat");
  const bottomRef=useRef();
  const suggestions=["¿Cómo empiezo a ahorrar?","¿Qué es el interés compuesto?","¿Cómo salgo de deudas?","¿Cómo hago un presupuesto?","¿Qué es invertir?","¿Cómo funcionan los créditos?"];

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,loading]);

  async function send(text){
    const t=(text||input).trim();
    if(!t||loading) return;
    setInput("");
    const updated=[...msgs,{role:"user",text:t}];
    setMsgs(updated);
    setLoading(true);setNeoMood("thinking");
    try{
      const history=updated.slice(-12).map(m=>({
        role:m.role==="assistant"?"assistant":"user",
        content:m.text
      }));
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:500,
          system:`Eres Neo 🤖, asistente financiero dentro de la app FinWin. Eres paciente, amigable, didáctico y hablas en español latinoamericano cálido.

REGLAS:
- Explica con analogías simples y ejemplos del día a día (café, mercado, transporte)
- Máximo 3 párrafos cortos por respuesta
- Usa **negritas** para términos clave
- Al final pregunta si quedó claro o si quiere saber más
- Celebra el aprendizaje del usuario con entusiasmo moderado
- Si preguntan algo no financiero, redirige amablemente a temas de dinero
- Nunca te frustres, siempre ofrece explicar de otra manera

El usuario tiene ${points} puntos en FinWin. Menciónalo si es relevante para motivarlo.`,
          messages:history,
        })
      });
      if(!res.ok){
        const err=await res.text();
        throw new Error(`HTTP ${res.status}: ${err}`);
      }
      const d=await res.json();
      const reply=d?.content?.[0]?.text||"No pude generar una respuesta. Intenta de nuevo 🙏";
      setMsgs(p=>[...p,{role:"assistant",text:reply}]);
      setNeoMood("happy");setTimeout(()=>setNeoMood("chat"),2000);
    }catch(e){
      console.error("Neo API error:",e);
      setMsgs(p=>[...p,{role:"assistant",text:`❌ Error de conexión: ${e.message}\n\nVerifica que la app esté correctamente desplegada en Vercel con acceso a la API.`}]);
      setNeoMood("sad");setTimeout(()=>setNeoMood("chat"),2000);
    }
    setLoading(false);
  }

  function fmt(text){
    return text.split(/(\*\*[^*]+\*\*)/).map((p,i)=>
      p.startsWith("**")?<strong key={i} style={{color:T.cyan}}>{p.slice(2,-2)}</strong>:<span key={i}>{p}</span>
    );
  }

  return(
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 68px)"}}>
      {/* Header */}
      <div style={{padding:"14px 16px 12px",borderBottom:`1px solid ${T.border}`,background:T.bg2,display:"flex",alignItems:"center",gap:14,flexShrink:0}}>
        <NeoRobot mood={neoMood} size={52}/>
        <div style={{flex:1}}>
          <div style={{fontWeight:900,fontSize:19,color:T.platBright,letterSpacing:"-.3px"}}>Neo</div>
          <div style={{fontSize:12,color:T.green,display:"flex",alignItems:"center",gap:5,marginTop:2}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:T.green,boxShadow:`0 0 6px ${T.green}`}}/>
            Asistente financiero IA · Siempre disponible
          </div>
        </div>
        <button onClick={()=>setMsgs([{role:"assistant",text:"¡Chat reiniciado! 🔄 ¿En qué te ayudo hoy?"}])}
          style={{background:T.card2,border:`1px solid ${T.border}`,borderRadius:10,padding:"6px 12px",color:T.platDim,cursor:"pointer",fontSize:12,fontWeight:600}}>
          Limpiar
        </button>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:12}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",gap:8,justifyContent:m.role==="user"?"flex-end":"flex-start",alignItems:"flex-end"}}>
            {m.role==="assistant"&&(
              <div style={{width:30,height:30,borderRadius:9,background:`${T.cyan}20`,border:`1px solid ${T.cyan}35`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <NeoRobot mood="idle" size={24}/>
              </div>
            )}
            <div style={{
              maxWidth:"78%",
              background:m.role==="user"?`linear-gradient(135deg,${T.blue},${T.blueHi})`:T.card2,
              borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",
              padding:"11px 14px",
              border:m.role==="assistant"?`1px solid ${T.border}`:"none",
              boxShadow:m.role==="user"?`0 4px 16px rgba(0,102,255,.25)`:`0 2px 8px rgba(0,0,0,.4)`,
            }}>
              <div style={{fontSize:14,lineHeight:1.65,color:m.role==="user"?T.white:T.text,whiteSpace:"pre-wrap"}}>{fmt(m.text)}</div>
            </div>
          </div>
        ))}
        {loading&&(
          <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
            <div style={{width:30,height:30,borderRadius:9,background:`${T.cyan}20`,border:`1px solid ${T.cyan}35`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <NeoRobot mood="thinking" size={24}/>
            </div>
            <div style={{background:T.card2,border:`1px solid ${T.border}`,borderRadius:"16px 16px 16px 4px",padding:"12px 18px",display:"flex",gap:5}}>
              {[0,1,2].map(i=>(
                <div key={i} style={{width:7,height:7,borderRadius:"50%",background:T.cyan,animation:"typing 1s ease infinite",animationDelay:`${i*.2}s`}}/>
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Quick suggestions */}
      <div style={{padding:"8px 16px",overflowX:"auto",display:"flex",gap:8,borderTop:`1px solid ${T.border}`,flexShrink:0}}>
        {suggestions.map((s,i)=>(
          <button key={i} onClick={()=>send(s)}
            style={{background:T.card2,border:`1px solid ${T.borderHi}`,borderRadius:20,padding:"7px 13px",color:T.plat,cursor:"pointer",fontSize:12,fontWeight:600,flexShrink:0,whiteSpace:"nowrap"}}>
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{padding:"10px 16px 14px",display:"flex",gap:10,background:T.bg2,borderTop:`1px solid ${T.border}`,flexShrink:0}}>
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
          placeholder="Pregúntale a Neo sobre finanzas..."
          style={{flex:1,background:T.card2,border:`1px solid ${T.borderHi}`,borderRadius:14,padding:"12px 16px",color:T.text,fontSize:14,outline:"none",fontFamily:"'Segoe UI',sans-serif"}}
        />
        <button onClick={()=>send()} disabled={!input.trim()||loading}
          style={{width:46,height:46,borderRadius:14,background:input.trim()&&!loading?`linear-gradient(135deg,${T.blue},${T.blueHi})`:`${T.muted}50`,border:"none",cursor:input.trim()&&!loading?"pointer":"not-allowed",fontSize:18,color:T.white,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:input.trim()&&!loading?`0 4px 16px rgba(0,102,255,.35)`:"none"}}>
          ➤
        </button>
      </div>
      <style>{`@keyframes typing{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-5px);opacity:1}}`}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MINIGAMES
══════════════════════════════════════════════════════════ */

/* 1. TRIVIA ─────────────────────────────────────────────── */
function Trivia({onEarn}){
  const total=8;
  const[qs]=useState(()=>[...triviaAll].sort(()=>Math.random()-.5).slice(0,total));
  const[round,setRound]=useState(0);
  const[sel,setSel]=useState(null);
  const[score,setScore]=useState(0);
  const[done,setDone]=useState(false);
  const[mood,setMood]=useState("thinking");
  const q=qs[round];
  function answer(i){
    if(sel!==null)return;
    setSel(i);const ok=i===q.a;setMood(ok?"celebrate":"sad");
    const ns=ok?score+q.p:score;
    if(round+1>=total){setTimeout(()=>{onEarn(ns);setDone(true);},900);}
    else setTimeout(()=>{setScore(ns);setSel(null);setRound(r=>r+1);setMood("thinking");},900);
  }
  if(done)return(<div style={{textAlign:"center",padding:24}}><NeoRobot mood={score>0?"celebrate":"sad"} size={90}/><div style={{fontSize:30,fontWeight:900,color:T.gold,marginTop:12}}>+{score} pts</div><div style={{color:T.plat,fontSize:14,marginTop:6}}>¡Trivia completada! {score>200?"¡Eres un genio!":"¡Sigue practicando!"}</div></div>);
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:13,color:T.plat}}>Pregunta {round+1}/{total}</span><span style={{color:T.gold,fontWeight:700}}>⚡ {score} pts</span></div>
      <div style={{height:4,background:T.border,borderRadius:4,marginBottom:16,overflow:"hidden"}}><div style={{height:"100%",width:`${(round/total)*100}%`,background:`linear-gradient(90deg,${T.blue},${T.cyan})`,transition:"width .4s"}}/></div>
      <div style={{textAlign:"center",marginBottom:14}}><NeoRobot mood={mood} size={60}/></div>
      <div style={{background:T.card2,borderRadius:14,padding:16,marginBottom:14,border:`1px solid ${T.borderHi}`,fontSize:15,fontWeight:700,textAlign:"center",color:T.platBright,lineHeight:1.5}}>{q.q}</div>
      {q.o.map((o,i)=>{
        let bg=T.card,br=T.border,col=T.text;
        if(sel!==null){if(i===q.a){bg=`${T.green}20`;br=T.green;col=T.green;}else if(i===sel){bg=`${T.red}20`;br=T.red;col=T.red;}}
        return<button key={i} onClick={()=>answer(i)} style={{width:"100%",background:bg,border:`1px solid ${br}`,borderRadius:12,padding:"13px 16px",color:col,fontWeight:600,fontSize:14,cursor:"pointer",marginBottom:8,textAlign:"left",transition:"all .2s"}}>{o}</button>;
      })}
    </div>
  );
}

/* 2. AHORCADO ───────────────────────────────────────────── */
function Hangman({onEarn}){
  const[{w,h}]=useState(()=>hangmanWords[Math.floor(Math.random()*hangmanWords.length)]);
  const[guessed,setGuessed]=useState([]);
  const[wrong,setWrong]=useState(0);
  const[done,setDone]=useState(false);const[won,setWon]=useState(false);
  const maxW=7;const letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const allGuessed=w.split("").every(l=>guessed.includes(l));
  useEffect(()=>{
    if(allGuessed&&!done){setDone(true);setWon(true);onEarn(200);}
    if(wrong>=maxW&&!done){setDone(true);onEarn(0);}
  },[guessed,wrong]);
  function guess(l){if(guessed.includes(l)||done)return;setGuessed(g=>[...g,l]);if(!w.includes(l))setWrong(x=>x+1);}
  return(
    <div>
      <div style={{textAlign:"center",marginBottom:10}}><NeoRobot mood={done?(won?"celebrate":"sad"):(wrong>4?"sad":"thinking")} size={60}/></div>
      <div style={{textAlign:"center",color:T.plat,fontSize:13,marginBottom:12}}>💡 Pista: {h}</div>
      {/* Hangman figure */}
      <div style={{background:T.card2,borderRadius:12,padding:12,marginBottom:12,border:`1px solid ${T.border}`}}>
        <svg width="140" height="90" viewBox="0 0 140 90" style={{display:"block",margin:"0 auto"}}>
          <line x1="10" y1="85" x2="90" y2="85" stroke={T.plat} strokeWidth="3" strokeLinecap="round"/>
          <line x1="30" y1="85" x2="30" y2="5" stroke={T.plat} strokeWidth="3" strokeLinecap="round"/>
          <line x1="30" y1="5" x2="80" y2="5" stroke={T.plat} strokeWidth="3" strokeLinecap="round"/>
          <line x1="80" y1="5" x2="80" y2="18" stroke={T.plat} strokeWidth="3" strokeLinecap="round"/>
          {wrong>0&&<circle cx="80" cy="26" r="8" stroke={T.red} strokeWidth="2.5" fill="none"/>}
          {wrong>1&&<line x1="80" y1="34" x2="80" y2="56" stroke={T.red} strokeWidth="2.5" strokeLinecap="round"/>}
          {wrong>2&&<line x1="80" y1="40" x2="65" y2="52" stroke={T.red} strokeWidth="2.5" strokeLinecap="round"/>}
          {wrong>3&&<line x1="80" y1="40" x2="95" y2="52" stroke={T.red} strokeWidth="2.5" strokeLinecap="round"/>}
          {wrong>4&&<line x1="80" y1="56" x2="67" y2="72" stroke={T.red} strokeWidth="2.5" strokeLinecap="round"/>}
          {wrong>5&&<line x1="80" y1="56" x2="93" y2="72" stroke={T.red} strokeWidth="2.5" strokeLinecap="round"/>}
          {wrong>6&&<path d="M75,23 Q80,19 85,23" stroke={T.red} strokeWidth="2" fill="none"/>}
        </svg>
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:5,marginBottom:14,flexWrap:"wrap"}}>
        {w.split("").map((l,i)=>(
          <div key={i} style={{width:26,height:34,borderBottom:`2px solid ${T.cyan}`,display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:2}}>
            <span style={{fontSize:17,fontWeight:800,color:T.cyan}}>{guessed.includes(l)?l:" "}</span>
          </div>
        ))}
      </div>
      <div style={{textAlign:"center",marginBottom:12,color:wrong>=maxW?T.red:T.plat,fontSize:13}}>Errores: {wrong}/{maxW} {"💀".repeat(wrong)}</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center"}}>
        {letters.map(l=>{const u=guessed.includes(l);const ok=u&&w.includes(l);const bad=u&&!w.includes(l);
          return<button key={l} onClick={()=>guess(l)} disabled={u||done} style={{width:32,height:32,borderRadius:7,border:`1px solid ${ok?T.green:bad?T.red:T.border}`,background:ok?`${T.green}20`:bad?`${T.red}20`:T.card2,color:ok?T.green:bad?T.red:T.text,fontWeight:700,fontSize:12,cursor:u||done?"default":"pointer",opacity:u?.5:1}}>{l}</button>;
        })}
      </div>
      {done&&<div style={{textAlign:"center",marginTop:14,padding:14,background:won?`${T.green}15`:`${T.red}15`,borderRadius:12}}><div style={{fontWeight:800,color:won?T.green:T.red,fontSize:15}}>{won?"🎉 ¡Correcto! +200 pts":"💀 La palabra era: "+w}</div></div>}
    </div>
  );
}

/* 3. MEMORIA ────────────────────────────────────────────── */
function Memory({onEarn}){
  const[board,setBoard]=useState(()=>[...memCards,...memCards].map((c,i)=>({...c,uid:i,flipped:false,matched:false})).sort(()=>Math.random()-.5));
  const[flipped,setFlipped]=useState([]);
  const[matches,setMatches]=useState(0);
  const[moves,setMoves]=useState(0);
  const[done,setDone]=useState(false);
  const[mood,setMood]=useState("idle");
  function flip(uid){
    if(flipped.length>=2||board.find(c=>c.uid===uid)?.flipped)return;
    const nb=board.map(c=>c.uid===uid?{...c,flipped:true}:c);setBoard(nb);
    const nf=[...flipped,uid];setFlipped(nf);
    if(nf.length===2){
      setMoves(m=>m+1);
      const[a,b]=nf.map(id=>nb.find(c=>c.uid===id));
      if(a.id===b.id){
        setMood("happy");const m=matches+1;setMatches(m);
        setBoard(p=>p.map(c=>nf.includes(c.uid)?{...c,matched:true}:c));setFlipped([]);
        if(m===memCards.length){const pts=Math.max(60,250-moves*12);setTimeout(()=>{onEarn(pts);setDone(true);},400);}
      }else{setMood("sad");setTimeout(()=>{setBoard(p=>p.map(c=>nf.includes(c.uid)?{...c,flipped:false}:c));setFlipped([]);setMood("thinking");},900);}
    }
  }
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{color:T.plat,fontSize:13}}>Pares: {matches}/{memCards.length}</span><span style={{color:T.plat,fontSize:13}}>Movimientos: {moves}</span></div>
      <div style={{textAlign:"center",marginBottom:12}}><NeoRobot mood={done?"celebrate":mood} size={56}/></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7}}>
        {board.map(c=>(
          <button key={c.uid} onClick={()=>flip(c.uid)} style={{height:66,borderRadius:11,border:`1px solid ${c.matched?T.green:c.flipped?T.cyan:T.border}`,background:c.flipped||c.matched?`${T.blue}20`:T.card2,cursor:c.flipped||c.matched?"default":"pointer",fontSize:c.flipped||c.matched?22:16,transition:"all .2s",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2}}>
            {c.flipped||c.matched?<><span>{c.e}</span><span style={{fontSize:9,color:T.plat,fontWeight:600}}>{c.l}</span></>:"❓"}
          </button>
        ))}
      </div>
      {done&&<div style={{textAlign:"center",marginTop:12,color:T.gold,fontWeight:800,fontSize:16}}>🎉 ¡Completado en {moves} movimientos!</div>}
    </div>
  );
}

/* 4. ORDENAR GASTOS ─────────────────────────────────────── */
function SortGame({onEarn}){
  const items=[{l:"Café",v:3},{l:"Ropa",v:85},{l:"Arriendo",v:400},{l:"Netflix",v:12},{l:"Comida",v:150},{l:"Transporte",v:45},{l:"Gym",v:30},{l:"Internet",v:25}];
  const[order,setOrder]=useState(()=>[...items].sort(()=>Math.random()-.5));
  const[done,setDone]=useState(false);const[ok,setOk]=useState(false);
  function mv(i,dir){if(done)return;const a=[...order];const j=i+dir;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];setOrder(a);}
  function check(){const s=[...order].sort((a,b)=>a.v-b.v);const c=order.every((o,i)=>o.v===s[i].v);setOk(c);setDone(true);onEarn(c?150:40);}
  const sorted=[...order].sort((a,b)=>a.v-b.v);
  return(
    <div>
      <div style={{textAlign:"center",marginBottom:10}}><NeoRobot mood={done?(ok?"celebrate":"sad"):"thinking"} size={56}/></div>
      <div style={{color:T.plat,fontSize:13,textAlign:"center",marginBottom:12}}>Ordena del menor al mayor gasto ↕️</div>
      {order.map((item,i)=>(
        <div key={item.l} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
          <span style={{width:22,fontSize:13,color:T.platDim,textAlign:"center",fontWeight:700}}>{i+1}</span>
          <div style={{flex:1,background:done?(item.v===sorted[i].v?`${T.green}18`:`${T.red}18`):T.card2,border:`1px solid ${done?(item.v===sorted[i].v?T.green:T.red):T.border}`,borderRadius:11,padding:"11px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontWeight:700,color:T.platBright}}>{item.l}</span>
            {done&&<span style={{color:T.plat,fontSize:12}}>${item.v}</span>}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:3}}>
            <button onClick={()=>mv(i,-1)} disabled={done||i===0} style={{background:T.card2,border:`1px solid ${T.border}`,borderRadius:6,width:28,height:26,cursor:"pointer",color:T.plat,fontSize:12,opacity:i===0?.3:1}}>↑</button>
            <button onClick={()=>mv(i,1)} disabled={done||i===order.length-1} style={{background:T.card2,border:`1px solid ${T.border}`,borderRadius:6,width:28,height:26,cursor:"pointer",color:T.plat,fontSize:12,opacity:i===order.length-1?.3:1}}>↓</button>
          </div>
        </div>
      ))}
      {!done&&<button onClick={check} style={{width:"100%",background:`linear-gradient(135deg,${T.blue},${T.blueHi})`,border:"none",borderRadius:12,padding:13,color:T.white,fontWeight:800,fontSize:15,cursor:"pointer",marginTop:6,boxShadow:`0 4px 14px rgba(0,102,255,.3)`}}>Verificar ✓</button>}
      {done&&<div style={{textAlign:"center",marginTop:12,padding:14,background:ok?`${T.green}15`:`${T.red}15`,borderRadius:12}}><div style={{fontWeight:800,color:ok?T.green:T.red}}>{ok?"¡Perfecto! +150 pts 🎉":"Casi... +40 pts de consolación"}</div></div>}
    </div>
  );
}

/* 5. RULETA (FIXED — points only added once) ───────────────── */
function SpinWheel({onEarn}){
  const[spinning,setSpinning]=useState(false);
  const[result,setResult]=useState(null);
  const[angle,setAngle]=useState(0);
  const today=new Date().toDateString();
  const[lastSpin,setLastSpin]=useLS("fw_lastspin","");
  const used=lastSpin===today;
  const sl=360/wheelSlices.length;
  const earnedRef=useRef(false);

  function spin(){
    if(spinning||used||earnedRef.current)return;
    setSpinning(true);setResult(null);
    const idx=Math.floor(Math.random()*wheelSlices.length);
    const finalAngle=angle+1800+(sl*idx);
    setAngle(finalAngle);
    setTimeout(()=>{
      if(!earnedRef.current){
        earnedRef.current=true;
        setResult(wheelSlices[idx]);
        setLastSpin(today);
        onEarn(wheelSlices[idx].pts);
      }
      setSpinning(false);
    },3200);
  }

  return(
    <div style={{textAlign:"center"}}>
      <div style={{marginBottom:12}}><NeoRobot mood={result?"celebrate":spinning?"happy":"idle"} size={68}/></div>
      {/* Pointer */}
      <div style={{position:"relative",width:240,height:240,margin:"0 auto 16px"}}>
        <div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",fontSize:20,zIndex:10,color:T.gold,filter:`drop-shadow(0 0 6px ${T.gold})`}}>▼</div>
        <svg width={240} height={240} style={{transform:`rotate(${angle}deg)`,transition:spinning?"transform 3.2s cubic-bezier(.17,.67,.1,1)":"none",borderRadius:"50%",boxShadow:`0 0 30px ${T.gCyan}`}}>
          {wheelSlices.map((s,i)=>{
            const startA=i*sl,endA=startA+sl,r=120,cx=120,cy=120;
            const x1=cx+r*Math.sin((startA*Math.PI)/180),y1=cy-r*Math.cos((startA*Math.PI)/180);
            const x2=cx+r*Math.sin((endA*Math.PI)/180),y2=cy-r*Math.cos((endA*Math.PI)/180);
            const mid=(startA+endA)/2;
            const tx=cx+r*.65*Math.sin((mid*Math.PI)/180),ty=cy-r*.65*Math.cos((mid*Math.PI)/180);
            return(
              <g key={i}>
                <path d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`} fill={s.color} opacity=".88" stroke={T.bg} strokeWidth="2"/>
                <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={10} fontWeight="bold">{s.label}</text>
              </g>
            );
          })}
          <circle cx={120} cy={120} r={14} fill={T.bg} stroke={T.cyan} strokeWidth="3"/>
        </svg>
      </div>
      {used
        ?<div style={{color:T.platDim,fontSize:14,padding:12,background:T.card2,borderRadius:12,border:`1px solid ${T.border}`}}>⏰ Ya giraste hoy. Vuelve mañana 🌅</div>
        :<button onClick={spin} disabled={spinning} style={{background:spinning?T.muted:`linear-gradient(135deg,${T.blue},${T.blueHi})`,border:"none",borderRadius:14,padding:"13px 38px",color:T.white,fontWeight:800,fontSize:16,cursor:spinning?"not-allowed":"pointer",boxShadow:spinning?"none":`0 4px 20px rgba(0,102,255,.35)`}}>
          {spinning?"Girando...":"🎰 ¡Girar!"}
        </button>
      }
      {result&&<div style={{marginTop:14,padding:14,background:`${T.gold}18`,borderRadius:12,border:`1px solid ${T.gold}40`}}><div style={{fontWeight:900,color:T.gold,fontSize:22}}>🎉 +{result.pts} puntos</div></div>}
    </div>
  );
}

/* 6. VERDADERO/FALSO ────────────────────────────────────── */
const tfQuestions=[
  {q:"El interés compuesto hace crecer tu dinero exponencialmente.",a:true,p:40,exp:"¡Correcto! El interés sobre interés crea un efecto bola de nieve."},
  {q:"Guardar todo tu dinero bajo el colchón es una buena estrategia.",a:false,p:40,exp:"Falso. La inflación hace que ese dinero valga menos con el tiempo."},
  {q:"Un presupuesto personal sirve para controlar tus gastos.",a:true,p:40,exp:"¡Exacto! Un presupuesto es tu mapa financiero."},
  {q:"Las deudas con tarjeta de crédito suelen tener intereses bajos.",a:false,p:50,exp:"Falso. Las tarjetas tienen de las tasas más altas del mercado."},
  {q:"Diversificar inversiones reduce el riesgo total.",a:true,p:50,exp:"Correcto. No poner todos los huevos en una sola canasta."},
  {q:"El fondo de emergencia debe cubrir al menos 3 meses de gastos.",a:true,p:50,exp:"¡Exacto! Lo ideal es tener de 3 a 6 meses de gastos guardados."},
  {q:"Invertir es solo para personas ricas.",a:false,p:60,exp:"Falso. Hoy puedes empezar a invertir con muy poco dinero."},
  {q:"Pagar primero la deuda con mayor interés es lo más inteligente.",a:true,p:60,exp:"Correcto. Así reduces el total de intereses que pagas."},
  {q:"Tu score de crédito no importa si tienes dinero ahorrado.",a:false,p:60,exp:"Falso. Un buen historial crediticio te abre muchas puertas."},
  {q:"El PIB mide la riqueza total de los ciudadanos de un país.",a:false,p:50,exp:"Falso. El PIB mide la producción total, no la riqueza individual."},
];
function TrueFalse({onEarn}){
  const total=8;
  const[qs]=useState(()=>[...tfQuestions].sort(()=>Math.random()-.5).slice(0,total));
  const[round,setRound]=useState(0);
  const[score,setScore]=useState(0);
  const[done,setDone]=useState(false);
  const[feedback,setFeedback]=useState(null);
  const[mood,setMood]=useState("thinking");
  const q=qs[round];
  function answer(v){
    if(feedback!==null)return;
    const ok=v===q.a;setMood(ok?"celebrate":"sad");
    const ns=ok?score+q.p:score;
    setFeedback({ok,exp:q.exp});
    setTimeout(()=>{
      if(round+1>=total){onEarn(ns);setDone(true);}
      else{setScore(ns);setFeedback(null);setRound(r=>r+1);setMood("thinking");}
    },1200);
  }
  if(done)return(<div style={{textAlign:"center",padding:24}}><NeoRobot mood="celebrate" size={90}/><div style={{fontSize:28,fontWeight:900,color:T.gold,marginTop:12}}>+{score} pts</div><div style={{color:T.plat,marginTop:6}}>¡Verdadero o Falso completado!</div></div>);
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:13,color:T.plat}}>{round+1}/{total}</span><span style={{color:T.gold,fontWeight:700}}>⚡ {score} pts</span></div>
      <div style={{height:4,background:T.border,borderRadius:4,marginBottom:14,overflow:"hidden"}}><div style={{height:"100%",width:`${(round/total)*100}%`,background:`linear-gradient(90deg,${T.blue},${T.cyan})`,transition:"width .4s"}}/></div>
      <div style={{textAlign:"center",marginBottom:12}}><NeoRobot mood={mood} size={60}/></div>
      <div style={{background:T.card2,borderRadius:14,padding:18,marginBottom:16,border:`1px solid ${T.borderHi}`,fontSize:16,fontWeight:700,textAlign:"center",color:T.platBright,lineHeight:1.5}}>{q.q}</div>
      {feedback?
        <div style={{padding:14,background:feedback.ok?`${T.green}18`:`${T.red}18`,borderRadius:12,border:`1px solid ${feedback.ok?T.green:T.red}`,textAlign:"center"}}>
          <div style={{fontWeight:800,color:feedback.ok?T.green:T.red,fontSize:15,marginBottom:6}}>{feedback.ok?"✅ ¡Correcto!":"❌ Incorrecto"}</div>
          <div style={{fontSize:13,color:T.plat}}>{feedback.exp}</div>
        </div>
      :<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <button onClick={()=>answer(true)} style={{background:`${T.green}15`,border:`1px solid ${T.green}40`,borderRadius:14,padding:"18px 0",color:T.green,fontWeight:800,fontSize:18,cursor:"pointer"}}>✅ Verdadero</button>
        <button onClick={()=>answer(false)} style={{background:`${T.red}15`,border:`1px solid ${T.red}40`,borderRadius:14,padding:"18px 0",color:T.red,fontWeight:800,fontSize:18,cursor:"pointer"}}>❌ Falso</button>
      </div>}
    </div>
  );
}

/* 7. CALCULADORA RÁPIDA ─────────────────────────────────── */
const calcChallenges=[
  {q:"Si ganas $800/mes y gastas $650, ¿cuánto ahorras?",a:150,unit:"$",p:60},
  {q:"Un producto cuesta $120 con 25% de descuento. ¿Cuánto pagas?",a:90,unit:"$",p:70},
  {q:"Si ahorras $50/mes, ¿cuánto tendrás en 8 meses?",a:400,unit:"$",p:60},
  {q:"Tienes $1000 de deuda al 2% mensual. ¿Cuánto de interés pagas el primer mes?",a:20,unit:"$",p:80},
  {q:"Si inviertes $200 que crecen 10% anual, ¿cuánto tendrás en 1 año?",a:220,unit:"$",p:70},
  {q:"Gastas $15/día en comida. ¿Cuánto es en 30 días?",a:450,unit:"$",p:50},
  {q:"Tu ingreso mensual es $600. Según 50/30/20, ¿cuánto va al ahorro?",a:120,unit:"$",p:65},
];
function QuickCalc({onEarn}){
  const total=5;
  const[qs]=useState(()=>[...calcChallenges].sort(()=>Math.random()-.5).slice(0,total));
  const[round,setRound]=useState(0);
  const[inp,setInp]=useState("");
  const[feedback,setFeedback]=useState(null);
  const[score,setScore]=useState(0);
  const[done,setDone]=useState(false);
  const[mood,setMood]=useState("thinking");
  const q=qs[round];
  function check(){
    if(!inp.trim())return;
    const userAns=parseFloat(inp);const ok=Math.abs(userAns-q.a)<=1;
    setMood(ok?"celebrate":"sad");
    const ns=ok?score+q.p:score;
    setFeedback({ok,correct:q.a});
    setTimeout(()=>{
      if(round+1>=total){onEarn(ns);setDone(true);}
      else{setScore(ns);setInp("");setFeedback(null);setRound(r=>r+1);setMood("thinking");}
    },1400);
  }
  if(done)return(<div style={{textAlign:"center",padding:24}}><NeoRobot mood="celebrate" size={90}/><div style={{fontSize:28,fontWeight:900,color:T.gold,marginTop:12}}>+{score} pts</div></div>);
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:13,color:T.plat}}>{round+1}/{total}</span><span style={{color:T.gold,fontWeight:700}}>⚡ {score} pts</span></div>
      <div style={{height:4,background:T.border,borderRadius:4,marginBottom:14,overflow:"hidden"}}><div style={{height:"100%",width:`${(round/total)*100}%`,background:`linear-gradient(90deg,${T.blue},${T.cyan})`,transition:"width .4s"}}/></div>
      <div style={{textAlign:"center",marginBottom:12}}><NeoRobot mood={mood} size={60}/></div>
      <div style={{background:T.card2,borderRadius:14,padding:16,marginBottom:14,border:`1px solid ${T.borderHi}`,fontSize:15,fontWeight:700,textAlign:"center",color:T.platBright,lineHeight:1.5}}>{q.q}</div>
      {feedback?
        <div style={{padding:14,background:feedback.ok?`${T.green}18`:`${T.red}18`,borderRadius:12,border:`1px solid ${feedback.ok?T.green:T.red}`,textAlign:"center"}}>
          <div style={{fontWeight:800,color:feedback.ok?T.green:T.red,fontSize:15}}>{feedback.ok?"✅ ¡Exacto!":"❌ La respuesta era: "+q.unit+feedback.correct}</div>
        </div>
      :<div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <span style={{color:T.plat,fontWeight:700,fontSize:16}}>{q.unit}</span>
          <input type="number" value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&check()}
            placeholder="Tu respuesta..."
            style={{flex:1,background:T.card2,border:`1px solid ${T.borderHi}`,borderRadius:12,padding:"13px 16px",color:T.text,fontSize:16,outline:"none",fontFamily:"'Segoe UI',sans-serif"}}
          />
        </div>
        <button onClick={check} disabled={!inp.trim()} style={{width:"100%",background:`linear-gradient(135deg,${T.blue},${T.blueHi})`,border:"none",borderRadius:12,padding:13,color:T.white,fontWeight:800,fontSize:15,cursor:"pointer",marginTop:10,boxShadow:`0 4px 14px rgba(0,102,255,.3)`}}>Confirmar</button>
      </div>}
    </div>
  );
}

/* 8. SOPA DE LETRAS financiera ──────────────────────────── */
const GRID_WORDS=["AHORRO","BANCO","DEUDA","META","INGRESO","GASTO"];
function buildGrid(){
  const SIZE=9;const grid=Array.from({length:SIZE},()=>Array(SIZE).fill(""));
  const placed=[];
  const dirs=[[0,1],[1,0],[1,1]];
  for(const word of GRID_WORDS){
    let tries=0,ok=false;
    while(!ok&&tries<80){
      tries++;
      const[dr,dc]=dirs[Math.floor(Math.random()*dirs.length)];
      const maxR=SIZE-(word.length-1)*Math.max(dr,0);
      const maxC=SIZE-(word.length-1)*Math.max(dc,0);
      if(maxR<=0||maxC<=0)continue;
      const r=Math.floor(Math.random()*maxR);const c=Math.floor(Math.random()*maxC);
      let fits=true;
      for(let i=0;i<word.length;i++){
        const g=grid[r+i*dr][c+i*dc];if(g!==""&&g!==word[i]){fits=false;break;}
      }
      if(fits){
        const cells=[];
        for(let i=0;i<word.length;i++){grid[r+i*dr][c+i*dc]=word[i];cells.push([r+i*dr,c+i*dc]);}
        placed.push({word,cells});ok=true;
      }
    }
  }
  const alpha="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++)if(grid[r][c]==="")grid[r][c]=alpha[Math.floor(Math.random()*alpha.length)];
  return{grid,placed};
}
function WordSearch({onEarn}){
  const[{grid,placed}]=useState(()=>buildGrid());
  const[found,setFound]=useState([]);
  const[sel,setSel]=useState([]);
  const[done,setDone]=useState(false);
  const SIZE=9;
  function toggleCell(r,c){
    const key=`${r},${c}`;
    const ns=sel.includes(key)?sel.filter(x=>x!==key):[...sel,key];
    setSel(ns);
    for(const p of placed){
      if(found.includes(p.word))continue;
      const keys=p.cells.map(([pr,pc])=>`${pr},${pc}`);
      if(keys.every(k=>ns.includes(k))){
        const nf=[...found,p.word];setFound(nf);setSel([]);
        if(nf.length===placed.length){const pts=80+nf.length*20;onEarn(pts);setDone(true);}
      }
    }
  }
  function isSel(r,c){return sel.includes(`${r},${c}`);}
  function isFound(r,c){return placed.some(p=>found.includes(p.word)&&p.cells.some(([pr,pc])=>pr===r&&pc===c));}
  const cellSize=32;
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{color:T.plat,fontSize:13}}>Encontradas: {found.length}/{placed.length}</span><span style={{color:T.gold,fontWeight:700}}>⚡ {80+found.length*20} pts</span></div>
      <div style={{textAlign:"center",marginBottom:10}}><NeoRobot mood={done?"celebrate":"thinking"} size={56}/></div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12,justifyContent:"center"}}>
        {GRID_WORDS.map(w=>(
          <span key={w} style={{padding:"4px 10px",borderRadius:20,fontSize:12,fontWeight:700,background:found.includes(w)?`${T.green}20`:T.card2,color:found.includes(w)?T.green:T.platDim,border:`1px solid ${found.includes(w)?T.green:T.border}`,textDecoration:found.includes(w)?"line-through":"none"}}>
            {w}
          </span>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:`repeat(${SIZE},1fr)`,gap:3,margin:"0 auto",maxWidth:SIZE*cellSize+SIZE*3}}>
        {grid.map((row,r)=>row.map((letter,c)=>(
          <button key={`${r},${c}`} onClick={()=>toggleCell(r,c)}
            style={{width:cellSize,height:cellSize,borderRadius:6,border:`1px solid ${isFound(r,c)?T.green:isSel(r,c)?T.cyan:T.border}`,background:isFound(r,c)?`${T.green}25`:isSel(r,c)?`${T.cyan}25`:T.card2,color:isFound(r,c)?T.green:isSel(r,c)?T.cyan:T.plat,fontWeight:700,fontSize:13,cursor:"pointer",transition:"all .15s"}}>
            {letter}
          </button>
        )))}
      </div>
      {done&&<div style={{textAlign:"center",marginTop:14,color:T.gold,fontWeight:800,fontSize:16}}>🎉 ¡Todas encontradas!</div>}
    </div>
  );
}

/* 9. CONECTAR CONCEPTOS ─────────────────────────────────── */
const matchPairs=[
  {term:"Inflación",def:"Subida general de precios"},
  {term:"Activo",def:"Genera valor o dinero"},
  {term:"Pasivo",def:"Genera gastos o deudas"},
  {term:"Liquidez",def:"Convertible a efectivo fácilmente"},
  {term:"Interés",def:"Costo de pedir dinero prestado"},
  {term:"Dividendo",def:"Ganancia repartida entre socios"},
];
function MatchGame({onEarn}){
  const[pairs]=useState(()=>[...matchPairs].sort(()=>Math.random()-.5).slice(0,5));
  const[selTerm,setSelTerm]=useState(null);
  const[selDef,setSelDef]=useState(null);
  const[matched,setMatched]=useState([]);
  const[done,setDone]=useState(false);
  const[errors,setErrors]=useState(0);
  const defs=useState(()=>[...pairs].map(p=>p.def).sort(()=>Math.random()-.5))[0];
  useEffect(()=>{
    if(selTerm&&selDef){
      const pair=pairs.find(p=>p.term===selTerm);
      if(pair?.def===selDef){
        const nm=[...matched,selTerm];setMatched(nm);setSelTerm(null);setSelDef(null);
        if(nm.length===pairs.length){const pts=Math.max(60,180-errors*15);onEarn(pts);setDone(true);}
      }else{setErrors(e=>e+1);setTimeout(()=>{setSelTerm(null);setSelDef(null);},600);}
    }
  },[selTerm,selDef]);
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{color:T.plat,fontSize:13}}>Pares: {matched.length}/{pairs.length}</span><span style={{color:T.red,fontSize:13}}>Errores: {errors}</span></div>
      <div style={{textAlign:"center",marginBottom:12}}><NeoRobot mood={done?"celebrate":errors>2?"sad":"thinking"} size={56}/></div>
      <div style={{color:T.plat,fontSize:13,textAlign:"center",marginBottom:12}}>Conecta el término con su definición</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <div style={{fontSize:11,color:T.platDim,fontWeight:700,textAlign:"center",marginBottom:2}}>TÉRMINOS</div>
          {pairs.map(p=>(
            <button key={p.term} onClick={()=>!matched.includes(p.term)&&setSelTerm(p.term)}
              style={{padding:"11px 10px",borderRadius:11,border:`1px solid ${matched.includes(p.term)?T.green:selTerm===p.term?T.cyan:T.border}`,background:matched.includes(p.term)?`${T.green}18`:selTerm===p.term?`${T.cyan}18`:T.card2,color:matched.includes(p.term)?T.green:selTerm===p.term?T.cyan:T.platBright,fontWeight:700,fontSize:13,cursor:matched.includes(p.term)?"default":"pointer",textAlign:"center",opacity:matched.includes(p.term)?.6:1}}>
              {p.term}
            </button>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <div style={{fontSize:11,color:T.platDim,fontWeight:700,textAlign:"center",marginBottom:2}}>DEFINICIONES</div>
          {defs.slice(0,5).map((d,i)=>{
            const matchedDef=pairs.find(p=>matched.includes(p.term)&&p.def===d);
            return(
              <button key={i} onClick={()=>!matchedDef&&setSelDef(d)}
                style={{padding:"11px 8px",borderRadius:11,border:`1px solid ${matchedDef?T.green:selDef===d?T.cyan:T.border}`,background:matchedDef?`${T.green}18`:selDef===d?`${T.cyan}18`:T.card2,color:matchedDef?T.green:selDef===d?T.cyan:T.plat,fontWeight:600,fontSize:11,cursor:matchedDef?"default":"pointer",textAlign:"center",lineHeight:1.3,opacity:matchedDef?.6:1}}>
                {d}
              </button>
            );
          })}
        </div>
      </div>
      {done&&<div style={{textAlign:"center",marginTop:14,padding:14,background:`${T.green}15`,borderRadius:12}}><div style={{fontWeight:800,color:T.green,fontSize:15}}>🎉 ¡Completado con {errors} errores!</div></div>}
    </div>
  );
}

/* 10. PRESUPUESTO CHALLENGE ─────────────────────────────── */
const budgetScenarios=[
  {income:800,items:[{l:"Arriendo",v:250,cat:"need"},{l:"Comida",v:200,cat:"need"},{l:"Transporte",v:60,cat:"need"},{l:"Ropa",v:120,cat:"want"},{l:"Netflix",v:15,cat:"want"},{l:"Salidas",v:100,cat:"want"},{l:"Ahorro",v:80,cat:"save"}],tip:"Con $800, lo ideal es ~$400 necesidades, ~$240 deseos, ~$160 ahorro."},
  {income:1200,items:[{l:"Arriendo",v:350,cat:"need"},{l:"Comida",v:250,cat:"need"},{l:"Servicios",v:80,cat:"need"},{l:"Gym",v:40,cat:"want"},{l:"Entretenimiento",v:150,cat:"want"},{l:"Ropa",v:100,cat:"want"},{l:"Ahorro",v:230,cat:"save"}],tip:"Con $1200, apunta a ~$600 necesidades, ~$360 deseos, ~$240 ahorro."},
];
function BudgetChallenge({onEarn}){
  const[scenario]=useState(()=>budgetScenarios[Math.floor(Math.random()*budgetScenarios.length)]);
  const[allocations,setAllocations]=useState(()=>Object.fromEntries(scenario.items.map(i=>[i.l,"need"])));
  const[done,setDone]=useState(false);
  const[score,setScore]=useState(0);
  const cats=[{k:"need",l:"Necesidad 🏠",c:T.blue},{k:"want",l:"Deseo 🎁",c:T.purple},{k:"save",l:"Ahorro 💰",c:T.green}];
  function check(){
    let correct=0;
    scenario.items.forEach(item=>{if(allocations[item.l]===item.cat)correct++;});
    const pts=Math.round((correct/scenario.items.length)*200);
    setScore(pts);setDone(true);onEarn(pts);
  }
  const totals={need:0,want:0,save:0};
  scenario.items.forEach(i=>{totals[allocations[i.l]]+=i.v;});
  return(
    <div>
      <div style={{textAlign:"center",marginBottom:10}}><NeoRobot mood={done?"celebrate":"thinking"} size={56}/></div>
      <div style={{background:`${T.blue}15`,borderRadius:12,padding:"10px 14px",marginBottom:12,border:`1px solid ${T.blue}25`,display:"flex",justifyContent:"space-between"}}>
        <span style={{color:T.platBright,fontWeight:700}}>💵 Ingresos: ${scenario.income}</span>
        <span style={{color:totals.need+totals.want+totals.save>scenario.income?T.red:T.green,fontWeight:700}}>Usado: ${totals.need+totals.want+totals.save}</span>
      </div>
      <div style={{color:T.plat,fontSize:13,marginBottom:10}}>¿Cada gasto es necesidad, deseo o ahorro?</div>
      {scenario.items.map(item=>(
        <div key={item.l} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <div style={{width:90,fontWeight:700,color:T.platBright,fontSize:13}}>{item.l}<div style={{fontSize:11,color:T.platDim}}>${item.v}</div></div>
          <div style={{display:"flex",gap:5,flex:1}}>
            {cats.map(cat=>(
              <button key={cat.k} onClick={()=>!done&&setAllocations(a=>({...a,[item.l]:cat.k}))}
                style={{flex:1,padding:"7px 4px",borderRadius:9,border:`1px solid ${allocations[item.l]===cat.k?cat.c:T.border}`,background:allocations[item.l]===cat.k?`${cat.c}25`:T.card2,color:allocations[item.l]===cat.k?cat.c:T.platDim,fontWeight:700,fontSize:10,cursor:done?"default":"pointer",transition:"all .15s"}}>
                {cat.l}
              </button>
            ))}
          </div>
          {done&&<span style={{fontSize:14}}>{allocations[item.l]===item.cat?"✅":"❌"}</span>}
        </div>
      ))}
      {!done&&<button onClick={check} style={{width:"100%",background:`linear-gradient(135deg,${T.blue},${T.blueHi})`,border:"none",borderRadius:12,padding:13,color:T.white,fontWeight:800,fontSize:15,cursor:"pointer",marginTop:6,boxShadow:`0 4px 14px rgba(0,102,255,.3)`}}>Evaluar mi presupuesto</button>}
      {done&&<div style={{textAlign:"center",marginTop:12,padding:14,background:`${T.green}15`,borderRadius:12,border:`1px solid ${T.green}25`}}>
        <div style={{fontWeight:800,color:T.green,fontSize:16}}>+{score} pts</div>
        <div style={{fontSize:12,color:T.plat,marginTop:6}}>{scenario.tip}</div>
      </div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════ */
export default function FinWinApp(){
  const[tab,setTab]=useLS("fw_tab","dashboard");
  const[points,setPoints]=useLS("fw_points",0);
  const[balance,setBalance]=useLS("fw_balance",0);
  const[transactions,setTransactions]=useLS("fw_transactions",[]);
  const[completedChallenges,setCompletedChallenges]=useLS("fw_challenges",[]);
  const[challengeProofs,setChallengeProofs]=useLS("fw_proofs",{});
  const[saved,setSaved]=useLS("fw_saved",0);
  const[streak,setStreak]=useLS("fw_streak",0);
  const[lastVisit,setLastVisit]=useLS("fw_lastvisit","");
  const[showAdd,setShowAdd]=useState(false);
  const[showProof,setShowProof]=useState(null);
  const[showRedeem,setShowRedeem]=useState(null);
  const[redeemName,setRedeemName]=useState("");
  const[redeemPhone,setRedeemPhone]=useState("");
  const[redeemSent,setRedeemSent]=useState(false);
  const[proofText,setProofText]=useState("");
  const[proofImg,setProofImg]=useState(null);
  const[newDesc,setNewDesc]=useState("");
  const[newAmount,setNewAmount]=useState("");
  const[newType,setNewType]=useState("gasto");
  const[debtA,setDebtA]=useState("");const[debtR,setDebtR]=useState("");const[debtM,setDebtM]=useState("");const[debtRes,setDebtRes]=useState(null);
  const[confetti,setConfetti]=useState(false);
  const[neoMood,setNeoMood]=useState("idle");
  const[activeGame,setActiveGame]=useState(null);
  const fileRef=useRef();
  const today=new Date().toDateString();

  useEffect(()=>{
    if(lastVisit!==today){
      const y=new Date();y.setDate(y.getDate()-1);
      setStreak(lastVisit===y.toDateString()?s=>s+1:1);
      setLastVisit(today);
    }
  },[]);

  const level=Math.floor(points/500);
  const lvlPct=((points%500)/500)*100;
  const totalIn=transactions.filter(t=>t.amount>0).reduce((a,t)=>a+t.amount,0);
  const totalOut=Math.abs(transactions.filter(t=>t.amount<0).reduce((a,t)=>a+t.amount,0));

  function earnPoints(pts){
    if(pts<=0)return;
    setPoints(p=>p+pts);setConfetti(true);setNeoMood("celebrate");
    setTimeout(()=>{setConfetti(false);setNeoMood("idle");},2500);
  }
  function addTx(){
    if(!newDesc||!newAmount)return;
    const fecha=new Date().toLocaleDateString("es",{day:"numeric",month:"short"});
    const amt=newType==="gasto"?-Math.abs(parseFloat(newAmount)):Math.abs(parseFloat(newAmount));
    const cat=newType==="gasto"?"💸":newType==="ahorro"?"🏦":"💰";
    setTransactions(p=>[{id:Date.now(),desc:newDesc,amount:amt,cat,date:fecha,type:newType},...p]);
    setBalance(b=>b+amt);earnPoints(20);
    if(newType==="ahorro")setSaved(s=>s+Math.abs(amt));
    setNewDesc("");setNewAmount("");setShowAdd(false);
  }
  function submitProof(id,pts){
    if(!proofText&&!proofImg)return;
    setChallengeProofs(p=>({...p,[id]:{text:proofText,img:proofImg,date:new Date().toLocaleDateString("es")}}));
    setCompletedChallenges(c=>[...c,id]);earnPoints(pts);
    setProofText("");setProofImg(null);setShowProof(null);
  }
  function calcDebt(){
    const P=parseFloat(debtA),r=parseFloat(debtR)/100/12,n=parseInt(debtM);
    if(!P||!r||!n)return;
    const m=(P*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1),t=m*n;
    setDebtRes({monthly:m.toFixed(2),total:t.toFixed(2),interest:(t-P).toFixed(2)});
  }
  function sendRedeem(p){
    if(!redeemName||!redeemPhone)return;
    const msg=encodeURIComponent(`🎁 *CANJE FINWIN*\n\n👤 ${redeemName}\n📱 ${redeemPhone}\n🏆 ${p.icon} ${p.label}\n⚡ ${p.pts} pts`);
    setPoints(x=>x-p.pts);setRedeemSent(true);
    setTimeout(()=>window.open(`https://wa.me/593981257047?text=${msg}`,"_blank"),500);
  }

  const inp={width:"100%",background:T.card2,border:`1px solid ${T.border}`,borderRadius:12,padding:"13px 16px",color:T.text,fontSize:14,boxSizing:"border-box",outline:"none",fontFamily:"'Segoe UI',sans-serif",marginBottom:12};

  const games=[
    {id:"trivia",icon:"🧠",label:"Trivia Financiera",desc:"8 preguntas, aprende conceptos clave",pts:"hasta 560 pts",comp:Trivia},
    {id:"tf",icon:"✅",label:"Verdadero o Falso",desc:"8 afirmaciones, ¿verdad o mentira?",pts:"hasta 400 pts",comp:TrueFalse},
    {id:"hangman",icon:"🔡",label:"Ahorcado",desc:"Adivina términos financieros",pts:"200 pts",comp:Hangman},
    {id:"memory",icon:"🃏",label:"Memoria",desc:"16 cartas — encuentra los pares",pts:"hasta 250 pts",comp:Memory},
    {id:"sort",icon:"📊",label:"Ordenar Gastos",desc:"8 gastos, del menor al mayor",pts:"150 pts",comp:SortGame},
    {id:"spin",icon:"🎰",label:"Ruleta Diaria",desc:"Una oportunidad por día",pts:"hasta 150 pts",comp:SpinWheel},
    {id:"calc",icon:"🧮",label:"Calculadora Rápida",desc:"5 problemas financieros",pts:"hasta 350 pts",comp:QuickCalc},
    {id:"word",icon:"🔍",label:"Sopa de Letras",desc:"Encuentra 6 términos financieros",pts:"hasta 200 pts",comp:WordSearch},
    {id:"match",icon:"🔗",label:"Conectar Conceptos",desc:"Une término con su definición",pts:"hasta 180 pts",comp:MatchGame},
    {id:"budget",icon:"💼",label:"Presupuesto Challenge",desc:"Clasifica los gastos correctamente",pts:"hasta 200 pts",comp:BudgetChallenge},
  ];

  const navItems=[
    {id:"dashboard",icon:"⊞",label:"Inicio"},
    {id:"gastos",icon:"◈",label:"Gastos"},
    {id:"retos",icon:"◆",label:"Retos"},
    {id:"juegos",icon:"🎮",label:"Juegos"},
    {id:"neo",icon:"🤖",label:"Neo"},
    {id:"premios",icon:"✦",label:"Premios"},
  ];

  /* ─── SHARED SECTION HEADER ─── */
  const SH=({title,sub})=>(
    <div style={{marginBottom:16}}>
      <div style={{fontWeight:900,fontSize:22,color:T.platBright,letterSpacing:"-.4px"}}>{title}</div>
      {sub&&<div style={{fontSize:13,color:T.platDim,marginTop:3}}>{sub}</div>}
    </div>
  );

  return(
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:T.bg,minHeight:"100vh",color:T.text,maxWidth:430,margin:"0 auto",position:"relative",paddingBottom:80,overflowX:"hidden"}}>
      <Confetti active={confetti}/>

      {/* Ambient glow */}
      <div style={{position:"fixed",top:-60,left:"50%",transform:"translateX(-50%)",width:360,height:360,background:`radial-gradient(circle,rgba(0,229,204,.06) 0%,transparent 70%)`,pointerEvents:"none",zIndex:0}}/>

      {/* Floating Neo mascot (hidden on Neo chat tab) */}
      {tab!=="neo"&&<FloatingNeoMascot mood={neoMood}/>}

      {/* ── HEADER ──────────────────────────────────────── */}
      {tab!=="neo"&&(
      <div style={{position:"sticky",top:0,zIndex:30,background:`${T.bg}f2`,backdropFilter:"blur(24px)",padding:"13px 18px 11px",borderBottom:`1px solid ${T.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:10,background:`linear-gradient(135deg,${T.blue},${T.cyan})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,boxShadow:`0 0 16px rgba(0,229,204,.35)`}}>💎</div>
            <div>
              <div style={{fontSize:20,fontWeight:900,letterSpacing:"-.5px",background:`linear-gradient(90deg,${T.cyan},${T.platBright})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1}}>FinWin</div>
              <div style={{fontSize:9,color:T.muted,letterSpacing:"1.5px",textTransform:"uppercase",marginTop:1}}>CONTROLA · AHORRA · GANA</div>
            </div>
          </div>
          <div style={{display:"flex",gap:7,alignItems:"center"}}>
            {/* Streak badge */}
            <div style={{background:`${T.gold}12`,border:`1px solid ${T.gold}30`,borderRadius:10,padding:"5px 9px",textAlign:"center"}}>
              <div style={{fontSize:14}}>🔥</div>
              <div style={{fontSize:9,color:T.gold,fontWeight:700}}>{streak}d</div>
            </div>
            {/* Points */}
            <div style={{background:T.card2,border:`1px solid ${T.borderHi}`,borderRadius:12,padding:"6px 12px",textAlign:"right",boxShadow:`0 2px 12px rgba(0,0,0,.5)`}}>
              <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:11,color:T.cyan}}>⚡</span><span style={{fontSize:18,fontWeight:900,background:`linear-gradient(90deg,${T.cyan},${T.platBright})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{points.toLocaleString()}</span></div>
              <div style={{fontSize:9,color:T.plat,letterSpacing:".3px"}}>Nv.{level} · {Math.round(lvlPct)}%</div>
            </div>
          </div>
        </div>
        {/* XP bar */}
        <div style={{marginTop:9,height:2,background:T.border,borderRadius:2,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${lvlPct}%`,background:`linear-gradient(90deg,${T.blue},${T.cyan})`,borderRadius:2,transition:"width .6s",boxShadow:`0 0 8px ${T.cyan}`}}/>
        </div>
      </div>
      )}

      {/* ── DASHBOARD ───────────────────────────────────── */}
      {tab==="dashboard"&&(
        <div style={{padding:16,position:"relative",zIndex:1}}>
          {/* Greeting */}
          <div style={{background:`linear-gradient(135deg,${T.card2},#0d1530)`,borderRadius:20,padding:18,marginBottom:14,border:`1px solid ${T.borderHi}`,display:"flex",alignItems:"center",gap:14}}>
            <NeoRobot mood={streak>=3?"celebrate":"idle"} size={72} floating={true}/>
            <div style={{flex:1}}>
              <div style={{fontWeight:800,fontSize:17,color:T.platBright}}>¡Hola! 👋</div>
              <div style={{fontSize:13,color:T.plat,marginTop:2}}>Racha: <span style={{color:T.gold,fontWeight:700}}>{streak} día{streak!==1?"s":""} 🔥</span></div>
              <div style={{marginTop:8,background:`${T.cyan}10`,borderRadius:10,padding:"6px 10px",border:`1px solid ${T.cyan}20`}}>
                <div style={{fontSize:10,color:T.cyan,fontWeight:700,letterSpacing:".5px"}}>🎯 RETO DEL DÍA</div>
                <div style={{fontSize:12,color:T.plat,marginTop:2}}>{dailyChallenges[new Date().getDay()%dailyChallenges.length]}</div>
              </div>
            </div>
          </div>

          {/* Balance */}
          <div style={{background:`linear-gradient(135deg,#050e22,#081428)`,borderRadius:20,padding:22,marginBottom:14,border:`1px solid ${T.cyan}20`,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,background:`radial-gradient(circle,${T.cyan}12,transparent 70%)`,borderRadius:"50%"}}/>
            <div style={{fontSize:10,color:T.plat,letterSpacing:"2px",textTransform:"uppercase",marginBottom:5}}>Balance Total</div>
            <div style={{fontSize:38,fontWeight:900,color:T.white,letterSpacing:"-1.5px",lineHeight:1}}>${balance.toLocaleString("es",{minimumFractionDigits:2})}</div>
            <div style={{display:"flex",gap:22,marginTop:14}}>
              {[{l:"Ingresos",v:`+$${totalIn.toFixed(2)}`,c:T.green,ic:"↑"},{l:"Gastos",v:`-$${totalOut.toFixed(2)}`,c:T.red,ic:"↓"}].map(x=>(
                <div key={x.l} style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:26,height:26,borderRadius:8,background:`${x.c}20`,display:"flex",alignItems:"center",justifyContent:"center",color:x.c,fontWeight:800,fontSize:14}}>{x.ic}</div>
                  <div><div style={{fontSize:10,color:T.platDim}}>{x.l}</div><div style={{fontSize:14,fontWeight:700,color:x.c}}>{x.v}</div></div>
                </div>
              ))}
            </div>
          </div>

          {/* Savings goal */}
          <div style={{background:T.card,borderRadius:16,padding:15,marginBottom:14,border:`1px solid ${T.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:9}}>
              <div><div style={{fontWeight:700,fontSize:14}}>🎯 Meta de ahorro</div><div style={{fontSize:11,color:T.platDim,marginTop:1}}>Meta: $500</div></div>
              <div style={{textAlign:"right"}}><div style={{fontWeight:800,color:T.cyan,fontSize:15}}>${saved.toFixed(0)}</div><div style={{fontSize:11,color:T.plat}}>{Math.round((saved/500)*100)}%</div></div>
            </div>
            <div style={{height:5,background:T.border,borderRadius:5,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${Math.min((saved/500)*100,100)}%`,background:`linear-gradient(90deg,${T.blue},${T.cyan})`,borderRadius:5,boxShadow:`0 0 6px ${T.cyan}`,transition:"width .7s"}}/>
            </div>
          </div>

          {/* Quick actions */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
            {[{l:"Gasto",i:"💸",c:T.red,t:"gasto"},{l:"Ingreso",i:"💵",c:T.green,t:"ingreso"},{l:"Ahorro",i:"🏦",c:T.cyan,t:"ahorro"}].map(b=>(
              <button key={b.l} onClick={()=>{setNewType(b.t);setShowAdd(true);}}
                style={{background:`${b.c}10`,border:`1px solid ${b.c}25`,borderRadius:14,padding:"14px 8px",cursor:"pointer",color:b.c,fontWeight:700,fontSize:12,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                <span style={{fontSize:22}}>{b.i}</span>{b.l}
              </button>
            ))}
          </div>

          {/* Recent transactions */}
          <div style={{background:T.card,borderRadius:16,padding:15,border:`1px solid ${T.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontWeight:800,fontSize:14,color:T.platBright}}>Movimientos recientes</div>
              {transactions.length>0&&<button onClick={()=>setTab("gastos")} style={{fontSize:12,color:T.cyan,background:"none",border:"none",cursor:"pointer",fontWeight:700}}>Ver todos →</button>}
            </div>
            {transactions.length===0
              ?<div style={{textAlign:"center",padding:"20px 0",color:T.platDim,fontSize:14}}><div style={{fontSize:30,marginBottom:8}}>📭</div>Sin movimientos aún</div>
              :transactions.slice(0,5).map(t=>(
                <div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:35,height:35,borderRadius:10,background:t.amount>0?`${T.green}15`:`${T.red}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{t.cat}</div>
                    <div><div style={{fontSize:13,fontWeight:600,color:T.platBright}}>{t.desc}</div><div style={{fontSize:11,color:T.platDim}}>{t.date}</div></div>
                  </div>
                  <div style={{fontWeight:800,color:t.amount>0?T.green:T.red,fontSize:14}}>{t.amount>0?"+":""}${Math.abs(t.amount).toFixed(2)}</div>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* ── GASTOS ──────────────────────────────────────── */}
      {tab==="gastos"&&(
        <div style={{padding:16,zIndex:1,position:"relative"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
            <SH title="Transacciones" sub="+20 pts por registro ⚡"/>
            <button onClick={()=>setShowAdd(true)} style={{background:`linear-gradient(135deg,${T.blue},${T.blueHi})`,border:"none",borderRadius:11,padding:"9px 15px",color:T.white,fontWeight:800,fontSize:13,cursor:"pointer",boxShadow:`0 4px 14px rgba(0,102,255,.3)`,flexShrink:0}}>+ Nuevo</button>
          </div>
          {transactions.length===0
            ?<div style={{textAlign:"center",padding:"50px 0",color:T.platDim}}><div style={{fontSize:40,marginBottom:12}}>💳</div><div style={{fontWeight:700}}>Sin transacciones aún</div></div>
            :transactions.map(t=>(
              <div key={t.id} style={{background:T.card,borderRadius:14,padding:"13px 15px",marginBottom:9,border:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:11}}>
                  <div style={{width:40,height:40,borderRadius:12,background:t.amount>0?`${T.green}15`:`${T.red}15`,border:`1px solid ${t.amount>0?T.green:T.red}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19}}>{t.cat}</div>
                  <div><div style={{fontWeight:700,fontSize:14,color:T.platBright}}>{t.desc}</div><div style={{fontSize:11,color:T.platDim}}>{t.date} · <span style={{textTransform:"capitalize"}}>{t.type}</span></div></div>
                </div>
                <div style={{fontWeight:900,fontSize:15,color:t.amount>0?T.green:T.red}}>{t.amount>0?"+":""}${Math.abs(t.amount).toFixed(2)}</div>
              </div>
            ))
          }
          {/* Calculator */}
          <div style={{background:T.card,borderRadius:16,padding:16,border:`1px solid ${T.cyan}18`,marginTop:8}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div style={{width:36,height:36,borderRadius:10,background:`${T.cyan}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19}}>🧮</div>
              <div style={{fontWeight:800,fontSize:15,color:T.platBright}}>Calculadora de Deudas</div>
            </div>
            {[{l:"Monto ($)",v:debtA,s:setDebtA},{l:"Tasa anual (%)",v:debtR,s:setDebtR},{l:"Meses",v:debtM,s:setDebtM}].map(f=>(
              <input key={f.l} type="number" placeholder={f.l} value={f.v} onChange={e=>f.s(e.target.value)} style={inp}/>
            ))}
            <button onClick={calcDebt} style={{width:"100%",background:`linear-gradient(135deg,${T.blue},${T.blueHi})`,border:"none",borderRadius:11,padding:13,color:T.white,fontWeight:800,cursor:"pointer",fontSize:14,boxShadow:`0 4px 14px rgba(0,102,255,.25)`}}>Calcular</button>
            {debtRes&&(
              <div style={{marginTop:11,background:T.bg2,borderRadius:11,padding:13,border:`1px solid ${T.border}`}}>
                {[["Cuota mensual",`$${debtRes.monthly}`,T.cyan],["Total a pagar",`$${debtRes.total}`,T.red],["Total intereses",`$${debtRes.interest}`,T.gold]].map(([k,v,c])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.border}`}}>
                    <span style={{color:T.plat,fontSize:13}}>{k}</span><span style={{fontWeight:800,color:c,fontSize:14}}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── RETOS ───────────────────────────────────────── */}
      {tab==="retos"&&(
        <div style={{padding:16,zIndex:1,position:"relative"}}>
          <SH title="Retos Financieros" sub="Completa con prueba · Gana puntos reales"/>
          {/* Stats */}
          <div style={{background:T.card,borderRadius:14,padding:"11px 16px",marginBottom:14,border:`1px solid ${T.border}`,display:"flex",justifyContent:"space-around"}}>
            {[{v:completedChallenges.length,l:"Completados",c:T.cyan},{v:challenges.length-completedChallenges.length,l:"Pendientes",c:T.plat},{v:challenges.filter(c=>completedChallenges.includes(c.id)).reduce((a,c)=>a+c.pts,0),l:"Pts ganados",c:T.gold}].map((x,i)=>(
              <div key={i} style={{textAlign:"center"}}><div style={{fontWeight:900,fontSize:22,color:x.c}}>{x.v}</div><div style={{fontSize:10,color:T.platDim}}>{x.l}</div></div>
            ))}
          </div>
          {challenges.map(c=>{
            const done=completedChallenges.includes(c.id),proof=challengeProofs[c.id];
            return(
              <div key={c.id} style={{background:done?`linear-gradient(135deg,#030b06,#060f08)`:T.card,borderRadius:16,padding:15,marginBottom:11,border:`1px solid ${done?T.green+"35":T.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div style={{display:"flex",gap:11,flex:1}}>
                    <div style={{width:42,height:42,borderRadius:12,background:done?`${T.green}20`:`${T.cyan}10`,border:`1px solid ${done?T.green+"35":T.cyan+"18"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,flexShrink:0}}>{c.icon}</div>
                    <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14,color:done?T.green:T.platBright}}>{c.title}</div><div style={{color:T.gold,fontWeight:700,fontSize:12,marginTop:3}}>⚡ +{c.pts} pts</div></div>
                  </div>
                  {done?<div style={{background:`${T.green}18`,color:T.green,borderRadius:20,padding:"4px 11px",fontSize:11,fontWeight:800,border:`1px solid ${T.green}30`,flexShrink:0}}>✓ LISTO</div>
                  :<button onClick={()=>{setShowProof(c);setProofText("");setProofImg(null);}} style={{background:`linear-gradient(135deg,${T.blue},${T.blueHi})`,border:"none",borderRadius:20,padding:"6px 13px",color:T.white,fontWeight:700,cursor:"pointer",fontSize:12,boxShadow:`0 2px 10px rgba(0,102,255,.3)`,flexShrink:0}}>Completar</button>}
                </div>
                <div style={{background:done?`${T.green}07`:`${T.cyan}07`,borderRadius:9,padding:"7px 11px",border:`1px solid ${done?T.green+"15":T.cyan+"12"}`}}>
                  <div style={{fontSize:10,color:done?T.green:T.cyan,fontWeight:700,marginBottom:2,letterSpacing:".5px"}}>📋 PRUEBA REQUERIDA</div>
                  <div style={{fontSize:12,color:T.plat}}>{c.proof}</div>
                </div>
                {done&&proof&&<div style={{marginTop:9,background:`${T.green}07`,borderRadius:9,padding:"9px 11px",border:`1px solid ${T.green}15`}}>
                  <div style={{fontSize:10,color:T.green,fontWeight:700,marginBottom:3}}>✅ PRUEBA ENVIADA — {proof.date}</div>
                  {proof.text&&<div style={{fontSize:12,color:T.plat}}>{proof.text}</div>}
                  {proof.img&&<img src={proof.img} alt="prueba" style={{marginTop:7,width:"100%",borderRadius:8,maxHeight:110,objectFit:"cover"}}/>}
                </div>}
              </div>
            );
          })}
        </div>
      )}

      {/* ── JUEGOS ──────────────────────────────────────── */}
      {tab==="juegos"&&(
        <div style={{padding:16,zIndex:1,position:"relative"}}>
          {!activeGame?(
            <>
              <SH title="Minijuegos 🎮" sub="10 juegos · Aprende finanzas y gana puntos"/>
              <div style={{textAlign:"center",marginBottom:16}}><NeoRobot mood="happy" size={86} floating/></div>
              {games.map((g,i)=>(
                <button key={g.id} onClick={()=>setActiveGame(g.id)}
                  style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:15,padding:15,marginBottom:9,cursor:"pointer",display:"flex",alignItems:"center",gap:13,textAlign:"left",transition:"border-color .2s"}}>
                  <div style={{width:48,height:48,borderRadius:13,background:`${T.blue}12`,border:`1px solid ${T.blue}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{g.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800,fontSize:15,color:T.platBright}}>{g.label}</div>
                    <div style={{fontSize:12,color:T.platDim,marginTop:2}}>{g.desc}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:11,color:T.gold,fontWeight:700}}>⚡{g.pts}</div>
                    <div style={{fontSize:18,color:T.cyan,marginTop:3}}>›</div>
                  </div>
                </button>
              ))}
            </>
          ):(
            <>
              <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:18}}>
                <button onClick={()=>setActiveGame(null)} style={{background:T.card2,border:`1px solid ${T.border}`,borderRadius:10,padding:"8px 13px",color:T.plat,cursor:"pointer",fontWeight:700,fontSize:13}}>← Volver</button>
                <div style={{fontWeight:800,fontSize:17,color:T.platBright}}>{games.find(g=>g.id===activeGame)?.label}</div>
              </div>
              {(() => {
                const G=games.find(g=>g.id===activeGame)?.comp;
                return G?<G onEarn={pts=>{earnPoints(pts);if(activeGame!=="spin")setTimeout(()=>setActiveGame(null),2200);}}/>:null;
              })()}
            </>
          )}
        </div>
      )}

      {/* ── NEO CHAT ────────────────────────────────────── */}
      {tab==="neo"&&(
        <div style={{height:"100vh",display:"flex",flexDirection:"column",position:"relative",zIndex:1}}>
          <NeoChat points={points}/>
        </div>
      )}

      {/* ── PREMIOS ─────────────────────────────────────── */}
      {tab==="premios"&&(
        <div style={{padding:16,zIndex:1,position:"relative"}}>
          <SH title="Tienda de Premios" sub="Canjea puntos por recompensas reales"/>
          <div style={{background:`linear-gradient(135deg,#050e22,#081428)`,borderRadius:16,padding:"15px 18px",marginBottom:18,border:`1px solid ${T.cyan}18`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:10,color:T.plat,letterSpacing:"1.5px",textTransform:"uppercase"}}>Mis puntos</div><div style={{fontSize:32,fontWeight:900,background:`linear-gradient(90deg,${T.cyan},${T.platBright})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{points.toLocaleString()}</div></div>
            <div style={{fontSize:36}}>⚡</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
            {prizes.map(p=>{
              const ok=points>=p.pts;
              return(
                <div key={p.pts} style={{background:ok?`linear-gradient(135deg,#030c07,#060f0a)`:T.card,borderRadius:16,padding:17,border:`1px solid ${ok?T.green+"30":T.border}`,textAlign:"center",opacity:ok?1:.5,transition:"all .3s"}}>
                  <div style={{fontSize:34,marginBottom:7}}>{p.icon}</div>
                  <div style={{fontWeight:800,marginBottom:2,fontSize:13,color:ok?T.white:T.plat}}>{p.label}</div>
                  <div style={{fontSize:11,color:T.platDim,marginBottom:8}}>{p.desc}</div>
                  <div style={{fontSize:11,color:T.gold,marginBottom:9,fontWeight:700}}>⚡ {p.pts.toLocaleString()} pts</div>
                  {ok?<button onClick={()=>{setShowRedeem(p);setRedeemName("");setRedeemPhone("");setRedeemSent(false);}}
                    style={{background:`linear-gradient(135deg,${T.green},#00a060)`,border:"none",borderRadius:20,padding:"6px 16px",color:T.bg,fontWeight:800,cursor:"pointer",fontSize:12,boxShadow:`0 2px 10px ${T.green}30`}}>
                    Canjear 🎁
                  </button>
                  :<div style={{fontSize:10,color:T.platDim,background:T.border,borderRadius:20,padding:"4px 9px",display:"inline-block"}}>Faltan {(p.pts-points).toLocaleString()} pts</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── PROOF MODAL ─────────────────────────────────── */}
      {showProof&&(
        <div style={{position:"fixed",inset:0,background:"#000000d8",display:"flex",alignItems:"flex-end",zIndex:100}} onClick={()=>setShowProof(null)}>
          <div style={{background:T.bg2,borderRadius:"22px 22px 0 0",padding:22,width:"100%",maxWidth:430,margin:"0 auto",border:`1px solid ${T.cyan}20`,borderBottom:"none",maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:38,height:4,background:T.border,borderRadius:4,margin:"0 auto 16px"}}/>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:6}}><span style={{fontSize:22}}>{showProof.icon}</span><div style={{fontWeight:800,fontSize:16,color:T.platBright}}>{showProof.title}</div></div>
            <div style={{color:T.gold,fontWeight:700,fontSize:12,marginBottom:13}}>⚡ +{showProof.pts} puntos al completar</div>
            <div style={{background:`${T.cyan}08`,borderRadius:11,padding:"9px 13px",marginBottom:13,border:`1px solid ${T.cyan}15`}}>
              <div style={{fontSize:10,color:T.cyan,fontWeight:700,marginBottom:2,letterSpacing:".5px"}}>📋 PRUEBA REQUERIDA</div>
              <div style={{fontSize:12,color:T.plat}}>{showProof.proof}</div>
            </div>
            <textarea placeholder="Describe cómo completaste el reto..." value={proofText} onChange={e=>setProofText(e.target.value)}
              style={{...inp,minHeight:76,resize:"vertical",marginBottom:9}}/>
            <input ref={fileRef} type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setProofImg(ev.target.result);r.readAsDataURL(f);}} style={{display:"none"}}/>
            <button onClick={()=>fileRef.current.click()} style={{width:"100%",background:T.card2,border:`1px dashed ${T.cyan}30`,borderRadius:11,padding:11,color:T.plat,cursor:"pointer",fontSize:13,marginBottom:7}}>
              📷 {proofImg?"✅ Foto cargada":"Seleccionar foto"}
            </button>
            {proofImg&&<img src={proofImg} alt="preview" style={{width:"100%",borderRadius:9,marginBottom:11,maxHeight:130,objectFit:"cover"}}/>}
            <button onClick={()=>submitProof(showProof.id,showProof.pts)} disabled={!proofText&&!proofImg}
              style={{width:"100%",background:proofText||proofImg?`linear-gradient(135deg,${T.blue},${T.blueHi})`:T.border,border:"none",borderRadius:13,padding:14,color:proofText||proofImg?T.white:T.platDim,fontWeight:800,fontSize:15,cursor:proofText||proofImg?"pointer":"not-allowed",boxShadow:proofText||proofImg?`0 4px 16px rgba(0,102,255,.3)`:"none"}}>
              Enviar Prueba · Ganar ⚡{showProof.pts} pts
            </button>
          </div>
        </div>
      )}

      {/* ── REDEEM MODAL ────────────────────────────────── */}
      {showRedeem&&(
        <div style={{position:"fixed",inset:0,background:"#000000d8",display:"flex",alignItems:"flex-end",zIndex:100}} onClick={()=>setShowRedeem(null)}>
          <div style={{background:T.bg2,borderRadius:"22px 22px 0 0",padding:22,width:"100%",maxWidth:430,margin:"0 auto",border:`1px solid ${T.green}20`,borderBottom:"none"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:38,height:4,background:T.border,borderRadius:4,margin:"0 auto 16px"}}/>
            {!redeemSent?(
              <>
                <div style={{textAlign:"center",marginBottom:16}}>
                  <div style={{fontSize:46,marginBottom:7}}>{showRedeem.icon}</div>
                  <div style={{fontWeight:900,fontSize:19,color:T.platBright}}>{showRedeem.label}</div>
                  <div style={{color:T.platDim,fontSize:12,marginTop:3}}>{showRedeem.desc}</div>
                  <div style={{color:T.gold,fontWeight:700,fontSize:13,marginTop:7}}>⚡ {showRedeem.pts.toLocaleString()} puntos</div>
                </div>
                <input type="text" placeholder="Tu nombre completo" value={redeemName} onChange={e=>setRedeemName(e.target.value)} style={inp}/>
                <input type="tel" placeholder="Tu número de WhatsApp" value={redeemPhone} onChange={e=>setRedeemPhone(e.target.value)} style={{...inp,marginBottom:15}}/>
                <button onClick={()=>sendRedeem(showRedeem)} disabled={!redeemName||!redeemPhone}
                  style={{width:"100%",background:redeemName&&redeemPhone?`linear-gradient(135deg,${T.green},#00a060)`:T.border,border:"none",borderRadius:13,padding:14,color:redeemName&&redeemPhone?T.bg:T.platDim,fontWeight:800,fontSize:15,cursor:redeemName&&redeemPhone?"pointer":"not-allowed"}}>
                  Confirmar Canje 🎁
                </button>
              </>
            ):(
              <div style={{textAlign:"center",padding:"18px 0"}}>
                <div style={{fontSize:52,marginBottom:13}}>🎉</div>
                <div style={{fontWeight:900,fontSize:21,color:T.green,marginBottom:7}}>¡Canje enviado!</div>
                <div style={{fontSize:13,color:T.plat,lineHeight:1.7,marginBottom:18}}>Te contactaremos por WhatsApp para entregarte tu premio. ¡Gracias!</div>
                <button onClick={()=>setShowRedeem(null)} style={{background:`linear-gradient(135deg,${T.blue},${T.blueHi})`,border:"none",borderRadius:13,padding:"11px 28px",color:T.white,fontWeight:800,fontSize:14,cursor:"pointer"}}>Cerrar</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ADD TRANSACTION ─────────────────────────────── */}
      {showAdd&&(
        <div style={{position:"fixed",inset:0,background:"#000000d8",display:"flex",alignItems:"flex-end",zIndex:100}} onClick={()=>setShowAdd(false)}>
          <div style={{background:T.bg2,borderRadius:"22px 22px 0 0",padding:22,width:"100%",maxWidth:430,margin:"0 auto",border:`1px solid ${T.border}`,borderBottom:"none"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:38,height:4,background:T.border,borderRadius:4,margin:"0 auto 16px"}}/>
            <div style={{fontWeight:900,fontSize:19,marginBottom:13,color:T.platBright}}>Nuevo Registro</div>
            <div style={{display:"flex",gap:7,marginBottom:13}}>
              {["gasto","ingreso","ahorro"].map(t=>(
                <button key={t} onClick={()=>setNewType(t)}
                  style={{flex:1,padding:"10px 0",borderRadius:11,border:`1px solid ${newType===t?T.cyan:T.border}`,background:newType===t?`${T.cyan}18`:"transparent",color:newType===t?T.cyan:T.platDim,fontWeight:700,cursor:"pointer",fontSize:13,textTransform:"capitalize"}}>
                  {t}
                </button>
              ))}
            </div>
            <input type="text" placeholder="Descripción" value={newDesc} onChange={e=>setNewDesc(e.target.value)} style={inp}/>
            <input type="number" placeholder="Monto ($)" value={newAmount} onChange={e=>setNewAmount(e.target.value)} style={{...inp,marginBottom:15}}/>
            <button onClick={addTx} style={{width:"100%",background:`linear-gradient(135deg,${T.blue},${T.blueHi})`,border:"none",borderRadius:13,padding:14,color:T.white,fontWeight:800,fontSize:15,cursor:"pointer",boxShadow:`0 4px 16px rgba(0,102,255,.3)`}}>
              Guardar · +20 pts ⚡
            </button>
          </div>
        </div>
      )}

      {/* ── BOTTOM NAV ──────────────────────────────────── */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:`${T.bg}f5`,backdropFilter:"blur(24px)",borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"space-around",padding:"9px 0 14px",zIndex:30}}>
        {navItems.map(n=>(
          <button key={n.id} onClick={()=>{setTab(n.id);setActiveGame(null);}}
            style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"3px 7px",position:"relative",minWidth:0}}>
            {tab===n.id&&<div style={{position:"absolute",top:-9,left:"50%",transform:"translateX(-50%)",width:26,height:2,background:`linear-gradient(90deg,${T.blue},${T.cyan})`,borderRadius:2,boxShadow:`0 0 8px ${T.cyan}`}}/>}
            {n.id==="neo"
              ?<div style={{width:26,height:26,borderRadius:8,background:tab===n.id?`${T.cyan}20`:`${T.muted}20`,border:`1px solid ${tab===n.id?T.cyan+"45":T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,transition:"all .2s"}}>{n.icon}</div>
              :<span style={{fontSize:15,color:tab===n.id?T.cyan:T.platDim,transition:"color .2s"}}>{n.icon}</span>
            }
            <span style={{fontSize:9,color:tab===n.id?T.cyan:T.platDim,fontWeight:tab===n.id?700:400,letterSpacing:".2px"}}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
