(function(root){
  'use strict';
  const fields=['id','asset','threat','owner','likelihood','impact','treatment','status'];
  function score(likelihood,impact){
    if(!Number.isInteger(likelihood)||!Number.isInteger(impact)||likelihood<1||likelihood>5||impact<1||impact>5)throw new Error('Ratings must be integers from 1 to 5');
    return likelihood*impact;
  }
  function level(value){return value>=15?'critical':value>=10?'high':value>=5?'medium':'low';}
  function validate(row){
    if(!row||typeof row!=='object')throw new Error('Invalid risk');
    const out={};
    for(const key of ['id','asset','threat','owner','treatment']){
      if(typeof row[key]!=='string'||row[key].length>(key==='treatment'?1000:200))throw new Error('Invalid '+key);
      out[key]=row[key].trim();
    }
    if(!out.id||!out.asset||!out.threat||!out.owner)throw new Error('Required fields are missing');
    score(row.likelihood,row.impact);
    out.likelihood=row.likelihood;out.impact=row.impact;
    if(!['open','treating','accepted','closed'].includes(row.status))throw new Error('Invalid status');
    out.status=row.status;return out;
  }
  function parseBackup(text){
    const data=JSON.parse(text);
    if(data.version!==1||!Array.isArray(data.risks)||data.risks.length>500)throw new Error('Unsupported backup');
    const rows=data.risks.map(validate);
    if(new Set(rows.map(r=>r.id)).size!==rows.length)throw new Error('Duplicate IDs');
    return rows;
  }
  function cell(value){
    let s=String(value);
    // Protect spreadsheet users from formula injection, including whitespace-prefixed formulas.
    if(/^[\s]*[=+@-]/.test(s)||/^[\t\r]/.test(s))s="'"+s;
    return '"'+s.replace(/"/g,'""')+'"';
  }
  function csv(rows){
    return '\uFEFF'+[fields.concat(['score','level']).join(','),...rows.map(r=>fields.map(k=>cell(r[k])).concat([score(r.likelihood,r.impact),level(score(r.likelihood,r.impact))]).join(','))].join('\r\n');
  }
  const api={score,level,validate,parseBackup,csv};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.RiskCore=api;
})(typeof window==='undefined'?this:window);
