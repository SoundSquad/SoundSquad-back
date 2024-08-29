interface PaginationResult<T> {
  [key: string]: T | number;
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export const offsetPagination = (page: number = 1, pageSize: number = 6): number => {
  return (page - 1) * pageSize;
};

export const responsePagination = <T>(
  data: T,
  count: number,
  page: number,
  pageSize: number,
  key: string = "data"
): PaginationResult<T> => {
  const totalPages = Math.ceil(count / pageSize);
  
  return {
      [key]: data,
      currentPage: page,
      totalPages,
      totalItems: count,
  };
};