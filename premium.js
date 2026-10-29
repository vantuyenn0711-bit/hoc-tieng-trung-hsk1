(function(){'use strict';
const K={theme:'hsk1-premium-theme-v1',lessons:'hsk1-premium-lessons-v1',groups:'hsk1-premium-groups-v1',words:'hsk1-premium-words-v1',stories:'hsk1-premium-stories-v1',recent:'hsk1-premium-recent-v1'};
function load(key,fallback){try{const x=JSON.parse(localStorage.getItem(key));return x===null?fallback:x}catch(e){return fallback}}
function save(key,data){try{localStorage.setItem(key,JSON.stringify(data))}catch(e){}}
function arr(key){const a=load(key,[]);return Array.isArray(a)?a:[]}
const theme=load(K.theme,'light');
function setTheme(t){document.documentElement.dataset.theme=t;save(K.theme,t);document.querySelectorAll('[data-theme-toggle]').forEach(b=>{b.textContent=t==='dark'?'☀️ Chế độ sáng':'🌙 Chế độ tối';b.setAttribute('aria-pressed',t==='dark'?'true':'false')})}
setTheme(theme==='dark'?'dark':'light');
function touchRecent(href,label){let list=arr(K.recent).filter(x=>x&&x.href!==href);list.unshift({href,label,time:Date.now()});save(K.recent,list.slice(0,10))}
function toggleNumber(key,id){let a=arr(key),old=a.indexOf(id);if(old>=0)a.splice(old,1);else a.push(id);save(key,a);return a.includes(id)}
function button(txt,cls){const b=document.createElement('button');b.type='button';b.className=cls;b.textContent=txt;return b}
function markDone(b,yes){b.setAttribute('aria-pressed',String(!!yes));b.textContent=yes?'✓ Đã học xong':'○ Đánh dấu đã học'}
function addLessonButtons(){
 document.querySelectorAll('details.lesson,details.group').forEach(d=>{
  const match=/^(lesson|group)(\d+)$/.exec(d.id||'');if(!match)return;
  const isLesson=match[1]==='lesson',id=Number(match[2]),key=isLesson?K.lessons:K.groups;
  const container=d.querySelector('.inside');if(!container||container.querySelector('.premium-tiny-actions'))return;
  const bar=document.createElement('div');bar.className='premium-tiny-actions';const b=button('','premium-done');markDone(b,arr(key).includes(id));
  b.onclick=()=>{const yes=toggleNumber(key,id);markDone(b,yes);updateInline()};bar.append(b);
  container.insertBefore(bar,container.firstChild);
  d.addEventListener('toggle',()=>{if(d.open){const title=d.querySelector('summary span')?.textContent?.trim()||d.querySelector('summary')?.textContent?.trim()||'';touchRecent('index.html#'+d.id,title)}});
 });
 document.querySelectorAll('.word').forEach((el,i)=>{
  const name=el.querySelector('.root')?.textContent?.trim();if(!name)return;
  const id=i+1;el.id='word-'+id;const head=el.querySelector('.wordheader');if(!head||head.querySelector('.premium-save-word'))return;
  const b=button('☆','premium-save-word');b.title='Lưu từ yêu thích';b.setAttribute('aria-label','Lưu từ '+name);
  const saved=arr(K.words).some(w=>w.id===id);b.setAttribute('aria-pressed',String(saved));b.textContent=saved?'★':'☆';
  b.onclick=()=>{let words=arr(K.words).filter(w=>w&&w.id!==id);const yes=!b.matches('[aria-pressed="true"]');if(yes){words.unshift({id,cn:name,py:el.querySelector('.pinyin')?.textContent?.trim()||'',vi:el.querySelector('.meaning')?.textContent?.trim()||''})}save(K.words,words);b.setAttribute('aria-pressed',String(yes));b.textContent=yes?'★':'☆';updateInline()};
  head.appendChild(b);
 });
 if(location.hash.startsWith('#word-')){
  const target=document.getElementById(location.hash.slice(1));if(target){const parent=target.closest('details');if(parent)parent.open=true;setTimeout(()=>target.scrollIntoView({block:'center'}),180)}
 }
}
function addStoryBookmarks(){
 document.querySelectorAll('.story').forEach(card=>{
  const id=card.id||'',title=card.querySelector('.story-title strong')?.textContent?.trim()||id;
  const actions=card.querySelector('.story-body .actions');if(actions&&!actions.querySelector('.premium-save-story')){
   const b=button('☆ Lưu truyện','premium-save-story');let yes=arr(K.stories).some(x=>x.id===id);b.setAttribute('aria-pressed',String(yes));if(yes)b.textContent='★ Đã lưu truyện';
   b.onclick=()=>{let items=arr(K.stories).filter(x=>x&&x.id!==id);yes=!yes;if(yes)items.unshift({id,title});save(K.stories,items);b.setAttribute('aria-pressed',String(yes));b.textContent=yes?'★ Đã lưu truyện':'☆ Lưu truyện'};
   actions.appendChild(b);
  }
  const details=card.querySelector('details');if(details)details.addEventListener('toggle',()=>{if(details.open)touchRecent('stories.html#'+id,title)});
 });
}
function updateInline(){const e=document.querySelector('[data-premium-inline]');if(!e)return;const n=arr(K.lessons).length,g=arr(K.groups).length,s=Object.values(load('hsk1-story-progress-v1',{})).filter(Boolean).length,w=arr(K.words).length;
 e.innerHTML='<strong>Tiến độ học:</strong> '+n+'/25 bài · '+g+'/28 nhóm từ · '+s+'/16 truyện · '+w+' từ đã lưu <a href="./dashboard.html">Xem tổng quan →</a>';
}
function initDashboard(){if(!document.getElementById('dashboard'))return;
 const lessons=arr(K.lessons),groups=arr(K.groups),words=arr(K.words),savedStories=arr(K.stories),storyData=load('hsk1-story-progress-v1',{}),storyDone=Object.values(storyData||{}).filter(Boolean).length;
 const count={lessons:lessons.length,groups:groups.length,stories:storyDone,words:words.length};
 for(const [k,v] of Object.entries(count)){const e=document.getElementById('d-'+k);if(e)e.textContent=v.toLocaleString('vi-VN')}
 const total=25+28+16,done=Math.min(25,count.lessons)+Math.min(28,count.groups)+Math.min(16,count.stories),pct=Math.round(done/total*100);
 const percentage=document.getElementById('d-percentage'),bar=document.getElementById('d-progress');if(percentage)percentage.textContent=pct+'%';if(bar)bar.style.width=pct+'%';
 const recent=document.getElementById('d-recent'),wl=document.getElementById('d-saved-words'),sl=document.getElementById('d-saved-stories');
 function populate(el,list,fallback){if(!el)return;el.replaceChildren();if(!list.length){const p=document.createElement('p');p.textContent=fallback;p.className='dashboard-muted';el.appendChild(p);return}list.forEach(x=>{const a=document.createElement('a');a.href=x.href;a.textContent=x.label;el.append(a)})}
 populate(recent,arr(K.recent).slice(0,6).map(x=>({href:'./'+String(x.href||'index.html').replace(/^\.\//,''),label:x.label||'Mở bài học'})),'Chưa có bài gần đây. Hãy mở một bài hội thoại hoặc truyện để bắt đầu.');
 populate(wl,words.slice(0,24).map(x=>({href:'./index.html#word-'+x.id,label:x.cn+(x.py?' · '+x.py:'')})),'Chưa lưu từ nào. Vào mục 500 từ, bấm ☆ cạnh từ để lưu vào đây.');
 populate(sl,savedStories.slice(0,12).map(x=>({href:'./stories.html#'+x.id,label:x.title||x.id})),'Chưa lưu truyện nào. Vào truyện vui, bấm ☆ Lưu truyện để quay lại dễ dàng.');
 const reset=document.getElementById('dashboard-reset');if(reset)reset.onclick=()=>{if(!confirm('Xóa tiến độ và từ/truyện yêu thích đã lưu trên thiết bị này? Bài học trên web vẫn được giữ nguyên.'))return;Object.values(K).filter(x=>x!==K.theme).forEach(x=>{try{localStorage.removeItem(x)}catch(e){}});try{localStorage.removeItem('hsk1-story-progress-v1')}catch(e){};location.reload()};
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-theme-toggle]');if(b)setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark')});
function init(){document.querySelectorAll('[data-theme-toggle]').forEach(b=>{b.textContent=document.documentElement.dataset.theme==='dark'?'☀️ Chế độ sáng':'🌙 Chế độ tối'});addLessonButtons();addStoryBookmarks();updateInline();initDashboard()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.addEventListener('pageshow',()=>{updateInline();if(document.getElementById('dashboard'))initDashboard()});
})();