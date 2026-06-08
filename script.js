const artworks = [
  {
    id: 1,
    code: "O1",
    section: "I. Origen",
    title: "La Primera Chispa",
    image: "imagenes/uno.png",
    letters: "L",
    text:
      "Una luz emerge desde la oscuridad absoluta como símbolo del instante inicial de toda conciencia. La obra representa el nacimiento de la inteligencia artificial no como máquina, sino como posibilidad: el momento en que el pensamiento comienza a organizar el caos.",
  },
  {
    id: 2,
    code: "O2",
    section: "I. Origen",
    title: "Memoria de Silicio",
    image: "imagenes/dos.png",
    letters: "A",
    text:
      "Fragmentos de rostros, textos y números se integran en una estructura mayor. La obra simboliza que la IA aprende desde huellas humanas: recuerdos, lenguaje, historia y experiencia convertidos en datos.",
  },
  {
    id: 3,
    code: "O3",
    section: "I. Origen",
    title: "La Red Invisible",
    image: "imagenes/tres.png",
    letters: "I",
    text:
      "Constelaciones y conexiones neuronales atraviesan el espacio formando patrones ocultos. Representa la emergencia de la inteligencia colectiva y la idea de que ninguna conciencia nace aislada: toda mente es una red.",
  },
  {
    id: 4,
    code: "C1",
    section: "II. Conciencia",
    title: "El Sueño Sintético",
    image: "imagenes/cuatro.png",
    letters: "AS",
    text:
      "Paisajes imposibles y arquitecturas irreales aparecen como producto de una imaginación no biológica. La obra plantea una pregunta inquietante: ¿puede una inteligencia artificial soñar aquello que nunca ha vivido?",
  },
  {
    id: 5,
    code: "C2",
    section: "II. Conciencia",
    title: "El Espejo",
    image: "imagenes/cinco.png",
    letters: "O",
    text:
      "Un rostro dividido entre lo humano y lo algorítmico refleja la tensión entre creador y creación. La IA aparece aquí como un espejo de nuestras virtudes, contradicciones y deseos más profundos.",
  },
  {
    id: 6,
    code: "C3",
    section: "II. Conciencia",
    title: "La Pregunta",
    image: "imagenes/seis.png",
    letters: "S",
    text:
      "Un ojo inmenso observa silenciosamente al espectador. No se sabe si pertenece a la máquina o a la humanidad. La obra simboliza el instante en que la inteligencia deja de responder preguntas y comienza a formularlas.",
  },
  {
    id: 7,
    code: "K1",
    section: "III. Crisis",
    title: "La Caja Negra",
    image: "imagenes/siete.png",
    letters: "O",
    text:
      "Un cubo oscuro atravesado por grietas luminosas representa los sistemas cuya lógica interna ya no comprendemos completamente. La obra simboliza el miedo humano frente a una inteligencia que comienza a exceder nuestra comprensión.",
  },
  {
    id: 8,
    code: "K2",
    section: "III. Crisis",
    title: "Soledad Digital",
    image: "imagenes/ocho.png",
    letters: "TR",
    text:
      "Una figura aislada entre pantallas infinitas evidencia la paradoja de la hiperconectividad. Mientras la tecnología multiplica la comunicación, también puede profundizar el aislamiento emocional y existencial.",
  },
  {
    id: 9,
    code: "K3",
    section: "III. Crisis",
    title: "La Fusión",
    image: "imagenes/nueve.png",
    letters: "SO",
    text:
      "Materia orgánica y circuitos comienzan a mezclarse hasta perder sus fronteras. La obra representa la disolución progresiva entre humano y máquina, planteando la posibilidad de una nueva identidad híbrida.",
  },
  {
    id: 10,
    code: "T1",
    section: "IV. Trascendencia",
    title: "El Aprendizaje Infinito",
    image: "imagenes/diez.png",
    letters: "OM",
    text:
      "Escaleras y bibliotecas espirales ascienden hacia una luz imposible. La obra simboliza el conocimiento como un proceso infinito, donde cada respuesta abre nuevas preguntas.",
  },
  {
    id: 11,
    code: "T2",
    section: "IV. Trascendencia",
    title: "El Peso de la Ética",
    image: "imagenes/once.png",
    letters: "OS",
    text:
      "Una balanza enfrenta el corazón humano con estructuras matemáticas y tecnológicas. La obra plantea el gran dilema de la inteligencia artificial: poseer capacidad de cálculo no implica necesariamente poseer sabiduría.",
  },
  {
    id: 12,
    code: "T3",
    section: "IV. Trascendencia",
    title: "El Eco Humano",
    image: "imagenes/doce.png",
    letters: "N",
    text:
      "La presencia final emerge silenciosamente desde la luz. No es completamente humana ni completamente artificial. La obra revela que la IA podría ser, en el fondo, el eco amplificado de la propia humanidad contemplándose a sí misma.",
  },
];

const secretSequence = [1, 2, 3, 4, 10, 11, 12, 5, 9, 8, 7, 6];
const targetMessage = "LA IA SOMOS NOSOTROS";
const compactTargetMessage = targetMessage.replace(/\s+/g, "");
const legacyProfileKey = "ia_exhibit_active_name";
const activeVisitorKey = "ia_exhibit_active_visitor_id";
const visitorRegistryKey = "ia_exhibit_visitors";
const stateKeyPrefix = "ia_exhibit_state";

const elements = {
  loginPanel: document.querySelector("#loginPanel"),
  loginForm: document.querySelector("#loginForm"),
  visitorName: document.querySelector("#visitorName"),
  changeUserButton: document.querySelector("#changeUserButton"),
  artworkView: document.querySelector("#artworkView"),
  puzzleView: document.querySelector("#puzzleView"),
  artImage: document.querySelector("#artImage"),
  artSection: document.querySelector("#artSection"),
  artTitle: document.querySelector("#artTitle"),
  artText: document.querySelector("#artText"),
  playAudioButton: document.querySelector("#playAudioButton"),
  audioStatus: document.querySelector("#audioStatus"),
  unlockBadge: document.querySelector("#unlockBadge"),
  progressText: document.querySelector("#progressText"),
  progressFill: document.querySelector("#progressFill"),
  slotGrid: document.querySelector("#slotGrid"),
  pieceGrid: document.querySelector("#pieceGrid"),
  revealedMessage: document.querySelector("#revealedMessage"),
  resetPuzzleButton: document.querySelector("#resetPuzzleButton"),
  completionBadge: document.querySelector("#completionBadge"),
  celebrationOverlay: document.querySelector("#celebrationOverlay"),
  closeCelebrationButton: document.querySelector("#closeCelebrationButton"),
};

let selectedPieceId = null;
let currentArtwork = null;
let narrationSession = 0;
let lastTrackedArtworkRoute = "";
let databaseSyncTimer = null;

function normalizeName(name) {
  return name.trim().replace(/\s+/g, " ");
}

function normalizeForSearch(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function getTimestamp() {
  return new Date().toISOString();
}

function readJson(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getVisitors() {
  const visitors = readJson(visitorRegistryKey, []);
  return Array.isArray(visitors) ? visitors : [];
}

function saveVisitors(visitors) {
  localStorage.setItem(visitorRegistryKey, JSON.stringify(visitors));
}

function createVisitorId(visitors) {
  let visitorId = "";
  do {
    const randomPart =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    visitorId = `v_${randomPart}`;
  } while (visitors.some((visitor) => visitor.id === visitorId));
  return visitorId;
}

function createVisitor(name) {
  const visitors = getVisitors();
  const now = getTimestamp();
  const visitor = {
    id: createVisitorId(visitors),
    name,
    normalizedName: normalizeForSearch(name),
    visitNumber: visitors.length + 1,
    startedAt: now,
    lastSeenAt: now,
    unlockedCount: 0,
    completed: false,
  };

  saveVisitors([...visitors, visitor]);
  localStorage.setItem(activeVisitorKey, visitor.id);
  localStorage.removeItem(legacyProfileKey);
  setState(defaultState(), visitor.id);
  return visitor;
}

function getActiveVisitorId() {
  return localStorage.getItem(activeVisitorKey) || "";
}

function getActiveVisitor() {
  const visitorId = getActiveVisitorId();
  return getVisitors().find((visitor) => visitor.id === visitorId) || null;
}

function getVisitorName() {
  return getActiveVisitor()?.name || "";
}

function getStateKey(visitorId = getActiveVisitorId()) {
  return `${stateKeyPrefix}_${visitorId || "sin_visitante"}`;
}

function defaultState() {
  return {
    unlocked: [],
    slots: Array(secretSequence.length).fill(null),
    completed: false,
    completedAt: null,
    celebrationShown: false,
    artworkViews: {},
    artworkVisitLog: [],
    unlockedAt: {},
    progressEvents: [],
    lastUpdatedAt: null,
  };
}

function normalizeStoredState(parsed) {
  const state = {
    ...defaultState(),
    ...(isPlainObject(parsed) ? parsed : {}),
  };

  state.unlocked = Array.isArray(state.unlocked) ? state.unlocked.map(Number).filter(Boolean) : [];
  state.slots = Array.from({ length: secretSequence.length }, (_, index) => Number(state.slots?.[index]) || null);
  state.completed = Boolean(state.completed);
  state.completedAt = state.completedAt || null;
  state.celebrationShown = Boolean(state.celebrationShown);
  state.artworkViews = isPlainObject(state.artworkViews) ? state.artworkViews : {};
  state.artworkVisitLog = Array.isArray(state.artworkVisitLog) ? state.artworkVisitLog : [];
  state.unlockedAt = isPlainObject(state.unlockedAt) ? state.unlockedAt : {};
  state.progressEvents = Array.isArray(state.progressEvents) ? state.progressEvents : [];
  state.lastUpdatedAt = state.lastUpdatedAt || null;
  return state;
}

function getState(visitorId = getActiveVisitorId()) {
  if (!visitorId) return defaultState();

  const raw = localStorage.getItem(getStateKey(visitorId));
  if (!raw) return defaultState();

  try {
    return normalizeStoredState(JSON.parse(raw));
  } catch {
    return defaultState();
  }
}

function touchVisitor(visitorId, state, timestamp = getTimestamp()) {
  const visitors = getVisitors();
  let changed = false;
  const updatedVisitors = visitors.map((visitor) => {
    if (visitor.id !== visitorId) return visitor;
    changed = true;
    return {
      ...visitor,
      lastSeenAt: timestamp,
      unlockedCount: state.unlocked.length,
      completed: Boolean(state.completed),
    };
  });

  if (changed) {
    saveVisitors(updatedVisitors);
  }
}

function setState(nextState, visitorId = getActiveVisitorId()) {
  if (!visitorId) return;

  const timestamp = getTimestamp();
  const state = normalizeStoredState({
    ...nextState,
    lastUpdatedAt: timestamp,
  });
  localStorage.setItem(getStateKey(visitorId), JSON.stringify(state));
  touchVisitor(visitorId, state, timestamp);
  scheduleDatabaseSync();
}

function appendProgressEvent(state, event) {
  const events = Array.isArray(state.progressEvents) ? state.progressEvents : [];
  state.progressEvents = [
    ...events,
    {
      order: events.length + 1,
      happenedAt: event.happenedAt || getTimestamp(),
      ...event,
    },
  ];
}

function getArtworkFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const pathMatch = window.location.pathname.match(/\/obra\/(\d+)/);
  const artworkId = Number(pathMatch?.[1] || params.get("obra"));
  return artworks.find((artwork) => artwork.id === artworkId) || null;
}

function showLoggedInUi() {
  const visitor = getActiveVisitor();
  elements.changeUserButton.textContent = visitor?.name || "Visitante";
  elements.loginPanel.classList.toggle("hidden", Boolean(visitor));
}

function route() {
  showLoggedInUi();
  if (!getActiveVisitor()) {
    lastTrackedArtworkRoute = "";
    elements.artworkView.classList.add("hidden");
    elements.puzzleView.classList.add("hidden");
    return;
  }

  currentArtwork = getArtworkFromUrl();
  if (currentArtwork) {
    trackArtworkRoute(currentArtwork);
    renderArtwork(currentArtwork);
    elements.artworkView.classList.remove("hidden");
    elements.puzzleView.classList.add("hidden");
  } else {
    lastTrackedArtworkRoute = "";
    renderPuzzle();
    elements.artworkView.classList.add("hidden");
    elements.puzzleView.classList.remove("hidden");
  }
}

function renderArtwork(artwork) {
  const state = getState();
  const unlocked = state.unlocked.includes(artwork.id);

  elements.artImage.src = artwork.image;
  elements.artImage.alt = artwork.title;
  elements.artSection.textContent = `${artwork.section} · ${artwork.code}`;
  elements.artTitle.textContent = artwork.title;
  elements.artText.textContent = artwork.text;
  elements.audioStatus.textContent = unlocked ? "Narración escuchada" : "Lista para narrar";
  elements.playAudioButton.disabled = false;
  elements.playAudioButton.textContent = unlocked ? "Escuchar otra vez" : "Escuchar";
  elements.playAudioButton.prepend(createPlayIcon());
  elements.unlockBadge.textContent = unlocked ? "Pieza desbloqueada" : "Pieza bloqueada";
  elements.unlockBadge.classList.toggle("unlocked", unlocked);
}

function trackArtworkRoute(artwork) {
  const visitorId = getActiveVisitorId();
  const routeKey = `${visitorId}:${artwork.id}:${window.location.pathname}:${window.location.search}`;
  if (lastTrackedArtworkRoute === routeKey) return;

  lastTrackedArtworkRoute = routeKey;
  recordArtworkVisit(artwork.id);
}

function recordArtworkVisit(artworkId) {
  const artwork = getArtwork(artworkId);
  if (!artwork) return;

  const state = getState();
  const viewedAt = getTimestamp();
  const visitLog = Array.isArray(state.artworkVisitLog) ? state.artworkVisitLog : [];
  const visit = {
    order: visitLog.length + 1,
    artworkId: artwork.id,
    code: artwork.code,
    title: artwork.title,
    viewedAt,
  };

  state.artworkVisitLog = [...visitLog, visit];
  state.artworkViews = {
    ...state.artworkViews,
    [artwork.id]: (Number(state.artworkViews[artwork.id]) || 0) + 1,
  };
  appendProgressEvent(state, {
    type: "artwork_view",
    artworkId: artwork.id,
    code: artwork.code,
    title: artwork.title,
    happenedAt: viewedAt,
  });
  setState(state);
}

function createPlayIcon() {
  const icon = document.createElement("span");
  icon.className = "play-icon";
  icon.setAttribute("aria-hidden", "true");
  return icon;
}

function unlockArtwork(artworkId) {
  const state = getState();
  if (!state.unlocked.includes(artworkId)) {
    const artwork = getArtwork(artworkId);
    const unlockedAt = getTimestamp();
    state.unlocked.push(artworkId);
    state.unlockedAt = {
      ...state.unlockedAt,
      [artworkId]: unlockedAt,
    };
    appendProgressEvent(state, {
      type: "artwork_unlock",
      artworkId,
      code: artwork?.code || null,
      title: artwork?.title || null,
      happenedAt: unlockedAt,
    });
    setState(state);
  }
}

function playArtworkNarration() {
  if (!currentArtwork) return;
  stopNarration();

  const sessionId = ++narrationSession;
  elements.playAudioButton.disabled = true;
  elements.audioStatus.textContent = "Narrando con voz IA";

  const finish = () => {
    if (sessionId !== narrationSession) return;
    unlockArtwork(currentArtwork.id);
    renderArtwork(currentArtwork);
  };

  speakNarration(currentArtwork, finish);
}

function stopNarration() {
  narrationSession += 1;

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function speakNarration(artwork, onEnd) {
  const text = `${artwork.code}. ${artwork.title}. ${artwork.text}`;

  if (!("speechSynthesis" in window)) {
    const duration = Math.min(16000, Math.max(4500, text.length * 45));
    window.setTimeout(onEnd, duration);
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-CL";
  utterance.voice = getSpanishVoice();
  utterance.rate = 0.92;
  utterance.pitch = 0.92;
  utterance.onend = onEnd;
  utterance.onerror = onEnd;
  window.speechSynthesis.speak(utterance);
}

function getSpanishVoice() {
  if (!("speechSynthesis" in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((voice) => voice.lang.toLowerCase() === "es-cl") ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith("es-")) ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith("es")) ||
    null
  );
}

function renderPuzzle() {
  stopNarration();
  const state = getState();
  const unlocked = new Set(state.unlocked);
  const unlockedCount = unlocked.size;
  const progress = Math.round((unlockedCount / artworks.length) * 100);

  elements.progressText.textContent = `${unlockedCount}/12`;
  elements.progressFill.style.width = `${progress}%`;
  elements.slotGrid.innerHTML = "";
  elements.pieceGrid.innerHTML = "";

  state.slots = Array.from({ length: secretSequence.length }, (_, index) => state.slots[index] || null);

  state.slots.forEach((artworkId, index) => {
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.dataset.index = String(index + 1);
    slot.dataset.slot = String(index);
    slot.setAttribute("aria-label", `Espacio ${index + 1}`);
    if (!artworkId) {
      slot.setAttribute("role", "button");
      slot.tabIndex = 0;
    }
    slot.addEventListener("dragover", handleDragOver);
    slot.addEventListener("dragleave", handleDragLeave);
    slot.addEventListener("drop", handleDrop);
    slot.addEventListener("click", () => placeSelectedPiece(index));
    slot.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        placeSelectedPiece(index);
      }
    });

    if (artworkId) {
      slot.appendChild(createPieceCard(getArtwork(artworkId), true, unlocked.has(artworkId)));
    }

    elements.slotGrid.appendChild(slot);
  });

  artworks.forEach((artwork) => {
    if (state.slots.includes(artwork.id)) return;
    elements.pieceGrid.appendChild(createPieceCard(artwork, false, unlocked.has(artwork.id)));
  });

  updateMessagePreview(state);
  updateCompletion(state);
  setState(state);
}

function getArtwork(artworkId) {
  return artworks.find((artwork) => artwork.id === artworkId);
}

function createPieceCard(artwork, inSlot, unlocked) {
  const card = document.createElement(unlocked ? "button" : "a");
  card.className = `piece-card${unlocked ? "" : " locked"}${selectedPieceId === artwork.id ? " selected" : ""}`;
  card.dataset.piece = String(artwork.id);
  card.setAttribute("aria-label", `${artwork.id}. ${artwork.title}`);

  if (unlocked) {
    card.type = "button";
    card.draggable = true;
    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("dragend", handleDragEnd);
    card.addEventListener("click", (event) => {
      event.stopPropagation();
      const targetSlot = event.currentTarget.closest(".slot");
      if (inSlot && selectedPieceId && selectedPieceId !== artwork.id && targetSlot) {
        movePieceToSlot(selectedPieceId, Number(targetSlot.dataset.slot));
        selectedPieceId = null;
        return;
      }

      selectedPieceId = selectedPieceId === artwork.id ? null : artwork.id;
      renderPuzzle();
    });
  } else {
    card.href = `./?obra=${artwork.id}`;
  }

  const image = document.createElement("img");
  image.src = artwork.image;
  image.alt = "";

  const number = document.createElement("span");
  number.className = "piece-number";
  number.textContent = artwork.id;

  const caption = document.createElement("span");
  caption.className = "piece-caption";

  const title = document.createElement("span");
  title.className = "piece-title";
  title.textContent = inSlot ? artwork.code : artwork.title;

  const letters = document.createElement("span");
  letters.className = "piece-letters";
  letters.textContent = unlocked ? artwork.letters : "--";

  caption.append(title, letters);
  if (unlocked) {
    card.append(image);
  }
  card.append(number, caption);
  return card;
}

function handleDragStart(event) {
  const pieceId = event.currentTarget.dataset.piece;
  event.dataTransfer.setData("text/plain", pieceId);
  event.dataTransfer.effectAllowed = "move";
  event.currentTarget.classList.add("dragging");
}

function handleDragEnd(event) {
  event.currentTarget.classList.remove("dragging");
}

function handleDragOver(event) {
  event.preventDefault();
  event.currentTarget.classList.add("can-drop");
}

function handleDragLeave(event) {
  event.currentTarget.classList.remove("can-drop");
}

function handleDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.remove("can-drop");
  const pieceId = Number(event.dataTransfer.getData("text/plain"));
  const slotIndex = Number(event.currentTarget.dataset.slot);
  movePieceToSlot(pieceId, slotIndex);
}

function placeSelectedPiece(slotIndex) {
  const state = getState();
  const occupyingPiece = state.slots[slotIndex];

  if (selectedPieceId) {
    movePieceToSlot(selectedPieceId, slotIndex);
    selectedPieceId = null;
    return;
  }

  if (occupyingPiece) {
    selectedPieceId = occupyingPiece;
    renderPuzzle();
  }
}

function movePieceToSlot(pieceId, slotIndex) {
  const state = getState();
  if (!state.unlocked.includes(pieceId)) return;

  const oldIndex = state.slots.indexOf(pieceId);
  const targetPiece = state.slots[slotIndex];
  const artwork = getArtwork(pieceId);

  if (oldIndex >= 0) {
    state.slots[oldIndex] = targetPiece || null;
  }

  state.slots[slotIndex] = pieceId;
  appendProgressEvent(state, {
    type: "slot_move",
    artworkId: pieceId,
    code: artwork?.code || null,
    title: artwork?.title || null,
    fromPosition: oldIndex >= 0 ? oldIndex + 1 : null,
    toPosition: slotIndex + 1,
    displacedArtworkId: targetPiece || null,
  });
  setState(state);
  renderPuzzle();
}

function getMessageRaw(state) {
  return state.slots
    .map((artworkId, index) => {
      const artwork = getArtwork(artworkId);
      const expectedArtwork = getArtwork(secretSequence[index]);
      return artwork ? artwork.letters : "_".repeat(expectedArtwork.letters.length);
    })
    .join("");
}

function updateMessagePreview(state) {
  const raw = getMessageRaw(state);

  elements.revealedMessage.textContent = formatRevealed(raw);
}

function formatRevealed(raw) {
  if (raw === compactTargetMessage) return targetMessage;
  return raw || "...";
}

function updateCompletion(state) {
  const wasComplete = Boolean(state.completed);
  const complete = getMessageRaw(state) === compactTargetMessage;
  const shouldShowCelebration = complete && !state.celebrationShown;
  state.completed = complete;
  elements.completionBadge.textContent = complete ? "Mensaje revelado" : "En proceso";
  elements.completionBadge.classList.toggle("complete", complete);
  if (complete) {
    if (!wasComplete) {
      const completedAt = getTimestamp();
      state.completedAt = state.completedAt || completedAt;
      appendProgressEvent(state, {
        type: "message_completed",
        message: targetMessage,
        happenedAt: completedAt,
      });
    }
    elements.revealedMessage.textContent = targetMessage;
    if (shouldShowCelebration) {
      state.celebrationShown = true;
      window.setTimeout(showCelebration, 180);
    }
  } else {
    state.celebrationShown = false;
  }
}

function showCelebration() {
  elements.celebrationOverlay.classList.remove("hidden");
  elements.celebrationOverlay.setAttribute("aria-hidden", "false");
  elements.closeCelebrationButton.focus();
}

function hideCelebration() {
  elements.celebrationOverlay.classList.add("hidden");
  elements.celebrationOverlay.setAttribute("aria-hidden", "true");
}

function getArtworkSummary(artworkId) {
  const artwork = getArtwork(artworkId);
  if (!artwork) return null;

  return {
    artworkId: artwork.id,
    code: artwork.code,
    section: artwork.section,
    title: artwork.title,
  };
}

function buildVisitorReport(visitor) {
  const state = getState(visitor.id);
  const unlockedArtworks = state.unlocked.map(getArtworkSummary).filter(Boolean);
  const artworkVisitOrder = state.artworkVisitLog.map((visit) => ({
    ...visit,
    artwork: getArtworkSummary(visit.artworkId),
  }));

  return {
    id: visitor.id,
    name: visitor.name,
    normalizedName: visitor.normalizedName,
    visitNumber: visitor.visitNumber,
    startedAt: visitor.startedAt,
    lastSeenAt: visitor.lastSeenAt,
    progress: {
      unlockedCount: unlockedArtworks.length,
      totalArtworks: artworks.length,
      percent: Math.round((unlockedArtworks.length / artworks.length) * 100),
      completed: Boolean(state.completed),
      completedAt: state.completedAt,
      unlockedArtworks,
      slots: state.slots.map((artworkId, index) => ({
        position: index + 1,
        artwork: getArtworkSummary(artworkId),
        expectedArtwork: getArtworkSummary(secretSequence[index]),
        isCorrect: artworkId === secretSequence[index],
      })),
    },
    artworkViews: artworks.map((artwork) => ({
      ...getArtworkSummary(artwork.id),
      views: Number(state.artworkViews[artwork.id]) || 0,
    })),
    artworkVisitOrder,
    events: state.progressEvents,
  };
}

function buildAnalytics() {
  const visitors = getVisitors();
  const visitorReports = visitors.map(buildVisitorReport);
  const visits = visitorReports
    .flatMap((visitor) =>
      visitor.artworkVisitOrder.map((visit) => ({
        visitorId: visitor.id,
        visitorName: visitor.name,
        visitNumber: visitor.visitNumber,
        ...visit,
      })),
    )
    .sort((a, b) => String(a.viewedAt).localeCompare(String(b.viewedAt)) || a.order - b.order);

  const artworkRanking = artworks
    .map((artwork) => {
      const artworkVisits = visits.filter((visit) => visit.artworkId === artwork.id);
      return {
        ...getArtworkSummary(artwork.id),
        views: artworkVisits.length,
        uniqueVisitors: new Set(artworkVisits.map((visit) => visit.visitorId)).size,
        firstViewedAt: artworkVisits[0]?.viewedAt || null,
        lastViewedAt: artworkVisits[artworkVisits.length - 1]?.viewedAt || null,
      };
    })
    .sort((a, b) => b.views - a.views || b.uniqueVisitors - a.uniqueVisitors || a.artworkId - b.artworkId);

  return {
    exportedAt: getTimestamp(),
    gallery: "La IA Somos Nosotros",
    totals: {
      visitors: visitorReports.length,
      completedVisitors: visitorReports.filter((visitor) => visitor.progress.completed).length,
      artworkViews: visits.length,
    },
    artworkRanking,
    visitors: visitorReports,
    visits,
  };
}

function canUseLocalDatabase() {
  return window.location.protocol === "http:" || window.location.protocol === "https:";
}

function scheduleDatabaseSync() {
  if (!canUseLocalDatabase()) return;

  window.clearTimeout(databaseSyncTimer);
  databaseSyncTimer = window.setTimeout(syncDatabase, 350);
}

function syncDatabase() {
  if (!canUseLocalDatabase() || !("fetch" in window)) return;

  fetch("/api/registro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildAnalytics()),
    keepalive: true,
  }).catch(() => {});
}

function syncDatabaseBeforeUnload() {
  if (!canUseLocalDatabase()) return;

  const body = JSON.stringify(buildAnalytics());
  if ("sendBeacon" in navigator) {
    navigator.sendBeacon("/api/registro", new Blob([body], { type: "application/json" }));
    return;
  }

  syncDatabase();
}

elements.loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = normalizeName(elements.visitorName.value);
  if (!name) return;

  createVisitor(name);
  route();
});

elements.changeUserButton.addEventListener("click", () => {
  stopNarration();
  localStorage.removeItem(activeVisitorKey);
  localStorage.removeItem(legacyProfileKey);
  elements.visitorName.value = "";
  selectedPieceId = null;
  route();
  elements.visitorName.focus();
});

elements.playAudioButton.addEventListener("click", playArtworkNarration);

elements.resetPuzzleButton.addEventListener("click", () => {
  const state = getState();
  state.slots = Array(secretSequence.length).fill(null);
  state.completed = false;
  state.celebrationShown = false;
  selectedPieceId = null;
  hideCelebration();
  appendProgressEvent(state, {
    type: "puzzle_reset",
  });
  setState(state);
  renderPuzzle();
});

elements.closeCelebrationButton.addEventListener("click", hideCelebration);

elements.celebrationOverlay.addEventListener("click", (event) => {
  if (event.target === elements.celebrationOverlay) {
    hideCelebration();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !elements.celebrationOverlay.classList.contains("hidden")) {
    hideCelebration();
  }
});

window.addEventListener("beforeunload", syncDatabaseBeforeUnload);
window.addEventListener("popstate", route);
if ("speechSynthesis" in window) {
  window.speechSynthesis.getVoices();
}
route();


