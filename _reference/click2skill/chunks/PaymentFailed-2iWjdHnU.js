import{r as e,j as s}from"./index-BADBJMlb.js";const o=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Not Completed | The Social Blueprint</title>
    <meta name="description" content="Your payment did not go through.">
    <meta name="robots" content="noindex, nofollow">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap" rel="stylesheet">

    <script src="https://cdn.tailwindcss.com"><\/script>
    <script src="https://unpkg.com/@phosphor-icons/web"><\/script>
    <script>
        tailwind.config = { theme: { extend: {
            fontFamily: { sans: ['Plus Jakarta Sans','sans-serif'], serif: ['Lora','serif'] },
            colors: { brand: { 50:'#f9f8f6',100:'#f2eee8',200:'#e5ddd3',800:'#2c2825',900:'#1a1816' }, accent: { DEFAULT:'#c2410c', hover:'#9a3412' } }
        }}}
    <\/script>
    <style>
        body { background-color:#f9f8f6; color:#1a1816; -webkit-font-smoothing:antialiased; }
        .btn-accent-luxury { background:linear-gradient(135deg,#c2410c 0%,#9a3412 100%);
            box-shadow:0 10px 20px -5px rgba(194,65,12,0.4), inset 0 1px 1px rgba(255,255,255,0.2);
            border:1px solid #ea580c; transition:all .3s cubic-bezier(0.4,0,0.2,1); }
        .btn-accent-luxury:hover { transform:translateY(-3px);
            box-shadow:0 15px 25px -5px rgba(194,65,12,0.5), inset 0 1px 1px rgba(255,255,255,0.3);
            background:linear-gradient(135deg,#ea580c 0%,#c2410c 100%); }
        .rise { animation: rise .6s ease both; }
        @keyframes rise { from { opacity:0; transform:translateY(16px);} to { opacity:1; transform:none;} }
        .knock { animation: knock .6s ease both; }
        @keyframes knock { 0%{transform:scale(.85);opacity:0} 60%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
        @media (prefers-reduced-motion: reduce){ .rise,.knock{animation:none} }
    </style>
</head>
<body class="min-h-screen flex flex-col font-sans selection:bg-accent selection:text-white">

    <nav class="w-full bg-brand-50/90 backdrop-blur-md border-b border-brand-200 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                <div class="flex items-center gap-2">
                    <div class="w-10 h-10 bg-brand-900 rounded-full flex items-center justify-center text-white font-serif font-bold text-xl">EW</div>
                    <span class="font-bold text-lg uppercase tracking-wider text-brand-900">Click2Skill</span>
                </div>
                <div class="hidden sm:block text-brand-800 font-bold text-xs tracking-widest uppercase">Payment Not Completed</div>
            </div>
        </div>
    </nav>

    <main class="flex-grow flex items-center justify-center py-12 px-4 relative overflow-hidden">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 blur-3xl -z-10 rounded-full pointer-events-none"></div>

        <div class="max-w-xl w-full mx-auto text-center z-10">
            <div class="w-20 h-20 bg-brand-100 text-accent rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-200 shadow-sm knock">
                <i class="ph-bold ph-x text-4xl"></i>
            </div>

            <h1 class="font-bold text-4xl md:text-5xl text-brand-900 tracking-tight mb-4 rise">
                Payment <span class="font-serif italic text-accent">not completed.</span>
            </h1>
            <p class="text-brand-800 text-lg md:text-xl max-w-lg mx-auto mb-3 font-light leading-relaxed rise" id="failMsg">
                Your payment did not go through, so your order was not placed.
            </p>

            <!-- reassurance -->
            <div class="inline-flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-full text-sm font-bold mb-10 rise">
                <i class="ph-fill ph-shield-check"></i> You have not been charged
            </div>

            <!-- what happened -->
            <div class="bg-white border border-brand-200 rounded-3xl shadow-xl text-left p-8 md:p-10 mb-10 rise">
                <div class="text-xs font-bold tracking-widest text-brand-800 uppercase mb-4">This usually happens when</div>
                <ul class="space-y-3">
                    <li class="flex items-start gap-3 text-brand-900"><i class="ph-bold ph-dot-outline text-accent text-xl shrink-0"></i><span>The checkout window was closed before finishing.</span></li>
                    <li class="flex items-start gap-3 text-brand-900"><i class="ph-bold ph-dot-outline text-accent text-xl shrink-0"></i><span>The card or mobile money was declined by the bank.</span></li>
                    <li class="flex items-start gap-3 text-brand-900"><i class="ph-bold ph-dot-outline text-accent text-xl shrink-0"></i><span>The connection dropped during payment.</span></li>
                </ul>
                <p class="text-brand-800 text-sm mt-6 pt-6 border-t border-brand-100">Most of the time, trying again fixes it. If it keeps failing, use a different card or pay with M-PESA where available, or reach out and we will help.</p>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 justify-center rise">
                <a href="#" id="retryBtn" class="btn-accent-luxury text-white px-10 py-5 rounded-full font-bold text-lg w-full sm:w-auto flex items-center justify-center gap-2">
                    Try again <i class="ph-bold ph-arrow-clockwise"></i>
                </a>
                <a href="mailto:support@click2skill.com" class="bg-white border border-brand-200 text-brand-900 px-10 py-5 rounded-full font-bold text-lg w-full sm:w-auto flex items-center justify-center gap-2 hover:border-accent transition-colors">
                    Contact support <i class="ph-bold ph-chat-circle"></i>
                </a>
            </div>
        </div>
    </main>

    <footer class="border-t border-brand-200 py-8 mt-auto bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div class="font-bold text-xs tracking-widest uppercase text-brand-900">Click2Skill</div>
            <div class="text-xs text-brand-800 font-medium">&copy; 2026 Elvis W. &middot; The Social Blueprint</div>
        </div>
    </footer>

    <script>
    // Where "Try again" sends people. Point this at your checkout or landing page.
    const RETRY_URL = "/smm-guide#pricing";

    document.addEventListener("DOMContentLoaded", function () {
        document.getElementById("retryBtn").setAttribute("href", RETRY_URL);

        // Optional: show a specific reason if your flow passes one, e.g. ?reason=declined
        const reason = new URLSearchParams(window.location.search).get("reason");
        const map = {
            declined: "Your bank declined the payment. No money has left your account.",
            cancelled: "The payment was cancelled before it finished, so nothing was charged.",
            timeout: "The payment timed out before it finished. You have not been charged.",
            insufficient: "The payment did not go through due to insufficient funds. Nothing was charged."
        };
        if (reason && map[reason]) document.getElementById("failMsg").innerText = map[reason];
    });
    <\/script>
</body>
</html>
`;function r(){const n=e.useMemo(()=>{const t=typeof window<"u"?window.location.search:"",a=`<script>(function(){var s=${JSON.stringify(t)};var orig=window.URLSearchParams;window.URLSearchParams=function(x){if(x===window.location.search||x===undefined)return new orig(s);return new orig(x);};window.URLSearchParams.prototype=orig.prototype;})();<\/script>`;return o.replace("</head>",`${a}</head>`)},[]);return e.useEffect(()=>{document.title="Payment Not Completed | The Social Blueprint"},[]),s.jsx("iframe",{title:"Payment Not Completed",srcDoc:n,style:{border:0,width:"100%",height:"100vh",display:"block"}})}export{r as default};
