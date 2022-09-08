import type {TableColumn, ColumnFilter, Column, CustomCellRenderer} from '@/common/components/table/config';

export const makeFilter = (values: string[]): ColumnFilter =>
  values.map(value => ({
    label: value,
    value
  }));

export const makeFilterByData = (data: any[] = [], dataIndex: string): ColumnFilter => {
  const valueSet = data
    .map(d => d[dataIndex])
    .filter(d => d !== undefined)
    .reduce((s, d) => s.add(`${d}`), new Set<string>());
  return makeFilter([...valueSet]);
};

export const makeTableHeader = (columns: TableColumn[]) => {
  const headerData = columns.reduce((o, c) => {
    o[c.dataIndex] = c.title;
    return o;
  }, {} as Record<string, string>);
  return [headerData];
};

export const makeTableColumn = (columns: Column[]) =>
  columns.map((d, i) => ({
    ...d,
    sort: 'init',
    resizeable: i !== columns.length - 1,
    dragGroup: d.sticky ? undefined : 'g1'
  }));

export const makeTableFilter = (columns: any[]) => {
  return columns.reduce((o, { dataIndex, filter }) => {
    if (filter) {
      o[dataIndex] = filter;
    }
  }, {});
};

export const makeTableSort = (columns: any[]) =>
  columns.reduce((o, { dataIndex, sortable }) => sortable && (o[dataIndex] = 'init'), {});

export const transpose = (source: any[], prefix: string) => {
  const result: any = {};
  source.forEach((value, i) => (result[`${prefix}${i}`] = value));
  return result;
};

export type TableValue = string | number;
export type TableData =
  | TableValue
  | TableValue[]
  | { value: TableValue | TableValue[]; rowSpan?: number; colSpan?: number };

export type TableRow = {
  key: string;
  [group: `g${number}`]: TableData;
  [value: `d${number}`]: TableData;
};

export const getTableValues = (data: TableData) => {
  if (Array.isArray(data)) {
    return data;
  } else if (typeof data === 'object') {
    return ([] as TableData[]).concat(data.value);
  } else {
    return [data];
  }
};

/**
 * 合并多个 {@link CustomCellRenderer}
 * @param renderers
 */
export const mergeRenderer = (...renderers: CustomCellRenderer[]): CustomCellRenderer => {
  return (record, dataIndex) => {
    const results = renderers.map(r => r(record, dataIndex));
    return {
      class: Object.assign({}, ...results.map(r => r.class)),
      style: Object.assign({}, ...results.map(r => r.style))
    };
  };
};

/**
 * 构建表格行数据: {key, g0, g0, ..., d0, d1, ...}
 * @param key
 * @param group
 * @param values
 */
export const buildTableRow = (key: string, group: TableData[], values: TableData[]) => ({
  key,
  ...transpose(group, 'g'),
  ...transpose(values, 'd')
});