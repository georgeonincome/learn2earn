import{r as i,j as e,X as L,M as A,d as V,c as T,s as q,L as Z,h as X,a as H,bk as U}from"./index-BADBJMlb.js";import{l as J}from"./loadPaystack-BDgsr8MV.js";import{A as D}from"./index-CDm3UZyO.js";import{m as $}from"./proxy-CYaR7PyS.js";import{T as G}from"./triangle-alert-BKl2P-bq.js";import{R as Q}from"./refresh-cw-evxiDEAT.js";import{C as ee}from"./copy-ITMoqWIY.js";import{L as M}from"./lock-UbyqkSBP.js";import{e as se,c as ae}from"./metaPixel-Dy9nrdR3.js";const te=({isOpen:d,onClose:p,onRetryPaystack:b,courseName:x,price:m,currency:g="KES",studentEmail:u=""})=>{const[l,j]=i.useState(null),[t,h]=i.useState("buy-goods"),c=g==="KES",k=async(s,a)=>{try{await navigator.clipboard.writeText(s)}catch{const o=document.createElement("textarea");o.value=s,o.style.position="fixed",o.style.opacity="0",document.body.appendChild(o),o.select(),document.execCommand("copy"),document.body.removeChild(o)}j(a),T.success(`${a} copied!`),setTimeout(()=>j(null),2e3)},r=({text:s,label:a})=>e.jsxs("button",{onClick:()=>k(s,a),className:"inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-medium transition-colors",children:[l===a?e.jsx(V,{className:"w-3 h-3"}):e.jsx(ee,{className:"w-3 h-3"}),l===a?"Copied":"Copy"]}),v=encodeURIComponent(`Hi Elvis, I've made an M-Pesa payment for the ${x} course.

Email: ${u||"[YOUR EMAIL]"}
Amount: KES ${m.toLocaleString()}
Payment Method: M-Pesa

Please confirm my enrollment. Thank you!`),f=()=>{p(),setTimeout(()=>b(),300)};return e.jsx(D,{children:d&&e.jsx($.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm",onClick:p,children:e.jsxs($.div,{initial:{opacity:0,scale:.96,y:16},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.96,y:16},transition:{duration:.25,ease:[.16,1,.3,1]},className:"w-full max-w-[420px] max-h-[90vh] overflow-y-auto bg-[#111318] border border-gray-700/50 rounded-2xl relative shadow-2xl",onClick:s=>s.stopPropagation(),children:[e.jsx("button",{onClick:p,className:"absolute top-3 right-3 text-gray-400 hover:text-white transition-colors p-1 z-10",children:e.jsx(L,{className:"w-4 h-4"})}),e.jsxs("div",{className:"p-5 space-y-4",children:[e.jsxs("div",{className:"text-center space-y-1.5 pr-6",children:[e.jsx("div",{className:"w-9 h-9 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center text-lg",children:"💳"}),e.jsx("h2",{className:"text-lg font-bold text-white leading-tight",children:"Having trouble paying?"}),e.jsx("p",{className:"text-xs text-gray-400 leading-relaxed",children:c?"Complete your enrollment with M-Pesa in a few taps.":"Here are some tips to complete your payment."})]}),c?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex items-center justify-between rounded-xl bg-white/5 border border-gray-700/40 px-4 py-3",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-[10px] uppercase tracking-wider text-gray-500 font-semibold",children:"Amount to pay"}),e.jsxs("p",{className:"text-white font-bold text-xl font-mono",children:["KES ",m.toLocaleString()]})]}),e.jsx(r,{text:m.toString(),label:"Amount"})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-1 p-1 rounded-xl bg-white/5 border border-gray-700/40",children:[e.jsx("button",{onClick:()=>h("buy-goods"),className:`text-xs font-semibold py-2 rounded-lg transition-colors ${t==="buy-goods"?"bg-emerald-500 text-[#111318]":"text-gray-400 hover:text-white"}`,children:"Buy Goods"}),e.jsx("button",{onClick:()=>h("send-money"),className:`text-xs font-semibold py-2 rounded-lg transition-colors ${t==="send-money"?"bg-emerald-500 text-[#111318]":"text-gray-400 hover:text-white"}`,children:"Send Money"})]}),e.jsx("div",{className:"rounded-xl border border-gray-700/50 bg-[#0D0F14] overflow-hidden",children:t==="buy-goods"?e.jsxs("div",{className:"p-4 space-y-3",children:[e.jsx(y,{n:1,children:"M-Pesa → Lipa na M-Pesa → Buy Goods & Services"}),e.jsx(y,{n:2,children:"Enter Till Number & amount, then your PIN"}),e.jsxs("div",{className:"flex items-center justify-between gap-3 bg-white/5 rounded-lg px-3 py-2.5",children:[e.jsxs("div",{className:"min-w-0",children:[e.jsx("p",{className:"text-[10px] text-gray-500 uppercase tracking-wider font-semibold",children:"Till Number"}),e.jsx("p",{className:"text-white font-bold text-base tracking-wider font-mono truncate",children:"9264815"}),e.jsx("p",{className:"text-emerald-400 text-[10px] font-medium",children:"TERA CREATIONS"})]}),e.jsx(r,{text:"9264815",label:"Till Number"})]}),e.jsxs(y,{n:3,children:["Confirm on"," ",e.jsx("a",{href:`https://wa.me/254758991116?text=${v}`,target:"_blank",rel:"noopener noreferrer",className:"text-emerald-400 hover:underline",children:"WhatsApp"})]})]}):e.jsxs("div",{className:"p-4 space-y-3",children:[e.jsx(y,{n:1,children:"M-Pesa → Send Money"}),e.jsx(y,{n:2,children:"Enter number, amount & your PIN"}),e.jsxs("div",{className:"flex items-center justify-between gap-3 bg-white/5 rounded-lg px-3 py-2.5",children:[e.jsxs("div",{className:"min-w-0",children:[e.jsx("p",{className:"text-[10px] text-gray-500 uppercase tracking-wider font-semibold",children:"Phone Number"}),e.jsx("p",{className:"text-white font-bold text-base tracking-wider font-mono truncate",children:"0758 991 116"}),e.jsx("p",{className:"text-emerald-400 text-[10px] font-medium",children:"ELVIS GITAU"})]}),e.jsx(r,{text:"0758991116",label:"Phone Number"})]}),e.jsxs(y,{n:3,children:["Confirm on"," ",e.jsx("a",{href:`https://wa.me/254758991116?text=${v}`,target:"_blank",rel:"noopener noreferrer",className:"text-emerald-400 hover:underline",children:"WhatsApp"})]})]})}),e.jsxs("a",{href:`https://wa.me/254758991116?text=${v}`,target:"_blank",rel:"noopener noreferrer",className:"flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm transition-colors",children:[e.jsx(A,{className:"w-4 h-4"}),"Confirm Payment on WhatsApp"]})]}):e.jsxs("div",{className:"rounded-xl border border-gray-700/50 bg-[#0D0F14] p-4 space-y-3",children:[e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx(G,{className:"w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5"}),e.jsxs("div",{className:"space-y-2 text-sm text-gray-300",children:[e.jsx("p",{className:"font-medium text-white text-sm",children:"Try these steps:"}),e.jsxs("ul",{className:"space-y-1.5 list-disc list-inside text-xs",children:[e.jsx("li",{children:"Use a different card (Visa or Mastercard)"}),e.jsx("li",{children:"Ensure international payments are enabled"}),e.jsx("li",{children:"Try a different browser (Edge recommended)"})]})]})]}),e.jsxs("a",{href:`https://wa.me/254758991116?text=${encodeURIComponent(`Hi Elvis, I'm having trouble paying for ${x}. Can you help?`)}`,target:"_blank",rel:"noopener noreferrer",className:"flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm transition-colors",children:[e.jsx(A,{className:"w-4 h-4"}),"Contact Support on WhatsApp"]})]}),e.jsxs("div",{className:"flex items-center justify-between gap-3 pt-1",children:[e.jsxs("button",{onClick:f,className:"flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-gray-600 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors",children:[e.jsx(Q,{className:"w-3.5 h-3.5"}),"Try Paystack"]}),c&&e.jsxs("p",{className:"text-[10px] text-gray-500 text-right leading-tight",children:["Confirmed on WhatsApp?",e.jsx("br",{}),"We'll enroll you in ~30 min."]})]})]})]})})})},y=({n:d,children:p})=>e.jsxs("div",{className:"flex items-start gap-2 text-sm text-gray-300",children:[e.jsx("span",{className:"flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] flex items-center justify-center font-bold mt-0.5",children:d}),e.jsx("span",{className:"leading-relaxed",children:p})]}),ie="9b3d6b37-f5af-4318-b66f-c79e67b4eedb",F=d=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d),K=d=>/^(\+254|07|01)\d{7,10}$/.test(d.replace(/\s/g,"")),ne=({open:d,onClose:p,onSuccess:b,price:x,planLabel:m,source:g="cta_unknown",cohortId:u=ie})=>{const[l,j]=i.useState(""),[t,h]=i.useState(""),[c,k]=i.useState(""),[r,v]=i.useState({}),[f,s]=i.useState(!1),[a,o]=i.useState({}),[O,C]=i.useState(!1),z=i.useCallback(()=>{const n={};return(!l.trim()||l.trim().length<2)&&(n.name="Please enter your full name"),F(t.trim())||(n.email="Please enter a valid email"),K(c.trim().replace(/\s/g,""))||(n.phone="Enter a valid phone (07XX or +254...)"),v(n),Object.keys(n).length===0},[l,t,c]),I=l.trim().length>=2&&F(t.trim())&&K(c.trim().replace(/\s/g,"")),P=i.useCallback(async()=>{if(o({name:!0,email:!0,phone:!0}),!z())return;if(typeof window.PaystackPop>"u")try{await J()}catch{T.error("Payment system unavailable. Try M-Pesa instead."),C(!0);return}const n="pk_live_c0ab1725601d96c967d3158eed16099234dcb8c9";s(!0);const _=`VIBE-${Date.now()}-${Math.floor(Math.random()*1e6)}`;window.PaystackPop.setup({key:n,email:t.trim(),amount:x*100,currency:"KES",ref:_,channels:["mobile_money","card"],metadata:{custom_fields:[{display_name:"Event",variable_name:"event",value:"vibe-coding-april-2026"},{display_name:"Name",variable_name:"customer_name",value:l.trim()},{display_name:"Phone",variable_name:"phone",value:c.trim()},{display_name:"Plan",variable_name:"plan",value:m},{display_name:"Source CTA",variable_name:"source",value:g}],product_type:"vibe_coding_bootcamp",cohort_id:u,source:g,customer_name:l.trim(),customer_email:t.trim(),phone:c.trim(),price:x,currency:"KES"},callback:()=>{s(!1),q.functions.invoke("send-vcb-confirmation",{body:{email:t.trim(),name:l.trim(),phone:c.trim(),reference:_,plan:m,amount:x,source:g,cohort_id:u}}).catch(Y=>console.error("VCB confirmation email failed:",Y)),b({name:l.trim(),email:t.trim(),phone:c.trim(),reference:_})},onClose:()=>{s(!1),C(!0)}}).openIframe()},[l,t,c,x,m,g,u,z,b]),S=n=>{o(_=>({..._,[n]:!0})),z()},E=n=>`w-full bg-[#141410] border ${a[n]&&r[n]?"border-red-500":"border-gray-700"} rounded-lg px-4 py-3.5 text-white placeholder-gray-500 text-[15px] outline-none focus:border-[#00ff88] transition-colors`;return e.jsx(D,{children:d&&e.jsxs($.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm",onClick:p,children:[e.jsxs($.div,{initial:{opacity:0,scale:.95,y:20},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.95,y:20},transition:{duration:.3,ease:[.16,1,.3,1]},className:"w-full max-w-[440px] max-h-[90vh] overflow-y-auto bg-[#0A0A0A] border border-gray-800 rounded-2xl p-6 sm:p-8 relative",onClick:n=>n.stopPropagation(),children:[e.jsx("button",{onClick:p,className:"absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1 z-10",children:e.jsx(L,{className:"w-5 h-5"})}),e.jsxs("div",{className:"text-center mb-6",children:[e.jsx("h2",{className:"font-bold text-[22px] text-white",children:"Join the Vibe Coding Bootcamp"}),e.jsxs("p",{className:"text-[0.7rem] text-gray-500 uppercase tracking-wider mt-1",style:{fontFamily:"'Space Mono', monospace"},children:[m," · KES ",x.toLocaleString()]})]}),e.jsxs("div",{className:"space-y-4 mb-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"font-semibold text-[13px] text-gray-200 block mb-1.5",children:"Full Name"}),e.jsx("input",{type:"text",value:l,onChange:n=>j(n.target.value),onBlur:()=>S("name"),placeholder:"Enter your full name",className:E("name")}),a.name&&r.name&&e.jsx("p",{className:"text-[12px] text-red-500 mt-1",children:r.name})]}),e.jsxs("div",{children:[e.jsx("label",{className:"font-semibold text-[13px] text-gray-200 block mb-1.5",children:"Email Address"}),e.jsx("input",{type:"email",value:t,onChange:n=>h(n.target.value),onBlur:()=>S("email"),placeholder:"you@example.com",className:E("email")}),a.email&&r.email&&e.jsx("p",{className:"text-[12px] text-red-500 mt-1",children:r.email})]}),e.jsxs("div",{children:[e.jsx("label",{className:"font-semibold text-[13px] text-gray-200 block mb-1.5",children:"Phone Number (M-Pesa)"}),e.jsx("input",{type:"tel",value:c,onChange:n=>k(n.target.value),onBlur:()=>S("phone"),placeholder:"07XX XXX XXX",className:E("phone")}),a.phone&&r.phone&&e.jsx("p",{className:"text-[12px] text-red-500 mt-1",children:r.phone})]})]}),e.jsx("button",{onClick:P,disabled:!I||f,className:`w-full uppercase font-bold text-sm tracking-wider h-[52px] flex items-center justify-center gap-2 transition-all rounded-lg mb-3 ${I&&!f?"bg-[#00ff88] text-black hover:bg-[#00dd77]":"bg-gray-700 text-gray-400 cursor-not-allowed"}`,style:{fontFamily:"'Space Mono', monospace"},children:f?e.jsxs(e.Fragment,{children:[e.jsx(Z,{className:"w-5 h-5 animate-spin"})," Processing..."]}):e.jsxs(e.Fragment,{children:[e.jsx(M,{className:"w-4 h-4"})," Pay KES ",x.toLocaleString()," ",e.jsx(X,{className:"w-4 h-4"})]})}),e.jsxs("p",{className:"text-[0.65rem] text-gray-500 text-center mt-3 flex items-center justify-center gap-1.5 uppercase tracking-wider",style:{fontFamily:"'Space Mono', monospace"},children:[e.jsx(M,{className:"w-3 h-3"})," Secure Checkout · M-Pesa · Paystack"]})]}),e.jsx(te,{isOpen:O,onClose:()=>C(!1),onRetryPaystack:()=>P(),courseName:"Vibe Coding Bootcamp - April 2026",price:x,currency:"KES",studentEmail:t})]})})},re=1,oe="de68d666-337b-4aab-952b-72fd00306edb",ce="7466534f-3a0b-4ec8-959e-8eda1a6c6751",le="/__l5e/assets-v1/de68d666-337b-4aab-952b-72fd00306edb/vc-01.jpg",de="a/v1/7466534f-3a0b-4ec8-959e-8eda1a6c6751/de68d666-337b-4aab-952b-72fd00306edb/vc-01.jpg",pe="vc-01.jpg",xe=84997,me="image/jpeg",he="2026-09-07T08:33:49Z",ge={version:re,asset_id:oe,project_id:ce,url:le,r2_key:de,original_filename:pe,size:xe,content_type:me,created_at:he},fe=1,ue="7a3229fb-4cd2-4df6-bcec-818d7a10bdac",ve="7466534f-3a0b-4ec8-959e-8eda1a6c6751",be="/__l5e/assets-v1/7a3229fb-4cd2-4df6-bcec-818d7a10bdac/vc-02.jpg",je="a/v1/7466534f-3a0b-4ec8-959e-8eda1a6c6751/7a3229fb-4cd2-4df6-bcec-818d7a10bdac/vc-02.jpg",ye="vc-02.jpg",we=60133,ke="image/jpeg",_e="2026-09-07T08:33:54Z",Ne={version:fe,asset_id:ue,project_id:ve,url:be,r2_key:je,original_filename:ye,size:we,content_type:ke,created_at:_e},$e=1,Ce="4245b4db-75c6-44d9-a7b7-211fae9ef72e",ze="7466534f-3a0b-4ec8-959e-8eda1a6c6751",Se="/__l5e/assets-v1/4245b4db-75c6-44d9-a7b7-211fae9ef72e/vc-03.jpg",Ee="a/v1/7466534f-3a0b-4ec8-959e-8eda1a6c6751/4245b4db-75c6-44d9-a7b7-211fae9ef72e/vc-03.jpg",Te="vc-03.jpg",Ie=71277,Pe="image/jpeg",Ae="2026-09-07T08:34:01Z",Me={version:$e,asset_id:Ce,project_id:ze,url:Se,r2_key:Ee,original_filename:Te,size:Ie,content_type:Pe,created_at:Ae},Fe=1,Ke="3d9f1a70-ff76-4f08-ab0c-c639c8429c96",Be="7466534f-3a0b-4ec8-959e-8eda1a6c6751",Re="/__l5e/assets-v1/3d9f1a70-ff76-4f08-ab0c-c639c8429c96/vc-04.jpg",We="a/v1/7466534f-3a0b-4ec8-959e-8eda1a6c6751/3d9f1a70-ff76-4f08-ab0c-c639c8429c96/vc-04.jpg",Le="vc-04.jpg",De=56819,Oe="image/jpeg",Ye="2026-09-07T08:34:07Z",Ve={version:Fe,asset_id:Ke,project_id:Be,url:Re,r2_key:We,original_filename:Le,size:De,content_type:Oe,created_at:Ye},qe=1,Ze="0edc88e2-4319-4108-8e2f-86dcc06a0f21",Xe="7466534f-3a0b-4ec8-959e-8eda1a6c6751",He="/__l5e/assets-v1/0edc88e2-4319-4108-8e2f-86dcc06a0f21/vc-05.jpg",Ue="a/v1/7466534f-3a0b-4ec8-959e-8eda1a6c6751/0edc88e2-4319-4108-8e2f-86dcc06a0f21/vc-05.jpg",Je="vc-05.jpg",Ge=70328,Qe="image/jpeg",es="2026-09-07T08:34:11Z",ss={version:qe,asset_id:Ze,project_id:Xe,url:He,r2_key:Ue,original_filename:Je,size:Ge,content_type:Qe,created_at:es},as=1,ts="544175b9-5ce3-4e8e-a919-9a1f61a82129",is="7466534f-3a0b-4ec8-959e-8eda1a6c6751",ns="/__l5e/assets-v1/544175b9-5ce3-4e8e-a919-9a1f61a82129/vc-06.jpg",rs="a/v1/7466534f-3a0b-4ec8-959e-8eda1a6c6751/544175b9-5ce3-4e8e-a919-9a1f61a82129/vc-06.jpg",os="vc-06.jpg",cs=74009,ls="image/jpeg",ds="2026-09-07T08:34:15Z",ps={version:as,asset_id:ts,project_id:is,url:ns,r2_key:rs,original_filename:os,size:cs,content_type:ls,created_at:ds},xs=1,ms="f96584fb-0b53-4c79-8330-00bf3ddb0ed1",hs="7466534f-3a0b-4ec8-959e-8eda1a6c6751",gs="/__l5e/assets-v1/f96584fb-0b53-4c79-8330-00bf3ddb0ed1/vc-07.jpg",fs="a/v1/7466534f-3a0b-4ec8-959e-8eda1a6c6751/f96584fb-0b53-4c79-8330-00bf3ddb0ed1/vc-07.jpg",us="vc-07.jpg",vs=70227,bs="image/jpeg",js="2026-09-07T08:34:22Z",ys={version:xs,asset_id:ms,project_id:hs,url:gs,r2_key:fs,original_filename:us,size:vs,content_type:bs,created_at:js},ws=1,ks="24b7f06f-15ea-4e04-b453-2ffd655e3d0f",_s="7466534f-3a0b-4ec8-959e-8eda1a6c6751",Ns="/__l5e/assets-v1/24b7f06f-15ea-4e04-b453-2ffd655e3d0f/vc-08.jpg",$s="a/v1/7466534f-3a0b-4ec8-959e-8eda1a6c6751/24b7f06f-15ea-4e04-b453-2ffd655e3d0f/vc-08.jpg",Cs="vc-08.jpg",zs=61627,Ss="image/jpeg",Es="2026-09-07T08:34:29Z",Ts={version:ws,asset_id:ks,project_id:_s,url:Ns,r2_key:$s,original_filename:Cs,size:zs,content_type:Ss,created_at:Es},Is=1,Ps="7f799e53-59aa-4231-a091-2c62b59a0bfa",As="7466534f-3a0b-4ec8-959e-8eda1a6c6751",Ms="/__l5e/assets-v1/7f799e53-59aa-4231-a091-2c62b59a0bfa/vc-09.jpg",Fs="a/v1/7466534f-3a0b-4ec8-959e-8eda1a6c6751/7f799e53-59aa-4231-a091-2c62b59a0bfa/vc-09.jpg",Ks="vc-09.jpg",Bs=59603,Rs="image/jpeg",Ws="2026-09-07T08:34:34Z",Ls={version:Is,asset_id:Ps,project_id:As,url:Ms,r2_key:Fs,original_filename:Ks,size:Bs,content_type:Rs,created_at:Ws},Ds=1,Os="7c0c4dd1-7c76-46ff-9727-dbb1148764bb",Ys="7466534f-3a0b-4ec8-959e-8eda1a6c6751",Vs="/__l5e/assets-v1/7c0c4dd1-7c76-46ff-9727-dbb1148764bb/vc-10.jpg",qs="a/v1/7466534f-3a0b-4ec8-959e-8eda1a6c6751/7c0c4dd1-7c76-46ff-9727-dbb1148764bb/vc-10.jpg",Zs="vc-10.jpg",Xs=55943,Hs="image/jpeg",Us="2026-09-07T08:34:40Z",Js={version:Ds,asset_id:Os,project_id:Ys,url:Vs,r2_key:qs,original_filename:Zs,size:Xs,content_type:Hs,created_at:Us},Gs=1,Qs="6d300f8a-1cb6-474e-8acf-132583418aa1",ea="7466534f-3a0b-4ec8-959e-8eda1a6c6751",sa="/__l5e/assets-v1/6d300f8a-1cb6-474e-8acf-132583418aa1/vc-11.jpg",aa="a/v1/7466534f-3a0b-4ec8-959e-8eda1a6c6751/6d300f8a-1cb6-474e-8acf-132583418aa1/vc-11.jpg",ta="vc-11.jpg",ia=74009,na="image/jpeg",ra="2026-09-07T08:34:47Z",oa={version:Gs,asset_id:Qs,project_id:ea,url:sa,r2_key:aa,original_filename:ta,size:ia,content_type:na,created_at:ra},ca=1,la="af260e08-9915-4fd4-b83e-e32b6e24d93e",da="7466534f-3a0b-4ec8-959e-8eda1a6c6751",pa="/__l5e/assets-v1/af260e08-9915-4fd4-b83e-e32b6e24d93e/vc-12.jpg",xa="a/v1/7466534f-3a0b-4ec8-959e-8eda1a6c6751/af260e08-9915-4fd4-b83e-e32b6e24d93e/vc-12.jpg",ma="vc-12.jpg",ha=74803,ga="image/jpeg",fa="2026-09-07T08:35:18Z",ua={version:ca,asset_id:la,project_id:da,url:pa,r2_key:xa,original_filename:ma,size:ha,content_type:ga,created_at:fa},va=1,ba="045001d2-c564-4be9-be6c-ecb115dafad2",ja="7466534f-3a0b-4ec8-959e-8eda1a6c6751",ya="/__l5e/assets-v1/045001d2-c564-4be9-be6c-ecb115dafad2/vc-13.jpg",wa="a/v1/7466534f-3a0b-4ec8-959e-8eda1a6c6751/045001d2-c564-4be9-be6c-ecb115dafad2/vc-13.jpg",ka="vc-13.jpg",_a=67980,Na="image/jpeg",$a="2026-09-07T08:35:17Z",Ca={version:va,asset_id:ba,project_id:ja,url:ya,r2_key:wa,original_filename:ka,size:_a,content_type:Na,created_at:$a},za=1,Sa="5f007a63-871c-4376-a356-2b3a971de0bb",Ea="7466534f-3a0b-4ec8-959e-8eda1a6c6751",Ta="/__l5e/assets-v1/5f007a63-871c-4376-a356-2b3a971de0bb/vc-14.jpg",Ia="a/v1/7466534f-3a0b-4ec8-959e-8eda1a6c6751/5f007a63-871c-4376-a356-2b3a971de0bb/vc-14.jpg",Pa="vc-14.jpg",Aa=71277,Ma="image/jpeg",Fa="2026-09-07T08:35:17Z",Ka={version:za,asset_id:Sa,project_id:Ea,url:Ta,r2_key:Ia,original_filename:Pa,size:Aa,content_type:Ma,created_at:Fa},Ba=1,Ra="e2a48e35-6ca7-4dbe-aea0-d943362d260a",Wa="7466534f-3a0b-4ec8-959e-8eda1a6c6751",La="/__l5e/assets-v1/e2a48e35-6ca7-4dbe-aea0-d943362d260a/inside-01.jpg",Da="a/v1/7466534f-3a0b-4ec8-959e-8eda1a6c6751/e2a48e35-6ca7-4dbe-aea0-d943362d260a/inside-01.jpg",Oa="inside-01.jpg",Ya=95618,Va="image/jpeg",qa="2026-09-07T09:59:10Z",Za={version:Ba,asset_id:Ra,project_id:Wa,url:La,r2_key:Da,original_filename:Oa,size:Ya,content_type:Va,created_at:qa},Xa=1,Ha="d2bdccd6-b092-4282-82a8-89ce19611973",Ua="7466534f-3a0b-4ec8-959e-8eda1a6c6751",Ja="/__l5e/assets-v1/d2bdccd6-b092-4282-82a8-89ce19611973/inside-02.jpg",Ga="a/v1/7466534f-3a0b-4ec8-959e-8eda1a6c6751/d2bdccd6-b092-4282-82a8-89ce19611973/inside-02.jpg",Qa="inside-02.jpg",et=105372,st="image/jpeg",at="2026-09-07T09:59:14Z",tt={version:Xa,asset_id:Ha,project_id:Ua,url:Ja,r2_key:Ga,original_filename:Qa,size:et,content_type:st,created_at:at},it=1,nt="08b57544-5113-45e4-930e-0128710aeb7b",rt="7466534f-3a0b-4ec8-959e-8eda1a6c6751",ot="/__l5e/assets-v1/08b57544-5113-45e4-930e-0128710aeb7b/inside-03.jpg",ct="a/v1/7466534f-3a0b-4ec8-959e-8eda1a6c6751/08b57544-5113-45e4-930e-0128710aeb7b/inside-03.jpg",lt="inside-03.jpg",dt=95040,pt="image/jpeg",xt="2026-09-07T09:59:18Z",mt={version:it,asset_id:nt,project_id:rt,url:ot,r2_key:ct,original_filename:lt,size:dt,content_type:pt,created_at:xt},ht=[[Za.url,"The 18-lesson course menu inside the player"],[tt.url,"A lesson playing with progress tracking"],[mt.url,"Lesson notes and resources on the phone"]],B=[["story","My story"],["lessons","Lessons"],["inside","Inside the course"],["free","Free courses"],["students","Results"],["teacher","Your teacher"],["pricing","Price"]],w=4690,R=999,gt="9b3d6b37-f5af-4318-b66f-c79e67b4eedb",W="https://wa.me/254758991116?text=Hi%20Elvis%2C%20I%20have%20a%20question%20about%20the%20Vibe%20Coding%20Course.",N=d=>d.toLocaleString("en-US"),ft=[["Claude AI","Writes the code"],["Lovable","Builds the site"],["Supabase","Holds your data"],["Paystack","Takes M-Pesa"],["Resend","Sends emails"]],ut=[{img:Me.url,alt:"Building a site on a laptop",title:"Put a site online",text:"Blank page to a live site on your own domain."},{img:Ve.url,alt:"Setting up M-Pesa payments",title:"Get paid on M-Pesa",text:"A payment request pops up on your client's phone. Cards work too."},{img:ss.url,alt:"Setting up sign-in and customer data",title:"Keep client data safe",text:"Add sign-in, and let each person see only their own stuff."}],vt=[{name:"Getting started",lessons:[["01","Plan before you build"],["02","Set up your tools"],["03","Build your first page"],["04","Make it fast in Kenya"]]},{name:"Making it look good",lessons:[["05","Colours, fonts and spacing"],["06","Build once, use everywhere"],["07","Forms that work"],["08","Menus and extra pages"]]},{name:"Data and sign-in",lessons:[["09","Where your site keeps its data"],["10","Sign up and log in"],["11","Keep client details private"],["12","Jobs that run on their own"]]},{name:"Payments and launch",lessons:[["13","Set up Paystack properly"],["14","Take M-Pesa"],["15","Take cards"],["16","Emails that send themselves"],["17","Use your own domain"],["18","Test everything and go live"]]}],bt=[["“My online shop is live. I opened yesterday and I have already made a few sales. I also built an accounting system that tracks inventory, sales, profit, cashflow, debtors and creditors.”","Linda — Kisumu, gardenofedenfoods.lovable.app"],["“I have built a fully functional chemist store management system. It is live now.”","Kyakat — yattachemist.lovable.app"],["“I built a site with payments, database, backend and logins. Fully functional. You would think a developer made it.”","Bob — full stack build"]],jt=[[Ls.url,"Elvis teaching a class"],[Js.url,"Elvis on a panel"],[oa.url,"A class building on their laptops"],[ua.url,"Elvis speaking at a Rotaract session"],[Ca.url,"Elvis at a tech conference"],[Ka.url,"Elvis building on a laptop"]],yt=[["Do I need to know how to code?","No. You type in normal English. The AI writes the code."],["Can I do it on my phone?","You can watch on your phone. You need a laptop to build along."],["How long does it take?","About 10 hours of video. No deadline. Go at your own pace."],["Are the lessons live?","Recorded. Everything unlocks the second you pay. Rewatch as much as you like."],["How do I pay?","M-Pesa or card, both through Paystack. Access is instant."],["Can I get stuck and ask for help?","Yes. Message me on WhatsApp and I answer myself."]],wt=`
.vcp{--brand:#4F46E5;--brand-dark:#3730A3;--brand-tint:#F1F0FE;--font:"Plus Jakarta Sans",system-ui,sans-serif;
--ink:#101014;--ink-soft:#26262E;--muted:#63636E;--white:#FFFFFF;--grey:#F6F6F8;--line:#E5E5EA;
--line-dark:rgba(255,255,255,.14);--dim:rgba(255,255,255,.68);--pay:#15803D;
background:var(--white);color:var(--ink);font-family:var(--font);font-size:17px;line-height:1.55;-webkit-font-smoothing:antialiased}
.vcp *,.vcp *::before,.vcp *::after{box-sizing:border-box}
.vcp h1,.vcp h2,.vcp h3,.vcp h4{font-family:var(--font);font-weight:800;line-height:1.08;letter-spacing:-.035em;margin:0}
.vcp h1{font-size:clamp(38px,7vw,66px)}
.vcp h2{font-size:clamp(28px,4.6vw,44px)}
.vcp h3{font-size:20px;letter-spacing:-.02em;font-weight:700}
.vcp p{margin:0}
.vcp ul,.vcp ol{margin:0;padding:0;list-style:none}
.vcp img{display:block;max-width:100%}
.vcp a{color:inherit;text-decoration:none}
.vcp button{font:inherit;cursor:pointer;border:0;background:none;color:inherit}
.vcp :focus-visible{outline:3px solid var(--brand);outline-offset:3px}
.vcp .wrap{max-width:1120px;margin:0 auto;padding:0 22px}
.vcp .narrow{max-width:760px;margin:0 auto;padding:0 22px}
.vcp .sec{padding:76px 0}
@media(min-width:800px){.vcp .sec{padding:104px 0}}
.vcp .dark{background:var(--ink);color:#fff}
.vcp .dark h2,.vcp .dark h3{color:#fff}
.vcp .grey{background:var(--grey)}
.vcp .lead{font-size:19px;color:var(--muted);max-width:48ch;margin-top:16px}
.vcp .dark .lead{color:var(--dim)}
.vcp .btn{display:inline-flex;align-items:center;justify-content:center;padding:16px 28px;font-weight:700;font-size:16.5px;letter-spacing:-.01em;border-radius:12px;transition:.15s}
.vcp .go{background:var(--brand);color:#fff}
.vcp .go:hover{background:var(--brand-dark)}
.vcp .quiet{border:1.5px solid var(--line);color:var(--ink)}
.vcp .quiet:hover{border-color:var(--ink)}
.vcp .dark .quiet{border-color:var(--line-dark);color:#fff}
.vcp .dark .quiet:hover{border-color:#fff}
.vcp .wide{width:100%}
.vcp .row{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}
.vcp header{position:sticky;top:0;z-index:60;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
.vcp header .bar{display:flex;align-items:center;justify-content:space-between;gap:20px;max-width:1120px;margin:0 auto;padding:13px 22px}
.vcp .mark{font-weight:800;font-size:18px;letter-spacing:-.035em}
.vcp .mark i{font-style:normal;color:var(--brand)}
.vcp header nav{display:none;gap:24px;font-size:15px;color:var(--muted);font-weight:500}
.vcp header nav a:hover{color:var(--ink)}
@media(min-width:940px){.vcp header nav{display:flex}}
.vcp .hbtn{background:var(--brand);color:#fff;padding:10px 18px;border-radius:10px;font-weight:700;font-size:15px}
.vcp .hero{padding:56px 0 0;background:linear-gradient(180deg,var(--brand-tint),var(--white))}
.vcp .hgrid{display:grid;gap:40px}
@media(min-width:900px){.vcp .hgrid{grid-template-columns:1.1fr .9fr;gap:56px;align-items:center;padding-bottom:20px}}
.vcp .pill{display:inline-block;background:var(--white);border:1px solid var(--line);padding:7px 14px;border-radius:999px;font-size:14px;font-weight:600;color:var(--brand);margin-bottom:22px}
.vcp .hero h1 em{font-style:normal;display:block;color:var(--brand)}
.vcp .ticks{margin-top:26px;display:grid;gap:10px}
@media(min-width:560px){.vcp .ticks{grid-template-columns:1fr 1fr;gap:10px 22px}}
.vcp .ticks li{display:flex;gap:10px;font-size:16px;font-weight:500}
.vcp .ticks b{color:var(--brand);flex:0 0 auto}
.vcp .fine{margin-top:18px;font-size:14.5px;color:var(--muted)}
.vcp .shot{position:relative;border-radius:20px;overflow:hidden;background:var(--brand)}
.vcp .shot img{width:100%}
.vcp .tag{position:absolute;left:14px;bottom:14px;right:14px;background:rgba(255,255,255,.94);backdrop-filter:blur(6px);border-radius:12px;padding:11px 15px}
.vcp .tag b{display:block;font-weight:700;font-size:16px}
.vcp .tag span{font-size:13.5px;color:var(--muted)}
.vcp .typed{border-top:1px solid var(--line);margin-top:52px;padding:22px 0 26px;display:grid;gap:14px}
@media(min-width:760px){.vcp .typed{grid-template-columns:1fr 1fr;gap:30px}}
.vcp .typed .lbl{font-size:13.5px;font-weight:700;color:var(--brand);margin-bottom:5px}
.vcp .typed .txt{font-size:16.5px;color:var(--ink-soft)}
.vcp .tools{padding:34px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:var(--grey)}
.vcp .tools h4{font-size:14.5px;font-weight:600;color:var(--muted);margin-bottom:18px}
.vcp .tools ol{display:grid;gap:14px}
@media(min-width:700px){.vcp .tools ol{grid-template-columns:repeat(5,1fr);gap:20px}}
.vcp .tools li .n{font-weight:800;font-size:17px;letter-spacing:-.02em}
.vcp .tools li .d{font-size:14.5px;color:var(--muted)}
.vcp .sgrid{display:grid;gap:36px}
@media(min-width:900px){.vcp .sgrid{grid-template-columns:.75fr 1.25fr;gap:60px;align-items:center}}
.vcp .sgrid figure{margin:0;border-radius:18px;overflow:hidden}
.vcp .sgrid figure img{width:100%}
.vcp .story p{margin-top:18px;font-size:19px;color:var(--dim);max-width:46ch}
.vcp .story .big{color:#fff;font-size:23px;font-weight:600;line-height:1.35}
.vcp .outs{display:grid;gap:28px;margin-top:44px}
@media(min-width:860px){.vcp .outs{grid-template-columns:repeat(3,1fr);gap:26px}}
.vcp .out img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:16px}
.vcp .out h3{margin-top:18px}
.vcp .out p{margin-top:7px;font-size:16px;color:var(--muted)}
.vcp .steps{display:grid;gap:20px;margin-top:44px}
@media(min-width:800px){.vcp .steps{grid-template-columns:repeat(3,1fr);gap:22px}}
.vcp .steps li{background:var(--ink-soft);border-radius:16px;padding:26px 24px}
.vcp .steps .sn{width:34px;height:34px;border-radius:10px;background:var(--brand);color:#fff;display:grid;place-items:center;font-weight:800;font-size:16px}
.vcp .steps h3{margin-top:16px}
.vcp .steps p{margin-top:7px;color:var(--dim);font-size:16px}
.vcp .part{margin-top:42px}
.vcp .part h3{padding-bottom:10px;border-bottom:2px solid var(--ink)}
.vcp .lesson{display:flex;gap:16px;padding:14px 0;border-bottom:1px solid var(--line);font-size:17px;font-weight:500}
.vcp .lesson .ln{font-weight:700;color:var(--brand);flex:0 0 26px}
.vcp .honest p{margin-top:16px;font-size:20px;color:var(--dim)}
.vcp .honest p.hi{color:#fff;font-weight:600}
.vcp .bgrid{display:grid;gap:20px;margin-top:44px}
@media(min-width:900px){.vcp .bgrid{grid-template-columns:1.1fr .9fr;gap:24px}}
.vcp .card{background:var(--white);border:1px solid var(--line);border-radius:18px;padding:28px 24px}
@media(min-width:640px){.vcp .card{padding:32px 30px}}
.vcp .card .free{display:inline-block;background:var(--brand-tint);color:var(--brand);font-weight:700;font-size:13px;padding:5px 11px;border-radius:999px;margin-bottom:14px}
.vcp .card h3{font-size:21px}
.vcp .card .sub{font-size:15px;color:var(--muted);margin-top:6px}
.vcp .mini{margin-top:18px}
.vcp .mini li{display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--line);font-size:16px}
.vcp .mini li:last-child{border-bottom:0}
.vcp .mini .mn{font-weight:700;color:var(--brand);flex:0 0 14px}
.vcp .card figure{margin:22px 0 0;border-radius:14px;overflow:hidden}
.vcp .card figure img{width:100%;aspect-ratio:16/10;object-fit:cover}
.vcp .quotes{display:grid;gap:18px;margin-top:36px}
@media(min-width:860px){.vcp .quotes{grid-template-columns:repeat(3,1fr);gap:20px}}
.vcp blockquote{margin:0;background:var(--grey);border-radius:16px;padding:26px 24px;border-top:4px solid var(--brand)}
.vcp blockquote p{font-size:17px;font-weight:500;line-height:1.5}
.vcp blockquote cite{display:block;margin-top:14px;font-style:normal;font-size:14px;color:var(--muted);font-weight:600}
.vcp .builtlist{margin-top:26px;font-size:16.5px;color:var(--muted);max-width:70ch}
.vcp .builtlist b{color:var(--ink)}
.vcp .tgrid{display:grid;gap:36px}
@media(min-width:960px){.vcp .tgrid{grid-template-columns:.85fr 1.15fr;gap:56px;align-items:center}}
.vcp .tgrid figure{margin:0;border-radius:18px;overflow:hidden}
.vcp .tgrid p{margin-top:16px;font-size:18px;color:var(--dim);max-width:48ch}
.vcp .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:30px;border-top:1px solid var(--line-dark);padding-top:22px}
.vcp .stats .sv{font-weight:800;font-size:30px;color:var(--brand);letter-spacing:-.03em}
.vcp .stats .sl{font-size:13.5px;color:rgba(255,255,255,.5);margin-top:4px}
.vcp .gal{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:48px}
@media(min-width:700px){.vcp .gal{grid-template-columns:repeat(3,1fr)}}
@media(min-width:1000px){.vcp .gal{grid-template-columns:repeat(6,1fr)}}
.vcp .gal img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:12px}
.vcp .pcard{margin-top:40px;border:1px solid var(--line);border-radius:22px;overflow:hidden;background:var(--white);box-shadow:0 30px 60px -40px rgba(16,16,20,.4)}
@media(min-width:960px){.vcp .pcard{display:grid;grid-template-columns:1.2fr 1fr}}
.vcp .pl{padding:32px 24px;border-bottom:1px solid var(--line)}
@media(min-width:960px){.vcp .pl{border-bottom:0;border-right:1px solid var(--line);padding:40px 36px}}
.vcp .inc{margin-top:20px;display:grid;gap:10px}
@media(min-width:560px){.vcp .inc{grid-template-columns:1fr 1fr;gap:10px 20px}}
.vcp .inc li,.vcp .checks li{display:flex;gap:10px;font-size:16px}
.vcp .inc b,.vcp .checks b{color:var(--pay);flex:0 0 auto}
.vcp .checks li{padding:7px 0}
.vcp .extras{margin-top:26px;background:var(--brand-tint);border-radius:14px;padding:22px 20px}
.vcp .extras h4{font-size:14.5px;font-weight:700;color:var(--brand)}
.vcp .extras .x{margin-top:14px;display:flex;gap:12px}
.vcp .extras .xn{font-weight:800;color:var(--brand);flex:0 0 13px}
.vcp .extras .xt{font-weight:700;font-size:16px}
.vcp .extras .xd{font-size:14.5px;color:var(--muted);margin-top:2px}
.vcp .pr{padding:32px 24px;background:var(--grey);display:flex;flex-direction:column;justify-content:center}
@media(min-width:960px){.vcp .pr{padding:40px 32px}}
.vcp .mathline{font-size:14.5px;color:var(--muted);line-height:1.8}
.vcp .amount{font-weight:800;letter-spacing:-.05em;font-size:60px;line-height:1;margin-top:10px}
.vcp .amount sup{font-size:19px;font-weight:700;letter-spacing:0;color:var(--muted);margin-right:6px;vertical-align:super}
.vcp .once{font-size:15px;color:var(--muted);margin-top:8px}
.vcp .bump{margin-top:20px;display:flex;gap:11px;background:var(--white);border:1.5px solid var(--line);border-radius:12px;padding:14px;cursor:pointer}
.vcp .bump.on{border-color:var(--brand)}
.vcp .bump input{width:19px;height:19px;accent-color:var(--brand);margin:2px 0 0;flex:0 0 auto}
.vcp .bump .bt{font-weight:700;font-size:15.5px;display:block}
.vcp .bump .bd{font-size:13.5px;color:var(--muted);margin-top:3px;display:block}
.vcp .pr .btn{margin-top:18px}
.vcp .assure{margin-top:12px;font-size:13px;color:var(--muted);text-align:center}
.vcp .assure a{color:var(--brand);font-weight:600}
.vcp details{border-bottom:1px solid var(--line)}
.vcp .faq{margin-top:34px;border-top:1px solid var(--line)}
.vcp summary{list-style:none;cursor:pointer;padding:19px 40px 19px 0;position:relative;font-weight:700;font-size:17.5px;letter-spacing:-.015em}
.vcp summary::-webkit-details-marker{display:none}
.vcp summary::after{content:"+";position:absolute;right:4px;top:16px;font-size:24px;font-weight:400;color:var(--brand)}
.vcp details[open] summary::after{content:"–"}
.vcp details .a{padding:0 0 20px;font-size:16.5px;color:var(--muted);max-width:58ch}
.vcp .final{text-align:center}
.vcp .final .lead{margin:16px auto 0}
.vcp .final .row{justify-content:center}
.vcp footer{background:var(--ink);color:#fff;padding:50px 0 36px}
.vcp .fgrid{display:grid;gap:32px}
@media(min-width:640px){.vcp .fgrid{grid-template-columns:1fr 1fr}}
@media(min-width:1000px){.vcp .fgrid{grid-template-columns:1.6fr 1fr 1fr 1.2fr}}
.vcp footer h4{font-size:13.5px;font-weight:600;color:rgba(255,255,255,.45);margin-bottom:12px}
.vcp footer li{font-size:14.5px;color:rgba(255,255,255,.66);padding:5px 0}
.vcp footer a:hover{color:#fff}
.vcp footer .about{font-size:15px;color:rgba(255,255,255,.6);max-width:34ch;margin-top:12px}
.vcp footer .cr{font-size:12.5px;color:rgba(255,255,255,.3);margin-top:20px}
.vcp .dock{position:fixed;left:0;right:0;bottom:0;z-index:70;background:var(--white);border-top:1px solid var(--line);box-shadow:0 -6px 24px rgba(16,16,20,.09);padding:11px 16px calc(11px + env(safe-area-inset-bottom));display:flex;align-items:center;gap:14px;transform:translateY(130%);transition:transform .25s}
.vcp .dock.on{transform:none}
.vcp .dock .dp{font-weight:800;font-size:19px;letter-spacing:-.03em}
.vcp .dock .ds{font-size:11.5px;color:var(--muted)}
.vcp .dock button{flex:1;text-align:center;background:var(--brand);color:#fff;padding:13px;border-radius:11px;font-weight:700;font-size:15px}
@media(min-width:960px){.vcp .dock{display:none}}
.vcp .dockpad{height:76px}
@media(min-width:960px){.vcp .dockpad{display:none}}

/* ---- Off-canvas mobile / tablet menu ---- */
.vcp .burger{display:inline-flex;flex-direction:column;justify-content:center;gap:5px;width:44px;height:44px;padding:0 10px;border-radius:12px;border:1.5px solid var(--line);background:var(--white)}
.vcp .burger span{display:block;height:2px;width:100%;background:var(--ink);border-radius:2px;transition:transform .28s cubic-bezier(.16,1,.3,1),opacity .18s ease}
.vcp .burger.on span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.vcp .burger.on span:nth-child(2){opacity:0}
.vcp .burger.on span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
@media(min-width:940px){.vcp .burger{display:none}}
@media(max-width:939px){.vcp header .hbtn{display:none}}
.vcp .oc-scrim{position:fixed;inset:0;z-index:90;background:rgba(9,12,10,.45);backdrop-filter:blur(3px);opacity:0;pointer-events:none;transition:opacity .3s ease}
.vcp .oc-scrim.on{opacity:1;pointer-events:auto}
.vcp .oc{position:fixed;top:0;right:0;bottom:0;z-index:100;width:min(400px,88vw);background:var(--white);display:flex;flex-direction:column;transform:translateX(102%);transition:transform .42s cubic-bezier(.16,1,.3,1);box-shadow:-24px 0 60px rgba(0,0,0,.18)}
.vcp .oc.on{transform:translateX(0)}
.vcp .oc-top{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid var(--line)}
.vcp .oc-x{width:40px;height:40px;border-radius:12px;border:1.5px solid var(--line);display:grid;place-items:center;font-size:19px;line-height:1;color:var(--muted)}
.vcp .oc-x:hover{color:var(--ink);border-color:var(--ink)}
.vcp .oc-links{flex:1;overflow-y:auto;padding:14px 14px 24px;display:flex;flex-direction:column;gap:2px}
.vcp .oc-links button{display:flex;align-items:center;justify-content:space-between;gap:14px;width:100%;text-align:left;padding:15px 16px;border-radius:14px;font-size:17.5px;font-weight:600;letter-spacing:-.015em;color:var(--ink);opacity:0;transform:translateX(14px);transition:background .18s ease,color .18s ease}
.vcp .oc.on .oc-links button{animation:ocIn .42s cubic-bezier(.16,1,.3,1) forwards}
.vcp .oc-links button:active{background:var(--brand-tint)}
.vcp .oc-links button:hover{background:var(--brand-tint);color:var(--brand-dark)}
.vcp .oc-links .num{font-size:12.5px;font-weight:700;color:var(--muted);opacity:.6}
@keyframes ocIn{to{opacity:1;transform:translateX(0)}}
.vcp .oc-foot{border-top:1px solid var(--line);padding:16px 18px calc(18px + env(safe-area-inset-bottom));background:var(--brand-tint)}
.vcp .oc-foot .pr{display:flex;align-items:baseline;gap:8px;margin-bottom:12px}
.vcp .oc-foot .pr b{font-size:22px;font-weight:800;letter-spacing:-.03em}
.vcp .oc-foot .pr span{font-size:13px;color:var(--muted)}
.vcp .oc-foot button{width:100%;background:var(--brand);color:#fff;padding:15px;border-radius:13px;font-weight:700;font-size:16px}
.vcp .oc-foot button:hover{background:var(--brand-dark)}
.vcp .oc-foot a{display:block;text-align:center;margin-top:11px;font-size:14px;color:var(--muted);font-weight:600}
@media(prefers-reduced-motion:reduce){.vcp *{transition:none!important}}
`,Pt=()=>{const d=H(),[p,b]=i.useState(!1),[x,m]=i.useState(!1),[g,u]=i.useState("cta_hero"),[l,j]=i.useState(!1),[t,h]=i.useState(!1),c=w+(p?R:0),k=p?"On-Demand + 60 Design Prompts":"On-Demand Access";i.useEffect(()=>{const s=()=>j(window.scrollY>600);return window.addEventListener("scroll",s,{passive:!0}),s(),()=>window.removeEventListener("scroll",s)},[]),i.useEffect(()=>{