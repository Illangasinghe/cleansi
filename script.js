const inputTextEl = document.getElementById('inputText');
const refineBtn   = document.getElementById('refineButton');
const clearBtn    = document.getElementById('clearButton');
const outputList  = document.getElementById('outputSentences');
const noMsg       = document.getElementById('noSentencesMessage');

refineBtn.addEventListener('click', () => {
    outputList.innerHTML = '';
    noMsg.style.display = 'none';

    const raw = inputTextEl.value;
    if (!raw.trim()) {
        noMsg.textContent = 'Please paste some text first.';
        noMsg.style.display = 'block';
        return;
    }

    // 1. Cleanse the text – now preserves . and ,
    const cleanedText = raw
        // remove English letters, quotes, exclamation, digits, other symbols—but keep . and ,
        .replace(/["'“‘”’!`~@#$%^&*()_+\-=\[\]{};:\\|<>\/?a-zA-Z0-9]+/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    // 2. Split into sentences on Sinhala Kundaliya or period
    const sentences = cleanedText
        .split(/[።.]+/)
        .map(s => s.trim())
        .filter(s => s.length > 0);

    if (sentences.length === 0) {
        noMsg.textContent = 'No sentences found or processed.';
        noMsg.style.display = 'block';
        return;
    }

    // 3. Score by word-count
    const scored = sentences.map(text => ({
        text,
        impact: text.split(/\s+/).filter(w => w).length
    }));

    // 4. Sort & pick top 10 least impactful
    scored.sort((a, b) => a.impact - b.impact);
    const top10 = scored.slice(0, 10);

    // 5. Render
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
