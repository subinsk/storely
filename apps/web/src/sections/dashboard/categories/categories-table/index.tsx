import Iconify from "@/components/iconify";
import Scrollbar from "@/components/scrollbar";
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedAction,
  useTable,
} from "@/components/table";
import { useBoolean } from "@/hooks/use-boolean";
import { useGetCategories } from "@/services/category.service";
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
import { useRouter } from "next/navigation";

const TABLE_HEAD = [
  { id: "name", label: "Name", width: 120 },
  { id: "", width: 20 },
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

export default function CategoriesTable() {
  // hooks
  const router = useRouter();
  const table = useTable();

  const {
    categories,
    categoriesLoading,
    categoriesError,
    categoriesValidating,
    categoriesEmpty,
  } = useGetCategories();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);
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

  const handleEditRow = useCallback(
    (id: string) => {
      router.push("/edit/" + id);
    },
    [router]
  );

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row: any) => row.id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
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

  useEffect(() => {
    if (categoriesLoading) {
      return;
    }

    setTableData(categories);
  }, [categories, categoriesLoading]);

  return (
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
        <Table size={table.dense ? "small" : "medium"} sx={{ minWidth: 960 }}>
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
            {dataFiltered
              .slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
              )
              .map((row: any) => (
                <CategoriesTableRow
                  key={row.id}
                  row={row}
                  selected={table.selected.includes(row.id)}
                  onSelectRow={() => table.onSelectRow(row.id)}
                  onDeleteRow={() => handleDeleteRow(row.id)}
                  onEditRow={() => handleEditRow(row.id)}
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
