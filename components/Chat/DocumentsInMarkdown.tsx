import React, { useState, useRef, useEffect} from 'react';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';
import { MemoizedReactMarkdown } from '../Markdown/MemoizedReactMarkdown';
import { Document } from 'langchain/document';
import { IconArrowDown } from '@tabler/icons-react';

interface DocumentItemProps {
  document: Document;
}

interface DocumentsInMarkdownProps {
  documents: Document[];
}

const DocumentItem: React.FC<DocumentItemProps> = ({ document }) => {
  const metadataTable = `| Key | Value |\n|-----|-------|\n${Object.entries(document.metadata)
    .map(([key, value]) => `| ${key} | ${value} |\n`)
    .join('')}`;

  return (
    <div className="prose dark:prose-invert">
      <MemoizedReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeMathjax]}
      >
        {metadataTable}
      </MemoizedReactMarkdown>
      <MemoizedReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeMathjax]}
      >
        {document.pageContent.toString()}
      </MemoizedReactMarkdown>
    </div>
  );
};

export const DocumentsInMarkdown: React.FC<DocumentsInMarkdownProps> = ({
    documents,
  }) => {
    const documentsContainerRef = useRef<HTMLDivElement>(null);
    const [selectedDocumentIndex, setSelectedDocumentIndex] = useState(0);
    const [showScrollDownButton, setShowScrollDownButton] = useState<boolean>(false);

  
    const handleDocumentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedDocumentIndex(parseInt(event.target.value));
    };

    const handleScroll = () => {
        if (documentsContainerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = documentsContainerRef.current;
          const bottomTolerance = 30;
      
          if (scrollTop + clientHeight < scrollHeight - bottomTolerance) {
            if (!showScrollDownButton) {
              setShowScrollDownButton(true);
            }
          } else {
            if (showScrollDownButton) {
              setShowScrollDownButton(false);
            }
          }
        }
      };
      
      

    const handleScrollDown = () => {
        documentsContainerRef.current?.scrollTo({
          top: documentsContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      };

      useEffect(() => {
        const containerElement = documentsContainerRef.current;
        if (containerElement) {
          containerElement.addEventListener('scroll', handleScroll);
        }
        return () => {
          if (containerElement) {
            containerElement.removeEventListener('scroll', handleScroll);
          }
        };
      }, []);
      
        return (
            <div className="relative flex-1 overflow-hidden bg-white dark:bg-[#343541]">
              <div className="max-h-full overflow-x-hidden overflow-y-auto" ref={documentsContainerRef}>
              <div className="p-4 space-y-4">
        <div className="flex items-center mb-4">
          <label htmlFor="document-select" className="mr-2">
            Select a document:
          </label>
          <div className="relative inline-flex">
            <select
              id="document-select"
              value={selectedDocumentIndex}
              onChange={handleDocumentChange}
              className="w-full py-2 pl-3 pr-10 text-base font-semibold border border-gray-300 rounded-lg text-neutral-900 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-200 focus:border-blue-500 focus:outline-none appearance-none"
            >
              {documents.map((document, index) => (
                <option key={index} value={index}>
                  {document.metadata.file_name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400 dark:text-neutral-600"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
              >
                <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
          </div>
        </div>
        <hr />
        {documents[selectedDocumentIndex] && (
          <DocumentItem document={documents[selectedDocumentIndex]} />
        )}
      </div>

              </div>
              {showScrollDownButton && (
                <div className="absolute bottom-0 right-0 mb-4 mr-4 pb-20">
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-300 text-gray-800 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-neutral-200"
                    onClick={handleScrollDown}
                  >
                    <IconArrowDown size={18} />
                  </button>
                </div>
              )}
            </div>
          );
        };
  
