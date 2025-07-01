"use client";

import React, { useState, useCallback, useEffect } from "react";
// @mui
import { alpha } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from "@/components/table";
import { useSettingsContext } from "@/components/settings";
import { useRouter } from "next/navigation";
import { useBoolean } from "@/hooks/use-boolean";
// _mock
// Removed mock import - using real API data now
import { fTimestamp } from "@/utils/format-time";
import { paths } from "@/routes/paths";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import Label from "@/components/label";
import OrderTableToolbar from "@/sections/dashboard/orders/order-table-toolbar";
import OrderTableFiltersResult from "@/sections/dashboard/orders/order-table-filters-result";
import Iconify from "@/components/iconify";
import Scrollbar from "@/components/scrollbar";
import OrderTableRow from "@/sections/dashboard/orders/order-table-row";
import { ConfirmDialog } from "@/components/custom-dialog";
import { useOrders, bulkDeleteOrders, type OrderFilters } from "@/hooks/useOrders";

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

const TABLE_HEAD = [
  { id: "orderNumber", label: "Order", width: 116 },
  { id: "name", label: "Customer" },
  { id: "createdAt", label: "Date", width: 140 },
  { id: "totalQuantity", label: "Items", width: 120, align: "center" },
  { id: "totalAmount", label: "Price", width: 140 },
  { id: "status", label: "Status", width: 110 },
  { id: "", width: 88 },
];

// ----------------------------------------------------------------------

export default function OrdersView() {
  const table = useTable({ defaultOrderBy: "createdAt" });
  const settings: any = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();

  const [filters, setFilters] = useState<OrderFilters>({
    search: "",
    status: "all",
    page: 1,
    limit: table.rowsPerPage,
    sortBy: "createdAt",
    sortOrder: "desc"
  });

  // Convert filters for API
  const apiFilters: OrderFilters = {
    ...filters,
    status: filters.status === "all" ? undefined : filters.status,
    page: table.page + 1, // API uses 1-based pagination
    limit: table.rowsPerPage,
    sortBy: table.orderBy,
    sortOrder: table.order as "asc" | "desc"
  };

  // Refresh data when filters change
  useEffect(() => {
    refresh();
  }, [filters.status, filters.search, table.page, table.rowsPerPage, table.orderBy, table.order]);

  const { orders, ordersLoading, ordersError, refresh } = useOrders(apiFilters);
  const tableData = orders || [];

  const notFound = !ordersLoading && !tableData.length;
  const canReset = !!filters.search || filters.status !== "all";
  const denseHeight = table.dense ? 52 : 72;

  // Calculate status counts
  const statusCounts = {
    all: tableData.length,
    completed: tableData.filter((order: any) => order.status === "completed").length,
    pending: tableData.filter((order: any) => order.status === "pending").length,
    cancelled: tableData.filter((order: any) => order.status === "cancelled").length,
    refunded: tableData.filter((order: any) => order.status === "refunded").length,
    confirmed: tableData.filter((order: any) => order.status === "confirmed").length,
    processing: tableData.filter((order: any) => order.status === "processing").length,
    shipped: tableData.filter((order: any) => order.status === "shipped").length,
    delivered: tableData.filter((order: any) => order.status === "delivered").length,
  };

  const handleFilters = useCallback(
    (name: string, value: any) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
        page: 1 // Reset page when filtering
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        await bulkDeleteOrders([id]);
        refresh();
      } catch (error) {
        console.error('Failed to delete order:', error);
      }
    },
    [refresh]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      await bulkDeleteOrders(table.selected);
      table.onUpdatePageDeleteRows({
        totalRows: tableData.length,
        totalRowsInPage: tableData.length,
        totalRowsFiltered: tableData.length,
      });
      refresh();
    } catch (error) {
      console.error('Failed to delete orders:', error);
    }
  }, [table, tableData.length, refresh]);

  const handleResetFilters = useCallback(() => {
    setFilters({
      search: "",
      status: "all",
      page: 1,
      limit: table.rowsPerPage,
      sortBy: "createdAt",
      sortOrder: "desc"
    });
  }, [table.rowsPerPage]);

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.orders.details(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event: any, newValue: any) => {
      handleFilters("status", newValue);
    },
    [handleFilters]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            {
              name: "Dashboard",
              href: paths.dashboard.root,
            },
            {
              name: "Order",
              href: paths.dashboard.orders.root,
            },
            { name: "List" },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => router.push("/dashboard/order/create")}
            >
              Create Order
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === "all" || tab.value === filters.status) &&
                        "filled") ||
                      "soft"
                    }
                    color={
                      (tab.value === "completed" && "success") ||
                      (tab.value === "pending" && "warning") ||
                      (tab.value === "cancelled" && "error") ||
                      "default"
                    }
                  >
                    {statusCounts[tab.value as keyof typeof statusCounts] || 0}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <OrderTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            canReset={canReset}
            onResetFilters={handleResetFilters}
          />

          {canReset && (
            <OrderTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={tableData.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: "relative", overflow: "unset" }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row: any) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table
                size={table.dense ? "small" : "medium"}
                sx={{ minWidth: 960 }}
              >
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row: any) => row.id)
                    )
                  }
                />

                <TableBody>
                  {ordersLoading ? (
                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={table.rowsPerPage}
                    />
                  ) : (
                    tableData.map((row: any) => (
                      <OrderTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                      />
                    ))
                  )}

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={tableData.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete{" "}
            <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
