// Run with: node tests/engine.test.cjs
// Tests use synthetic candles ONLY to validate execution logic; no synthetic performance is served to users.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const app=source.split('<script>')[1].split('</script>')[0].replace(/attach\(\);\s*$/,'');
const tests=`
assert.equal(STRATEGIES.length,8);
rebuildSubsets();
assert.equal(subsets.length,255);
assert.equal(subsets.filter(x=>x.size===1).length,8);
assert.equal(subsets.filter(x=>x.size===2).length,28);
assert.equal(subsets.filter(x=>x.size===3).length,56);
assert.equal(subsets.filter(x=>x.size===8).length,1);
const custom={id:'custom-test1',name:'Pullback & recovery',logic:'all',rules:[{type:'rsi2below',value:20},{type:'aboveSma',value:10}],exit:{type:'rsi2above',value:70},hold:9,enabled:true};
customStrategies.push(validCustom(custom));rebuildSubsets();
assert.equal(subsets.length,511);
assert.equal(subsets.filter(x=>x.size===1).length,9);
assert.equal(subsets.filter(x=>x.size===2).length,36);
assert.equal(subsets.filter(x=>x.size===3).length,84);
assert.equal(subsets.find(x=>x.mask===256).name,'Pullback & recovery');
assert.throws(()=>validCustom({...custom,rules:[{type:'arbitrary-code',value:0}]}),/Invalid entry rule/);
assert.throws(()=>validCustom({...custom,rules:[{type:'highBreak',value:-3}]}),/Invalid entry rule/);
assert.throws(()=>validCustom({...custom,hold:500}),/Custom holding period/);
assert.throws(()=>validCustom({...custom,rules:[]}),/1–6/);
customStrategies.push(validCustom({...custom,id:'custom-test2',enabled:true}));
customStrategies.push(validCustom({...custom,id:'custom-test3',enabled:true}));
customStrategies.push(validCustom({...custom,id:'custom-test4',enabled:true}));
rebuildSubsets();assert.equal(subsets.length,4095);
customStrategies.splice(1);rebuildSubsets();
assert.equal(parseCsv('Date,Open,High,Low,Close,Volume\\n2026-01-01,1,2,0.5,1.5,100').length,2);
const series=Array.from({length:210},(_,i)=>({date:new Date(Date.UTC(2025,0,1+i)).toISOString().slice(0,10),open:100,high:101,low:99,close:100,volume:1000}));
series[202]={...series[202],open:100,high:125,low:86};
const sig=Array.from({length:210},()=>Array(9).fill(false));sig[201][1]=true;
const obj={bars:series,close:series.map(b=>b.close),ma10:Array(210).fill(100),ma20:Array(210).fill(100),rsi2:Array(210).fill(50),rsi14:Array(210).fill(50),vol20:Array(210).fill(1000),signal:sig};
let trades=simulate(obj,subsets.find(x=>x.mask===2),{stop:8,target:20,holding:30,cost:0},'TEST');
assert.equal(trades.length,1);
assert.equal(trades[0].entryDate,series[202].date); // Signal from day 201 enters on 202 open
assert.equal(trades[0].reason,'Stop-loss'); // 202 hit stop AND target: stop first
assert.ok(Math.abs(trades[0].returnPct+8)<1e-9);
assert.ok(Math.abs(trades[0].pnl+80)<1e-9);
series[202]={...series[202],open:100,high:102,low:95};
series[203]={...series[203],open:85,high:100,low:80};
trades=simulate(obj,subsets.find(x=>x.mask===2),{stop:8,target:20,holding:30,cost:0},'TEST');
assert.equal(trades[0].reason,'Stop gap');
assert.equal(trades[0].exit,85); // Adverse gap fills at open, not theoretical stop
assert.ok(Math.abs(trades[0].returnPct+15)<1e-9);
const s=describeResult(subsets[1],trades);
assert.equal(s.wins+s.losses+s.flat,s.n);
assert.equal(s.wr,0);
// Same-bar custom entry is entered only on next day's open.
const custSubset=subsets.find(x=>x.mask===256);sig[201][8]=true;
series[202]={...series[202],open:100,high:102,low:98};series[203]={...series[203],open:100,high:102,low:98};
obj.rsi2[202]=81;
let customTrades=simulate(obj,custSubset,{stop:8,target:20,holding:30,cost:0},'TEST');
assert.equal(customTrades[0].entryDate,series[202].date);
assert.equal(customTrades[0].exitDate,series[203].date);
assert.equal(customTrades[0].reason,'Custom exit: Pullback & recovery');
obj.ma10[201]=99;assert.ok(evaluateCondition({type:'aboveSma',value:10},obj,201,null,new Map()));
assert.equal(evaluateCondition({type:'highBreak',value:5},obj,201,null,new Map()),false);
assert.equal(evaluateCondition({type:'relStrength',value:0},obj,201,null,new Map()),false);
const empty=describeResult(subsets[0],[]);
assert.ok(Number.isNaN(empty.wr)); // No signals is N/A, not zero wins
console.log('PASS: 8+custom methods, 255–4095 subsets, rule validation, next-open entries/exits, conservative stop, gap logic, P/L and empty sample.');
`;
const ctx={assert,Date,Number,Math,Array,Map,Set,String,JSON,console,Promise,setTimeout,clearTimeout,window:{},document:{getElementById:(id)=>({value:'',textContent:''})},localStorage:{getItem:()=>null}};
vm.runInNewContext(app+'\n'+tests,ctx,{filename:'index.html script + tests'});