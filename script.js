const inputTextEl = document.getElementById('inputText');
const refineBtn   = document.getElementById('refineButton');
const clearBtn    = document.getElementById('clearButton');
const outputList  = document.getElementById('outputSentences');
const noMsg       = document.getElementById('noSentencesMessage');

refineBtn.addEventListener('click', () => {
    // clear previous output
    outputList.innerHTML = '';
    noMsg.style.display = 'none';

    const raw = inputTextEl.value;
    if (!raw.trim()) {
        noMsg.textContent = 'Please paste some text first.';
        noMsg.style.display = 'block';
        return;
    }

    // 1. CLEAN: keep only Sinhala letters (U+0D80–U+0DFF), spaces, . , and ።
    const cleanedText = raw
        .replace(/[^\u0D80-\u0DFF\s\.,።]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    // 2. EXTRACT sentences, preserving their trailing . or ።
    //    Matches one or more non-(. or ።), then optionally a . or ።
    const rawSentences = cleanedText.match(/[^።\.]+[።\.]?/g) || [];
    const sentences = rawSentences
        .map(s => s.trim())
        .filter(s => s.length > 0);

    if (sentences.length === 0) {
        noMsg.textContent = 'No sentences found or processed.';
        noMsg.style.display = 'block';
        return;
    }

    // 3. SCORE by word-count (naïve split on spaces)
    const scored = sentences.map(text => ({
        text,
        impact: text.split(/\s+/).filter(w => w).length
    }));

    // 4. SORT ascending (least words → least “impact”)
    scored.sort((a, b) => a.impact - b.impact);
    const top10 = scored.slice(0, 10);

    // 5. RENDER, with punctuation intact
    top10.forEach(({ text, impact }) => {
        const li = document.createElement('li');
        li.textContent = `${text} (Words: ${impact})`;
        outputList.appendChild(li);
    });
});

clearBtn.addEventListener('click', () => {
    inputTextEl.value = '';
    outputList.innerHTML = '';
    noMsg.style.display = 'none';
    inputTextEl.focus();
});
