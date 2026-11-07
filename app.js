/* ISMS Risk Register Lite — Morteza Rajabi. MIT. */
(()=>{'use strict';
const $=s=>document.querySelector(s),C=RiskCore,KEY='isms-risk-register-lite:v1';
let language='en',risks=[],editing=null,cellFilter=null,removing=null;
const dictionary={
eyebrow:['INFORMATION SECURITY / SMALL TOOL, CLEAR PRIORITIES','امنیت اطلاعات / ابزاری کوچک، اولویت‌هایی روشن'],title:['Make risk visible.','ریسک را شفاف ببین.'],lede:['Identify what matters. Score the exposure. Decide what happens next.','دارایی را بشناس. ریسک را بسنج. اقدام بعدی را مشخص کن.'],local:['Local to this browser','ذخیره در همین مرورگر'],total:['Total risks','کل ریسک‌ها'],priority:['High / critical · active','بالا / بحرانی · فعال'],progress:['In treatment','در حال کاهش'],closed:['Closed','بسته‌شده'],register:['Your risk register','دفتر ثبت ریسک'],add:['+ Add risk','+ افزودن ریسک'],searchLabel:['Search risks','جستجوی ریسک'],filterLabel:['Filter severity','فیلتر سطح ریسک'],risk:['Asset / threat','دارایی / تهدید'],owner:['Owner','مسئول'],score:['Score','امتیاز'],status:['Status','وضعیت'],actions:['Actions','عملیات'],backup:['↓ Backup','↓ پشتیبان'],restore:['↑ Restore','↑ بازیابی'],matrix:['Where risks sit','نقشهٔ ریسک‌ها'],likelihood:['Likelihood','احتمال'],impact:['Impact →','اثر →'],matrixHint:['Cell count includes all risks except closed. Select a cell to filter the register.','تعداد هر خانه شامل همهٔ ریسک‌ها به‌جز موارد بسته‌شده است. برای فیلتر روی خانه بزن.'],clearCell:['Clear matrix filter','حذف فیلتر ماتریس'],method:['How scoring works','روش امتیازدهی'],methodText:["Score = likelihood × impact (1–5 each). Likelihood: rare → almost certain. Impact: negligible → severe. These are illustrative thresholds; agree your organization's criteria before use. Accepted risks still appear on the map.",'امتیاز = احتمال × اثر (هرکدام ۱ تا ۵). احتمال از نادر تا تقریباً قطعی؛ اثر از ناچیز تا شدید. این آستانه‌ها نمونه‌اند؛ پیش از استفاده معیارهای سازمان را توافق کنید. ریسک‌های پذیرفته‌شده نیز روی نقشه دیده می‌شوند.'],emptyHelp:['New here? Try fictional examples, then add your own risks.','برای شروع، نمونه‌های فرضی را ببین و بعد ریسک‌های خودت را ثبت کن.'],examples:['Load sample risks','افزودن نمونه‌های فرضی'],privacy:['Stored only in this browser, with no account or server. Back up regularly. Shared devices can expose local data. This is a lightweight working register, not a certification assessment.','اطلاعات فقط در این مرورگر ذخیره می‌شوند؛ بدون حساب و سرور. مرتب پشتیبان بگیر. روی دستگاه مشترک، دیگران می‌توانند داده‌ها را ببینند. این ابزار دفتر کاری سبک است و ارزیابی صدور گواهینامه نیست.'],asset:['Asset','دارایی'],threat:['Threat / risk scenario','تهدید / سناریوی ریسک'],treatment:['Treatment / next action','اقدام اصلاحی / گام بعدی'],save:['Save risk','ذخیرهٔ ریسک'],removeTitle:['Remove this risk?','این ریسک حذف شود؟'],removeText:['This removes the record from this browser. Export a backup first if you need it.','این رکورد از مرورگر حذف می‌شود. در صورت نیاز ابتدا پشتیبان بگیر.'],cancel:['Cancel','انصراف'],remove:['Remove','حذف'],edit:['Edit','ویرایش'],all:['All levels','همهٔ سطوح'],low:['Low','کم'],medium:['Medium','متوسط'],high:['High','بالا'],critical:['Critical','بحرانی'],open:['Open','باز'],treating:['In treatment','در حال کاهش'],accepted:['Accepted','پذیرفته‌شده'],empty:['No risks yet. Add a risk or load the fictional examples below.','هنوز ریسکی ثبت نشده. ریسک جدید یا نمونه‌های فرضی را اضافه کن.'],noMatch:['No risks match these filters.','ریسکی با این فیلترها پیدا نشد.'],saved:['Risk saved in this browser.','ریسک در این مرورگر ذخیره شد.'],storageError:['Could not save locally. Your last saved data is unchanged. Export a backup or check browser storage permissions.','ذخیرهٔ محلی انجام نشد؛ دادهٔ ذخیره‌شدهٔ قبلی تغییری نکرده است. پشتیبان بگیر یا مجوز ذخیره‌سازی مرورگر را بررسی کن.'],loadError:['Saved data could not be loaded. It has not been overwritten. Restore a valid backup or review browser storage.','دادهٔ ذخیره‌شده خوانده نشد و بازنویسی نشده است. پشتیبان معتبر بازیابی کن یا حافظهٔ مرورگر را بررسی کن.'],invalid:['Enter an asset, threat and owner, with ratings from 1 to 5.','دارایی، تهدید و مسئول را وارد کن؛ امتیازها باید بین ۱ و ۵ باشند.'],badImport:['Invalid backup. Use a version 1 JSON backup, up to 500 risks and 2 MB.','پشتیبان نامعتبر است. فایل JSON نسخهٔ ۱ با حداکثر ۵۰۰ ریسک و ۲ مگابایت انتخاب کن.'],removed:['Risk removed.','ریسک حذف شد.'],limit:['This small register supports up to 500 risks.','این دفتر کوچک حداکثر ۵۰۰ ریسک می‌پذیرد.']};
const t=k=>dictionary[k]?.[language==='fa'?1:0]||k;
const num=n=>new Intl.NumberFormat(language==='fa'?'fa-IR':'en-US').format(n);
const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function notice(message){$('#notice').textContent=message;}
let loadBlocked=false;
try{const saved=localStorage.getItem(KEY);if(saved)risks=C.parseBackup(saved);language=localStorage.getItem(KEY+':lang')==='fa'?'fa':'en';}catch{loadBlocked=true;}
function persist(next){
  if(loadBlocked){notice(t('loadError'));return false;}
  try{localStorage.setItem(KEY,JSON.stringify({version:1,risks:next}));risks=next;return true;}catch{notice(t('storageError'));return false;}
}
function applyLanguage(){
 document.documentElement.lang=language;document.documentElement.dir=language==='fa'?'rtl':'ltr';
 document.querySelectorAll('[data-i]').forEach(el=>el.textContent=t(el.dataset.i));
 $('#lang').textContent=language==='en'?'فارسی':'English';
 $('#search').placeholder=language==='en'?'Search asset, threat or owner…':'جستجوی دارایی، تهدید یا مسئول…';
 $('#filter').querySelectorAll('option').forEach(o=>o.textContent=t(o.value));
 const l=language==='en'?['Rare','Unlikely','Possible','Likely','Almost certain']:['نادر','بعید','ممکن','محتمل','تقریباً قطعی'];
 const i=language==='en'?['Negligible','Minor','Moderate','Major','Severe']:['ناچیز','جزئی','متوسط','زیاد','شدید'];
 for(const [name,labels] of [['likelihood',l],['impact',i]]){const el=$(`[name=${name}]`),old=el.value||'3';el.innerHTML=labels.map((s,k)=>`<option value="${k+1}">${num(k+1)} · ${s}</option>`).join('');el.value=old;}
 const st=$('[name=status]'),old=st.value||'open';st.innerHTML=['open','treating','accepted','closed'].map(k=>`<option value="${k}">${t(k)}</option>`).join('');st.value=old;
 $('#cancel').setAttribute('aria-label',t('cancel'));$('#matrix').setAttribute('aria-label',language==='en'?'5 by 5 risk matrix':'ماتریس ریسک ۵ در ۵');
 render();if(loadBlocked)notice(t('loadError'));
}
function render(){
 const query=$('#search').value.trim().toLowerCase(),filter=$('#filter').value;
 const visible=risks.filter(r=>(filter==='all'||C.level(C.score(r.likelihood,r.impact))===filter)&&(!cellFilter||(r.likelihood===cellFilter[0]&&r.impact===cellFilter[1]&&r.status!=='closed'))&&[r.asset,r.threat,r.owner,r.treatment].some(s=>s.toLowerCase().includes(query))).sort((a,b)=>C.score(b.likelihood,b.impact)-C.score(a.likelihood,a.impact));
 $('#total').textContent=num(risks.length);$('#priority').textContent=num(risks.filter(r=>r.status!=='closed'&&r.status!=='accepted'&&C.score(r.likelihood,r.impact)>=10).length);$('#progress').textContent=num(risks.filter(r=>r.status==='treating').length);$('#closed').textContent=num(risks.filter(r=>r.status==='closed').length);
 $('#rows').innerHTML=visible.map(r=>{const s=C.score(r.likelihood,r.impact),level=C.level(s);return `<tr><td><strong dir="auto">${e(r.asset)}</strong><small dir="auto">${e(r.threat)}</small></td><td dir="auto">${e(r.owner)}</td><td><span class="badge ${level}" title="${r.likelihood} × ${r.impact}">${num(s)} · ${t(level)}</span></td><td><span class="status">${t(r.status)}</span></td><td><div class="row-actions"><button data-edit="${e(r.id)}" aria-label="${t('edit')}: ${e(r.asset)}">${t('edit')}</button><button data-remove="${e(r.id)}" aria-label="${t('remove')}: ${e(r.asset)}">×</button></div></td></tr>`;}).join('');
 $('#empty').hidden=visible.length>0;$('#empty').textContent=t(risks.length?'noMatch':'empty');$('#count').textContent=language==='en'?`${visible.length} of ${risks.length} risks`:`${num(visible.length)} از ${num(risks.length)} ریسک`;
 $('#csv').disabled=!risks.length;$('#backup').disabled=!risks.length;$('#clear-cell').hidden=!cellFilter;
 let cells='';for(let l=5;l>=1;l--)for(let i=1;i<=5;i++){const count=risks.filter(r=>r.status!=='closed'&&r.likelihood===l&&r.impact===i).length;cells+=`<button class="${C.level(C.score(l,i))} ${count?'has-risks':''}" data-l="${l}" data-i="${i}" aria-pressed="${!!cellFilter&&cellFilter[0]===l&&cellFilter[1]===i}" aria-label="${t('likelihood')} ${num(l)}, ${t('impact').replace(' →','')} ${num(i)}: ${num(count)}" title="${l} × ${i} = ${l*i}">${count?num(count):'·'}</button>`;}$('#matrix').innerHTML=cells;
}
function preview(){const s=C.score(Number($('[name=likelihood]').value),Number($('[name=impact]').value));$('#preview').textContent=`${t('score')}: ${num(s)} / 25 · ${t(C.level(s))}`;}
function editor(id=null){
 editing=id;const row=risks.find(r=>r.id===id);$('#risk-form').reset();
 if(row)for(const k of ['asset','threat','owner','likelihood','impact','treatment','status'])$(`[name=${k}]`).value=row[k];
 else{$('[name=likelihood]').value='3';$('[name=impact]').value='3';}
 $('#form-title').textContent=t(row?'edit':'add');$('#form-error').textContent='';preview();$('#editor').showModal();$('[name=asset]').focus();
}
$('#add').onclick=()=>{if(risks.length>=500){notice(t('limit'));return;}editor();};
$('#cancel').onclick=()=>$('#editor').close();
$('#risk-form').addEventListener('input',preview);
$('#risk-form').onsubmit=event=>{
 event.preventDefault();const data=Object.fromEntries(new FormData(event.target));
 try{const row=C.validate({...data,id:editing||crypto.randomUUID(),likelihood:Number(data.likelihood),impact:Number(data.impact)});const next=editing?risks.map(r=>r.id===editing?row:r):[...risks,row];if(persist(next)){$('#editor').close();render();notice(t('saved'));}else $('#form-error').textContent=t(loadBlocked?'loadError':'storageError');}catch{$('#form-error').textContent=t('invalid');}
};
$('#rows').onclick=event=>{const edit=event.target.closest('[data-edit]'),remove=event.target.closest('[data-remove]');if(edit)editor(edit.dataset.edit);if(remove){removing=remove.dataset.remove;$('#confirm').returnValue='cancel';$('#confirm').showModal();}};
$('#confirm').addEventListener('close',()=>{if($('#confirm').returnValue==='remove'&&persist(risks.filter(r=>r.id!==removing))){render();notice(t('removed'));}removing=null;});
$('#matrix').onclick=event=>{const button=event.target.closest('button[data-l]');if(button){const next=[Number(button.dataset.l),Number(button.dataset.i)];cellFilter=cellFilter&&cellFilter[0]===next[0]&&cellFilter[1]===next[1]?null:next;render();$('#matrix').querySelector(`[data-l="${next[0]}"][data-i="${next[1]}"]`).focus();}};
$('#clear-cell').onclick=()=>{cellFilter=null;render();};$('#search').oninput=render;$('#filter').onchange=render;
$('#lang').onclick=()=>{language=language==='en'?'fa':'en';try{localStorage.setItem(KEY+':lang',language);}catch{}notice('');applyLanguage();};
function download(name,content,type){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('#csv').onclick=()=>download('isms-risks.csv',C.csv(risks),'text/csv;charset=utf-8');
$('#backup').onclick=()=>download('isms-risks-backup.json',JSON.stringify({version:1,risks},null,2),'application/json');
$('#restore').onclick=()=>$('#file').click();
$('#file').onchange=async event=>{const file=event.target.files[0];if(!file)return;try{if(file.size>2*1024*1024)throw Error();const incoming=C.parseBackup(await file.text()),known=new Set(risks.map(r=>r.id)),newRows=incoming.filter(r=>!known.has(r.id));if(risks.length+newRows.length>500)throw Error();if(loadBlocked){notice(t('loadError'));return;}if(persist([...risks,...newRows])){render();notice(language==='en'?`Restored ${newRows.length} risks. Existing IDs were kept unchanged.`:`${num(newRows.length)} ریسک بازیابی شد. شناسه‌های موجود تغییری نکردند.`);}}catch{notice(t('badImport'));}finally{event.target.value='';}};
$('#examples').onclick=()=>{
 const samples=[{id:'sample-backup',asset:'Oracle backup repository',threat:'Unverified backups may fail during recovery',owner:'Database team',likelihood:3,impact:5,treatment:'Run a restore drill; verify recovery time and evidence.',status:'open'},{id:'sample-pipeline',asset:'CI/CD pipeline',threat:'Long-lived deployment token could be exposed',owner:'DevSecOps team',likelihood:3,impact:4,treatment:'Use short-lived identity and restrict deployment permissions.',status:'treating'},{id:'sample-access',asset:'Service desk',threat:'Inactive user accounts retain access',owner:'IT operations',likelihood:2,impact:3,treatment:'Review accounts quarterly and automate offboarding.',status:'open'}];
 const known=new Set(risks.map(r=>r.id)),next=samples.filter(r=>!known.has(r.id));if(risks.length+next.length>500){notice(t('limit'));return;}if(persist([...risks,...next])){render();notice(language==='en'?'Fictional examples loaded.':'نمونه‌های فرضی اضافه شدند.');}
};
applyLanguage();
})();
