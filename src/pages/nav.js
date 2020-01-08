import React from "react"
import { fade, makeStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import { Link } from "gatsby"
import IconButton from "@material-ui/core/IconButton"
import MenuIcon from "@material-ui/icons/Menu"
import { logout } from "../utils/auth"
import SearchIcon from "@material-ui/icons/Search"
import styled from "styled-components"
import InputBase from "@material-ui/core/InputBase"
/*
<div className={classes.searchIcon}>
              <SearchIcon />
            </div>
*/

const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
  margin: 10px;
`
const StyledDiv = styled.div``
const useStyles = makeStyles(theme => ({
  test: {
    background: "linear-gradient(to right, #2c3e50, #243b55)",
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  user: {
    textTransform: "capitalize",
    marginRight: "24px",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 200,
    },
  },
}))

export default function ButtonAppBar({ user }) {
  const classes = useStyles()

  return (
    <StyledDiv className={classes.root}>
      <AppBar position="static" className={classes.test}>
        <Toolbar>
          <StyledLink to="/account/">
            <Typography variant="h6">Home</Typography>
          </StyledLink>
          <StyledLink to="/account/movies">
            <Typography variant="h6">Movie</Typography>
          </StyledLink>
          <div className={classes.title}></div>
          <Typography variant="h6" className={classes.user}>
            {user.nickname}
          </Typography>
          <Button
            href="#logout"
            onClick={e => {
              logout()
              e.preventDefault()
            }}
            color="inherit"
          >
            <Typography variant="body1" component="p">
              Logout
            </Typography>
          </Button>
        </Toolbar>
      </AppBar>
    </StyledDiv>
  )
}
