var CATS=[
  {key:'data_sharing',label:'Data sharing',icon:'<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',ibg:'#EFF6FF',ic:'#1D4ED8',ibgd:'#1E3A5F',icd:'#93C5FD'},
  {key:'hidden_fees',label:'Hidden fees',icon:'<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>',ibg:'#FEF6EA',ic:'#D97706',ibgd:'#3B2A0D',icd:'#FCD34D'},
  {key:'cancellation',label:'Cancellation steps',icon:'<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><rect x="9" y="9" width="6" height="6"/></svg>',ibg:'#FEF1F1',ic:'#DC2626',ibgd:'#3B1414',icd:'#FCA5A5'},
  {key:'account_deletion',label:'Account deletion',icon:'<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',ibg:'#F0FDF4',ic:'#15803D',ibgd:'#0D2B18',icd:'#86EFAC'},
  {key:'arbitration',label:'Arbitration clause',icon:'<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M3 21l9-18 9 18M3 21h18M9 15h6"/></svg>',ibg:'#F5F3FF',ic:'#7C3AED',ibgd:'#2D1B5E',icd:'#C4B5FD'}
];

/* ── THEME ── */
(function(){
  var s = localStorage.getItem('ciq-theme');
  if(s === 'dark' || (!s && window.matchMedia('(prefers-color-scheme: dark)').matches)) applyDark(true, false);
})();

function applyDark(on, save){
  on ? document.body.setAttribute('data-dark', '') : document.body.removeAttribute('data-dark');
  document.getElementById('isun').classList.toggle('hidden', on);
  document.getElementById('imoon').classList.toggle('hidden', !on);
  if(save !== false) localStorage.setItem('ciq-theme', on ? 'dark' : 'light');
}
document.getElementById('tbtn').onclick = function(){ applyDark(!document.body.hasAttribute('data-dark')); };

/* ── TABS ── */
var activeTab = 'text';
function switchTab(t){
  activeTab = t;
  document.getElementById('ptxt').classList.toggle('hidden', t !== 'text');
  document.getElementById('purl').classList.toggle('hidden', t !== 'url');
  document.getElementById('ttxt').classList.toggle('on', t === 'text');
  document.getElementById('turl').classList.toggle('on', t === 'url');
  clearErr();
}

/* ── CHAR COUNT ── */
function updateCount(){
  var n = document.getElementById('tos').value.length;
  document.getElementById('cnt').textContent = n.toLocaleString() + ' character' + (n !== 1 ? 's' : '');
}

/* ── SAMPLE POLICY ── */
function loadSample(){
  document.getElementById('tos').value = `TERMS OF SERVICE & PRIVACY POLICY — LAST UPDATED JANUARY 2025

1. DATA SHARING
We may share your personal information, including browsing history, purchase behaviour, and device identifiers, with third-party advertising partners, data brokers, and analytics providers to serve targeted advertisements. We may also sell aggregated and de-identified user data to research firms. In the event of a merger or acquisition, your data will be transferred to the acquiring entity without further notice.

2. SUBSCRIPTION AND FEES
Your subscription automatically renews at the then-current rate (currently $14.99/month or $129/year) unless cancelled at least 30 days prior to the renewal date. We reserve the right to change pricing at any time with 14 days notice by email. Additional fees may apply for premium features, excess storage, or API usage beyond included limits.

3. CANCELLATION POLICY
To cancel your subscription, you must call our customer support line at 1-800-XXX-XXXX during business hours (9am-5pm EST, Monday-Friday, excluding holidays). Cancellations cannot be processed via email or in-app. Refunds are not provided for partial billing periods.

4. ACCOUNT DELETION
Deletion requests are processed within 90 days. Some data may be retained for up to 7 years for legal purposes. Backups may retain copies for an additional 30 days after deletion.

5. DISPUTE RESOLUTION & ARBITRATION
BY USING OUR SERVICES, YOU AGREE TO BINDING ARBITRATION FOR ALL DISPUTES. YOU WAIVE YOUR RIGHT TO A JURY TRIAL AND CLASS ACTION LAWSUITS. You must file any claim within 1 year or it is permanently barred.`;
  updateCount();
}

/* ══════════════════════════════════════════
   RULE-BASED SCANNER ENGINE
   ══════════════════════════════════════════ */

var RULES = {

  data_sharing: {
    high: [
      /sell\s+(your|user|personal|customer)\s+(data|information)/i,
      /data\s+broker/i,
      /share.{0,40}(advertising partner|ad partner|marketing partner)/i,
      /transfer.{0,60}(acquiring|merger|acquisition)/i,
      /share.{0,40}third.?part/i,
      /disclose.{0,40}third.?part/i,
      /share.{0,40}(affiliate|subsidiary|partner).{0,30}(data|information)/i,
    ],
    medium: [
      /third.?part/i,
      /analytics provider/i,
      /service provider.{0,30}(data|information)/i,
      /business partner/i,
      /advertising/i,
      /marketing.{0,30}(data|information|purpose)/i,
      /aggregate.{0,30}(share|sell|disclose)/i,
    ],
    low: [
      /we do not sell/i,
      /never sell.{0,20}(data|information)/i,
      /not share.{0,30}third/i,
      /we will not share/i,
      /opt.out/i,
    ],
    summaries: {
      high: 'This policy explicitly shares or sells your personal data with third-party advertisers, data brokers, or partner companies. Your information may be transferred in the event of a merger or acquisition without additional notice.',
      medium: 'Your data may be shared with third-party analytics or advertising providers. Some sharing appears to be for operational purposes, but the scope is broad.',
      low: 'The policy does not appear to sell your personal data to third parties. Data sharing seems limited to essential service providers.',
      none: 'Data sharing practices are not explicitly mentioned in this policy.'
    }
  },

  hidden_fees: {
    high: [
      /automatically\s+renew/i,
      /auto.?renew/i,
      /reserve.{0,30}right.{0,30}(change|increase|modify).{0,20}(price|fee|rate)/i,
      /price.{0,20}(change|increase|modify).{0,20}without.{0,20}notice/i,
      /additional fee/i,
      /excess.{0,20}(fee|charge)/i,
      /cancel.{0,40}(30|60|90)\s+day/i,
      /no refund/i,
      /non.refundable/i,
    ],
    medium: [
      /renew.{0,30}current.{0,20}rate/i,
      /price.{0,30}notice/i,
      /change.{0,20}(fee|pricing|rate)/i,
      /premium feature/i,
      /overage/i,
      /exceed.{0,20}(limit|usage)/i,
      /billing period/i,
    ],
    low: [
      /no additional (fee|charge)/i,
      /price.{0,20}will not change/i,
      /fixed.{0,20}price/i,
      /cancel.{0,20}any.?time/i,
      /full refund/i,
    ],
    summaries: {
      high: 'Your subscription auto-renews and the company reserves the right to change pricing with limited notice. Cancellation requires advance notice and refunds are not provided for unused periods.',
      medium: 'There are some fee-related clauses to watch — the pricing can be adjusted and additional charges may apply for certain usage. Check renewal terms carefully.',
      low: 'Fee terms appear straightforward with no major hidden charges identified. Cancellation and refund terms seem fair.',
      none: 'Subscription or fee terms are not explicitly mentioned in this policy.'
    }
  },

  cancellation: {
    high: [
      /call.{0,30}(cancel|cancellation)/i,
      /phone.{0,30}cancel/i,
      /cancel.{0,40}(business hour|monday|weekday|working hour)/i,
      /cannot.{0,30}cancel.{0,30}(email|online|app|in.app)/i,
      /cancel.{0,40}(30|60|90)\s+day.{0,20}(prior|before|advance)/i,
      /no refund.{0,30}(cancel|partial)/i,
      /written notice.{0,30}cancel/i,
    ],
    medium: [
      /cancel.{0,30}(notice|advance)/i,
      /cancel.{0,50}renewal date/i,
      /cancel.{0,30}(account|subscription)/i,
      /termination.{0,30}notice/i,
      /days.{0,20}(prior|before|notice).{0,20}cancel/i,
    ],
    low: [
      /cancel.{0,20}any.?time/i,
      /easy.{0,20}cancel/i,
      /instant.{0,20}cancel/i,
      /no.{0,20}cancel.{0,20}fee/i,
      /cancel.{0,20}online/i,
      /self.service.{0,20}cancel/i,
    ],
    summaries: {
      high: 'Cancellation is deliberately difficult — you may need to call during business hours and cannot cancel via email or in-app. Significant advance notice is required and partial-period refunds are not given.',
      medium: 'Cancellation requires some advance notice before your renewal date. The process is not immediate — read the terms carefully before your next billing cycle.',
      low: 'Cancellation appears straightforward and can be done at any time, likely through self-service.',
      none: 'Cancellation procedures are not explicitly described in this policy.'
    }
  },

  account_deletion: {
    high: [
      /retain.{0,40}(7|eight|ten|\d{2,})\s+year/i,
      /retain.{0,40}(legal|compliance|regulatory).{0,30}purpose/i,
      /deletion.{0,30}(90|180|\d{3,})\s+day/i,
      /backup.{0,40}(retain|copy|additional)/i,
      /data.{0,20}never.{0,20}(delete|remov)/i,
      /permanently.{0,20}retain/i,
    ],
    medium: [
      /retain.{0,40}(30|60|90)\s+day/i,
      /deletion.{0,30}(process|request)/i,
      /some.{0,20}data.{0,20}(may|might).{0,20}retain/i,
      /archive/i,
      /anonymi[sz]e/i,
      /de.?identif/i,
    ],
    low: [
      /delete.{0,30}(immediately|promptly|within \d+ day)/i,
      /permanent.{0,20}deletion/i,
      /right to erasure/i,
      /right to delete/i,
      /gdpr/i,
    ],
    summaries: {
      high: 'Account deletion requests take a long time to process and your data may be retained for years for legal purposes. Backup copies can persist even after deletion.',
      medium: 'Your data is eventually deleted but some information may be retained for a period after your request. Anonymised copies may persist.',
      low: 'The policy offers clear deletion rights and data is removed promptly upon request.',
      none: 'Account deletion terms are not explicitly mentioned in this policy.'
    }
  },

  arbitration: {
    high: [
      /binding\s+arbitration/i,
      /waive.{0,30}(jury|class.action|class action)/i,
      /class.action.{0,30}waiv/i,
      /jury\s+trial.{0,30}waiv/i,
      /mandatory\s+arbitration/i,
      /arbitration.{0,40}(all|any)\s+dispute/i,
      /dispute.{0,40}binding\s+arbitration/i,
      /file.{0,20}claim.{0,30}(1|one)\s+year/i,
    ],
    medium: [
      /arbitration/i,
      /dispute resolution/i,
      /mediation/i,
      /governing law/i,
      /jurisdiction.{0,30}(exclusive|sole)/i,
      /claim.{0,30}(1|2|one|two)\s+year/i,
    ],
    low: [
      /right to sue/i,
      /court of law/i,
      /no arbitration/i,
      /opt.out.{0,30}arbitration/i,
    ],
    summaries: {
      high: 'This policy contains a mandatory binding arbitration clause. You waive your right to a jury trial and cannot join class-action lawsuits. Claims must be filed within a very short window or they are permanently barred.',
      medium: 'There are dispute resolution clauses that may limit how you can take legal action. Review the arbitration and jurisdiction terms carefully.',
      low: 'No mandatory arbitration clause detected. You appear to retain your right to pursue disputes in court.',
      none: 'Arbitration or dispute resolution terms are not explicitly mentioned in this policy.'
    }
  }
};

function countMatches(text, patterns) {
  return patterns.filter(function(p){ return p.test(text); }).length;
}

function analyzeCategory(text, rules) {
  var highHits  = countMatches(text, rules.high  || []);
  var medHits   = countMatches(text, rules.medium || []);
  var lowHits   = countMatches(text, rules.low   || []);

  var risk, summary;

  if (highHits >= 1) {
    risk = 'high';
    summary = rules.summaries.high;
  } else if (medHits >= 2) {
    risk = 'medium';
    summary = rules.summaries.medium;
  } else if (medHits === 1) {
    risk = 'medium';
    summary = rules.summaries.medium;
  } else if (lowHits >= 1) {
    risk = 'low';
    summary = rules.summaries.low;
  } else {
    risk = 'low';
    summary = rules.summaries.none;
  }

  return { summary: summary, risk: risk };
}

/* ── SCAN ── */
function scan(){
  var btn = document.getElementById('sbtn');
  clearErr();
  var content = '';

  if(activeTab === 'text'){
    content = document.getElementById('tos').value.trim();
    if(!content){ showErr('Please paste some policy text first.'); return; }
    if(content.length < 80){ showErr('Text is too short — paste more of the policy.'); return; }
  } else {
    showErr('URL scanning requires an AI key. Please paste the policy text directly instead.');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<div class="spin"></div> Scanning...';
  document.getElementById('results').classList.add('hidden');

  /* Small artificial delay so the spinner is visible */
  setTimeout(function(){
    try {
      var results = {};
      Object.keys(RULES).forEach(function(key){
        results[key] = analyzeCategory(content, RULES[key]);
      });
      renderResults(results);
    } catch(e) {
      showErr('Scan failed — ' + (e.message || 'unknown error') + '. Please try again.');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path d="M3 9V5a2 2 0 012-2h4M3 15v4a2 2 0 002 2h4M21 9V5a2 2 0 00-2-2h-4M21 15v4a2 2 0 01-2 2h-4"/><circle cx="12" cy="12" r="3"/></svg> Scan this policy';
    }
  }, 600);
}
// for eye
const eyes = document.querySelectorAll(".eye");
let follow = true;

document.addEventListener("mousemove", (e) => {
  if (!follow) return;

  eyes.forEach(eye => {
    const pupil = eye.querySelector(".pupil");
    const rect = eye.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const angle = Math.atan2(
      e.clientY - centerY,
      e.clientX - centerX
    );

    const maxMove = 18;
    pupil.style.transform = `
      translate(${Math.cos(angle) * maxMove}px,
                ${Math.sin(angle) * maxMove}px)
    `;
  });
});


document.addEventListener("dblclick", () => {
  follow = false;

  eyes.forEach(eye => {
    eye.querySelector(".pupil").style.transform = "translate(0,0)";
  });

  
  setTimeout(() => {
    follow = true;
  }, 300);
});


/* ── RENDER RESULTS ── */
function renderResults(data){
  var dark = document.body.hasAttribute('data-dark');
  var hi = 0, md = 0, lo = 0;
  document.getElementById('reslist').innerHTML = CATS.map(function(c){
    var it = data[c.key] || { summary: 'Not found in this policy.', risk: 'low' };
    var r = (it.risk || 'low').toLowerCase();
    if(r === 'high') hi++; else if(r === 'medium') md++; else lo++;
    var rl = r === 'medium' ? 'Medium risk' : r.charAt(0).toUpperCase() + r.slice(1) + ' risk';
    var bg = dark ? c.ibgd : c.ibg, col = dark ? c.icd : c.ic;
    return '<div class="rcard"><div class="rico" style="background:' + bg + ';color:' + col + '">' + c.icon + '</div><div><div class="rlabel">' + c.label + '</div><p class="rtext">' + it.summary + '</p></div><span class="rtag rtag-' + r + '">' + rl + '</span></div>';
  }).join('');

  document.getElementById('summary').innerHTML =
    '<div class="scard scard-hi"><div class="snum snum-hi">' + hi + '</div><div><div class="slabel slabel-hi">High risk</div><div class="ssub ssub-hi">' + hi + ' finding' + (hi !== 1 ? 's' : '') + '</div></div></div>' +
    '<div class="scard scard-md"><div class="snum snum-md">' + md + '</div><div><div class="slabel slabel-md">Medium risk</div><div class="ssub ssub-md">' + md + ' finding' + (md !== 1 ? 's' : '') + '</div></div></div>' +
    '<div class="scard scard-lo"><div class="snum snum-lo">' + lo + '</div><div><div class="slabel slabel-lo">Low / clear</div><div class="ssub ssub-lo">' + lo + ' finding' + (lo !== 1 ? 's' : '') + '</div></div></div>';

  document.getElementById('resmeta').textContent = 'Scanned at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  var s = document.getElementById('results');
  s.classList.remove('hidden');
  s.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── ERROR / CLEAR ── */
function showErr(m){ document.getElementById('errarea').innerHTML = '<div class="err-box"><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="flex-shrink:0;margin-top:1px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' + m + '</div>'; }
function clearErr(){ document.getElementById('errarea').innerHTML = ''; }