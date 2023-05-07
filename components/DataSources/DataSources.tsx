import { FC } from 'react';
import { DataSourceComponent } from './DataSource';
import { DataSource } from '@/types/dataSource';

interface Props {
  dataSources: DataSource[];
  onUpdateDataSource: (dataSource: DataSource) => void;
  onDeleteDataSource: (dataSource: DataSource) => void;
}

export const DataSources: FC<Props> = ({
  dataSources,
  onUpdateDataSource,
  onDeleteDataSource,
}) => {
  return (
    <div className="flex w-full flex-col gap-1">
      {dataSources
        .slice()
        .reverse()
        .map((prompt, index) => (
          <DataSourceComponent
            key={index}
            dataSource={prompt}
            onUpdateDataSource={onUpdateDataSource}
            onDeleteDataSource={onDeleteDataSource}
          />
        ))}
    </div>
  );
};
