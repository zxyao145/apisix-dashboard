"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { BadgeCheck, Ban, RefreshCw, Search, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { PageContainer } from "@/components/layout/page-container";
import { ActionBar } from "@/components/layout/action-bar";
import { DataTable } from "@/components/table/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import usePagination from "@/hooks/use-pagination";
import { fetchRouteLabels, fetchRouteList, updateRouteStatus, deleteRoutes } from "@/lib/api/routes";
import { timestampToLocaleString } from "@/lib/helpers";
import type { RouteRecord } from "@/types/route";

const filterSchema = z.object({
  name: z.string().optional(),
  uri: z.string().optional(),
  host: z.string().optional(),
  id: z.string().optional(),
  status: z.string().optional(),
  label: z.string().optional(),
});

const STATUS = {
  offline: 0,
  online: 1,
};

const RouteListPage = () => {
  const router = useRouter();
  const { paginationConfig, savePageList } = usePagination();
  const [routes, setRoutes] = useState<RouteRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [labelOptions, setLabelOptions] = useState<Record<string, string[]>>({});

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      name: "",
      uri: "",
      host: "",
      id: "",
      status: "",
      label: "",
    },
  });

  const loadRoutes = useCallback(async () => {
    setLoading(true);
    const values = form.getValues();
    const { data, total } = await fetchRouteList({
      page: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
      name: values.name || undefined,
      uri: values.uri || undefined,
      host: values.host || undefined,
      id: values.id || undefined,
      status: values.status ? Number(values.status) : undefined,
      labels: values.label ? [values.label] : [],
    });
    setRoutes(data);
    setTotal(total);
    setLoading(false);
  }, [form, paginationConfig.current, paginationConfig.pageSize]);

  useEffect(() => {
    loadRoutes();
  }, [loadRoutes]);

  useEffect(() => {
    fetchRouteLabels().then(setLabelOptions);
  }, []);

  const onSearch = (values: z.infer<typeof filterSchema>) => {
    savePageList(1, paginationConfig.pageSize);
    setTimeout(() => {
      loadRoutes();
    });
  };

  const handlePublish = async (record: RouteRecord) => {
    setUpdatingId(record.id);
    await updateRouteStatus(record.id, STATUS.online);
    toast.success(`Published route ${record.name || record.id}`);
    setUpdatingId(null);
    loadRoutes();
  };

  const handleOffline = async (record: RouteRecord) => {
    setUpdatingId(record.id);
    await updateRouteStatus(record.id, STATUS.offline);
    toast.success(`Offline route ${record.name || record.id}`);
    setUpdatingId(null);
    loadRoutes();
  };

  const handleDelete = async (record: RouteRecord) => {
    if (!window.confirm(`Delete route ${record.name || record.id}?`)) return;
    await deleteRoutes([record.id]);
    toast.success("Route deleted");
    loadRoutes();
  };

  const columns: ColumnDef<RouteRecord>[] = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => (
          <div className="max-w-[200px] truncate font-medium">{row.original.name || "-"}</div>
        ),
      },
      {
        header: "ID",
        accessorKey: "id",
        cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.id}</span>,
      },
      {
        header: "Hosts",
        cell: ({ row }) => {
          const hosts = row.original.hosts || (row.original.host ? [row.original.host] : []);
          if (!hosts.length) return <span className="text-muted-foreground">-</span>;
          return (
            <div className="flex flex-wrap gap-1">
              {hosts.map((host) => (
                <Badge key={host} variant="outline" className="max-w-[180px] truncate">
                  {host}
                </Badge>
              ))}
            </div>
          );
        },
      },
      {
        header: "Paths",
        cell: ({ row }) => {
          const paths = row.original.uris || (row.original.uri ? [row.original.uri] : []);
          if (!paths.length) return <span className="text-muted-foreground">-</span>;
          return (
            <div className="flex flex-wrap gap-1">
              {paths.map((path) => (
                <Badge key={path} variant="outline" className="max-w-[180px] truncate">
                  {path}
                </Badge>
              ))}
            </div>
          );
        },
      },
      {
        header: "Labels",
        cell: ({ row }) => {
          const labels = Object.entries(row.original.labels || {}).filter(
            ([key]) => key !== "API_VERSION",
          );
          if (!labels.length) return <span className="text-muted-foreground">-</span>;
          return (
            <div className="flex flex-wrap gap-1">
              {labels.map(([key, value]) => (
                <Badge key={`${key}-${value}`} variant="secondary" className="text-xs">
                  {key}:{value}
                </Badge>
              ))}
            </div>
          );
        },
      },
      {
        header: "Version",
        cell: ({ row }) => row.original.labels?.API_VERSION || "-",
      },
      {
        header: "Status",
        cell: ({ row }) =>
          row.original.status ? (
            <Badge variant="success">Published</Badge>
          ) : (
            <Badge variant="destructive">Unpublished</Badge>
          ),
      },
      {
        header: "Updated",
        cell: ({ row }) => timestampToLocaleString(row.original.update_time),
      },
      {
        header: "Plugins",
        cell: ({ row }) => {
          const plugins = row.original.plugins || {};
          const names = Object.keys(plugins);
          return names.length ? (
            <div className="flex flex-wrap gap-1">
              {names.map((name) => (
                <Badge key={name} variant="outline" className="text-xs">
                  {name}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">-</span>
          );
        },
      },
      {
        header: "Actions",
        cell: ({ row }) => {
          const record = row.original;
          return (
            <div className="flex flex-wrap gap-2">
              {!record.status ? (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handlePublish(record)}
                  disabled={updatingId === record.id}
                >
                  <BadgeCheck className="mr-1 h-4 w-4" />
                  Publish
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleOffline(record)}
                  disabled={updatingId === record.id}
                >
                  <Ban className="mr-1 h-4 w-4" />
                  Offline
                </Button>
              )}
              <Button size="sm" variant="outline" asChild>
                <Link href={`/routes/${record.id}/edit`}>Edit</Link>
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="ghost">
                    View JSON
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Route Data</DialogTitle>
                    <DialogDescription>ID: {record.id}</DialogDescription>
                  </DialogHeader>
                  <pre className="max-h-[520px] overflow-auto rounded-md bg-muted/60 p-4 text-xs">
                    {JSON.stringify(record, null, 2)}
                  </pre>
                </DialogContent>
              </Dialog>
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive"
                onClick={() => handleDelete(record)}
              >
                <Trash className="mr-1 h-4 w-4" />
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    [handleDelete, handleOffline, handlePublish, updatingId],
  );

  return (
    <PageContainer
      title="Routes"
      description="Manage and publish APISIX routes."
      padded={false}
      extra={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => loadRoutes()}>
            <RefreshCw className="mr-1 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => router.push("/routes/create")}>
            Create Route
          </Button>
        </div>
      }
    >
      <div className="space-y-4 p-5">
        <Card>
          <CardContent className="p-4">
            <Form {...form}>
              <form
                className="grid gap-3 md:grid-cols-3"
                onSubmit={form.handleSubmit(onSearch)}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Route name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="uri"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Path</FormLabel>
                      <FormControl>
                        <Input placeholder="/example" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="host"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Host</FormLabel>
                      <FormControl>
                        <Input placeholder="example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Route ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input placeholder="key:value" list="route-labels" {...field} />
                      </FormControl>
                      <FormMessage />
                      <datalist id="route-labels">
                        {Object.entries(labelOptions).map(([key, values]) =>
                          values.map((value) => (
                            <option key={`${key}:${value}`} value={`${key}:${value}`} />
                          )),
                        )}
                      </datalist>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All</SelectItem>
                            <SelectItem value={`${STATUS.offline}`}>Unpublished</SelectItem>
                            <SelectItem value={`${STATUS.online}`}>Published</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-end gap-2 md:col-span-3">
                  <Button type="submit" size="sm">
                    <Search className="mr-1 h-4 w-4" />
                    Search
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      form.reset();
                      savePageList(1, paginationConfig.pageSize);
                      loadRoutes();
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <DataTable
          columns={columns}
          data={routes}
          total={total}
          page={paginationConfig.current}
          pageSize={paginationConfig.pageSize}
          onPageChange={(page) => savePageList(page, paginationConfig.pageSize)}
          isLoading={loading}
          renderToolbar={() => (
            <div className="flex items-center gap-3">
              <Label className="text-xs text-muted-foreground">
                {routes.length} result(s) on this page
              </Label>
            </div>
          )}
        />
      </div>
      <ActionBar>
        <Button size="sm" onClick={() => router.push("/plugin-template/list")} variant="outline">
          Plugin Templates
        </Button>
        <Button size="sm" onClick={() => router.push("/routes/create")}>
          Create Route
        </Button>
      </ActionBar>
    </PageContainer>
  );
};

export default RouteListPage;
