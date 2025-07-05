"use client";

import {Iconify} from "@storely/shared/components/iconify";
import {Scrollbar} from "@storely/shared/components/scrollbar";
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedAction,
  useTable,
} from "@storely/shared/components/table";
import { useBoolean } from "@/hooks/use-boolean";
import { deleteProduct } from "@/services/product.service";
import {
  IconButton,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
} from "@mui/material";
import { isEqual } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import ProductsTableRow from "./products-table-row";

const TABLE_HEAD = [
  { id: "sno", label: "S.No.", align: "center" },
  { id: "name", label: "Name" },
  { id: "sku", label: "SKU" },
  { id: "category", label: "Category" },
  { id: "mrp", label: "MRP (Rs.)" },
  { id: "price", label: "Price (Rs.)" },
  { id: "quantity", label: "Quantity" },
  { id: "" },
];

const defaultFilters = {
  name: "",
};

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: any;
  comparator: any;
  filters: any;
}) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el: any, index: number) => [el, index]);

  stabilizedThis.sort((a: number[], b: number[]) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el: [any, number]) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user: { name: string } | { name: string }) =>
        user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}

export default function ProductsTable({
  products = [],
  productsLoading,
}: {
  products?: any[];
  productsLoading: boolean;
}) {
  // hooks
  const router = useRouter();
  const pathname = usePathname();
  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({
    defaultDense: true,
  });

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<any[]>([]);
  const [filters, setFilters] = useState(defaultFilters);
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: string) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleViewRow = useCallback(
    (slug: string) => {
      router.push(`${pathname}/${slug}`);
    },
    [pathname, router]
  );

  const handleEditRow = useCallback(
    (id: string, categoryId: string) => {
      router.push("/dashboard/edit-product/" + id + "?category-id=" + categoryId);
    },
    [router]
  );

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        const deleteResponse = await deleteProduct(id);

        if (deleteResponse.success) {
          const deleteRow = tableData.filter((row: any) => row.id !== id);
          setTableData(deleteRow);

          table.onUpdatePageDeleteRow(dataInPage.length);
          enqueueSnackbar("Product deleted successfully", {
            variant: "success",
          });
        } else throw new Error(deleteResponse.message);
      } catch (err: any) {
        console.log("err: ", err);
        enqueueSnackbar("Failed to delete product", {
          variant: "error",
        });
      }
    },
    [dataInPage.length, enqueueSnackbar, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter(
      (row: any) => !table.selected.includes(row.id)
    );
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  //effects
  useEffect(() => {
    if (Array.isArray(products)) {
      setTableData(products);
    } else {
      setTableData([]);
    }
  }, [products]);

  return (
    <TableContainer sx={{ position: "relative" }}>
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
        <Table size={table.dense ? "small" : "medium"}>
          <TableHeadCustom
            order={table.order}
            orderBy={table.orderBy}
            headLabel={TABLE_HEAD}
            rowCount={tableData.length}
            numSelected={table.selected.length}
            onSort={table.onSort}
            // onSelectAllRows={(checked) =>
            //   table.onSelectAllRows(
            //     checked,
            //     tableData.map((row: any) => row.id)
            //   )
            // }
          />
          <TableBody>
            {dataFiltered
              .slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
              )
              .map((row: any, index: number) => (
                <ProductsTableRow
                  key={row.id}
                  row={row}
                  index={index}
                  selected={table.selected.includes(row.id)}
                  onSelectRow={() => table.onSelectRow(row.id)}
                  onDeleteRow={() => handleDeleteRow(row.id)}
                  onEditRow={() => handleEditRow(row.id, row.category.id)}
                  onViewRow={() => handleViewRow(row.slug)}
                />
              ))}
            <TableEmptyRows
              height={denseHeight}
              emptyRows={emptyRows(
                table.page,
                table.rowsPerPage,
                tableData.length
              )}
            />

            <TableNoData notFound={notFound} />
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );
}
