import { DataSource } from '@/types/dataSource';

export const updateDataSource = (
  updatedDataSource: DataSource,
  allDataSources: DataSource[],
) => {
  const updatedDataSources = allDataSources.map((c) => {
    if (c.id === updatedDataSource.id) {
      return updatedDataSource;
    }

    return c;
  });

  saveDataSources(updatedDataSources);

  return {
    single: updatedDataSource,
    all: updatedDataSources,
  };
};

export const saveDataSources = (dataSources: DataSource[]) => {
  localStorage.setItem('datasources', JSON.stringify(dataSources));
};
