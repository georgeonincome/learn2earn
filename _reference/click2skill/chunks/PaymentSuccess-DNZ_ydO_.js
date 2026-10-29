import{r as e,j as a}from"./index-BADBJMlb.js";const o=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Successful | The Social Blueprint</title>
    <meta name="description" content="Your purchase of The Social Blueprint is complete.">
    <meta name="robots" content="noindex, nofollow">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap" rel="stylesheet">

    <script src="https://cdn.tailwindcss.com"><\/script>
    <script src="https://unpkg.com/@phosphor-icons/web"><\/script>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"><\/script>
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
        .receipt-cutout { position:absolute; width:24px; height:24px; background-color:#f9f8f6;
            border-radius:50%; border:1px solid #e5ddd3; top:-12px; }
        .pop { animation: pop .5s cubic-bezier(0.34,1.56,0.64,1) both; }
        @keyframes pop { from { opacity:0; transform:scale(.8);} to { opacity:1; transform:scale(1);} }
        .rise { animation: rise .6s ease both; }
        @keyframes rise { from { opacity:0; transform:translateY(16px);} to { opacity:1; transform:none;} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce){ .pop,.rise{animation:none} .spin{animation:none !important} }
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
                <div class="hidden sm:block text-green-700 font-bold text-xs tracking-widest uppercase flex items-center gap-1.5">
                    <i class="ph-fill ph-check-circle"></i> Payment Successful
                </div>
            </div>
        </div>
    </nav>

    <main class="flex-grow flex items-center justify-center py-12 px-4 relative overflow-hidden">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 blur-3xl -z-10 rounded-full pointer-events-none"></div>

        <div class="max-w-2xl w-full mx-auto text-center z-10">
            <div class="w-20 h-20 bg-brand-100 text-accent rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-200 shadow-sm pop">
                <i class="ph-bold ph-check text-4xl"></i>
            </div>
            <h1 class="font-bold text-4xl md:text-5xl text-brand-900 tracking-tight mb-4 rise">
                Welcome to the <span class="font-serif italic text-accent">Blueprint.</span>
            </h1>
            <p class="text-brand-800 text-lg md:text-xl max-w-lg mx-auto mb-10 font-light leading-relaxed rise">
                Your payment is confirmed. We have emailed your copy and receipt to <span class="font-medium text-brand-900" id="successEmail">your inbox</span>.
            </p>

            <div class="bg-white border border-brand-200 rounded-3xl shadow-xl text-left relative mt-8 rise">
                <div class="receipt-cutout -left-[13px] border-r-0 border-b-0 transform rotate-45"></div>
                <div class="receipt-cutout -right-[13px] border-l-0 border-b-0 transform -rotate-45"></div>
                <div class="p-8 md:p-10">
                    <div class="flex justify-between items-end border-b border-brand-100 pb-6 mb-6">
                        <div>
                            <div class="text-xs font-bold tracking-widest text-brand-800 uppercase mb-1">Receipt From</div>
                            <div class="font-bold text-xl text-brand-900">Click2Skill</div>
                        </div>
                        <div class="bg-green-50 text-green-700 border border-green-200 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase flex items-center gap-1.5">
                            <i class="ph-fill ph-check-circle"></i> Paid
                        </div>
                    </div>
                    <div class="space-y-5">
                        <div class="flex justify-between items-start">
                            <div class="text-xs font-bold tracking-widest text-brand-800 uppercase mt-1">Item</div>
                            <div class="text-right">
                                <div class="font-bold text-brand-900 text-lg">The Social Blueprint</div>
                                <div class="text-sm text-brand-800 font-serif italic">Second Edition</div>
                            </div>
                        </div>
                        <div class="flex justify-between items-center">
                            <div class="text-xs font-bold tracking-widest text-brand-800 uppercase">Date</div>
                            <div class="text-brand-900 text-sm font-medium" id="orderDate">--</div>
                        </div>
                        <div class="flex justify-between items-center gap-4">
                            <div class="text-xs font-bold tracking-widest text-brand-800 uppercase shrink-0">Order Ref</div>
                            <div class="font-mono font-bold text-accent tracking-wider text-sm bg-brand-50 px-2 py-1 rounded border border-brand-100 truncate" id="orderRef">--</div>
                        </div>
                    </div>
                </div>
                <div class="bg-brand-900 text-white p-8 md:p-10 rounded-b-3xl flex justify-between items-center border-t-4 border-accent">
                    <div class="text-xs font-bold tracking-widest text-brand-200 uppercase">Total Paid</div>
                    <div class="font-bold text-3xl" id="orderAmount">--</div>
                </div>
            </div>

            <div class="mt-12 flex flex-col items-center rise">
                <p class="text-xs font-bold tracking-widest text-brand-800 uppercase mb-5">Your download</p>
                <a href="#" id="downloadBtn" target="_blank" rel="noopener" class="btn-accent-luxury text-white px-10 py-5 rounded-full font-bold text-lg w-full sm:w-auto flex items-center justify-center gap-2 pointer-events-none opacity-60">
                    Preparing your link <i class="ph-bold ph-spinner-gap" style="animation:spin 1s linear infinite"></i>
                </a>
                <p class="text-xs text-brand-800 mt-4 max-w-xs" id="dlNote">This link is tied to your order and stays live for a short time. Your email has the same copy to keep.</p>

                <div class="mt-8 bg-brand-50 border border-brand-200 rounded-2xl p-5 max-w-md text-left flex items-start gap-3">
                    <i class="ph-bold ph-info text-accent text-xl mt-0.5 shrink-0"></i>
                    <div>
                        <p class="text-sm font-semibold text-brand-900 mb-1">Can't find the email?</p>
                        <p class="text-sm text-brand-800 leading-relaxed">Check the <strong>Promotions</strong> tab in Gmail, or your spam/junk folder. We want your copy to reach you.</p>
                    </div>
                </div>
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
    // The book link is NOT in this page. It is fetched only after the
    // backend confirms the Paystack payment, then it expires shortly.
    const VERIFY_ENDPOINT   = "https://YOUR-PROJECT.supabase.co/functions/v1/verify-purchase";
    const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY"; // public, safe to expose

    document.addEventListener("DOMContentLoaded", function () {
        const $ = (id) => document.getElementById(id);
        const params = new URLSearchParams(window.location.search);
        const reference = params.get("reference") || params.get("ref") || params.get("trxref");

        // Celebrate immediately
        fireConfetti();

        // Fill the receipt from the URL first, so the page always looks complete
        $("orderDate").innerText = new Date().toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
        $("orderRef").innerText = reference || "SBP-PREVIEW";
        const urlAmount = params.get("amount"), urlCcy = params.get("currency"), urlEmail = params.get("email");
        if (urlEmail) $("successEmail").innerText = urlEmail;
        $("orderAmount").innerText = urlAmount ? formatMoney(urlAmount, urlCcy) : "$5.99";

        const btn = $("downloadBtn");

        // No reference means this is a preview or a direct visit. Show the page, keep the file locked.
        if (!reference || VERIFY_ENDPOINT.indexOf("YOUR-PROJECT") !== -1) {
            lockToEmail();
            return;
        }

        // Confirm the payment, then reveal the gated link
        fetch(VERIFY_ENDPOINT + "?reference=" + encodeURIComponent(reference), {
            headers: { "apikey": SUPABASE_ANON_KEY, "Authorization": "Bearer " + SUPABASE_ANON_KEY }
        })
        .then(r => r.json())
        .then(data => {
            if (!data || !data.ok) return lockToEmail();
            if (data.email) $("successEmail").innerText = data.email;
            if (data.reference) $("orderRef").innerText = data.reference;
            if (data.paid_at) $("orderDate").innerText = new Date(data.paid_at).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
            if (data.amount != null) $("orderAmount").innerText = formatMoney(data.amount, data.currency);
            if (data.download_url) {
                btn.setAttribute("href", data.download_url);
                btn.classList.remove("pointer-events-none","opacity-60");
                btn.innerHTML = 'Download the ebook now <i class="ph-bold ph-download-simple"></i>';
            } else { lockToEmail(); }
        })
        .catch(() => lockToEmail());

        function lockToEmail() {
            btn.classList.add("pointer-events-none");
            btn.classList.remove("opacity-60");
            btn.innerHTML = 'Sent to your email <i class="ph-bold ph-envelope-simple"></i>';
            $("dlNote").innerText = "Your download link has been emailed to you. Check your inbox, the Promotions tab in Gmail, and your spam folder just in case.";
        }
    });

    function formatMoney(amount, currency) {
        const n = Number(amount).toLocaleString();
        if (currency === "USD" || !currency) return "$" + Number(amount).toFixed(2);
        if (currency === "KES") return "KSh " + n;
        return currency + " " + n;
    }
    function fireConfetti() {
        if (typeof confetti !== "function") return;
        const colors = ['#c2410c','#1a1816','#2c2825','#e5ddd3','#ffffff'];
        const end = Date.now() + 3000;
        (function frame() {
            confetti({ particleCount:6, angle:60,  spread:55, origin:{x:0,y:0.6}, colors, disableForReducedMotion:true });
            confetti({ particleCount:6, angle:120, spread:55, origin:{x:1,y:0.6}, colors, disableForReducedMotion:true });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    }
    <\/script>
</body>
</html>
`,s="https://btwwgdrnievzzhbmvulp.supabase.co",c="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0d3dnZHJuaWV2enpoYm12dWxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNTYwMTMsImV4cCI6MjA3OTczMjAxM30.PU88XtxOsSCKCa5TnSHe-f2XID-htrNW9lQbFwjW3vg";function l(){const n=e.useMemo(()=>{const t=`${s}/functions/v1/verify-purchase`,r=typeof window<"u"?window.location.search:"",i=`<script>(function(){var s=${JSON.stringify(r)};var orig=window.URLSearchParams;window.URLSearchParams=function(x){if(x===window.location.search||x===undefined)return new orig(s);return new orig(x);};window.URLSearchParams.prototype=orig.prototype;})();<\/script>`;return o.replace("https://YOUR-PROJECT.supabase.co/functions/v1/verify-purchase",t).replace("YOUR_SUPABASE_ANON_KEY",c).replace("</head>",`${i}</head>`)},[]);return e.useEffect(()=>{document.title="Payment Successful | The Social Blueprint"},[]),a.jsx("iframe",{title:"Payment Successful",srcDoc:n,style:{border:0,width:"100%",height:"100vh",display:"block"}})}export{l as default};
