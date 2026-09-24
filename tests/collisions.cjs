const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync(require('path').join(__dirname,'../index.html'),'utf8');
const scripts=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(x=>x[1]);
for(const s of scripts)new vm.Script(s);
const ctx=vm.createContext({console,performance,Math,Map,Set,Array,Object,Error});vm.runInContext(scripts.find(s=>s.includes('typeof exports')),ctx);
const source=scripts[scripts.length-1];
const setup=`const T=THREE,scene=new T.Group(),avenues=[-160,0,160],streets=[-180,-90,0,90,180];let seed=17;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
function box(x,y,z,w,h,d,c,g){const o=new T.Object3D();o.position.set(x,y,z);if(g)g.add(o);return o;}function line(){}function mat(){return new T.MeshBasicMaterial();}
function car(){return new T.Group();}function boxTruck(){const g=new T.Group();g.userData.halfLength=3.5;g.userData.halfWidth=1.225;return g;}
const lights=[],lampMesh={instanceColor:{}},lampColors=[],walkMaterials={};let elapsed=0,running=false,px=1000,pz=1000,speed=0,travelHeading=0,doorAngle=0,hornCooldown=0;function toast(){}function tone(){}
const smooth=(a,b,rate,dt)=>a+(b-a)*(1-Math.exp(-rate*dt));function angleDiff(a,b){return Math.atan2(Math.sin(a-b),Math.cos(a-b));}
`;
const simCode=setup+source.slice(source.indexOf('const traffic=[]'),source.indexOf('// Shared world scale'))+source.slice(source.indexOf('function signalAt'),source.indexOf('function update(dt)'));
new Function('THREE','assert', simCode+`
function audit(){const grid=new StreetGrid(),counts={vv:0,pp:0,pv:0};for(const b of [...traffic.map(c=>streetBody(c)),...peds.map(p=>streetBody(p,true))]){for(const o of grid.nearby(b))if(streetOverlap(b,o))counts[b.ped&&o.ped?'pp':b.ped||o.ped?'pv':'vv']++;grid.add(b);}return counts;}
const boxBody=(x,z,a=0)=>({x,z,a,c:Math.cos(a),s:Math.sin(a),w:1.5,l:3.7,ped:false});
assert(streetOverlap(boxBody(0,0),boxBody(0,7.4)), 'bumper clearance');
assert(!streetOverlap(boxBody(0,0),boxBody(0,7.6)), 'separated trucks');
assert(streetOverlap(boxBody(0,0,Math.PI/4),boxBody(3,0,-Math.PI/4)), 'turning truck corners');
assert(!streetOverlap(boxBody(0,0),{x:2,z:0,w:.38,l:.38,ped:true}), 'pedestrian beside truck');
assert(streetOverlap(boxBody(0,0),{x:1.7,z:0,w:.38,l:.38,ped:true}), 'pedestrian intersects truck');
updateStreet(0);assert.deepStrictEqual(audit(),{vv:0,pp:0,pv:0});console.log('spawn',audit());
let failures=0,peak={vv:0,pp:0,pv:0},distance=0,pedDistance=0;const start=performance.now();
for(let i=0;i<60*180;i++){if(i%600===0)console.log('step',i,'ms/step',i?(performance.now()-start)/i:0);const dt=i%47===0?1/30:1/60;elapsed+=dt;const a=traffic.map(c=>[c.g.position.x,c.g.position.z]),p=peds.map(c=>[c.g.position.x,c.g.position.z]);updateStreet(dt);for(let j=0;j<a.length;j++){const d=Math.hypot(a[j][0]-traffic[j].g.position.x,a[j][1]-traffic[j].g.position.z);if(d<5)distance+=d;}for(let j=0;j<p.length;j++)pedDistance+=Math.hypot(p[j][0]-peds[j].g.position.x,p[j][1]-peds[j].g.position.z);
const r=audit();for(const k in r){peak[k]=Math.max(peak[k],r[k]);if(r[k])failures++;}}
console.log(JSON.stringify({elapsed,peak,failures,vehicleMeters:distance,pedestrianMeters:pedDistance,turns:traffic.reduce((n,c)=>n+(c.turns||0),0),msPerStep:(performance.now()-start)/10800,stats:streetStats}));if(failures)throw Error('Overlapping bodies');assert(distance>1000,'traffic must keep moving');assert(pedDistance>1000,'pedestrians must keep moving');assert(traffic.some(c=>c.turns>0),'turns must complete');
`)(ctx.THREE,assert);
