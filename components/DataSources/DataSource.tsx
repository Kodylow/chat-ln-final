import { DataSource } from '@/types/dataSource';
import {
  IconBulbFilled,
  IconCheck,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { DragEvent, FC, useEffect, useState } from 'react';
import { DataSourceModal } from './DataSourceModal';

interface DataSourceProps {
  dataSource: DataSource;
  onUpdateDataSource: (dataSource: DataSource) => void;
  onDeleteDataSource: (dataSource: DataSource) => void;
}

export const DataSourceComponent: FC<DataSourceProps> = ({
  dataSource,
  onUpdateDataSource,
  onDeleteDataSource,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');

  const handleDragStart = (
    e: DragEvent<HTMLButtonElement>,
    dataSource: DataSource,
  ) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData('dataSource', JSON.stringify(dataSource));
    }
  };

  useEffect(() => {
    if (isRenaming) {
      setIsDeleting(false);
    } else if (isDeleting) {
      setIsRenaming(false);
    }
  }, [isRenaming, isDeleting]);

  return (
    <div className="relative flex items-center">
      <button
        className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:bg-[#343541]/90"
        draggable="true"
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
        onDragStart={(e) => handleDragStart(e, dataSource)}
        onMouseLeave={() => {
          setIsDeleting(false);
          setIsRenaming(false);
          setRenameValue('');
        }}
      >
        <IconBulbFilled size={18} />

        <div className="relative max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all pr-4 text-left text-[12.5px] leading-3">
          {dataSource.name}
        </div>
      </button>

      {(isDeleting || isRenaming) && (
        <div className="absolute right-1 z-10 flex text-gray-300">
          <button
            className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
            onClick={(e) => {
              e.stopPropagation();

              if (isDeleting) {
                onDeleteDataSource(dataSource);
              }

              setIsDeleting(false);
            }}
          >
            <IconCheck size={18} />
          </button>

          <button
            className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleting(false);
            }}
          >
            <IconX size={18} />
          </button>
        </div>
      )}

      {!isDeleting && !isRenaming && (
        <div className="absolute right-1 z-10 flex text-gray-300">
          <button
            className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleting(true);
            }}
          >
            <IconTrash size={18} />
          </button>
        </div>
      )}

      {showModal && (
        <DataSourceModal
          dataSource={dataSource}
          onClose={() => setShowModal(false)}
          onUpdateDataSource={onUpdateDataSource}
        />
      )}
    </div>
  );
};
