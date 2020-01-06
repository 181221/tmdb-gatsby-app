import React from "react"
import { Link } from "gatsby"
import { isAuthenticated, login, getProfile } from "../utils/auth"
import Layout from "../components/layout"

export default () => {
  if (!isAuthenticated()) {
    login()
    return <p>Redirecting to login...</p>
  }
  return (
    <Layout>
      <p>Hello Gatsby!</p>
      <Link to="/account">Go to your account</Link>
    </Layout>
  )
}
