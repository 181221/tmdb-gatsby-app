import React from "react"
import { Alert, AlertTitle } from "@material-ui/lab"
import { makeStyles } from "@material-ui/core/styles"
import styled from "styled-components"
import Collapse from "@material-ui/core/Collapse"
import CloseIcon from "@material-ui/icons/Close"
import IconButton from "@material-ui/core/IconButton"

const useStyles = makeStyles({
  root: { marginBottom: "24px" },
})

const Container = styled.div`
  width: 50%;
  margin: auto;
`
const FlashMessage = ({
  error,
  success,
  hasFile,
  downloaded,
  inCollection,
}) => {
  const [open, setOpen] = React.useState(true)

  const classes = useStyles()

  return (
    <Container>
      {error && (
        <Alert>
          <AlertTitle>Error</AlertTitle>
          Something went wrong
        </Alert>
      )}
      {success && (
        <Alert severity="success" className={classes.root}>
          <AlertTitle>Success</AlertTitle>
          This movie was successfully requested!
        </Alert>
      )}
      {hasFile && (
        <Alert severity="Info" className={classes.root}>
          <AlertTitle>File on server</AlertTitle>
          This movie is alreaddy on server
        </Alert>
      )}
      {downloaded && (
        <Alert severity="Info" className={classes.root}>
          <AlertTitle>Movie is downloaded</AlertTitle>
          This movie is alreaddy on server
        </Alert>
      )}
      {inCollection && (
        <Collapse in={open} className={classes.root}>
          <Alert
            severity="Info"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false)
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <AlertTitle>Movie is requested</AlertTitle>
            The movie is awaiting confirmation{" "}
          </Alert>
        </Collapse>
      )}
    </Container>
  )
}

export default FlashMessage
