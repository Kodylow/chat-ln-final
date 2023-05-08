
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
        <DocumentsInMarkdown documents={documents}/>
    );
  },
);
Documents.displayName = 'Chat';
