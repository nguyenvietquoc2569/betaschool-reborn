import { pdfjs } from 'react-pdf';
import { Document, Page } from 'react-pdf';
import { KDButton } from '@betaschool-reborn/vital-test/lit-components'
import { useState } from 'react';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export const PdfViewer = ({ pdfUrl }: {pdfUrl: string}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: {numPages: number}) => {
    setNumPages(numPages);
    setPageNumber(1);
  }
  return <div>
      <KDButton onClick={() => window.open(pdfUrl, "_blank")} href='javascript:void(0)' >
        Download PDF to view or print
      </KDButton>
      <br></br>
      <br></br>
    <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
      {
        numPages > 0 && Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} renderTextLayer={false} renderAnnotationLayer={false}/>
        ))
      }
    </Document>
  </div>
}
