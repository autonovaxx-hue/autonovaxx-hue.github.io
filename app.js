let active = [...VEHICLES], onlyPhotos=false, onlyWarranty=false, onlyDealer=true;
const euro = n => new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n);
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
function imgUrl(name){return "https://autonovaxx-hue.github.io/autonovax/"+encodeURIComponent(name);}
function favs(){return JSON.parse(localStorage.getItem("autonovaxFavs")||"[]");}
function toggleFav(id){let f=favs(); f=f.includes(id)?f.filter(x=>x!==id):[...f,id]; localStorage.setItem("autonovaxFavs",JSON.stringify(f)); renderCars(); updateFavCount();}
function updateFavCount(){document.getElementById("favCount").textContent=favs().length;}
function fillSelect(id, values){const s=document.getElementById(id); [...new Set(values)].sort().forEach(v=>{let o=document.createElement("option");o.value=v;o.textContent=v;s.appendChild(o);});}
function init(){
 fillSelect("makeFilter",VEHICLES.map(v=>v.make));
 fillSelect("modelFilter",VEHICLES.map(v=>v.model));
 updateFavCount(); renderCars();
}
function applyFilters(){
 const make=makeFilter.value, model=modelFilter.value, price=+priceFilter.value||Infinity, km=+kmFilter.value||Infinity, year=+yearFilter.value||0, fuel=fuelFilter.value, gear=gearFilter.value, body=bodyFilter.value, color=colorFilter.value, hp=+hpFilter.value||0;
 active=VEHICLES.filter(v=>(!make||v.make===make)&&(!model||v.model===model)&&v.price<=price&&v.km<=km&&v.year>=year&&(!fuel||v.fuel===fuel)&&(!gear||v.gear===gear)&&(!body||v.body===body)&&(!color||v.color===color)&&v.hp>=hp&&( !onlyPhotos || v.photos?.length )&&(!onlyWarranty||v.warranty)&&(!onlyDealer||v.dealer));
 renderCars();
 document.getElementById("coches").scrollIntoView({behavior:"smooth"});
}
function renderCars(){
 let a=[...active];
 const sort=sortFilter?.value||"featured";
 if(sort==="priceAsc")a.sort((x,y)=>x.price-y.price);
 if(sort==="priceDesc")a.sort((x,y)=>y.price-x.price);
 if(sort==="kmAsc")a.sort((x,y)=>x.km-y.km);
 if(sort==="yearDesc")a.sort((x,y)=>y.year-x.year);
 resultCount.textContent=`${a.length} ${a.length===1?"vehículo":"vehículos"}`;
 const f=favs();
 carsGrid.innerHTML=a.map(v=>`<article class="car-card">
 <div class="car-photo" style="background-image:url('${imgUrl(v.image)}')">
 ${v.featured?'<span class="badge">DESTACADO</span>':''}
 <button class="heart ${f.includes(v.id)?"on":""}" onclick="toggleFav('${v.id}')">♥</button>
 </div>
 <div class="car-info"><p class="brand">${esc(v.make)}</p><h3>${esc(v.model)}</h3><p class="version">${esc(v.version)}</p>
 <div class="chips"><span>${v.year}</span><span>${v.km.toLocaleString("es-ES")} km</span><span>${v.fuel}</span><span>${v.gear}</span></div>
 <div class="price">${euro(v.price)}</div><div class="card-actions"><a class="btn btn-dark" href="vehicle.html?id=${encodeURIComponent(v.id)}">Ver vehículo</a><button class="compare" onclick="addCompare('${v.id}')">Comparar</button></div></div></article>`).join("");
}
function toggleOnlyPhotos(v){onlyPhotos=v;applyFilters()} function toggleOnlyWarranty(v){onlyWarranty=v;applyFilters()} function toggleOnlyDealer(v){onlyDealer=v;applyFilters()}
function addCompare(id){localStorage.setItem("autonovaxCompare",JSON.stringify([id]));alert("Vehículo añadido al comparador.");}
function openLogin(){loginModal.classList.add("show")} function closeLogin(){loginModal.classList.remove("show")}
init();