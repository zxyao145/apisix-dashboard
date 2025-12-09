"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type PaginationState = {
  pageSize: number;
  current: number;
};

export const usePagination = (defaultPageSize = 10) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [paginationConfig, setPaginationConfig] = useState<PaginationState>({
    pageSize: defaultPageSize,
    current: 1,
  });

  useEffect(() => {
    const page = Number(searchParams?.get("page") || 1);
    const pageSize = Number(searchParams?.get("pageSize") || defaultPageSize);
    setPaginationConfig({ current: page, pageSize });
  }, [defaultPageSize, searchParams]);

  const savePageList = (page = 1, pageSize = defaultPageSize) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    router.replace(`${pathname}?${params.toString()}`);
  };

  const pagination = useMemo(
    () => ({
      pageSize: paginationConfig.pageSize,
      current: paginationConfig.current,
      onChange: savePageList,
    }),
    [paginationConfig, savePageList],
  );

  return { paginationConfig, pagination, savePageList };
};

export default usePagination;
