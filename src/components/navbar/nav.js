import React from "react"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import { Link } from "gatsby"
import { logout } from "../../utils/auth"
import styled from "styled-components"
import { useStyles } from "./styles"

const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
  margin: 10px;
`
const StyledDiv = styled.div``

export default function ButtonAppBar({ user }) {
  const classes = useStyles()

  return (
    <StyledDiv className={classes.root}>
      <AppBar position="static" className={classes.test}>
        <Toolbar>
          <StyledLink to="/account/">
            <Typography variant="h6">Home</Typography>
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
