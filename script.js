document.getElementById('refineButton').addEventListener('click', () => {
    const inputText = document.getElementById('inputText').value;
    const outputList = document.getElementById('outputSentences');
    const noSentencesMessage = document.getElementById('noSentencesMessage');

    outputList.innerHTML = ''; // Clear previous results
    noSentencesMessage.style.display = 'none';

    // 1. Cleanse the text
    // Remove English alphabet characters, quotes (", '), and exclamation marks (!)
    // Preserve Sinhala specific sentence enders like Kundaliya (۔ or ။)
    // For this example, we'll explicitly keep '።' and '.' if they are used for Sinhala sentence ending.
    // We'll remove a-z, A-Z, common quotes and exclamation marks.
    const cleanedText = inputText.replace(/["'“‘”’!`~@#$%^&*()_+\-=\[\]{};:\\|,.<>\/?a-zA-Z0-9]+/g, (match) => {
        // Keep specific Sinhala punctuation if needed, otherwise remove
        // This regex is broad for English chars and many symbols.
        // If there's specific English punctuation to keep, refine this.
        // For now, it removes most non-Sinhala characters and non-sentence-ending punctuation.
        return '';
    }).replace(/\s+/g, ' ').trim(); // Replace multiple spaces with a single space


    // 2. Break into sentences
    // Sinhala sentences often end with '።' (Kundaliya) or a period '.'.
    // We will split by these. If neither is used consistently, this might need adjustment.
    // We also filter out any empty strings that might result from splitting.
    const sentences = cleanedText.split(/[።.]+/).filter(sentence => sentence.trim().length > 0);

    if (sentences.length === 0) {
        noSentencesMessage.style.display = 'block';
        return;
    }

    // 3. Analyze sentences (Impact based on word count - fewer words = less impact)
    const analyzedSentences = sentences.map(sentence => {
        const trimmedSentence = sentence.trim();
        // Simple word count: split by space. This might not be perfect for all Sinhala text
        // depending on how words are typically spaced, but it's a basic approach.
        const wordCount = trimmedSentence.split(/\s+/).filter(word => word.length > 0).length;
        return {
            text: trimmedSentence,
            impactScore: wordCount // Lower score = less impact
        };
    });

    // 4. Sort sentences by impact (ascending - least impact first)
    analyzedSentences.sort((a, b) => a.impactScore - b.impactScore);

    // 5. Display the top 10 least impactful sentences
    const top10LeastImpactful = analyzedSentences.slice(0, 10);

    if (top10LeastImpactful.length === 0 && sentences.length > 0) {
        // This case might occur if all sentences were filtered out after cleaning,
        // or if the cleaning/splitting logic resulted in no valid sentences for ranking.
        const li = document.createElement('li');
        li.textContent = "Could not determine impactful sentences from the provided text after cleaning.";
        outputList.appendChild(li);
    } else if (top10LeastImpactful.length === 0) {
        noSentencesMessage.style.display = 'block';
    }
    else {
        top10LeastImpactful.forEach(sentence => {
            const li = document.createElement('li');
            li.textContent = `${sentence.text} (Words: ${sentence.impactScore})`;
            outputList.appendChild(li);
        });
    }
});
