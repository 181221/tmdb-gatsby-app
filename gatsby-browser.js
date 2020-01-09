import React from "react"
import { Location } from "@reach/router"
import { silentAuth } from "./src/utils/auth"
import { navigate } from "gatsby"
import { landing } from "./src/constants/route"

class SessionCheck extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
    }
  }

  handleCheckSession = () => {
    this.setState({ loading: false })
    if (this.props.location.pathname === "/callback/") {
      navigate(landing)
    }
    navigate(this.props.location.pathname)
  }

  componentDidMount() {
    silentAuth(this.handleCheckSession)
  }

  render() {
    return (
      this.state.loading === false && (
        <React.Fragment>{this.props.children}</React.Fragment>
      )
    )
  }
}

export const wrapRootElement = ({ element }) => {
  return (
    <Location>
      {({ location, navigation }) => (
        <SessionCheck location={location}>{element}</SessionCheck>
      )}
    </Location>
  )
}
