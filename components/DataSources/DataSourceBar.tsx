import { IconMistOff, IconPlus } from '@tabler/icons-react';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from '../Sidebar/Search';
import { DataSourceSettings } from './DataSourceSettings';
import { DataSources } from './DataSources';
import { DataSource } from '@/types/dataSource';

interface Props {
  dataSources: DataSource[];
  onCreateDataSource: () => void;
  onUpdateDataSource: (dataSource: DataSource) => void;
  onDeleteDataSource: (dataSource: DataSource) => void;
}

export const DataSourceBar: FC<Props> = ({
  dataSources,
  onCreateDataSource,
  onUpdateDataSource,
  onDeleteDataSource,
}) => {
  const { t } = useTranslation('datasourcebar');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredDataSources, setFilteredDataSources] =
    useState<DataSource[]>(dataSources);

  const handleUpdateDataSource = (dataSource: DataSource) => {
    onUpdateDataSource(dataSource);
    setSearchTerm('');
  };

  const handleDeleteDataSource = (dataSource: DataSource) => {
    onDeleteDataSource(dataSource);
    setSearchTerm('');
  };

  const handleDrop = (e: any) => {
    if (e.dataTransfer) {
      const dataSource = JSON.parse(e.dataTransfer.getData('dataSource'));

      const updatedDataSource = {
        ...dataSource,
      };

      onUpdateDataSource(updatedDataSource);

      e.target.style.background = 'none';
    }
  };

  const allowDrop = (e: any) => {
    e.preventDefault();
  };

  const highlightDrop = (e: any) => {
    e.target.style.background = '#343541';
  };

  const removeHighlight = (e: any) => {
    e.target.style.background = 'none';
  };

  useEffect(() => {
    if (searchTerm) {
      setFilteredDataSources(
        dataSources.filter((dataSource) => {
          const searchable =
            dataSource.name.toLowerCase() +
            ' ' +
            dataSource.description.toLowerCase() +
            ' ' +
            dataSource.content.toLowerCase();
          return searchable.includes(searchTerm.toLowerCase());
        }),
      );
    } else {
      setFilteredDataSources(dataSources);
    }
  }, [searchTerm, dataSources]);

  return (
    <div
      className={`fixed top-0 right-0 z-50 flex h-4/6 w-[260px] flex-none flex-col space-y-2 bg-[#202123] p-2 text-[14px] transition-all sm:relative sm:top-0`}
    >
      <div className="flex items-center">
        <button
          className="text-sidebar flex w-full flex-shrink-0 cursor-pointer select-none items-center gap-3 rounded-md border border-white/20 p-3 text-white transition-colors duration-200 hover:bg-gray-500/10"
          onClick={() => {
            onCreateDataSource();
            setSearchTerm('');
          }}
        >
          <IconPlus size={16} />
          {t('New DataSource')}
        </button>
      </div>

      {dataSources.length > 1 && (
        <Search
          placeholder={t('Search dataSources...') || ''}
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
        />
      )}

      <div className="flex-grow overflow-auto">
        {dataSources.length > 0 ? (
          <div
            className="pt-2"
            onDrop={(e) => handleDrop(e)}
            onDragOver={allowDrop}
            onDragEnter={highlightDrop}
            onDragLeave={removeHighlight}
          >
            <DataSources
              dataSources={dataSources}
              onUpdateDataSource={handleUpdateDataSource}
              onDeleteDataSource={handleDeleteDataSource}
            />
          </div>
        ) : (
          <div className="mt-8 select-none text-center text-white opacity-50">
            <IconMistOff className="mx-auto mb-3" />
            <span className="text-[14px] leading-normal">
              {t('No DataSources.')}
            </span>
          </div>
        )}
      </div>

      <DataSourceSettings />
    </div>
  );
};
