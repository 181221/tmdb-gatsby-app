import React from "react"
import { Alert, AlertTitle } from "@material-ui/lab"

const FlashMessage = ({ error, success }) => {
  return (
    <div>
      {error && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Something went wrong
        </Alert>
      )}
      {success && (
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          This movie was successfully requested!
        </Alert>
      )}
    </div>
  )
}

export default FlashMessage
