'use strict';

/* Adelie Draw Design Lab. Static, non-commerce preview. No requests to Cafe24 APIs. */
const LIVE = {
  home:'https://adeliedraw.com/',
  info:'https://info.adeliedraw.com/',
  shop:'https://shop.adeliedraw.com/',
  apps:'https://app.adeliedraw.com/',
  pages:'https://app.adeliedraw.com/pages/'
};
const MARKET_LIVE = {
  ko:'https://shop.adeliedraw.com/',
  en:'https://en.adeliedraw.com/',
  ja:'https://jp.adeliedraw.com/'
};
const NAV = [
  {page:'home',title:'Home',kr:'브랜드 홈'},
  {page:'info',title:'Info',kr:'작품과 브랜드'},
  {page:'shop',title:'Shop',kr:'문구 쇼핑'},
  {page:'apps',title:'Apps',kr:'디지털 문구'}
];
const GROUPS = ['all','kisscut','sticker','tape','paper','object','set'];
const COPY = {
  ko:{
    locale:'한국어',region:'대한민국 · KRW',hero:'작은 설렘을,\n매일 곁에.',heroSub:'스티커와 키스컷 테이프, 메모지, 오래 곁에 두고 싶은 종이소품. 그림 속 장면을 일상에서 다시 만나보세요.',
    feature:'가장 아델리다운 한 장.',featureSub:'빛을 따라 달라지는 색과 박의 반짝임. 스테인드글라스 키스컷 컬렉션을 가까이에서 살펴보세요.',
    shopNow:'상품 살펴보기',browse:'상품 컬렉션',count:'개 상품',search:'상품명 검색',sort:'정렬',featured:'추천순',low:'가격 낮은순',high:'가격 높은순',name:'이름순',
    all:'전체',kisscut:'키스컷',sticker:'스티커',tape:'마스킹테이프',paper:'메모·종이',object:'소품',set:'세트·팩',
    view:'자세히',add:'담아보기 +',viewMore:'더 보기',empty:'검색 결과가 없습니다.',cart:'미리 담기',bag:'미리 담은 상품',bagEmpty:'아직 담은 상품이 없습니다.',clear:'비우기',
    preview:'비교용 정적 시안입니다. 주문 및 결제는 진행되지 않습니다.',demoAdd:'비교용 장바구니에 담았습니다.',notLive:'미리보기 전용',
    realStore:'운영 쇼핑몰에서 보기',noCheckout:'결제 기능이 없는 디자인 시안입니다.'
  },
  en:{
    locale:'English',region:'International · USD',hero:'Little joys,\nfor every day.',heroSub:'Illustrated stickers, kiss-cut tape, memo pads and small stationery goods. A tiny piece of the scene, to keep with you.',
    feature:'Little windows of light.',featureSub:'Raised foil details and vivid colours. Get closer to the Stained Glass Kiss-Cut collection.',
    shopNow:'Browse stationery',browse:'The collection',count:'products',search:'Search products',sort:'Sort',featured:'Featured',low:'Price: low to high',high:'Price: high to low',name:'Name A–Z',
    all:'All',kisscut:'Kiss-cut',sticker:'Stickers',tape:'Tape',paper:'Memo & paper',object:'Objects',set:'Sets',
    view:'Details',add:'Add to demo +',viewMore:'Show more',empty:'No matching products.',cart:'Demo bag',bag:'Demo bag',bagEmpty:'Your demo bag is empty.',clear:'Clear',
    preview:'Design preview only. Checkout is not available.',demoAdd:'Added to the demo bag.',notLive:'PREVIEW ONLY',
    realStore:'Visit live store',noCheckout:'This is a design study. Checkout is not available.'
  },
  ja:{
    locale:'日本語',region:'日本 · JPY',hero:'小さなときめきを、\n毎日のそばに。',heroSub:'ステッカー、キスカットテープ、メモや紙もの。絵の中の小さな景色を、暮らしの中へ。',
    feature:'光をまとった、小さな窓。',featureSub:'箔の輝きと彩りを楽しめる、ステンドグラスのキスカットコレクションをご紹介します。',
    shopNow:'商品を見る',browse:'商品一覧',count:'点',search:'商品を検索',sort:'並び替え',featured:'おすすめ順',low:'価格の安い順',high:'価格の高い順',name:'商品名順',
    all:'すべて',kisscut:'キスカット',sticker:'ステッカー',tape:'マスキングテープ',paper:'メモ・紙もの',object:'雑貨',set:'セット',
    view:'詳しく',add:'デモに追加 +',viewMore:'もっと見る',empty:'該当する商品はありません。',cart:'デモカート',bag:'デモカート',bagEmpty:'まだ商品がありません。',clear:'クリア',
    preview:'デザイン比較用プレビューです。注文・決済はできません。',demoAdd:'デモカートに追加しました。',notLive:'プレビューのみ',
    realStore:'公式ショップへ',noCheckout:'デザイン確認用のため、決済機能はありません。'
  }
};
const app = document.getElementById('app');
let catalog = [];
const state = {
  page:'home',lang:'ko',group:'all',search:'',sort:'featured',limit:12,
  menu:false,dialog:null,bag:[],toast:null
};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset=(s)=>'./assets/'+s;
const route=(page,lang)=>{
  const q=new URLSearchParams({page:page});
  if(page==='shop' && lang && lang!=='ko')q.set('lang',lang);
  return '?'+q.toString();
};
const img=(src,alt,klass,loading)=>{
  return '<img src="'+esc(src)+'" alt="'+esc(alt||'')+'"'+(klass?' class="'+esc(klass)+'"':'')+' loading="'+(loading||'lazy')+'">';
};
const a=(url,label,klass,external)=>{
  return '<a href="'+esc(url)+'"'+(klass?' class="'+klass+'"':'')+(external?' target="_blank" rel="noopener noreferrer"':'')+'>'+label+'</a>';
};
function navigate(page,lang){
  const dest=route(page,lang||'ko');
  if(location.search!==dest)history.pushState({},'',dest);
  state.page=page;
  state.lang=page==='shop'?(lang||'ko'):'ko';
  state.search='';state.group='all';state.sort='featured';state.limit=12;state.menu=false;state.dialog=null;
  draw();
  window.scrollTo({top:0,behavior:'instant'});
}
function readRoute(){
  const search=new URLSearchParams(location.search);
  const page=search.get('page');
  const lang=search.get('lang');
  state.page=['home','info','shop','apps','compare'].includes(page)?page:'home';
  state.lang=state.page==='shop'&&['ko','en','ja'].includes(lang)?lang:'ko';
}
function currentOriginal(){
  return state.page==='shop'?MARKET_LIVE[state.lang]:(LIVE[state.page]||LIVE.home);
}
function masthead(){
  const current=state.page;
  const nav=NAV.map(n=>a(route(n.page,n.page==='shop'?state.lang:null),n.title,
    '',false).replace('<a ', '<a data-route="'+n.page+'" '+(current===n.page?'aria-current="page" ':'') )).join('')+
    a(route('compare'),'Compare / 비교').replace('<a ','<a data-route="compare" '+(current==='compare'?'aria-current="page" ':'') );
  const compare=a(route('compare'),'비교 페이지 →','compare-link',false).replace('<a ','<a data-route="compare" ');
  return '<div class="study-bar"><div class="study-label"><i class="study-dot" aria-hidden="true"></i><strong>DESIGN LAB · 01</strong><span>OPERATIONAL WEBSITE UNCHANGED</span></div>'+
  '<span>별도 배포 · '+a(route('compare'),'원본 / 개선안 비교','',false)+'</span></div>'+
  '<header class="global-header"><div class="header-inner">'+
    '<button class="menu-toggle" type="button" aria-label="메뉴" aria-expanded="'+state.menu+'" data-action="menu">'+iconMenu()+'</button>'+
    a(route('home'),img(asset('logo.png'),'Adelie Draw'),'logo').replace('<a ','<a data-route="home" ')+
    '<nav class="global-nav'+(state.menu?' is-open':'')+'" aria-label="전체 탐색">'+nav+'</nav>'+
    '<div class="header-actions">'+(state.page==='shop'?'<button class="quick-add" type="button" data-action="bag">'+esc(COPY[state.lang].bag)+' <span class="cart-count">'+state.bag.length+'</span></button>':'')+
    compare+'</div></div></header>';
}
function iconMenu(){
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 6h20M2 12h20M2 18h20"/></svg>';
}
function footer(){
  return '<footer class="global-footer"><div class="shell"><div class="footer-grid">'+
    '<div class="footer-brand">'+img(asset('logo.png'),'Adelie Draw')+'<p>Illustration & stationery, made from little moments worth keeping. <br>시안은 운영 서비스와 완전히 분리되어 있습니다.</p></div>'+
    '<div class="footer-column"><h3>PREVIEW PAGES</h3>'+NAV.map(n=>a(route(n.page),n.title+' ↗')).join('')+'</div>'+
    '<div class="footer-column"><h3>OFFICIAL SITES</h3>'+a(LIVE.home,'Brand home ↗','',true)+a(LIVE.info,'Info ↗','',true)+a(LIVE.shop,'Shop ↗','',true)+a(LIVE.apps,'Apps ↗','',true)+'</div></div>'+
    '<div class="footer-bottom"><span>© 2026 Adelie Draw · Unofficial public preview for side-by-side design review</span><span>STATIC PREVIEW · NO ORDERS · NO TRACKING</span></div></div></footer>';
}
function floatLink(){
  if(state.page==='compare')return '';
  return '<aside class="preview-floating" aria-label="비교 바로가기"><span>DESIGN STUDY</span>'+
    a(currentOriginal(),'운영 원본 ↗','',true)+a(route('compare'),'비교 ↗').replace('<a ','<a data-route="compare" ')+'</aside>';
}
function homepage(){
  return '<main id="main"><section class="shell hero-home">'+
    '<div class="hero-copy"><span class="eyebrow">Adelie Draw · illustration & stationery</span>'+
      '<h1>마음에 담긴<br>장면을, 일상으로.</h1>'+
      '<p class="copy">펭귄과 작은 동물들, 계절의 풍경을 그리고 스티커와 메모지, 종이소품으로 이어갑니다. 아델리드로우의 그림을 천천히 둘러보세요.</p>'+
      a(route('shop'),'문구 컬렉션 보기 <span aria-hidden="true">↗</span>','primary-button').replace('<a ','<a data-route="shop" ')+'</div>'+
    '<figure class="hero-art" style="margin:0">'+img(asset('hero.webp'),'케이크를 나누는 펭귄들','', 'eager')+
      '<figcaption class="art-caption"><span>01 / ADELIE PENGUINS · LITTLE MOMENTS</span><span>ILLUSTRATION BY ADELIE DRAW</span></figcaption></figure>'+
    '</section>'+
    '<div class="shell intro-rail"><span>DRAWN WITH AFFECTION · EST. 2020</span><p>그림에서 시작한, 매일 사용하는 작은 문구</p></div>'+
    '<section class="shell section"><div class="section-heading"><div><span class="eyebrow">Selected works</span><h2>한 장의 그림에서<br>시작되는 이야기.</h2></div><p>일러스트와 문구를 하나의 컬렉션으로. 실제 작품과 제품을 중심으로 둘러볼 수 있도록 구성했습니다.</p></div>'+
    '<div class="spotlight">'+img(asset('collection-v2.webp'),'스테인드글라스 키스컷 테이프 대표 컬렉션')+
      '<div class="spotlight-text"><span class="eyebrow">Signature collection · Stained glass</span><h2>빛을 머금은<br>작은 창.</h2>'+
      '<p class="copy">금박과 은박이 더해진 스테인드글라스 키스컷 테이프. 도안을 한 장씩 떼어 일상 속 작은 장면에 붙여보세요.</p>'+
      a(route('info'),'대표 작품 둘러보기 ↗','line-link').replace('<a ','<a data-route="info" ')+'</div></div></section>'+
    '<section class="shell section" style="padding-top:25px"><div class="section-heading"><div><span class="eyebrow">Explore Adelie</span><h2>찾고 싶은 장면으로.</h2></div></div>'+
    '<div class="browse-grid">'+
    browse('info','illustration-sea.webp','Info','작품 · 컬렉션 · 전시 이력')+
    browse('shop','art-sticker.webp','Shop','스티커 · 키스컷 · 종이소품')+
    browse('apps','illustration-flowers.webp','Apps','디지털 스티커 · Adelie Pages')+
    browse('compare','illustration-cafe.webp','Design study','현재 화면과 개선 제안 비교')+
    '</div></section>'+
    '<section class="paper-band"><div class="shell band-inner"><div><span class="eyebrow">A little story, every day</span><h2>좋아하는 그림을<br>오래 곁에 두는 방법.</h2><p>세상의 작은 장면을 그림과 문구로 기록합니다.</p></div>'+
    a(route('shop'),'상품 살펴보기 ↗','primary-button').replace('<a ','<a data-route="shop" ')+'</div></section></main>';
}
function browse(page,file,title,subtitle){
  return a(route(page),img(asset(file),title)+'<div><h3>'+title+' <span style="color:var(--blue)">↗</span></h3><p>'+subtitle+'</p></div>','browse-link').replace('<a ','<a data-route="'+page+'" ');
}
function infopage(){
  return '<main id="main"><section class="shell page-intro"><div><span class="eyebrow">The world of Adelie Draw</span><h1>오래 바라보고 싶은<br>작은 장면들.</h1><p class="copy">감정과 계절을 따라 그려진 선, 작은 동물들의 다정한 순간. 그림은 물건이 되고, 다시 누군가의 하루에 놓입니다.</p></div>'+
    '<div class="meta">ILLUSTRATION & STATIONERY<br>KOREA · EST. 2020<br><br>작품 / 대표 컬렉션 / 행사와 입점</div></section>'+
    '<section class="shell"><div class="info-visual">'+img(asset('portfolio-hero.webp'),'아델리 펭귄들이 있는 카페')+
      '<div class="side-images">'+img(asset('illustration-sea.webp'),'바다와 구름')+img(asset('illustration-flowers.webp'),'꽃과 동물 일러스트')+'</div></div>'+
    '<div class="figure-caption"><span>SELECTED ILLUSTRATIONS</span><span>Adelie Draw · illustration series</span></div></section>'+
    '<section class="shell section"><div class="section-heading"><div><span class="eyebrow">Signature collection</span><h2>스테인드글라스<br>키스컷 컬렉션.</h2></div><p>V1과 V2. 빛과 색의 인상에서 시작한 작은 도안들이 키스컷 테이프가 되었습니다.</p></div>'+
    '<div class="collection-grid">'+
    gallery('collection-v1.webp','Stained Glass V1','낮의 창')+
    gallery('collection-v2.webp','Stained Glass V2','밤의 창')+
    gallery('art-botanical.webp','Selected drawings','식물과 계절')+
    '</div></section>'+
    '<section class="paper-band"><div class="shell spotlight">'+
    img(asset('kisscut-photo-1.webp'),'스테인드글라스 키스컷 테이프 실물 사용 사진')+
    '<div class="spotlight-text"><span class="eyebrow">From illustration to stationery</span><h2>그림이 손끝에 닿을 때.</h2>'+
    '<p class="copy">그림의 색과 선을 실물 소재에 맞게 다듬어 테이프와 스티커, 종이 문구로 만듭니다. 질감과 가공의 차이를 가까이에서 볼 수 있도록 구성했습니다.</p>'+
    a(route('shop'),'쇼핑몰에서 제품 살펴보기 ↗','line-link').replace('<a ','<a data-route="shop" ')+'</div></div></section>'+
    '<section class="shell section info-history"><div><span class="eyebrow">Exhibitions & collaborations</span><h2>이어 온 기록.</h2><p class="copy">출전, 입점, 협업과 컬렉션 활동을 한눈에 볼 수 있도록 정리한 소개 영역입니다.</p>'+
    a(LIVE.info+'#exhibitions','운영 사이트에서 전체 이력 확인 ↗','line-link',true)+'</div>'+
    '<div class="history-items">'+historyItem('LATEST','스테인드글라스 키스컷 V2 공개','새로운 장면으로 확장된 스테인드글라스 컬렉션')+
    historyItem('ONLINE','하반기 온라인 마켓','시즌별 문구와 신제품의 온라인 전개')+
    historyItem('EVENTS','서일페 판매 제품 온라인 미니마켓','행사 전개와 이후 온라인 판매')+
    historyItem('COLLAB','몽몽스베쮸 × 아델리드로우','브랜드 협업 및 제품 활동')+
    '</div></section>'+
    '<section class="paper-band"><div class="shell band-inner"><div><span class="eyebrow">For organizers & buyers</span><h2>행사·입점·협업에 관한<br>이야기를 기다립니다.</h2><p>포트폴리오와 활동 이력을 확인하고 문의할 수 있습니다.</p></div>'+
    a(LIVE.info+'#organizers','입점 및 협업 정보 ↗','primary-button',true)+'</div></section></main>';
}
function gallery(file,title,caption){
  return '<a href="'+esc(LIVE.info)+'" target="_blank" rel="noopener noreferrer">'+img(asset(file),title)+'<div class="gallery-title"><span><strong>'+esc(title)+'</strong><br>'+esc(caption)+'</span><span>↗</span></div></a>';
}
function historyItem(time,title,desc){
  return '<article><time>'+esc(time)+'</time><div><h3>'+esc(title)+'</h3><p>'+esc(desc)+'</p></div></article>';
}
function shopPage(){
  const L=COPY[state.lang],lang=state.lang;
  const notices={ko:'스티커와 키스컷, 오래 곁에 두고 싶은 작은 문구',en:'Illustrated paper goods from Korea',ja:'韓国から届く、小さなイラスト文具'};
  const imgAlt={ko:'실제 사용 예시 사진',en:'Stationery in use',ja:'文具の使用イメージ'};
  return '<main id="main"><section class="shell shop-hero">'+
    '<div class="shop-hero-copy"><span class="eyebrow">Adelie Draw · stationery</span><h1>'+esc(L.hero).replace(/\n/g,'<br>')+'</h1>'+
    '<p class="copy">'+esc(L.heroSub)+'</p>'+a('#catalog',esc(L.shopNow)+' ↘','primary-button')+'</div>'+
    '<div class="shop-hero-photo">'+img(asset('kisscut-photo-1.webp'),imgAlt[lang],'','eager')+'<div class="photo-note">'+esc(notices[lang])+'</div></div></section>'+
    '<div class="shell market-switch"><span class="market-label">MARKET</span>'+
    ['ko','en','ja'].map(k=>a(route('shop',k),esc(COPY[k].region),k===lang?'is-active':'').replace('<a ','<a data-market="'+k+'" ')).join('')+
    '</div>'+
    '<section id="catalog" class="shell catalog-section"><div class="catalog-title"><div><span class="eyebrow">Adelie collection · 2026</span><h2>'+esc(L.browse)+'</h2></div>'+
    '<p id="result-count"></p></div>'+
    '<div class="catalog-tools"><div id="product-filters" class="filter-scroll" aria-label="카테고리 필터">'+GROUPS.map(g=>filterButton(g)).join('')+'</div>'+
    '<div class="catalog-search"><label class="sr-only" for="product-search">'+esc(L.search)+'</label>'+
    '<input id="product-search" type="search" placeholder="'+esc(L.search)+'" value="'+esc(state.search)+'" autocomplete="off">'+
    '<label class="sr-only" for="product-sort">'+esc(L.sort)+'</label><select id="product-sort">'+
    [['featured',L.featured],['low',L.low],['high',L.high],['name',L.name]].map(([v,t])=>'<option value="'+v+'"'+(state.sort===v?' selected':'')+'>'+esc(t)+'</option>').join('')+
    '</select></div></div>'+
    '<div id="product-grid" class="products"></div><div id="load-more-slot"></div>'+
    '<div class="preview-note"><strong>'+esc(L.notLive)+'</strong><span>'+esc(L.preview)+'</span></div></section>'+
    '<section class="paper-band"><div class="shell spotlight">'+img(asset('kisscut-photo-2.webp'),imgAlt[lang])+
    '<div class="spotlight-text"><span class="eyebrow">Stained glass kiss-cut tape</span><h2>'+esc(L.feature)+'</h2>'+
    '<p class="copy">'+esc(L.featureSub)+'</p>'+a(MARKET_LIVE[lang],esc(L.realStore)+' ↗','line-link',true)+'</div></div></section>'+
    '</main>';
}
function filterButton(group){
  const l=COPY[state.lang];
  const count=group==='all'?catalog.length:catalog.filter(p=>p.category===group).length;
  return '<button class="filter-btn" type="button" data-group="'+group+'" aria-pressed="'+(state.group===group)+'">'+esc(l[group])+' <span class="count">'+count+'</span></button>';
}
function currency(value,lang){
  if(!Number.isFinite(Number(value)))return '—';
  if(lang==='ko')return Number(value).toLocaleString('ko-KR')+'원';
  if(lang==='ja')return '¥'+Number(value).toLocaleString('ja-JP');
  return '$'+Number(value).toLocaleString('en-US',{minimumFractionDigits:Number.isInteger(value)?0:1,maximumFractionDigits:2});
}
function filtered(){
  const lang=state.lang,search=state.search.trim().toLocaleLowerCase();
  let list=catalog.filter(p=>(state.group==='all'||p.category===state.group) &&
    (!search||p.name[lang].toLocaleLowerCase().includes(search)||p.name.ko.toLocaleLowerCase().includes(search)));
  if(state.sort==='low')list.sort((a,b)=>a.price[lang]-b.price[lang]);
  else if(state.sort==='high')list.sort((a,b)=>b.price[lang]-a.price[lang]);
  else if(state.sort==='name')list.sort((a,b)=>a.name[lang].localeCompare(b.name[lang],lang));
  return list;
}
function productCard(p){
  const L=COPY[state.lang];const name=esc(p.name[state.lang]);
  return '<article class="product-card">'+
    '<button class="product-photo" type="button" data-product="'+esc(p.id)+'" aria-label="'+name+' '+esc(L.view)+'">'+
    img(p.image,p.name[state.lang])+'<span class="product-eye">'+esc(L.view)+' ↗</span></button>'+
    '<div class="product-meta"><span>'+esc(L[p.category])+'</span><span>'+esc(p.id.replace('AD-','').slice(0,5))+'</span></div>'+
    '<button class="product-title" type="button" data-product="'+esc(p.id)+'">'+name+'</button>'+
    '<div class="product-bottom"><span class="product-price">'+currency(p.price[state.lang],state.lang)+'</span>'+
    '<button class="quick-add" type="button" data-add="'+esc(p.id)+'">'+esc(L.add)+'</button></div></article>';
}
function updateProducts(){
  if(state.page!=='shop')return;
  const list=filtered(),L=COPY[state.lang];
  const count=document.getElementById('result-count');
  const grid=document.getElementById('product-grid');
  const more=document.getElementById('load-more-slot');
  if(!count||!grid||!more)return;
  count.textContent=String(list.length)+' '+L.count;
  grid.innerHTML=list.length?list.slice(0,state.limit).map(productCard).join(''):
    '<div class="empty-results">'+esc(L.empty)+'</div>';
  more.innerHTML=list.length>state.limit?
    '<div style="display:flex;justify-content:center;margin-top:36px"><button class="secondary-button" data-action="more" type="button">'+esc(L.viewMore)+' ↓</button></div>':'';
}
function appsPage(){
  return '<main id="main"><section class="shell app-stage"><div>'+
    '<div class="app-icon-line">'+img(asset('app-icon.png'),'Adelie Pages 앱 아이콘')+'<span>ADELIE PAGES · DIGITAL STATIONERY</span></div>'+
    '<h1>좋아하는 문구로,<br>나다운 한 장.</h1>'+
    '<p class="copy">스티커를 고르고, 사진과 글을 더하고, 하루의 장면을 나만의 페이지로 꾸미는 Adelie Pages. 실물 문구의 즐거움을 디지털에서도 이어갑니다.</p>'+
    a('#app-walkthrough','앱 화면 둘러보기 ↘','primary-button')+'<p class="small-copy" style="margin-top:15px">현재 출시 준비 중 · 공식 페이지의 상태를 따릅니다.</p></div>'+
    '<div class="app-stage-art">'+img(asset('app-compose.webp'),'Adelie Pages에서 사진과 글, 스티커를 꾸미는 화면','','eager')+
    img(asset('app-pages.webp'),'Adelie Pages에서 완성된 페이지를 모아 보는 화면')+'</div></section>'+
    '<section id="app-walkthrough" class="paper-band"><div class="shell"><div class="section-heading"><div><span class="eyebrow">How Adelie Pages works</span><h2>고르고, 꾸미고, 모으는<br>세 가지 장면.</h2></div></div>'+
    '<div class="app-steps">'+
    appStep('01','app-home.webp','그림 고르기','아델리드로우의 스티커팩을 살펴보고 좋아하는 그림을 선택합니다.')+
    appStep('02','app-compose.webp','나만의 한 장','사진과 글, 스티커를 배치해 오늘의 장면을 기록합니다.')+
    appStep('03','app-pages.webp','페이지 모으기','완성한 페이지를 모아 언제든 다시 펼쳐봅니다.')+
    '</div></div></section>'+
    '<section class="shell section"><div class="section-heading"><div><span class="eyebrow">Sticker pack preview</span><h2>종이 밖에서도<br>계속되는 문구 취향.</h2></div>'+
    '<p>기존 Adelie Pages 소개에 공개된 스티커팩과 이미지를 활용했습니다.</p></div>'+
    '<div class="app-collection">'+
    appPack('app-lemon.webp','레몬 파운드 케이크','스티커 25개')+
    appPack('art-sticker-cafe.webp','홈스윗홈','스티커 39개')+
    appPack('art-sticker.webp','봄여우 리뉴얼','스티커 35개')+
    '</div></section>'+
    '<section class="paper-band"><div class="shell band-inner"><div><span class="eyebrow">Official product page</span><h2>기존 앱 소개와<br>화면을 비교해보세요.</h2></div>'+
    a(LIVE.pages,'운영 Adelie Pages 페이지 ↗','primary-button',true)+'</div></section></main>';
}
function appStep(i,filename,title,description){
  return '<div class="app-step">'+img(asset(filename),title)+'<span class="step-no">'+i+' / 03</span><h3>'+title+'</h3><p>'+description+'</p></div>';
}
function appPack(filename,title,count){
  return '<div class="app-pack">'+img(asset(filename),title)+'<h3>'+title+'</h3><span>'+count+'</span></div>';
}
function comparePage(){
  const items=[
    ['home','01','브랜드 메인','지금: 브랜드 소개와 사이트별 진입 카드. 시안: 이미지와 스토리를 한 화면에 엮고 탐색 링크를 간결하게 배치.',LIVE.home],
    ['info','02','Info · 작품 포트폴리오','지금: 풍부한 작품과 행사 이력. 시안: 모바일 넘침을 없애고 대표 컬렉션·활동 기록을 명확히 분리.',LIVE.info],
    ['shop','03','Shop · 한국어','지금: 일러스트 배너가 모바일 첫 화면 대부분 차지. 시안: 배너 높이 단축, 검색·필터 간소화, 상품 카드 가시성 강화.',MARKET_LIVE.ko,'ko'],
    ['shop','04','Shop · English','상품명, 이미지, 가격을 영문 정본에 맞춰 표시. 정적 프리뷰이므로 실제 주문 데이터는 사용하지 않음.',MARKET_LIVE.en,'en'],
    ['shop','05','Shop · 日本語','일문 상품명과 엔화 가격 사용. 긴 안내문과 상품 필터의 밀도를 조정.',MARKET_LIVE.ja,'ja'],
    ['apps','06','Apps · Adelie Pages','지금: 앱 서랍·링크 중심. 시안: 앱 화면을 전면 배치하고 사용 과정과 스티커팩을 강조.',LIVE.apps]
  ];
  return '<main id="main" class="shell"><div class="compare-intro"><span class="eyebrow">A / B DESIGN REVIEW · 2026.10.08</span>'+
  '<h1>지금의 아델리드로우와,<br>다음 디자인.</h1>'+
  '<p class="copy">운영 중인 사이트는 건드리지 않았습니다. 아래에서 각 운영 원본과 독립적으로 배포된 개선안을 열어 화면 구성과 모바일 반응형을 직접 비교할 수 있습니다.</p></div>'+
  '<div class="compare-grid">'+items.map(([page,no,title,description,live,lang])=>
    '<article class="compare-card"><div class="compare-top"><span class="no">STUDY '+no+'</span><span class="small-copy">ORIGINAL / PROPOSAL</span></div>'+
    '<h2>'+title+'</h2><p>'+description+'</p><div class="compare-links">'+a(live,'운영 원본 ↗','',true)+
    a(route(page,lang),'개선 시안 →').replace('<a ','<a data-nav="'+page+'" data-lang="'+(lang||'ko')+'" ')+'</div></article>').join('')+
  '</div><section class="paper-band" style="margin-bottom:80px"><div style="padding:30px"><span class="eyebrow">BOUNDARY</span>'+
  '<h2>별도 GitHub Pages 사이트</h2><p class="copy">원본 사이트의 DNS, Cafe24 스킨, 주문 정보, GitHub Pages 배포 설정을 변경하지 않습니다. 시안의 장바구니는 메모리 상의 데모이며 결제 기능은 없습니다.</p></div></section></main>';
}
function renderDialog(){
  if(!state.dialog)return '';
  const kind=state.dialog.kind, L=COPY[state.lang];
  let body='';
  if(kind==='product'){
    const p=catalog.find(x=>x.id===state.dialog.id);
    if(!p)return '';
    body='<div class="modal-content">'+img(p.image,p.name[state.lang])+
      '<div style="padding:10px 0 0"><span class="eyebrow">'+esc(L[p.category])+'</span><h2>'+esc(p.name[state.lang])+'</h2>'+
      '<div style="font-size:23px;font-weight:700;margin-bottom:25px">'+currency(p.price[state.lang],state.lang)+'</div>'+
      '<p class="copy">'+esc(L.noCheckout)+'</p>'+
      '<button class="primary-button" type="button" data-add="'+esc(p.id)+'">'+esc(L.add)+'</button>'+
      '<p style="margin-top:18px">'+a(MARKET_LIVE[state.lang],esc(L.realStore)+' ↗','line-link',true)+'</p></div></div>';
  }else{
    const counts=new Map();
    for(const id of state.bag)counts.set(id,(counts.get(id)||0)+1);
    const items=[...counts.entries()].map(([id,count])=>{
      const p=catalog.find(x=>x.id===id);
      if(!p)return '';
      return '<div style="display:flex;align-items:center;gap:12px;border-top:1px solid var(--line);padding:14px 0">'+
        img(p.image,p.name[state.lang],'', 'lazy').replace('<img ','<img style="width:65px;height:65px;object-fit:contain" ')+
        '<div style="flex:1"><strong>'+esc(p.name[state.lang])+'</strong><br><span class="small-copy">'+currency(p.price[state.lang],state.lang)+' × '+count+'</span></div>'+
        '<button class="quick-add" type="button" data-remove="'+esc(id)+'" aria-label="Remove one">−</button></div>';
    }).join('');
    body='<div style="padding:40px 32px"><span class="eyebrow">'+esc(L.notLive)+'</span><h2>'+esc(L.bag)+'</h2>'+
      '<p class="small-copy">'+esc(L.preview)+'</p>'+(items||'<p class="empty-results">'+esc(L.bagEmpty)+'</p>')+
      (items?'<button class="secondary-button" type="button" data-action="clear">'+esc(L.clear)+'</button>':'')+'</div>';
  }
  return '<div class="modal-backdrop" data-dismiss="true"><div class="modal" role="dialog" aria-modal="true" aria-label="'+esc(kind==='bag'?L.bag:'Product details')+'">'+
    '<button class="modal-close" type="button" data-action="close" aria-label="닫기">×</button>'+body+'</div></div>';
}
function showToast(message){
  const el=document.createElement('div');
  el.className='toast';
  el.role='status';el.textContent=message;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),2300);
}
function draw(){
  const page=state.page;
  app.innerHTML=masthead()+
    ({home:homepage,info:infopage,shop:shopPage,apps:appsPage,compare:comparePage}[page])()+
    footer()+floatLink()+renderDialog();
  document.title=(page==='shop'?'Shop '+COPY[state.lang].locale:page==='home'?'Home':page[0].toUpperCase()+page.slice(1))+' — Adelie Draw Design Lab';
  document.documentElement.lang=state.page==='shop'?(state.lang==='ja'?'ja':state.lang):'ko';
  document.body.classList.toggle('modal-open',!!state.dialog);
  if(page==='shop')updateProducts();
}
function updateFilters(){
  const box=document.getElementById('product-filters');
  if(box)box.innerHTML=GROUPS.map(g=>filterButton(g)).join('');
  updateProducts();
}
function closeDialog(){state.dialog=null;draw();}
document.addEventListener('click',e=>{
  const element=e.target.closest('button,a');
  if(!element){
    if(e.target.matches('.modal-backdrop'))closeDialog();
    return;
  }
  if(element.dataset.route){
    e.preventDefault();navigate(element.dataset.route,element.dataset.route==='shop'?state.lang:'ko');return;
  }
  if(element.dataset.nav){
    e.preventDefault();navigate(element.dataset.nav,element.dataset.lang||'ko');return;
  }
  if(element.dataset.market){
    e.preventDefault();navigate('shop',element.dataset.market);return;
  }
  if(element.dataset.group){
    state.group=element.dataset.group;state.limit=12;updateFilters();return;
  }
  if(element.dataset.product){
    state.dialog={kind:'product',id:element.dataset.product};draw();return;
  }
  if(element.dataset.add){
    state.bag.push(element.dataset.add);
    const modalOpen=!!state.dialog;
    state.dialog=null;draw();
    if(modalOpen)window.scrollTo({top:0,behavior:'instant'});
    showToast(COPY[state.lang].demoAdd);return;
  }
  if(element.dataset.remove){
    const ix=state.bag.indexOf(element.dataset.remove);
    if(ix>=0)state.bag.splice(ix,1);
    state.dialog={kind:'bag'};draw();return;
  }
  switch(element.dataset.action){
    case 'menu':state.menu=!state.menu;draw();break;
    case 'bag':state.dialog={kind:'bag'};draw();break;
    case 'more':state.limit+=12;updateProducts();break;
    case 'clear':state.bag=[];state.dialog={kind:'bag'};draw();break;
    case 'close':closeDialog();break;
  }
});
document.addEventListener('input',e=>{
  if(e.target.id==='product-search'){state.search=e.target.value;state.limit=12;updateProducts();}
});
document.addEventListener('change',e=>{
  if(e.target.id==='product-sort'){state.sort=e.target.value;state.limit=12;updateProducts();}
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&state.dialog)closeDialog();
});
window.addEventListener('popstate',()=>{readRoute();state.dialog=null;draw();});
(async function init(){
  readRoute();
  try{
    const response=await fetch('./data/catalog.json',{cache:'no-cache'});
    if(!response.ok)throw new Error('catalog status '+response.status);
    const obj=await response.json();
    if(!Array.isArray(obj.products)||obj.products.length<30)throw new Error('Invalid catalog');
    catalog=obj.products;
    draw();
  }catch(error){
    console.error('Preview catalog failed',error);
    app.innerHTML='<main class="shell section"><h1>카탈로그를 불러오지 못했습니다.</h1><p>임시 미리보기의 정적 데이터 파일을 확인해 주세요.</p></main>';
  }
})();
