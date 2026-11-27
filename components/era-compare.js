/*
  "Fashion Through Changing Times": pick two eras and compare them side by side.
  Content comes from data/era-comparison.json. No libraries. This file never changes
  the timeline; its "drawn from" links only ask it to open a slide (window.timeline.goToId).
*/
(function () {
  var root = document.getElementById('era-compare');
  if (!root) return;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // Slide headlines, used as the "drawn from" link text.
  function loadHeadlines() {
    return fetch('data/timeline.json').then(function (r) { return r.json(); }).then(function (t) {
      var map = {};
      t.events.forEach(function (e) { map[e.unique_id] = e.text.headline; });
      return map;
    }).catch(function () { return {}; });
  }

  Promise.all([
    fetch('data/era-comparison.json').then(function (r) { return r.json(); }),
    loadHeadlines()
  ]).then(function (res) { build(res[0], res[1]); })
    .catch(function () {
      root.querySelector('.ec-results').textContent = 'The era comparison could not be loaded.';
    });

  function build(data, headlines) {
    var eras = data.eras;
    var byId = {};
    eras.forEach(function (e, i) { e.index = i + 1; byId[e.id] = e; });
    var pickersEl = root.querySelector('.ec-pickers');
    var results = root.querySelector('.ec-results');
    var groups = [
      { name: 'ec-first', legend: 'First era' },
      { name: 'ec-second', legend: 'Second era' }
    ];

    groups.forEach(function (g) {
      var fs = el('fieldset', 'ec-picker');
      fs.appendChild(el('legend', null, g.legend));
      var opts = el('div', 'ec-options');
      eras.forEach(function (era) {
        var label = el('label', 'ec-option ec-era-' + era.index);
        var input = document.createElement('input');
        input.type = 'radio'; input.name = g.name; input.value = era.id;
        var span = el('span');
        span.appendChild(el('strong', null, 'Part ' + era.numeral + ' · ' + era.years));
        span.appendChild(document.createTextNode(era.title));
        label.appendChild(input); label.appendChild(span);
        opts.appendChild(label);
      });
      fs.appendChild(opts);
      pickersEl.appendChild(fs);
    });

    root.querySelector('.ec-clear').addEventListener('click', function () {
      root.querySelectorAll('.ec-option input').forEach(function (i) { i.checked = false; });
      update();
    });
    root.addEventListener('change', function (e) {
      if (e.target.matches('.ec-option input')) update();
    });
    update();

    function picked(name) {
      var i = root.querySelector('input[name="' + name + '"]:checked');
      return i ? byId[i.value] : null;
    }

    function update() {
      var a = picked('ec-first'), b = picked('ec-second');
      // The same era can't be picked on both sides.
      root.querySelectorAll('input[name="ec-first"]').forEach(function (i) { i.disabled = !!b && i.value === b.id; });
      root.querySelectorAll('input[name="ec-second"]').forEach(function (i) { i.disabled = !!a && i.value === a.id; });
      root.querySelector('.ec-clear').hidden = !a && !b;

      results.innerHTML = '';
      if (!a || !b) {
        var msg = !a && !b ? 'Choose one era under “First era” and another under “Second era” to compare them here.'
          : 'Now choose ' + (a ? 'a second era' : 'a first era') + ' to complete the comparison.';
        results.appendChild(el('p', 'ec-empty', msg));
        return;
      }
      results.appendChild(render(a, b));
    }

    function render(a, b) {
      var pair = [a, b];
      var wrap = el('div', 'ec-compare');
      wrap.setAttribute('role', 'region');
      wrap.setAttribute('aria-label', 'Comparison of Part ' + a.numeral + ' and Part ' + b.numeral);

      pair.forEach(function (era) {
        var head = el('div', 'ec-colhead ec-colheads ec-era-' + era.index);
        head.appendChild(el('span', 'ec-kicker', 'Part ' + era.numeral + ' · ' + era.years));
        head.appendChild(el('h3', null, era.title));
        wrap.appendChild(head);
      });

      data.topics.forEach(function (topic) {
        wrap.appendChild(el('h4', 'ec-topic', topic.label));
        pair.forEach(function (era) {
          var cell = el('div', 'ec-cell ec-era-' + era.index);
          cell.appendChild(el('span', 'ec-celltag', 'Part ' + era.numeral + ' · ' + era.title));
          var ul = el('ul');
          era[topic.key].forEach(function (p) { ul.appendChild(el('li', null, p)); });
          cell.appendChild(ul);
          wrap.appendChild(cell);
        });
      });

      pair.forEach(function (era) {
        var box = el('div', 'ec-cell ec-sources ec-era-' + era.index);
        box.appendChild(el('span', 'ec-celltag', 'Part ' + era.numeral + ' · ' + era.title));
        box.appendChild(el('span', 'ec-sources-label', 'Drawn from these timeline entries'));
        var ul = el('ul');
        era.sources.forEach(function (id) {
          var li = el('li');
          var btn = el('button', 'ec-link', headlines[id] || id);
          btn.type = 'button';
          btn.setAttribute('aria-label', 'Open “' + (headlines[id] || id) + '” in the timeline above');
          btn.addEventListener('click', function () { openSlide(id); });
          li.appendChild(btn);
          ul.appendChild(li);
        });
        box.appendChild(ul);
        wrap.appendChild(box);
      });
      return wrap;
    }
  }

  function openSlide(id) {
    var tl = window.timeline;
    var embed = document.getElementById('timeline-embed');
    if (embed) embed.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (tl && tl.goToId) tl.goToId(id);
  }
})();
