async function initTech(){let e=document.querySelector(".tech-matter_container");if(!e)return;await loadScript("https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js");let t=new IntersectionObserver(function(t,i){t.forEach(t=>{t.isIntersecting&&(renderTech(e),i.unobserve(t.target),console.log("done"))})},{});t.observe(e)}function renderTech(e){if(!e)return;let t=window.innerWidth,i=t<600,r=t<992&&t>600,n=i?-200:-550;var c=Matter.Engine,a=Matter.Render,s=Matter.Runner,l=Matter.Bodies,o=Matter.Composite,u=c.create(),d=a.create({element:e,engine:u,options:{width:e.clientWidth,height:e.clientHeight,background:"transparent",wireframes:!1,showAngleIndicator:!1,pixelRatio:"auto"}});[...document.querySelectorAll(".tech-matter_logos img")].forEach(function(t){let c=t.attributes.render.value,a,s,d=document.createElement("svg");d.src=t.src,"big"==c&&(a=77,s=1.5,r&&(a=62,s=1.2),i&&(a=37,s=.7)),"medium"==c&&(a=62,s=1.2,r&&(a=52,s=1),i&&(a=34,s=.65)),"small"==c&&(a=56,s=1.1,r&&(a=47,s=.9),i&&(a=29,s=.55));let m=l.circle(e.clientWidth/2,n,a||100,{friction:.3,restitution:.2,render:{sprite:{texture:t.src,yScale:s||2,xScale:s||2}}});o.add(u.world,m)});var m=l.rectangle(e.clientWidth/2,e.clientHeight+30,1500,60,{isStatic:!0,opacity:0});let g=l.rectangle(-30,e.clientHeight/2,60,5*e.clientHeight,{isStatic:!0}),h=l.rectangle(e.clientWidth+30,e.clientHeight/2,60,5*e.clientHeight,{isStatic:!0}),$=l.rectangle(e.clientWidth/2,0,1500,60,{isStatic:!0});m.render.opacity=0,g.render.opacity=0,h.render.opacity=0,$.render.opacity=0,o.add(u.world,[m,g,h]);let f=Matter.Mouse.create(d.canvas),p=Matter.MouseConstraint.create(u,{mouse:f,constraint:{stiffness:.2,render:{visible:!1}}});o.add(u.world,p),p.mouse.element.removeEventListener("mousewheel",p.mouse.mousewheel),p.mouse.element.removeEventListener("DOMMouseScroll",p.mouse.mousewheel),a.run(d);var v=s.create();s.run(v,u),setTimeout(function(){o.add(u.world,[$])},2e3)}function initProcess(){let e=document.querySelector(".process_component");if(!e)return;let t=e.querySelectorAll(".process_text"),i=[...e.querySelectorAll(".process_img, .how-slide-wrap.is-v11"),];t[0].classList.add("is-active"),i.forEach((e,i)=>{let r=t[i];ScrollTrigger.create({trigger:e,start:"top center",end:"bottom center",onEnter(){t.forEach(e=>e.classList.remove("is-active")),r.classList.add("is-active")},onEnterBack(){t.forEach(e=>e.classList.remove("is-active")),r.classList.add("is-active")}})})}function initFAQ(){let e=document.querySelector(".faq_bg-gradient");e&&gsap.to(e,{scrollTrigger:{trigger:e,start:"top bottom",end:"top -25%",scrub:1},width:"100%",borderRadius:0})}function trackVisibility(){let e=document.querySelectorAll("[data-track-visibility]");if(!e.length)return;let t=new IntersectionObserver(function(e){e.forEach(e=>{e.isIntersecting?e.target.classList.add("is-visible"):e.target.classList.remove("is-visible")})},{});e.forEach(e=>t.observe(e))}function changeDevImages(){let e=document.querySelectorAll(".talent_bg_dev-images");!e.length>0||e.forEach((t,i)=>{let r=e[i].querySelectorAll("img"),n=1;setInterval(()=>{r.forEach(e=>e.classList.remove("is-visible")),r[n].classList.add("is-visible"),2==n?n=0:n++},5e3)})}function trackLoginBtn(){let e=document.querySelector("#login-btn");if(!e||!e.href.includes("login")||location.href.includes("engineer"))return;let{utm:t}=customTrackData,i,r;customTrackData.first_page&&((i=document.createElement("a")).href=customTrackData.first_page,i=i.pathname),customTrackData.last_page&&((r=document.createElement("a")).href=customTrackData.last_page,r=r.pathname);let n=!1;(location.href.includes("gpt")||i.includes("gpt"))&&(n=!0);let c=`https://${location.href.includes("staging")?"dev.d1y3udqq47tapp.amplifyapp.com":"www.client.micro1.ai"}/login?utm_campaign=${t.utm_campaign?t.utm_campaign:""}&utm_medium=${t.utm_medium?t.utm_medium:""}&utm_source=${t.utm_source?t.utm_source:""}&utm_content=${t.utm_content?t.utm_content:""}&first_page=${i||""}&last_page=${r||""}&source=${n?"gpt-vetting":"search-talent"}`;e.href=c}window.addEventListener("DOMContentLoaded",function(){window.innerWidth>992&&changeDevImages(),trackVisibility(),trackLoginBtn(),initTech(),void 0!==window.gsap&&(ScrollTrigger.config({normalizeScroll:!0}),window.innerWidth>992&&(initProcess(),initFAQ()))});