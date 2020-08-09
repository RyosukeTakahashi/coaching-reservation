import React, { FC } from "react";
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

export type buttonProps = {
  size?: string;
  onClickHandler?: () => void;
  fullWidth?: boolean;
  startIcon?: any;
};

export const TealButton: FC<buttonProps> = (props: {
  size;
  onClickHandler;
  children;
  fullWidth;
  startIcon;
}) => {
  const classes = useStyles();
  return (
    <ColorButton
      variant="contained"
      color="primary"
      className={classes.margin}
      size={props.size}
      onClick={props.onClickHandler}
      fullWidth={props.fullWidth}
      startIcon={props.startIcon}
    >
      {props.children}
    </ColorButton>
  );
};
