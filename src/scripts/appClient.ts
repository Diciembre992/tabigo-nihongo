import { VOCAB_ITEMS } from '../data/japaneseData';

export interface ItemMasteryStat {
  id: string;
  type: 'vword' | 'vocab' | 'kana' | 'writing';
  label: string;
  hits: number;
  misses: number;
  level: 'nuevo' | 'fortalecer' | 'aprendiendo' | 'dominado';
  lastReviewed: string;
}

interface AppState {
  version: number;
  updatedAt: string;
  xp: number;
  streak: number;
  lastDate: string;
  stamps: string[];
  masteredVocab: string[];
  practicedChars: string[];
  quests: {
    voice: number;
    kanji: number;
    sim: number;
    voiceClaimed: boolean;
    kanjiClaimed: boolean;
    simClaimed: boolean;
  };
  itemStats: Record<string, ItemMasteryStat>;
}

const STORAGE_KEY = 'tabigo_progress_v2';

const DEFAULT_STATE: AppState = {
  version: 2,
  updatedAt: new Date().toISOString(),
  xp: 0,
  streak: 1,
  lastDate: new Date().toISOString().slice(0, 10),
  stamps: [],
  masteredVocab: [],
  practicedChars: [],
  quests: {
    voice: 0,
    kanji: 0,
    sim: 0,
    voiceClaimed: false,
    kanjiClaimed: false,
    simClaimed: false,
  },
  itemStats: {},
};

export function initTabiGoApp() {
  let state: AppState = loadLocalState();

  function normalizeState(rawObj: Partial<AppState>): AppState {
    const merged: AppState = {
      ...structuredClone(DEFAULT_STATE),
      ...rawObj,
      quests: {
        ...DEFAULT_STATE.quests,
        ...(rawObj.quests || {}),
      },
      itemStats: {
        ...(rawObj.itemStats || {}),
      },
      stamps: Array.isArray(rawObj.stamps) ? rawObj.stamps : [],
      masteredVocab: Array.isArray(rawObj.masteredVocab) ? rawObj.masteredVocab : [],
      practicedChars: Array.isArray(rawObj.practicedChars) ? rawObj.practicedChars : [],
    };

    const today = new Date().toISOString().slice(0, 10);
    if (merged.lastDate && merged.lastDate !== today) {
      merged.streak = (merged.streak || 1) + 1;
      merged.lastDate = today;
      merged.quests = {
        voice: 0,
        kanji: 0,
        sim: 0,
        voiceClaimed: false,
        kanjiClaimed: false,
        simClaimed: false,
      };
    }
    return merged;
  }

  function loadLocalState(): AppState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('tabigo_progress_v1');
      if (!raw) return structuredClone(DEFAULT_STATE);
      return normalizeState(JSON.parse(raw));
    } catch {
      return structuredClone(DEFAULT_STATE);
    }
  }

  async function syncFromServerJson() {
    try {
      const res = await fetch('/api/progress');
      if (!res.ok) return;
      const fileData = (await res.json()) as Partial<AppState>;
      const fileXp = fileData.xp || 0;
      const fileCount = Object.keys(fileData.itemStats || {}).length;
      const localCount = Object.keys(state.itemStats || {}).length;

      // Si el fichero JSON en /storage/user-progress.json tiene datos (o más progreso), cargarlo como fuente principal
      if (fileXp > 0 || fileCount > 0 || (state.xp === 0 && localCount === 0)) {
        state = normalizeState({
          ...state,
          ...fileData,
          itemStats: { ...state.itemStats, ...(fileData.itemStats || {}) },
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        renderGamificationUI();
      } else if (state.xp > 0 || localCount > 0) {
        // Persistir el estado local hacia el fichero /storage/user-progress.json
        saveState();
      }
    } catch {
      // Fallback silencioso a localStorage si es estático
    }
  }

  function saveState() {
    state.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors
    }

    // Guardar automáticamente en la carpeta genérica /storage/user-progress.json
    fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state, null, 2),
    })
      .then((res) => {
        if (res.ok) {
          const savedLabel = document.getElementById('json-last-saved');
          if (savedLabel) {
            const timeStr = new Date().toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });
            savedLabel.textContent = `Sincronizado en storage/user-progress.json (${timeStr})`;
          }
        }
      })
      .catch(() => {
        // Ignore network errors
      });

    renderGamificationUI();
  }

  function recordItemOutcome(
    id: string,
    type: 'vword' | 'vocab' | 'kana' | 'writing',
    label: string,
    outcome: 'dominado' | 'fortalecer' | 'hit' | 'miss'
  ) {
    const existing: ItemMasteryStat = state.itemStats[id] || {
      id,
      type,
      label,
      hits: 0,
      misses: 0,
      level: 'nuevo',
      lastReviewed: new Date().toISOString(),
    };

    existing.label = label || existing.label;
    existing.lastReviewed = new Date().toISOString();

    if (outcome === 'dominado') {
      existing.hits += 2;
      existing.level = 'dominado';
      if (!state.masteredVocab.includes(id)) {
        state.masteredVocab.push(id);
      }
    } else if (outcome === 'fortalecer') {
      existing.misses += 1;
      existing.level = 'fortalecer';
      state.masteredVocab = state.masteredVocab.filter((item) => item !== id);
    } else if (outcome === 'hit') {
      existing.hits += 1;
      if (existing.hits >= 2 && existing.hits > existing.misses) {
        existing.level = 'dominado';
        if (!state.masteredVocab.includes(id)) {
          state.masteredVocab.push(id);
        }
      } else {
        existing.level = 'aprendiendo';
      }
    } else if (outcome === 'miss') {
      existing.misses += 1;
      existing.level = 'fortalecer';
      state.masteredVocab = state.masteredVocab.filter((item) => item !== id);
    }

    state.itemStats[id] = existing;
    saveState();
  }

  function downloadProgressJson() {
    const jsonString = JSON.stringify(state, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateTag = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `tabigo-progreso-${dateTag}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Fichero JSON de progreso descargado', '⬇️');
  }

  function importProgressJsonFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (typeof parsed !== 'object' || parsed === null) {
          throw new Error('Formato JSON inválido');
        }
        state = normalizeState(parsed);
        saveState();
        showToast('¡Progreso JSON cargado y aplicado con éxito!', '⬆️');
      } catch {
        showToast('El fichero seleccionado no es un JSON de progreso válido', '⚠️');
      }
    };
    reader.readAsText(file);
  }

  function showToast(message: string, icon = '💮') {
    const container = document.getElementById('xp-toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'xp-toast';
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  function addXP(amount: number, reason: string) {
    const prevRank = getRankInfo(state.xp);
    state.xp += amount;
    const nextRank = getRankInfo(state.xp);
    showToast(`+${amount} XP · ${reason}`, '✨');
    if (nextRank.level > prevRank.level) {
      showToast(`¡Subiste a ${nextRank.title}!`, '🎉');
      playKotoChime(true);
    }
    saveState();
  }

  function unlockStamp(stampId: string, stampTitle: string) {
    if (!state.stamps.includes(stampId)) {
      state.stamps.push(stampId);
      showToast(`¡Nuevo Sello Goshuin: ${stampTitle}!`, '📕');
      playKotoChime(true);
      saveState();
    }
  }

  function incrementQuest(type: 'voice' | 'kanji' | 'sim') {
    if (type === 'voice') {
      state.quests.voice = Math.min(5, state.quests.voice + 1);
      unlockStamp('first-voice', 'Primera Voz (声)');
      if (state.quests.voice >= 5) {
        unlockStamp('mic-speaker', 'Voz de Viajero (話)');
      }
      if (state.quests.voice >= 5 && !state.quests.voiceClaimed) {
        state.quests.voiceClaimed = true;
        addXP(40, 'Misión diaria de voz completada');
      }
    } else if (type === 'kanji') {
      state.quests.kanji = Math.min(3, state.quests.kanji + 1);
      if (state.quests.kanji >= 3 && !state.quests.kanjiClaimed) {
        state.quests.kanjiClaimed = true;
        addXP(50, 'Misión diaria de caligrafía completada');
      }
    } else if (type === 'sim') {
      state.quests.sim = Math.min(2, state.quests.sim + 1);
      if (state.quests.sim >= 2 && !state.quests.simClaimed) {
        state.quests.simClaimed = true;
        addXP(70, 'Misión diaria de situación de viaje');
      }
    }
    saveState();
  }

  const RANK_TIERS = [
    { level: 1, min: 0, next: 100, title: '🌱 Nv. 1 · Turista Curioso' },
    { level: 2, min: 100, next: 250, title: '🍙 Nv. 2 · Explorador de Konbini' },
    { level: 3, min: 250, next: 450, title: '⛩️ Nv. 3 · Caminante de Kioto' },
    { level: 4, min: 450, next: 700, title: '🍜 Nv. 4 · Habitual del Izakaya' },
    { level: 5, min: 700, next: 1000, title: '🏮 Nv. 5 · Viajero de Asakusa' },
    { level: 6, min: 1000, next: 1400, title: '🚅 Nv. 6 · Viajero del Shinkansen' },
    { level: 7, min: 1400, next: 1900, title: '🌸 Nv. 7 · Conocedor del Hanami' },
    { level: 8, min: 1900, next: 2500, title: '♨️ Nv. 8 · Huésped del Ryokan' },
    { level: 9, min: 2500, next: 3200, title: '🖌️ Nv. 9 · Discípulo del Shodō' },
    { level: 10, min: 3200, next: 4000, title: '🗾 Nv. 10 · Guía de Japón' },
    { level: 11, min: 4000, next: 5000, title: '🗻 Nv. 11 · Sabio del Fuji' },
    { level: 12, min: 5000, next: 7500, title: '🏯 Nv. 12 · Leyenda de Nihon' },
  ];

  function getRankInfo(xp: number) {
    for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
      if (xp >= RANK_TIERS[i].min) {
        return {
          level: RANK_TIERS[i].level,
          title: RANK_TIERS[i].title,
          prev: RANK_TIERS[i].min,
          next: RANK_TIERS[i].next,
        };
      }
    }
    return { level: 1, title: RANK_TIERS[0].title, prev: 0, next: 100 };
  }

  function renderGamificationUI() {
    const streakEl = document.getElementById('streak-count');
    const xpEl = document.getElementById('xp-count');
    const rankEl = document.getElementById('traveler-rank');
    const modalRankTitleEl = document.getElementById('modal-rank-title');
    const modalXpDetailEl = document.getElementById('modal-xp-detail');
    const xpBarEl = document.getElementById('xp-bar');
    const stampCounterEl = document.getElementById('stamp-counter');
    const modalStampRatioEl = document.getElementById('modal-stamp-ratio');

    if (streakEl) streakEl.textContent = String(state.streak);
    if (xpEl) xpEl.textContent = String(state.xp);

    const rank = getRankInfo(state.xp);
    if (rankEl) rankEl.textContent = rank.title;
    if (modalRankTitleEl) modalRankTitleEl.textContent = rank.title;
    if (modalXpDetailEl) {
      const remaining = Math.max(0, rank.next - state.xp);
      modalXpDetailEl.textContent =
        rank.level < 12
          ? `${state.xp} / ${rank.next} XP (faltan ${remaining} XP)`
          : `${state.xp} XP · Rango Máximo`;
    }
    if (xpBarEl) {
      const pct = Math.min(100, Math.max(6, Math.round(((state.xp - rank.prev) / (rank.next - rank.prev)) * 100)));
      xpBarEl.style.width = `${pct}%`;
    }

    document.querySelectorAll<HTMLElement>('.rank-tier').forEach((tierEl) => {
      const minXp = parseInt(tierEl.dataset.rankMin || '0', 10);
      const isCurrent = minXp === rank.prev;
      const isReached = state.xp >= minXp;
      tierEl.classList.toggle('current', isCurrent);
      tierEl.classList.toggle('reached', isReached && !isCurrent);
    });

    // Quests UI
    const qVoice = document.getElementById('quest-voice');
    const qVoiceProg = document.getElementById('quest-voice-prog');
    if (qVoiceProg) qVoiceProg.textContent = String(state.quests.voice);
    if (qVoice) qVoice.setAttribute('data-completed', String(state.quests.voice >= 5));

    const qKanji = document.getElementById('quest-kanji');
    const qKanjiProg = document.getElementById('quest-kanji-prog');
    if (qKanjiProg) qKanjiProg.textContent = String(state.quests.kanji);
    if (qKanji) qKanji.setAttribute('data-completed', String(state.quests.kanji >= 3));

    const qSim = document.getElementById('quest-sim');
    const qSimProg = document.getElementById('quest-sim-prog');
    if (qSimProg) qSimProg.textContent = String(state.quests.sim);
    if (qSim) qSim.setAttribute('data-completed', String(state.quests.sim >= 2));

    // Stamps in modal and scenario cards
    document.querySelectorAll('.stamp-slot').forEach((slot) => {
      const id = slot.getAttribute('data-stamp-id');
      if (id && state.stamps.includes(id)) {
        slot.classList.add('unlocked');
      } else {
        slot.classList.remove('unlocked');
      }
    });

    document.querySelectorAll('[data-scen-stamp]').forEach((badge) => {
      const id = badge.getAttribute('data-scen-stamp');
      if (id && state.stamps.includes(id)) {
        badge.classList.add('stamped');
      } else {
        badge.classList.remove('stamped');
      }
    });

    // Mastered vocab cards & Mastery Badges on VocabDeck and VisualCommonWords
    document.querySelectorAll<HTMLElement>('.vocab-card').forEach((card) => {
      const id = card.getAttribute('data-vocab-id') || '';
      const stat = state.itemStats[id];
      const level = stat?.level || (state.masteredVocab.includes(id) ? 'dominado' : 'nuevo');

      card.classList.toggle('mastered', level === 'dominado');
      const badge = card.querySelector<HTMLElement>('.item-mastery-badge');
      if (badge) {
        badge.setAttribute('data-status', level);
        badge.textContent =
          level === 'dominado'
            ? '💮 Dominada'
            : level === 'fortalecer'
            ? '🎯 Por fortalecer'
            : level === 'aprendiendo'
            ? `🌱 Aprendiendo (${stat?.hits || 1} aciertos)`
            : '🌱 Nueva';
      }
    });

    document.querySelectorAll<HTMLElement>('.full-study-card').forEach((card) => {
      const id = card.getAttribute('data-vword-id') || '';
      const stat = state.itemStats[id];
      const level = stat?.level || (state.masteredVocab.includes(id) ? 'dominado' : 'nuevo');

      const badge = card.querySelector<HTMLElement>('.item-mastery-badge');
      if (badge) {
        badge.setAttribute('data-status', level);
        badge.textContent =
          level === 'dominado'
            ? '💮 Dominada'
            : level === 'fortalecer'
            ? '🎯 Por fortalecer'
            : level === 'aprendiendo'
            ? `🌱 Aprendiendo (${stat?.hits || 1} aciertos)`
            : '🌱 Nueva';
      }
    });

    // Global & Per-Deck Adaptive Mastery Counters from state.itemStats
    const statsList = Object.values(state.itemStats || {});
    const masteredItems = statsList.filter((s) => s.level === 'dominado');
    const learningItems = statsList.filter((s) => s.level === 'aprendiendo');
    const weakItems = statsList.filter((s) => s.level === 'fortalecer');

    // Update Modal & Hub Counters
    const modalMasteredEl = document.getElementById('modal-mastered-count');
    const modalLearningEl = document.getElementById('modal-learning-count');
    const modalWeakEl = document.getElementById('modal-weak-count');
    const hubMasteredEl = document.getElementById('hub-mastered-count');
    const hubLearningEl = document.getElementById('hub-learning-count');
    const hubWeakEl = document.getElementById('hub-weak-count');

    if (modalMasteredEl) modalMasteredEl.textContent = String(masteredItems.length);
    if (modalLearningEl) modalLearningEl.textContent = String(learningItems.length);
    if (modalWeakEl) modalWeakEl.textContent = String(weakItems.length);
    if (hubMasteredEl) hubMasteredEl.textContent = String(masteredItems.length);
    if (hubLearningEl) hubLearningEl.textContent = String(learningItems.length);
    if (hubWeakEl) hubWeakEl.textContent = String(weakItems.length);

    // Filter pill counts in VisualCommonWords & VocabDeck
    const vwordWeakCount = statsList.filter((s) => s.type === 'vword' && s.level === 'fortalecer').length;
    const vwordMasteredCount = statsList.filter((s) => s.type === 'vword' && s.level === 'dominado').length;
    const vocabWeakCount = statsList.filter((s) => s.type === 'vocab' && s.level === 'fortalecer').length;
    const vocabMasteredCount = statsList.filter((s) => s.type === 'vocab' && s.level === 'dominado').length;

    const vwWeakEl = document.getElementById('vword-weak-filter-count');
    const vwMastEl = document.getElementById('vword-mastered-filter-count');
    const vcWeakEl = document.getElementById('vocab-weak-filter-count');
    const vcMastEl = document.getElementById('vocab-mastered-filter-count');

    if (vwWeakEl) vwWeakEl.textContent = String(vwordWeakCount);
    if (vwMastEl) vwMastEl.textContent = String(vwordMasteredCount);
    if (vcWeakEl) vcWeakEl.textContent = String(vocabWeakCount);
    if (vcMastEl) vcMastEl.textContent = String(vocabMasteredCount);

    // Render Weak Items Chips inside Goshuincho Modal
    const weakChipsList = document.getElementById('weak-chips-list');
    if (weakChipsList) {
      if (weakItems.length === 0) {
        weakChipsList.innerHTML =
          '<span class="empty-weak-msg">¡Genial! Ahora mismo no tienes elementos pendientes por fortalecer.</span>';
      } else {
        weakChipsList.innerHTML = '';
        weakItems.forEach((item) => {
          const chip = document.createElement('span');
          chip.className = 'weak-item-chip';
          chip.textContent = `🎯 ${item.label} (fallos: ${item.misses})`;
          weakChipsList.appendChild(chip);
        });
      }
    }

    // Update Grammar Levels Progress (Intro, Nivel 1, Nivel 2, Nivel 3) & Step Progress in Hub
    const levelTargets: Record<string, number> = {
      intro: 4,
      'nivel-1': 5,
      'nivel-2': 5,
      'nivel-3': 5,
    };
    const levelCounts: Record<string, number> = {
      intro: 0,
      'nivel-1': 0,
      'nivel-2': 0,
      'nivel-3': 0,
    };

    statsList.forEach((st) => {
      if (st.level === 'dominado' && st.id.startsWith('grammar:')) {
        const parts = st.id.split(':');
        const lvlKey = parts[1];
        if (lvlKey && lvlKey in levelCounts) {
          levelCounts[lvlKey]++;
        }
      }
    });

    Object.keys(levelTargets).forEach((lvlKey) => {
      const target = levelTargets[lvlKey];
      const count = levelCounts[lvlKey] || 0;
      const pct = Math.min(100, Math.round((count / target) * 100));

      document.querySelectorAll<HTMLElement>(`[data-glevel-count="${lvlKey}"]`).forEach((el) => {
        el.textContent = `${count}/${target} 💮`;
      });
      document.querySelectorAll<HTMLElement>(`[data-glevel-bar="${lvlKey}"]`).forEach((el) => {
        el.style.width = `${pct}%`;
      });
      document.querySelectorAll<HTMLElement>(`[data-hub-glevel-count="${lvlKey}"]`).forEach((el) => {
        el.textContent = `${count}/${target}`;
      });
    });

    const totalGrammarMastered =
      levelCounts.intro + levelCounts['nivel-1'] + levelCounts['nivel-2'] + levelCounts['nivel-3'];

    // Update VisualCommonWords (1B) Level Progress Bars (20 words per level, 80 total)
    const vwordLevelCounts: Record<string, number> = {
      intro: 0,
      'nivel-1': 0,
      'nivel-2': 0,
      'nivel-3': 0,
    };
    document.querySelectorAll<HTMLElement>('.full-study-card').forEach((card) => {
      const id = card.dataset.vwordId || '';
      const lvl = card.dataset.vwordLevel || 'intro';
      const isDom = state.itemStats[id]?.level === 'dominado' || state.masteredVocab.includes(id);
      if (isDom && lvl in vwordLevelCounts) {
        vwordLevelCounts[lvl]++;
      }
    });
    const totalVwordDom =
      vwordLevelCounts.intro + vwordLevelCounts['nivel-1'] + vwordLevelCounts['nivel-2'] + vwordLevelCounts['nivel-3'];
    (['intro', 'nivel-1', 'nivel-2', 'nivel-3'] as const).forEach((lvlKey) => {
      const c = vwordLevelCounts[lvlKey] || 0;
      const pct = Math.min(100, Math.round((c / 20) * 100));
      document.querySelectorAll<HTMLElement>(`[data-vword-lvl-count="${lvlKey}"]`).forEach((el) => {
        el.textContent = `${c}/20 💮`;
      });
      document.querySelectorAll<HTMLElement>(`[data-vword-lvl-bar="${lvlKey}"]`).forEach((el) => {
        el.style.width = `${pct}%`;
      });
    });
    document.querySelectorAll<HTMLElement>('[data-vword-lvl-count="all"]').forEach((el) => {
      el.textContent = `${totalVwordDom}/80 💮`;
    });
    document.querySelectorAll<HTMLElement>('[data-vword-lvl-bar="all"]').forEach((el) => {
      el.style.width = `${Math.min(100, Math.round((totalVwordDom / 80) * 100))}%`;
    });

    // Update VocabDeck (1C) Level Progress Bars (7 expressions per level, 28 total)
    const vocabLevelCounts: Record<string, number> = {
      intro: 0,
      'nivel-1': 0,
      'nivel-2': 0,
      'nivel-3': 0,
    };
    document.querySelectorAll<HTMLElement>('.vocab-full-card').forEach((card) => {
      const id = card.dataset.vocabId || '';
      const lvl = card.dataset.vocabLevel || 'intro';
      const isDom = state.itemStats[id]?.level === 'dominado' || state.masteredVocab.includes(id);
      if (isDom && lvl in vocabLevelCounts) {
        vocabLevelCounts[lvl]++;
      }
    });
    const totalVocabDom =
      vocabLevelCounts.intro + vocabLevelCounts['nivel-1'] + vocabLevelCounts['nivel-2'] + vocabLevelCounts['nivel-3'];
    (['intro', 'nivel-1', 'nivel-2', 'nivel-3'] as const).forEach((lvlKey) => {
      const c = vocabLevelCounts[lvlKey] || 0;
      const pct = Math.min(100, Math.round((c / 7) * 100));
      document.querySelectorAll<HTMLElement>(`[data-vocab-lvl-count="${lvlKey}"]`).forEach((el) => {
        el.textContent = `${c}/7 💮`;
      });
      document.querySelectorAll<HTMLElement>(`[data-vocab-lvl-bar="${lvlKey}"]`).forEach((el) => {
        el.style.width = `${pct}%`;
      });
    });
    document.querySelectorAll<HTMLElement>('[data-vocab-lvl-count="all"]').forEach((el) => {
      el.textContent = `${totalVocabDom}/28 💮`;
    });
    document.querySelectorAll<HTMLElement>('[data-vocab-lvl-bar="all"]').forEach((el) => {
      el.style.width = `${Math.min(100, Math.round((totalVocabDom / 28) * 100))}%`;
    });

    let highestGrammarLabel = 'Nivel 0 · Intro';
    if (levelCounts['nivel-3'] >= 2 || vwordLevelCounts['nivel-3'] >= 3 || vocabLevelCounts['nivel-3'] >= 3) {
      highestGrammarLabel = 'Nivel 3 · Avanzado';
    } else if (levelCounts['nivel-2'] >= 2 || vwordLevelCounts['nivel-2'] >= 3 || vocabLevelCounts['nivel-2'] >= 3) {
      highestGrammarLabel = 'Nivel 2 · Intermedio';
    } else if (levelCounts['nivel-1'] >= 1 || vwordLevelCounts['nivel-1'] >= 2 || vocabLevelCounts['nivel-1'] >= 2) {
      highestGrammarLabel = 'Nivel 1 · Básico';
    }

    const totalGrammarBadge = document.getElementById('grammar-total-progress-badge');
    if (totalGrammarBadge) {
      totalGrammarBadge.textContent = `${highestGrammarLabel} · ${totalGrammarMastered} oraciones dominadas`;
    }
    const hubStep1Badge = document.getElementById('hub-step1-level-badge');
    if (hubStep1Badge) {
      const step1Total = totalGrammarMastered + totalVwordDom + totalVocabDom;
      hubStep1Badge.textContent = `${highestGrammarLabel} (${step1Total} 💮)`;
    }

    // Step 2 (Kana & Calligraphy) Progress on Hub
    const kanaMasteredCount = statsList.filter((s) => s.type === 'kana' && s.level === 'dominado').length;
    const kanaHitItems = statsList.filter((s) => s.type === 'kana' && s.hits >= 1).length;
    const kanjiCount = state.practicedChars.length;
    const step2Total = kanaMasteredCount + kanjiCount;
    const hubStep2Badge = document.getElementById('hub-step2-level-badge');
    const hubStep2Bar = document.getElementById('hub-step2-bar');
    if (hubStep2Badge) {
      const s2Lvl =
        step2Total >= 12
          ? 'Nivel 3 · Maestro de Trazos'
          : step2Total >= 6
          ? 'Nivel 2 · Lectura Activa'
          : step2Total >= 2
          ? 'Nivel 1 · Básico'
          : 'Nivel 0 · Intro';
      hubStep2Badge.textContent = `${s2Lvl} (${step2Total} 💮)`;
    }
    if (hubStep2Bar) {
      hubStep2Bar.style.width = `${Math.min(100, Math.max(8, step2Total * 6))}%`;
    }

    // Desbloqueo automático de sellos Goshuin por hitos de nivel y retos
    const autoMilestones: { id: string; title: string; unlocked: boolean }[] = [
      { id: 'grammar-intro', title: 'Base Gramatical (礎)', unlocked: levelCounts.intro >= 4 },
      { id: 'grammar-n1', title: 'Arquitecto Nv. 1 (文)', unlocked: levelCounts['nivel-1'] >= 5 },
      { id: 'grammar-n2', title: 'Conector Nv. 2 (橋)', unlocked: levelCounts['nivel-2'] >= 5 },
      { id: 'grammar-n3', title: 'Sintaxis Nv. 3 (極)', unlocked: levelCounts['nivel-3'] >= 5 },
      { id: 'vwords-intro', title: 'Visual Intro (絵)', unlocked: vwordLevelCounts.intro >= 10 },
      { id: 'vwords-n1', title: 'Visual Nivel 1 (買)', unlocked: vwordLevelCounts['nivel-1'] >= 10 },
      { id: 'vwords-n2', title: 'Visual Nivel 2 (街)', unlocked: vwordLevelCounts['nivel-2'] >= 10 },
      { id: 'vwords-n3', title: 'Visual Nivel 3 (博)', unlocked: vwordLevelCounts['nivel-3'] >= 10 },
      { id: 'vwords-master', title: 'Coleccionista Visual (百)', unlocked: totalVwordDom >= 50 },
      { id: 'vocab-starter', title: 'Oído Melódico (唄)', unlocked: totalVocabDom >= 7 },
      { id: 'vocab-master', title: 'Maestro Expresivo (響)', unlocked: totalVocabDom >= 20 },
      { id: 'kana-ear-5', title: 'Oído Kana (耳)', unlocked: kanaHitItems >= 5 },
      { id: 'kana-ear-15', title: 'Radar Fonético (聴)', unlocked: kanaHitItems >= 15 || kanaMasteredCount >= 10 },
      { id: 'calligrapher', title: 'Pincel Zen (書)', unlocked: kanjiCount >= 3 },
      { id: 'kanji-street', title: 'Carteles de Calle (道)', unlocked: kanjiCount >= 8 },
      { id: 'shodo-master', title: 'Maestro Shodō (墨)', unlocked: kanjiCount >= 16 },
    ];

    let newAutoStampUnlocked = false;
    autoMilestones.forEach((m) => {
      if (m.unlocked && !state.stamps.includes(m.id)) {
        state.stamps.push(m.id);
        showToast(`¡Nuevo Sello Goshuin: ${m.title}!`, '📕');
        newAutoStampUnlocked = true;
      }
    });
    if (newAutoStampUnlocked) {
      playKotoChime(true);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Ignore
      }
    }

    if (stampCounterEl) {
      stampCounterEl.textContent = `${state.stamps.length}/24`;
    }
    if (modalStampRatioEl) {
      modalStampRatioEl.textContent = `${state.stamps.length}/24`;
    }
    document.querySelectorAll('.stamp-slot').forEach((slot) => {
      const id = slot.getAttribute('data-stamp-id');
      slot.classList.toggle('unlocked', Boolean(id && state.stamps.includes(id)));
    });

    // Step 3 (Travel Simulator & Yamanote) Progress on Hub (4 leveled scenarios)
    const scenStamps = ['konbini', 'ramen-izakaya', 'shinkansen-station', 'ryokan-checkin'].filter((id) =>
      state.stamps.includes(id)
    ).length;
    const hubStep3Badge = document.getElementById('hub-step3-level-badge');
    if (hubStep3Badge) {
      const s3Lvl =
        scenStamps >= 4
          ? 'Nivel 3 · Viajero Experto'
          : scenStamps >= 2
          ? 'Nivel 2 · Intermedio'
          : scenStamps >= 1
          ? 'Nivel 1 · Básico'
          : 'Nivel 0 · Intro';
      hubStep3Badge.textContent = `旅 · ${s3Lvl} · ${scenStamps}/4 Escenarios`;
    }
  }

  // Soft Japanese Koto / Chime synthesizer via Web Audio API for tactile feedback
  function playKotoChime(isCelebration = false) {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = isCelebration ? [523.25, 587.33, 698.46, 783.99, 1046.5] : [587.33, 880];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.09);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.09 + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.09);
        osc.stop(ctx.currentTime + i * 0.09 + 0.46);
      });
    } catch {
      // Ignore audio context restrictions
    }
  }

  // JAPANESE CLOUD TTS + FALLBACK AUDIO ENGINE
  let currentAudio: HTMLAudioElement | null = null;
  let jpVoice: SpeechSynthesisVoice | null = null;

  function loadVoices() {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    jpVoice =
      voices.find((v) => v.lang === 'ja-JP' && v.name.includes('Google')) ||
      voices.find((v) => v.lang.startsWith('ja')) ||
      null;
  }

  if ('speechSynthesis' in window) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  function playViaUrl(url: string, playbackRate = 1.0): Promise<void> {
    return new Promise((resolve, reject) => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }
      const audio = new Audio();
      audio.referrerPolicy = 'no-referrer';
      audio.src = url;
      audio.playbackRate = playbackRate;
      currentAudio = audio;

      audio.onended = () => resolve();
      audio.onerror = (err) => reject(err);

      audio.play().catch(reject);
    });
  }

  async function speakJapanese(text: string, rate = 0.95): Promise<void> {
    const cleanText = text.trim();
    if (!cleanText) return;

    incrementQuest('voice');
    const isSlow = rate < 0.75;

    // 1. Primary: Local Astro TTS Proxy API (/api/tts -> Google Translate Japanese Neural Voice)
    const localApiUrl = `/api/tts?q=${encodeURIComponent(cleanText)}&slow=${isSlow ? '1' : '0'}`;
    try {
      await playViaUrl(localApiUrl, isSlow ? 0.85 : 1.0);
      return;
    } catch {
      // Continue to fallback 2
    }

    // 2. Fallback: Direct Google Translate TTS with no-referrer
    const directGoogleUrl = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=ja&ttsspeed=${
      isSlow ? '0.24' : '1'
    }&q=${encodeURIComponent(cleanText)}`;
    try {
      await playViaUrl(directGoogleUrl, isSlow ? 0.85 : 1.0);
      return;
    } catch {
      // Continue to fallback 3
    }

    // 3. Fallback: Youdao Japanese Dictionary Voice API
    const youdaoUrl = `https://dict.youdao.com/dictvoice?le=jap&audio=${encodeURIComponent(cleanText)}`;
    try {
      await playViaUrl(youdaoUrl, isSlow ? 0.7 : 1.0);
      return;
    } catch {
      // Continue to fallback 4
    }

    // 4. Fallback: Browser SpeechSynthesis (only if a Japanese voice exists)
    if ('speechSynthesis' in window && jpVoice) {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(cleanText);
        utter.lang = 'ja-JP';
        utter.voice = jpVoice;
        utter.rate = rate;
        window.speechSynthesis.speak(utter);
        return;
      } catch {
        // Ignore
      }
    }

    playKotoChime(false);
    showToast(`Pronunciación: ${cleanText}`, '🔊');
  }

  // JAPANESE PRONUNCIATION PRACTICE (MICROPHONE RECORDER + NATIVE COMPARISON + SPEECH RECOGNITION)
  let lastRecordedBlobUrl: string | null = null;

  async function evaluatePronunciation(
    targetJp: string,
    targetRomaji: string,
    onResult: (msg: string, success: boolean) => void
  ) {
    // Try recording actual user microphone via MediaDevices (works across Linux Chrome, Firefox, Brave)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const chunks: BlobPart[] = [];

        // Optional SpeechRecognition in parallel if supported
        let recognizedTranscript = '';
        const SpeechRec =
          (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
            .SpeechRecognition ||
          (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let recognition: any = null;
        if (SpeechRec) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recognition = new (SpeechRec as any)();
            recognition.lang = 'ja-JP';
            recognition.interimResults = false;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recognition.onresult = (event: any) => {
              recognizedTranscript = event.results?.[0]?.[0]?.transcript || '';
            };
            recognition.start();
          } catch {
            // Ignore if SpeechRecognition fails on Linux
          }
        }

        onResult(`🔴 Grabando tu voz (3 seg)... Pronuncia: "${targetRomaji}"`, true);

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          stream.getTracks().forEach((track) => track.stop());
          if (recognition) {
            try {
              recognition.stop();
            } catch {
              // Ignore
            }
          }

          const blob = new Blob(chunks, { type: 'audio/webm' });
          if (lastRecordedBlobUrl) URL.revokeObjectURL(lastRecordedBlobUrl);
          lastRecordedBlobUrl = URL.createObjectURL(blob);

          unlockStamp('mic-speaker', 'Voz de Viajero (話)');
          addXP(20, `Práctica con micrófono: ${targetRomaji}`);

          if (recognizedTranscript) {
            onResult(
              `💮 ¡Voz detectada ("${recognizedTranscript}")! Escucha tu grabación seguida del audio nativo... (+20 XP)`,
              true
            );
          } else {
            onResult(
              `🎧 ¡Grabación lista! Escucha primero tu voz y compárala al instante con el hablante nativo (+20 XP)`,
              true
            );
          }

          // Play user's recorded voice first, then native Japanese TTS right after!
          try {
            await playViaUrl(lastRecordedBlobUrl, 1.0);
            setTimeout(() => {
              speakJapanese(targetJp, 0.92);
            }, 350);
          } catch {
            speakJapanese(targetJp, 0.92);
          }
        };

        mediaRecorder.start();
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, 2800);
        return;
      } catch {
        // Microphone permission denied or no mic connected -> fallback to guided audio
      }
    }

    // Fallback if no microphone is available or permission was declined
    await speakJapanese(targetJp, 0.85);
    unlockStamp('mic-speaker', 'Voz de Viajero (話)');
    addXP(15, `Práctica de pronunciación: ${targetRomaji}`);
    onResult(
      `🔊 Escucha el audio nativo y repite en voz alta: "${targetRomaji}" (+15 XP)`,
      true
    );
  }

  // 0. MODO OSCURO / CLARO (persistente, respeta la preferencia del sistema)
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeToggleIcon = document.getElementById('theme-toggle-icon');

  function applyTheme(theme: 'light' | 'dark') {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('tabigo-theme', theme);
    } catch {
      // Ignorar si el almacenamiento no está disponible
    }
    document.getElementById('meta-theme-color')?.setAttribute('content', theme === 'dark' ? '#14110F' : '#FBF9F5');
    if (themeToggleIcon) themeToggleIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    themeToggleBtn?.setAttribute('aria-pressed', String(theme === 'dark'));
  }

  applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

  themeToggleBtn?.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    showToast(next === 'dark' ? 'Modo oscuro activado' : 'Modo claro activado', next === 'dark' ? '🌙' : '☀️');
  });

  // 1. MODAL GOSHUINCHO Y GESTIÓN DE FICHERO JSON (DESCARGAR / SUBIR)
  const openPassportBtn = document.getElementById('open-passport-btn');
  const closePassportBtn = document.getElementById('close-passport-btn');
  const passportModal = document.getElementById('passport-modal');
  const resetBtn = document.getElementById('reset-progress-btn');
  const downloadJsonBtn = document.getElementById('download-json-btn');
  const hubDownloadJsonBtn = document.getElementById('hub-download-json-btn');
  const uploadJsonBtn = document.getElementById('upload-json-btn');
  const hubUploadJsonBtn = document.getElementById('hub-upload-json-btn');
  const uploadJsonInput = document.getElementById('upload-json-input') as HTMLInputElement | null;

  openPassportBtn?.addEventListener('click', () => {
    passportModal?.setAttribute('aria-hidden', 'false');
  });

  closePassportBtn?.addEventListener('click', () => {
    passportModal?.setAttribute('aria-hidden', 'true');
  });

  passportModal?.addEventListener('click', (e) => {
    if (e.target === passportModal) {
      passportModal.setAttribute('aria-hidden', 'true');
    }
  });

  downloadJsonBtn?.addEventListener('click', downloadProgressJson);
  hubDownloadJsonBtn?.addEventListener('click', downloadProgressJson);

  uploadJsonBtn?.addEventListener('click', () => uploadJsonInput?.click());
  hubUploadJsonBtn?.addEventListener('click', () => uploadJsonInput?.click());

  uploadJsonInput?.addEventListener('change', () => {
    const file = uploadJsonInput.files?.[0];
    if (file) {
      importProgressJsonFile(file);
      uploadJsonInput.value = '';
    }
  });

  resetBtn?.addEventListener('click', () => {
    state = structuredClone(DEFAULT_STATE);
    saveState();
    showToast('Progreso JSON reiniciado', '🔄');
  });

  document.querySelectorAll<HTMLButtonElement>('[data-stamp-filter]').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('[data-stamp-filter]').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const cat = chip.dataset.stampFilter || 'all';
      document.querySelectorAll<HTMLElement>('.stamp-slot').forEach((slot) => {
        slot.hidden = cat !== 'all' && slot.dataset.stampCat !== cat;
      });
    });
  });

  // 2. CONSTRUCTOR GRAMATICAL POR NIVELES (INTRO, NIVEL 1, NIVEL 2, NIVEL 3) Y RETO DE ORDENACIÓN
  const grammarLevelsRaw = document.getElementById('grammar-levels-data')?.textContent;
  const grammarLevels = grammarLevelsRaw ? JSON.parse(grammarLevelsRaw) : [];

  type GrammarLevelId = 'intro' | 'nivel-1' | 'nivel-2' | 'nivel-3';
  let activeGrammarLevel: GrammarLevelId = 'intro';
  let activeGrammarMode: 'build' | 'scramble' = 'build';
  const activeTemplatePerLevel: Record<string, string> = {
    'nivel-1': 'n1-cantidades',
    'nivel-2': 'n2-movimiento',
    'nivel-3': 'n3-causa-peticion',
  };

  let selectedPatternBtn = document.querySelector<HTMLButtonElement>('.pattern-btn.active');
  let selectedWordChip = document.querySelector<HTMLButtonElement>('.word-chip.active');

  let currentConstructedSentence = {
    id: 'grammar:intro:doko-toire',
    jp: 'トイレはどこですか？',
    phonetic: 'Tói-re ua dó-ko des-ká',
    es: '¿Dónde está el baño / aseo?',
  };

  function updateSentenceMasteryBadge() {
    const statusBadge = document.getElementById('builder-sentence-status');
    if (!statusBadge) return;
    const stat = state.itemStats[currentConstructedSentence.id];
    const level = stat?.level || 'nuevo';
    statusBadge.setAttribute('data-status', level);
    statusBadge.textContent =
      level === 'dominado'
        ? '💮 Oración dominada'
        : level === 'fortalecer'
        ? '🎯 Por fortalecer'
        : level === 'aprendiendo'
        ? '🌱 En práctica'
        : '🌱 Nueva oración';
  }

  function composeNaturalEsMeaning(tplId: string, s1Es: string, s2Es: string, s3Es: string): string {
    if (tplId === 'n1-cantidades') {
      return `${s3Es.charAt(0).toUpperCase() + s3Es.slice(1)}: ${s2Es} de ${s1Es.toLowerCase()}`;
    }
    if (tplId === 'n1-adjetivos') {
      if (s3Es.includes('Pregunta')) return `¿${s1Es} es/está ${s2Es}?`;
      if (s3Es.includes('Empatía')) return `¡${s1Es} es/está ${s2Es}, ¿verdad?!`;
      return `${s1Es} es/está ${s2Es}.`;
    }
    if (tplId === 'n1-posesion-no') {
      return `¿${s3Es.replace(/[¿?]/g, '')} ${s2Es} ${s1Es.toLowerCase()}?`;
    }
    if (tplId === 'n2-movimiento') {
      return `${s3Es.charAt(0).toUpperCase() + s3Es.slice(1)} ${s2Es} ${s1Es.toLowerCase()}.`;
    }
    if (tplId === 'n2-acciones-lugar') {
      if (s3Es.includes('¿')) return `¿${s3Es.replace(/[¿?]/g, '')} ${s2Es} ${s1Es.toLowerCase()}?`;
      return `${s3Es.charAt(0).toUpperCase() + s3Es.slice(1)} ${s2Es} ${s1Es.toLowerCase()}.`;
    }
    if (tplId === 'n3-causa-peticion') {
      return `${s1Es} ${s3Es} ${s2Es}.`;
    }
    if (tplId === 'n3-permiso-contraste') {
      return `${s1Es} ${s3Es.replace('?', '')} ${s2Es}?`;
    }
    return `${s1Es} · ${s2Es} · ${s3Es}`;
  }

  function updateBuilderDisplay() {
    const resLevelTag = document.getElementById('res-level-tag');
    const resMeaning = document.getElementById('res-es-meaning');
    const resKana = document.getElementById('res-kana');
    const resWord = document.getElementById('res-jp-word');
    const resMiddle = document.getElementById('res-jp-middle');
    const resSuffix = document.getElementById('res-jp-suffix');
    const resPhonetic = document.getElementById('res-phonetic');
    const resExplanation = document.getElementById('res-explanation');
    const resAnatomyPills = document.getElementById('res-anatomy-pills');

    if (activeGrammarLevel === 'intro') {
      if (!selectedPatternBtn || !selectedWordChip) return;

      const wordId = selectedWordChip.dataset.wordId || 'word';
      const wordJp = selectedWordChip.dataset.jp || '';
      const wordKana = selectedWordChip.dataset.kana || '';
      const wordPhonetic = selectedWordChip.dataset.phonetic || '';
      const wordEs = selectedWordChip.dataset.es || '';

      const patId = selectedPatternBtn.dataset.patternId || 'pat';
      const suffixJp = selectedPatternBtn.dataset.suffixJp || '';
      const suffixKana = selectedPatternBtn.dataset.suffixKana || '';
      const suffixPhonetic = selectedPatternBtn.dataset.suffixPhonetic || '';
      const labelEs = selectedPatternBtn.dataset.labelEs || '';
      const explanation = selectedPatternBtn.dataset.explanation || '';

      const fullMeaning = labelEs.replace('[...]', wordEs.toLowerCase());
      const fullJp = `${wordJp}${suffixJp}`;
      const fullPhonetic = `${wordPhonetic} ${suffixPhonetic}`;

      currentConstructedSentence = {
        id: `grammar:intro:${patId}-${wordId}`,
        jp: fullJp,
        phonetic: fullPhonetic,
        es: fullMeaning,
      };

      if (resLevelTag) resLevelTag.textContent = '✨ Nivel 0 · Introductorio (2 Bloques)';
      if (resMeaning) resMeaning.textContent = fullMeaning;
      if (resKana) resKana.textContent = `${wordKana} ${suffixKana}`;
      if (resWord) resWord.textContent = wordJp;
      if (resMiddle) {
        resMiddle.hidden = true;
        resMiddle.textContent = '';
      }
      if (resSuffix) resSuffix.textContent = suffixJp;

      if (resAnatomyPills) {
        resAnatomyPills.innerHTML = `
          <div class="anat-item anat-1">
            <small>1. Sustantivo / Tema</small>
            <strong>${wordJp} (${wordEs})</strong>
          </div>
          <div class="anat-item anat-3">
            <small>2. Partícula + Cierre</small>
            <strong>${suffixJp}</strong>
          </div>
        `;
      }

      if (resPhonetic) {
        resPhonetic.innerHTML = `
          <span class="phonetic-word-part">${wordPhonetic}</span>
          <span class="phonetic-Connector">+</span>
          <span class="phonetic-suffix-part">${suffixPhonetic}</span>
        `;
      }
      if (resExplanation) {
        resExplanation.textContent = `💡 ${explanation}`;
      }

      // Highlight compatible words in Intro
      const allowed = (selectedPatternBtn.dataset.allowed || '').split(',');
      document.querySelectorAll<HTMLButtonElement>('.word-chip').forEach((chip) => {
        const cat = chip.dataset.category || '';
        chip.classList.toggle('dimmed', !allowed.includes(cat));
      });
    } else {
      // NIVEL 1, NIVEL 2, NIVEL 3 (3 Bloques Sintácticos)
      const tplId = activeTemplatePerLevel[activeGrammarLevel];
      const container = document.querySelector<HTMLElement>(
        `.template-slots-container[data-tpl-container="${tplId}"]`
      );
      if (!container) return;

      const s1Btn = container.querySelector<HTMLButtonElement>('.g-slot-btn[data-slot-num="1"].active');
      const s2Btn = container.querySelector<HTMLButtonElement>('.g-slot-btn[data-slot-num="2"].active');
      const s3Btn = container.querySelector<HTMLButtonElement>('.g-slot-btn[data-slot-num="3"].active');
      if (!s1Btn || !s2Btn || !s3Btn) return;

      const s1Jp = s1Btn.dataset.jp || '';
      const s2Jp = s2Btn.dataset.jp || '';
      const s3Jp = s3Btn.dataset.jp || '';

      const s1Kana = s1Btn.dataset.kana || '';
      const s2Kana = s2Btn.dataset.kana || '';
      const s3Kana = s3Btn.dataset.kana || '';

      const s1Phon = s1Btn.dataset.phonetic || '';
      const s2Phon = s2Btn.dataset.phonetic || '';
      const s3Phon = s3Btn.dataset.phonetic || '';

      const s1Es = s1Btn.dataset.es || '';
      const s2Es = s2Btn.dataset.es || '';
      const s3Es = s3Btn.dataset.es || '';

      const s1Part = s1Btn.dataset.particle || 'Bloque 1';
      const s2Part = s2Btn.dataset.particle || 'Bloque 2';
      const s3Part = s3Btn.dataset.particle || 'Bloque 3';

      const s1Role = s1Btn.dataset.role || '';
      const s2Role = s2Btn.dataset.role || '';
      const s3Role = s3Btn.dataset.role || '';

      const fullJp = `${s1Jp}${s2Jp}${s3Jp}`;
      const fullPhonetic = `${s1Phon} ${s2Phon} ${s3Phon}`;
      const naturalEs = composeNaturalEsMeaning(tplId, s1Es, s2Es, s3Es);

      currentConstructedSentence = {
        id: `grammar:${activeGrammarLevel}:${s1Btn.dataset.optId}-${s2Btn.dataset.optId}-${s3Btn.dataset.optId}`,
        jp: fullJp,
        phonetic: fullPhonetic,
        es: naturalEs,
      };

      const lvlNum = activeGrammarLevel.replace('nivel-', 'Nivel ');
      if (resLevelTag) resLevelTag.textContent = `✨ ${lvlNum} · Oración de 3 Bloques`;
      if (resMeaning) resMeaning.textContent = naturalEs;
      if (resKana) resKana.textContent = `${s1Kana} · ${s2Kana} · ${s3Kana}`;
      if (resWord) resWord.textContent = s1Jp;
      if (resMiddle) {
        resMiddle.hidden = false;
        resMiddle.textContent = s2Jp;
      }
      if (resSuffix) resSuffix.textContent = s3Jp;

      if (resAnatomyPills) {
        resAnatomyPills.innerHTML = `
          <div class="anat-item anat-1">
            <small>1. ${s1Part}</small>
            <strong>${s1Jp} (${s1Es})</strong>
          </div>
          <div class="anat-item anat-2">
            <small>2. ${s2Part}</small>
            <strong>${s2Jp} (${s2Es})</strong>
          </div>
          <div class="anat-item anat-3">
            <small>3. ${s3Part}</small>
            <strong>${s3Jp} (${s3Es})</strong>
          </div>
        `;
      }

      if (resPhonetic) {
        resPhonetic.innerHTML = `
          <span class="phonetic-word-part">${s1Phon}</span>
          <span class="phonetic-Connector">+</span>
          <span class="phonetic-middle-part">${s2Phon}</span>
          <span class="phonetic-Connector">+</span>
          <span class="phonetic-suffix-part">${s3Phon}</span>
        `;
      }

      if (resExplanation) {
        resExplanation.textContent = `💡 Desglose: [1] ${s1Role} → [2] ${s2Role} → [3] ${s3Role}.`;
      }
    }

    updateSentenceMasteryBadge();
  }

  // Motor del Modo B: Reto de Ordenar Bloques Gramaticales (Scramble Challenge)
  let currentChallengeIndex = 0;
  let placedBlocks: { jp: string; romaji: string; esPhonetic: string; role: string; origIdx: number }[] = [];

  function renderScrambleChallenge() {
    const levelObj = grammarLevels.find((l: { id: string }) => l.id === activeGrammarLevel);
    if (!levelObj || !levelObj.challenges?.length) return;

    currentChallengeIndex =
      ((currentChallengeIndex % levelObj.challenges.length) + levelObj.challenges.length) %
      levelObj.challenges.length;
    const ch = levelObj.challenges[currentChallengeIndex];
    placedBlocks = [];

    const eyebrow = document.getElementById('sc-level-eyebrow');
    const promptEs = document.getElementById('sc-prompt-es');
    const hintText = document.getElementById('sc-hint-text');
    const progPill = document.getElementById('sc-progress-pill');
    const feedbackBanner = document.getElementById('sc-feedback-banner');

    if (eyebrow) eyebrow.textContent = `🧩 RETO DE ORDEN GRAMATICAL · ${levelObj.badge.toUpperCase()}`;
    if (promptEs) promptEs.textContent = `"${ch.promptEs}"`;
    if (hintText) hintText.textContent = `💡 Estructura: ${ch.hintGrammar}`;
    if (progPill) {
      progPill.textContent = `Oración ${currentChallengeIndex + 1} de ${levelObj.challenges.length}`;
    }
    if (feedbackBanner) feedbackBanner.hidden = true;

    const shuffled = ch.blocks
      .map((b: { jp: string; romaji: string; esPhonetic: string; role: string }, idx: number) => ({
        ...b,
        origIdx: idx,
      }))
      .sort(() => Math.random() - 0.5);

    function redrawTrayAndBank() {
      const tray = document.getElementById('sc-answer-tray');
      const bank = document.getElementById('sc-bank-grid');
      if (!tray || !bank) return;

      tray.innerHTML = '';
      if (placedBlocks.length === 0) {
        tray.innerHTML =
          '<span class="sc-empty-placeholder">Toca los bloques de abajo en el orden gramatical japonés correcto...</span>';
      } else {
        placedBlocks.forEach((b, pIdx) => {
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'sc-block-chip';
          chip.innerHTML = `<span class="sc-b-jp">${b.jp}</span><span class="sc-b-sub">"${b.esPhonetic}" · ${b.role}</span>`;
          chip.addEventListener('click', () => {
            placedBlocks.splice(pIdx, 1);
            redrawTrayAndBank();
          });
          tray.appendChild(chip);
        });
      }

      bank.innerHTML = '';
      shuffled.forEach((b: { jp: string; romaji: string; esPhonetic: string; role: string; origIdx: number }) => {
        const alreadyPlaced = placedBlocks.some((pb) => pb.origIdx === b.origIdx);
        if (alreadyPlaced) return;

        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'sc-block-chip';
        chip.innerHTML = `<span class="sc-b-jp">${b.jp}</span><span class="sc-b-sub">"${b.esPhonetic}" · ${b.role}</span>`;
        chip.addEventListener('click', () => {
          speakJapanese(b.jp, 0.95);
          placedBlocks.push(b);
          redrawTrayAndBank();

          // Check if all blocks are placed
          if (placedBlocks.length === ch.blocks.length) {
            const userJp = placedBlocks.map((pb) => pb.jp).join('');
            const fbMsg = document.getElementById('sc-feedback-msg');
            if (feedbackBanner && fbMsg) {
              feedbackBanner.hidden = false;
              const sentenceKey = `grammar:${activeGrammarLevel}:${ch.id}`;
              if (userJp === ch.fullJp) {
                fbMsg.innerHTML = `💮 <strong>¡Orden gramatical perfecto!</strong> ${ch.fullJp} (<em>"${ch.fullPhonetic}"</em>) — ${ch.explanation}`;
                recordItemOutcome(sentenceKey, 'vocab', `[${levelObj.shortTitle}] ${ch.fullJp}`, 'dominado');
                addXP(20, `Reto gramatical superado (${levelObj.shortTitle})`);
                setTimeout(() => speakJapanese(ch.fullJp, 0.92), 250);
              } else {
                fbMsg.innerHTML = `🎯 <strong>Casi:</strong> en japonés el verbo va al final. El orden correcto es <strong>${ch.fullJp}</strong>. ¡Haz clic en un bloque de arriba para reordenarlo!`;
                recordItemOutcome(sentenceKey, 'vocab', `[${levelObj.shortTitle}] ${ch.fullJp}`, 'fortalecer');
              }
            }
          }
        });
        bank.appendChild(chip);
      });
    }

    redrawTrayAndBank();
  }

  function switchGrammarLevel(levelId: GrammarLevelId) {
    activeGrammarLevel = levelId;

    document.querySelectorAll<HTMLButtonElement>('[data-glevel-tab]').forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.glevelTab === levelId);
    });

    const levelObj = grammarLevels.find((l: { id: string }) => l.id === levelId);
    if (levelObj) {
      const badgeEl = document.getElementById('alb-badge');
      const titleEl = document.getElementById('alb-title');
      const subEl = document.getElementById('alb-subtitle');
      const chipsEl = document.getElementById('alb-focus-chips');

      if (badgeEl) badgeEl.textContent = levelObj.badge;
      if (titleEl) titleEl.textContent = levelObj.title;
      if (subEl) subEl.textContent = levelObj.subtitle;
      if (chipsEl && Array.isArray(levelObj.grammarFocus)) {
        chipsEl.innerHTML = levelObj.grammarFocus
          .map((gf: string) => `<span class="focus-chip">🔹 ${gf}</span>`)
          .join('');
      }
    }

    document.querySelectorAll<HTMLElement>('[data-level-pane]').forEach((pane) => {
      pane.hidden = pane.dataset.levelPane !== levelId;
    });

    currentChallengeIndex = 0;
    if (activeGrammarMode === 'scramble') {
      renderScrambleChallenge();
    } else {
      updateBuilderDisplay();
    }
  }

  document.querySelectorAll<HTMLButtonElement>('[data-glevel-tab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      const lvl = (tab.dataset.glevelTab || 'intro') as GrammarLevelId;
      switchGrammarLevel(lvl);
    });
  });

  // Switch between Build Mode and Scramble Challenge Mode
  const gmodeBuildBtn = document.getElementById('gmode-build-btn');
  const gmodeScrambleBtn = document.getElementById('gmode-scramble-btn');
  const buildWorkspace = document.getElementById('grammar-build-workspace');
  const scrambleWorkspace = document.getElementById('grammar-scramble-workspace');

  gmodeBuildBtn?.addEventListener('click', () => {
    activeGrammarMode = 'build';
    gmodeBuildBtn.classList.add('active');
    gmodeScrambleBtn?.classList.remove('active');
    if (buildWorkspace) buildWorkspace.hidden = false;
    if (scrambleWorkspace) scrambleWorkspace.hidden = true;
    updateBuilderDisplay();
  });

  gmodeScrambleBtn?.addEventListener('click', () => {
    activeGrammarMode = 'scramble';
    gmodeScrambleBtn.classList.add('active');
    gmodeBuildBtn?.classList.remove('active');
    if (buildWorkspace) buildWorkspace.hidden = true;
    if (scrambleWorkspace) scrambleWorkspace.hidden = false;
    renderScrambleChallenge();
  });

  document.getElementById('sc-listen-btn')?.addEventListener('click', () => {
    const levelObj = grammarLevels.find((l: { id: string }) => l.id === activeGrammarLevel);
    const ch = levelObj?.challenges?.[currentChallengeIndex];
    if (ch) speakJapanese(ch.fullJp, 0.92);
  });

  document.getElementById('sc-next-btn')?.addEventListener('click', () => {
    currentChallengeIndex++;
    renderScrambleChallenge();
  });

  // Template Selector inside Levels 1, 2, 3
  document.querySelectorAll<HTMLButtonElement>('.tpl-select-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lvlId = btn.dataset.levelId || 'nivel-1';
      const tplId = btn.dataset.tplId || '';
      activeTemplatePerLevel[lvlId] = tplId;

      document
        .querySelectorAll<HTMLButtonElement>(`.tpl-select-btn[data-level-id="${lvlId}"]`)
        .forEach((b) => b.classList.toggle('active', b === btn));

      document
        .querySelectorAll<HTMLElement>(`.template-slots-container[data-parent-level="${lvlId}"]`)
        .forEach((cont) => {
          cont.hidden = cont.dataset.tplContainer !== tplId;
        });

      updateBuilderDisplay();
    });
  });

  // 3-Block Slot Buttons inside Levels 1, 2, 3
  document.querySelectorAll<HTMLButtonElement>('.g-slot-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tplRef = btn.dataset.tplRef || '';
      const slotNum = btn.dataset.slotNum || '1';
      document
        .querySelectorAll<HTMLButtonElement>(
          `.g-slot-btn[data-tpl-ref="${tplRef}"][data-slot-num="${slotNum}"]`
        )
        .forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      updateBuilderDisplay();
      speakJapanese(currentConstructedSentence.jp, 0.95);
    });
  });

  // Intro Level Pattern & Word Chips
  document.querySelectorAll<HTMLButtonElement>('.pattern-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pattern-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPatternBtn = btn;

      const allowed = (btn.dataset.allowed || '').split(',');
      if (selectedWordChip && !allowed.includes(selectedWordChip.dataset.category || '')) {
        const firstGood = Array.from(document.querySelectorAll<HTMLButtonElement>('.word-chip')).find((c) =>
          allowed.includes(c.dataset.category || '')
        );
        if (firstGood) {
          document.querySelectorAll('.word-chip').forEach((c) => c.classList.remove('active'));
          firstGood.classList.add('active');
          selectedWordChip = firstGood;
        }
      }
      updateBuilderDisplay();
    });
  });

  document.querySelectorAll<HTMLButtonElement>('.word-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.word-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      selectedWordChip = chip;
      updateBuilderDisplay();
      speakJapanese(currentConstructedSentence.jp, 0.95);
    });
  });

  document.getElementById('builder-speak-normal')?.addEventListener('click', () => {
    speakJapanese(currentConstructedSentence.jp, 0.95);
  });

  document.getElementById('builder-speak-slow')?.addEventListener('click', () => {
    speakJapanese(currentConstructedSentence.jp, 0.58);
  });

  document.getElementById('builder-mic-btn')?.addEventListener('click', () => {
    const feedbackBox = document.getElementById('builder-mic-feedback');
    const feedbackText = document.getElementById('builder-mic-text');
    if (feedbackBox && feedbackText) {
      feedbackBox.hidden = false;
      evaluatePronunciation(currentConstructedSentence.jp, currentConstructedSentence.phonetic, (msg) => {
        feedbackText.textContent = msg;
      });
    }
  });

  document.getElementById('builder-mark-weak-btn')?.addEventListener('click', () => {
    recordItemOutcome(
      currentConstructedSentence.id,
      'vocab',
      `${currentConstructedSentence.jp} (${currentConstructedSentence.es})`,
      'fortalecer'
    );
    updateSentenceMasteryBadge();
    showToast(`Oración marcada para fortalecer en ${activeGrammarLevel}`, '🎯');
  });

  document.getElementById('builder-mark-mastered-btn')?.addEventListener('click', () => {
    recordItemOutcome(
      currentConstructedSentence.id,
      'vocab',
      `${currentConstructedSentence.jp} (${currentConstructedSentence.es})`,
      'dominado'
    );
    updateSentenceMasteryBadge();
    addXP(15, `Oración dominada (${activeGrammarLevel.toUpperCase()})`);
    speakJapanese(currentConstructedSentence.jp, 0.95);
  });

  document.getElementById('toggle-big-card')?.addEventListener('click', () => {
    document.querySelector('.result-jp-box')?.classList.toggle('giant-mode');
  });

  // 3. VOCABULARY DECK (MODO FLASHCARD 1 A 1 POR NIVELES CON OCULTACIÓN Y MNEMOTECNIA)
  const vocabStage = document.getElementById('vocab-single-stage');
  const allVocabCards = Array.from(document.querySelectorAll<HTMLElement>('.vocab-full-card'));
  const allVocabDots = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-jump-vocab]'));
  const vocabCounterPill = document.getElementById('vocab-counter-pill');

  let activeVocabLevel = 'intro';
  let activeVocabCat = 'all';
  let filteredVocabCards: HTMLElement[] = [...allVocabCards];
  let currentVocabPos = 0;

  function renderActiveVocabCard(autoSpeak = false) {
    if (filteredVocabCards.length === 0) return;
    currentVocabPos = ((currentVocabPos % filteredVocabCards.length) + filteredVocabCards.length) % filteredVocabCards.length;
    const activeCard = filteredVocabCards[currentVocabPos];

    allVocabCards.forEach((c) => {
      c.classList.remove('is-current', 'answer-revealed');
    });
    activeCard.classList.add('is-current');

    if (vocabCounterPill) {
      vocabCounterPill.innerHTML = `Expresión <strong>${currentVocabPos + 1}</strong> de <strong>${filteredVocabCards.length}</strong>`;
    }

    const activeGlobalIdx = parseInt(activeCard.dataset.vocabIndex || '0', 10);
    allVocabDots.forEach((dot) => {
      const dotIdx = parseInt(dot.dataset.jumpVocab || '0', 10);
      dot.classList.toggle('active', dotIdx === activeGlobalIdx);
    });

    if (autoSpeak) {
      const speakBtn = activeCard.querySelector<HTMLButtonElement>('.speak-btn');
      if (speakBtn?.dataset.speakText) {
        speakJapanese(speakBtn.dataset.speakText, 0.95);
      }
    }
  }

  function matchesVocabFilter(card: HTMLElement, levelFilter: string, catFilter: string): boolean {
    const cardLevel = card.dataset.vocabLevel || 'intro';
    if (levelFilter !== 'all' && cardLevel !== levelFilter) return false;

    if (catFilter === 'all') return true;
    const id = card.dataset.vocabId || '';
    const statLevel = state.itemStats[id]?.level || (state.masteredVocab.includes(id) ? 'dominado' : 'nuevo');
    if (catFilter === 'fortalecer') return statLevel === 'fortalecer';
    if (catFilter === 'dominado') return statLevel === 'dominado';
    return card.dataset.category === catFilter;
  }

  function applyVocabDeckFilters(notifyIfEmpty = true) {
    let matching = allVocabCards.filter((card) => matchesVocabFilter(card, activeVocabLevel, activeVocabCat));

    if (matching.length === 0) {
      if (notifyIfEmpty) {
        showToast(
          activeVocabCat === 'fortalecer'
            ? 'No tienes expresiones marcadas por fortalecer en este nivel. Mostrando el nivel completo.'
            : 'No hay expresiones con esa combinación de filtros. Mostrando el nivel actual.',
          '💡'
        );
      }
      matching = allVocabCards.filter(
        (card) => activeVocabLevel === 'all' || (card.dataset.vocabLevel || 'intro') === activeVocabLevel
      );
    }

    filteredVocabCards = matching.length > 0 ? matching : [...allVocabCards];
    currentVocabPos = 0;

    allVocabDots.forEach((dot) => {
      const idx = parseInt(dot.dataset.jumpVocab || '0', 10);
      const card = allVocabCards[idx];
      const posInFiltered = card ? filteredVocabCards.indexOf(card) : -1;
      if (posInFiltered !== -1) {
        dot.style.display = 'inline-flex';
        dot.textContent = String(posInFiltered + 1);
      } else {
        dot.style.display = 'none';
      }
    });

    renderActiveVocabCard(false);
  }

  document.querySelectorAll<HTMLButtonElement>('[data-vocab-level-tab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-vocab-level-tab]').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      activeVocabLevel = tab.dataset.vocabLevelTab || 'intro';
      applyVocabDeckFilters(true);
    });
  });

  document.querySelectorAll<HTMLButtonElement>('.cat-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.cat-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      activeVocabCat = tab.dataset.categoryFilter || 'all';
      applyVocabDeckFilters(true);
    });
  });

  applyVocabDeckFilters(false);

  document.getElementById('vocab-prev-btn')?.addEventListener('click', () => {
    currentVocabPos--;
    renderActiveVocabCard(false);
  });

  document.getElementById('vocab-next-btn')?.addEventListener('click', () => {
    currentVocabPos++;
    renderActiveVocabCard(false);
  });

  document.getElementById('vocab-need-practice-btn')?.addEventListener('click', () => {
    const activeCard = filteredVocabCards[currentVocabPos];
    const id = activeCard?.dataset.vocabId;
    const label = activeCard?.dataset.vocabLabel || id || 'Expresión';
    if (id) {
      recordItemOutcome(id, 'vocab', label, 'fortalecer');
      showToast(`Marcada para fortalecer: ${label}`, '🎯');
    }
    currentVocabPos++;
    renderActiveVocabCard(true);
  });

  document.getElementById('vocab-memorized-next-btn')?.addEventListener('click', () => {
    const activeCard = filteredVocabCards[currentVocabPos];
    const id = activeCard?.dataset.vocabId;
    const label = activeCard?.dataset.vocabLabel || id || 'Expresión';
    if (id) {
      recordItemOutcome(id, 'vocab', label, 'dominado');
    }
    addXP(15, 'Expresión dominada y guardada en JSON');
    currentVocabPos++;
    renderActiveVocabCard(true);
  });

  allVocabDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetIdx = parseInt(dot.dataset.jumpVocab || '0', 10);
      const posInFiltered = filteredVocabCards.findIndex(
        (c) => parseInt(c.dataset.vocabIndex || '0', 10) === targetIdx
      );
      if (posInFiltered !== -1) {
        currentVocabPos = posInFiltered;
        renderActiveVocabCard(false);
      }
    });
  });

  // Interruptores de visibilidad en VocabDeck
  const vocabToggleBlind = document.getElementById('vocab-toggle-blind');
  const vocabToggleScripts = document.getElementById('vocab-toggle-scripts');
  const vocabToggleMnemonic = document.getElementById('vocab-toggle-mnemonic');

  vocabToggleBlind?.addEventListener('click', () => {
    const isNowActive = !vocabToggleBlind.classList.contains('active');
    vocabToggleBlind.classList.toggle('active', isNowActive);
    vocabToggleBlind.setAttribute('aria-pressed', String(isNowActive));
    vocabStage?.classList.toggle('blind-study-active', isNowActive);
    allVocabCards.forEach((c) => c.classList.remove('answer-revealed'));
  });

  vocabToggleScripts?.addEventListener('click', () => {
    const isNowActive = !vocabToggleScripts.classList.contains('active');
    vocabToggleScripts.classList.toggle('active', isNowActive);
    vocabToggleScripts.setAttribute('aria-pressed', String(isNowActive));
    vocabStage?.classList.toggle('hide-scripts-panel', !isNowActive);
  });

  vocabToggleMnemonic?.addEventListener('click', () => {
    const isNowActive = !vocabToggleMnemonic.classList.contains('active');
    vocabToggleMnemonic.classList.toggle('active', isNowActive);
    vocabToggleMnemonic.setAttribute('aria-pressed', String(isNowActive));
    vocabStage?.classList.toggle('hide-mnemonic-panel', !isNowActive);
  });

  document.querySelectorAll<HTMLButtonElement>('.vocab-reveal-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.vocab-full-card');
      card?.classList.add('answer-revealed');
      const speakBtn = card?.querySelector<HTMLButtonElement>('.speak-btn');
      if (speakBtn?.dataset.speakText) {
        speakJapanese(speakBtn.dataset.speakText, 0.95);
      }
    });
  });

  document.querySelectorAll<HTMLButtonElement>('.speak-btn, .slow-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.speakText || '';
      const rate = parseFloat(btn.dataset.speakRate || '0.95');
      speakJapanese(text, rate);
    });
  });

  document.querySelectorAll<HTMLButtonElement>('.practice-voice-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const jp = btn.dataset.targetJp || '';
      const romaji = btn.dataset.targetRomaji || '';
      const card = btn.closest('.vocab-card');
      const resEl = card?.querySelector<HTMLElement>('.card-voice-result');
      if (resEl) {
        resEl.hidden = false;
        evaluatePronunciation(jp, romaji, (msg) => {
          resEl.textContent = msg;
        });
      }
    });
  });

  document.querySelectorAll<HTMLButtonElement>('.master-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.masterId;
      if (!id) return;
      const card = btn.closest<HTMLElement>('.vocab-card');
      const label = card?.dataset.vocabLabel || id;
      if (state.masteredVocab.includes(id)) {
        recordItemOutcome(id, 'vocab', label, 'fortalecer');
      } else {
        recordItemOutcome(id, 'vocab', label, 'dominado');
        addXP(10, 'Frase dominada y sellada (済)');
      }
    });
  });

  // 4. TRAVEL SIMULATOR (ROLEPLAY)
  const scenariosRaw = document.getElementById('scenarios-data')?.textContent;
  const scenarios = scenariosRaw ? JSON.parse(scenariosRaw) : [];
  let activeScenarioIdx = 0;
  let activeStepIdx = 0;
  let blindMode = false;

  const simJpTitle = document.getElementById('sim-jp-title');
  const simTitle = document.getElementById('sim-title');
  const simStepInd = document.getElementById('sim-step-indicator');
  const npcEmoji = document.getElementById('npc-emoji');
  const npcKana = document.getElementById('npc-kana');
  const npcJp = document.getElementById('npc-jp');
  const npcRomaji = document.getElementById('npc-romaji');
  const npcEs = document.getElementById('npc-es');
  const npcContext = document.getElementById('npc-context');
  const simOptionsContainer = document.getElementById('sim-options-container');
  const simFeedbackBanner = document.getElementById('sim-feedback-banner');
  const simFeedbackText = document.getElementById('sim-feedback-text');
  const simNextBtn = document.getElementById('sim-next-btn');
  const simMicPracticeBtn = document.getElementById('sim-mic-practice-btn');

  let currentCorrectOption: { jp: string; esPhonetic: string } | null = null;

  function renderScenarioStep() {
    const scen = scenarios[activeScenarioIdx];
    if (!scen) return;
    const step = scen.steps[activeStepIdx];
    if (!step) return;

    if (simJpTitle) simJpTitle.textContent = scen.jpTitle;
    if (simTitle) simTitle.textContent = scen.title;
    if (simStepInd) simStepInd.textContent = `Paso ${activeStepIdx + 1} de ${scen.steps.length}`;
    if (npcEmoji) {
      npcEmoji.textContent =
        scen.id === 'konbini'
          ? '🏪'
          : scen.id === 'ramen-izakaya'
          ? '🍜'
          : scen.id === 'shinkansen-station'
          ? '🚅'
          : '♨️';
    }
    if (npcKana) npcKana.textContent = step.staffKana;
    if (npcJp) npcJp.textContent = step.staffJp;
    if (npcRomaji) npcRomaji.textContent = step.staffRomaji;
    if (npcEs) {
      npcEs.textContent = step.staffEs;
      npcEs.classList.toggle('blurred', blindMode);
    }
    if (npcContext) {
      npcContext.innerHTML = `💡 <strong>Pista de viajero:</strong> ${step.contextNote}`;
    }

    if (simFeedbackBanner) simFeedbackBanner.hidden = true;

    if (simOptionsContainer) {
      simOptionsContainer.innerHTML = '';
      step.options.forEach(
        (opt: {
          jp: string;
          kana: string;
          romaji: string;
          esPhonetic: string;
          esMeaning: string;
          isCorrect: boolean;
          feedback: string;
        }) => {
          if (opt.isCorrect) {
            currentCorrectOption = { jp: opt.jp, esPhonetic: opt.esPhonetic };
          }
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'sim-option-btn';
          btn.innerHTML = `
            <span class="opt-jp">${opt.jp}</span>
            <span class="opt-phonetic">🇪🇸 "${opt.esPhonetic}"</span>
            <span class="opt-meaning">${opt.esMeaning}</span>
          `;
          btn.addEventListener('click', () => {
            speakJapanese(opt.jp, 0.95);
            if (opt.isCorrect) {
              btn.classList.add('correct-choice');
              if (simFeedbackBanner && simFeedbackText && simNextBtn) {
                simFeedbackBanner.hidden = false;
                simFeedbackText.textContent = `💮 ${opt.feedback}`;
                const isLast = activeStepIdx >= scen.steps.length - 1;
                simNextBtn.textContent = isLast
                  ? ` Estampar Sello "${scen.stampName}" (+50 XP)`
                  : 'Siguiente paso →';
              }
            } else {
              btn.classList.add('wrong-choice');
              if (simFeedbackBanner && simFeedbackText) {
                simFeedbackBanner.hidden = false;
                simFeedbackText.textContent = `⚠️ ${opt.feedback}`;
              }
            }
          });
          simOptionsContainer.appendChild(btn);
        }
      );
    }
  }

  document.querySelectorAll<HTMLButtonElement>('.scenario-tab-card').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.scenario-tab-card').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      activeScenarioIdx = parseInt(tab.dataset.scenarioIndex || '0', 10);
      activeStepIdx = 0;
      renderScenarioStep();
      const scen = scenarios[activeScenarioIdx];
      if (scen?.steps?.[0]) speakJapanese(scen.steps[0].staffJp, 0.95);
    });
  });

  document.getElementById('npc-speak-btn')?.addEventListener('click', () => {
    const scen = scenarios[activeScenarioIdx];
    const step = scen?.steps?.[activeStepIdx];
    if (step) speakJapanese(step.staffJp, 0.92);
  });

  document.getElementById('blind-mode-checkbox')?.addEventListener('change', (e) => {
    blindMode = (e.target as HTMLInputElement).checked;
    npcEs?.classList.toggle('blurred', blindMode);
  });

  simMicPracticeBtn?.addEventListener('click', () => {
    if (!currentCorrectOption || !simFeedbackText) return;
    evaluatePronunciation(currentCorrectOption.jp, currentCorrectOption.esPhonetic, (msg) => {
      simFeedbackText.textContent = msg;
    });
  });

  simNextBtn?.addEventListener('click', () => {
    const scen = scenarios[activeScenarioIdx];
    if (!scen) return;
    if (activeStepIdx < scen.steps.length - 1) {
      activeStepIdx++;
      renderScenarioStep();
      speakJapanese(scen.steps[activeStepIdx].staffJp, 0.92);
    } else {
      // Scenario complete!
      addXP(50, `Escenario completado: ${scen.title}`);
      unlockStamp(scen.id, scen.stampName);
      incrementQuest('sim');
      activeStepIdx = 0;
      renderScenarioStep();
    }
  });

  renderScenarioStep();

  // 5. CALLIGRAPHY DOJO & CANVAS SHODŌ
  const writingRaw = document.getElementById('writing-data')?.textContent;
  const writingChars = writingRaw ? JSON.parse(writingRaw) : [];
  let currentCharIdx = 0;
  let guideVisible = true;
  let hasDrawnStroke = false;

  const svgStrokesGroup = document.getElementById('svg-strokes-group');
  const charTypeBadge = document.getElementById('char-type-badge');
  const charMeaningTitle = document.getElementById('char-meaning-title');
  const charSpeakBtn = document.getElementById('char-speak-btn');
  const charPhonetic = document.getElementById('char-phonetic');
  const charMnemonic = document.getElementById('char-mnemonic');
  const charExampleJp = document.getElementById('char-example-jp');
  const charExampleRomaji = document.getElementById('char-example-romaji');
  const charExampleEs = document.getElementById('char-example-es');
  const strokeCountBadge = document.getElementById('stroke-count-badge');
  const hankoRewardOverlay = document.getElementById('canvas-hanko-reward');

  const canvas = document.getElementById('shodo-canvas') as HTMLCanvasElement | null;
  const ctx = canvas?.getContext('2d');

  function clearShodoCanvas() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawnStroke = false;
    if (hankoRewardOverlay) hankoRewardOverlay.hidden = true;
  }

  function renderWritingChar(animate = false) {
    const wc = writingChars[currentCharIdx];
    if (!wc) return;

    if (charTypeBadge) charTypeBadge.textContent = wc.type.toUpperCase();
    if (charMeaningTitle) charMeaningTitle.textContent = `${wc.char} (${wc.romaji}) · ${wc.meaning}`;
    if (charSpeakBtn) charSpeakBtn.textContent = `🔊 Escuchar "${wc.char}"`;
    if (charPhonetic) charPhonetic.textContent = wc.esPhonetic;
    if (charMnemonic) {
      charMnemonic.innerHTML = `🧠 <strong>Truco visual para recordarlo:</strong> ${wc.mnemonic}`;
    }
    if (charExampleJp) charExampleJp.textContent = wc.exampleWord.jp;
    if (charExampleRomaji) charExampleRomaji.textContent = wc.exampleWord.romaji;
    if (charExampleEs) charExampleEs.textContent = wc.exampleWord.es;
    if (strokeCountBadge) {
      strokeCountBadge.textContent = `${wc.strokes.length} ${wc.strokes.length === 1 ? 'trazo' : 'trazos'}`;
    }

    if (svgStrokesGroup) {
      svgStrokesGroup.innerHTML = '';
      if (guideVisible) {
        wc.strokes.forEach((d: string, idx: number) => {
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', d);
          path.setAttribute('class', animate ? 'guide-stroke-path guide-stroke-anim' : 'guide-stroke-path');
          if (animate) {
            path.style.animationDelay = `${idx * 0.45}s`;
          }
          svgStrokesGroup.appendChild(path);
        });
      }
    }
  }

  document.querySelectorAll<HTMLButtonElement>('.w-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.w-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const wtype = tab.dataset.wtype || 'all';
      let firstVisibleTile: HTMLButtonElement | null = null;
      document.querySelectorAll<HTMLButtonElement>('.char-tile').forEach((tile) => {
        const matches =
          wtype === 'all' ||
          (wtype.startsWith('level:')
            ? tile.dataset.charLevel === wtype.replace('level:', '')
            : tile.dataset.charType === wtype);
        tile.style.display = matches ? 'flex' : 'none';
        if (matches && !firstVisibleTile) {
          firstVisibleTile = tile;
        }
      });
      if (firstVisibleTile) {
        (firstVisibleTile as HTMLButtonElement).click();
      }
    });
  });

  document.querySelectorAll<HTMLButtonElement>('.char-tile').forEach((tile) => {
    tile.addEventListener('click', () => {
      document.querySelectorAll('.char-tile').forEach((t) => t.classList.remove('active'));
      tile.classList.add('active');
      currentCharIdx = parseInt(tile.dataset.charIndex || '0', 10);
      clearShodoCanvas();
      renderWritingChar(true);
      const wc = writingChars[currentCharIdx];
      if (wc) speakJapanese(wc.char, 0.85);
    });
  });

  charSpeakBtn?.addEventListener('click', () => {
    const wc = writingChars[currentCharIdx];
    if (wc) speakJapanese(wc.char, 0.85);
  });

  document.getElementById('char-example-speak')?.addEventListener('click', () => {
    const wc = writingChars[currentCharIdx];
    if (wc) speakJapanese(wc.exampleWord.jp, 0.9);
  });

  document.getElementById('animate-strokes-btn')?.addEventListener('click', () => {
    renderWritingChar(true);
  });

  document.getElementById('toggle-guide-btn')?.addEventListener('click', (e) => {
    guideVisible = !guideVisible;
    const btn = e.currentTarget as HTMLButtonElement;
    btn.textContent = guideVisible ? '👁️ Guía: Visible' : '🙈 Guía: Oculta';
    renderWritingChar(false);
  });

  document.getElementById('clear-canvas-btn')?.addEventListener('click', clearShodoCanvas);

  document.getElementById('verify-stroke-btn')?.addEventListener('click', () => {
    const wc = writingChars[currentCharIdx];
    if (!wc) return;
    if (!hasDrawnStroke) {
      showToast('Dibuja primero el signo sobre el papel Washi con el ratón o tu dedo', '🖌️');
      return;
    }
    if (hankoRewardOverlay) hankoRewardOverlay.hidden = false;
    addXP(20, `Caligrafía sellada: ${wc.char}`);
    incrementQuest('kanji');

    if (!state.practicedChars.includes(wc.id)) {
      state.practicedChars.push(wc.id);
    }
    if (state.practicedChars.length >= 3) {
      unlockStamp('calligrapher', 'Pincel Zen (書)');
    }
    if (state.practicedChars.length >= 8) {
      unlockStamp('kanji-street', 'Carteles de Calle (道)');
    }
    if (state.practicedChars.length >= 16) {
      unlockStamp('shodo-master', 'Maestro Shodō (墨)');
    }
    saveState();
  });

  // Canvas Brush Drawing Logic (Sumi Ink)
  if (canvas && ctx) {
    let drawing = false;
    let lastX = 0;
    let lastY = 0;

    const getPos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    };

    canvas.addEventListener('pointerdown', (e) => {
      drawing = true;
      hasDrawnStroke = true;
      const pos = getPos(e);
      lastX = pos.x;
      lastY = pos.y;
      ctx.beginPath();
      ctx.arc(lastX, lastY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#1C1917';
      ctx.fill();
    });

    canvas.addEventListener('pointermove', (e) => {
      if (!drawing) return;
      const pos = getPos(e);
      const dist = Math.hypot(pos.x - lastX, pos.y - lastY);
      const lineWidth = Math.max(5, Math.min(14, 14 - dist * 0.25));

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = '#1C1917';
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      lastX = pos.x;
      lastY = pos.y;
    });

    const stopDraw = () => {
      drawing = false;
    };
    canvas.addEventListener('pointerup', stopDraw);
    canvas.addEventListener('pointerleave', stopDraw);
  }

  renderWritingChar(false);

  // 6. QUICK MINIGAME (EXPRESO YAMANOTE QUIZ & FLASHCARDS ZEN POR NIVELES)
  let quizCombo = 0;
  let quizScore = 0;
  let activeQuizLevel = 'all';
  let currentQuizItem = VOCAB_ITEMS[0];

  const quizComboEl = document.getElementById('quiz-combo-count');
  const quizScoreEl = document.getElementById('quiz-score-count');
  const quizJpText = document.getElementById('quiz-jp-text');
  const quizPhoneticHint = document.getElementById('quiz-phonetic-hint');
  const quizOptionsGrid = document.getElementById('quiz-options-grid');
  const quizStatusMsg = document.getElementById('quiz-status-msg');

  function getActiveQuizVocabPool() {
    if (activeQuizLevel === 'all') return VOCAB_ITEMS;
    const filtered = VOCAB_ITEMS.filter((i) => i.level === activeQuizLevel);
    return filtered.length > 0 ? filtered : VOCAB_ITEMS;
  }

  function loadNextQuizQuestion() {
    const levelPool = getActiveQuizVocabPool();
    // Selección adaptativa: priorizar expresiones que el usuario necesita fortalecer según el JSON
    const weakPool = levelPool.filter((item) => state.itemStats[item.id]?.level === 'fortalecer');
    const unmasteredPool = levelPool.filter((item) => state.itemStats[item.id]?.level !== 'dominado');

    let pool = levelPool;
    if (weakPool.length > 0 && Math.random() < 0.65) {
      pool = weakPool;
    } else if (unmasteredPool.length > 0 && Math.random() < 0.75) {
      pool = unmasteredPool;
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    currentQuizItem = pool[randomIndex] || levelPool[0] || VOCAB_ITEMS[0];

    if (quizJpText) quizJpText.textContent = currentQuizItem.japanese;
    if (quizPhoneticHint) quizPhoneticHint.textContent = `Pronunciación: "${currentQuizItem.esPhonetic}"`;

    // Pick 3 distractors
    const distractors = VOCAB_ITEMS.filter((i) => i.id !== currentQuizItem.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const choices = [currentQuizItem, ...distractors].sort(() => Math.random() - 0.5);

    if (quizOptionsGrid) {
      quizOptionsGrid.innerHTML = '';
      choices.forEach((choice) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-opt-btn';
        btn.textContent = choice.meaning;
        btn.addEventListener('click', () => {
          const isRight = choice.id === currentQuizItem.id;
          const label = `${currentQuizItem.japanese} (${currentQuizItem.meaning})`;
          if (isRight) {
            btn.classList.add('correct');
            quizCombo++;
            quizScore++;
            recordItemOutcome(currentQuizItem.id, 'vocab', label, 'hit');
            speakJapanese(currentQuizItem.japanese, 0.98);
            addXP(10 + quizCombo * 2, `Acierto Yamanote (Combo x${quizCombo})`);
            if (quizStatusMsg) {
              quizStatusMsg.textContent = `💮 ¡Correcto! "${currentQuizItem.esPhonetic}" = ${currentQuizItem.meaning} (Guardado en JSON)`;
            }
            if (quizCombo >= 5) {
              unlockStamp('yamanote-ace', 'Expreso Yamanote (速)');
            }
            if (quizCombo >= 10 || quizScore >= 25) {
              unlockStamp('yamanote-legend', 'Relámpago de Tokio (雷)');
            }
            setTimeout(loadNextQuizQuestion, 1100);
          } else {
            btn.classList.add('wrong');
            quizCombo = 0;
            recordItemOutcome(currentQuizItem.id, 'vocab', label, 'miss');
            if (quizStatusMsg) {
              quizStatusMsg.textContent = `❌ Marcada para fortalecer en tu JSON. Significaba: "${currentQuizItem.meaning}".`;
            }
          }
          if (quizComboEl) quizComboEl.textContent = String(quizCombo);
          if (quizScoreEl) quizScoreEl.textContent = String(quizScore);
        });
        quizOptionsGrid.appendChild(btn);
      });
    }
  }

  document.getElementById('quiz-listen-btn')?.addEventListener('click', () => {
    speakJapanese(currentQuizItem.japanese, 0.95);
  });

  // Flashcards Zen Mode
  let fcIndex = 0;
  const fcCard = document.getElementById('flashcard-card');
  const fcCounter = document.getElementById('fc-counter');
  const fcKana = document.getElementById('fc-kana');
  const fcJp = document.getElementById('fc-jp');
  const fcPhonetic = document.getElementById('fc-phonetic');
  const fcMeaning = document.getElementById('fc-meaning');
  const fcTip = document.getElementById('fc-tip');

  function renderFlashcard() {
    const fcPool = getActiveQuizVocabPool();
    fcIndex = ((fcIndex % fcPool.length) + fcPool.length) % fcPool.length;
    const item = fcPool[fcIndex];
    if (!item) return;
    fcCard?.classList.remove('is-flipped');
    if (fcCounter) fcCounter.textContent = `Tarjeta ${fcIndex + 1} de ${fcPool.length}`;
    if (fcKana) fcKana.textContent = item.kana;
    if (fcJp) fcJp.textContent = item.japanese;
    if (fcPhonetic) fcPhonetic.textContent = `"${item.esPhonetic}"`;
    if (fcMeaning) fcMeaning.textContent = item.meaning;
    if (fcTip) fcTip.textContent = `🏮 ${item.culturalTip}`;
  }

  document.querySelectorAll<HTMLButtonElement>('[data-quiz-level]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-quiz-level]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeQuizLevel = btn.dataset.quizLevel || 'all';
      fcIndex = 0;
      loadNextQuizQuestion();
      renderFlashcard();
    });
  });

  fcCard?.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).id === 'fc-speak-btn') return;
    fcCard.classList.toggle('is-flipped');
  });

  document.getElementById('fc-flip-btn')?.addEventListener('click', () => {
    fcCard?.classList.toggle('is-flipped');
  });

  document.getElementById('fc-speak-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const fcPool = getActiveQuizVocabPool();
    const item = fcPool[fcIndex];
    if (item) speakJapanese(item.japanese, 0.92);
  });

  document.getElementById('fc-prev-btn')?.addEventListener('click', () => {
    const fcPool = getActiveQuizVocabPool();
    fcIndex = (fcIndex - 1 + fcPool.length) % fcPool.length;
    renderFlashcard();
  });

  document.getElementById('fc-next-btn')?.addEventListener('click', () => {
    const fcPool = getActiveQuizVocabPool();
    fcIndex = (fcIndex + 1) % fcPool.length;
    renderFlashcard();
  });

  document.getElementById('fc-know-btn')?.addEventListener('click', () => {
    const fcPool = getActiveQuizVocabPool();
    const item = fcPool[fcIndex];
    if (item) {
      speakJapanese(item.japanese, 0.95);
      addXP(15, `Flashcard superada: ${item.romaji}`);
    }
    fcIndex = (fcIndex + 1) % fcPool.length;
    renderFlashcard();
  });

  const modeQuizBtn = document.getElementById('mode-quiz-btn');
  const modeFcBtn = document.getElementById('mode-flashcard-btn');
  const quizArena = document.getElementById('quiz-arena');
  const fcArena = document.getElementById('flashcard-arena');

  modeQuizBtn?.addEventListener('click', () => {
    modeQuizBtn.classList.add('active');
    modeFcBtn?.classList.remove('active');
    if (quizArena) quizArena.hidden = false;
    if (fcArena) fcArena.hidden = true;
  });

  modeFcBtn?.addEventListener('click', () => {
    modeFcBtn.classList.add('active');
    modeQuizBtn?.classList.remove('active');
    if (fcArena) fcArena.hidden = false;
    if (quizArena) quizArena.hidden = true;
  });

  loadNextQuizQuestion();
  renderFlashcard();
  updateBuilderDisplay();
  renderGamificationUI();

  // 7. TABLA DINÁMICA DE HIRAGANA, KATAKANA Y ROMAJI (CON MODO SIN PISTAS Y TABLERO MEZCLADO)
  const kanaGridCard = document.getElementById('kana-grid-card');
  const kanaRowsContainer = document.getElementById('kana-rows-container');
  const kanaShuffledBoard = document.getElementById('kana-shuffled-board');
  const kanaVowelHeader = document.getElementById('kana-vowel-header');
  const kanaInspectorMystery = document.getElementById('kana-inspector-mystery');
  const kanaInspectorContent = document.getElementById('kana-inspector-content');
  const kanaToggleRomajiBtn = document.getElementById('kana-toggle-romaji-btn');
  const kanaShuffleToggleBtn = document.getElementById('kana-ear-shuffle-toggle');

  const inspHira = document.getElementById('insp-hira');
  const inspKata = document.getElementById('insp-kata');
  const inspRomaji = document.getElementById('insp-romaji');
  const inspEsSound = document.getElementById('insp-essound');
  const inspExJp = document.getElementById('insp-ex-jp');
  const inspExRomaji = document.getElementById('insp-ex-romaji');

  let selectedKanaHira = 'あ';
  let selectedKanaExJp = 'あさ';
  let currentKanaViewMode = 'both';
  let manualRomajiHidden = false;
  let earChallengeActive = false;
  let earShuffleEnabled = true;
  let earChallengeTarget: { hira: string; kata: string; romaji: string } | null = null;

  const allKanaCells = Array.from(document.querySelectorAll<HTMLButtonElement>('.kana-cell'));

  function updateInspectorFromCell(cell: HTMLElement) {
    const hira = cell.dataset.hira || 'あ';
    const kata = cell.dataset.kata || 'ア';
    const romaji = cell.dataset.romaji || 'a';
    const esSound = cell.dataset.essound || 'a';
    const exJp = cell.dataset.exjp || '';
    const exRomaji = cell.dataset.exromaji || '';
    const exEs = cell.dataset.exes || '';

    selectedKanaHira = hira;
    selectedKanaExJp = exJp.split(' ')[0] || hira;

    if (inspHira) inspHira.textContent = hira;
    if (inspKata) inspKata.textContent = kata;
    if (inspRomaji) inspRomaji.textContent = romaji;
    if (inspEsSound) inspEsSound.textContent = esSound;
    if (inspExJp) inspExJp.textContent = exJp;
    if (inspExRomaji) inspExRomaji.textContent = `${exRomaji} — ${exEs}`;
  }

  function handleEarChallengeGuess(cellData: HTMLElement, clickedBtn: HTMLElement) {
    if (!earChallengeTarget) return;
    const hira = cellData.dataset.hira || '';
    const kata = cellData.dataset.kata || '';
    const romaji = cellData.dataset.romaji || '';
    const earPrompt = document.getElementById('kana-ear-prompt');
    const targetKey = `kana-${earChallengeTarget.romaji}`;
    const targetLabel = `Kana ${earChallengeTarget.hira}/${earChallengeTarget.kata} (${earChallengeTarget.romaji})`;

    if (hira === earChallengeTarget.hira) {
      clickedBtn.classList.add('correct-hit');
      updateInspectorFromCell(cellData);
      if (kanaInspectorMystery) kanaInspectorMystery.hidden = true;
      if (kanaInspectorContent) kanaInspectorContent.hidden = false;

      recordItemOutcome(targetKey, 'kana', targetLabel, 'hit');
      addXP(15, `Oído Kana sin pistas: ¡Acertaste ${hira} / ${kata}!`);
      if (earPrompt) {
        earPrompt.textContent = `💮 ¡Correcto! Era "${hira} / ${kata}" (${romaji}). Guardado en tu progreso JSON...`;
      }
      setTimeout(() => {
        pickNextEarChallenge(true);
      }, 1250);
    } else {
      clickedBtn.classList.add('wrong-hit');
      setTimeout(() => clickedBtn.classList.remove('wrong-hit'), 550);
      recordItemOutcome(targetKey, 'kana', targetLabel, 'miss');
      speakJapanese(hira, 0.95);
      if (earPrompt) {
        earPrompt.textContent = `❌ Esa letra suena "${hira}". Marcamos "${earChallengeTarget.hira}/${earChallengeTarget.kata}" para reforzar. Pulsa "🔊 Repetir sonido".`;
      }
    }
  }

  function renderShuffledKanaBoard() {
    if (!kanaShuffledBoard) return;
    kanaShuffledBoard.innerHTML = '';

    const visibleCells = allKanaCells.filter(
      (c) => (c.closest('.kana-row') as HTMLElement)?.style.display !== 'none'
    );
    const pool = [...(visibleCells.length > 0 ? visibleCells : allKanaCells)].sort(
      () => Math.random() - 0.5
    );

    pool.forEach((origCell) => {
      const hira = origCell.dataset.hira || '';
      const kata = origCell.dataset.kata || '';
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'shuffled-kana-tile';

      // En modo "both" mostramos al azar Hiragana o Katakana (o ambos sin Romaji) para que estén mezcladas sin pistas
      if (currentKanaViewMode === 'hiragana') {
        tile.innerHTML = `<span class="shuf-main-char">${hira}</span>`;
      } else if (currentKanaViewMode === 'katakana') {
        tile.innerHTML = `<span class="shuf-main-char">${kata}</span>`;
      } else {
        const showKataPrimary = Math.random() > 0.5;
        tile.innerHTML = showKataPrimary
          ? `<span class="shuf-main-char">${kata}</span><span class="shuf-sub-char">${hira}</span>`
          : `<span class="shuf-main-char">${hira}</span><span class="shuf-sub-char">${kata}</span>`;
      }

      tile.addEventListener('click', () => {
        if (earChallengeActive) {
          handleEarChallengeGuess(origCell, tile);
        } else {
          updateInspectorFromCell(origCell);
          speakJapanese(hira, 0.95);
        }
      });

      kanaShuffledBoard.appendChild(tile);
    });
  }

  function syncKanaBoardVisibility() {
    const hideHints = earChallengeActive || manualRomajiHidden;
    kanaGridCard?.classList.toggle('no-hints-mode', hideHints);

    const showShuffled = earChallengeActive && earShuffleEnabled;
    if (kanaShuffledBoard) kanaShuffledBoard.hidden = !showShuffled;
    if (kanaRowsContainer) kanaRowsContainer.style.display = showShuffled ? 'none' : 'flex';
    if (kanaVowelHeader) {
      kanaVowelHeader.style.display = hideHints || showShuffled ? 'none' : '';
    }
  }

  document.querySelectorAll<HTMLButtonElement>('.kana-mode-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.kana-mode-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentKanaViewMode = btn.dataset.kanaView || 'both';
      if (kanaRowsContainer) {
        kanaRowsContainer.setAttribute('data-view-mode', currentKanaViewMode);
      }
      if (earChallengeActive && earShuffleEnabled) {
        renderShuffledKanaBoard();
      }
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-kana-level-tab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-kana-level-tab]').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const lvl = tab.dataset.kanaLevelTab || 'all';
      document.querySelectorAll<HTMLElement>('.kana-row').forEach((row) => {
        if (lvl === 'all') {
          const activeGroupBtn = document.querySelector<HTMLButtonElement>('.kana-group-btn.active');
          const grp = activeGroupBtn?.dataset.kanaGroup || 'gojuon';
          row.style.display = grp === 'all' || row.dataset.rowGroup === grp ? 'grid' : 'none';
        } else {
          row.style.display = row.dataset.rowLevel === lvl ? 'grid' : 'none';
        }
      });
      if (earChallengeActive) {
        renderShuffledKanaBoard();
      }
    });
  });

  document.querySelectorAll<HTMLButtonElement>('.kana-group-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.kana-group-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const group = btn.dataset.kanaGroup || 'gojuon';
      document.querySelectorAll<HTMLElement>('.kana-row').forEach((row) => {
        if (group === 'all' || row.dataset.rowGroup === group) {
          row.style.display = 'grid';
        } else {
          row.style.display = 'none';
        }
      });
      if (earChallengeActive) {
        renderShuffledKanaBoard();
      }
    });
  });

  kanaToggleRomajiBtn?.addEventListener('click', () => {
    manualRomajiHidden = !manualRomajiHidden;
    kanaToggleRomajiBtn.classList.toggle('active', manualRomajiHidden);
    kanaToggleRomajiBtn.setAttribute('aria-pressed', String(manualRomajiHidden));
    kanaToggleRomajiBtn.textContent = manualRomajiHidden ? '👁️ Mostrar Romaji' : '🙈 Ocultar Romaji';
    syncKanaBoardVisibility();
  });

  allKanaCells.forEach((cell) => {
    cell.addEventListener('click', () => {
      allKanaCells.forEach((c) => c.classList.remove('selected'));
      cell.classList.add('selected');

      if (earChallengeActive) {
        handleEarChallengeGuess(cell, cell);
        return;
      }

      updateInspectorFromCell(cell);
      speakJapanese(cell.dataset.hira || 'あ', 0.95);
    });
  });

  document.getElementById('inspector-speak-kana')?.addEventListener('click', () => {
    speakJapanese(selectedKanaHira, 0.9);
  });

  document.getElementById('inspector-speak-example')?.addEventListener('click', () => {
    speakJapanese(selectedKanaExJp, 0.9);
  });

  // Ear Challenge on Kana Table (No-Hints + Shuffled Hiragana & Katakana)
  const earBanner = document.getElementById('kana-ear-banner');
  const earPrompt = document.getElementById('kana-ear-prompt');

  function pickNextEarChallenge(reshuffle = true) {
    const visibleCells = allKanaCells.filter(
      (c) => (c.closest('.kana-row') as HTMLElement)?.style.display !== 'none'
    );
    const basePool = visibleCells.length > 0 ? visibleCells : allKanaCells;
    const weakKanaPool = basePool.filter((c) => {
      const key = `kana-${c.dataset.romaji || ''}`;
      return state.itemStats[key]?.level === 'fortalecer';
    });

    const pool = weakKanaPool.length > 0 && Math.random() < 0.6 ? weakKanaPool : basePool;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    if (!chosen) return;

    earChallengeTarget = {
      hira: chosen.dataset.hira || 'あ',
      kata: chosen.dataset.kata || 'ア',
      romaji: chosen.dataset.romaji || 'a',
    };

    if (reshuffle && earShuffleEnabled) {
      renderShuffledKanaBoard();
    }

    if (kanaInspectorMystery) kanaInspectorMystery.hidden = false;
    if (kanaInspectorContent) kanaInspectorContent.hidden = true;

    if (earPrompt) {
      earPrompt.textContent =
        '🎧 ¿Qué letra japonesa acabas de escuchar? Encuéntrala y haz clic en ella (sin pistas).';
    }
    speakJapanese(earChallengeTarget.hira, 0.9);
  }

  document.getElementById('kana-audio-quiz-btn')?.addEventListener('click', () => {
    earChallengeActive = true;
    if (earBanner) earBanner.hidden = false;
    syncKanaBoardVisibility();
    pickNextEarChallenge(true);
  });

  kanaShuffleToggleBtn?.addEventListener('click', () => {
    earShuffleEnabled = !earShuffleEnabled;
    kanaShuffleToggleBtn.classList.toggle('active', earShuffleEnabled);
    kanaShuffleToggleBtn.textContent = earShuffleEnabled ? '🔀 Mezcladas: Sí' : '📋 En orden (Sin Romaji)';
    if (earShuffleEnabled) {
      renderShuffledKanaBoard();
    }
    syncKanaBoardVisibility();
  });

  document.getElementById('kana-ear-replay')?.addEventListener('click', () => {
    if (earChallengeTarget) speakJapanese(earChallengeTarget.hira, 0.85);
  });

  document.getElementById('mystery-replay-btn')?.addEventListener('click', () => {
    if (earChallengeTarget) speakJapanese(earChallengeTarget.hira, 0.85);
  });

  document.getElementById('kana-ear-close')?.addEventListener('click', () => {
    earChallengeActive = false;
    earChallengeTarget = null;
    if (earBanner) earBanner.hidden = true;
    if (kanaInspectorMystery) kanaInspectorMystery.hidden = true;
    if (kanaInspectorContent) kanaInspectorContent.hidden = false;
    syncKanaBoardVisibility();
  });

  // 8. PALABRAS COMUNES ILUSTRADAS POR NIVELES (MODO FLASHCARD 1 A 1 CON OCULTACIÓN Y MNEMOTECNIA)
  const vwordStage = document.querySelector<HTMLElement>('.single-card-stage');
  const allVwordCards = Array.from(document.querySelectorAll<HTMLElement>('.full-study-card'));
  const allVwordDots = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-jump-vword]'));
  const vwordCounterPill = document.getElementById('vword-counter-pill');

  let activeVwordLevel = 'intro';
  let activeVwordCat = 'all';
  let filteredVwordCards: HTMLElement[] = [...allVwordCards];
  let currentVwordPos = 0;

  function renderActiveVwordCard(autoSpeak = false) {
    if (filteredVwordCards.length === 0) return;
    currentVwordPos = ((currentVwordPos % filteredVwordCards.length) + filteredVwordCards.length) % filteredVwordCards.length;
    const activeCard = filteredVwordCards[currentVwordPos];

    allVwordCards.forEach((c) => {
      c.classList.remove('is-current', 'answer-revealed');
    });
    activeCard.classList.add('is-current');

    if (vwordCounterPill) {
      vwordCounterPill.innerHTML = `Palabra <strong>${currentVwordPos + 1}</strong> de <strong>${filteredVwordCards.length}</strong>`;
    }

    const activeGlobalIdx = parseInt(activeCard.dataset.vwordIndex || '0', 10);
    allVwordDots.forEach((dot) => {
      const dotIdx = parseInt(dot.dataset.jumpVword || '0', 10);
      dot.classList.toggle('active', dotIdx === activeGlobalIdx);
    });

    if (autoSpeak) {
      const audioBtn = activeCard.querySelector<HTMLButtonElement>('.v-audio-btn.primary');
      if (audioBtn?.dataset.speakWord) {
        speakJapanese(audioBtn.dataset.speakWord, 0.95);
      }
    }
  }

  function matchesVwordFilter(card: HTMLElement, levelFilter: string, cat: string): boolean {
    const cardLevel = card.dataset.vwordLevel || 'intro';
    if (levelFilter !== 'all' && cardLevel !== levelFilter) return false;

    if (cat === 'all') return true;
    const id = card.dataset.vwordId || '';
    const statLevel = state.itemStats[id]?.level || (state.masteredVocab.includes(id) ? 'dominado' : 'nuevo');
    if (cat === 'fortalecer') return statLevel === 'fortalecer';
    if (cat === 'dominado') return statLevel === 'dominado';
    return card.dataset.vwordCat === cat;
  }

  function applyVwordDeckFilters(notifyIfEmpty = true) {
    let matching = allVwordCards.filter((card) => matchesVwordFilter(card, activeVwordLevel, activeVwordCat));

    if (matching.length === 0) {
      if (notifyIfEmpty) {
        showToast(
          activeVwordCat === 'fortalecer'
            ? 'No tienes palabras marcadas por fortalecer en este nivel. Mostrando el nivel completo.'
            : 'No hay palabras con esa combinación de filtros. Mostrando el nivel actual.',
          '💡'
        );
      }
      matching = allVwordCards.filter(
        (card) => activeVwordLevel === 'all' || (card.dataset.vwordLevel || 'intro') === activeVwordLevel
      );
    }

    filteredVwordCards = matching.length > 0 ? matching : [...allVwordCards];
    currentVwordPos = 0;

    allVwordDots.forEach((dot) => {
      const idx = parseInt(dot.dataset.jumpVword || '0', 10);
      const card = allVwordCards[idx];
      const posInFiltered = card ? filteredVwordCards.indexOf(card) : -1;
      if (posInFiltered !== -1) {
        dot.style.display = 'inline-flex';
        dot.textContent = String(posInFiltered + 1);
      } else {
        dot.style.display = 'none';
      }
    });

    renderActiveVwordCard(false);
  }

  document.querySelectorAll<HTMLButtonElement>('[data-vword-level-tab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-vword-level-tab]').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      activeVwordLevel = tab.dataset.vwordLevelTab || 'intro';
      applyVwordDeckFilters(true);
    });
  });

  document.querySelectorAll<HTMLButtonElement>('.v-cat-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.v-cat-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeVwordCat = btn.dataset.vcat || 'all';
      applyVwordDeckFilters(true);
    });
  });

  applyVwordDeckFilters(false);

  document.getElementById('vword-prev-btn')?.addEventListener('click', () => {
    currentVwordPos--;
    renderActiveVwordCard(false);
  });

  document.getElementById('vword-next-btn')?.addEventListener('click', () => {
    currentVwordPos++;
    renderActiveVwordCard(false);
  });

  document.getElementById('vword-need-practice-btn')?.addEventListener('click', () => {
    const activeCard = filteredVwordCards[currentVwordPos];
    const id = activeCard?.dataset.vwordId;
    const label = activeCard?.dataset.vwordLabel || id || 'Palabra';
    if (id) {
      recordItemOutcome(id, 'vword', label, 'fortalecer');
      showToast(`Marcada para fortalecer en tu JSON: ${label}`, '🎯');
    }
    currentVwordPos++;
    renderActiveVwordCard(true);
  });

  document.getElementById('vword-memorized-btn')?.addEventListener('click', () => {
    const activeCard = filteredVwordCards[currentVwordPos];
    const id = activeCard?.dataset.vwordId;
    const label = activeCard?.dataset.vwordLabel || id || 'Palabra';
    if (id) {
      recordItemOutcome(id, 'vword', label, 'dominado');
    }
    addXP(15, 'Palabra común dominada y guardada en JSON');
    currentVwordPos++;
    renderActiveVwordCard(true);
  });

  allVwordDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetIdx = parseInt(dot.dataset.jumpVword || '0', 10);
      const posInFiltered = filteredVwordCards.findIndex(
        (c) => parseInt(c.dataset.vwordIndex || '0', 10) === targetIdx
      );
      if (posInFiltered !== -1) {
        currentVwordPos = posInFiltered;
        renderActiveVwordCard(false);
      }
    });
  });

  // Interruptores de visibilidad en Palabras Comunes (Sin ver / Escrituras / Mnemotecnia)
  const vwordToggleBlind = document.getElementById('vword-toggle-blind');
  const vwordToggleScripts = document.getElementById('vword-toggle-scripts');
  const vwordToggleMnemonic = document.getElementById('vword-toggle-mnemonic');

  vwordToggleBlind?.addEventListener('click', () => {
    const isNowActive = !vwordToggleBlind.classList.contains('active');
    vwordToggleBlind.classList.toggle('active', isNowActive);
    vwordToggleBlind.setAttribute('aria-pressed', String(isNowActive));
    vwordStage?.classList.toggle('blind-study-active', isNowActive);
    allVwordCards.forEach((c) => c.classList.remove('answer-revealed'));
  });

  vwordToggleScripts?.addEventListener('click', () => {
    const isNowActive = !vwordToggleScripts.classList.contains('active');
    vwordToggleScripts.classList.toggle('active', isNowActive);
    vwordToggleScripts.setAttribute('aria-pressed', String(isNowActive));
    vwordStage?.classList.toggle('hide-scripts-panel', !isNowActive);
  });

  vwordToggleMnemonic?.addEventListener('click', () => {
    const isNowActive = !vwordToggleMnemonic.classList.contains('active');
    vwordToggleMnemonic.classList.toggle('active', isNowActive);
    vwordToggleMnemonic.setAttribute('aria-pressed', String(isNowActive));
    vwordStage?.classList.toggle('hide-mnemonic-panel', !isNowActive);
  });

  document.querySelectorAll<HTMLButtonElement>('.reveal-answer-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.full-study-card');
      card?.classList.add('answer-revealed');
      const audioBtn = card?.querySelector<HTMLButtonElement>('.v-audio-btn.primary');
      if (audioBtn?.dataset.speakWord) {
        speakJapanese(audioBtn.dataset.speakWord, 0.95);
      }
    });
  });

  document.querySelectorAll<HTMLButtonElement>('.v-audio-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const word = btn.dataset.speakWord || '';
      const rate = parseFloat(btn.dataset.speakRate || '0.95');
      speakJapanese(word, rate);
    });
  });

  // 9. PROGRESSIVE DISCOVERY & ORDERED NAVIGATION CONTROLLER (Material 3 Hub <-> Workspace)
  const hubView = document.getElementById('hub-view');
  const workspaceView = document.getElementById('workspace-view');
  const backToHubBtn = document.getElementById('back-to-hub-btn');
  const navHomeLogo = document.getElementById('nav-home-logo');
  const footerBackHub = document.getElementById('footer-back-hub');
  const nextStepActionBtn = document.getElementById('next-step-action-btn');
  const subTabsHablar = document.getElementById('sub-tabs-hablar');
  const subTabsEscritura = document.getElementById('sub-tabs-escritura');
  const subTabsPractica = document.getElementById('sub-tabs-practica');

  type CategoryId = 'hablar' | 'escritura' | 'practica';
  type ActivityId =
    | 'builder'
    | 'visual-words'
    | 'vocab'
    | 'kana-table'
    | 'dojo'
    | 'simulator'
    | 'minigame';

  const ACTIVITY_ORDER: {
    activity: ActivityId;
    category: CategoryId;
    nextLabel: string;
    nextCategory?: CategoryId;
    nextActivity?: ActivityId;
  }[] = [
    {
      activity: 'builder',
      category: 'hablar',
      nextLabel: 'Siguiente: Palabras Comunes Ilustradas →',
      nextCategory: 'hablar',
      nextActivity: 'visual-words',
    },
    {
      activity: 'visual-words',
      category: 'hablar',
      nextLabel: 'Siguiente: Expresiones y Melodía →',
      nextCategory: 'hablar',
      nextActivity: 'vocab',
    },
    {
      activity: 'vocab',
      category: 'hablar',
      nextLabel: 'Paso 2: Tabla Hiragana · Katakana · Romaji →',
      nextCategory: 'escritura',
      nextActivity: 'kana-table',
    },
    {
      activity: 'kana-table',
      category: 'escritura',
      nextLabel: 'Siguiente: Caligrafía y Carteles →',
      nextCategory: 'escritura',
      nextActivity: 'dojo',
    },
    {
      activity: 'dojo',
      category: 'escritura',
      nextLabel: 'Paso 3: Simulador de Viaje →',
      nextCategory: 'practica',
      nextActivity: 'simulator',
    },
    {
      activity: 'simulator',
      category: 'practica',
      nextLabel: 'Siguiente: Reto Expreso Yamanote →',
      nextCategory: 'practica',
      nextActivity: 'minigame',
    },
    {
      activity: 'minigame',
      category: 'practica',
      nextLabel: '✓ Volver al menú de inicio',
    },
  ];

  let currentActivity: ActivityId = 'builder';

  // MENÚ HAMBURGUESA (cajón lateral)
  const navDrawer = document.getElementById('nav-drawer');
  const drawerScrim = document.getElementById('nav-drawer-scrim');
  const hamburgerBtn = document.getElementById('hamburger-btn');

  function openDrawer() {
    navDrawer?.classList.add('open');
    navDrawer?.setAttribute('aria-hidden', 'false');
    if (drawerScrim) drawerScrim.hidden = false;
    hamburgerBtn?.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    navDrawer?.classList.remove('open');
    navDrawer?.setAttribute('aria-hidden', 'true');
    if (drawerScrim) drawerScrim.hidden = true;
    hamburgerBtn?.setAttribute('aria-expanded', 'false');
  }

  hamburgerBtn?.addEventListener('click', () => {
    if (navDrawer?.classList.contains('open')) closeDrawer();
    else openDrawer();
  });
  drawerScrim?.addEventListener('click', closeDrawer);
  document.getElementById('drawer-close-btn')?.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });
  document.getElementById('drawer-home-btn')?.addEventListener('click', () => {
    closeDrawer();
    showHub();
  });
  document.getElementById('drawer-progress-btn')?.addEventListener('click', () => {
    closeDrawer();
    document.getElementById('open-passport-btn')?.click();
  });
  document.getElementById('drawer-theme-btn')?.addEventListener('click', () => {
    document.getElementById('theme-toggle-btn')?.click();
  });
  document.getElementById('hub-download-json-btn')?.addEventListener('click', closeDrawer);
  document.getElementById('hub-upload-json-btn')?.addEventListener('click', closeDrawer);

  function showHub() {
    if (hubView) hubView.hidden = false;
    if (workspaceView) workspaceView.hidden = true;
    if (backToHubBtn) backToHubBtn.hidden = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openWorkspace(category: CategoryId, activity?: ActivityId) {
    const resolvedActivity: ActivityId =
      activity ||
      (category === 'hablar' ? 'builder' : category === 'escritura' ? 'kana-table' : 'simulator');

    currentActivity = resolvedActivity;

    if (hubView) hubView.hidden = true;
    if (workspaceView) workspaceView.hidden = false;
    if (backToHubBtn) backToHubBtn.hidden = false;

    // Update Category Pills
    document.querySelectorAll<HTMLButtonElement>('[data-switch-category]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.switchCategory === category);
    });

    // Show/hide sub-tabs based on category
    if (subTabsHablar) subTabsHablar.hidden = category !== 'hablar';
    if (subTabsEscritura) subTabsEscritura.hidden = category !== 'escritura';
    if (subTabsPractica) subTabsPractica.hidden = category !== 'practica';

    // Update Sub-tab active state
    document.querySelectorAll<HTMLButtonElement>('[data-switch-activity]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.switchActivity === resolvedActivity);
    });

    // Migas de pan (paso actual)
    const crumb = document.getElementById('workspace-crumb');
    if (crumb) {
      crumb.textContent =
        category === 'hablar'
          ? 'Paso 1 · Hablar y vocabulario'
          : category === 'escritura'
          ? 'Paso 2 · Leer y escribir'
          : 'Paso 3 · Practicar en viaje';
    }
    closeDrawer();

    // Show only the selected activity pane
    const allPanes: Record<ActivityId, HTMLElement | null> = {
      builder: document.getElementById('pane-builder'),
      'visual-words': document.getElementById('pane-visual-words'),
      vocab: document.getElementById('pane-vocab'),
      'kana-table': document.getElementById('pane-kana-table'),
      dojo: document.getElementById('pane-dojo'),
      simulator: document.getElementById('pane-simulator'),
      minigame: document.getElementById('pane-minigame'),
    };

    (Object.keys(allPanes) as ActivityId[]).forEach((key) => {
      const pane = allPanes[key];
      if (pane) pane.hidden = key !== resolvedActivity;
    });

    // Update Next Step Footer Button
    const stepMeta = ACTIVITY_ORDER.find((s) => s.activity === resolvedActivity);
    if (nextStepActionBtn && stepMeta) {
      nextStepActionBtn.textContent = stepMeta.nextLabel;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Bind Hub cards & buttons
  document.querySelectorAll<HTMLElement>('[data-open-category]').forEach((el) => {
    el.addEventListener('click', () => {
      const cat = (el.dataset.openCategory || 'hablar') as CategoryId;
      const act = el.dataset.openActivity as ActivityId | undefined;
      openWorkspace(cat, act);
    });
  });

  // Bind Hub Grammar Level Quick-Jump Chips (Intro, Nivel 1, Nivel 2, Nivel 3)
  document.querySelectorAll<HTMLButtonElement>('[data-open-grammar-level]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lvl = (btn.dataset.openGrammarLevel || 'intro') as GrammarLevelId;
      openWorkspace('hablar', 'builder');
      switchGrammarLevel(lvl);
    });
  });

  // Bind Workspace Category Switcher
  document.querySelectorAll<HTMLButtonElement>('[data-switch-category]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = (btn.dataset.switchCategory || 'hablar') as CategoryId;
      openWorkspace(cat);
    });
  });

  // Bind Workspace Sub-activity Tabs
  document.querySelectorAll<HTMLButtonElement>('[data-switch-activity]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const act = (btn.dataset.switchActivity || 'builder') as ActivityId;
      const stepMeta = ACTIVITY_ORDER.find((s) => s.activity === act);
      if (stepMeta) {
        openWorkspace(stepMeta.category, act);
      }
    });
  });

  // Bind Back to Hub buttons
  backToHubBtn?.addEventListener('click', showHub);
  navHomeLogo?.addEventListener('click', showHub);
  footerBackHub?.addEventListener('click', showHub);

  // Bind Next Step Footer Button
  nextStepActionBtn?.addEventListener('click', () => {
    const stepMeta = ACTIVITY_ORDER.find((s) => s.activity === currentActivity);
    if (stepMeta?.nextCategory && stepMeta?.nextActivity) {
      openWorkspace(stepMeta.nextCategory, stepMeta.nextActivity);
    } else {
      showHub();
    }
  });

  // Bind Micro-hook audio on Hub
  document.getElementById('hero-instant-listen')?.addEventListener('click', () => {
    speakJapanese('すみません', 0.92);
  });

  // Botón en el Hub para ir directo a repasar lo que el usuario necesita fortalecer según el JSON
  document.getElementById('hub-practice-weak-btn')?.addEventListener('click', () => {
    const statsList = Object.values(state.itemStats || {});
    const weakVwords = statsList.filter((s) => s.type === 'vword' && s.level === 'fortalecer');
    const weakVocab = statsList.filter((s) => s.type === 'vocab' && s.level === 'fortalecer');
    const weakKana = statsList.filter((s) => s.type === 'kana' && s.level === 'fortalecer');

    if (weakVwords.length > 0) {
      openWorkspace('hablar', 'visual-words');
      const weakBtn = document.querySelector<HTMLButtonElement>('.v-cat-btn[data-vcat="fortalecer"]');
      weakBtn?.click();
      showToast(`Repasando ${weakVwords.length} palabras por fortalecer`, '🎯');
    } else if (weakVocab.length > 0) {
      openWorkspace('hablar', 'vocab');
      const weakTab = document.querySelector<HTMLButtonElement>('.cat-tab[data-category-filter="fortalecer"]');
      weakTab?.click();
      showToast(`Repasando ${weakVocab.length} expresiones por fortalecer`, '🎯');
    } else if (weakKana.length > 0) {
      openWorkspace('escritura', 'kana-table');
      document.getElementById('kana-audio-quiz-btn')?.click();
      showToast(`Repasando ${weakKana.length} letras Kana por fortalecer en el Reto del Oído`, '🎯');
    } else {
      openWorkspace('hablar', 'visual-words');
      showToast('Aún no tienes elementos marcados por fortalecer. ¡Marca con 🎯 mientras estudias!', '💡');
    }
  });

  // Cargar y sincronizar el JSON de la carpeta genérica (/storage/user-progress.json) al arrancar
  syncFromServerJson();
}

