import { useEffect, useState, useContext } from "react";
import NextLink from "next/link";
import numeral from "numeral";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import Checkbox from "../widgets/inputs/checkbox/checkbox";
import { ArrowRight as ArrowRightIcon } from "../../icons/arrow-right";
import { PencilAlt as PencilAltIcon } from "../../icons/pencil-alt";
import { Scrollbar } from "../scrollbar";
import ToDoItemsListContext from "../../contexts/to-do-item-lists-context";

const ToDoItemsListTable = (props) => {
  const {
    toDoItems,
    toDoItemsCount,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    ...other
  } = props;

  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const action = useContext(ToDoItemsListContext).didClickCheckmark;

  // Reset selected customers when customers change
  useEffect(
    () => {
      if (selectedCustomers.length) {
        setSelectedCustomers([]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [toDoItems]
  );

  const handleSelectAllCustomers = (event) => {
    setSelectedCustomers(
      event.target.checked ? toDoItems.map((customer) => toDoItems.id) : []
    );
  };

  const handleSelectOneCustomer = (event, customerId) => {
    if (!selectedCustomers.includes(customerId)) {
      setSelectedCustomers((prevSelected) => [...prevSelected, customerId]);
    } else {
      setSelectedCustomers((prevSelected) =>
        prevSelected.filter((id) => id !== customerId)
      );
    }
  };

  const selectedSomeCustomers =
    selectedCustomers.length > 0 && selectedCustomers.length < toDoItems.length;
  const selectedAllCustomers = selectedCustomers.length === toDoItems.length;

  return (
    <div {...other}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {toDoItems.map((toDoItem) => {
              return (
                <TableRow
                  hover
                  key={toDoItem.path.id}
                >
                  <TableCell padding="checkbox">
                    <Checkbox 
                      onCheckboxClicked={(bool) => {
                        toDoItem.setCompletionStatus(bool);
                        action(toDoItem);
                      }}
                      isChecked={toDoItem.isCompleted}
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Box sx={{ ml: 1 }}>
                        <NextLink href="/dashboard/customers/1" passHref>
                          <Link color="inherit" variant="subtitle2">
                            {toDoItem.name}
                          </Link>
                        </NextLink>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {toDoItem.dueDate
                      ? `${
                          toDoItem.dueDate.getMonth() + 1
                        }/${toDoItem.dueDate.getDate()}/${toDoItem.dueDate.getFullYear()}`
                      : ""}
                  </TableCell>
                  <TableCell align="right">
                    <NextLink href="/dashboard/customers/1/edit" passHref>
                      <IconButton component="a">
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                    </NextLink>
                    <NextLink href="/dashboard/customers/1" passHref>
                      <IconButton component="a">
                        <ArrowRightIcon fontSize="small" />
                      </IconButton>
                    </NextLink>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={toDoItemsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

ToDoItemsListTable.propTypes = {
  toDoItems: PropTypes.array.isRequired,
  toDoItemsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default ToDoItemsListTable;
