import React from "react"
import { Alert, AlertTitle } from "@material-ui/lab"
import { makeStyles } from "@material-ui/core/styles"
const useStyles = makeStyles({
  root: { marginBottom: "24px" },
})

const FlashMessage = ({ error, success }) => {
  const classes = useStyles()

  return (
    <div>
      {error && (
        <Alert severity="error" className={classes.root}>
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
    </div>
  )
}

export default FlashMessage
