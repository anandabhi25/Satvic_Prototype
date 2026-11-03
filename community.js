// Local prototype guidance; no messages or referral events are sent to a server.
let chatMessages = [], referralStatus = '';
function startCommunity(type){
 if(type==='chat')chatMessages=[{who:'guide',text:'Namaste. What would make today a little easier? I can help you find a short practice, a recipe or a guided program.'}];
 if(type==='referral'){referralStatus='';if(!state.referralCode||!/^demo-[a-f0-9]{12}$/.test(state.referralCode)){const bytes=crypto.getRandomValues(new Uint8Array(6));state.referralCode='demo-'+Array.from(bytes,x=>x.toString(16).padStart(2,'0')).join('');save();}}
}
function referralUrl(){const url=new URL('./',location.href);url.searchParams.set('ref',state.referralCode);return url.href;}
async function copyInvitation(){
 const input=document.getElementById('referral-url');
 try{await navigator.clipboard.writeText(referralUrl());referralStatus='Invitation link copied. Share it with someone you know.';}
 catch{input.focus();input.select();referralStatus='Select and copy this link to share your invitation.';}
 const status=document.getElementById('referral-status');if(status)status.textContent=referralStatus;
}
async function shareInvitation(){
 if(!navigator.share){await copyInvitation();return;}
 try{await navigator.share({title:'A small Satvic step, together',text:'Try a free two-minute pause with me. This is a Satvic concept prototype.',url:referralUrl()});}
 catch(e){if(e.name!=='AbortError')await copyInvitation();}
}
function askGuide(message){
 const text=String(message).trim().slice(0,300);if(!text)return;
 let answer='Start with what feels manageable. Try a quiet pause, explore a recipe, or view guided programs. What interests you most?',action='';
 if(/pain|diabet|disease|medic|cure|diagnos|symptom|eczema|treat/i.test(text))answer='I can help with finding general wellbeing content, but cannot assess symptoms, diagnose or recommend treatment. Please speak with a qualified healthcare professional about medical questions.';
 else if(/refer|friend|invite|peer/i.test(text)){answer='A small practice can be easier with company. Create a demo invitation link for a friend. There are no rewards or tracked referrals in this prototype.';action='referral';}
 else if(/food|meal|recipe|cook/i.test(text)){answer='Make your next step something nourishing. Browse the recipe collection and open the official source for preparation details.';action='Recipes';}
 else if(/class|program|workshop|yoga|price|enrol/i.test(text)){answer='Explore guided programs at your pace. Current prices, schedules and enrollment are available on the official program pages.';action='Workshops';}
 else if(/pause|stress|breath|sleep|quiet|begin|start/i.test(text)){answer='Begin with two minutes of gentle breathing. There is no breath holding, and you can pause or leave whenever you like.';action='practice';}
 chatMessages.push({who:'you',text},{who:'guide',text:answer,action});chatMessages=chatMessages.slice(-12);render();document.getElementById('chat-input')?.focus();document.querySelector('.chat-log')?.scrollTo(0,99999);
}
function guideAction(action){if(['Recipes','Workshops'].includes(action)){closeModal();tab(action);}else openModal(action);}
function communityModal(){
 if(!state.modal||!['chat','referral'].includes(state.modal.type))return null;
 const isChat=state.modal.type==='chat';const title=isChat?'Find your next step':'A small step, shared';
 const body=isChat?`<p class="hint">Scripted prototype guide · not AI or a human adviser. Messages stay in this visit. Please do not enter personal or medical details.</p><div class="chat-log" role="log" aria-live="polite" aria-label="Conversation">${chatMessages.map(m=>`<div class="chat-message ${m.who}"><span>${m.who==='you'?'You':'Satvic guide'}</span><p>${h(m.text)}</p>${m.action?`<button class="btn secondary" onclick="guideAction('${m.action}')">${({practice:'Try a free pause',Recipes:'Explore recipes',Workshops:'View programs',referral:'Invite a friend'})[m.action]}</button>`:''}</div>`).join('')}</div><div class="chat-suggestions">${['Help me begin','Easy meal ideas','Explore yoga','Invite a friend'].map(t=>`<button onclick="askGuide('${t}')">${t}</button>`).join('')}</div><form onsubmit="event.preventDefault();askGuide(document.getElementById('chat-input').value)"><label for="chat-input">What are you looking for?</label><div class="chat-compose"><input id="chat-input" maxlength="300" autocomplete="off" placeholder="A practice, recipe or program…" required><button class="btn" type="submit">Send</button></div></form>`:`<p>Know someone who could use a quiet moment? Invite them to try a free practice before exploring anything else.</p><ol class="referral-steps"><li>Share your invitation link.</li><li>Your friend tries a two-minute pause.</li><li>Explore and keep going at your own pace.</li></ol><label for="referral-url">Your demo invitation link</label><input class="referral-input" id="referral-url" readonly value="${h(referralUrl())}"><div class="actions"><button class="btn" onclick="copyInvitation()">Copy invitation link</button><button class="btn secondary" onclick="shareInvitation()">Share with a friend</button></div><p id="referral-status" role="status">${h(referralStatus)}</p><p class="hint">Demo referral program. No rewards, account attribution, clicks or sign-ups are tracked. Only a random demo link code is stored on this device; no contacts are collected.</p>`;
 return `<div class="modalback" onclick="closeModal()"><section class="modal community-modal" role="dialog" aria-modal="true" aria-label="${title}" onclick="event.stopPropagation()"><button class="x" aria-label="Close dialog" onclick="closeModal()">✕</button><div class="eyebrow">A little guidance. A little company.</div><h2>${title}</h2>${body}</section></div>`;
}
function inviteCard(){return `<section class="section invite-section"><div class="card invite-card"><span class="pill">BETTER WITH COMPANY</span><h2>Make a little room for a friend.</h2><p>Share a free practice with someone you know. No pressure to join a program. Just a gentle place to begin, together.</p><button class="btn" onclick="openModal('referral')">Invite a friend →</button><span class="hint">Demo invitations · no rewards or referral tracking</span></div></section>`;}
function invitationBanner(){const ref=new URLSearchParams(location.search).get('ref');return /^demo-[a-f0-9]{12}$/.test(ref||'')?`<aside class="invitation-banner"><span class="pill">A FRIEND INVITED YOU</span><h2>A quiet beginning, shared with you.</h2><p>Try a free two-minute pause. No account needed. This is a demo invitation; no referral is tracked.</p><button class="btn" onclick="openModal('practice')">Try my first pause</button></aside>`:'';}
