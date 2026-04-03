/**
 * Splits text into optimized chunks for vector embeddings.
 * Basic chunking by paragraph/sentence, accumulating up to the chunk size.
 * 
 * @param {string} text - Raw extracted text
 * @param {number} chunkSize - Maximum size of each chunk (characters)
 * @param {number} chunkOverlap - Overlap between consecutive chunks (characters)
 * @returns {Array<string>} - Array of text chunks
 */
export const chunkText = (text, chunkSize = 1000, chunkOverlap = 200) => {
    if (!text) return [];

    // Normalize spacing and newlines
    let normalizedText = text.replace(/(\r\n|\n|\r)/gm, " ");
    normalizedText = normalizedText.replace(/\s+/g, " ").trim();

    // Split sentences using regex
    const sentences = normalizedText.match(/[^.!?]+[.!?]+/g) || [normalizedText];
    
    let chunks = [];
    let currentChunk = "";

    for (let i = 0; i < sentences.length; i++) {
        let sentence = sentences[i].trim();
        if (!sentence) continue;

        // If a single sentence is larger than chunkSize, we might need to break it further 
        // (For simplicity, we'll just add it as a forced chunk here)
        if (sentence.length > chunkSize) {
            if (currentChunk.length > 0) {
                chunks.push(currentChunk.trim());
                currentChunk = "";
            }
            // Add oversized sentence as its own chunk
            chunks.push(sentence);
            continue;
        }

        // If adding the sentence exceeds chunkSize, finalize the current chunk
        if ((currentChunk.length + sentence.length) > chunkSize && currentChunk.length > 0) {
            chunks.push(currentChunk.trim());
            
            // Create overlap: take the last few sentences of the currentChunk
            let overlapText = "";
            // simple overlap strategy: take last X characters, but snap to nearest word
            // A more robust overlap logic involves keeping a sliding window of sentences
            currentChunk = currentChunk.slice(-chunkOverlap); 
            // snap to the first space to avoid partial words
            const firstSpace = currentChunk.indexOf(' ');
            if (firstSpace !== -1) {
                currentChunk = currentChunk.substring(firstSpace + 1);
            }
        }

        currentChunk = currentChunk ? `${currentChunk} ${sentence}` : sentence;
    }

    if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
};
