import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '..');
const originalRoot = '/Volumes/DevDrive/Projects';
const store = path.join(originalRoot, 'AdelieDraw_Global/adelie-cafe24-global/cafe24/theme');
const media = path.join(originalRoot, 'AdelieDraw_Global/adelie-cafe24-global/cafe24/storefront/global-prototype/assets/adelie');
const portfolio = path.join(originalRoot, '아델리드로우 포트폴리오/site/assets');
const home = path.join(originalRoot, 'adeliedraw-home/public/assets');

function readSkin(skin) {
  return JSON.parse(fs.readFileSync(path.join(store, skin, 'assets/adelie/product-catalog.json'), 'utf8'));
}
function groupOf(product) {
  const category = product.category;
  if (category === '테이프') return /키스컷|스테인드글라스/.test(product.name) ? 'kisscut' : 'tape';
  if (category === '메모지' || category === '엽서') return 'paper';
  if (category === '세트·팩') return 'set';
  if (category === '키링') return 'object';
  return 'sticker';
}
function copy(src, dest) {
  if (!fs.existsSync(src)) throw new Error('Missing source asset: ' + src);
  fs.mkdirSync(path.dirname(dest), {recursive:true});
  fs.copyFileSync(src, dest);
}
const ko=readSkin('skin17'), en=readSkin('skin18'), ja=readSkin('skin19');
const byEn=new Map(en.products.map(p=>[p.sku,p]));
const byJa=new Map(ja.products.map(p=>[p.sku,p]));
if (ko.sourceCheckedAt !== en.sourceCheckedAt || ko.sourceCheckedAt !== ja.sourceCheckedAt) {
  throw new Error('Locale catalog snapshot dates do not match');
}
const list=[];
let missing=0;
for(const p of ko.products) {
  if (!p.visible || !p.commerce?.enabled) continue;
  const english=byEn.get(p.sku), japanese=byJa.get(p.sku);
  if (!english || !japanese) throw new Error('Missing translation for '+p.sku);
  const relative=p.image.replace(/^\/assets\/adelie\//,'');
  if (relative.includes('..') || relative.startsWith('/')) throw new Error('Invalid asset path');
  const original=path.join(store,'skin17/assets/adelie',relative);
  if (!fs.existsSync(original)) {missing++;console.error('Asset missing:',relative);continue;}
  copy(original,path.join(out,'assets',relative));
  list.push({
    id:p.sku,
    category:groupOf(p),
    image:'./assets/'+relative,
    name:{ko:p.name,en:english.name,ja:japanese.name},
    price:{ko:p.price,en:english.price,ja:japanese.price}
  });
}
if (missing) throw new Error('Missing '+missing+' live product images');
const featuredWords=['가드닝','스테인드글라스','연꽃','고양이 후르츠','보태니컬','달토끼','식빵 여우','바다','우주','봄여우','꽃'];
const rank=(p)=>{
  const n=p.name.ko;
  let i=featuredWords.findIndex(w=>n.includes(w));
  return i<0?99:i;
};
list.sort((a,b)=>rank(a)-rank(b) || a.name.ko.localeCompare(b.name.ko,'ko'));
fs.mkdirSync(path.join(out,'data'),{recursive:true});
fs.writeFileSync(path.join(out,'data/catalog.json'),JSON.stringify({snapshot:ko.sourceCheckedAt,count:list.length,products:list},null,2)+'\n');
const extras=[
  [path.join(store,'skin17/assets/adelie/adelie-header-logo.png'),'logo.png'],
  [path.join(store,'skin17/assets/adelie/adeliepages-icon.png'),'app-icon.png'],
  [path.join(store,'skin17/assets/adelie/adelie-hero.webp'),'hero.webp'],
  [path.join(store,'skin17/assets/adelie/adelie-hero-mobile.webp'),'hero-mobile.webp'],
  [path.join(media,'banners/kisscut-photos/01.webp'),'kisscut-photo-1.webp'],
  [path.join(media,'banners/kisscut-photos/02.webp'),'kisscut-photo-2.webp'],
  [path.join(media,'banners/sticker-photos/01.webp'),'sticker-photo-1.webp'],
  [path.join(portfolio,'hero-1299-640f50bb.webp'),'portfolio-hero.webp'],
  [path.join(portfolio,'collection-800-b5604fee.webp'),'collection-v2.webp'],
  [path.join(portfolio,'collection-v1-800-272611c9.webp'),'collection-v1.webp'],
  [path.join(portfolio,'sea-1280-791c4300.webp'),'illustration-sea.webp'],
  [path.join(portfolio,'cafe-1280-3fc779c8.webp'),'illustration-cafe.webp'],
  [path.join(portfolio,'flowers-1096-9d5a98dd.webp'),'illustration-flowers.webp'],
  [path.join(portfolio,'v1-fruit-800-79fd3c45.webp'),'art-fruit.webp'],
  [path.join(portfolio,'v1-ocean-800-bdc6717d.webp'),'art-ocean.webp'],
  [path.join(portfolio,'v1-botanical-800-26d731a0.webp'),'art-botanical.webp'],
  [path.join(portfolio,'sticker-lemon-800-dbd578d8.webp'),'art-sticker.webp'],
  [path.join(portfolio,'sticker-cafe-800-50d658ea.webp'),'art-sticker-cafe.webp'],
  [path.join(home,'LINESeedKR-Rg.woff2'),'LINESeedKR-Rg.woff2'],
  [path.join(home,'LINESeedKR-Bd.woff2'),'LINESeedKR-Bd.woff2'],
  [path.join(home,'OFL-LINESeedKR.txt'),'OFL-LINESeedKR.txt']
];
for(const [from,to] of extras)copy(from,path.join(out,'assets',to));
console.log(JSON.stringify({catalogDate:ko.sourceCheckedAt,products:list.length,categories:list.reduce((a,p)=>(a[p.category]=(a[p.category]||0)+1,a),{}),assets:extras.length,source:'Read-only: original Cafe24 and Info project'}));
