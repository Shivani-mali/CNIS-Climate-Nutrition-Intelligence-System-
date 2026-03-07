/**
 * PDF Knowledge Extraction Script for RAG
 * Uses pdfjs-dist to extract text from PDFs
 * Run: node scripts/extractPdfKnowledge.cjs
 */

const fs = require('fs');
const path = require('path');

// PDF source directories and files
const DOWNLOADS = 'C:\\Users\\omkar\\Downloads';
const PDF_OF_RAG = path.join(DOWNLOADS, 'pdf_of_rag');

const PDF_FILES = [
    // Dataset PDFs
    path.join(DOWNLOADS, 'DATASET UNCEF dataset1.pdf'),
    path.join(DOWNLOADS, 'UNICEFnutrition report dataset2.pdf'),
    path.join(DOWNLOADS, 'WHOguidelines dataset3.pdf'),
    path.join(DOWNLOADS, 'ICMR dataset4.pdf'),
    path.join(DOWNLOADS, 'DietaryGuidelinesforNINwebsite dataset5.pdf'),
    // RAG Delhi PDFs
    path.join(PDF_OF_RAG, 'ragdelhi.pdf'),
    path.join(PDF_OF_RAG, 'ragdelhi 2.pdf'),
    path.join(PDF_OF_RAG, 'ragdelhi2.pdf'),
    path.join(PDF_OF_RAG, 'ragdelhi3.pdf'),
    path.join(PDF_OF_RAG, 'ragdelhi4.pdf'),
    path.join(PDF_OF_RAG, 'ragdelhi5.pdf'),
    path.join(PDF_OF_RAG, 'ragdelhi7.pdf'),
    path.join(PDF_OF_RAG, 'ragdelhi8.pdf'),
    path.join(PDF_OF_RAG, 'ragdelhi9.pdf'),
    path.join(PDF_OF_RAG, 'ragdelhi10.pdf'),
    path.join(PDF_OF_RAG, 'ragdelhi11.pdf'),
    path.join(PDF_OF_RAG, 'ragdelhi12.pdf'),
    path.join(PDF_OF_RAG, 'ragdelhi13.pdf'),
    path.join(PDF_OF_RAG, 'ragdelhi14.pdf'),
    path.join(PDF_OF_RAG, 'ragdelhi16.pdf'),
    path.join(PDF_OF_RAG, 'ragdelhi17.pdf'),
];

const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'ragKnowledgeBase.json');

/**
 * Extract text from a PDF using pdfjs-dist
 */
async function extractTextFromPdf(filePath) {
    const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.mjs');

    const data = new Uint8Array(fs.readFileSync(filePath));
    const doc = await pdfjsLib.getDocument({ data }).promise;

    let fullText = '';
    for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
    }
    return fullText;
}

/**
 * Split text into chunks of ~500 characters, breaking at sentence boundaries
 */
function chunkText(text, maxChunkSize = 500) {
    const chunks = [];
    const cleaned = text
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/\s{2,}/g, ' ')
        .trim();

    if (!cleaned) return chunks;

    const paragraphs = cleaned.split(/\n\n+/);
    let currentChunk = '';

    for (const para of paragraphs) {
        const trimmedPara = para.trim();
        if (!trimmedPara) continue;

        if (currentChunk && (currentChunk.length + trimmedPara.length) > maxChunkSize) {
            if (currentChunk.trim().length > 30) {
                chunks.push(currentChunk.trim());
            }
            currentChunk = trimmedPara;
        } else {
            currentChunk += (currentChunk ? '\n\n' : '') + trimmedPara;
        }

        if (currentChunk.length > maxChunkSize) {
            const sentences = currentChunk.split(/(?<=[.।!?])\s+/);
            currentChunk = '';
            for (const sentence of sentences) {
                if (currentChunk && (currentChunk.length + sentence.length) > maxChunkSize) {
                    if (currentChunk.trim().length > 30) {
                        chunks.push(currentChunk.trim());
                    }
                    currentChunk = sentence;
                } else {
                    currentChunk += (currentChunk ? ' ' : '') + sentence;
                }
            }
        }
    }

    if (currentChunk.trim().length > 30) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}

function getSourceLabel(filename) {
    const name = path.basename(filename, '.pdf').toLowerCase();
    if (name.includes('uncef') || name.includes('unicef')) return 'UNICEF';
    if (name.includes('who')) return 'WHO Guidelines';
    if (name.includes('icmr')) return 'ICMR';
    if (name.includes('dietary') || name.includes('nin')) return 'NIN Dietary Guidelines';
    if (name.includes('ragdelhi')) return 'RAG Delhi Health Data';
    return 'Health Document';
}

async function extractAll() {
    console.log('🚀 Starting PDF extraction for RAG knowledge base...\n');
    const allChunks = [];
    let processedFiles = 0;
    let failedFiles = [];

    for (const pdfPath of PDF_FILES) {
        const filename = path.basename(pdfPath);
        process.stdout.write(`📄 Processing: ${filename}... `);

        try {
            if (!fs.existsSync(pdfPath)) {
                console.log('⚠️ NOT FOUND');
                failedFiles.push({ file: filename, reason: 'not found' });
                continue;
            }

            const text = await extractTextFromPdf(pdfPath);

            if (text.trim().length < 50) {
                console.log('⚠️ TOO SHORT');
                failedFiles.push({ file: filename, reason: 'too short' });
                continue;
            }

            const source = getSourceLabel(filename);
            const chunks = chunkText(text);

            for (let i = 0; i < chunks.length; i++) {
                allChunks.push({
                    id: `${filename.replace(/[^a-zA-Z0-9]/g, '_')}_${i}`,
                    text: chunks[i],
                    source: source,
                    file: filename,
                    chunkIndex: i
                });
            }

            processedFiles++;
            console.log(`✅ ${chunks.length} chunks (${text.length} chars)`);
        } catch (err) {
            console.log(`❌ ${err.message.substring(0, 60)}`);
            failedFiles.push({ file: filename, reason: err.message });
        }
    }

    // Save to JSON
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const output = {
        version: '1.0',
        generatedAt: new Date().toISOString(),
        totalChunks: allChunks.length,
        totalFiles: processedFiles,
        sources: [...new Set(allChunks.map(c => c.source))],
        chunks: allChunks
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Done! ${allChunks.length} chunks from ${processedFiles} PDFs`);
    console.log(`📁 Saved: ${OUTPUT_FILE}`);
    console.log(`📊 Size: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1)} KB`);
    if (failedFiles.length > 0) {
        console.log(`⚠️ ${failedFiles.length} failed:`);
        failedFiles.forEach(f => console.log(`   - ${f.file}: ${f.reason}`));
    }
}

extractAll().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
