import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read=(x)=>fs.readFileSync(path.join(root,x),'utf8');
const catalog=JSON.parse(read('data/catalog.json'));
const html=read('index.html'),js=read('app.js'),css=read('styles.css');
const count=(group)=>catalog.products.filter(p=>p.category===group).length;

test('snapshot contains 85 commerce-enabled products',()=>{
  assert.equal(catalog.snapshot,'2026-10-07');
  assert.equal(catalog.products.length,85);
  assert.equal(catalog.count,85);
});
test('category parity matches approved catalog',()=>{
  assert.equal(count('kisscut'),15);
  assert.equal(count('sticker'),52);
  assert.equal(count('paper'),7);
  assert.equal(count('set'),7);
  assert.equal(count('object'),3);
  assert.equal(count('tape'),1);
});
test('every product has a local image, localized name and price',()=>{
  for(const p of catalog.products){
    assert.match(p.id,/^AD-/);
    assert.match(p.image,/^\.\/assets\//);
    assert.ok(fs.existsSync(path.join(root,p.image)),p.image);
    for(const locale of ['ko','en','ja']){
      assert.ok(p.name[locale]?.length>0,p.id+' '+locale+' name');
      assert.ok(Number.isFinite(Number(p.price[locale])) && p.price[locale]>0,p.id+' '+locale+' price');
    }
  }
});
test('all static images referenced in render code exist',()=>{
  const names=[...js.matchAll(/asset\('([^']+)'\)/g)].map(m=>m[1]);
  for(const name of new Set(names))assert.ok(fs.existsSync(path.join(root,'assets',name)),'Missing '+name);
});
test('preview has six distinct layouts/locales and clear no-commerce boundary',()=>{
  assert.match(js,/home:homepage,info:infopage,shop:shopPage,apps:appsPage,compare:comparePage/);
  assert.match(js,/MARKET_LIVE/);
  assert.match(js,/noCheckout/);
  assert.match(js,/state\.bag\.push/);
  assert.doesNotMatch(js,/fetch\('https?:\/\//);
});
test('page is index-blocked and responsive',()=>{
  assert.match(html,/noindex,nofollow,noarchive/);
  assert.match(read('robots.txt'),/Disallow: \//);
  assert.match(css,/@media\(max-width:540px\)/);
  assert.match(css,/prefers-reduced-motion/);
});
