const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

async function splitPdf() {
  const inputPath = path.join(__dirname, '..', 'public', 'hatshepsut-novel.pdf');
  const outputDir = path.join(__dirname, '..', 'public', 'books', 'hatshepsut-pages');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Reading source PDF from:', inputPath);
  const sourceBytes = fs.readFileSync(inputPath);
  const sourceDoc = await PDFDocument.load(sourceBytes);
  const numPages = sourceDoc.getPageCount();
  console.log(`Source document has ${numPages} pages.`);

  for (let i = 0; i < numPages; i++) {
    const newDoc = await PDFDocument.create();
    const [copiedPage] = await newDoc.copyPages(sourceDoc, [i]);
    newDoc.addPage(copiedPage);

    const pdfBytes = await newDoc.save();
    const pageNum = i + 1;
    const outputPath = path.join(outputDir, `page-${pageNum}.pdf`);
    fs.writeFileSync(outputPath, pdfBytes);
  }

  console.log(`Successfully generated ${numPages} single-page PDFs in:`, outputDir);
}

splitPdf().catch((err) => {
  console.error('Error splitting PDF:', err);
  process.exit(1);
});

