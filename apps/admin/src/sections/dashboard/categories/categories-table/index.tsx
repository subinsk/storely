"use client";

import Iconify from "@/components/iconify";
import Scrollbar from "@/components/scrollbar";
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
import { useBoolean } from "@/hooks/use-boolean";
import {
  deleteCategoryById,
  useGetCategories,
} from "@/services/category.service";
import {
  IconButton,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
} from "@mui/material";
import { isEqual } from "lodash";
import { useCallback, useEffect, useState } from "react";
import CategoriesTableRow from "./categories-table-row";
import { usePathname, useRouter } from "next/navigation";
import { useSnackbar } from "notistack";

const TABLE_HEAD = [
  { id: "sno", label: "S.No.", align: "center" },
  { id: "name", label: "Name" },
  { id: "parent", label: "Parent Category", align: "center" },
  {
    id: "createdAt",
    label: "Created",
  },
  {
    id: "updatedAt",
    label: "Updated",
  },
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

export default function CategoriesTable({
  categories,
  categoriesLoading,
}: {
  categories: any[];
  categoriesLoading: boolean;
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
    (id: string) => {
      router.push("/dashboard/edit-category/" + id);
    },
    [router]
  );

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        const deleteResponse = await deleteCategoryById(id);

        if (deleteResponse.success) {
          const deleteRow = tableData.filter((row: any) => row.id !== id);
          setTableData(deleteRow);

          table.onUpdatePageDeleteRow(dataInPage.length);
        } else throw new Error(deleteResponse.message);
      } catch (err: any) {
        console.log("err: ", err);
        enqueueSnackbar("Failed to delete category", {
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

  // effects
  useEffect(() => {
    setTableData(categories);
  }, [categories]);

  return (
    <>
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
                <CategoriesTableRow
                  key={row.id}
                  row={row}
                  index={index}
                  selected={table.selected.includes(row.id)}
                  onSelectRow={() => table.onSelectRow(row.id)}
                  onDeleteRow={() => handleDeleteRow(row.id)}
                  onEditRow={() => handleEditRow(row.id)}
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
    <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
          </>
  );
}
