import { PaginationParams } from '../types';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function parsePagination(query: Record<string, unknown>): PaginationParams {
  const page = Math.max(1, Number(query.page) || DEFAULT_PAGE);
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(query.limit) || DEFAULT_LIMIT));
  const sortBy = (query.sortBy as string) || 'createdAt';
  const sortOrder = (query.sortOrder as string) === 'asc' ? 'asc' : 'desc';

  return { page, limit, sortBy, sortOrder };
}

export function buildSortObject(params: PaginationParams): Record<string, 1 | -1> {
  return { [params.sortBy || 'createdAt']: params.sortOrder === 'asc' ? 1 : -1 };
}

export function getSkip(params: PaginationParams): number {
  return (params.page - 1) * params.limit;
}
