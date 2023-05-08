import React, { useState } from 'react';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';
import { MemoizedReactMarkdown } from '../Markdown/MemoizedReactMarkdown';
import { Document } from 'langchain/document';
interface DocumentItemProps {
    document: Document;
}
interface DocumentsInMarkdownProps {
    documents: Document[];
}

// Add this new component to your existing file
const DocumentItem: React.FC<DocumentItemProps> = ({ document }) => {
    const [showContent, setShowContent] = useState(false);

    const toggleContent = () => {
        setShowContent(!showContent);
    };

    return (
        <div className="prose dark:prose-invert">
            <h3 onClick={toggleContent} className="cursor-pointer">
                {document.metadata.file_name}
            </h3>
            {showContent && (
                <>
                    <MemoizedReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeMathjax]}
                    >
                        {JSON.stringify(document.metadata)}
                    </MemoizedReactMarkdown>
                    <MemoizedReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeMathjax]}
                    >
                        {document.pageContent.toString()}
                    </MemoizedReactMarkdown>
                </>
            )}
        </div>
    );
};


// Update the DocumentsInMarkdown component
export const DocumentsInMarkdown: React.FC<DocumentsInMarkdownProps> = ({
    documents,
}) => {
    return (
        <div className="p-4 space-y-4">
            {documents.map((document, id) => {
                console.log('document.pageContent', document.pageContent);
                return <DocumentItem key={id} document={document} />
            })}
        </div>
    );
};
