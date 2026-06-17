import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CORRECT SCHEDULE — all times ET (UTC-4). kickoffISO is the exact UTC moment.
// ─────────────────────────────────────────────────────────────────────────────
const SCHEDULE = {
  "2026-06-11": [
    { t1:"Mexico",       t2:"South Africa",    time:"3:00 PM",  kickoffISO:"2026-06-11T19:00:00Z", venue:"Mexico City",     group:"A" },
    { t1:"South Korea",  t2:"Czechia",          time:"6:00 PM",  kickoffISO:"2026-06-11T22:00:00Z", venue:"Los Angeles",     group:"A" },
  ],
  "2026-06-12": [
    { t1:"Canada",       t2:"Bosnia & Herz.",   time:"3:00 PM",  kickoffISO:"2026-06-12T19:00:00Z", venue:"Toronto",         group:"B" },
    { t1:"USA",          t2:"Paraguay",          time:"6:00 PM",  kickoffISO:"2026-06-12T22:00:00Z", venue:"Dallas",          group:"D" },
    { t1:"Germany",      t2:"Curaçao",           time:"9:00 PM",  kickoffISO:"2026-06-13T01:00:00Z", venue:"Philadelphia",    group:"E" },
  ],
  "2026-06-13": [
    { t1:"Argentina",    t2:"Algeria",           time:"1:00 PM",  kickoffISO:"2026-06-13T17:00:00Z", venue:"Kansas City",     group:"J" },
    { t1:"Austria",      t2:"Jordan",            time:"1:00 PM",  kickoffISO:"2026-06-13T17:00:00Z", venue:"San Francisco",   group:"J" },
    { t1:"Portugal",     t2:"DR Congo",          time:"4:00 PM",  kickoffISO:"2026-06-13T20:00:00Z", venue:"Houston",         group:"K" },
    { t1:"Spain",        t2:"Saudi Arabia",      time:"7:00 PM",  kickoffISO:"2026-06-13T23:00:00Z", venue:"Miami",           group:"H" },
  ],
  "2026-06-14": [
    { t1:"Brazil",       t2:"Algeria",           time:"1:00 PM",  kickoffISO:"2026-06-14T17:00:00Z", venue:"New York/NJ",     group:"C" },
    { t1:"Netherlands",  t2:"Uruguay",           time:"4:00 PM",  kickoffISO:"2026-06-14T20:00:00Z", venue:"Houston",         group:"H" },
    { t1:"France",       t2:"Senegal",           time:"7:00 PM",  kickoffISO:"2026-06-14T23:00:00Z", venue:"New York/NJ",     group:"I" },
    { t1:"Japan",        t2:"Tunisia",           time:"10:00 PM", kickoffISO:"2026-06-15T02:00:00Z", venue:"Guadalajara",     group:"F" },
  ],
  "2026-06-15": [
    { t1:"Scotland",     t2:"Morocco",           time:"1:00 PM",  kickoffISO:"2026-06-15T17:00:00Z", venue:"Boston",          group:"C" },
    { t1:"Australia",    t2:"Turkey",            time:"4:00 PM",  kickoffISO:"2026-06-15T20:00:00Z", venue:"Seattle",         group:"D" },
    { t1:"Iraq",         t2:"Norway",            time:"4:00 PM",  kickoffISO:"2026-06-15T20:00:00Z", venue:"Boston",          group:"I" },
    { t1:"Belgium",      t2:"Egypt",             time:"7:00 PM",  kickoffISO:"2026-06-15T23:00:00Z", venue:"Los Angeles",     group:"G" },
    { t1:"Iran",         t2:"New Zealand",       time:"10:00 PM", kickoffISO:"2026-06-16T02:00:00Z", venue:"Los Angeles",     group:"G" },
  ],
  "2026-06-16": [
    { t1:"Ecuador",      t2:"Sweden",            time:"1:00 PM",  kickoffISO:"2026-06-16T17:00:00Z", venue:"Houston",         group:"F" },
    { t1:"Uzbekistan",   t2:"Colombia",          time:"4:00 PM",  kickoffISO:"2026-06-16T20:00:00Z", venue:"Mexico City",     group:"K" },
    { t1:"Germany",      t2:"Ivory Coast",       time:"7:00 PM",  kickoffISO:"2026-06-16T23:00:00Z", venue:"Toronto",         group:"E" },
  ],
  "2026-06-17": [
    { t1:"England",      t2:"Croatia",           time:"4:00 PM",  kickoffISO:"2026-06-17T20:00:00Z", venue:"Dallas",          group:"L" },
    { t1:"Ghana",        t2:"Panama",            time:"7:00 PM",  kickoffISO:"2026-06-17T23:00:00Z", venue:"Toronto",         group:"L" },
  ],
  "2026-06-18": [
    { t1:"Czechia",      t2:"South Africa",      time:"12:00 PM", kickoffISO:"2026-06-18T16:00:00Z", venue:"Atlanta",         group:"A" },
    { t1:"Switzerland",  t2:"Bosnia & Herz.",    time:"3:00 PM",  kickoffISO:"2026-06-18T19:00:00Z", venue:"Los Angeles",     group:"B" },
    { t1:"Canada",       t2:"Qatar",             time:"6:00 PM",  kickoffISO:"2026-06-18T22:00:00Z", venue:"Vancouver",       group:"B" },
    { t1:"Mexico",       t2:"South Korea",       time:"11:00 PM", kickoffISO:"2026-06-19T03:00:00Z", venue:"Guadalajara",     group:"A" },
  ],
  "2026-06-19": [
    { t1:"USA",          t2:"Australia",         time:"3:00 PM",  kickoffISO:"2026-06-19T19:00:00Z", venue:"Seattle",         group:"D" },
    { t1:"Brazil",       t2:"Haiti",             time:"6:00 PM",  kickoffISO:"2026-06-19T22:00:00Z", venue:"Philadelphia",    group:"C" },
    { t1:"Turkey",       t2:"Paraguay",          time:"9:00 PM",  kickoffISO:"2026-06-20T01:00:00Z", venue:"Santa Clara",     group:"D" },
  ],
  "2026-06-20": [
    { t1:"Netherlands",  t2:"Sweden",            time:"1:00 PM",  kickoffISO:"2026-06-20T17:00:00Z", venue:"Houston",         group:"F" },
    { t1:"Ecuador",      t2:"Curaçao",           time:"4:00 PM",  kickoffISO:"2026-06-20T20:00:00Z", venue:"Kansas City",     group:"E" },
    { t1:"Tunisia",      t2:"Japan",             time:"10:00 PM", kickoffISO:"2026-06-21T02:00:00Z", venue:"Guadalajara",     group:"F" },
  ],
  "2026-06-21": [
    { t1:"Scotland",     t2:"Morocco",           time:"12:00 PM", kickoffISO:"2026-06-21T16:00:00Z", venue:"Boston",          group:"C" },
    { t1:"Spain",        t2:"Saudi Arabia",      time:"3:00 PM",  kickoffISO:"2026-06-21T19:00:00Z", venue:"Miami",           group:"H" },
    { t1:"Belgium",      t2:"Iran",              time:"6:00 PM",  kickoffISO:"2026-06-21T22:00:00Z", venue:"Los Angeles",     group:"G" },
    { t1:"New Zealand",  t2:"Egypt",             time:"9:00 PM",  kickoffISO:"2026-06-22T01:00:00Z", venue:"Los Angeles",     group:"G" },
  ],
  "2026-06-22": [
    { t1:"Argentina",    t2:"Austria",           time:"1:00 PM",  kickoffISO:"2026-06-22T17:00:00Z", venue:"Dallas",          group:"J" },
    { t1:"France",       t2:"Iraq",              time:"5:00 PM",  kickoffISO:"2026-06-22T21:00:00Z", venue:"Atlanta",         group:"I" },
    { t1:"Norway",       t2:"Senegal",           time:"8:00 PM",  kickoffISO:"2026-06-23T00:00:00Z", venue:"Boston",          group:"I" },
    { t1:"Jordan",       t2:"Algeria",           time:"11:00 PM", kickoffISO:"2026-06-23T03:00:00Z", venue:"Dallas",          group:"J" },
  ],
  "2026-06-23": [
    { t1:"Portugal",     t2:"Uzbekistan",        time:"1:00 PM",  kickoffISO:"2026-06-23T17:00:00Z", venue:"Houston",         group:"K" },
    { t1:"England",      t2:"Ghana",             time:"4:00 PM",  kickoffISO:"2026-06-23T20:00:00Z", venue:"Boston",          group:"L" },
    { t1:"Panama",       t2:"Croatia",           time:"7:00 PM",  kickoffISO:"2026-06-23T23:00:00Z", venue:"Toronto",         group:"L" },
    { t1:"Colombia",     t2:"DR Congo",          time:"10:00 PM", kickoffISO:"2026-06-24T02:00:00Z", venue:"Guadalajara",     group:"K" },
  ],
  "2026-06-24": [
    { t1:"Mexico",       t2:"Czechia",           time:"3:00 PM",  kickoffISO:"2026-06-24T19:00:00Z", venue:"Dallas",          group:"A" },
    { t1:"South Korea",  t2:"South Africa",      time:"3:00 PM",  kickoffISO:"2026-06-24T19:00:00Z", venue:"Los Angeles",     group:"A" },
    { t1:"Switzerland",  t2:"Qatar",             time:"6:00 PM",  kickoffISO:"2026-06-24T22:00:00Z", venue:"San Francisco",   group:"B" },
    { t1:"Bosnia & Herz.",t2:"Canada",           time:"6:00 PM",  kickoffISO:"2026-06-24T22:00:00Z", venue:"Vancouver",       group:"B" },
  ],
  "2026-06-25": [
    { t1:"USA",          t2:"Turkey",            time:"3:00 PM",  kickoffISO:"2026-06-25T19:00:00Z", venue:"Houston",         group:"D" },
    { t1:"Paraguay",     t2:"Australia",         time:"3:00 PM",  kickoffISO:"2026-06-25T19:00:00Z", venue:"San Francisco",   group:"D" },
    { t1:"Morocco",      t2:"Brazil",            time:"6:00 PM",  kickoffISO:"2026-06-25T22:00:00Z", venue:"Dallas",          group:"C" },
    { t1:"Haiti",        t2:"Scotland",          time:"6:00 PM",  kickoffISO:"2026-06-25T22:00:00Z", venue:"Philadelphia",    group:"C" },
  ],
  "2026-06-26": [
    { t1:"Uruguay",      t2:"Cabo Verde",        time:"3:00 PM",  kickoffISO:"2026-06-26T19:00:00Z", venue:"Chicago",         group:"H" },
    { t1:"Saudi Arabia", t2:"Netherlands",       time:"3:00 PM",  kickoffISO:"2026-06-26T19:00:00Z", venue:"Dallas",          group:"H" },
    { t1:"Ivory Coast",  t2:"Germany",           time:"6:00 PM",  kickoffISO:"2026-06-26T22:00:00Z", venue:"Toronto",         group:"E" },
    { t1:"Curaçao",      t2:"Ecuador",           time:"6:00 PM",  kickoffISO:"2026-06-26T22:00:00Z", venue:"Kansas City",     group:"E" },
    { t1:"New Zealand",  t2:"Belgium",           time:"9:00 PM",  kickoffISO:"2026-06-27T01:00:00Z", venue:"Los Angeles",     group:"G" },
    { t1:"Egypt",        t2:"Iran",              time:"9:00 PM",  kickoffISO:"2026-06-27T01:00:00Z", venue:"Los Angeles",     group:"G" },
  ],
  "2026-06-27": [
    { t1:"Sweden",       t2:"Japan",             time:"3:00 PM",  kickoffISO:"2026-06-27T19:00:00Z", venue:"Houston",         group:"F" },
    { t1:"Tunisia",      t2:"Netherlands",       time:"3:00 PM",  kickoffISO:"2026-06-27T19:00:00Z", venue:"Miami",           group:"F" },
    { t1:"Panama",       t2:"England",           time:"5:00 PM",  kickoffISO:"2026-06-27T21:00:00Z", venue:"New York/NJ",     group:"L" },
    { t1:"Croatia",      t2:"Ghana",             time:"5:00 PM",  kickoffISO:"2026-06-27T21:00:00Z", venue:"Philadelphia",    group:"L" },
    { t1:"Colombia",     t2:"Portugal",          time:"7:30 PM",  kickoffISO:"2026-06-27T23:30:00Z", venue:"Miami",           group:"K" },
    { t1:"DR Congo",     t2:"Uzbekistan",        time:"7:30 PM",  kickoffISO:"2026-06-27T23:30:00Z", venue:"Atlanta",         group:"K" },
    { t1:"Saudi Arabia", t2:"Uruguay",           time:"3:00 PM",  kickoffISO:"2026-06-27T19:00:00Z", venue:"Dallas",          group:"H" },
    { t1:"Cabo Verde",   t2:"Spain",             time:"3:00 PM",  kickoffISO:"2026-06-27T19:00:00Z", venue:"Chicago",         group:"H" },
  ],
  "2026-06-28": [
    { t1:"Algeria",      t2:"Austria",           time:"3:00 PM",  kickoffISO:"2026-06-28T19:00:00Z", venue:"San Francisco",   group:"J" },
    { t1:"Jordan",       t2:"Argentina",         time:"3:00 PM",  kickoffISO:"2026-06-28T19:00:00Z", venue:"Kansas City",     group:"J" },
    { t1:"Senegal",      t2:"Iraq",              time:"6:00 PM",  kickoffISO:"2026-06-28T22:00:00Z", venue:"Chicago",         group:"I" },
    { t1:"Norway",       t2:"France",            time:"6:00 PM",  kickoffISO:"2026-06-28T22:00:00Z", venue:"Boston",          group:"I" },
    { t1:"South Africa", t2:"South Korea",       time:"3:00 PM",  kickoffISO:"2026-06-28T19:00:00Z", venue:"Los Angeles",     group:"A" },
    { t1:"Czechia",      t2:"Mexico",            time:"3:00 PM",  kickoffISO:"2026-06-28T19:00:00Z", venue:"Dallas",          group:"A" },
  ],
};

const QUESTIONS = [
  { id:"winner",         label:"Match Winner",              type:"radio", options:(t1,t2)=>[t1,"Draw",t2],         points:3 },
  { id:"both_score",     label:"Will Both Teams Score?",    type:"radio", options:()=>["Yes","No"],                 points:2 },
  { id:"total_goals",    label:"Total Goals in Match",      type:"radio", options:()=>["0–1","2–3","4–5","6+"],    points:3 },
  { id:"first_scorer",   label:"First Goal Scored By",      type:"radio", options:(t1,t2)=>[t1,t2,"No goals"],    points:3 },
  { id:"exact_score",    label:"Exact Score",               type:"score",                                           points:5 },
  { id:"halftime_winner",label:"Half-Time Leader",          type:"radio", options:(t1,t2)=>[t1,"Draw",t2],         points:2 },
  { id:"cards",          label:"Total Yellow Cards",        type:"radio", options:()=>["0–1","2–3","4–5","6+"],    points:2 },
  { id:"corners",        label:"Total Corners",             type:"radio", options:()=>["0–5","6–9","10–13","14+"], points:2 },
  { id:"penalty",        label:"Will there be a Penalty?",  type:"radio", options:()=>["Yes","No"],                 points:3 },
  { id:"red_card",       label:"Will there be a Red Card?", type:"radio", options:()=>["Yes","No"],                 points:3 },
];
const TOTAL_PTS = QUESTIONS.reduce((s,q)=>s+q.points,0);

const ACCENT="#00D563", BG="#0A0E1A", CARD="#111827", BORDER="#1F2D42", RED="#F87171", BLUE="#60A5FA", GOLD="#F59E0B";

const FLAGS = {
  "Mexico":"🇲🇽","South Africa":"🇿🇦","South Korea":"🇰🇷","Czechia":"🇨🇿","Canada":"🇨🇦","Bosnia & Herz.":"🇧🇦",
  "USA":"🇺🇸","Paraguay":"🇵🇾","Germany":"🇩🇪","Curaçao":"🇨🇼","Argentina":"🇦🇷","Austria":"🇦🇹",
  "Spain":"🇪🇸","Saudi Arabia":"🇸🇦","Brazil":"🇧🇷","Algeria":"🇩🇿","Japan":"🇯🇵","Tunisia":"🇹🇳",
  "Australia":"🇦🇺","Turkey":"🇹🇷","Scotland":"🏴󠁧󠁢󠁳󠁣󠁴󠁿","Morocco":"🇲🇦","Iran":"🇮🇷","New Zealand":"🇳🇿",
  "Ecuador":"🇪🇨","Sweden":"🇸🇪","France":"🇫🇷","Senegal":"🇸🇳","Iraq":"🇮🇶","Norway":"🇳🇴",
  "Belgium":"🇧🇪","Egypt":"🇪🇬","Netherlands":"🇳🇱","Uruguay":"🇺🇾","Ghana":"🇬🇭","Panama":"🇵🇦",
  "England":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","Croatia":"🇭🇷","Portugal":"🇵🇹","DR Congo":"🇨🇩","Uzbekistan":"🇺🇿","Colombia":"🇨🇴",
  "Switzerland":"🇨🇭","Qatar":"🇶🇦","Ivory Coast":"🇨🇮","Haiti":"🇭🇹","Cabo Verde":"🇨🇻","Jordan":"🇯🇴",
};
const flag = n => FLAGS[n]||"🏳";

function todayKey(){
  const n=new Date();
  return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`;
}
function fmtDate(k){
  const [y,m,d]=k.split("-");
  return new Date(+y,+m-1,+d).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
}
function matchKey(date,m){ return `${date}::${m.t1}vs${m.t2}`; }

function hasKickedOff(match){
  return new Date() >= new Date(match.kickoffISO);
}
// match is "over" ~115 min after kickoff
function isMatchOver(match){
  const ko=new Date(match.kickoffISO);
  return new Date() >= new Date(ko.getTime()+115*60*1000);
}

function goalsBracket(n){ return n<=1?"0–1":n<=3?"2–3":n<=5?"4–5":"6+"; }
function yellowBracket(n){ return n<=1?"0–1":n<=3?"2–3":n<=5?"4–5":"6+"; }
function cornersBracket(n){ return n<=5?"0–5":n<=9?"6–9":n<=13?"10–13":"14+"; }

function calcScore(pred, result){
  if(!result) return null;
  let pts=0;
  const a=pred.answers;
  if(a.winner===result.winner) pts+=3;
  if(a.both_score===result.both_score) pts+=2;
  if(a.total_goals===result.total_goals) pts+=3;
  if(a.first_scorer===result.first_scorer) pts+=3;
  if(String(pred.scoreA)===String(result.scoreA)&&String(pred.scoreB)===String(result.scoreB)) pts+=5;
  if(a.halftime_winner===result.halftime_winner) pts+=2;
  if(a.cards===result.cards) pts+=2;
  if(a.corners===result.corners) pts+=2;
  if(a.penalty===result.penalty) pts+=3;
  if(a.red_card===result.red_card) pts+=3;
  return pts;
}

// ── Storage ───────────────────────────────────────────────────────────────────
async function savePred(date,match,name,answers,scoreA,scoreB){
  const k=`pred:${matchKey(date,match)}:${name.trim().toLowerCase()}`;
  await window.storage.set(k,JSON.stringify({playerName:name,date,match,answers,scoreA,scoreB}),true);
}
async function saveResult(date,match,result){
  await window.storage.set(`result:${matchKey(date,match)}`,JSON.stringify(result),true);
}
async function loadResult(date,match){
  try{ const r=await window.storage.get(`result:${matchKey(date,match)}`,true); return r?JSON.parse(r.value):null; }catch{return null;}
}
async function loadAllResults(){
  try{
    const listed=await window.storage.list("result:",true);
    if(!listed) return{};
    const map={};
    for(const k of listed.keys){
      try{ const r=await window.storage.get(k,true); if(r){ map[k.replace("result:","")]=JSON.parse(r.value); } }catch{}
    }
    return map;
  }catch{return{};}
}
async function loadDayPreds(date){
  try{
    const all=[];
    for(const match of(SCHEDULE[date]||[])){
      const listed=await window.storage.list(`pred:${matchKey(date,match)}:`,true);
      if(!listed) continue;
      for(const k of listed.keys){
        try{ const r=await window.storage.get(k,true); if(r) all.push(JSON.parse(r.value)); }catch{}
      }
    }
    return all;
  }catch{return[];}
}
async function loadAllPreds(){
  try{
    const listed=await window.storage.list("pred:",true);
    if(!listed) return[];
    const all=[];
    for(const k of listed.keys){ try{ const r=await window.storage.get(k,true); if(r) all.push(JSON.parse(r.value)); }catch{} }
    return all;
  }catch{return[];}
}

// ── Auto-fetch live result using Claude API + web search ──────────────────────
async function autoFetchResult(match, date){
  try{
    const prompt = `Search for the final result of this FIFA World Cup 2026 match: ${match.t1} vs ${match.t2} on ${date}. Return ONLY a JSON object (no markdown, no explanation) with these exact fields:
{
  "scoreA": <number, goals scored by ${match.t1}>,
  "scoreB": <number, goals scored by ${match.t2}>,
  "winner": "<${match.t1} | Draw | ${match.t2}>",
  "both_score": "<Yes | No>",
  "total_goals": "<0–1 | 2–3 | 4–5 | 6+>",
  "first_scorer": "<${match.t1} | ${match.t2} | No goals>",
  "halftime_winner": "<${match.t1} | Draw | ${match.t2}>",
  "cards": "<0–1 | 2–3 | 4–5 | 6+>",
  "corners": "<0–5 | 6–9 | 10–13 | 14+>",
  "penalty": "<Yes | No>",
  "red_card": "<Yes | No>",
  "status": "<final | not_finished>"
}
If the match has not finished yet, set status to "not_finished" and fill other fields with empty strings.`;

    const resp = await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        model:"claude-sonnet-4-6",
        max_tokens:500,
        tools:[{type:"web_search_20250305",name:"web_search"}],
        messages:[{role:"user",content:prompt}]
      })
    });
    const data = await resp.json();
    const text = data.content?.filter(b=>b.type==="text").map(b=>b.text).join("") || "";
    const clean = text.replace(/```json|```/g,"").trim();
    const json = JSON.parse(clean);
    if(json.status==="final") return json;
    return null;
  }catch(e){
    console.error("autoFetchResult error:",e);
    return null;
  }
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App(){
  const [tab,setTab]             = useState("predict");
  const [selDate,setSelDate]     = useState(todayKey());
  const [selMatch,setSelMatch]   = useState(null);
  const [playerName,setPlayerName] = useState("");
  const [answers,setAnswers]     = useState({});
  const [scoreA,setScoreA]       = useState("");
  const [scoreB,setScoreB]       = useState("");
  const [step,setStep]           = useState("home");
  const [saving,setSaving]       = useState(false);

  const [resDate,setResDate]     = useState(todayKey());
  const [preds,setPreds]         = useState([]);
  const [allResults,setAllResults] = useState({});
  const [loadingPreds,setLoadingPreds] = useState(false);
  const [fetchingResult,setFetchingResult] = useState({});

  const [lbData,setLbData]       = useState(null);
  const [loadingLb,setLoadingLb] = useState(false);

  const availDates = Object.keys(SCHEDULE).sort();

  // Auto-load results on mount and every 2 mins
  useEffect(()=>{
    const load=async()=>{ setAllResults(await loadAllResults()); };
    load();
    const t=setInterval(load,120000);
    return ()=>clearInterval(t);
  },[]);

  useEffect(()=>{
    if(tab==="results"){ loadPreds(resDate); }
    if(tab==="leaderboard"){ buildLeaderboard(); }
  },[tab,resDate]);

  async function loadPreds(date){
    setLoadingPreds(true);
    const data=await loadDayPreds(date);
    setPreds(data);
    setLoadingPreds(false);
  }

  // Auto-fetch a result from the web for a finished match
  async function triggerAutoFetch(date, match){
    const mk=matchKey(date,match);
    if(fetchingResult[mk]) return;
    setFetchingResult(p=>({...p,[mk]:true}));
    const result=await autoFetchResult(match,date);
    if(result){
      await saveResult(date,match,result);
      setAllResults(await loadAllResults());
    }
    setFetchingResult(p=>({...p,[mk]:false}));
  }

  async function buildLeaderboard(){
    setLoadingLb(true);
    const [allP, allR]=await Promise.all([loadAllPreds(), loadAllResults()]);
    const tally={};
    for(const pred of allP){
      const mk=matchKey(pred.date,pred.match);
      const res=allR[mk];
      const nm=pred.playerName;
      if(!tally[nm]) tally[nm]={name:nm,total:0,matches:0,scored:0,breakdown:[]};
      tally[nm].matches++;
      const pts=calcScore(pred,res);
      if(pts!==null){ tally[nm].total+=pts; tally[nm].scored++; tally[nm].breakdown.push({match:pred.match,date:pred.date,pts}); }
    }
    setLbData(Object.values(tally).sort((a,b)=>b.total-a.total));
    setLoadingLb(false);
  }

  function setAnswer(id,val){setAnswers(p=>({...p,[id]:val}));}
  const answeredCount=Object.keys(answers).filter(k=>QUESTIONS.some(q=>q.id===k)).length+(scoreA!==""&&scoreB!==""?1:0);
  const allAnswered=QUESTIONS.every(q=>q.id==="exact_score"?(scoreA!==""&&scoreB!==""):!!answers[q.id]);

  async function handleSubmit(){
    setSaving(true);
    await savePred(selDate,selMatch,playerName,answers,scoreA,scoreB);
    setSaving(false);
    setStep("done");
  }

  // ── Shared components ────────────────────────────────────────────────────
  const TabBar=()=>(
    <div style={{display:"flex",background:"#0D1525",borderBottom:`1px solid ${BORDER}`}}>
      {[["predict","⚽ Predict"],["results","📋 Results"],["leaderboard","🏅 Board"]].map(([t,l])=>(
        <button key={t} onClick={()=>setTab(t)} style={{
          flex:1,padding:"13px 4px",border:"none",background:"transparent",
          color:tab===t?"#fff":"#4A5568",fontWeight:tab===t?700:400,fontSize:13,
          borderBottom:tab===t?`2px solid ${ACCENT}`:"2px solid transparent",cursor:"pointer",
        }}>{l}</button>
      ))}
    </div>
  );

  const DateStrip=({value,onChange})=>(
    <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:14}}>
      {availDates.map(date=>{
        const [,m,d]=date.split("-");
        const isSel=date===value, isToday=date===todayKey();
        const hasPast=Object.values(SCHEDULE[date]||[]).some(isMatchOver);
        return(
          <button key={date} onClick={()=>onChange(date)} style={{
            flexShrink:0,padding:"6px 10px",borderRadius:8,minWidth:44,textAlign:"center",
            border:`1.5px solid ${isSel?ACCENT:BORDER}`,
            background:isSel?"#0D2E1E":"transparent",cursor:"pointer",
          }}>
            <div style={{color:isSel?ACCENT:"#4A5568",fontSize:9,fontWeight:600}}>
              {new Date(+date.split("-")[0],+m-1,+d).toLocaleDateString("en-US",{weekday:"short"}).toUpperCase()}
            </div>
            <div style={{color:isSel?ACCENT:"#8A9BBB",fontSize:15,fontWeight:700}}>{d}</div>
            {isToday&&<div style={{color:ACCENT,fontSize:8,fontWeight:700}}>TODAY</div>}
            {!isToday&&hasPast&&<div style={{color:"#4A5568",fontSize:8}}>✓</div>}
          </button>
        );
      })}
    </div>
  );

  // ── RESULTS TAB ───────────────────────────────────────────────────────────
  if(tab==="results"){
    const byMatch={};
    preds.forEach(p=>{
      const mk=matchKey(p.date,p.match);
      if(!byMatch[mk]) byMatch[mk]={match:p.match,preds:[]};
      byMatch[mk].preds.push(p);
    });
    const dayMatches=SCHEDULE[resDate]||[];

    return(
      <div style={{minHeight:"100vh",background:BG,fontFamily:"'Inter',system-ui,sans-serif"}}>
        <TabBar/>
        <div style={{maxWidth:620,margin:"0 auto",padding:"16px"}}>
          <div style={{textAlign:"center",padding:"14px 0 10px"}}>
            <h2 style={{color:"#fff",fontSize:20,fontWeight:800,margin:0}}>📋 Match Results & Bets</h2>
            <p style={{color:"#6B7A99",fontSize:12,margin:"3px 0 0"}}>Live scores auto-fetch after each match · scores update automatically</p>
          </div>
          <DateStrip value={resDate} onChange={d=>{setResDate(d);loadPreds(d);}}/>

          {loadingPreds?<div style={{textAlign:"center",padding:"40px",color:"#6B7A99"}}>Loading…</div>:(
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {dayMatches.map((match,mi)=>{
                const mk=matchKey(resDate,match);
                const result=allResults[mk];
                const over=isMatchOver(match);
                const kicked=hasKickedOff(match);
                const fetching=fetchingResult[mk];
                const matchPreds=(byMatch[mk]?.preds)||[];

                return(
                  <div key={mi} style={{background:CARD,border:`1.5px solid ${result?"#1A3A2A":kicked?"#2A1A0A":BORDER}`,borderRadius:16,overflow:"hidden"}}>
                    {/* Match header */}
                    <div style={{background:"#0D1525",borderBottom:`1px solid ${BORDER}`,padding:"12px 18px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                        <span style={{background:"#1A2A3A",color:"#6B7A99",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20}}>GRP {match.group}</span>
                        <span style={{color:"#4A5568",fontSize:11}}>{match.time} ET · {match.venue}</span>
                      </div>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:24}}>{flag(match.t1)}</span>
                          <span style={{color:"#fff",fontWeight:700,fontSize:15}}>{match.t1}</span>
                        </div>
                        {/* Score display */}
                        {result?(
                          <div style={{textAlign:"center"}}>
                            <div style={{color:ACCENT,fontWeight:900,fontSize:26}}>{result.scoreA}–{result.scoreB}</div>
                            <div style={{color:"#4A5568",fontSize:10,fontWeight:600}}>FINAL</div>
                          </div>
                        ):kicked?(
                          <div style={{textAlign:"center"}}>
                            {over?(
                              <button onClick={()=>triggerAutoFetch(resDate,match)} disabled={fetching} style={{
                                background:fetching?"#1A2A3A":"#0D2E1E",border:`1px solid ${fetching?BORDER:ACCENT}`,
                                color:fetching?"#6B7A99":ACCENT,borderRadius:8,padding:"6px 12px",fontSize:11,fontWeight:700,cursor:"pointer",
                              }}>
                                {fetching?"🔄 Fetching…":"🔄 Fetch Result"}
                              </button>
                            ):(
                              <div style={{color:RED,fontSize:11,fontWeight:700}}>🔴 Live</div>
                            )}
                          </div>
                        ):(
                          <div style={{color:"#4A5568",fontSize:13}}>vs</div>
                        )}
                        <div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"flex-end"}}>
                          <span style={{color:"#fff",fontWeight:700,fontSize:15}}>{match.t2}</span>
                          <span style={{fontSize:24}}>{flag(match.t2)}</span>
                        </div>
                      </div>
                      {/* Result details row */}
                      {result&&(
                        <div style={{marginTop:8,display:"flex",flexWrap:"wrap",gap:5}}>
                          {[
                            ["Winner",result.winner],["HT",result.halftime_winner],["Goals",result.total_goals],
                            ["Penalty",result.penalty],["Red Card",result.red_card],["Yellows",result.cards],
                          ].map(([l,v])=>(
                            <span key={l} style={{background:"#0A0E1A",border:`1px solid #1A3A2A`,borderRadius:5,padding:"2px 7px",fontSize:10,color:"#8A9BBB"}}>
                              <span style={{color:"#4A5568"}}>{l}: </span><span style={{color:ACCENT,fontWeight:600}}>{v}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Betters */}
                    {matchPreds.length===0?(
                      <div style={{padding:"14px 18px",color:"#4A5568",fontSize:12,textAlign:"center"}}>No predictions yet for this match</div>
                    ):matchPreds.map((p,i)=>{
                      const pts=result?calcScore(p,result):null;
                      return(
                        <div key={i} style={{borderBottom:`1px solid ${BORDER}`,padding:"11px 18px"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                              <span style={{color:ACCENT,fontWeight:700,fontSize:14}}>{p.playerName}</span>
                              <span style={{background:"#0D2E1E",color:ACCENT,fontSize:12,fontWeight:700,padding:"2px 8px",borderRadius:16}}>{p.scoreA}–{p.scoreB}</span>
                            </div>
                            {pts!==null&&(
                              <div style={{display:"flex",alignItems:"center",gap:4}}>
                                <span style={{background:pts>=15?"#1A3A0A":pts>=8?"#1A2A0A":"#1A0A0A",color:pts>=15?ACCENT:pts>=8?ACCENT:RED,fontSize:13,fontWeight:800,padding:"3px 10px",borderRadius:16}}>
                                  {pts} / {TOTAL_PTS} pts
                                </span>
                              </div>
                            )}
                          </div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                            {QUESTIONS.filter(q=>q.id!=="exact_score").map(q=>{
                              const val=p.answers[q.id];
                              const correct=result&&result[q.id]&&val===result[q.id];
                              const wrong=result&&result[q.id]&&val!==result[q.id];
                              return(
                                <span key={q.id} style={{
                                  background:correct?"#0D2E1E":wrong?"#1A0808":"#0A0E1A",
                                  border:`1px solid ${correct?"#1A3A2A":wrong?"#3A1A1A":BORDER}`,
                                  borderRadius:5,padding:"2px 7px",fontSize:11,
                                }}>
                                  <span style={{color:"#4A5568"}}>{q.label.split(" ").slice(-1)[0]}: </span>
                                  <span style={{color:correct?ACCENT:wrong?RED:"#CBD5E1",fontWeight:600}}>{val||"–"}</span>
                                  {correct&&<span style={{color:ACCENT,fontSize:9,marginLeft:2}}>✓</span>}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
          <div style={{height:32}}/>
        </div>
      </div>
    );
  }

  // ── LEADERBOARD TAB ───────────────────────────────────────────────────────
  if(tab==="leaderboard"){
    const MEDALS=["🥇","🥈","🥉"];
    return(
      <div style={{minHeight:"100vh",background:BG,fontFamily:"'Inter',system-ui,sans-serif"}}>
        <TabBar/>
        <div style={{maxWidth:560,margin:"0 auto",padding:"16px"}}>
          <div style={{textAlign:"center",padding:"18px 0 14px"}}>
            <div style={{color:ACCENT,fontSize:12,fontWeight:700,letterSpacing:1}}>BIKELER ADDA</div>
            <h2 style={{color:"#fff",fontSize:22,fontWeight:800,margin:"4px 0 2px"}}>🏅 Leaderboard</h2>
            <p style={{color:"#6B7A99",fontSize:12,margin:0}}>FIFA World Cup 2026 · All matches</p>
          </div>
          <button onClick={buildLeaderboard} style={{display:"block",margin:"0 auto 14px",background:"transparent",border:`1px solid ${BORDER}`,color:"#8A9BBB",borderRadius:8,padding:"6px 16px",fontSize:12,cursor:"pointer"}}>
            🔄 Refresh
          </button>
          {loadingLb?(
            <div style={{textAlign:"center",padding:"48px 0",color:"#6B7A99"}}>Calculating scores…</div>
          ):!lbData||lbData.length===0?(
            <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:"40px 24px",textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:8}}>📭</div>
              <p style={{color:"#6B7A99",margin:0}}>No scores yet. Predictions + completed matches needed.</p>
            </div>
          ):(
            <>
              {/* Top 3 podium */}
              {lbData.length>=3&&(
                <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:8,marginBottom:20}}>
                  {[lbData[1],lbData[0],lbData[2]].map((p,i)=>{
                    const rank=i===0?2:i===1?1:3;
                    const h=rank===1?100:rank===2?76:64;
                    return p?(
                      <div key={p.name} style={{textAlign:"center",flex:1}}>
                        <div style={{fontSize:rank===1?20:14,marginBottom:4}}>{MEDALS[rank-1]}</div>
                        <div style={{color:rank===1?GOLD:"#8A9BBB",fontWeight:700,fontSize:rank===1?15:13}}>{p.name}</div>
                        <div style={{
                          background:rank===1?"linear-gradient(180deg,#1A3A0A,#0D2E1E)":"#111827",
                          border:`2px solid ${rank===1?GOLD:BORDER}`,
                          borderRadius:"8px 8px 0 0",height:h,marginTop:6,
                          display:"flex",alignItems:"center",justifyContent:"center",
                        }}>
                          <div>
                            <div style={{color:rank===1?GOLD:ACCENT,fontWeight:900,fontSize:rank===1?22:17}}>{p.total}</div>
                            <div style={{color:"#4A5568",fontSize:10}}>pts</div>
                          </div>
                        </div>
                      </div>
                    ):null;
                  })}
                </div>
              )}
              {/* Full list */}
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {lbData.map((player,i)=>(
                  <div key={player.name} style={{
                    background:i===0?"linear-gradient(135deg,#1A2E1A,#0D1A0D)":CARD,
                    border:`1.5px solid ${i===0?GOLD:BORDER}`,
                    borderRadius:12,padding:"14px 18px",
                    display:"flex",alignItems:"center",gap:12,
                  }}>
                    <div style={{fontSize:i<3?22:16,minWidth:28,textAlign:"center"}}>
                      {i<3?MEDALS[i]:<span style={{color:"#4A5568",fontWeight:700,fontSize:13}}>#{i+1}</span>}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{color:i===0?GOLD:"#fff",fontWeight:700,fontSize:15}}>{player.name}</div>
                      <div style={{color:"#4A5568",fontSize:11,marginTop:2}}>
                        {player.scored} match{player.scored!==1?"es":""} scored · {player.matches} predicted
                      </div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{color:i===0?GOLD:ACCENT,fontWeight:900,fontSize:22}}>{player.total}</div>
                      <div style={{color:"#4A5568",fontSize:10}}>/ {player.scored*TOTAL_PTS} max</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{textAlign:"center",color:"#2D3A52",fontSize:11,marginTop:12}}>
                {TOTAL_PTS} pts max per match · updates when match results are fetched
              </div>
            </>
          )}
          <div style={{height:32}}/>
        </div>
      </div>
    );
  }

  // ── PREDICT: HOME ─────────────────────────────────────────────────────────
  if(step==="home"){
    const matches=SCHEDULE[selDate]||[];
    return(
      <div style={{minHeight:"100vh",background:BG,fontFamily:"'Inter',system-ui,sans-serif"}}>
        <TabBar/>
        <div style={{maxWidth:560,margin:"0 auto",padding:"16px"}}>
          <div style={{textAlign:"center",padding:"16px 0 12px"}}>
            <div style={{color:ACCENT,fontSize:12,fontWeight:700,letterSpacing:1.5}}>BIKELER ADDA</div>
            <h1 style={{color:"#fff",fontSize:21,fontWeight:800,margin:"4px 0 2px"}}>FIFA World Cup <span style={{color:ACCENT}}>2026</span></h1>
            <p style={{color:"#6B7A99",fontSize:12,margin:0}}>Group Stage · Pick a match</p>
          </div>
          <DateStrip value={selDate} onChange={setSelDate}/>
          <div style={{marginBottom:8}}>
            <span style={{color:"#8A9BBB",fontSize:11,fontWeight:600,letterSpacing:1}}>
              {fmtDate(selDate).toUpperCase()} · {matches.length} MATCH{matches.length!==1?"ES":""}
            </span>
          </div>
          {matches.length===0?(
            <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:"32px",textAlign:"center"}}>
              <p style={{color:"#6B7A99",margin:0}}>No matches on this day</p>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {matches.map((match,i)=>{
                const kicked=hasKickedOff(match);
                const result=allResults[matchKey(selDate,match)];
                return(
                  <button key={i} onClick={()=>{
                    if(kicked) return;
                    setSelMatch(match);setAnswers({});setScoreA("");setScoreB("");setStep("name");
                  }} style={{
                    background:CARD,border:`1.5px solid ${result?"#1A3A2A":kicked?"#2D1A1A":BORDER}`,
                    borderRadius:14,padding:"14px 18px",cursor:kicked?"not-allowed":"pointer",textAlign:"left",width:"100%",opacity:kicked?0.7:1,
                  }}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                      <span style={{background:"#1A2A3A",color:"#6B7A99",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20}}>GROUP {match.group}</span>
                      {result?<span style={{color:ACCENT,fontSize:11,fontWeight:700}}>✓ {result.scoreA}–{result.scoreB} FT</span>
                        :kicked?<span style={{color:RED,fontSize:11,fontWeight:700}}>🔴 Started · Locked</span>
                        :<span style={{color:"#4A5568",fontSize:11}}>🕐 {match.time} ET · {match.venue}</span>}
                    </div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
                        <span style={{fontSize:24}}>{flag(match.t1)}</span>
                        <span style={{color:"#fff",fontWeight:700,fontSize:14}}>{match.t1}</span>
                      </div>
                      <div style={{color:kicked?"#3A2020":ACCENT,fontWeight:800,fontSize:11,padding:"0 10px"}}>{kicked?"LOCKED":"PREDICT →"}</div>
                      <div style={{display:"flex",alignItems:"center",gap:8,flex:1,justifyContent:"flex-end"}}>
                        <span style={{color:"#fff",fontWeight:700,fontSize:14}}>{match.t2}</span>
                        <span style={{fontSize:24}}>{flag(match.t2)}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          <div style={{height:24}}/>
        </div>
      </div>
    );
  }

  // ── PREDICT: NAME ─────────────────────────────────────────────────────────
  if(step==="name"){
    const m=selMatch;
    return(
      <div style={{minHeight:"100vh",background:BG,fontFamily:"'Inter',system-ui,sans-serif"}}>
        <TabBar/>
        <div style={{maxWidth:440,margin:"0 auto",padding:"16px"}}>
          <button onClick={()=>setStep("home")} style={{background:"transparent",border:"none",color:"#6B7A99",fontSize:13,cursor:"pointer",padding:"10px 0",display:"block"}}>← Back</button>
          <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,padding:"18px 22px",marginBottom:14,textAlign:"center"}}>
            <span style={{background:"#1A2A3A",color:"#6B7A99",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20}}>GROUP {m.group} · {fmtDate(selDate)} · {m.time} ET</span>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16,marginTop:14}}>
              <div style={{textAlign:"center"}}><div style={{fontSize:32}}>{flag(m.t1)}</div><div style={{color:"#fff",fontWeight:700,fontSize:13,marginTop:4}}>{m.t1}</div></div>
              <div style={{color:"#4A5568",fontWeight:800,fontSize:15}}>VS</div>
              <div style={{textAlign:"center"}}><div style={{fontSize:32}}>{flag(m.t2)}</div><div style={{color:"#fff",fontWeight:700,fontSize:13,marginTop:4}}>{m.t2}</div></div>
            </div>
          </div>
          <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,padding:22}}>
            <label style={{color:"#8A9BBB",fontSize:12,fontWeight:600,letterSpacing:0.5,display:"block",marginBottom:8}}>YOUR NAME</label>
            <input value={playerName} onChange={e=>setPlayerName(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&playerName.trim()&&setStep("form")}
              placeholder="e.g. Ramesh" autoFocus
              style={{width:"100%",boxSizing:"border-box",background:"#0A0E1A",border:"1.5px solid #1F2D42",borderRadius:8,padding:"12px 14px",color:"#fff",fontSize:16,outline:"none"}}
            />
            <button onClick={()=>setStep("form")} disabled={!playerName.trim()} style={{
              marginTop:12,width:"100%",background:playerName.trim()?ACCENT:"#1F2D42",
              color:playerName.trim()?"#0A0E1A":"#4A5568",border:"none",borderRadius:10,padding:"13px 0",fontSize:15,fontWeight:700,cursor:playerName.trim()?"pointer":"not-allowed",
            }}>Start Predicting →</button>
          </div>
        </div>
      </div>
    );
  }

  // ── PREDICT: FORM ─────────────────────────────────────────────────────────
  if(step==="form"){
    const m=selMatch;
    return(
      <div style={{minHeight:"100vh",background:BG,fontFamily:"'Inter',system-ui,sans-serif"}}>
        <TabBar/>
        <div style={{maxWidth:560,margin:"0 auto",padding:"0 16px"}}>
          <div style={{position:"sticky",top:0,background:BG,zIndex:10,paddingTop:10,paddingBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:7}}>
              <button onClick={()=>setStep("home")} style={{background:"transparent",border:"none",color:"#6B7A99",fontSize:18,cursor:"pointer",padding:0}}>←</button>
              <div style={{flex:1,textAlign:"center"}}>
                <div style={{color:"#fff",fontWeight:800,fontSize:14}}>{flag(m.t1)} {m.t1} <span style={{color:"#4A5568"}}>vs</span> {m.t2} {flag(m.t2)}</div>
                <div style={{color:"#6B7A99",fontSize:11}}>{playerName} · Group {m.group} · {m.time} ET</div>
              </div>
              <span style={{color:ACCENT,fontSize:13,fontWeight:700,minWidth:32,textAlign:"right"}}>{answeredCount}/{QUESTIONS.length}</span>
            </div>
            <div style={{background:BORDER,borderRadius:4,height:3,overflow:"hidden"}}>
              <div style={{height:"100%",background:ACCENT,borderRadius:4,width:`${(answeredCount/QUESTIONS.length)*100}%`,transition:"width 0.3s"}}/>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:9,paddingTop:8}}>
            {QUESTIONS.map((q,i)=>{
              const answered=q.id==="exact_score"?(scoreA!==""&&scoreB!==""):!!answers[q.id];
              return(
                <div key={q.id} style={{background:CARD,borderRadius:14,padding:"14px 16px",border:`1.5px solid ${answered?"#1A3A2A":BORDER}`,transition:"border-color 0.2s"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                    <span style={{color:"#fff",fontWeight:600,fontSize:13}}><span style={{color:"#2D3A52",marginRight:7,fontSize:11}}>{i+1}.</span>{q.label}</span>
                    <span style={{background:answered?"#0D2E1E":"#1A2A3A",color:answered?ACCENT:"#4A5568",fontSize:11,fontWeight:700,padding:"2px 7px",borderRadius:20,whiteSpace:"nowrap"}}>{answered?"✓ ":""}{q.points}pts</span>
                  </div>
                  {q.type==="score"?(
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <ScoreBox value={scoreA} onChange={setScoreA} label={`${flag(m.t1)} ${m.t1}`} color={BLUE}/>
                      <span style={{color:"#6B7A99",fontWeight:700,fontSize:18}}>–</span>
                      <ScoreBox value={scoreB} onChange={setScoreB} label={`${flag(m.t2)} ${m.t2}`} color={RED}/>
                    </div>
                  ):(
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {q.options(m.t1,m.t2).map(opt=>{
                        const sel=answers[q.id]===opt;
                        return(
                          <button key={opt} onClick={()=>setAnswer(q.id,opt)} style={{
                            padding:"6px 12px",borderRadius:8,fontSize:13,cursor:"pointer",
                            border:`1.5px solid ${sel?ACCENT:BORDER}`,background:sel?"#0D2E1E":"transparent",
                            color:sel?ACCENT:"#8A9BBB",fontWeight:sel?700:400,
                          }}>{opt===m.t1?`${flag(m.t1)} `:opt===m.t2?`${flag(m.t2)} `:""}{opt}</button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <button onClick={handleSubmit} disabled={!allAnswered||saving} style={{
            marginTop:14,marginBottom:32,width:"100%",
            background:allAnswered?ACCENT:"#1F2D42",color:allAnswered?"#0A0E1A":"#4A5568",
            border:"none",borderRadius:12,padding:"15px 0",fontSize:16,fontWeight:800,
            cursor:allAnswered?"pointer":"not-allowed",transition:"all 0.2s",
          }}>
            {saving?"Saving…":allAnswered?"🔒 Lock In Predictions":`${QUESTIONS.length-answeredCount} question${QUESTIONS.length-answeredCount!==1?"s":""} left`}
          </button>
        </div>
      </div>
    );
  }

  // ── PREDICT: DONE ─────────────────────────────────────────────────────────
  if(step==="done"){
    const m=selMatch;
    const exactScore=`${scoreA}–${scoreB}`;
    const allFinal={...answers,exact_score:exactScore};
    return(
      <div style={{minHeight:"100vh",background:BG,fontFamily:"'Inter',system-ui,sans-serif"}}>
        <TabBar/>
        <div style={{maxWidth:560,margin:"0 auto",padding:"16px"}}>
          <div style={{textAlign:"center",padding:"26px 0 18px"}}>
            <div style={{fontSize:48}}>🏆</div>
            <h2 style={{color:"#fff",fontSize:22,fontWeight:800,margin:"8px 0 3px"}}>Locked in!</h2>
            <p style={{color:"#6B7A99",fontSize:13}}>{playerName} · {flag(m.t1)} {m.t1} vs {m.t2} {flag(m.t2)}</p>
          </div>
          <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,overflow:"hidden",marginBottom:12}}>
            <div style={{background:"linear-gradient(135deg,#0D2E1E,#0A1A0F)",borderBottom:`1px solid ${BORDER}`,padding:"14px 20px",textAlign:"center"}}>
              <div style={{color:ACCENT,fontSize:11,fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginBottom:5}}>Your Predicted Score</div>
              <div style={{fontSize:26,fontWeight:900}}>
                <span style={{color:BLUE}}>{flag(m.t1)} {m.t1}</span>
                <span style={{color:ACCENT,margin:"0 12px"}}>{exactScore}</span>
                <span style={{color:RED}}>{m.t2} {flag(m.t2)}</span>
              </div>
            </div>
            <div style={{padding:"3px 0"}}>
              {QUESTIONS.filter(q=>q.id!=="exact_score").map(q=>(
                <div key={q.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 20px",borderBottom:`1px solid ${BORDER}`}}>
                  <span style={{color:"#8A9BBB",fontSize:13}}>{q.label}</span>
                  <span style={{color:"#fff",fontWeight:600,fontSize:13}}>{allFinal[q.id]||"–"}</span>
                </div>
              ))}
            </div>
            <div style={{padding:"11px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{color:"#6B7A99",fontSize:13}}>Max possible</span>
              <span style={{color:ACCENT,fontWeight:800,fontSize:20}}>{TOTAL_PTS} pts</span>
            </div>
          </div>
          <div style={{background:"#0D1A0D",border:"1px solid #1A3A1A",borderRadius:10,padding:"10px 16px",marginBottom:12,textAlign:"center"}}>
            <p style={{color:ACCENT,fontSize:13,margin:0}}>✅ Saved! Match result auto-fetches after the game ends.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:28}}>
            <button onClick={()=>{setAnswers({});setScoreA("");setScoreB("");setStep("home");}} style={{background:"transparent",border:`1px solid ${BORDER}`,color:"#8A9BBB",borderRadius:10,padding:"12px 0",fontSize:14,cursor:"pointer"}}>🏠 Matches</button>
            <button onClick={()=>setTab("leaderboard")} style={{background:ACCENT,color:"#0A0E1A",border:"none",borderRadius:10,padding:"12px 0",fontSize:14,fontWeight:700,cursor:"pointer"}}>🏅 Leaderboard</button>
          </div>
        </div>
      </div>
    );
  }
}

function ScoreBox({value,onChange,label,color}){
  return(
    <div style={{flex:1,textAlign:"center"}}>
      <div style={{color,fontSize:11,fontWeight:600,marginBottom:5,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{label}</div>
      <input type="number" min="0" max="20" value={value} onChange={e=>onChange(e.target.value)} placeholder="0"
        style={{width:"100%",textAlign:"center",background:"#0A0E1A",border:`1.5px solid ${value!==""?color:"#1F2D42"}`,borderRadius:10,padding:"11px 0",color:"#fff",fontSize:26,fontWeight:800,outline:"none",boxSizing:"border-box"}}
      />
    </div>
  );
}
