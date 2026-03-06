import { useState, useRef, useEffect } from "react";

// ── THEME ─────────────────────────────────────────────────────────────────────
const C = {
  bg:"#03050f",bg2:"#070a18",card:"#0b0e1c",card2:"#0f1225",
  border:"#151c30",borderHi:"#1e2a45",
  blue:"#0057ff",blueEl:"#0084ff",blueBright:"#00b4ff",blueGlow:"#0057ff40",
  silver:"#a8b8cc",silverBright:"#cddaec",silverDim:"#637080",
  green:"#00d97e",red:"#ff2d55",gold:"#ffb800",purple:"#7c3aed",
  text:"#e4eeff",muted:"#3d4f68",white:"#ffffff",
};

// ── DATA ──────────────────────────────────────────────────────────────────────
const challenges=[
  {id:1,title:"No gastar en lujos 3 días",pts:150,icon:"🎯",proof:"Foto de tu billetera o captura sin gastos de lujo"},
  {id:2,title:"Ahorra $50 esta semana",pts:200,icon:"💰",proof:"Captura de saldo o transferencia a ahorro"},
  {id:3,title:"Registra 5 gastos seguidos",pts:100,icon:"📝",proof:"Captura de tus 5 transacciones en la app"},
  {id:4,title:"Reduce gastos un 10%",pts:300,icon:"📉",proof:"Comparativa semana anterior vs esta semana"},
  {id:5,title:"Crea un presupuesto mensual",pts:250,icon:"📊",proof:"Foto de tu presupuesto con ingresos y gastos"},
];
const prizes=[
  {pts:500,label:"Café gratis",icon:"☕",desc:"En cafeterías aliadas"},
  {pts:1000,label:"Mes Premium",icon:"⭐",desc:"FinWin sin límites"},
  {pts:2000,label:"Gift Card $20",icon:"🎁",desc:"Amazon o similar"},
  {pts:5000,label:"Viaje sorpresa",icon:"✈️",desc:"Destino a revelar"},
];
const triviaQ=[
  {q:"¿Qué significa 'inflación'?",opts:["Subida de precios","Bajada de precios","Aumento de salarios","Reducción de impuestos"],ans:0,pts:50},
  {q:"¿Qué es un activo?",opts:["Una deuda","Algo que genera valor","Un gasto fijo","Un impuesto"],ans:1,pts:50},
  {q:"¿Qué es el interés compuesto?",opts:["Interés sobre deuda","Interés sobre interés","Un tipo de cuenta","Un impuesto bancario"],ans:1,pts:75},
  {q:"¿Qué es un presupuesto?",opts:["Un tipo de inversión","Plan de ingresos y gastos","Un préstamo bancario","Un tipo de ahorro"],ans:1,pts:50},
  {q:"¿Qué significa diversificar?",opts:["Poner todo en un lugar","Repartir riesgo en varios activos","Invertir solo en acciones","Guardar en efectivo"],ans:1,pts:75},
  {q:"¿Qué es el PIB?",opts:["Precio de bienes básicos","Producción total de un país","Impuesto bancario","Plan de inversión"],ans:1,pts:60},
  {q:"¿Qué significa liquidez?",opts:["Dinero disponible fácilmente","Inversiones a largo plazo","Tipo de préstamo","Deuda externa"],ans:0,pts:60},
  {q:"¿Qué es un fondo de emergencia?",opts:["Dinero para vacaciones","Ahorro para imprevistos","Inversión en bolsa","Seguro de vida"],ans:1,pts:50},
];
const hangmanWords=[
  {word:"AHORRO",hint:"Guardar dinero para el futuro"},
  {word:"PRESUPUESTO",hint:"Plan de ingresos y gastos"},
  {word:"INVERSION",hint:"Poner dinero para ganar más"},
  {word:"INFLACION",hint:"Subida general de precios"},
  {word:"LIQUIDEZ",hint:"Facilidad de convertir a efectivo"},
  {word:"DIVIDENDO",hint:"Ganancia repartida entre socios"},
  {word:"INTERES",hint:"Costo del dinero prestado"},
  {word:"ACTIVO",hint:"Bien que genera valor"},
];
const memoryCards=[
  {id:"a",emoji:"💰",label:"Ahorro"},{id:"b",emoji:"📈",label:"Inversión"},
  {id:"c",emoji:"💳",label:"Crédito"},{id:"d",emoji:"🏦",label:"Banco"},
  {id:"e",emoji:"💸",label:"Gasto"},{id:"f",emoji:"🪙",label:"Capital"},
];
const dailyChallenges=[
  "Revisa tus gastos de ayer","No compres nada innecesario hoy","Transfiere $5 a tu ahorro",
  "Lee un artículo sobre finanzas","Cancela una suscripción que no usas","Cocina en casa hoy",
  "Anota 3 metas financieras","Compara precios antes de comprar","Ahorra el cambio de hoy",
];

// ── LOCAL STORAGE ─────────────────────────────────────────────────────────────
function useLS(key,init){
  const [v,sv]=useState(()=>{try{const s=localStorage.getItem(key);return s?JSON.parse(s):init;}catch{return init;}});
  const set=(x)=>sv(p=>{const n=typeof x==="function"?x(p):x;try{localStorage.setItem(key,JSON.stringify(n));}catch{}return n;});
  return [v,set];
}

// ── CONFETTI ──────────────────────────────────────────────────────────────────
function Confetti({active}){
  if(!active) return null;
  return(
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,overflow:"hidden"}}>
      {Array.from({length:50},(_,i)=>(
        <div key={i} style={{
          position:"absolute",top:"-10px",left:`${Math.random()*100}%`,
          width:7,height:7,borderRadius:Math.random()>.5?"50%":"2px",
          background:[C.blueEl,C.green,C.gold,C.red,C.silverBright,C.purple][i%6],
          animation:`cffall ${0.8+Math.random()*1.5}s ease-in forwards`,
          animationDelay:`${Math.random()*0.4}s`,
        }}/>
      ))}
      <style>{`@keyframes cffall{to{transform:translateY(100vh) rotate(720deg);opacity:0;}}`}</style>
    </div>
  );
}

// ── ROBOT ─────────────────────────────────────────────────────────────────────
function Robot({mood="idle",size=80,showMsg=true}){
  const moods={
    idle:{eye:"🔵",color:C.blueEl,msg:"¡Hola! Soy Finbot 🤖"},
    happy:{eye:"😄",color:C.green,msg:"¡Excelente trabajo!"},
    celebrate:{eye:"🤩",color:C.gold,msg:"¡INCREÍBLE! 🎉"},
    thinking:{eye:"🤔",color:C.silver,msg:"Procesando..."},
    sad:{eye:"😢",color:C.red,msg:"¡Inténtalo de nuevo!"},
    streak:{eye:"🔥",color:C.gold,msg:"¡Racha activa!"},
    chat:{eye:"💬",color:C.blueEl,msg:"¿En qué te ayudo?"},
  };
  const m=moods[mood]||moods.idle;
  const bounce=mood==="celebrate"||mood==="happy";
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
      <div style={{width:size,height:size,borderRadius:size*.22,background:`linear-gradient(145deg,${C.card2},${C.card})`,border:`2px solid ${m.color}60`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",boxShadow:`0 0 24px ${m.color}30`,animation:bounce?"rbounce .5s ease infinite alternate":"none"}}>
        <div style={{position:"absolute",top:-18,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center"}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:m.color,boxShadow:`0 0 10px ${m.color}`}}/>
          <div style={{width:2,height:12,background:m.color}}/>
        </div>
        <div style={{fontSize:size*.32}}>{m.eye}</div>
        <div style={{width:size*.4,height:4,borderRadius:4,background:m.color,marginTop:5,opacity:.8}}/>
        <div style={{position:"absolute",bottom:10,width:9,height:9,borderRadius:"50%",background:m.color,boxShadow:`0 0 10px ${m.color}`,animation:"pulse 1s ease infinite"}}/>
      </div>
      {showMsg&&<div style={{fontSize:11,color:m.color,fontWeight:700,textAlign:"center",maxWidth:120,lineHeight:1.3}}>{m.msg}</div>}
      <style>{`@keyframes rbounce{from{transform:translateY(0)}to{transform:translateY(-8px)}}@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}`}</style>
    </div>
  );
}

// ── CHATBOT ───────────────────────────────────────────────────────────────────
function FinbotChat({points}){
  const [msgs,setMsgs]=useLS("fw_chatmsgs",[
    {role:"assistant",text:"¡Hola! 👋 Soy **Finbot**, tu asistente financiero personal. Estoy aquí para enseñarte sobre dinero de forma sencilla y sin juicios.\n\n¿Sobre qué quieres aprender hoy?\n\n💡 *Ahorro*  📈 *Inversiones*  💳 *Deudas*  📊 *Presupuesto*"}
  ]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [robotMood,setRobotMood]=useState("chat");
  const bottomRef=useRef();
  const suggestions=["¿Cómo empiezo a ahorrar?","¿Qué es el interés compuesto?","¿Cómo salir de deudas?","¿Cómo hacer un presupuesto?","¿Es bueno invertir en criptomonedas?"];

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,loading]);

  async function send(text){
    const t=text||input.trim();
    if(!t||loading) return;
    setInput("");
    const newMsgs=[...msgs,{role:"user",text:t}];
    setMsgs(newMsgs);
    setLoading(true);setRobotMood("thinking");
    try{
      const history=newMsgs.slice(-10).map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.text}));
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:600,
          system:`Eres Finbot 🤖, un asistente financiero amigable, paciente y didáctico dentro de la app FinWin. Tu misión es enseñar educación financiera de manera simple, clara y sin juicios.

PERSONALIDAD:
- Súper paciente: nunca te frustras, siempre explicas de nuevo con gusto
- Usa analogías simples y ejemplos cotidianos (precios de café, mercado, etc.)
- Celebra los pequeños logros del usuario
- Habla en español latinoamericano, tono cálido y cercano
- Usa emojis moderadamente para hacer las respuestas más amigables
- Si el usuario no entiende algo, ofrece explicarlo de otra manera

FORMATO:
- Respuestas máximo 3-4 párrafos cortos
- Usa **negritas** para términos clave
- Al final siempre pregunta si quedó claro o si quiere profundizar más
- Si detectas que el usuario tiene dudas sobre su situación personal, dale consejos prácticos

El usuario tiene ${points} puntos en FinWin. Menciona esto si es relevante para motivarlo.`,
          messages:history,
        })
      });
      const d=await res.json();
      const reply=d.content?.[0]?.text||"Lo siento, tuve un problema. ¿Puedes repetir tu pregunta? 🙏";
      setMsgs(p=>[...p,{role:"assistant",text:reply}]);
      setRobotMood("happy");setTimeout(()=>setRobotMood("chat"),2000);
    }catch(e){
      setMsgs(p=>[...p,{role:"assistant",text:"¡Ups! Parece que tengo un problema de conexión 😅 ¿Intentamos de nuevo?"}]);
      setRobotMood("sad");setTimeout(()=>setRobotMood("chat"),2000);
    }
    setLoading(false);
  }

  function formatText(text){
    const parts=text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p,i)=>p.startsWith("**")
      ?<strong key={i} style={{color:C.blueBright}}>{p.slice(2,-2)}</strong>
      :<span key={i}>{p}</span>
    );
  }

  return(
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 140px)"}}>
      {/* Header */}
      <div style={{padding:"16px 16px 12px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:14,background:C.bg2}}>
        <Robot mood={robotMood} size={56} showMsg={false}/>
        <div>
          <div style={{fontWeight:900,fontSize:18,color:C.silverBright}}>Finbot</div>
          <div style={{fontSize:12,color:C.green,display:"flex",alignItems:"center",gap:4}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:C.green,boxShadow:`0 0 6px ${C.green}`}}/>
            En línea · Siempre disponible
          </div>
        </div>
        <button onClick={()=>setMsgs([{role:"assistant",text:"¡Chat reiniciado! 🔄 ¿En qué te ayudo hoy?"}])} style={{marginLeft:"auto",background:C.card2,border:`1px solid ${C.border}`,borderRadius:10,padding:"6px 12px",color:C.silverDim,cursor:"pointer",fontSize:12}}>Limpiar</button>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:12}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",gap:10,justifyContent:m.role==="user"?"flex-end":"flex-start",alignItems:"flex-end"}}>
            {m.role==="assistant"&&<div style={{width:28,height:28,borderRadius:8,background:`${C.blueEl}20`,border:`1px solid ${C.blueEl}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>🤖</div>}
            <div style={{maxWidth:"80%",background:m.role==="user"?`linear-gradient(135deg,${C.blue},${C.blueEl})`:C.card2,borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",padding:"10px 14px",border:m.role==="assistant"?`1px solid ${C.border}`:"none",boxShadow:m.role==="user"?`0 4px 16px ${C.blueGlow}`:"none"}}>
              <div style={{fontSize:14,lineHeight:1.6,color:m.role==="user"?C.white:C.text,whiteSpace:"pre-wrap"}}>{formatText(m.text)}</div>
            </div>
          </div>
        ))}
        {loading&&(
          <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
            <div style={{width:28,height:28,borderRadius:8,background:`${C.blueEl}20`,border:`1px solid ${C.blueEl}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🤖</div>
            <div style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:"16px 16px 16px 4px",padding:"12px 16px",display:"flex",gap:5,alignItems:"center"}}>
              {[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:C.blueEl,animation:`typing 1s ease infinite`,animationDelay:`${i*.2}s`}}/>)}
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Suggestions */}
      <div style={{padding:"8px 16px",overflowX:"auto",display:"flex",gap:8,whiteSpace:"nowrap",borderTop:`1px solid ${C.border}`}}>
        {suggestions.map((s,i)=>(
          <button key={i} onClick={()=>send(s)} style={{background:C.card2,border:`1px solid ${C.borderHi}`,borderRadius:20,padding:"7px 14px",color:C.silver,cursor:"pointer",fontSize:12,fontWeight:600,flexShrink:0,whiteSpace:"nowrap"}}>{s}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{padding:"12px 16px 16px",display:"flex",gap:10,background:C.bg2,borderTop:`1px solid ${C.border}`}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Pregúntame sobre finanzas..." style={{flex:1,background:C.card2,border:`1px solid ${C.borderHi}`,borderRadius:14,padding:"12px 16px",color:C.text,fontSize:14,outline:"none",fontFamily:"'Segoe UI',sans-serif"}}/>
        <button onClick={()=>send()} disabled={!input.trim()||loading} style={{width:46,height:46,borderRadius:14,background:input.trim()&&!loading?`linear-gradient(135deg,${C.blue},${C.blueEl})`:`${C.muted}30`,border:"none",cursor:input.trim()&&!loading?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:input.trim()&&!loading?`0 4px 16px ${C.blueGlow}`:"none"}}>➤</button>
      </div>
      <style>{`@keyframes typing{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-5px);opacity:1}}`}</style>
    </div>
  );
}

// ── TRIVIA ────────────────────────────────────────────────────────────────────
function TriviaGame({onEarn}){
  const [qi,setQi]=useState(()=>Math.floor(Math.random()*triviaQ.length));
  const [sel,setSel]=useState(null);
  const [score,setScore]=useState(0);
  const [round,setRound]=useState(0);
  const [done,setDone]=useState(false);
  const [mood,setMood]=useState("thinking");
  const q=triviaQ[qi];const maxR=5;
  function answer(i){
    if(sel!==null) return;
    setSel(i);const ok=i===q.ans;setMood(ok?"celebrate":"sad");
    if(ok){const s=score+q.pts;setScore(s);if(round+1>=maxR){setTimeout(()=>{onEarn(s);setDone(true);},900);}}
    else if(round+1>=maxR){setTimeout(()=>{onEarn(score);setDone(true);},900);}
    setTimeout(()=>{if(round+1<maxR){setQi(Math.floor(Math.random()*triviaQ.length));setSel(null);setRound(r=>r+1);setMood("thinking");}},900);
  }
  if(done) return(<div style={{textAlign:"center",padding:24}}><Robot mood={score>0?"celebrate":"sad"} size={100}/><div style={{fontSize:28,fontWeight:900,color:C.gold,marginTop:16}}>+{score} pts</div><div style={{color:C.silver,fontSize:14,marginTop:8}}>Trivia completada 🎉</div></div>);
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><span style={{fontSize:13,color:C.silver}}>Pregunta {round+1}/{maxR}</span><span style={{color:C.gold,fontWeight:700}}>⚡ {score} pts</span></div>
      <div style={{height:4,background:C.border,borderRadius:4,marginBottom:20,overflow:"hidden"}}><div style={{height:"100%",width:`${(round/maxR)*100}%`,background:`linear-gradient(90deg,${C.blue},${C.blueBright})`,borderRadius:4,transition:"width .4s"}}/></div>
      <div style={{textAlign:"center",marginBottom:16}}><Robot mood={mood} size={65}/></div>
      <div style={{background:C.card2,borderRadius:14,padding:16,marginBottom:16,border:`1px solid ${C.border}`,fontSize:15,fontWeight:700,textAlign:"center",color:C.silverBright,lineHeight:1.5}}>{q.q}</div>
      {q.opts.map((o,i)=>{
        let bg=C.card,br=C.border,col=C.text;
        if(sel!==null){if(i===q.ans){bg=`${C.green}20`;br=C.green;col=C.green;}else if(i===sel){bg=`${C.red}20`;br=C.red;col=C.red;}}
        return<button key={i} onClick={()=>answer(i)} style={{width:"100%",background:bg,border:`1px solid ${br}`,borderRadius:12,padding:"12px 16px",color:col,fontWeight:600,fontSize:14,cursor:"pointer",marginBottom:8,textAlign:"left",transition:"all .2s"}}>{o}</button>;
      })}
    </div>
  );
}

// ── HANGMAN ───────────────────────────────────────────────────────────────────
function HangmanGame({onEarn}){
  const [{word,hint}]=useState(()=>hangmanWords[Math.floor(Math.random()*hangmanWords.length)]);
  const [guessed,setGuessed]=useState([]);
  const [wrong,setWrong]=useState(0);
  const [done,setDone]=useState(false);
  const [won,setWon]=useState(false);
  const maxW=6;const letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const allGuessed=word.split("").every(l=>guessed.includes(l));
  useEffect(()=>{
    if(allGuessed&&!done){setDone(true);setWon(true);onEarn(150);}
    if(wrong>=maxW&&!done){setDone(true);onEarn(0);}
  },[guessed,wrong]);
  function guess(l){if(guessed.includes(l)||done)return;setGuessed(g=>[...g,l]);if(!word.includes(l))setWrong(x=>x+1);}
  return(
    <div>
      <div style={{textAlign:"center",marginBottom:12}}><Robot mood={done?(won?"celebrate":"sad"):(wrong>3?"sad":"thinking")} size={65}/></div>
      <div style={{textAlign:"center",marginBottom:8,color:C.silver,fontSize:13}}>💡 {hint}</div>
      <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {word.split("").map((l,i)=>(
          <div key={i} style={{width:28,height:36,borderBottom:`2px solid ${C.blueEl}`,display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:3}}>
            <span style={{fontSize:18,fontWeight:800,color:C.blueBright}}>{guessed.includes(l)?l:" "}</span>
          </div>
        ))}
      </div>
      <div style={{textAlign:"center",marginBottom:12}}><span style={{fontSize:13,color:wrong>=maxW?C.red:C.silver}}>Errores: {wrong}/{maxW} {"💀".repeat(wrong)}</span></div>
      <div style={{display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center"}}>
        {letters.map(l=>{const used=guessed.includes(l);const ok=used&&word.includes(l);const bad=used&&!word.includes(l);
          return<button key={l} onClick={()=>guess(l)} disabled={used||done} style={{width:34,height:34,borderRadius:8,border:`1px solid ${ok?C.green:bad?C.red:C.border}`,background:ok?`${C.green}20`:bad?`${C.red}20`:C.card2,color:ok?C.green:bad?C.red:C.text,fontWeight:700,fontSize:13,cursor:used||done?"default":"pointer",opacity:used?.5:1}}>{l}</button>;
        })}
      </div>
      {done&&<div style={{textAlign:"center",marginTop:16,padding:14,background:won?`${C.green}15`:`${C.red}15`,borderRadius:12,border:`1px solid ${won?C.green:C.red}`}}><div style={{fontWeight:800,color:won?C.green:C.red}}>{won?"🎉 ¡Correcto! +150 pts":"💀 Era: "+word}</div></div>}
    </div>
  );
}

// ── MEMORY ────────────────────────────────────────────────────────────────────
function MemoryGame({onEarn}){
  const [board,setBoard]=useState(()=>[...memoryCards,...memoryCards].map((c,i)=>({...c,uid:i,flipped:false,matched:false})).sort(()=>Math.random()-.5));
  const [flipped,setFlipped]=useState([]);
  const [matches,setMatches]=useState(0);
  const [moves,setMoves]=useState(0);
  const [done,setDone]=useState(false);
  const [mood,setMood]=useState("idle");
  function flip(uid){
    if(flipped.length>=2||board.find(c=>c.uid===uid)?.flipped) return;
    const nb=board.map(c=>c.uid===uid?{...c,flipped:true}:c);setBoard(nb);
    const nf=[...flipped,uid];setFlipped(nf);
    if(nf.length===2){
      setMoves(m=>m+1);
      const [a,b]=nf.map(id=>nb.find(c=>c.uid===id));
      if(a.id===b.id){setMood("happy");const m=matches+1;setMatches(m);setBoard(p=>p.map(c=>nf.includes(c.uid)?{...c,matched:true}:c));setFlipped([]);if(m===memoryCards.length){const pts=Math.max(50,200-moves*10);setTimeout(()=>{onEarn(pts);setDone(true);},500);}}
      else{setMood("sad");setTimeout(()=>{setBoard(p=>p.map(c=>nf.includes(c.uid)?{...c,flipped:false}:c));setFlipped([]);setMood("thinking");},900);}
    }
  }
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><span style={{color:C.silver,fontSize:13}}>Pares: {matches}/{memoryCards.length}</span><span style={{color:C.silver,fontSize:13}}>Movimientos: {moves}</span></div>
      <div style={{textAlign:"center",marginBottom:14}}><Robot mood={done?"celebrate":mood} size={60}/></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
        {board.map(c=>(
          <button key={c.uid} onClick={()=>flip(c.uid)} style={{height:68,borderRadius:12,border:`1px solid ${c.matched?C.green:c.flipped?C.blueEl:C.border}`,background:c.flipped||c.matched?`${C.blue}20`:C.card2,cursor:c.flipped||c.matched?"default":"pointer",fontSize:c.flipped||c.matched?24:18,transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {c.flipped||c.matched?c.emoji:"❓"}
          </button>
        ))}
      </div>
      {done&&<div style={{textAlign:"center",marginTop:14,color:C.gold,fontWeight:800,fontSize:16}}>🎉 ¡Completado!</div>}
    </div>
  );
}

// ── SORT GAME ─────────────────────────────────────────────────────────────────
function SortGame({onEarn}){
  const items=[{label:"Café",v:3},{label:"Ropa",v:85},{label:"Arriendo",v:400},{label:"Netflix",v:12},{label:"Comida",v:150},{label:"Transporte",v:45}];
  const [order,setOrder]=useState(()=>[...items].sort(()=>Math.random()-.5));
  const [done,setDone]=useState(false);const [ok,setOk]=useState(false);
  function moveUp(i){if(i===0)return;const a=[...order];[a[i-1],a[i]]=[a[i],a[i-1]];setOrder(a);}
  function moveDown(i){if(i===order.length-1)return;const a=[...order];[a[i],a[i+1]]=[a[i+1],a[i]];setOrder(a);}
  function check(){const s=[...order].sort((a,b)=>a.v-b.v);const c=order.every((o,i)=>o.v===s[i].v);setOk(c);setDone(true);onEarn(c?120:30);}
  const sorted=[...order].sort((a,b)=>a.v-b.v);
  return(
    <div>
      <div style={{textAlign:"center",marginBottom:12}}><Robot mood={done?(ok?"celebrate":"sad"):"thinking"} size={60}/></div>
      <div style={{color:C.silver,fontSize:13,textAlign:"center",marginBottom:14}}>Ordena del menor al mayor gasto 👆👇</div>
      {order.map((item,i)=>(
        <div key={item.label} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <div style={{flex:1,background:done?(item.v===sorted[i].v?`${C.green}20`:`${C.red}20`):C.card2,border:`1px solid ${done?(item.v===sorted[i].v?C.green:C.red):C.border}`,borderRadius:12,padding:"11px 14px",display:"flex",justifyContent:"space-between"}}>
            <span style={{fontWeight:700}}>{item.label}</span>
            {done&&<span style={{color:C.silver,fontSize:12}}>${item.v}</span>}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            <button onClick={()=>moveUp(i)} disabled={done} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:6,width:28,height:28,cursor:"pointer",color:C.silver,fontSize:13}}>↑</button>
            <button onClick={()=>moveDown(i)} disabled={done} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:6,width:28,height:28,cursor:"pointer",color:C.silver,fontSize:13}}>↓</button>
          </div>
        </div>
      ))}
      {!done&&<button onClick={check} style={{width:"100%",background:`linear-gradient(135deg,${C.blue},${C.blueEl})`,border:"none",borderRadius:12,padding:14,color:C.white,fontWeight:800,fontSize:15,cursor:"pointer",marginTop:6,boxShadow:`0 4px 16px ${C.blueGlow}`}}>Verificar ✓</button>}
      {done&&<div style={{textAlign:"center",marginTop:12,padding:14,background:ok?`${C.green}15`:`${C.red}15`,borderRadius:12}}><div style={{fontWeight:800,color:ok?C.green:C.red}}>{ok?"¡Perfecto! +120 pts":"Casi... +30 pts de consolación"}</div></div>}
    </div>
  );
}

// ── SPIN WHEEL ────────────────────────────────────────────────────────────────
function SpinWheel({onEarn}){
  const [spinning,setSpinning]=useState(false);
  const [result,setResult]=useState(null);
  const [deg,setDeg]=useState(0);
  const today=new Date().toDateString();
  const [lastSpin,setLastSpin]=useLS("fw_lastspin","");
  const used=lastSpin===today;
  const sp=[{label:"50 pts",pts:50,color:C.blue},{label:"100 pts",pts:100,color:C.green},{label:"25 pts",pts:25,color:C.silver},{label:"200 pts",pts:200,color:C.gold},{label:"75 pts",pts:75,color:C.purple},{label:"150 pts",pts:150,color:C.blueEl},{label:"10 pts",pts:10,color:C.muted},{label:"300 pts",pts:300,color:C.red}];
  function spin(){
    if(spinning||used) return;setSpinning(true);
    const idx=Math.floor(Math.random()*sp.length);
    setDeg(d=>d+3600+idx*(360/sp.length));
    setTimeout(()=>{setResult(sp[idx]);setSpinning(false);setLastSpin(today);onEarn(sp[idx].pts);},3000);
  }
  const sl=360/sp.length;
  return(
    <div style={{textAlign:"center"}}>
      <div style={{textAlign:"center",marginBottom:12}}><Robot mood={result?"celebrate":spinning?"happy":"idle"} size={70}/></div>
      <div style={{position:"relative",width:240,height:240,margin:"0 auto 20px"}}>
        <div style={{position:"absolute",top:-14,left:"50%",transform:"translateX(-50%)",fontSize:22,zIndex:10,color:C.gold,filter:`drop-shadow(0 0 6px ${C.gold})`}}>▼</div>
        <svg width={240} height={240} style={{transform:`rotate(${deg}deg)`,transition:spinning?"transform 3s cubic-bezier(.17,.67,.12,.99)":"none",borderRadius:"50%",boxShadow:`0 0 30px ${C.blueGlow}`}}>
          {sp.map((p,i)=>{
            const s=i*sl,e=s+sl,r=120,cx=120,cy=120;
            const x1=cx+r*Math.sin((s*Math.PI)/180),y1=cy-r*Math.cos((s*Math.PI)/180);
            const x2=cx+r*Math.sin((e*Math.PI)/180),y2=cy-r*Math.cos((e*Math.PI)/180);
            const mid=(s+e)/2,tx=cx+r*.65*Math.sin((mid*Math.PI)/180),ty=cy-r*.65*Math.cos((mid*Math.PI)/180);
            return(<g key={i}><path d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`} fill={p.color} opacity={.85} stroke="#03050f" strokeWidth={2}/><text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={10} fontWeight="bold">{p.label}</text></g>);
          })}
          <circle cx={120} cy={120} r={16} fill="#03050f" stroke={C.blueEl} strokeWidth={3}/>
        </svg>
      </div>
      {used?<div style={{color:C.muted,fontSize:14,padding:12,background:C.card2,borderRadius:12,border:`1px solid ${C.border}`}}>⏰ Ya giraste hoy. Vuelve mañana.</div>
      :<button onClick={spin} disabled={spinning} style={{background:`linear-gradient(135deg,${C.blue},${C.blueEl})`,border:"none",borderRadius:14,padding:"14px 40px",color:C.white,fontWeight:800,fontSize:16,cursor:spinning?"not-allowed":"pointer",boxShadow:`0 4px 20px ${C.blueGlow}`}}>{spinning?"Girando...":"🎰 ¡Girar!"}</button>}
      {result&&<div style={{marginTop:16,padding:14,background:`${C.gold}20`,borderRadius:12,border:`1px solid ${C.gold}40`}}><div style={{fontWeight:900,color:C.gold,fontSize:20}}>🎉 +{result.pts} puntos</div></div>}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function FinWinApp(){
  const [tab,setTab]=useLS("fw_tab","dashboard");
  const [points,setPoints]=useLS("fw_points",0);
  const [balance,setBalance]=useLS("fw_balance",0);
  const [transactions,setTransactions]=useLS("fw_transactions",[]);
  const [completedChallenges,setCompletedChallenges]=useLS("fw_challenges",[]);
  const [challengeProofs,setChallengeProofs]=useLS("fw_proofs",{});
  const [saved,setSaved]=useLS("fw_saved",0);
  const [streak,setStreak]=useLS("fw_streak",0);
  const [lastVisit,setLastVisit]=useLS("fw_lastvisit","");
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
  const [debtAmount,setDebtAmount]=useState("");
  const [debtRate,setDebtRate]=useState("");
  const [debtMonths,setDebtMonths]=useState("");
  const [calcResult,setCalcResult]=useState(null);
  const [confetti,setConfetti]=useState(false);
  const [robotMood,setRobotMood]=useState("idle");
  const [activeGame,setActiveGame]=useState(null);
  const [showTips,setShowTips]=useState(false);
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
  const levelPct=((points%500)/500)*100;
  const totalIn=transactions.filter(t=>t.amount>0).reduce((a,t)=>a+t.amount,0);
  const totalOut=Math.abs(transactions.filter(t=>t.amount<0).reduce((a,t)=>a+t.amount,0));

  function earnPoints(pts){
    if(pts<=0) return;
    setPoints(p=>p+pts);
    setConfetti(true);setRobotMood("celebrate");
    setTimeout(()=>{setConfetti(false);setRobotMood("idle");},2500);
  }
  function addTransaction(){
    if(!newDesc||!newAmount) return;
    const fecha=new Date().toLocaleDateString("es",{day:"numeric",month:"short"});
    const amt=newType==="gasto"?-Math.abs(parseFloat(newAmount)):Math.abs(parseFloat(newAmount));
    const cat=newType==="gasto"?"💸":newType==="ahorro"?"🏦":"💰";
    setTransactions(p=>[{id:Date.now(),desc:newDesc,amount:amt,cat,date:fecha,type:newType},...p]);
    setBalance(b=>b+amt);earnPoints(20);
    if(newType==="ahorro") setSaved(s=>s+Math.abs(amt));
    setNewDesc("");setNewAmount("");setShowAdd(false);
  }
  function submitProof(id,pts){
    if(!proofText&&!proofImg) return;
    setChallengeProofs(p=>({...p,[id]:{text:proofText,img:proofImg,date:new Date().toLocaleDateString("es")}}));
    setCompletedChallenges(c=>[...c,id]);earnPoints(pts);
    setProofText("");setProofImg(null);setShowProof(null);
  }
  function handleImg(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setProofImg(ev.target.result);r.readAsDataURL(f);}
  function calcDebt(){
    const P=parseFloat(debtAmount),r=parseFloat(debtRate)/100/12,n=parseInt(debtMonths);
    if(!P||!r||!n)return;
    const m=(P*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1),t=m*n;
    setCalcResult({monthly:m.toFixed(2),total:t.toFixed(2),interest:(t-P).toFixed(2)});
  }
  function sendRedeem(p){
    if(!redeemName||!redeemPhone)return;
    const msg=encodeURIComponent(`🎁 *CANJE FINWIN*\n\n👤 ${redeemName}\n📱 ${redeemPhone}\n🏆 ${p.icon} ${p.label}\n⚡ ${p.pts} pts`);
    setPoints(x=>x-p.pts);setRedeemSent(true);
    setTimeout(()=>window.open(`https://wa.me/593981257047?text=${msg}`,"_blank"),500);
  }

  const inp={width:"100%",background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px 16px",color:C.text,fontSize:14,boxSizing:"border-box",outline:"none",fontFamily:"'Segoe UI',sans-serif",marginBottom:12};
  const navItems=[
    {id:"dashboard",icon:"⊞",label:"Inicio"},
    {id:"gastos",icon:"◈",label:"Gastos"},
    {id:"retos",icon:"◆",label:"Retos"},
    {id:"juegos",icon:"◉",label:"Juegos"},
    {id:"finbot",icon:"🤖",label:"Finbot"},
    {id:"premios",icon:"✦",label:"Premios"},
  ];
  const games=[
    {id:"trivia",icon:"🧠",label:"Trivia Financiera",desc:"5 preguntas aleatorias",pts:"hasta 375 pts",comp:TriviaGame},
    {id:"hangman",icon:"🔡",label:"Ahorcado",desc:"Adivina términos financieros",pts:"150 pts",comp:HangmanGame},
    {id:"memory",icon:"🃏",label:"Memoria",desc:"Encuentra los pares",pts:"hasta 200 pts",comp:MemoryGame},
    {id:"spin",icon:"🎰",label:"Ruleta Diaria",desc:"Una vez al día",pts:"hasta 300 pts",comp:SpinWheel},
    {id:"sort",icon:"📊",label:"Ordenar Gastos",desc:"Del menor al mayor",pts:"120 pts",comp:SortGame},
  ];

  return(
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:C.bg,minHeight:"100vh",color:C.text,maxWidth:430,margin:"0 auto",position:"relative",paddingBottom:80,overflowX:"hidden"}}>
      <Confetti active={confetti}/>
      <div style={{position:"fixed",top:-80,left:"50%",transform:"translateX(-50%)",width:340,height:340,background:`radial-gradient(circle,${C.blue}10 0%,transparent 70%)`,pointerEvents:"none",zIndex:0}}/>

      {/* ── HEADER ── */}
      {tab!=="finbot"&&(
      <div style={{position:"sticky",top:0,zIndex:20,background:`${C.bg}f0`,backdropFilter:"blur(20px)",padding:"14px 18px 12px",borderBottom:`1px solid ${C.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:10,background:`linear-gradient(135deg,${C.blue},${C.blueBright})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,boxShadow:`0 0 14px ${C.blueGlow}`}}>💎</div>
            <div>
              <div style={{fontSize:20,fontWeight:900,letterSpacing:"-0.5px",background:`linear-gradient(90deg,${C.blueBright},${C.silverBright})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1}}>FinWin</div>
              <div style={{fontSize:10,color:C.muted,letterSpacing:"1.5px",textTransform:"uppercase"}}>Controla · Ahorra · Gana</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{background:`${C.gold}12`,border:`1px solid ${C.gold}30`,borderRadius:10,padding:"5px 10px",textAlign:"center"}}>
              <div style={{fontSize:15}}>🔥</div>
              <div style={{fontSize:10,color:C.gold,fontWeight:700}}>{streak}d</div>
            </div>
            <div style={{background:C.card2,border:`1px solid ${C.borderHi}`,borderRadius:12,padding:"7px 12px",textAlign:"right"}}>
              <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:12,color:C.blueEl}}>⚡</span><span style={{fontSize:18,fontWeight:900,background:`linear-gradient(90deg,${C.blueEl},${C.blueBright})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{points.toLocaleString()}</span></div>
              <div style={{fontSize:10,color:C.silver}}>Nv.{level} · {Math.round(levelPct)}%</div>
            </div>
          </div>
        </div>
        <div style={{marginTop:10,height:2,background:C.border,borderRadius:2,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${levelPct}%`,background:`linear-gradient(90deg,${C.blue},${C.blueBright})`,borderRadius:2,transition:"width .6s",boxShadow:`0 0 8px ${C.blue}`}}/>
        </div>
      </div>
      )}

      {/* ── DASHBOARD ── */}
      {tab==="dashboard"&&(
        <div style={{padding:16,zIndex:1,position:"relative"}}>
          {/* Greeting card */}
          <div style={{background:`linear-gradient(135deg,${C.card2},#0d1330)`,borderRadius:20,padding:18,marginBottom:14,border:`1px solid ${C.borderHi}`,display:"flex",alignItems:"center",gap:14}}>
            <Robot mood={streak>=3?"streak":"idle"} size={68}/>
            <div style={{flex:1}}>
              <div style={{fontWeight:800,fontSize:16,color:C.silverBright}}>¡Hola, campeón! 👋</div>
              <div style={{fontSize:13,color:C.silver,marginTop:3}}>Racha: <span style={{color:C.gold,fontWeight:700}}>{streak} día{streak!==1?"s":""} 🔥</span></div>
              <div style={{marginTop:8,background:`${C.blue}15`,borderRadius:10,padding:"6px 10px",border:`1px solid ${C.blue}25`}}>
                <div style={{fontSize:11,color:C.blueEl,fontWeight:700}}>🎯 Reto del día</div>
                <div style={{fontSize:12,color:C.silver,marginTop:2}}>{dailyChallenges[new Date().getDay()%dailyChallenges.length]}</div>
              </div>
            </div>
          </div>

          {/* Balance */}
          <div style={{background:`linear-gradient(135deg,#060d22,#091428)`,borderRadius:20,padding:22,marginBottom:14,border:`1px solid ${C.blueEl}25`,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-30,right:-30,width:140,height:140,background:`radial-gradient(circle,${C.blue}15,transparent 70%)`,borderRadius:"50%"}}/>
            <div style={{fontSize:11,color:C.silver,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:5}}>Balance Total</div>
            <div style={{fontSize:36,fontWeight:900,color:C.white,letterSpacing:"-1px"}}>${balance.toLocaleString("es",{minimumFractionDigits:2})}</div>
            <div style={{display:"flex",gap:20,marginTop:14}}>
              {[{label:"Ingresos",val:`+$${totalIn.toFixed(2)}`,color:C.green,icon:"↑"},{label:"Gastos",val:`-$${totalOut.toFixed(2)}`,color:C.red,icon:"↓"}].map(x=>(
                <div key={x.label} style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:26,height:26,borderRadius:8,background:`${x.color}20`,display:"flex",alignItems:"center",justifyContent:"center",color:x.color,fontWeight:800}}>{x.icon}</div>
                  <div><div style={{fontSize:11,color:C.muted}}>{x.label}</div><div style={{fontSize:14,fontWeight:700,color:x.color}}>{x.val}</div></div>
                </div>
              ))}
            </div>
          </div>

          {/* Savings */}
          <div style={{background:C.card,borderRadius:16,padding:16,marginBottom:14,border:`1px solid ${C.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div><div style={{fontWeight:700,fontSize:14}}>🎯 Meta de ahorro</div><div style={{fontSize:12,color:C.muted,marginTop:2}}>Meta: $500</div></div>
              <div style={{textAlign:"right"}}><div style={{fontWeight:800,color:C.blueBright,fontSize:16}}>${saved.toFixed(0)}</div><div style={{fontSize:12,color:C.silver}}>{Math.round((saved/500)*100)}%</div></div>
            </div>
            <div style={{height:5,background:C.border,borderRadius:5,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${Math.min((saved/500)*100,100)}%`,background:`linear-gradient(90deg,${C.blue},${C.blueBright})`,borderRadius:5,boxShadow:`0 0 6px ${C.blue}`,transition:"width .6s"}}/>
            </div>
          </div>

          {/* Quick actions */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
            {[{l:"Gasto",i:"💸",c:C.red,a:()=>{setNewType("gasto");setShowAdd(true);}},{l:"Ingreso",i:"💵",c:C.green,a:()=>{setNewType("ingreso");setShowAdd(true);}},{l:"Ahorro",i:"🏦",c:C.blueEl,a:()=>{setNewType("ahorro");setShowAdd(true);}}].map(b=>(
              <button key={b.l} onClick={b.a} style={{background:`${b.c}10`,border:`1px solid ${b.c}25`,borderRadius:14,padding:"14px 8px",cursor:"pointer",color:b.c,fontWeight:700,fontSize:12,display:"flex",flexDirection:"column",alignItems:"center",gap:7}}>
                <span style={{fontSize:22}}>{b.i}</span>{b.l}
              </button>
            ))}
          </div>

          {/* Transactions */}
          <div style={{background:C.card,borderRadius:16,padding:16,border:`1px solid ${C.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontWeight:800,fontSize:15,color:C.silverBright}}>Movimientos recientes</div>
              {transactions.length>0&&<button onClick={()=>setTab("gastos")} style={{fontSize:12,color:C.blueEl,background:"none",border:"none",cursor:"pointer",fontWeight:700}}>Ver todos →</button>}
            </div>
            {transactions.length===0
              ?<div style={{textAlign:"center",padding:"20px 0",color:C.muted,fontSize:14}}><div style={{fontSize:30,marginBottom:8}}>📭</div>Sin movimientos aún</div>
              :transactions.slice(0,5).map(t=>(
                <div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:36,height:36,borderRadius:10,background:t.amount>0?`${C.green}15`:`${C.red}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>{t.cat}</div>
                    <div><div style={{fontSize:14,fontWeight:600}}>{t.desc}</div><div style={{fontSize:11,color:C.muted}}>{t.date}</div></div>
                  </div>
                  <div style={{fontWeight:800,color:t.amount>0?C.green:C.red}}>{t.amount>0?"+":""}${Math.abs(t.amount).toFixed(2)}</div>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* ── GASTOS ── */}
      {tab==="gastos"&&(
        <div style={{padding:16,zIndex:1,position:"relative"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
            <div><div style={{fontWeight:900,fontSize:22,color:C.silverBright}}>Transacciones</div><div style={{fontSize:13,color:C.muted}}>+20 pts por registro ⚡</div></div>
            <button onClick={()=>setShowAdd(true)} style={{background:`linear-gradient(135deg,${C.blue},${C.blueEl})`,border:"none",borderRadius:12,padding:"10px 16px",color:C.white,fontWeight:800,fontSize:14,cursor:"pointer",boxShadow:`0 4px 14px ${C.blueGlow}`}}>+ Nuevo</button>
          </div>
          {transactions.length===0
            ?<div style={{textAlign:"center",padding:"60px 0",color:C.muted}}><div style={{fontSize:44,marginBottom:14}}>💳</div><div style={{fontSize:15,fontWeight:700,color:C.silverDim}}>Sin transacciones aún</div><div style={{fontSize:13,marginTop:6}}>Registra tu primer movimiento</div></div>
            :transactions.map(t=>(
              <div key={t.id} style={{background:C.card,borderRadius:14,padding:"14px 16px",marginBottom:10,border:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:42,height:42,borderRadius:12,background:t.amount>0?`${C.green}15`:`${C.red}15`,border:`1px solid ${t.amount>0?C.green:C.red}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{t.cat}</div>
                  <div><div style={{fontWeight:700,fontSize:15}}>{t.desc}</div><div style={{fontSize:12,color:C.muted}}>{t.date} · <span style={{textTransform:"capitalize"}}>{t.type}</span></div></div>
                </div>
                <div style={{fontWeight:900,fontSize:16,color:t.amount>0?C.green:C.red}}>{t.amount>0?"+":""}${Math.abs(t.amount).toFixed(2)}</div>
              </div>
            ))
          }
          {/* Debt calculator */}
          <div style={{background:C.card,borderRadius:16,padding:18,border:`1px solid ${C.blueEl}20`,marginTop:8}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div style={{width:38,height:38,borderRadius:10,background:`${C.blueEl}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🧮</div>
              <div style={{fontWeight:800,fontSize:16,color:C.silverBright}}>Calculadora de Deudas</div>
            </div>
            {[{l:"Monto ($)",v:debtAmount,s:setDebtAmount},{l:"Tasa anual (%)",v:debtRate,s:setDebtRate},{l:"Meses",v:debtMonths,s:setDebtMonths}].map(f=>(
              <input key={f.l} type="number" placeholder={f.l} value={f.v} onChange={e=>f.s(e.target.value)} style={inp}/>
            ))}
            <button onClick={calcDebt} style={{width:"100%",background:`linear-gradient(135deg,${C.blue},${C.blueEl})`,border:"none",borderRadius:12,padding:13,color:C.white,fontWeight:800,cursor:"pointer",fontSize:15,boxShadow:`0 4px 14px ${C.blueGlow}`}}>Calcular</button>
            {calcResult&&(
              <div style={{marginTop:12,background:C.bg2,borderRadius:12,padding:14,border:`1px solid ${C.border}`}}>
                {[["Cuota mensual",`$${calcResult.monthly}`,C.blueBright],["Total a pagar",`$${calcResult.total}`,C.red],["Total en intereses",`$${calcResult.interest}`,C.gold]].map(([k,v,col])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
                    <span style={{color:C.silver,fontSize:14}}>{k}</span><span style={{fontWeight:800,color:col}}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── RETOS ── */}
      {tab==="retos"&&(
        <div style={{padding:16,zIndex:1,position:"relative"}}>
          <div style={{fontWeight:900,fontSize:22,marginBottom:4,color:C.silverBright}}>Retos Financieros</div>
          <div style={{fontSize:13,color:C.muted,marginBottom:14}}>Completa con prueba · Gana puntos reales</div>
          <div style={{background:C.card,borderRadius:14,padding:"12px 16px",marginBottom:16,border:`1px solid ${C.border}`,display:"flex",justifyContent:"space-around"}}>
            {[{v:completedChallenges.length,l:"Completados",c:C.blueBright},{v:challenges.length-completedChallenges.length,l:"Pendientes",c:C.silver},{v:challenges.filter(c=>completedChallenges.includes(c.id)).reduce((a,c)=>a+c.pts,0),l:"Pts ganados",c:C.gold}].map((x,i)=>(
              <div key={i} style={{textAlign:"center"}}>
                <div style={{fontWeight:900,fontSize:22,color:x.c}}>{x.v}</div>
                <div style={{fontSize:11,color:C.muted}}>{x.l}</div>
              </div>
            ))}
          </div>
          {challenges.map(c=>{
            const done=completedChallenges.includes(c.id),proof=challengeProofs[c.id];
            return(
              <div key={c.id} style={{background:done?`linear-gradient(135deg,#040c08,#071010)`:C.card,borderRadius:16,padding:16,marginBottom:12,border:`1px solid ${done?C.green+"35":C.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div style={{display:"flex",gap:12,flex:1}}>
                    <div style={{width:44,height:44,borderRadius:12,background:done?`${C.green}20`:`${C.blueEl}10`,border:`1px solid ${done?C.green+"40":C.blueEl+"20"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{c.icon}</div>
                    <div style={{flex:1}}><div style={{fontWeight:700,fontSize:15,color:done?C.green:C.text}}>{c.title}</div><div style={{color:C.gold,fontWeight:700,fontSize:13,marginTop:4}}>⚡ +{c.pts} pts</div></div>
                  </div>
                  {done?<div style={{background:`${C.green}20`,color:C.green,borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:800,border:`1px solid ${C.green}35`,flexShrink:0}}>✓ LISTO</div>
                  :<button onClick={()=>{setShowProof(c);setProofText("");setProofImg(null);}} style={{background:`linear-gradient(135deg,${C.blue},${C.blueEl})`,border:"none",borderRadius:20,padding:"7px 14px",color:C.white,fontWeight:700,cursor:"pointer",fontSize:12,boxShadow:`0 2px 10px ${C.blueGlow}`,flexShrink:0}}>Completar</button>}
                </div>
                <div style={{background:done?`${C.green}08`:`${C.blueEl}08`,borderRadius:10,padding:"8px 12px",border:`1px solid ${done?C.green+"18":C.blueEl+"15"}`}}>
                  <div style={{fontSize:11,color:done?C.green:C.blueEl,fontWeight:700,marginBottom:3}}>📋 PRUEBA REQUERIDA</div>
                  <div style={{fontSize:12,color:C.silver}}>{c.proof}</div>
                </div>
                {done&&proof&&<div style={{marginTop:10,background:`${C.green}08`,borderRadius:10,padding:"10px 12px",border:`1px solid ${C.green}18`}}>
                  <div style={{fontSize:11,color:C.green,fontWeight:700,marginBottom:4}}>✅ ENVIADA — {proof.date}</div>
                  {proof.text&&<div style={{fontSize:13,color:C.silver}}>{proof.text}</div>}
                  {proof.img&&<img src={proof.img} alt="prueba" style={{marginTop:8,width:"100%",borderRadius:8,maxHeight:120,objectFit:"cover"}}/>}
                </div>}
              </div>
            );
          })}
        </div>
      )}

      {/* ── JUEGOS ── */}
      {tab==="juegos"&&(
        <div style={{padding:16,zIndex:1,position:"relative"}}>
          {!activeGame?(
            <>
              <div style={{fontWeight:900,fontSize:22,marginBottom:4,color:C.silverBright}}>Minijuegos 🎮</div>
              <div style={{fontSize:13,color:C.muted,marginBottom:16}}>Aprende finanzas jugando · Gana puntos</div>
              <div style={{textAlign:"center",marginBottom:20}}><Robot mood="happy" size={90}/></div>
              {games.map(g=>(
                <button key={g.id} onClick={()=>setActiveGame(g.id)} style={{width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:16,marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",gap:14,textAlign:"left"}}>
                  <div style={{width:50,height:50,borderRadius:14,background:`${C.blue}12`,border:`1px solid ${C.blue}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{g.icon}</div>
                  <div style={{flex:1}}><div style={{fontWeight:800,fontSize:16,color:C.silverBright}}>{g.label}</div><div style={{fontSize:13,color:C.muted,marginTop:2}}>{g.desc}</div></div>
                  <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:12,color:C.gold,fontWeight:700}}>⚡{g.pts}</div><div style={{fontSize:20,color:C.blueEl,marginTop:4}}>›</div></div>
                </button>
              ))}
            </>
          ):(
            <>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
                <button onClick={()=>setActiveGame(null)} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:10,padding:"8px 14px",color:C.silver,cursor:"pointer",fontWeight:700,fontSize:14}}>← Volver</button>
                <div style={{fontWeight:800,fontSize:18,color:C.silverBright}}>{games.find(g=>g.id===activeGame)?.label}</div>
              </div>
              {activeGame==="trivia"&&<TriviaGame onEarn={pts=>{earnPoints(pts);setTimeout(()=>setActiveGame(null),2000);}}/>}
              {activeGame==="hangman"&&<HangmanGame onEarn={pts=>{earnPoints(pts);setTimeout(()=>setActiveGame(null),2000);}}/>}
              {activeGame==="memory"&&<MemoryGame onEarn={pts=>{earnPoints(pts);setTimeout(()=>setActiveGame(null),2000);}}/>}
              {activeGame==="spin"&&<SpinWheel onEarn={pts=>earnPoints(pts)}/>}
              {activeGame==="sort"&&<SortGame onEarn={pts=>{earnPoints(pts);setTimeout(()=>setActiveGame(null),2000);}}/>}
            </>
          )}
        </div>
      )}

      {/* ── FINBOT CHAT ── */}
      {tab==="finbot"&&(
        <div style={{height:"100vh",display:"flex",flexDirection:"column"}}>
          <FinbotChat points={points}/>
        </div>
      )}

      {/* ── PREMIOS ── */}
      {tab==="premios"&&(
        <div style={{padding:16,zIndex:1,position:"relative"}}>
          <div style={{fontWeight:900,fontSize:22,marginBottom:4,color:C.silverBright}}>Tienda de Premios</div>
          <div style={{fontSize:13,color:C.muted,marginBottom:12}}>Canjea puntos por recompensas reales</div>
          <div style={{background:`linear-gradient(135deg,#060d22,#091428)`,borderRadius:16,padding:"16px 20px",marginBottom:18,border:`1px solid ${C.blueEl}25`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:11,color:C.silver,letterSpacing:"1px",textTransform:"uppercase"}}>Mis puntos</div><div style={{fontSize:32,fontWeight:900,background:`linear-gradient(90deg,${C.blueEl},${C.blueBright})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{points.toLocaleString()}</div></div>
            <div style={{fontSize:38}}>⚡</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {prizes.map(p=>{
              const ok=points>=p.pts;
              return(
                <div key={p.pts} style={{background:ok?`linear-gradient(135deg,#040c08,#071010)`:C.card,borderRadius:16,padding:18,border:`1px solid ${ok?C.green+"35":C.border}`,textAlign:"center",opacity:ok?1:.55,transition:"all .3s"}}>
                  <div style={{fontSize:36,marginBottom:8}}>{p.icon}</div>
                  <div style={{fontWeight:800,marginBottom:2,fontSize:14,color:ok?C.white:C.silver}}>{p.label}</div>
                  <div style={{fontSize:12,color:C.muted,marginBottom:8}}>{p.desc}</div>
                  <div style={{fontSize:12,color:C.gold,marginBottom:10,fontWeight:700}}>⚡ {p.pts.toLocaleString()} pts</div>
                  {ok?<button onClick={()=>{setShowRedeem(p);setRedeemName("");setRedeemPhone("");setRedeemSent(false);}} style={{background:`linear-gradient(135deg,${C.green},#00a060)`,border:"none",borderRadius:20,padding:"7px 18px",color:C.bg,fontWeight:800,cursor:"pointer",fontSize:13,boxShadow:`0 2px 10px ${C.green}30`}}>Canjear 🎁</button>
                  :<div style={{fontSize:11,color:C.muted,background:C.border,borderRadius:20,padding:"5px 10px",display:"inline-block"}}>Faltan {(p.pts-points).toLocaleString()} pts</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── PROOF MODAL ── */}
      {showProof&&(
        <div style={{position:"fixed",inset:0,background:"#000000d0",display:"flex",alignItems:"flex-end",zIndex:100}} onClick={()=>setShowProof(null)}>
          <div style={{background:C.bg2,borderRadius:"22px 22px 0 0",padding:24,width:"100%",maxWidth:430,margin:"0 auto",border:`1px solid ${C.blueEl}25`,borderBottom:"none",maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:40,height:4,background:C.border,borderRadius:4,margin:"0 auto 18px"}}/>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:6}}><span style={{fontSize:24}}>{showProof.icon}</span><div style={{fontWeight:800,fontSize:17,color:C.silverBright}}>{showProof.title}</div></div>
            <div style={{color:C.gold,fontWeight:700,fontSize:13,marginBottom:14}}>⚡ +{showProof.pts} puntos al completar</div>
            <div style={{background:`${C.blueEl}08`,borderRadius:12,padding:"10px 14px",marginBottom:14,border:`1px solid ${C.blueEl}18`}}>
              <div style={{fontSize:11,color:C.blueEl,fontWeight:700,marginBottom:3}}>📋 PRUEBA REQUERIDA</div>
              <div style={{fontSize:13,color:C.silver}}>{showProof.proof}</div>
            </div>
            <textarea placeholder="Describe cómo completaste el reto..." value={proofText} onChange={e=>setProofText(e.target.value)} style={{...inp,minHeight:80,resize:"vertical",marginBottom:10}}/>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImg} style={{display:"none"}}/>
            <button onClick={()=>fileRef.current.click()} style={{width:"100%",background:C.card2,border:`1px dashed ${C.blueEl}35`,borderRadius:12,padding:12,color:C.silver,cursor:"pointer",fontSize:14,marginBottom:8}}>
              📷 {proofImg?"✅ Foto cargada":"Seleccionar foto"}
            </button>
            {proofImg&&<img src={proofImg} alt="preview" style={{width:"100%",borderRadius:10,marginBottom:12,maxHeight:140,objectFit:"cover"}}/>}
            <button onClick={()=>submitProof(showProof.id,showProof.pts)} disabled={!proofText&&!proofImg} style={{width:"100%",background:proofText||proofImg?`linear-gradient(135deg,${C.blue},${C.blueEl})`:C.border,border:"none",borderRadius:14,padding:14,color:proofText||proofImg?C.white:C.muted,fontWeight:800,fontSize:16,cursor:proofText||proofImg?"pointer":"not-allowed",boxShadow:proofText||proofImg?`0 4px 18px ${C.blueGlow}`:"none"}}>
              Enviar Prueba · Ganar ⚡{showProof.pts} pts
            </button>
          </div>
        </div>
      )}

      {/* ── REDEEM MODAL ── */}
      {showRedeem&&(
        <div style={{position:"fixed",inset:0,background:"#000000d0",display:"flex",alignItems:"flex-end",zIndex:100}} onClick={()=>setShowRedeem(null)}>
          <div style={{background:C.bg2,borderRadius:"22px 22px 0 0",padding:24,width:"100%",maxWidth:430,margin:"0 auto",border:`1px solid ${C.green}25`,borderBottom:"none"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:40,height:4,background:C.border,borderRadius:4,margin:"0 auto 18px"}}/>
            {!redeemSent?(
              <>
                <div style={{textAlign:"center",marginBottom:18}}>
                  <div style={{fontSize:48,marginBottom:8}}>{showRedeem.icon}</div>
                  <div style={{fontWeight:900,fontSize:20,color:C.silverBright}}>{showRedeem.label}</div>
                  <div style={{color:C.gold,fontWeight:700,fontSize:14,marginTop:6}}>⚡ {showRedeem.pts.toLocaleString()} puntos</div>
                </div>
                <input type="text" placeholder="Tu nombre completo" value={redeemName} onChange={e=>setRedeemName(e.target.value)} style={inp}/>
                <input type="tel" placeholder="Tu número de WhatsApp" value={redeemPhone} onChange={e=>setRedeemPhone(e.target.value)} style={{...inp,marginBottom:16}}/>
                <button onClick={()=>sendRedeem(showRedeem)} disabled={!redeemName||!redeemPhone} style={{width:"100%",background:redeemName&&redeemPhone?`linear-gradient(135deg,${C.green},#00a060)`:C.border,border:"none",borderRadius:14,padding:14,color:redeemName&&redeemPhone?C.bg:C.muted,fontWeight:800,fontSize:16,cursor:redeemName&&redeemPhone?"pointer":"not-allowed"}}>
                  Confirmar Canje 🎁
                </button>
              </>
            ):(
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:56,marginBottom:14}}>🎉</div>
                <div style={{fontWeight:900,fontSize:22,color:C.green,marginBottom:8}}>¡Canje enviado!</div>
                <div style={{fontSize:14,color:C.silver,lineHeight:1.7,marginBottom:20}}>Te contactaremos por WhatsApp para entregarte tu premio. ¡Gracias!</div>
                <button onClick={()=>setShowRedeem(null)} style={{background:`linear-gradient(135deg,${C.blue},${C.blueEl})`,border:"none",borderRadius:14,padding:"12px 30px",color:C.white,fontWeight:800,fontSize:15,cursor:"pointer"}}>Cerrar</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ADD TRANSACTION ── */}
      {showAdd&&(
        <div style={{position:"fixed",inset:0,background:"#000000d0",display:"flex",alignItems:"flex-end",zIndex:100}} onClick={()=>setShowAdd(false)}>
          <div style={{background:C.bg2,borderRadius:"22px 22px 0 0",padding:24,width:"100%",maxWidth:430,margin:"0 auto",border:`1px solid ${C.border}`,borderBottom:"none"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:40,height:4,background:C.border,borderRadius:4,margin:"0 auto 18px"}}/>
            <div style={{fontWeight:900,fontSize:20,marginBottom:14,color:C.silverBright}}>Nuevo Registro</div>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              {["gasto","ingreso","ahorro"].map(t=>(
                <button key={t} onClick={()=>setNewType(t)} style={{flex:1,padding:"10px 0",borderRadius:12,border:`1px solid ${newType===t?C.blueEl:C.border}`,background:newType===t?`${C.blue}25`:"transparent",color:newType===t?C.blueBright:C.muted,fontWeight:700,cursor:"pointer",fontSize:13,textTransform:"capitalize"}}>{t}</button>
              ))}
            </div>
            <input type="text" placeholder="Descripción" value={newDesc} onChange={e=>setNewDesc(e.target.value)} style={inp}/>
            <input type="number" placeholder="Monto ($)" value={newAmount} onChange={e=>setNewAmount(e.target.value)} style={{...inp,marginBottom:16}}/>
            <button onClick={addTransaction} style={{width:"100%",background:`linear-gradient(135deg,${C.blue},${C.blueEl})`,border:"none",borderRadius:14,padding:14,color:C.white,fontWeight:800,fontSize:16,cursor:"pointer",boxShadow:`0 4px 18px ${C.blueGlow}`}}>
              Guardar · +20 pts ⚡
            </button>
          </div>
        </div>
      )}

      {/* ── BOTTOM NAV ── */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:`${C.bg}f8`,backdropFilter:"blur(20px)",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-around",padding:"8px 0 14px",zIndex:20}}>
        {navItems.map(n=>(
          <button key={n.id} onClick={()=>{setTab(n.id);setActiveGame(null);}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 6px",position:"relative",minWidth:0}}>
            {tab===n.id&&<div style={{position:"absolute",top:-8,left:"50%",transform:"translateX(-50%)",width:28,height:2,background:`linear-gradient(90deg,${C.blue},${C.blueBright})`,borderRadius:2,boxShadow:`0 0 8px ${C.blue}`}}/>}
            {n.id==="finbot"
              ?<div style={{width:28,height:28,borderRadius:8,background:tab===n.id?`${C.blueEl}25`:`${C.muted}15`,border:`1px solid ${tab===n.id?C.blueEl+"50":C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,transition:"all .2s"}}>{n.icon}</div>
              :<span style={{fontSize:16,color:tab===n.id?C.blueBright:C.muted,transition:"color .2s"}}>{n.icon}</span>
            }
            <span style={{fontSize:9,color:tab===n.id?C.blueBright:C.muted,fontWeight:tab===n.id?700:400,letterSpacing:"0.2px"}}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
