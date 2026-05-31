import Link from 'next/link';

type PaginationParams = Record<string, string | undefined>;

export function TablePaginationFooter({
  basePath,
  params,
  page,
  totalPages,
  total,
  pageSize,
}: {
  basePath: string;
  params: PaginationParams;
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
}) {
  const safeTotalPages = Math.max(totalPages, 1);
  const safePage = Math.min(Math.max(page, 1), safeTotalPages);
  const start = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = total === 0 ? 0 : Math.min(total, safePage * pageSize);
  const hasPrevious = safePage > 1;
  const hasNext = safePage < safeTotalPages;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card border border-border p-4 rounded-2xl">
      <span className="text-xs font-bold text-muted-foreground">
        Showing {start}-{end} of {total} records - Page {safePage} of {safeTotalPages}
      </span>
      <div className="flex items-center gap-2">
        {hasPrevious ? (
          <Link href={hrefWithParams(basePath, params, { page: String(safePage - 1) })} className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors">
            Previous
          </Link>
        ) : (
          <span className="rounded-xl border border-border bg-muted px-3 py-2 text-xs font-bold text-muted-foreground opacity-60">
            Previous
          </span>
        )}
        {hasNext ? (
          <Link href={hrefWithParams(basePath, params, { page: String(safePage + 1) })} className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors">
            Next
          </Link>
        ) : (
          <span className="rounded-xl border border-border bg-muted px-3 py-2 text-xs font-bold text-muted-foreground opacity-60">
            Next
          </span>
        )}
      </div>
    </div>
  );
}

function hrefWithParams(basePath: string, params: PaginationParams, next: PaginationParams) {
  const query = new URLSearchParams();
  Object.entries({ ...params, ...next }).forEach(([key, value]) => {
    if (value && value !== 'all') query.set(key, value);
  });
  const queryString = query.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}
