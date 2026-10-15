/* Gratko - mala pomocna skripta.
   Radi dvije stvari: kopiranje u medjuspremnik i godinu u podnozju. */

(function () {
  'use strict';

  /* ---- Kopiranje telefona i e-maila ---- */
  function kopiraj(tekst) {
    // Moderni nacin, radi na https (dakle i na gratko.hr)
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(tekst);
    }
    // Rezerva, radi kad se stranica otvori lokalno dvoklikom
    return new Promise(function (uspjeh, greska) {
      var polje = document.createElement('textarea');
      polje.value = tekst;
      polje.setAttribute('readonly', '');
      polje.style.position = 'fixed';
      polje.style.opacity = '0';
      document.body.appendChild(polje);
      polje.select();
      try {
        document.execCommand('copy') ? uspjeh() : greska();
      } catch (e) {
        greska(e);
      }
      document.body.removeChild(polje);
    });
  }

  document.querySelectorAll('[data-kopiraj]').forEach(function (gumb) {
    var izvorniTekst = gumb.textContent;
    var mjeracVremena;

    gumb.addEventListener('click', function () {
      kopiraj(gumb.dataset.kopiraj).then(
        function () { javi('Kopirano'); },
        function () { javi('Ne mogu kopirati'); }
      );
    });

    function javi(poruka) {
      gumb.textContent = poruka;
      gumb.classList.add('kopirano');
      clearTimeout(mjeracVremena);
      mjeracVremena = setTimeout(function () {
        gumb.textContent = izvorniTekst;
        gumb.classList.remove('kopirano');
      }, 2000);
    }
  });

  /* ---- Godina u podnozju ---- */
  var godina = document.getElementById('godina');
  if (godina) godina.textContent = new Date().getFullYear();
})();
