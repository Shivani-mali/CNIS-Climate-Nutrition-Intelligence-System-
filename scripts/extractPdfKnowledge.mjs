/**
 * PDF Knowledge Extraction Script for RAG
 * Run: node scripts/extractPdfKnowledge.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOWNLOADS = 'C:\\Users\\omkar\\Downloads';
const PDF_OF_RAG = path.join(DOWNLOADS, 'pdf_of_rag');

const PDF_FILES = [
    path.join(DOWNLOADS, 'DATASET UNCEF dataset1.pdf'),
    path.join(DOWNLOADS, 'UNICEFnutrition report dataset2.pdf'),
    path.join(DOWNLOADS, 'WHOguidelines dataset3.pdf'),
    path.join(DOWNLOADS, 'ICMR dataset4.pdf'),
    path.join(DOWNLOADS, 'DietaryGuidelinesforNINwebsite dataset5.pdf'),
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

async function extractText(filePath) {
    const data = new Uint8Array(fs.readFileSync(filePath));
    const doc = await getDocument({ data, useSystemFonts: true }).promise;
    let fullText = '';
    for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
    }
    return fullText;
}

function chunkText(text, maxSize = 500) {
    const chunks = [];
    const cleaned = text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').replace(/\s{2,}/g, ' ').trim();
    if (!cleaned) return chunks;

    const paragraphs = cleaned.split(/\n\n+/);
    let current = '';

    for (const para of paragraphs) {
        const t = para.trim();
        if (!t) continue;
        if (current && (current.length + t.length) > maxSize) {
            if (current.trim().length > 30) chunks.push(current.trim());
            current = t;
        } else {
            current += (current ? '\n\n' : '') + t;
        }
        if (current.length > maxSize) {
            const sentences = current.split(/(?<=[.।!?])\s+/);
            current = '';
            for (const s of sentences) {
                if (current && (current.length + s.length) > maxSize) {
                    if (current.trim().length > 30) chunks.push(current.trim());
                    current = s;
                } else {
                    current += (current ? ' ' : '') + s;
                }
            }
        }
    }
    if (current.trim().length > 30) chunks.push(current.trim());
    return chunks;
}

function getSource(filename) {
    const n = filename.toLowerCase();
    if (n.includes('uncef') || n.includes('unicef')) return 'UNICEF';
    if (n.includes('who')) return 'WHO Guidelines';
    if (n.includes('icmr')) return 'ICMR';
    if (n.includes('dietary') || n.includes('nin')) return 'NIN Dietary Guidelines';
    if (n.includes('ragdelhi')) return 'Delhi Health Data';
    return 'Health Document';
}

async function main() {
    console.log('🚀 Extracting PDFs for RAG...\n');
    const allChunks = [];
    let ok = 0, failed = [];

    for (const pdfPath of PDF_FILES) {
        const filename = path.basename(pdfPath);
        process.stdout.write(`📄 ${filename}... `);
        try {
            if (!fs.existsSync(pdfPath)) { console.log('⚠️ NOT FOUND'); failed.push(filename); continue; }
            const text = await extractText(pdfPath);
            if (text.trim().length < 50) { console.log('⚠️ EMPTY'); failed.push(filename); continue; }
            const source = getSource(filename);
            const chunks = chunkText(text);
            chunks.forEach((c, i) => allChunks.push({
                id: `${filename.replace(/[^a-zA-Z0-9]/g, '_')}_${i}`,
                text: c, source, file: filename, chunkIndex: i
            }));
            ok++;
            console.log(`✅ ${chunks.length} chunks`);
        } catch (err) {
            console.log(`❌ ${err.message.substring(0, 50)}`);
            failed.push(filename);
        }
    }

    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const output = {
        version: '1.0',
        generatedAt: new Date().toISOString(),
        totalChunks: allChunks.length,
        totalFiles: ok,
        sources: [...new Set(allChunks.map(c => c.source))],
        chunks: allChunks
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');

    console.log(`\n✅ ${allChunks.length} chunks from ${ok} PDFs → ${OUTPUT_FILE}`);
    console.log(`📊 ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1)} KB`);
    if (failed.length) console.log(`⚠️ Failed: ${failed.join(', ')}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
