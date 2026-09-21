/* =========================================================
   TON-618 OS — Browser Desktop
   V2.0 — Full App + Window System
   ========================================================= */


/* =========================================================
   APP DEFINITIONS
   ========================================================= */

const APPS = {

  finder: {
    title: 'Finder',
    glyph: '🗂️',
    glyphClass: 'g-finder',
    w: 640,
    h: 420
  },

  notes: {
    title: 'Notes',
    glyph: '📝',
    glyphClass: 'g-notes',
    w: 560,
    h: 420
  },

  term: {
    title: 'Terminal',
    glyph: '▮',
    glyphClass: 'g-term',
    w: 560,
    h: 380
  },

  calc: {
    title: 'Calculator',
    glyph: '🧮',
    glyphClass: 'g-calc',
    w: 280,
    h: 400
  },

  music: {
    title: 'Vibes',
    glyph: '🎧',
    glyphClass: 'g-music',
    w: 340,
    h: 480
  },

  weather: {
    title: 'Weather',
    glyph: '🌤️',
    glyphClass: 'g-weather',
    w: 340,
    h: 420
  },

  paint: {
    title: 'Paint',
    glyph: '🎨',
    glyphClass: 'g-paint',
    w: 680,
    h: 520
  },

  clockapp: {
    title: 'Clock',
    glyph: '🕐',
    glyphClass: 'g-clock',
    w: 430,
    h: 430
  },

  browser: {
    title: 'Orbit Browser',
    glyph: '◎',
    glyphClass: 'g-browser',
    w: 720,
    h: 480
  },

  tasks: {
    title: 'Tasks',
    glyph: '✓',
    glyphClass: 'g-tasks',
    w: 430,
    h: 470
  },

  gallery: {
    title: 'Gallery',
    glyph: '◫',
    glyphClass: 'g-gallery',
    w: 640,
    h: 450
  },

  monitor: {
    title: 'System Monitor',
    glyph: '⌁',
    glyphClass: 'g-monitor',
    w: 540,
    h: 430
  },

  clipboard: {
    title: 'Clipboard',
    glyph: '▤',
    glyphClass: 'g-clipboard',
    w: 430,
    h: 440
  },

  ai: {
    title: 'AI.exe',
    glyph: '✦',
    glyphClass: 'g-ai',
    w: 480,
    h: 360
  },

  settings: {
    title: 'Settings',
    glyph: '⚙️',
    glyphClass: 'g-settings',
    w: 520,
    h: 400
  },

  about: {
    title: 'About TON-618 OS',
    glyph: '💾',
    glyphClass: 'g-about',
    w: 380,
    h: 440
  }

};


/* =========================================================
   GLOBAL STATE
   ========================================================= */

const layer =
  document.getElementById('windows-layer');

const openWindows = {};

let topZ = 10;
let cascade = 0;

let isLight =
  document.body.classList.contains('light-mode');


/* =========================================================
   ANIMATION CLEANUP
   ========================================================= */

function runEndAction(
  el,
  timeoutMs,
  callback
) {

  if (!el) return;

  let done = false;

  const timer =
    setTimeout(finish, timeoutMs);

  function finish(e) {

    if (
      e &&
      e.target !== el
    ) {
      return;
    }

    if (done) return;

    done = true;

    el.removeEventListener(
      'animationend',
      finish
    );

    el.removeEventListener(
      'transitionend',
      finish
    );

    clearTimeout(timer);

    callback();
  }

  el.addEventListener(
    'animationend',
    finish
  );

  el.addEventListener(
    'transitionend',
    finish
  );
}


/* =========================================================
   CLOCK
   ========================================================= */

function fmtTime(d) {

  let h = d.getHours();
  let m = d.getMinutes();

  const ampm =
    h >= 12 ? 'PM' : 'AM';

  h =
    h % 12 || 12;

  return `${h}:${String(m).padStart(2, '0')} ${ampm}`;
}


function fmtDateShort(d) {

  const days = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
  ];

  const mons = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  return (
    `${days[d.getDay()]} ` +
    `${d.getDate()} ` +
    `${mons[d.getMonth()]}`
  );
}


function fmtFullDate(d) {

  return d.toLocaleDateString(
    undefined,
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  );
}


function tickClock() {

  const d =
    new Date();

  const clock =
    document.getElementById('clock');

  const islandTime =
    document.getElementById('island-time');

  if (clock) {

    clock.textContent =
      `${fmtDateShort(d)}   ${fmtTime(d)}`;
  }

  if (islandTime) {

    islandTime.textContent =
      fmtTime(d);
  }

  document
    .querySelectorAll('.clock-live')
    .forEach(el => {

      el.textContent =
        fmtTime(d);
    });

  document
    .querySelectorAll('.clock-date')
    .forEach(el => {

      el.textContent =
        fmtFullDate(d);
    });
}


tickClock();

setInterval(
  tickClock,
  1000
);


/* =========================================================
   BOOT
   ========================================================= */

const bootEl =
  document.getElementById('boot');

if (bootEl) {

  runEndAction(
    bootEl,
    2500,
    () => {

      if (bootEl.isConnected) {
        bootEl.remove();
      }

      if (!openWindows.finder) {
        openApp('finder');
      }

    }
  );

} else {

  if (!openWindows.finder) {
    openApp('finder');
  }

}


/* =========================================================
   OPEN APPLICATION
   ========================================================= */

function openApp(appId) {

  // AI.exe is an in-page prank window now.
  // It stays inside TON-618 OS and remains draggable like every other app.


  const existing =
    openWindows[appId];

  if (existing) {

    const hidden =
      existing.style.display === 'none' ||
      existing.classList.contains('minimized-state') ||
      existing.classList.contains('minimized');

    if (hidden) {

      restoreWindow(appId);

    } else {

      focusWindow(
        existing,
        appId
      );

    }

    return;
  }


  const cfg =
    APPS[appId];

  if (!cfg || !layer) {
    return;
  }


  const win =
    document.createElement('div');

  win.className =
    'window opening';


  const x =
    Math.max(
      20,
      Math.min(
        window.innerWidth - cfg.w - 20,
        90 + (cascade % 5) * 36
      )
    );

  const y =
    Math.max(
      40,
      Math.min(
        window.innerHeight - cfg.h - 100,
        70 + (cascade % 5) * 28
      )
    );


  cascade++;


  win.style.left =
    `${x}px`;

  win.style.top =
    `${y}px`;

  win.style.width =
    `${cfg.w}px`;

  win.style.height =
    `${cfg.h}px`;

  win.dataset.app =
    appId;


  win.innerHTML = `

    <div class="titlebar">

      <div class="traffic">

        <i
          class="close"
          title="Close"
        ></i>

        <i
          class="min"
          title="Minimize"
        ></i>

        <i
          class="max"
          title="Maximize"
        ></i>

      </div>

      <div class="win-title">
        ${cfg.title}
      </div>

    </div>


    <div class="win-body">
      ${renderApp(appId)}
    </div>


    <div class="resize-handle"></div>

  `;


  layer.appendChild(win);

  openWindows[appId] =
    win;


  focusWindow(
    win,
    appId
  );

  wireWindow(
    win,
    appId
  );

  postMount(
    appId,
    win
  );


  document
    .querySelector(
      `.dock-item[data-app="${appId}"]`
    )
    ?.classList.add('running');


  runEndAction(
    win,
    380,
    () => {

      if (!win.isConnected) {
        return;
      }

      win.classList.remove(
        'opening'
      );

      win.style.opacity =
        '1';

      win.style.transform =
        'none';

    }
  );

}


/* =========================================================
   FOCUS WINDOW
   ========================================================= */

function focusWindow(
  win,
  appId
) {

  if (
    !win ||
    !win.isConnected
  ) {
    return;
  }

  topZ++;

  win.style.zIndex =
    topZ;


  document
    .querySelectorAll('.window')
    .forEach(w => {

      w.classList.remove(
        'focused'
      );

    });


  win.classList.add(
    'focused'
  );


  const activeName =
    document.getElementById(
      'active-app-name'
    );


  if (
    activeName &&
    APPS[appId]
  ) {

    activeName.textContent =
      APPS[appId].title;
  }

}


/* =========================================================
   CLOSE APPLICATION
   ========================================================= */

function closeApp(appId) {

  const win =
    openWindows[appId];

  if (!win) {
    return;
  }

  if (
    win.classList.contains('closing')
  ) {
    return;
  }


  win.classList.remove(
    'opening',
    'restoring',
    'minimized',
    'minimized-state'
  );


  win.style.display =
    'flex';

  win.style.opacity =
    '1';


  win.classList.add(
    'closing'
  );


  runEndAction(
    win,
    300,
    () => {

      if (win.isConnected) {
        win.remove();
      }


      delete openWindows[appId];


      document
        .querySelector(
          `.dock-item[data-app="${appId}"]`
        )
        ?.classList.remove(
          'running'
        );


      updateActiveApp();

    }
  );

}


/* =========================================================
   MINIMIZE
   ========================================================= */

function minimizeApp(appId) {

  const win =
    openWindows[appId];

  if (!win) {
    return;
  }

  if (
    win.classList.contains(
      'minimized-state'
    )
  ) {
    return;
  }


  const dockIcon =
    document.querySelector(
      `.dock-item[data-app="${appId}"]`
    );


  if (dockIcon) {

    const wr =
      win.getBoundingClientRect();

    const dr =
      dockIcon.getBoundingClientRect();


    win.style.setProperty(
      '--tx',
      `${dr.left + dr.width / 2 -
        (wr.left + wr.width / 2)}px`
    );


    win.style.setProperty(
      '--ty',
      `${dr.top + dr.height / 2 -
        (wr.top + wr.height / 2)}px`
    );

  }


  win.classList.remove(
    'opening',
    'restoring',
    'closing'
  );


  win.classList.add(
    'minimized',
    'minimized-state'
  );


  runEndAction(
    win,
    420,
    () => {

      if (
        win.classList.contains(
          'minimized-state'
        )
      ) {

        win.style.display =
          'none';

      }

      updateActiveApp();

    }
  );

}


/* =========================================================
   RESTORE WINDOW
   ========================================================= */

function restoreWindow(appId) {

  const win =
    openWindows[appId];

  if (!win) {
    return;
  }


  win.style.display =
    'flex';


  win.classList.remove(
    'minimized',
    'minimized-state',
    'closing',
    'opening'
  );


  win.classList.add(
    'restoring'
  );


  focusWindow(
    win,
    appId
  );


  runEndAction(
    win,
    420,
    () => {

      if (!win.isConnected) {
        return;
      }

      win.classList.remove(
        'restoring'
      );

      win.style.opacity =
        '1';

      win.style.transform =
        'none';

      win.style.removeProperty(
        '--tx'
      );

      win.style.removeProperty(
        '--ty'
      );

    }
  );

}


/* =========================================================
   MAXIMIZE
   ========================================================= */

function toggleMaximize(win) {

  if (!win) {
    return;
  }

  win.classList.toggle(
    'maximized'
  );

  win.style.opacity =
    '1';

}


/* =========================================================
   UPDATE ACTIVE APP
   ========================================================= */

function updateActiveApp() {

  const activeName =
    document.getElementById(
      'active-app-name'
    );

  if (!activeName) {
    return;
  }


  const windows =
    Object.entries(
      openWindows
    )
    .filter(
      ([, win]) =>
        win &&
        win.isConnected &&
        win.style.display !== 'none' &&
        !win.classList.contains('minimized-state')
    );


  if (!windows.length) {

    activeName.textContent =
      'Finder';

    return;
  }


  windows.sort(
    ([, a], [, b]) =>
      Number(b.style.zIndex || 0) -
      Number(a.style.zIndex || 0)
  );


  const appId =
    windows[0][0];


  activeName.textContent =
    APPS[appId]?.title ||
    'TON-618 OS';

}


/* =========================================================
   WINDOW EVENTS
   ========================================================= */

function wireWindow(
  win,
  appId
) {

  win.addEventListener(
    'mousedown',
    () => {

      focusWindow(
        win,
        appId
      );

    }
  );


  const bar =
    win.querySelector(
      '.titlebar'
    );


  if (!bar) {
    return;
  }


  /* -------------------------------------------------------
     DRAGGING
     ------------------------------------------------------- */

  bar.addEventListener(
    'mousedown',
    e => {

      if (
        e.target.closest(
          '.traffic'
        )
      ) {
        return;
      }


      if (
        win.classList.contains(
          'maximized'
        )
      ) {
        return;
      }


      const startX =
        e.clientX;

      const startY =
        e.clientY;

      const ol =
        win.offsetLeft;

      const ot =
        win.offsetTop;


      function move(ev) {

        const maxX =
          window.innerWidth -
          win.offsetWidth;

        const maxY =
          window.innerHeight -
          win.offsetHeight;


        const newLeft =
          Math.max(
            0,
            Math.min(
              maxX,
              ol +
              ev.clientX -
              startX
            )
          );


        const newTop =
          Math.max(
            28,
            Math.min(
              maxY,
              ot +
              ev.clientY -
              startY
            )
          );


        win.style.left =
          `${newLeft}px`;

        win.style.top =
          `${newTop}px`;

      }


      function up() {

        document.removeEventListener(
          'mousemove',
          move
        );

        document.removeEventListener(
          'mouseup',
          up
        );

      }


      document.addEventListener(
        'mousemove',
        move
      );

      document.addEventListener(
        'mouseup',
        up
      );

    }
  );


  /* -------------------------------------------------------
     RESIZE
     ------------------------------------------------------- */

  const rh =
    win.querySelector(
      '.resize-handle'
    );


  if (rh) {

    rh.addEventListener(
      'mousedown',
      e => {

        e.stopPropagation();

        if (
          win.classList.contains(
            'maximized'
          )
        ) {
          return;
        }


        const startX =
          e.clientX;

        const startY =
          e.clientY;

        const ow =
          win.offsetWidth;

        const oh =
          win.offsetHeight;


        function move(ev) {

          const maxWidth =
            window.innerWidth -
            win.offsetLeft;

          const maxHeight =
            window.innerHeight -
            win.offsetTop;


          win.style.width =
            `${Math.max(
              280,
              Math.min(
                maxWidth,
                ow +
                ev.clientX -
                startX
              )
            )}px`;


          win.style.height =
            `${Math.max(
              180,
              Math.min(
                maxHeight,
                oh +
                ev.clientY -
                startY
              )
            )}px`;

        }


        function up() {

          document.removeEventListener(
            'mousemove',
            move
          );

          document.removeEventListener(
            'mouseup',
            up
          );

        }


        document.addEventListener(
          'mousemove',
          move
        );

        document.addEventListener(
          'mouseup',
          up
        );

      }
    );

  }


  /* -------------------------------------------------------
     CLOSE
     ------------------------------------------------------- */

  win
    .querySelector(
      '.traffic .close'
    )
    ?.addEventListener(
      'click',
      e => {

        e.stopPropagation();

        closeApp(appId);

      }
    );


  /* -------------------------------------------------------
     MINIMIZE
     ------------------------------------------------------- */

  win
    .querySelector(
      '.traffic .min'
    )
    ?.addEventListener(
      'click',
      e => {

        e.stopPropagation();

        minimizeApp(appId);

      }
    );


  /* -------------------------------------------------------
     MAXIMIZE
     ------------------------------------------------------- */

  win
    .querySelector(
      '.traffic .max'
    )
    ?.addEventListener(
      'click',
      e => {

        e.stopPropagation();

        toggleMaximize(win);

      }
    );


  /* -------------------------------------------------------
     DOUBLE CLICK TITLEBAR
     ------------------------------------------------------- */

  bar.addEventListener(
    'dblclick',
    e => {

      if (
        !e.target.closest(
          '.traffic'
        )
      ) {

        toggleMaximize(win);

      }

    }
  );

}


/* =========================================================
   APPLICATION CONTENT
   ========================================================= */

function renderApp(appId) {

  switch (appId) {


    /* =====================================================
       FINDER
       ===================================================== */

    case 'finder':

      return `

        <div class="app-finder">

          <div class="fd-sidebar">

            <h4>Favorites</h4>

            <div class="fd-item active">
              🏠 Home
            </div>

            <div class="fd-item">
              🖥️ Desktop
            </div>

            <div class="fd-item">
              📄 Documents
            </div>

            <div class="fd-item">
              ⬇️ Downloads
            </div>

            <h4>Tags</h4>

            <div class="fd-item">
              🟠 Devlogs
            </div>

            <div class="fd-item">
              🔵 Assets
            </div>

          </div>


          <div class="fd-main">

            <div class="fd-file">
              <div class="fico">📁</div>
              <span>Devlogs</span>
            </div>

            <div class="fd-file">
              <div class="fico">📁</div>
              <span>Assets</span>
            </div>

            <div class="fd-file">
              <div class="fico">🖼️</div>
              <span>wallpaper.png</span>
            </div>

            <div class="fd-file">
              <div class="fico">📄</div>
              <span>readme.txt</span>
            </div>

            <div class="fd-file">
              <div class="fico">🎵</div>
              <span>lofi.mp3</span>
            </div>

            <div class="fd-file">
              <div class="fico">📄</div>
              <span>notes.txt</span>
            </div>

          </div>

        </div>

      `;


    /* =====================================================
       NOTES
       ===================================================== */

    case 'notes':

      return `

        <div class="app-notes">

          <div class="nt-list">

            <div
              class="nt-list-item active"
              data-note="0"
            >
              <b>Devlog 1</b>
              <small>
                Kickoff & window system
              </small>
            </div>

            <div
              class="nt-list-item"
              data-note="1"
            >
              <b>Devlog 2</b>
              <small>
                Dock + magnification
              </small>
            </div>

            <div
              class="nt-list-item"
              data-note="2"
            >
              <b>Devlog 3</b>
              <small>
                Dynamic Island + Spotlight
              </small>
            </div>

            <div
              class="nt-list-item"
              data-note="3"
            >
              <b>Scratchpad</b>
              <small>
                Random ideas
              </small>
            </div>

          </div>


          <div class="nt-editor">

            <textarea
              id="notes-area"
              spellcheck="false"
            ></textarea>

          </div>

        </div>

      `;


    /* =====================================================
       TERMINAL
       ===================================================== */

    case 'term':

      return `

        <div
          class="app-term"
          id="term-body"
        >

          <div class="line">
            TON-618 OS terminal — type "help" to get started.
          </div>

          <div class="prompt-row">

            <span class="prompt-label">
              guest@duskos ~ %
            </span>

            <input
              id="term-input"
              autocomplete="off"
              spellcheck="false"
            >

          </div>

        </div>

      `;


    /* =====================================================
       CALCULATOR
       ===================================================== */

    case 'calc':

      return `

        <div class="app-calc">

          <div
            class="calc-screen"
            id="calc-screen"
          >
            0
          </div>

          <div
            class="calc-grid"
            id="calc-grid"
          ></div>

        </div>

      `;


    /* =====================================================
       MUSIC
       ===================================================== */

    case 'music':

      return `

        <div class="app-music">

          <div
            class="mu-art"
            id="mu-art"
          >
            🎵
          </div>

          <div
            class="mu-title"
            id="mu-title"
          >
            —
          </div>

          <div
            class="mu-artist"
            id="mu-artist"
          >
            —
          </div>

          <div class="mu-progress" id="mu-progress" title="Seek">

            <div
              class="mu-fill"
              id="mu-fill"
            ></div>

          </div>

          <div class="mu-time">

            <span id="mu-elapsed">
              0:00
            </span>

            <span id="mu-duration">
              0:00
            </span>

          </div>

          <div class="mu-controls">

            <button id="mu-prev" title="Previous">⏮</button>
            <button id="mu-play" title="Play">▶</button>
            <button id="mu-next" title="Next">⏭</button>

          </div>

          <label class="mu-volume">
            <span>Volume</span>
            <input id="mu-volume" type="range" min="0" max="100" value="60">
          </label>

          <audio id="mu-audio" preload="metadata"></audio>

          <div
            class="mu-list"
            id="mu-list"
          ></div>

        </div>

      `;


    /* =====================================================
       WEATHER
       ===================================================== */

    case 'weather':

      return `

        <div class="app-weather">

          <div class="wx-loc">
            Dusk Valley
          </div>

          <div class="wx-cond">
            Partly Cloudy
          </div>

          <div class="wx-temp">
            72°
          </div>

          <div class="wx-range">
            H:78°&nbsp;&nbsp;L:64°
          </div>

          <div class="wx-days">

            <div class="wx-day">
              <span>Mon</span>
              <b>⛅</b>
              <small>75/61</small>
            </div>

            <div class="wx-day">
              <span>Tue</span>
              <b>🌦️</b>
              <small>68/58</small>
            </div>

            <div class="wx-day">
              <span>Wed</span>
              <b>☀️</b>
              <small>80/66</small>
            </div>

            <div class="wx-day">
              <span>Thu</span>
              <b>⛅</b>
              <small>76/63</small>
            </div>

            <div class="wx-day">
              <span>Fri</span>
              <b>🌥️</b>
              <small>71/60</small>
            </div>

          </div>

          <p class="wx-note">
            Sample forecast — TON-618 OS doesn't call a live weather service.
          </p>

        </div>

      `;


    /* =====================================================
       PAINT
       ===================================================== */

    case 'paint':

      return `

        <div class="app-paint">

          <div class="paint-toolbar">

            <div class="paint-group">

              <button
                class="paint-tool active"
                data-tool="brush"
              >
                🖌 Brush
              </button>

              <button
                class="paint-tool"
                data-tool="eraser"
              >
                🧽 Eraser
              </button>

              <label class="paint-control">
                Color

                <input
                  id="paint-color"
                  type="color"
                  value="#24152f"
                >
              </label>

              <label class="paint-control">
                Size

                <input
                  id="paint-size"
                  type="range"
                  min="1"
                  max="50"
                  value="6"
                >
              </label>

            </div>

            <div class="paint-actions">

              <button id="paint-clear">
                Clear
              </button>

              <button id="paint-save">
                Save
              </button>

            </div>

          </div>


          <div class="paint-canvas-wrap">

            <canvas
              id="paint-canvas"
            ></canvas>

          </div>


          <div class="paint-status">
            Paint canvas ready
          </div>

        </div>

      `;


    /* =====================================================
       CLOCK
       ===================================================== */

    case 'clockapp':

      return `

        <div class="app-clock">

          <div class="clock-hero">

            <div class="clock-live">
              --:--
            </div>

            <div class="clock-date">
              Loading date...
            </div>

          </div>


          <div class="clock-tabs">

            <button
              class="clock-tab active"
              data-clock-tab="world"
            >
              World
            </button>

            <button
              class="clock-tab"
              data-clock-tab="stopwatch"
            >
              Stopwatch
            </button>

            <button
              class="clock-tab"
              data-clock-tab="timer"
            >
              Timer
            </button>

          </div>


          <div
            class="clock-panel active"
            data-clock-panel="world"
          >

            <div class="clock-cards">

              <div class="clock-card">
                <span>Local</span>
                <b class="world-local">--</b>
                <small>Your computer</small>
              </div>

              <div class="clock-card">
                <span>UTC</span>
                <b class="world-utc">--</b>
                <small>Coordinated Universal Time</small>
              </div>

              <div class="clock-card">
                <span>Tokyo</span>
                <b class="world-tokyo">--</b>
                <small>Japan</small>
              </div>

              <div class="clock-card">
                <span>New York</span>
                <b class="world-newyork">--</b>
                <small>United States</small>
              </div>

            </div>

          </div>


          <div
            class="clock-panel"
            data-clock-panel="stopwatch"
          >

            <div
              class="clock-big-number"
              id="stopwatch-display"
            >
              00:00.0
            </div>

            <div class="clock-actions">

              <button id="stopwatch-start">
                Start
              </button>

              <button id="stopwatch-reset">
                Reset
              </button>

            </div>

          </div>


          <div
            class="clock-panel"
            data-clock-panel="timer"
          >

            <div
              class="clock-big-number"
              id="timer-display"
            >
              05:00
            </div>

            <div class="timer-inputs">

              <input
                id="timer-minutes"
                type="number"
                min="0"
                max="99"
                value="5"
              >

              <span>:</span>

              <input
                id="timer-seconds"
                type="number"
                min="0"
                max="59"
                value="0"
              >

            </div>

            <div class="clock-actions">

              <button id="timer-start">
                Start
              </button>

              <button id="timer-reset">
                Reset
              </button>

            </div>

          </div>

        </div>

      `;

    case 'browser':
      return `
        <div class="app-browser">
          <form class="browser-bar" id="browser-form">
            <button type="button" id="browser-back" title="Back">‹</button>
            <button type="button" id="browser-refresh" title="Refresh">↻</button>
            <input id="browser-input" value="dusk://start" aria-label="Address or search" spellcheck="false">
            <button type="submit" title="Go">→</button>
          </form>
          <div class="browser-page" id="browser-page">
            <div class="browser-orbit">◎</div>
            <h2>Explore without leaving dusk.</h2>
            <p>Search the web or jump to a favorite.</p>
            <div class="browser-favorites">
              <button data-url="https://www.wikipedia.org">W<br><small>Wikipedia</small></button>
              <button data-url="https://github.com">⌘<br><small>GitHub</small></button>
              <button data-url="https://www.youtube.com">▶<br><small>YouTube</small></button>
            </div>
          </div>
        </div>
      `;

    case 'tasks':
      return `
        <div class="app-tasks">
          <div class="tasks-head"><div><small>MY DAY</small><h2>Keep moving.</h2></div><b id="task-count">0 left</b></div>
          <form id="task-form" class="task-form"><input id="task-input" placeholder="Add a task" autocomplete="off"><button type="submit">+</button></form>
          <div id="task-list" class="task-list"></div>
        </div>
      `;

    case 'gallery':
      return `
        <div class="app-gallery">
          <aside><h3>Gallery</h3><button class="active">Library</button><button>Favorites</button><button>Shared</button></aside>
          <main><div class="gallery-head"><div><small>FEATURED</small><h2>Cosmic archive</h2></div><span>6 items</span></div>
          <div class="gallery-grid">
            <button class="gallery-shot hero-shot" aria-label="Open black hole image"></button>
            <button class="gallery-shot shot-two">ECLIPSE</button><button class="gallery-shot shot-three">NEBULA</button>
            <button class="gallery-shot shot-four">LUNAR</button><button class="gallery-shot shot-five">VOID</button>
          </div></main>
        </div>
      `;

    case 'monitor':
      return `
        <div class="app-monitor">
          <div class="monitor-summary"><div><small>CPU</small><b id="monitor-cpu">24%</b></div><div><small>MEMORY</small><b id="monitor-memory">3.8 GB</b></div><div><small>ENERGY</small><b>Low</b></div></div>
          <div class="monitor-chart" id="monitor-chart"></div>
          <div class="process-head"><span>Process</span><span>Status</span><span>CPU</span></div>
          <div id="process-list" class="process-list"></div>
        </div>
      `;

    case 'clipboard':
      return `
        <div class="app-clipboard">
          <div class="clipboard-head"><div><small>HISTORY</small><h2>Clipboard</h2></div><button id="clipboard-clear">Clear</button></div>
          <form id="clipboard-form" class="clipboard-form"><textarea id="clipboard-input" placeholder="Save text for later…"></textarea><button type="submit">Save clip</button></form>
          <div id="clipboard-list" class="clipboard-list"></div>
        </div>
      `;


    /* =====================================================
       AI.EXE PRANK
       ===================================================== */

    case 'ai':
      return `
        <div class="app-ai">
          <div class="ai-glow"></div>
          <div class="ai-icon-big">✦</div>
          <small>UNTRUSTED WEB APP</small>
          <h2>AI.exe</h2>
          <p>This is the harmless TON-618 OS prank module. Continue for a surprise.</p>
          <div class="ai-actions">
            <button class="ai-prank-btn" id="ai-prank">Run diagnostic</button>
            <button class="ai-stop-btn" id="ai-stop" type="button">Cancel</button>
          </div>
          <div class="ai-stage" id="ai-stage" hidden></div>
        </div>
      `;

    /* =====================================================
       SETTINGS
       ===================================================== */

    case 'settings':

      return `

        <div class="app-settings">

          <div class="st-sidebar">

            <div
              class="st-item active"
              data-panel="appearance"
            >
              🌗 Appearance
            </div>

            <div
              class="st-item"
              data-panel="wallpaper"
            >
              🖼️ Wallpaper
            </div>

            <div
              class="st-item"
              data-panel="sound"
            >
              🔊 Sound
            </div>

            <div
              class="st-item"
              data-panel="about"
            >
              ℹ️ About
            </div>

          </div>


          <div class="st-main">

            <div
              class="st-panel"
              data-panel="appearance"
            >

              <h3>
                Appearance
              </h3>

              <div
                class="st-row appearance-switch"
                id="settings-appearance-toggle"
              >

                <span>
                  Theme
                </span>

                <span class="appearance-value">
                  Dusk
                </span>

              </div>

              <div class="theme-grid">
                <button type="button" class="theme-card" data-theme="singularity"><b>Singularity</b><span>Warm dark theme</span></button>
                <button type="button" class="theme-card" data-theme="obsidian"><b>Obsidian</b><span>Plain dark theme</span></button>
                <button type="button" class="theme-card" data-theme="aurora"><b>Aurora</b><span>Cool blue theme</span></button>
                <button type="button" class="theme-card" data-theme="daylight"><b>Daylight</b><span>Light desktop theme</span></button>
              </div>
              <p class="st-hint">Themes change the visual system without removing or resetting your apps.</p>

            </div>


            <div
              class="st-panel"
              data-panel="wallpaper"
              hidden
            >

              <h3>
                Wallpaper
              </h3>

              <div class="wp-preview"></div>

              <p class="st-hint">
                Use <b>wallpaper.png</b> next to
                index.html for your desktop background.
              </p>

            </div>


            <div
              class="st-panel"
              data-panel="sound"
              hidden
            >

              <h3>
                Sound
              </h3>

              <div
                class="st-row"
                style="cursor:default;"
              >

                <span>
                  Output Volume
                </span>

              </div>

              <input
                type="range"
                class="cc-slider volume-slider"
                min="0"
                max="100"
                value="60"
              >

            </div>


            <div
              class="st-panel"
              data-panel="about"
              hidden
            >

              <h3>
                About
              </h3>

              <p class="st-hint">
                TON-618 OS 3.0 — a tiny browser desktop environment
                built in HTML, CSS and JavaScript.
              </p>

            </div>

          </div>

        </div>

      `;


    /* =====================================================
       ABOUT
       ===================================================== */

    case 'about':

      return `

        <div class="app-about">

          <div class="badge">
            💾
          </div>

          <h2>
            TON-618 OS
          </h2>

          <p>
            A tiny desktop environment built entirely
            in HTML, CSS and JavaScript.
          </p>

          <div class="about-specs">

            <div>
              <span>Chip</span>
              <b>Custom Web Engine</b>
            </div>

            <div>
              <span>Memory</span>
              <b>Whatever the tab allows</b>
            </div>

            <div>
              <span>Version</span>
              <b>dusk 2.0</b>
            </div>

            <div>
              <span>Built with</span>
              <b>HTML / CSS / JS</b>
            </div>

          </div>

        </div>

      `;

  }


  return '';

}


/* =========================================================
   POST MOUNT
   ========================================================= */

function postMount(
  appId,
  win
) {

  if (appId === 'notes') {
    setupNotes(win);
  }

  if (appId === 'term') {
    setupTerminal(win);
  }

  if (appId === 'calc') {
    setupCalc(win);
  }

  if (appId === 'music') {
    setupMusic(win);
  }

  if (appId === 'settings') {
    setupSettings(win);
  }

  if (appId === 'paint') {
    setupPaint(win);
  }

  if (appId === 'clockapp') {
    setupClockApp(win);
  }

  if (appId === 'browser') setupBrowser(win);
  if (appId === 'tasks') setupTasks(win);
  if (appId === 'gallery') setupGallery(win);
  if (appId === 'monitor') setupMonitor(win);
  if (appId === 'clipboard') setupClipboard(win);
  if (appId === 'ai') setupAI(win);

}


/* =========================================================
   NOTES
   ========================================================= */

const noteContents = [

  `Devlog 1

Got the base window manager working today.`,

  `Devlog 2

Built the dock with smooth hover magnification.`,

  `Devlog 3

Dynamic Island sits as a clock pill and morphs into Spotlight.`,

  `Scratchpad

- toggle light/dark ✅
- window manager fixes ✅
- Paint app ✅
- Clock app ✅
- Spotlight ✅`

];


function setupNotes(win) {

  const area =
    win.querySelector(
      '#notes-area'
    );

  const items =
    win.querySelectorAll(
      '.nt-list-item'
    );

  if (!area) {
    return;
  }


  function load(i) {

    area.value =
      noteContents[i] || '';

  }


  load(0);


  items.forEach(
    item => {

      item.addEventListener(
        'click',
        () => {

          items.forEach(
            x =>
              x.classList.remove(
                'active'
              )
          );


          item.classList.add(
            'active'
          );


          load(
            Number(item.dataset.note)
          );

        }
      );

    }
  );

}


/* =========================================================
   TERMINAL
   ========================================================= */

function setupTerminal(win) {

  const body =
    win.querySelector(
      '#term-body'
    );

  const input =
    win.querySelector(
      '#term-input'
    );

  if (!body || !input) {
    return;
  }


  const help =
    'Available commands: help, about, projects, date, time, apps, clear, echo, joke, whoami, open';


  const cmds = {

    help: () =>
      help,

    about: () =>
      'TON-618 OS — a browser-based desktop environment.',

    projects: () =>
      '→ TON-618 OS\n→ Paint\n→ Clock\n→ Dynamic Island\n→ Window Manager',

    date: () =>
      new Date().toDateString(),

    time: () =>
      new Date().toLocaleTimeString(),

    apps: () =>
      Object.values(APPS)
        .map(
          app =>
            `→ ${app.title}`
        )
        .join('\n'),

    whoami: () =>
      'guest — poking around the desktop',

    joke: () =>
      'Why did the window get promoted? It had great focus.'

  };


  function printLine(text) {

    const out =
      document.createElement('div');

    out.className =
      'line';

    out.textContent =
      text;

    body.insertBefore(
      out,
      body.lastElementChild
    );

  }


  input.addEventListener(
    'keydown',
    e => {

      if (e.key !== 'Enter') {
        return;
      }


      const raw =
        input.value.trim();


      if (!raw) {
        return;
      }


      printLine(
        `guest@duskos ~ % ${raw}`
      );


      const lower =
        raw.toLowerCase();


      if (lower === 'clear') {

        body
          .querySelectorAll(
            '.line'
          )
          .forEach(
            line => line.remove()
          );


      } else if (
        lower.startsWith('echo ')
      ) {

        printLine(
          raw.slice(5)
        );


      } else if (
        lower.startsWith('open ')
      ) {

        const target =
          raw
            .slice(5)
            .trim()
            .toLowerCase();


        const app =
          Object.keys(APPS)
            .find(
              id =>
                id === target ||
                APPS[id].title.toLowerCase() === target
            );


        if (app) {

          openApp(app);

          printLine(
            `Opening ${APPS[app].title}...`
          );

        } else {

          printLine(
            `Application not found: ${target}`
          );

        }


      } else {

        const fn =
          cmds[lower];


        printLine(
          fn
            ? fn()
            : `command not found: ${raw} — try "help"`
        );

      }


      input.value =
        '';


      body.scrollTop =
        body.scrollHeight;

    }
  );


  win.addEventListener(
    'mousedown',
    () => {

      setTimeout(
        () => input.focus(),
        0
      );

    }
  );

}


/* =========================================================
   CALCULATOR
   ========================================================= */

function setupCalc(win) {

  const screen =
    win.querySelector(
      '#calc-screen'
    );

  const grid =
    win.querySelector(
      '#calc-grid'
    );

  if (!screen || !grid) {
    return;
  }


  const keys = [

    'C',
    '±',
    '%',
    '÷',

    '7',
    '8',
    '9',
    '×',

    '4',
    '5',
    '6',
    '−',

    '1',
    '2',
    '3',
    '+',

    '0',
    '.',
    '='

  ];


  let cur =
    '0';

  let prevVal =
    null;

  let op =
    null;

  let fresh =
    true;


  keys.forEach(
    key => {

      const btn =
        document.createElement(
          'button'
        );


      btn.className =
        'calc-btn';


      if (
        [
          '÷',
          '×',
          '−',
          '+',
          '='
        ].includes(key)
      ) {

        btn.classList.add(
          'op'
        );

      }


      if (
        [
          'C',
          '±',
          '%'
        ].includes(key)
      ) {

        btn.classList.add(
          'fn'
        );

      }


      if (key === '0') {

        btn.classList.add(
          'zero'
        );

      }


      btn.textContent =
        key;


      btn.addEventListener(
        'click',
        () => press(key)
      );


      grid.appendChild(
        btn
      );

    }
  );


  function render() {

    screen.textContent =
      cur;

  }


  function press(k) {

    if (
      !Number.isNaN(
        Number(k)
      ) ||
      k === '.'
    ) {

      if (fresh) {

        cur =
          k === '.'
            ? '0.'
            : k;

        fresh =
          false;

      } else {

        if (
          k === '.' &&
          cur.includes('.')
        ) {
          return;
        }

        if (cur === 'Error') {
          cur = '0';
        }

        cur += k;

      }


    } else if (k === 'C') {

      cur =
        '0';

      prevVal =
        null;

      op =
        null;

      fresh =
        true;


    } else if (k === '±') {

      if (cur !== '0') {

        cur =
          String(
            parseFloat(cur) * -1
          );

      }


    } else if (k === '%') {

      cur =
        String(
          parseFloat(cur) / 100
        );


    } else if (
      [
        '÷',
        '×',
        '−',
        '+'
      ].includes(k)
    ) {

      prevVal =
        parseFloat(cur);

      op =
        k;

      fresh =
        true;


    } else if (k === '=') {

      if (
        op !== null &&
        prevVal !== null
      ) {

        const b =
          parseFloat(cur);

        let result =
          b;


        if (op === '÷') {

          if (b === 0) {

            cur =
              'Error';

            op =
              null;

            prevVal =
              null;

            fresh =
              true;

            render();

            return;
          }

          result =
            prevVal / b;
        }


        if (op === '×') {
          result =
            prevVal * b;
        }


        if (op === '−') {
          result =
            prevVal - b;
        }


        if (op === '+') {
          result =
            prevVal + b;
        }


        cur =
          String(
            Math.round(
              result * 1e8
            ) / 1e8
          );


        op =
          null;

        prevVal =
          null;

        fresh =
          true;

      }

    }


    render();

  }


  render();

}


/* =========================================================
   MUSIC
   ========================================================= */

const playlist = [
  { title: 'Music 1', artist: 'TON-618 OS', src: 'music1.mp3' },
  { title: 'Music 2', artist: 'TON-618 OS', src: 'music2.mp3' },
  { title: 'Music 3', artist: 'TON-618 OS', src: 'music3.mp3' },
  { title: 'Music 4', artist: 'TON-618 OS', src: 'music4.mp3' }
];

function setupMusic(win) {
  const audio = win.querySelector('#mu-audio');
  const title = win.querySelector('#mu-title');
  const artist = win.querySelector('#mu-artist');
  const fill = win.querySelector('#mu-fill');
  const elapsedEl = win.querySelector('#mu-elapsed');
  const durationEl = win.querySelector('#mu-duration');
  const playBtn = win.querySelector('#mu-play');
  const list = win.querySelector('#mu-list');
  const progress = win.querySelector('#mu-progress');
  const volume = win.querySelector('#mu-volume');
  const art = win.querySelector('#mu-art');
  if (!audio || !title || !artist || !fill || !elapsedEl || !durationEl || !playBtn || !list) return;

  let idx = 0;
  const fmt = seconds => {
    if (!Number.isFinite(seconds)) return '0:00';
    const total = Math.max(0, Math.floor(seconds));
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
  };

  function renderList() {
    list.innerHTML = playlist.map((track, i) => `
      <button class="mu-track ${i === idx ? 'playing' : ''}" data-track="${i}" type="button">
        <span>${track.title}</span><small>${track.src}</small>
      </button>
    `).join('');
    list.querySelectorAll('[data-track]').forEach(btn => btn.addEventListener('click', () => loadTrack(Number(btn.dataset.track), true)));
  }

  function syncMeta() {
    const track = playlist[idx];
    title.textContent = track.title;
    artist.textContent = track.artist;
    durationEl.textContent = fmt(audio.duration);
    if (art) art.textContent = ['✦', '◉', '✺', '◒'][idx];
    renderList();
  }

  function loadTrack(i, autoplay = false) {
    idx = (i + playlist.length) % playlist.length;
    const track = playlist[idx];
    audio.src = track.src;
    audio.load();
    elapsedEl.textContent = '0:00';
    fill.style.width = '0%';
    syncMeta();
    if (autoplay) play();
    else {
      audio.pause();
      playBtn.textContent = '▶';
    }
  }

  function play() {
    audio.play().then(() => {
      playBtn.textContent = '⏸';
    }).catch(() => {
      playBtn.textContent = '▶';
      showToast('🎵', 'Music', `Add ${playlist[idx].src} next to index.html, then press play.`);
    });
  }

  function pause() {
    audio.pause();
    playBtn.textContent = '▶';
  }

  audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = fmt(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    const ratio = audio.duration ? audio.currentTime / audio.duration : 0;
    elapsedEl.textContent = fmt(audio.currentTime);
    fill.style.width = `${ratio * 100}%`;
  });

  audio.addEventListener('play', () => { playBtn.textContent = '⏸'; });
  audio.addEventListener('pause', () => { playBtn.textContent = '▶'; });
  audio.addEventListener('ended', () => loadTrack(idx + 1, true));
  audio.addEventListener('error', () => {
    durationEl.textContent = '—';
  });

  playBtn.addEventListener('click', () => audio.paused ? play() : pause());
  win.querySelector('#mu-next')?.addEventListener('click', () => loadTrack(idx + 1, true));
  win.querySelector('#mu-prev')?.addEventListener('click', () => loadTrack(idx - 1, true));
  progress?.addEventListener('click', event => {
    if (!audio.duration) return;
    const rect = progress.getBoundingClientRect();
    audio.currentTime = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)) * audio.duration;
  });
  volume?.addEventListener('input', () => { audio.volume = Number(volume.value) / 100; });
  audio.volume = Number(volume?.value || 60) / 100;
  win.addEventListener('duskos:cleanup', () => audio.pause());
  loadTrack(0, false);
}

function setupAI(win) {
  const run = win.querySelector('#ai-prank');
  const stop = win.querySelector('#ai-stop');
  const stage = win.querySelector('#ai-stage');
  if (!run || !stage) return;

  run.addEventListener('click', () => {
    stage.hidden = false;
    stage.innerHTML = `
      <div class="ai-scan">SCANNING TON-618 OS...</div>
      <div class="ai-progress"><i></i></div>
      <div class="ai-output">Neural cache: 100%<br>Kernel state: suspicious<br>Prank level: MAX</div>
      <button id="ai-reveal" class="ai-reveal">Reveal result</button>
    `;
    stage.querySelector('.ai-progress i').addEventListener('animationend', () => {
      stage.querySelector('.ai-reveal')?.addEventListener('click', () => {
        stage.innerHTML = `<div class="ai-rickroll"><div class="rick-emoji">😂</div><h3>GET RICKROLLED</h3><p>AI.exe found absolutely nothing.</p><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0&rel=0" title="Rick Astley" allow="autoplay; encrypted-media" allowfullscreen></iframe><button class="ai-reveal" id="ai-rick-external">Open in YouTube</button></div>`;
        stage.querySelector('#ai-rick-external')?.addEventListener('click', () => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank', 'noopener,noreferrer'));
      });
    });
  });
  stop?.addEventListener('click', () => {
    stage.hidden = true;
    stage.innerHTML = '';
  });
}


/* =========================================================
   NEW DESKTOP UTILITIES
   ========================================================= */

function setupBrowser(win) {
  const form = win.querySelector('#browser-form');
  const input = win.querySelector('#browser-input');
  const page = win.querySelector('#browser-page');
  const refresh = win.querySelector('#browser-refresh');
  if (!form || !input || !page) return;

  const go = raw => {
    const value = String(raw || '').trim();
    if (!value || value === 'dusk://start') return;
    const target = /^https?:\/\//i.test(value)
      ? value
      : `https://www.google.com/search?q=${encodeURIComponent(value)}`;
    window.open(target, '_blank', 'noopener,noreferrer');
    input.value = target;
    showToast('◎', 'Orbit Browser', 'Opened in a secure browser tab.');
  };

  form.addEventListener('submit', event => {
    event.preventDefault();
    go(input.value);
  });
  page.querySelectorAll('[data-url]').forEach(button => {
    button.addEventListener('click', () => go(button.dataset.url));
  });
  refresh?.addEventListener('click', () => {
    page.classList.remove('page-refresh');
    requestAnimationFrame(() => page.classList.add('page-refresh'));
  });
}

function setupTasks(win) {
  const form = win.querySelector('#task-form');
  const input = win.querySelector('#task-input');
  const list = win.querySelector('#task-list');
  const count = win.querySelector('#task-count');
  if (!form || !input || !list || !count) return;
  let tasks;
  try { tasks = JSON.parse(localStorage.getItem('duskOS-tasks') || 'null'); } catch { tasks = null; }
  if (!Array.isArray(tasks)) tasks = [
    { text: 'Polish the desktop experience', done: true },
    { text: 'Explore the cosmic archive', done: false },
    { text: 'Take a proper break', done: false }
  ];
  const save = () => localStorage.setItem('duskOS-tasks', JSON.stringify(tasks));
  const render = () => {
    list.innerHTML = '';
    tasks.forEach((task, index) => {
      const row = document.createElement('div');
      row.className = `task-row${task.done ? ' done' : ''}`;
      row.innerHTML = `<button class="task-check" aria-label="Toggle task">✓</button><span></span><button class="task-delete" aria-label="Delete task">×</button>`;
      row.querySelector('span').textContent = task.text;
      row.querySelector('.task-check').addEventListener('click', () => { tasks[index].done = !tasks[index].done; save(); render(); });
      row.querySelector('.task-delete').addEventListener('click', () => { tasks.splice(index, 1); save(); render(); });
      list.appendChild(row);
    });
    count.textContent = `${tasks.filter(task => !task.done).length} left`;
  };
  form.addEventListener('submit', event => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    tasks.unshift({ text, done: false }); input.value = ''; save(); render();
  });
  render();
}

function setupGallery(win) {
  win.querySelectorAll('.gallery-shot').forEach((shot, index) => {
    shot.addEventListener('click', () => {
      const viewer = document.createElement('div');
      viewer.className = 'gallery-viewer';
      viewer.innerHTML = `<div class="gallery-viewer-image"></div><button aria-label="Close preview">×</button><span>Cosmic capture ${String(index + 1).padStart(2, '0')}</span>`;
      viewer.querySelector('button').addEventListener('click', () => viewer.remove());
      viewer.addEventListener('click', event => { if (event.target === viewer) viewer.remove(); });
      win.querySelector('.app-gallery').appendChild(viewer);
    });
  });
}

function setupMonitor(win) {
  const chart = win.querySelector('#monitor-chart');
  const list = win.querySelector('#process-list');
  const cpu = win.querySelector('#monitor-cpu');
  const memory = win.querySelector('#monitor-memory');
  if (!chart || !list || !cpu || !memory) return;
  for (let i = 0; i < 28; i++) {
    const bar = document.createElement('i');
    bar.style.height = `${18 + Math.random() * 70}%`;
    chart.appendChild(bar);
  }
  const renderProcesses = () => {
    list.innerHTML = '';
    ['WindowServer', 'TON-618 OS Core', ...Object.keys(openWindows).filter(id => id !== 'monitor')].forEach((id, index) => {
      const cfg = APPS[id];
      const row = document.createElement('div');
      row.className = 'process-row';
      row.innerHTML = `<span>${cfg ? `${cfg.glyph} ${cfg.title}` : id}</span><span class="process-live">Running</span><b>${(1.4 + index * 2.7).toFixed(1)}%</b>`;
      list.appendChild(row);
    });
  };
  const timer = setInterval(() => {
    cpu.textContent = `${Math.round(16 + Math.random() * 27)}%`;
    memory.textContent = `${(3.4 + Math.random()).toFixed(1)} GB`;
    [...chart.children].forEach(bar => { bar.style.height = `${15 + Math.random() * 78}%`; });
    renderProcesses();
  }, 1800);
  renderProcesses();
  win.addEventListener('duskos:cleanup', () => clearInterval(timer));
}

function setupClipboard(win) {
  const form = win.querySelector('#clipboard-form');
  const input = win.querySelector('#clipboard-input');
  const list = win.querySelector('#clipboard-list');
  const clear = win.querySelector('#clipboard-clear');
  if (!form || !input || !list) return;
  let clips;
  try { clips = JSON.parse(localStorage.getItem('duskOS-clips') || '[]'); } catch { clips = []; }
  const save = () => localStorage.setItem('duskOS-clips', JSON.stringify(clips));
  const render = () => {
    list.innerHTML = clips.length ? '' : '<div class="clipboard-empty">Saved clips appear here.</div>';
    clips.forEach((clip, index) => {
      const row = document.createElement('button');
      row.className = 'clip-row';
      row.innerHTML = `<span></span><small>Click to copy</small>`;
      row.querySelector('span').textContent = clip;
      row.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(clip); } catch { input.value = clip; input.select(); }
        showToast('▤', 'Clipboard', 'Copied to clipboard.');
      });
      row.addEventListener('contextmenu', event => { event.preventDefault(); clips.splice(index, 1); save(); render(); });
      list.appendChild(row);
    });
  };
  form.addEventListener('submit', event => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    clips.unshift(text); clips = clips.slice(0, 8); input.value = ''; save(); render();
  });
  clear?.addEventListener('click', () => { clips = []; save(); render(); });
  render();
}


/* =========================================================
   PAINT
   ========================================================= */

function setupPaint(win) {

  const canvas =
    win.querySelector('#paint-canvas');

  const color =
    win.querySelector('#paint-color');

  const size =
    win.querySelector('#paint-size');

  const clearBtn =
    win.querySelector('#paint-clear');

  const saveBtn =
    win.querySelector('#paint-save');

  const status =
    win.querySelector('.paint-status');

  const tools =
    win.querySelectorAll('.paint-tool');


  if (
    !canvas ||
    !color ||
    !size ||
    !clearBtn ||
    !saveBtn
  ) {
    return;
  }


  const ctx =
    canvas.getContext('2d');


  if (!ctx) {
    return;
  }


  let drawing =
    false;

  let tool =
    'brush';


  function resizeCanvas() {

    const rect =
      canvas.getBoundingClientRect();


    if (
      rect.width <= 0 ||
      rect.height <= 0
    ) {
      return;
    }


    const old =
      document.createElement(
        'canvas'
      );


    old.width =
      canvas.width;

    old.height =
      canvas.height;


    if (
      old.width &&
      old.height
    ) {

      old
        .getContext('2d')
        .drawImage(
          canvas,
          0,
          0
        );

    }


    canvas.width =
      Math.floor(
        rect.width
      );

    canvas.height =
      Math.floor(
        rect.height
      );


    ctx.globalCompositeOperation =
      'source-over';


    ctx.fillStyle =
      '#fffdf8';


    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    if (
      old.width &&
      old.height
    ) {

      ctx.drawImage(
        old,
        0,
        0,
        old.width,
        old.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

    }

  }


  function position(e) {

    const rect =
      canvas.getBoundingClientRect();


    return {

      x:
        (e.clientX - rect.left) *
        (
          canvas.width /
          rect.width
        ),

      y:
        (e.clientY - rect.top) *
        (
          canvas.height /
          rect.height
        )

    };

  }


  function start(e) {

    drawing =
      true;


    const p =
      position(e);


    ctx.beginPath();


    ctx.moveTo(
      p.x,
      p.y
    );

  }


  function draw(e) {

    if (!drawing) {
      return;
    }


    const p =
      position(e);


    ctx.lineWidth =
      Number(size.value);


    ctx.lineCap =
      'round';


    ctx.lineJoin =
      'round';


    if (
      tool === 'eraser'
    ) {

      ctx.globalCompositeOperation =
        'destination-out';

    } else {

      ctx.globalCompositeOperation =
        'source-over';

      ctx.strokeStyle =
        color.value;

    }


    ctx.lineTo(
      p.x,
      p.y
    );


    ctx.stroke();


    ctx.beginPath();


    ctx.moveTo(
      p.x,
      p.y
    );

  }


  function stop() {

    if (!drawing) {
      return;
    }


    drawing =
      false;


    ctx.closePath();


    ctx.globalCompositeOperation =
      'source-over';

  }


  canvas.addEventListener(
    'pointerdown',
    e => {

      canvas.setPointerCapture(
        e.pointerId
      );

      start(e);

    }
  );


  canvas.addEventListener(
    'pointermove',
    draw
  );


  canvas.addEventListener(
    'pointerup',
    stop
  );


  canvas.addEventListener(
    'pointercancel',
    stop
  );


  tools.forEach(
    button => {

      button.addEventListener(
        'click',
        () => {

          tools.forEach(
            b =>
              b.classList.remove(
                'active'
              )
          );


          button.classList.add(
            'active'
          );


          tool =
            button.dataset.tool;


          if (status) {

            status.textContent =
              tool === 'eraser'
                ? 'Eraser selected'
                : 'Brush selected';

          }

        }
      );

    }
  );


  clearBtn.addEventListener(
    'click',
    () => {

      ctx.globalCompositeOperation =
        'source-over';


      ctx.fillStyle =
        '#fffdf8';


      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );


      if (status) {

        status.textContent =
          'Canvas cleared';

      }

    }
  );


  saveBtn.addEventListener(
    'click',
    () => {

      const link =
        document.createElement('a');


      link.download =
        'duskOS-paint.png';


      link.href =
        canvas.toDataURL(
          'image/png'
        );


      link.click();


      if (status) {

        status.textContent =
          'Painting saved';

      }

    }
  );


  setTimeout(
    resizeCanvas,
    100
  );


  const resizeObserver =
    new ResizeObserver(
      () => resizeCanvas()
    );


  resizeObserver.observe(
    canvas.parentElement
  );


  win.addEventListener(
    'duskos:cleanup',
    () => {

      resizeObserver.disconnect();

    }
  );

}


/* =========================================================
   CLOCK APP
   ========================================================= */

function setupClockApp(win) {

  const tabs =
    win.querySelectorAll(
      '.clock-tab'
    );

  const panels =
    win.querySelectorAll(
      '.clock-panel'
    );


  tabs.forEach(
    tab => {

      tab.addEventListener(
        'click',
        () => {

          const target =
            tab.dataset.clockTab;


          tabs.forEach(
            t =>
              t.classList.remove(
                'active'
              )
          );


          panels.forEach(
            panel => {

              panel.classList.toggle(
                'active',
                panel.dataset.clockPanel ===
                target
              );

            }
          );


          tab.classList.add(
            'active'
          );

        }
      );

    }
  );


  /* -------------------------------------------------------
     WORLD CLOCK
     ------------------------------------------------------- */

  function updateWorld() {

    const now =
      new Date();


    const zones = {

      local:
        undefined,

      utc:
        'UTC',

      tokyo:
        'Asia/Tokyo',

      newyork:
        'America/New_York'

    };


    const formats = {

      hour:
        '2-digit',

      minute:
        '2-digit',

      second:
        '2-digit'

    };


    Object.entries(zones)
      .forEach(
        ([name, zone]) => {

          const el =
            win.querySelector(
              `.world-${name}`
            );


          if (!el) {
            return;
          }


          el.textContent =
            new Intl.DateTimeFormat(
              undefined,
              {
                ...formats,
                ...(zone
                  ? {
                      timeZone: zone
                    }
                  : {})
              }
            ).format(now);

        }
      );

  }


  updateWorld();


  const worldTimer =
    setInterval(
      updateWorld,
      1000
    );


  /* -------------------------------------------------------
     STOPWATCH
     ------------------------------------------------------- */

  const stopwatchDisplay =
    win.querySelector(
      '#stopwatch-display'
    );

  const stopwatchStart =
    win.querySelector(
      '#stopwatch-start'
    );

  const stopwatchReset =
    win.querySelector(
      '#stopwatch-reset'
    );


  let stopwatchRunning =
    false;

  let stopwatchStartTime =
    0;

  let stopwatchElapsed =
    0;

  let stopwatchTimer =
    null;


  function formatStopwatch(ms) {

    const minutes =
      Math.floor(
        ms / 60000
      );


    const seconds =
      Math.floor(
        (ms % 60000) / 1000
      );


    const tenths =
      Math.floor(
        (ms % 1000) / 100
      );


    return (
      `${String(minutes).padStart(2, '0')}:` +
      `${String(seconds).padStart(2, '0')}.` +
      `${tenths}`
    );

  }


  function updateStopwatch() {

    if (!stopwatchRunning) {
      return;
    }


    stopwatchElapsed =
      Date.now() -
      stopwatchStartTime;


    stopwatchDisplay.textContent =
      formatStopwatch(
        stopwatchElapsed
      );

  }


  stopwatchStart.addEventListener(
    'click',
    () => {

      if (!stopwatchRunning) {

        stopwatchRunning =
          true;


        stopwatchStartTime =
          Date.now() -
          stopwatchElapsed;


        stopwatchStart.textContent =
          'Pause';


        stopwatchTimer =
          setInterval(
            updateStopwatch,
            50
          );


      } else {

        stopwatchRunning =
          false;


        clearInterval(
          stopwatchTimer
        );


        stopwatchTimer =
          null;


        stopwatchStart.textContent =
          'Start';

      }

    }
  );


  stopwatchReset.addEventListener(
    'click',
    () => {

      stopwatchRunning =
        false;


      clearInterval(
        stopwatchTimer
      );


      stopwatchTimer =
        null;


      stopwatchElapsed =
        0;


      stopwatchDisplay.textContent =
        '00:00.0';


      stopwatchStart.textContent =
        'Start';

    }
  );


  /* -------------------------------------------------------
     TIMER
     ------------------------------------------------------- */

  const timerDisplay =
    win.querySelector(
      '#timer-display'
    );

  const timerMinutes =
    win.querySelector(
      '#timer-minutes'
    );

  const timerSeconds =
    win.querySelector(
      '#timer-seconds'
    );

  const timerStart =
    win.querySelector(
      '#timer-start'
    );

  const timerReset =
    win.querySelector(
      '#timer-reset'
    );


  let timerRunning =
    false;

  let timerRemaining =
    300;

  let timerInterval =
    null;


  function updateTimerDisplay() {

    const mins =
      Math.floor(
        timerRemaining / 60
      );


    const secs =
      timerRemaining % 60;


    timerDisplay.textContent =
      `${String(mins).padStart(2, '0')}:` +
      `${String(secs).padStart(2, '0')}`;

  }


  function readTimerInputs() {

    const mins =
      Math.max(
        0,
        Number(
          timerMinutes.value
        ) || 0
      );


    const secs =
      Math.max(
        0,
        Math.min(
          59,
          Number(
            timerSeconds.value
          ) || 0
        )
      );


    timerRemaining =
      mins * 60 +
      secs;

  }


  timerStart.addEventListener(
    'click',
    () => {

      if (!timerRunning) {

        if (
          timerRemaining <= 0
        ) {

          readTimerInputs();

        }


        if (
          timerRemaining <= 0
        ) {
          return;
        }


        timerRunning =
          true;


        timerStart.textContent =
          'Pause';


        timerInterval =
          setInterval(
            () => {

              timerRemaining--;

              updateTimerDisplay();


              if (
                timerRemaining <= 0
              ) {

                clearInterval(
                  timerInterval
                );


                timerInterval =
                  null;


                timerRunning =
                  false;


                timerStart.textContent =
                  'Start';


                showToast(
                  '⏱️',
                  'Timer',
                  'Timer finished.'
                );

              }

            },
            1000
          );


      } else {

        timerRunning =
          false;


        clearInterval(
          timerInterval
        );


        timerInterval =
          null;


        timerStart.textContent =
          'Start';

      }

    }
  );


  timerReset.addEventListener(
    'click',
    () => {

      timerRunning =
        false;


      clearInterval(
        timerInterval
      );


      timerInterval =
        null;


      readTimerInputs();


      updateTimerDisplay();


      timerStart.textContent =
        'Start';

    }
  );


  timerMinutes.addEventListener(
    'input',
    () => {

      if (!timerRunning) {

        readTimerInputs();

        updateTimerDisplay();

      }

    }
  );


  timerSeconds.addEventListener(
    'input',
    () => {

      if (!timerRunning) {

        readTimerInputs();

        updateTimerDisplay();

      }

    }
  );


  updateTimerDisplay();


  win.addEventListener(
    'duskos:cleanup',
    () => {

      clearInterval(
        worldTimer
      );

      clearInterval(
        stopwatchTimer
      );

      clearInterval(
        timerInterval
      );

    }
  );

}


/* =========================================================
   SETTINGS / APPEARANCE
   ========================================================= */

function applyAppearance(light) {

  isLight =
    Boolean(light);


  document.body.classList.toggle(
    'light-mode',
    isLight
  );


  document
    .querySelectorAll(
      '.appearance-value'
    )
    .forEach(
      el => {

        el.textContent =
          isLight
            ? 'Daylight'
            : 'Dusk';

      }
    );


  document
    .querySelectorAll(
      '.appearance-switch'
    )
    .forEach(
      el => {

        el.classList.toggle(
          'is-on',
          isLight
        );

      }
    );


  localStorage.setItem(
    'duskOS-theme',
    isLight
      ? 'light'
      : 'dark'
  );

}


/* Restore saved theme */

const savedTheme =
  localStorage.getItem(
    'TON-618 OS-theme'
  );


if (savedTheme === 'light') {
  isLight = true;
}

if (savedTheme === 'dark') {
  isLight = false;
}


function setupSettings(win) {

  const items =
    win.querySelectorAll(
      '.st-item'
    );

  const panels =
    win.querySelectorAll(
      '.st-panel'
    );


  items.forEach(
    item => {

      item.addEventListener(
        'click',
        () => {

          items.forEach(
            x =>
              x.classList.remove(
                'active'
              )
          );


          item.classList.add(
            'active'
          );


          panels.forEach(
            panel => {

              panel.hidden =
                panel.dataset.panel !==
                item.dataset.panel;

            }
          );

        }
      );

    }
  );


  const toggle =
    win.querySelector(
      '#settings-appearance-toggle'
    );


  if (toggle) {

    toggle.addEventListener(
      'click',
      () => {

        applyAppearance(
          !isLight
        );

      }
    );

  }


  applyAppearance(
    isLight
  );

}


/* =========================================================
   DOCK
   ========================================================= */

function handleDockClick(appId) {

  if (!appId) {
    return;
  }


  const win =
    openWindows[appId];


  if (!win) {

    openApp(
      appId
    );


  } else if (

    win.style.display === 'none' ||

    win.classList.contains(
      'minimized-state'
    ) ||

    win.classList.contains(
      'minimized'
    )

  ) {

    restoreWindow(
      appId
    );


  } else if (

    win.classList.contains(
      'focused'
    )

  ) {

    minimizeApp(
      appId
    );


  } else {

    focusWindow(
      win,
      appId
    );

  }

}


document
  .querySelectorAll(
    '.dock-item'
  )
  .forEach(
    item => {

      item.addEventListener(
        'click',
        e => {

          e.stopPropagation();

          handleDockClick(
            item.dataset.app
          );

        }
      );

    }
  );


/* =========================================================
   DESKTOP ICONS
   ========================================================= */

document
  .querySelectorAll(
    '.dicon[data-open]'
  )
  .forEach(
    icon => {

      icon.addEventListener(
        'dblclick',
        () => {

          openApp(
            icon.dataset.open
          );

        }
      );


      icon.addEventListener(
        'click',
        () => {

          document
            .querySelectorAll(
              '.dicon'
            )
            .forEach(
              other =>
                other.classList.remove(
                  'selected'
                )
            );


          icon.classList.add(
            'selected'
          );

        }
      );

    }
  );


/* =========================================================
   DESKTOP CLICK
   ========================================================= */

const desktop =
  document.getElementById(
    'desktop'
  );


if (desktop) {

  desktop.addEventListener(
    'click',
    e => {

      if (
        e.target === desktop ||
        e.target.classList.contains('sun')
      ) {

        document
          .querySelectorAll(
            '.dicon'
          )
          .forEach(
            icon =>
              icon.classList.remove(
                'selected'
              )
          );

      }

    }
  );

}


/* =========================================================
   DOCK MAGNIFICATION
   ========================================================= */

const dock =
  document.getElementById(
    'dock'
  );


if (dock) {

  dock.addEventListener(
    'mousemove',
    e => {

      const items =
        dock.querySelectorAll(
          '.dock-item'
        );


      items.forEach(
        item => {

          const rect =
            item.getBoundingClientRect();


          const dist =
            Math.abs(
              e.clientX -
              (
                rect.left +
                rect.width / 2
              )
            );


          const max =
            74;

          const base =
            52;

          const range =
            110;


          const scale =
            dist > range
              ? 0
              : 1 -
                dist / range;


          const size =
            base +
            (
              max -
              base
            ) *
            scale;


          item.style.width =
            `${size}px`;


          item.style.height =
            `${size}px`;


          item.style.fontSize =
            `${24 + 10 * scale}px`;

        }
      );

    }
  );


  dock.addEventListener(
    'mouseleave',
    () => {

      dock
        .querySelectorAll(
          '.dock-item'
        )
        .forEach(
          item => {

            item.style.width =
              '';

            item.style.height =
              '';

            item.style.fontSize =
              '';

          }
        );

    }
  );

}


/* =========================================================
   CONTROL CENTER
   ========================================================= */

const cc =
  document.getElementById(
    'control-center'
  );

const ccToggle =
  document.getElementById(
    'cc-toggle'
  );


if (
  ccToggle &&
  cc
) {

  ccToggle.addEventListener(
    'click',
    e => {

      e.stopPropagation();

      cc.classList.toggle(
        'open'
      );

    }
  );


  document.addEventListener(
    'click',
    e => {

      if (
        !cc.contains(e.target) &&
        !ccToggle.contains(e.target)
      ) {

        cc.classList.remove(
          'open'
        );

      }

    }
  );

}


/* =========================================================
   CONTROL CENTER APPEARANCE (handled by TON-618 theme engine)
   ========================================================= */

/* =========================================================
   WIFI TILE
   ========================================================= */

const wifiTile =
  document.getElementById(
    'wifi-tile'
  );


if (wifiTile) {

  wifiTile.addEventListener(
    'click',
    () => {

      showToast(
        '📶',
        'Wi-Fi',
        'Connected'
      );

    }
  );

}


/* =========================================================
   BRIGHTNESS
   ========================================================= */

const brightness =
  document.getElementById(
    'brightness'
  );


if (brightness) {

  function applyBrightness() {

    const value =
      Number(
        brightness.value
      ) / 100;


    if (desktop) {

      desktop.style.filter =
        `brightness(${value})`;

    }

  }


  brightness.addEventListener(
    'input',
    applyBrightness
  );


  applyBrightness();

}


/* =========================================================
   VOLUME
   ========================================================= */

document
  .querySelectorAll(
    '.volume-slider'
  )
  .forEach(
    slider => {

      slider.addEventListener(
        'input',
        () => {

          document
            .querySelectorAll(
              '.volume-slider'
            )
            .forEach(
              other => {

                if (
                  other !== slider
                ) {

                  other.value =
                    slider.value;

                }

              }
            );

        }
      );

    }
  );


/* =========================================================
   TOAST SYSTEM
   ========================================================= */

function showToast(
  icon,
  title,
  message
) {

  const stack =
    document.getElementById(
      'toast-stack'
    );


  if (!stack) {
    return;
  }


  const toast =
    document.createElement(
      'div'
    );


  toast.className =
    'toast';


  toast.innerHTML = `

    <div class="toast-icon">
      ${icon}
    </div>

    <div>
      <b>
        ${title}
      </b>

      <span>
        ${message}
      </span>
    </div>

  `;


  stack.appendChild(
    toast
  );


  requestAnimationFrame(
    () => {

      toast.classList.add(
        'show'
      );

    }
  );


  setTimeout(
    () => {

      toast.classList.remove(
        'show'
      );


      setTimeout(
        () => {

          if (toast.isConnected) {
            toast.remove();
          }

        },
        250
      );

    },
    2500
  );

}


/* =========================================================
   DYNAMIC ISLAND / SPOTLIGHT
   ========================================================= */

const island =
  document.getElementById(
    'island'
  );

const spInput =
  document.getElementById(
    'spotlight-input'
  );

const spResults =
  document.getElementById(
    'spotlight-results'
  );


let spotlightSelected =
  0;


function renderSpotlight(
  query = ''
) {

  if (!spResults) {
    return;
  }


  const q =
    query
      .trim()
      .toLowerCase();


  const matches =
    Object.entries(
      APPS
    )
    .filter(
      ([id, cfg]) => {

        return (
          !q ||
          cfg.title
            .toLowerCase()
            .includes(q) ||
          id.includes(q)
        );

      }
    );


  spResults.innerHTML =
    '';


  spotlightSelected =
    0;


  if (!matches.length) {

    spResults.innerHTML = `

      <div class="sp-empty">
        No apps found
      </div>

    `;

    return;

  }


  matches.forEach(
    ([id, cfg], index) => {

      const item =
        document.createElement(
          'div'
        );


      item.className =
        'sp-item' +
        (
          index === 0
            ? ' sel'
            : ''
        );


      item.innerHTML = `

        <div class="glyph ${cfg.glyphClass}">
          ${cfg.glyph}
        </div>

        <div class="meta">

          <b>
            ${cfg.title}
          </b>

          <small>
            Open application
          </small>

        </div>

      `;


      item.addEventListener(
        'click',
        () => {

          openApp(
            id
          );


          island?.classList.remove(
            'expanded'
          );


          if (spInput) {

            spInput.value =
              '';

          }

        }
      );


      spResults.appendChild(
        item
      );

    }
  );

}


/* =========================================================
   SPOTLIGHT EXPAND
   ========================================================= */

function expandIsland() {

  if (!island) {
    return;
  }


  island.classList.add(
    'expanded'
  );


  renderSpotlight(
    spInput?.value || ''
  );


  setTimeout(
    () => {

      spInput?.focus();

    },
    100
  );

}


if (island) {

  island.addEventListener(
    'click',
    e => {

      if (
        !e.target.closest(
          '.sp-item'
        )
      ) {

        if (
          !island.classList.contains(
            'expanded'
          )
        ) {

          expandIsland();

        }

      }

    }
  );

}


/* =========================================================
   SPOTLIGHT INPUT
   ========================================================= */

if (spInput) {

  spInput.addEventListener(
    'input',
    () => {

      renderSpotlight(
        spInput.value
      );

    }
  );


  spInput.addEventListener(
    'keydown',
    e => {

      if (
        e.key === 'Escape'
      ) {

        island?.classList.remove(
          'expanded'
        );


        spInput.value =
          '';


        return;

      }


      if (
        e.key === 'ArrowDown'
      ) {

        e.preventDefault();

        moveSpotlightSelection(
          1
        );

        return;

      }


      if (
        e.key === 'ArrowUp'
      ) {

        e.preventDefault();

        moveSpotlightSelection(
          -1
        );

        return;

      }


      if (
        e.key === 'Enter'
      ) {

        const selected =
          spResults?.querySelector(
            '.sp-item.sel'
          );


        const first =
          selected ||
          spResults?.querySelector(
            '.sp-item'
          );


        if (first) {
          first.click();
        }

      }

    }
  );

}


/* =========================================================
   SPOTLIGHT KEYBOARD SELECTION
   ========================================================= */

function moveSpotlightSelection(
  direction
) {

  if (!spResults) {
    return;
  }


  const items =
    [
      ...spResults.querySelectorAll(
        '.sp-item'
      )
    ];


  if (!items.length) {
    return;
  }


  spotlightSelected =
    (
      spotlightSelected +
      direction +
      items.length
    ) %
    items.length;


  items.forEach(
    (item, index) => {

      item.classList.toggle(
        'sel',
        index === spotlightSelected
      );

    }
  );

}


/* =========================================================
   KEYBOARD SHORTCUTS
   ========================================================= */

document.addEventListener(
  'keydown',
  e => {

    /*
      Ctrl/Cmd + Space
      = Spotlight
    */

    if (
      (e.ctrlKey || e.metaKey) &&
      e.code === 'Space'
    ) {

      e.preventDefault();

      expandIsland();

      return;

    }


    /*
      Escape closes Spotlight
    */

    if (
      e.key === 'Escape' &&
      island?.classList.contains(
        'expanded'
      )
    ) {

      island.classList.remove(
        'expanded'
      );


      if (spInput) {

        spInput.value =
          '';

      }

    }

  }
);


/* =========================================================
   SCREENSHOT BUTTON
   ========================================================= */

const screenshotButton = document.getElementById('screenshot-button');

async function takeWebsiteScreenshot() {
  const target = document.documentElement;
  if (!window.html2canvas) {
    showToast('📸', 'Screenshot', 'Screenshot engine is still loading.');
    return;
  }
  try {
    showToast('📸', 'Screenshot', 'Capturing TON-618 OS...');
    const canvas = await html2canvas(target, {
      backgroundColor: null,
      useCORS: true,
      allowTaint: false,
      logging: false,
      width: window.innerWidth,
      height: window.innerHeight,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      scale: Math.min(window.devicePixelRatio || 1, 2)
    });
    const link = document.createElement('a');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `TON-618-OS-${stamp}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('✓', 'Screenshot saved', 'Your website screenshot was downloaded as PNG.');
  } catch (error) {
    console.error(error);
    showToast('⚠️', 'Screenshot failed', 'The browser blocked part of the page. Try again.');
  }
}

if (screenshotButton) {
  screenshotButton.addEventListener('click', takeWebsiteScreenshot);
}

/* =========================================================
   GLOBAL RESIZE
   ========================================================= */

window.addEventListener(
  'resize',
  () => {

    Object.values(
      openWindows
    )
    .forEach(
      win => {

        if (!win || !win.isConnected) {
          return;
        }


        if (
          win.classList.contains(
            'maximized'
          )
        ) {
          return;
        }


        const rect =
          win.getBoundingClientRect();


        if (
          rect.right >
          window.innerWidth
        ) {

          win.style.left =
            `${Math.max(
              0,
              window.innerWidth -
              win.offsetWidth -
              10
            )}px`;

        }


        if (
          rect.bottom >
          window.innerHeight
        ) {

          win.style.top =
            `${Math.max(
              28,
              window.innerHeight -
              win.offsetHeight -
              10
            )}px`;

        }

      }
    );

  }
);


/* =========================================================
   CLEANUP HOOK
   ========================================================= */

function cleanupWindow(
  win
) {

  if (!win) {
    return;
  }


  win.dispatchEvent(
    new Event(
      'duskos:cleanup'
    )
  );

}


/* =========================================================
   PATCH CLOSE TO CLEAN APP TIMERS
   ========================================================= */

const originalCloseApp =
  closeApp;


closeApp =
  function(appId) {

    const win =
      openWindows[appId];


    if (win) {

      cleanupWindow(
        win
      );

    }


    originalCloseApp(
      appId
    );

  };


/* =========================================================
   INITIAL STATE
   ========================================================= */

applyAppearance(
  isLight
);


/* =========================================================
   DEV CONSOLE MESSAGE
   ========================================================= */

console.log(
  '%c TON-618 OS ',
  'background:#17131f;color:#fff;padding:6px 10px;border-radius:8px;font-weight:bold;'
);

console.log(
  'TON-618 OS desktop initialized successfully.'
);

/* =========================================================
   TON-618 OS THEME ENGINE
   ========================================================= */

const TON618_THEMES = {
  singularity: { label: 'Singularity', light: false },
  obsidian: { label: 'Obsidian', light: false },
  aurora: { label: 'Aurora', light: false },
  daylight: { label: 'Daylight', light: true }
};

function currentTheme() {
  return localStorage.getItem('ton618-theme') || 'singularity';
}

function applyTheme(theme) {
  if (!TON618_THEMES[theme]) theme = 'singularity';
  Object.keys(TON618_THEMES).forEach(name => document.body.classList.toggle(`theme-${name}`, name === theme));
  document.body.classList.toggle('light-mode', TON618_THEMES[theme].light);
  localStorage.setItem('ton618-theme', theme);
  localStorage.setItem('duskOS-theme', TON618_THEMES[theme].light ? 'light' : 'dark');
  document.querySelectorAll('.appearance-value').forEach(el => el.textContent = TON618_THEMES[theme].label);
  document.querySelectorAll('[data-theme]').forEach(btn => btn.classList.toggle('active', btn.dataset.theme === theme));
}

function applyAppearance(light) {
  const theme = light ? 'daylight' : (currentTheme() === 'daylight' ? 'singularity' : currentTheme());
  applyTheme(theme);
}

function cycleTheme() {
  const names = Object.keys(TON618_THEMES);
  const next = names[(names.indexOf(currentTheme()) + 1) % names.length];
  applyTheme(next);
}

const firstTheme = localStorage.getItem('ton618-theme') || (localStorage.getItem('duskOS-theme') === 'light' ? 'daylight' : 'singularity');
applyTheme(firstTheme);

/* theme buttons inside dynamically opened settings */
const oldSetupSettings = setupSettings;
setupSettings = function(win) {
  oldSetupSettings(win);
  win.querySelectorAll('[data-theme]').forEach(btn => btn.addEventListener('click', () => applyTheme(btn.dataset.theme)));
  applyTheme(currentTheme());
};

/* =========================================================
   DESKTOP ICONS: DRAG + PERSISTENCE + ADDABLE SHORTCUTS
   ========================================================= */

const desktopIcons = document.getElementById('desktop-icons');
const desktopMenu = document.getElementById('desktop-context');
const picker = document.getElementById('shortcut-picker');
const pickerList = document.getElementById('shortcut-picker-list');
const pickerClose = document.getElementById('shortcut-picker-close');
const ICONS_KEY = 'ton618-desktop-icons';

function iconPositions() {
  try { return JSON.parse(localStorage.getItem(ICONS_KEY) || '{}'); } catch { return {}; }
}

function saveIconPosition(icon) {
  const data = iconPositions();
  data[icon.dataset.open] = {
    left: parseInt(icon.style.left || icon.offsetLeft, 10),
    top: parseInt(icon.style.top || icon.offsetTop, 10)
  };
  localStorage.setItem(ICONS_KEY, JSON.stringify(data));
}

function arrangeDesktopIcon(icon, index = 0) {
  const saved = iconPositions()[icon.dataset.open];
  const fallback = { left: 20, top: 54 + index * 100 };
  const pos = saved || fallback;
  icon.style.left = `${Math.max(8, pos.left)}px`;
  icon.style.top = `${Math.max(42, pos.top)}px`;
  icon.style.position = 'absolute';
}

function wireDesktopIcon(icon) {
  if (icon.dataset.ton618Wired) return;
  icon.dataset.ton618Wired = '1';
  icon.draggable = false;
  icon.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    const rect = icon.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    icon.setPointerCapture?.(event.pointerId);
    let moved = false;
    const move = ev => {
      const maxX = Math.max(8, window.innerWidth - icon.offsetWidth - 8);
      const maxY = Math.max(42, window.innerHeight - icon.offsetHeight - 16);
      const left = Math.max(8, Math.min(maxX, ev.clientX - offsetX));
      const top = Math.max(42, Math.min(maxY, ev.clientY - offsetY));
      if (Math.abs(ev.clientX - event.clientX) + Math.abs(ev.clientY - event.clientY) > 4) moved = true;
      if (moved) {
        icon.style.left = `${left}px`;
        icon.style.top = `${top}px`;
      }
    };
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      if (moved) saveIconPosition(icon);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  });
}

function setupDesktopIcons() {
  document.querySelectorAll('.dicon[data-open]').forEach((icon, index) => {
    arrangeDesktopIcon(icon, index);
    wireDesktopIcon(icon);
  });
}

function showDesktopMenu(x, y) {
  if (!desktopMenu) return;
  desktopMenu.hidden = false;
  desktopMenu.style.left = `${Math.min(x, window.innerWidth - 230)}px`;
  desktopMenu.style.top = `${Math.min(y, window.innerHeight - 120)}px`;
}

function hideDesktopMenu() { if (desktopMenu) desktopMenu.hidden = true; }

function populateShortcutPicker() {
  if (!pickerList) return;
  const existing = new Set([...document.querySelectorAll('.dicon[data-open]')].map(x => x.dataset.open));
  pickerList.innerHTML = Object.entries(APPS).map(([id, app]) => `
    <button class="shortcut-option ${existing.has(id) ? 'is-added' : ''}" data-app="${id}" ${existing.has(id) ? 'disabled' : ''} type="button">
      <span class="shortcut-glyph ${app.glyphClass}">${app.glyph}</span>
      <span><b>${app.title}</b><small>${existing.has(id) ? 'Already on desktop' : 'Add shortcut'}</small></span>
    </button>
  `).join('');
  pickerList.querySelectorAll('.shortcut-option:not([disabled])').forEach(btn => btn.addEventListener('click', () => addDesktopIcon(btn.dataset.app)));
}

function openShortcutPicker() {
  hideDesktopMenu();
  if (!picker) return;
  picker.hidden = false;
  populateShortcutPicker();
}

function addDesktopIcon(appId) {
  if (!desktopIcons || !APPS[appId]) return;
  if (desktopIcons.querySelector(`.dicon[data-open="${appId}"]`)) return;
  const icon = document.createElement('div');
  icon.className = 'dicon desktop-added';
  icon.dataset.open = appId;
  icon.innerHTML = `<div class="glyph ${APPS[appId].glyphClass}">${APPS[appId].glyph}</div><span>${APPS[appId].title}</span>`;
  desktopIcons.appendChild(icon);
  const count = desktopIcons.querySelectorAll('.dicon').length - 1;
  icon.style.left = `${26 + (count % 2) * 106}px`;
  icon.style.top = `${54 + Math.floor(count / 2) * 100}px`;
  wireDesktopIcon(icon);
  saveIconPosition(icon);
  icon.addEventListener('dblclick', () => openApp(appId));
  icon.addEventListener('click', () => {
    document.querySelectorAll('.dicon').forEach(x => x.classList.remove('selected'));
    icon.classList.add('selected');
  });
  picker.hidden = true;
  showToast('＋', 'Desktop icon added', `${APPS[appId].title} is now on the desktop.`);
}

if (desktopIcons) setupDesktopIcons();
if (desktop) {
  desktop.addEventListener('contextmenu', e => { e.preventDefault(); showDesktopMenu(e.clientX, e.clientY); });
}
desktopMenu?.addEventListener('click', e => {
  const action = e.target.closest('[data-desktop-action]')?.dataset.desktopAction;
  if (action === 'add') openShortcutPicker();
  if (action === 'reset') {
    localStorage.removeItem(ICONS_KEY);
    setupDesktopIcons();
    hideDesktopMenu();
    showToast('↺', 'Desktop reset', 'Icon positions were reset.');
  }
});
pickerClose?.addEventListener('click', () => picker.hidden = true);
document.addEventListener('click', e => {
  if (!desktopMenu?.contains(e.target)) hideDesktopMenu();
});

/* =========================================================
   AI.EXE REWIRE: keep it inside the window manager
   ========================================================= */

/* =========================================================
   CONTROL CENTER / THEME CYCLE OVERRIDE
   ========================================================= */
const ccTheme = document.getElementById('cc-appearance-toggle');
ccTheme?.addEventListener('click', e => { e.stopPropagation(); cycleTheme(); });
