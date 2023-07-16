export interface ITodo {
  title: string;
  description: string;
  isComplete: boolean;
}

export interface IPagination {
  page: number;
  limit: number;
}

export interface ITodoPaginationResult {
  todos: ITodo[];
  page_total: number;
}
