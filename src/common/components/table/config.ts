export type IFTableExpandData = {
  [rowKey: string]: {
    type: 'span' | 'data';
    isOpen: boolean;
    data: any[]
  }
};

export type IFTableExpandAction = {
  [rowKey: string]: 'open' | 'close'
};

export interface IFTableClickBack {
  type: string;
  value: any;
  visible?: boolean;
}

export enum Sticky {
  LEFT = 'left',
  RIGHT = 'right'
}

export enum Align {
  LEFT = 'left',
  RIGHT = 'right'
}

export type ColumnAlign = {
  /** 表头 */
  title?: Align;
  /** 表头数据 */
  header?: Align;
  /** 数据 */
  content?: Align;
  /** 尾部 */
  footer?: Align;
};

/**
 * 与 a-checkbox 一致
 */
export type ColumnFilter = {
  label: string;
  value: any;
}[];

export type Column = {
  dataIndex: string;
  title?: string;
  sticky?: Sticky;
  align?: ColumnAlign;
  /** 是否可排序 */
  sortable?: boolean;
  filter?: ColumnFilter;
  customTitle?: () => string;
};

export type TableColumn = {
  isNeedListener?: boolean; // 是否需要 emit
  dataIndex: string;
  title: string;
  /** 是否可排序 */
  sortable?: boolean;
  /** 是否可筛选 */
  filterable?: boolean;
  /** 筛选模式 */
  filterMode?: 'single' | 'multi';
  /** 自定筛选器 */
  filters?: ColumnFilter[];
  /** 是否可搜索 */
  searchable?: boolean;
  /** 是否可变列宽 */
  resizeable?: boolean;
  /** 拖拽分组 */
  dragGroup?: string;
  align?: ColumnAlign;
  sticky?: Sticky;
  width?: string;
  formatter?: ((value: string | number) => string) | null;
};

export type CustomCellRenderer = (
  record: Record<string, string | number>,
  dataIndex: string
) => {
  class?: Record<string, boolean>;
  style?: Record<string, string>;
};

export type CustomCell = {
  header?: CustomCellRenderer;
  body?: CustomCellRenderer;
  footer?: CustomCellRenderer;
};

export type TableConfig = {
  isSticky?: boolean;
  isUseStorage?: boolean;
  tableKey?: string;
  rowKey?: string;
  scrollWidth?: string;
  scrollHeight?: string;
  border?: TableStyle;
  noWrap?: boolean;
  isUseNoWrapTitle?: boolean;
  minWidth?: string;
  resizeMin?: string;
  showSizeChanger?: boolean;
  /** 分页器尺寸 */
  paginationSize?: 'small' | string;
  defaultPageSize?: number;
  /**
   * 查询结果显示
   * - open - 全部打开
   * - fit - 符合的打开
   * - close - 全部关闭
   */
  expendFilterSearchResultShowType?: 'open' | 'close' | 'fit';
};

/**
 * XTable Filter 数据
 */
export type TableFilterData = Record<string, any[]>;

export enum SortType {
  INIT = 'init',
  UP = 'up',
  DOWN = 'down'
}

export const sortTypes = [SortType.INIT, SortType.UP, SortType.DOWN];

export type TableSortData = { dataIndex: string; sortType: SortType };

export type TablePageData = {
  page: number;
  size: number;
  total: number;
};

export const defaultAlign: ColumnAlign = {
  title: Align.LEFT,
  header: Align.LEFT,
  content: Align.LEFT,
  footer: Align.LEFT
};

export const numberAlign: ColumnAlign = {
  title: Align.RIGHT,
  header: Align.RIGHT,
  content: Align.RIGHT,
  footer: Align.RIGHT
};

/**
 * 表格风格
 */
export enum TableStyle {
  /** 无边框 */
  BORDERLESS = 0,
  /** 有边框 */
  BORDER_ALL = 1,
  /** 四周无边框 */
  BORDER_BODY = 2,
  /** 垂直无边框 */
  BORDER_HORIZON = 3
}