import {
  Card,
  CardContent,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  withStyles,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const Order = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const orderRef = useRef(null);

  useEffect(() => {
    if (expanded) {
      orderRef.current.scrollIntoView();
    }
  }, [expanded]);

  return (
    <Card ref={orderRef} style={{ marginTop: "2vh" }}>
      <CardContent>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5">Order No. #{order.id}</Typography>
          <div style={{ display: "flex", alignItems: "end" }}>
            <Typography>
              {new Date(order.placed_at.seconds * 1000).toLocaleString()}
            </Typography>
            <IconButton
              onClick={() => {
                setExpanded(!expanded);
              }}
              aria-expanded={expanded}
              aria-label="show more"
            >
              {expanded && <ExpandLessIcon />}
              {!expanded && <ExpandMoreIcon />}
            </IconButton>
          </div>
        </div>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent style={{ overflow: "auto" }}>
            <Table aria-label="order table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell align="right">Price</StyledTableCell>
                  <StyledTableCell align="right">Quantity</StyledTableCell>
                  <StyledTableCell align="right">Total</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(order.bill).map((row) => (
                  <StyledTableRow key={row}>
                    <StyledTableCell
                      style={{ textTransform: "capitalize" }}
                      component="th"
                      scope="row"
                    >
                      {row}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      ₹{order.bill[row].price}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {order.bill[row].quantity}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      ₹{order.bill[row].price * order.bill[row].quantity}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
                <StyledTableRow>
                  {/* <StyledTableCell rowSpan={3} /> */}
                  <StyledTableCell colSpan={2} />
                  <StyledTableCell
                    align="right"
                    style={{ fontWeight: "bold" }}
                    // colSpan={2}
                  >
                    Total
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    ₹{order.total_amount}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  {/* <StyledTableCell rowSpan={3} /> */}
                  <StyledTableCell colSpan={2} />
                  <StyledTableCell
                    align="right"
                    style={{ fontWeight: "bold" }}
                    // colSpan={2}
                  >
                    Paid
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {order.payment_status === "paid" ? "Yes" : "No"}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  {/* <StyledTableCell rowSpan={3} /> */}
                  <StyledTableCell colSpan={2} />
                  <StyledTableCell
                    align="right"
                    style={{ fontWeight: "bold" }}
                    // colSpan={2}
                  >
                    Status
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ textTransform: "capitalize" }}
                    align="right"
                  >
                    {order.status}
                  </StyledTableCell>
                </StyledTableRow>
                {/* <StyledTableRow>
                  <StyledTableCell>Tax</StyledTableCell>
                  <StyledTableCell align="right">5%</StyledTableCell>
                  <StyledTableCell align="right">
                    {order.total_amount * 0.05}
                  </StyledTableCell>
                </StyledTableRow>{" "}
                <StyledTableRow>
                  <StyledTableCell colSpan={2}>Total</StyledTableCell>
                  <StyledTableCell align="right">
                    {order.total_amount}
                  </StyledTableCell>
                </StyledTableRow> */}
              </TableBody>
            </Table>
          </CardContent>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default Order;
