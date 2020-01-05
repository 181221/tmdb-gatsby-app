import React from "react"
import { Link } from "gatsby"
import { isAuthenticated, login, getProfile } from "../utils/auth"

export default () => {
  if (!isAuthenticated()) {
    login()
    return <p>Redirecting to login...</p>
  }
  return (
    <div>
      <p>Hello Gatsby!</p>
      <Link to="/account">Go to your account</Link>
    </div>
  )
}
