document.addEventListener("DOMContentLoaded",function(e){navigator.serviceWorker&&navigator.serviceWorker.register("/sw.js").then(function(c){if("sync"in c){var u=document.querySelector("#new_review");if(u){var e=new URL(window.location.href),s=parseInt(e.searchParams.get("id"));u.addEventListener("submit",function(e){if(e.preventDefault(),!navigator.onLine){var r=document.querySelector("#new_review > h3"),n=document.createElement("p");n.style.color="red";n.innerHTML="You are currently offline, but your review is saved and will be reposted once you are online again!",r.after(n)}var t=document.querySelector("#name"),o=document.querySelector("#comments"),i=document.querySelector("#rating"),a={name:t.value,comments:o.value,rating:i.value,restaurant_id:s};store.outbox("readwrite").then(function(e){return e.put(a)}).then(function(){return t.value="",o.value="",i.selectedIndex=0,c.sync.register("outbox")}).catch(function(e){console.error(e),u.submit()})})}}}).catch(function(){console.log("Error in registering serviceworker")})});
