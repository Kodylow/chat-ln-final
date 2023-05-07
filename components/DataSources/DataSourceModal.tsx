import { DataSource } from '@/types/dataSource';
import { FC, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';

interface DataSourceProps {
  dataSource: DataSource;
  onClose: () => void;
  onUpdateDataSource: (dataSource: DataSource) => void;
}

export const DataSourceModal: FC<DataSourceProps> = ({
  dataSource,
  onClose,
  onUpdateDataSource,
}) => {
  const { t } = useTranslation('datasource');
  const [name, setName] = useState(dataSource.name);
  const [type, setType] = useState(dataSource.type);
  const [url, setUrl] = useState(dataSource.url);

  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleEnter = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      onUpdateDataSource({
        ...dataSource,
        name,
        type,
        url,
      });
      onClose();
    }
  };

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        window.addEventListener('mouseup', handleMouseUp);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      window.removeEventListener('mouseup', handleMouseUp);
      onClose();
    };

    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [onClose]);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const supportedTypes = [
    'Github Repo',
    'Markdown Documentation',
    'ReadTheDocs',
    'PDF',
  ];

  return (
    <div
      className="z-100 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onKeyDown={handleEnter}
    >
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          />

          <div
            ref={modalRef}
            className="dark:border-netural-400 inline-block max-h-[400px] transform overflow-hidden rounded-lg border border-gray-300 bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-[#202123] sm:my-8 sm:max-h-[600px] sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
            role="dialog"
          >
            <div className="text-sm font-bold text-black dark:text-neutral-200">
              {t('Name')}
            </div>
            <input
              ref={nameInputRef}
              className="mt-2 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100"
              placeholder={t('A name for your prompt.') || ''}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="mt-6 text-sm font-bold text-black dark:text-neutral-200">
              {t('Type')}
            </div>
            <select
              className="mt-2 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {supportedTypes.map((supportedType) => (
                <option key={supportedType} value={supportedType}>
                  {supportedType}
                </option>
              ))}
            </select>

            <div className="mt-6 text-sm font-bold text-black dark:text-neutral-200">
              {t('URL')}
            </div>
            <input
              className="mt-2 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100"
              placeholder={t('A URL for your DataSource.') || ''}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            {/* ... */}
            <button
              type="button"
              className="mt-6 w-full rounded-lg border border-neutral-500 px-4 px-4 py-2 py-2 text-neutral-900 text-neutral-900 shadow shadow hover:bg-neutral-100 hover:bg-neutral-100 focus:outline-none focus:outline dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
              onClick={() => {
                const updatedDataSource = {
                  ...dataSource,
                  name,
                  type,
                  url,
                };
                onUpdateDataSource(updatedDataSource);
                onClose();
              }}
            >
              {t('Save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
