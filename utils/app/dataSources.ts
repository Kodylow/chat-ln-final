import { DataSource } from '@/types/dataSource';

export const updateDataSource = (
  updatedDataSource: DataSource,
  allDataSources: DataSource[],
) => {
  const updatedDataSources = allDataSources.map((c) => {
    if (c.url === updatedDataSource.url) {
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
  console.log('Saving data sources to local storage')
  localStorage.setItem('datasources', JSON.stringify(dataSources));
};
