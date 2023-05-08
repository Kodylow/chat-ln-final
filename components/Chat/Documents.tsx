
import { throttle } from '@/utils';
import { useTranslation } from 'next-i18next';
import {
  FC,
  MutableRefObject,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { DocumentsInMarkdown } from './DocumentsInMarkdown';
import { Document } from 'langchain/document';

interface Props {
  documents: Document[];
}

export const Documents: FC<Props> = memo(
  ({
    documents,
  }) => {

    return (
      <div className="relative flex-1 overflow-hidden bg-white dark:bg-[#343541]">
        <DocumentsInMarkdown documents={documents}/>
      </div>
    );
  },
);
Documents.displayName = 'Chat';
