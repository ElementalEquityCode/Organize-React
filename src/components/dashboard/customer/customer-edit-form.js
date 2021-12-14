import NextLink from "next/link";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

export const CustomerEditForm = (props) => {
  const { customer, ...other } = props;
  return (
    <form {...other}>
      <Card>
        <CardHeader title="Edit To Do Item" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField fullWidth label="Full name" name="name" required />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Email address"
                name="email"
                required
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
              mt: 3,
            }}
          ></Box>
          <Divider sx={{ my: 3 }} />
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
            }}
          ></Box>
        </CardContent>
        <CardActions
          sx={{
            flexWrap: "wrap",
            m: -1,
          }}
        >
          <Button type="submit" sx={{ m: 1 }} variant="contained">
            Update
          </Button>
          <NextLink href="/dashboard" passHref>
            <Button
              component="a"
              sx={{
                m: 1,
                mr: "auto",
              }}
              variant="outlined"
            >
              Cancel
            </Button>
          </NextLink>
          <Button color="error">Delete To Do Item</Button>
        </CardActions>
      </Card>
    </form>
  );
};

CustomerEditForm.propTypes = {
  customer: PropTypes.object.isRequired,
};
