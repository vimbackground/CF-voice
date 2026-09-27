export function escapeXmlText(text) {
    return text
        .replace(/&/g, '&amp;')   // 必须首先处理 &
        .replace(/</g, '&lt;')    // 处理 <
        .replace(/>/g, '&gt;')    // 处理 >
        .replace(/"/g, '&quot;')  // 处理 "
        .replace(/'/g, '&apos;'); // 处理 '
}

// 优化文本分块函数
export function optimizedTextSplit(text, maxChunkSize = 1500) {
    const chunks = [];
    const sentences = text.split(/[。！？\n]/);
    let currentChunk = '';
    
    for (const sentence of sentences) {
        const trimmedSentence = sentence.trim();
        if (!trimmedSentence) continue;
        
        // 如果单个句子就超过最大长度，按字符分割
        if (trimmedSentence.length > maxChunkSize) {
            if (currentChunk) {
                chunks.push(currentChunk.trim());
                currentChunk = '';
            }
            
            // 按字符分割长句子
            for (let i = 0; i < trimmedSentence.length; i += maxChunkSize) {
                chunks.push(trimmedSentence.slice(i, i + maxChunkSize));
            }
            continue;
        }
        
        // 尝试将当前句子添加到当前块
        const potentialChunk = currentChunk ? `${currentChunk}。${trimmedSentence}` : trimmedSentence;
        
        if (potentialChunk.length <= maxChunkSize) {
            currentChunk = potentialChunk;
        } else {
            // 当前块已满，保存并开始新块
            if (currentChunk) {
                chunks.push(currentChunk.trim() + '。');
            }
            currentChunk = trimmedSentence;
        }
    }
    
    // 添加最后一个块
    if (currentChunk) {
        chunks.push(currentChunk.trim() + (currentChunk.endsWith('。') ? '' : '。'));
    }
    
    return chunks;
}
