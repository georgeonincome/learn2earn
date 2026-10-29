import{r as y,j as e,S as P,z as T}from"./index-BADBJMlb.js";const Y=`
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

  .mnl-root{
    --ink:#0E1014;--ink-2:#14171D;--ink-3:#1B1F27;
    --line:#2A2F3A;
    --paper:#F3EEE4;--paper-dim:#B7AF9F;--paper-faint:#7C776C;
    --gold:#E0A92B;--gold-deep:#C4901A;--gold-text:#E0A92B;--gold-soft:rgba(224,169,43,.12);
    --go:#2FB37A;--go-text:#5FD69F;--go-soft:rgba(47,179,122,.12);
    --red:#E05B4E;--red-text:#F08076;--red-soft:rgba(224,91,78,.12);
    --radius:14px;--maxw:1080px;
    background:var(--ink);color:var(--paper);
    font-family:"Inter",system-ui,sans-serif;font-size:16px;line-height:1.55;
    -webkit-font-smoothing:antialiased;overflow-x:hidden;min-height:100vh;
    background-image:radial-gradient(900px 460px at 82% -10%,rgba(224,169,43,.10),transparent 60%),radial-gradient(700px 400px at 2% 108%,rgba(47,179,122,.07),transparent 60%);
  }
  .mnl-root *{box-sizing:border-box;margin:0;padding:0}
  .mnl-root a{color:inherit;text-decoration:none}
  .mnl-root button{font:inherit;color:inherit}
  .mnl-root ::selection{background:var(--gold);color:#20160A}

  .mnl-root h1,.mnl-root h2,.mnl-root h3{font-family:"Fraunces",Georgia,serif;font-weight:600;line-height:1.1;letter-spacing:-.01em;color:var(--paper)}
  .mnl-root .wrap{max-width:var(--maxw);margin:0 auto;padding:0 22px}
  .mnl-root .eyebrow{font-family:"Space Mono",monospace;font-size:.72rem;letter-spacing:.22em;text-transform:uppercase;color:var(--gold)}
  .mnl-root .mono{font-family:"Space Mono",monospace}

  .mnl-root .btn{display:inline-flex;align-items:center;gap:.5rem;font-family:"Inter",sans-serif;font-weight:600;font-size:1rem;background:var(--gold);color:#20160A;padding:14px 26px;border-radius:999px;border:0;cursor:pointer;transition:transform .18s,background .18s,box-shadow .18s;box-shadow:0 10px 26px -12px rgba(224,169,43,.7);white-space:nowrap}
  .mnl-root .btn:hover{transform:translateY(-2px);background:#F0B838;box-shadow:0 16px 34px -12px rgba(224,169,43,.8)}
  .mnl-root .btn-sm{padding:11px 20px;font-size:.92rem}
  .mnl-root .btn-ghost{background:transparent;color:var(--paper);border:1px solid var(--line);box-shadow:none;font-weight:500}
  .mnl-root .btn-ghost:hover{background:var(--ink-3);border-color:var(--gold);transform:translateY(-2px)}

  .mnl-root .bar{position:sticky;top:0;z-index:40;background:rgba(14,16,20,.85);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
  .mnl-root .bar .wrap{display:flex;align-items:center;justify-content:space-between;height:64px;gap:16px}
  .mnl-root .brand{font-family:"Fraunces",serif;font-weight:600;font-size:1.15rem;color:var(--paper)}
  .mnl-root .brand span{color:var(--gold)}

  .mnl-root header.top{padding:54px 0 30px;text-align:center}
  .mnl-root header.top h1{font-size:clamp(2.1rem,5vw,3.2rem);margin:12px 0 14px}
  .mnl-root header.top .lede{color:var(--paper-dim);max-width:60ch;margin:0 auto;font-size:1.08rem}

  .mnl-root .grid{display:grid;grid-template-columns:.92fr 1.08fr;gap:26px;align-items:start;padding-bottom:40px}
  @media(max-width:880px){.mnl-root .grid{grid-template-columns:1fr}}

  .mnl-root .card{background:var(--ink-2);border:1px solid var(--line);border-radius:18px;padding:26px 24px;box-shadow:0 20px 50px -34px rgba(0,0,0,.6)}
  .mnl-root .card h2{font-size:1.3rem;margin-bottom:4px}
  .mnl-root .card .sub{color:var(--paper-dim);font-size:.9rem;margin-bottom:20px}

  .mnl-root .field{margin-bottom:18px}
  .mnl-root .field label{display:flex;justify-content:space-between;align-items:baseline;font-size:.9rem;color:var(--paper);font-weight:600;margin-bottom:7px}
  .mnl-root .field label .hint{font-weight:400;color:var(--paper-faint);font-family:"Space Mono",monospace;font-size:.72rem}
  .mnl-root .inputwrap{position:relative;display:flex;align-items:center}
  .mnl-root .inputwrap .pre{position:absolute;left:14px;font-family:"Space Mono",monospace;font-size:.86rem;color:var(--paper-faint);pointer-events:none}
  .mnl-root .inputwrap .suf{position:absolute;right:14px;font-family:"Space Mono",monospace;font-size:.86rem;color:var(--paper-faint);pointer-events:none}
  .mnl-root input[type=number]{width:100%;background:var(--ink-3);border:1px solid var(--line);border-radius:10px;padding:13px 15px;color:var(--paper);font-family:"Space Mono",monospace;font-size:1rem;transition:border-color .15s,box-shadow .15s}
  .mnl-root input.pad-l{padding-left:46px}
  .mnl-root input.pad-r{padding-right:44px}
  .mnl-root input[type=number]:focus{outline:none;border-color:var(--gold);box-shadow:0 0 0 3px rgba(224,169,43,.2)}
  .mnl-root .chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:9px}
  .mnl-root .chip{background:var(--ink-3);border:1px solid var(--line);border-radius:999px;padding:6px 13px;font-family:"Space Mono",monospace;font-size:.76rem;color:var(--paper-dim);cursor:pointer;transition:.15s}
  .mnl-root .chip:hover{border-color:var(--gold);color:var(--paper);background:var(--gold-soft)}

  .mnl-root .verdict{border-radius:16px;padding:22px 24px;margin-bottom:18px;border:1px solid var(--line);background:var(--ink-2)}
  .mnl-root .verdict .vlabel{font-family:"Space Mono",monospace;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;margin-bottom:8px;color:var(--paper-dim)}
  .mnl-root .verdict h3{font-size:1.35rem;line-height:1.25}
  .mnl-root .verdict h3 em{font-style:normal}
  .mnl-root .verdict.green{background:var(--go-soft);border-color:rgba(47,179,122,.4)} .mnl-root .verdict.green .vlabel,.mnl-root .verdict.green h3 em{color:var(--go-text)}
  .mnl-root .verdict.red{background:var(--red-soft);border-color:rgba(224,91,78,.4)} .mnl-root .verdict.red .vlabel,.mnl-root .verdict.red h3 em{color:var(--red-text)}
  .mnl-root .verdict.amber{background:var(--gold-soft);border-color:rgba(224,169,43,.4)} .mnl-root .verdict.amber .vlabel,.mnl-root .verdict.amber h3 em{color:var(--gold-text)}

  .mnl-root .stats{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .mnl-root .stat{background:var(--ink-2);border:1px solid var(--line);border-radius:12px;padding:16px}
  .mnl-root .stat .k{font-family:"Space Mono",monospace;font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--paper-faint)}
  .mnl-root .stat .v{font-family:"Fraunces",serif;font-size:1.7rem;font-weight:700;color:var(--paper);margin-top:4px;line-height:1}
  .mnl-root .stat .v.gold{color:var(--gold-text)} .mnl-root .stat .v.go{color:var(--go-text)} .mnl-root .stat .v.red{color:var(--red-text)}
  .mnl-root .stat .rng{font-family:"Space Mono",monospace;font-size:.72rem;color:var(--paper-faint);margin-top:6px}

  .mnl-root .maths{margin-top:16px;background:var(--ink-2);border:1px solid var(--line);border-radius:12px;padding:18px}
  .mnl-root .maths .mh{font-family:"Space Mono",monospace;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--gold-text);margin-bottom:12px}
  .mnl-root .mrow{display:flex;justify-content:space-between;align-items:baseline;padding:9px 0;border-bottom:1px dotted var(--line);gap:14px}
  .mnl-root .mrow:last-child{border-bottom:0}
  .mnl-root .mrow .ml{color:var(--paper-dim);font-size:.9rem}
  .mnl-root .mrow .ml small{display:block;color:var(--paper-faint);font-size:.74rem;margin-top:1px}
  .mnl-root .mrow .mv{font-family:"Fraunces",serif;font-weight:700;font-size:1.15rem;white-space:nowrap;color:var(--paper)}
  .mnl-root .mrow .mv.gold{color:var(--gold-text)}

  .mnl-root .disc{margin-top:16px;font-family:"Space Mono",monospace;font-size:.76rem;color:var(--paper-faint);line-height:1.6}
  .mnl-root .disc b{color:var(--paper-dim)}

  .mnl-root .cta{margin:10px 0 70px;background:radial-gradient(600px 300px at 50% 120%,rgba(224,169,43,.18),transparent 60%),var(--ink-2);border:1px solid var(--gold-deep);border-radius:20px;padding:40px 28px;text-align:center;box-shadow:0 24px 60px -36px rgba(224,169,43,.5)}
  .mnl-root .cta h2{font-size:clamp(1.5rem,3.5vw,2.1rem);max-width:22ch;margin:0 auto 10px}
  .mnl-root .cta p{color:var(--paper-dim);max-width:52ch;margin:0 auto 24px}
  .mnl-root footer{border-top:1px solid var(--line);padding:34px 0;color:var(--paper-faint);font-size:.85rem;text-align:center}
  .mnl-root footer .brand{font-size:1rem;margin-bottom:5px}
`,t=r=>"KES "+Math.round(r).toLocaleString(),c=r=>Math.round(r).toLocaleString(),O=(r,g={})=>{try{const n=window;typeof n.gtag=="function"&&n.gtag("event",r,g)}catch{}};function I(){const[r,g]=y.useState({budget:500,days:30,price:2500,margin:50,cpl:30,conv:10});y.useEffect(()=>{O("roas_planner_view")},[]);const n=s=>m=>g(i=>({...i,[s]:+m.target.value||0})),p=(s,m)=>g(i=>({...i,[s]:m})),a=y.useMemo(()=>{const s=r.budget||0,m=r.days||0,i=r.price||0,l=(r.margin||0)/100,d=r.cpl||0,f=(r.conv||0)/100,o=s*m,w=d>0?o/d:0,h=w*f,j=h*i,N=j*l-o,k=o>0?j/o:0,z=d>0?o/(d*1.5):0,S=d>0?o/(d*.7):0,F=z*(f*.7),E=S*(f*1.3),A=F*i,M=E*i,H=A*l-o,B=M*l-o,K=l>0?1/l:0,C=i*l,L=h>0?o/h:0;let u="amber",v="At these numbers",x=e.jsx(e.Fragment,{children:"Fill in your numbers to see the verdict."});if(h<=0||o<=0)x=e.jsx(e.Fragment,{children:"Add your budget, price and rates to see the verdict."});else{const R=L/(C||1);R<.85?(u="green",v="Looks profitable",x=e.jsxs(e.Fragment,{children:["At these numbers your ads would ",e.jsx("em",{children:"make money"}),". Estimated profit ",t(N)," on ",t(o)," spent, a ROAS of ",k.toFixed(2),"x."]})):R<=1.1?(u="amber",v="Roughly break even",x=e.jsxs(e.Fragment,{children:["At these numbers you would ",e.jsx("em",{children:"roughly break even"}),". You need cheaper leads or a better close rate to turn a clear profit."]})):(u="red",v="Losing money",x=e.jsxs(e.Fragment,{children:["At these numbers your ads would ",e.jsx("em",{children:"lose money"}),". Your cost per sale is above the most you can afford. Lower your cost per lead, lift your close rate, or raise your price or margin."]}))}return{spend:o,leads:w,sales:h,revenue:j,profit:N,roas:k,leadsLo:z,leadsHi:S,salesLo:F,salesHi:E,revLo:A,revHi:M,proLo:H,proHi:B,beRoas:K,maxCps:C,cps:L,cls:u,label:v,vtext:x}},[r]),b=s=>(s<0?"-":"")+t(Math.abs(s));return e.jsxs(e.Fragment,{children:[e.jsx(P,{title:"The Meta Ads ROAS Planner — Free Tool",description:"Free planner for Kenyan business owners. Put in your budget, price and rates and see whether your Meta ads would actually make money before you spend a shilling.",url:"https://click2skill.com/roas-planner"}),e.jsx("style",{children:Y}),e.jsxs("div",{className:"mnl-root",children:[e.jsx("div",{className:"bar",children:e.jsxs("div",{className:"wrap",children:[e.jsxs("div",{className:"brand",children:["Click",e.jsx("span",{children:"2"}),"Skill"]}),e.jsx(T,{className:"btn btn-sm",to:"/metaads4",children:"Enrol in the class"})]})}),e.jsx("header",{className:"top",children:e.jsxs("div",{className:"wrap",children:[e.jsx("span",{className:"eyebrow",children:"Free tool"}),e.jsx("h1",{children:"The Meta Ads ROAS Planner"}),e.jsx("p",{className:"lede",children:"Put in your numbers and see whether your ads would actually make money, and what they would need to hit. These are planning estimates, not promises."})]})}),e.jsxs("div",{className:"wrap",children:[e.jsxs("div",{className:"grid",children:[e.jsxs("div",{className:"card",children:[e.jsx("h2",{children:"Your numbers"}),e.jsx("div",{className:"sub",children:"Change anything. The results update as you type. Defaults are typical Kenyan starting points."}),e.jsxs("div",{className:"field",children:[e.jsxs("label",{children:["Daily budget ",e.jsx("span",{className:"hint",children:"KES per day"})]}),e.jsxs("div",{className:"inputwrap",children:[e.jsx("span",{className:"pre",children:"KES"}),e.jsx("input",{type:"number",className:"pad-l",value:r.budget,min:0,step:50,onChange:n("budget")})]}),e.jsx("div",{className:"chips",children:[300,500,1e3,2e3,5e3].map(s=>e.jsx("span",{className:"chip",onClick:()=>p("budget",s),children:s.toLocaleString()},s))})]}),e.jsxs("div",{className:"field",children:[e.jsxs("label",{children:["Number of days ",e.jsx("span",{className:"hint",children:"how long you run it"})]}),e.jsx("div",{className:"inputwrap",children:e.jsx("input",{type:"number",value:r.days,min:1,step:1,onChange:n("days")})}),e.jsx("div",{className:"chips",children:[7,14,30].map(s=>e.jsxs("span",{className:"chip",onClick:()=>p("days",s),children:[s," days"]},s))})]}),e.jsxs("div",{className:"field",children:[e.jsxs("label",{children:["Price per sale ",e.jsx("span",{className:"hint",children:"what one customer pays"})]}),e.jsxs("div",{className:"inputwrap",children:[e.jsx("span",{className:"pre",children:"KES"}),e.jsx("input",{type:"number",className:"pad-l",value:r.price,min:0,step:100,onChange:n("price")})]})]}),e.jsxs("div",{className:"field",children:[e.jsxs("label",{children:["Profit margin ",e.jsx("span",{className:"hint",children:"profit % before ad cost"})]}),e.jsxs("div",{className:"inputwrap",children:[e.jsx("input",{type:"number",className:"pad-r",value:r.margin,min:1,max:100,step:5,onChange:n("margin")}),e.jsx("span",{className:"suf",children:"%"})]})]}),e.jsxs("div",{className:"field",children:[e.jsxs("label",{children:["Cost per lead or message ",e.jsx("span",{className:"hint",children:"what you pay per enquiry"})]}),e.jsxs("div",{className:"inputwrap",children:[e.jsx("span",{className:"pre",children:"KES"}),e.jsx("input",{type:"number",className:"pad-l",value:r.cpl,min:1,step:5,onChange:n("cpl")})]}),e.jsxs("div",{className:"chips",children:[e.jsx("span",{className:"chip",onClick:()=>p("cpl",10),children:"WhatsApp ~10"}),e.jsx("span",{className:"chip",onClick:()=>p("cpl",30),children:"Typical ~30"}),e.jsx("span",{className:"chip",onClick:()=>p("cpl",80),children:"Higher ~80"})]})]}),e.jsxs("div",{className:"field",style:{marginBottom:0},children:[e.jsxs("label",{children:["Lead to sale rate ",e.jsx("span",{className:"hint",children:"% of enquiries who buy"})]}),e.jsxs("div",{className:"inputwrap",children:[e.jsx("input",{type:"number",className:"pad-r",value:r.conv,min:1,max:100,step:1,onChange:n("conv")}),e.jsx("span",{className:"suf",children:"%"})]})]})]}),e.jsxs("div",{children:[e.jsxs("div",{className:`verdict ${a.cls}`,children:[e.jsx("div",{className:"vlabel",children:a.label}),e.jsx("h3",{children:a.vtext})]}),e.jsxs("div",{className:"stats",children:[e.jsxs("div",{className:"stat",children:[e.jsx("div",{className:"k",children:"Total ad spend"}),e.jsx("div",{className:"v gold",children:t(a.spend)})]}),e.jsxs("div",{className:"stat",children:[e.jsx("div",{className:"k",children:"Estimated ROAS"}),e.jsxs("div",{className:`v ${a.roas>=a.beRoas&&a.beRoas>0?"go":a.spend>0?"red":""}`,children:[a.roas.toFixed(2),"x"]}),e.jsxs("div",{className:"rng",children:["break even at ",a.beRoas.toFixed(2),"x"]})]}),e.jsxs("div",{className:"stat",children:[e.jsx("div",{className:"k",children:"Estimated leads"}),e.jsx("div",{className:"v",children:c(a.leads)}),e.jsxs("div",{className:"rng",children:["range ",c(a.leadsLo)," to ",c(a.leadsHi)]})]}),e.jsxs("div",{className:"stat",children:[e.jsx("div",{className:"k",children:"Estimated sales"}),e.jsx("div",{className:"v",children:c(a.sales)}),e.jsxs("div",{className:"rng",children:["range ",c(a.salesLo)," to ",c(a.salesHi)]})]}),e.jsxs("div",{className:"stat",children:[e.jsx("div",{className:"k",children:"Estimated revenue"}),e.jsx("div",{className:"v",children:t(a.revenue)}),e.jsxs("div",{className:"rng",children:["range ",t(a.revLo)," to ",t(a.revHi)]})]}),e.jsxs("div",{className:"stat",children:[e.jsx("div",{className:"k",children:"Estimated profit"}),e.jsx("div",{className:`v ${a.profit>0?"go":a.profit<0?"red":""}`,children:b(a.profit)}),e.jsxs("div",{className:"rng",children:["range ",b(a.proLo)," to ",b(a.proHi)]})]})]}),e.jsxs("div",{className:"maths",children:[e.jsx("div",{className:"mh",children:"The honest maths (this part is not a guess)"}),e.jsxs("div",{className:"mrow",children:[e.jsxs("div",{className:"ml",children:["Break even ROAS",e.jsx("small",{children:"revenue you need for every 1 you spend, just to not lose money"})]}),e.jsxs("div",{className:"mv gold",children:[a.beRoas.toFixed(2),"x"]})]}),e.jsxs("div",{className:"mrow",children:[e.jsxs("div",{className:"ml",children:["Most you can pay per sale",e.jsx("small",{children:"spend more than this to get a customer and you lose money"})]}),e.jsx("div",{className:"mv",children:t(a.maxCps)})]}),e.jsxs("div",{className:"mrow",children:[e.jsxs("div",{className:"ml",children:["Your estimated cost per sale",e.jsx("small",{children:"what these numbers would cost you to get one customer"})]}),e.jsx("div",{className:"mv",children:a.sales>0?t(a.cps):"—"})]})]}),e.jsxs("p",{className:"disc",children:[e.jsx("b",{children:"Read this."})," The two numbers in the honest maths box are pure arithmetic and always true. The leads, sales, revenue and profit are estimates only. Real cost per lead and conversion swing a lot by offer, audience and market, so treat these as a plan and a range, never a promise. This is exactly the thinking the class teaches you to do before you spend."]})]})]}),e.jsxs("div",{className:"cta",children:[e.jsx("span",{className:"eyebrow",children:"You did the maths. Now run the ads."}),e.jsx("h2",{children:"Want to hit these numbers for real?"}),e.jsx("p",{children:"The planner shows you the target. The class shows you how to actually run the ads that get there, step by step, on your own screen."}),e.jsx(T,{className:"btn",to:"/metaads4",children:"Enrol now — KES 2,490"})]})]}),e.jsxs("footer",{children:[e.jsxs("div",{className:"brand",children:["Click",e.jsx("span",{style:{color:"var(--gold-text)"},children:"2"}),"Skill"]}),"Learn the skills that pay. Nairobi, Kenya.  ·  This tool gives planning estimates, not guaranteed results."]})]})]})}export{I as default};
