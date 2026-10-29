(function(){
  var burger=document.querySelector('.burger'), nav=document.getElementById('nav');
  var ico={open:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',close:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'};
  function setNav(open){
    if(open){var h=document.querySelector('header.site');if(h)h.classList.remove('scroll-hidden');}
    nav.classList.toggle('open',open);
    burger.classList.toggle('close',open);
    burger.setAttribute('aria-expanded',open);
    burger.setAttribute('aria-label',open?'Menu sluiten':'Menu openen');
    burger.innerHTML=open?ico.close:ico.open;
    document.body.style.overflow=open?'hidden':'';
  }
  if(burger&&nav){
    burger.addEventListener('click',function(){setNav(!nav.classList.contains('open'))});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('open'))setNav(false)});
    window.addEventListener('resize',function(){if(window.innerWidth>980&&nav.classList.contains('open'))setNav(false)});
    nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){if(nav.classList.contains('open'))setNav(false)})});
  }
  document.querySelectorAll('.dd>button').forEach(function(b){
    b.addEventListener('click',function(){
      var d=b.parentElement, o=d.classList.toggle('open'); b.setAttribute('aria-expanded',o);
    });
  });
  // Mobile drawer is moved out of the blurred header to avoid fixed-position clipping.
  var hdr=document.querySelector('header.site');
  if(hdr && nav && burger){
    var marker=document.createComment('navigation position');
    nav.parentNode.insertBefore(marker,nav);
    var closer=document.createElement('button');
    closer.type='button'; closer.className='drawer-close';
    closer.setAttribute('aria-label','Menu sluiten'); closer.textContent='×';
    nav.insertBefore(closer,nav.firstChild);
    closer.addEventListener('click',function(){setNav(false);burger.focus()});
    var mq=window.matchMedia('(max-width: 980px)');
    function placeNav(){
      if(mq.matches){if(nav.parentNode!==document.body)document.body.appendChild(nav)}
      else {if(nav.parentNode!==marker.parentNode)marker.parentNode.insertBefore(nav,marker.nextSibling);setNav(false)}
    }
    placeNav();
    if(mq.addEventListener)mq.addEventListener('change',placeNav);
    else mq.addListener(placeNav);
    var previous=window.scrollY, ticking=false;
    function onScroll(){
      var y=window.scrollY;
      if(!ticking){window.requestAnimationFrame(function(){
        var delta=y-previous;
        if(window.innerWidth<=980 && !nav.classList.contains('open') && y>130 && delta>5)hdr.classList.add('scroll-hidden');
        else if(y<90 || delta < -5 || window.innerWidth>980)hdr.classList.remove('scroll-hidden');
        hdr.classList.toggle('stuck',y>8);
        previous=y;ticking=false;
      });ticking=true;}
    }
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',function(){if(window.innerWidth>980)hdr.classList.remove('scroll-hidden')});
    burger.addEventListener('click',function(){hdr.classList.remove('scroll-hidden')});
  }
  var form=document.getElementById('offerte');
  if(form){
    var pre=new URLSearchParams(location.search).get('dienst');
    if(pre&&form.elements.dienst){Array.prototype.forEach.call(form.elements.dienst.options,function(o){if(o.text===pre)o.selected=true})}
    form.querySelectorAll('[data-send]').forEach(function(btn){
      btn.addEventListener('click',function(){
        var g=function(n){return (form.elements[n]&&form.elements[n].value||'').trim()};
        var note=document.getElementById('formnote');
        if(!g('naam')||!g('tel')||!g('dienst')){
          note.textContent='Vul uw naam, telefoonnummer en het soort dienst in.';
          note.style.color='#b00020'; (!g('naam')?form.elements.naam:!g('tel')?form.elements.tel:form.elements.dienst).focus(); return;
        }
        if(g('mail') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(g('mail'))){note.textContent='Vul een geldig e-mailadres in.';note.style.color='#b00020';form.elements.mail.focus();return;}
        if(g('tel').replace(/[^0-9]/g,'').length<8 || g('tel').replace(/[^0-9]/g,'').length>15){note.textContent='Vul een geldig telefoonnummer in.';note.style.color='#b00020';form.elements.tel.focus();return;}
        note.style.color=''; note.textContent='Bedankt. Uw bericht wordt geopend, verstuur het om uw aanvraag door te geven.';
        var lines=['Offerte-aanvraag via de website','Naam: '+g('naam'),'Telefoon: '+g('tel'),g('mail')?'E-mail: '+g('mail'):'','Dienst: '+g('dienst'),g('adres')?'Locatie: '+g('adres'):'','',g('bericht')].filter(function(l,i,a){return l!==''||(i>0&&a[i-1]!=='')});
        var text=lines.join('\n');
        if(btn.dataset.send==='wa'){
          window.open('https://wa.me/32498749332?text='+encodeURIComponent(text),'_blank','noopener');
        }else{
          location.href='mailto:Infoservice.topcleaning@gmail.com?subject='+encodeURIComponent('Offerte-aanvraag: '+g('dienst'))+'&body='+encodeURIComponent(text);
        }
      });
    });
  }
})();
