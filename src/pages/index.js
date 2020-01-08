import React from "react"
import { Link } from "gatsby"
import { isAuthenticated, login } from "../utils/auth"
import Layout from "../components/layout"

export default () => {
  if (!isAuthenticated()) {
    login()
    return <p>Redirecting to login...</p>
  }
  return (
    <Layout>
      <Link to="/account">Go to your account</Link>
    </Layout>
  )
}
