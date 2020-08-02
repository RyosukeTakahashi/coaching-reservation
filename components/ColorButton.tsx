import React from "react";
import {
  createStyles,
  withStyles,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { teal } from "@material-ui/core/colors";

const ColorButton = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.getContrastText(teal[500]),
    backgroundColor: teal[500],
    "&:hover": {
      backgroundColor: teal[700],
    },
  },
}))(Button);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(0),
    },
  })
);

export function TealButton(props) {
  const classes = useStyles();
  return (
    <ColorButton variant="contained" color="primary" className={classes.margin} onClick={props.onClickHandler}>
      {props.children}
    </ColorButton>
  );
}
