import * as React from 'react'
import ButtonContent from '../assets/ButtonContent'
import GoogleIcon from '../assets/GoogleIcon'
import { SynapseClient } from '../utils'

type State = {
  username: string
  password: string
  email: string
  isSignedIn: boolean
  hasLoginInFailed: boolean
  errorMessage: string
}

type Props = {
  token: string | undefined
  theme: string
  icon: boolean
  repoEndpoint?: string
  swcEndpoint?: string
  googleRedirectUrl?: string  
}

/**
 *  Demo of user session, show login screen and handling user login submission.
 *
 *  To support Google SSO in your portal, you must add your domain to the Authorized Redirect URIs
 *  for Synapse authentication.
 *  This can be done by contacting synapseInfo@sagebionetworks.org to form a collaboration.
 *  Synapse engineers must add your redirect URL in the Google API console found at https://console.cloud.google.com/ for this functionality to work.
 *
 * @class Login
 * @extends {React.Component}
 */
class Login extends React.Component<Props, State> {

    /**
     * Creates a user session, maintaining credentials
     * @param {*} props
     * @memberof Login
     */
  constructor(props: Props) {
    super(props)
    this.state = {
      email: '',
      errorMessage: '',
      hasLoginInFailed: false,
      isSignedIn: false,
      password: '',
      username: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.getTokenView = this.getTokenView.bind(this)
    this.getLoginFailureView = this.getLoginFailureView.bind(this)
    this.onSignIn = this.onSignIn.bind(this)
  }
    /**
     * Updates internal state with the event that was triggered
     *
     * @param {*} event Form update
     */
  public handleChange(event: React.FormEvent<HTMLInputElement>): void {
    const target = event.currentTarget
    const name = target.name
    const value = target.value
    const newState: (Pick<any, any>) = { [name]: value }
    this.setState(newState)
  }
    /**
     * Handle user login on click
     *
     * @param {*} clickEvent Userclick event
     */
  public handleLogin(clickEvent: React.FormEvent<HTMLElement>) {
    clickEvent.preventDefault() // avoid page refresh
    const repoEndpoint = this.props.repoEndpoint ? this.props.repoEndpoint : SynapseClient.DEFAULT_ENDPOINT
    const swcEndpoint = this.props.swcEndpoint ? this.props.swcEndpoint : SynapseClient.DEFAULT_SWC_ENDPOINT
    SynapseClient.login(this.state.username, this.state.password, repoEndpoint)
            .then((data: any) => {
              SynapseClient.setSessionTokenCookie(data.sessionToken, swcEndpoint).then(() => {
                // on session change, reload the page so that all components get the new token from the cookie
                window.location.reload()
              }).catch((errSetSession) => {
                console.log('Could not set session token cookie!', errSetSession)
                this.setState({
                  errorMessage: errSetSession.reason,
                  hasLoginInFailed: true,
                  isSignedIn: false
                })
              })
            })
            .catch((err: any) => {
              console.log('Handle login failed with err = ', err)
              this.setState({
                errorMessage: err.reason,
                hasLoginInFailed: true,
                isSignedIn: false
              })
            })
  }

    /**
     * Shows user session token if they've signed in
     *
     * @returns View displaying user session on login, otherwise null.
     */
  public getTokenView(): (JSX.Element | boolean) {
    if (this.state.isSignedIn && this.props.token !== '' && !this.state.hasLoginInFailed) {
      return <p> Your session token is {this.props.token} </p>
    }
    return false
  }
    /**
     * Shows user login failure view on login failure
     *
     * @returns view to be displayed on user sign in error.
     */
  public getLoginFailureView(): (JSX.Element | boolean) {
    if (this.state.hasLoginInFailed) {
      return (
                <div>
                    <small className="form-text text-danger"> {this.state.errorMessage} </small>
                    <div className="invalid-feedback" />
                </div>
      )
    }
    return false
  }
    /**
     * Show whether user is signed in or not, display banner on login success
     *
     * @returns View corresponding to whether the user is signed in, whether they've dismissed
     * sign in banner
     */
  public getSignInStateView(): (JSX.Element | boolean) {
    if (!this.state.isSignedIn) {
      return (
                <p>
                    {' '}
                    You are currently{' '}
                    <strong>
                        {' '}
                        <i> not </i>{' '}
                    </strong>{' '}
                    signed in to Synpase{' '}
                </p>
      )
    }
    return false
  }
  public onSignIn(event: React.MouseEvent<HTMLButtonElement>) {
    // save current route (so that we can go back here after SSO)
    localStorage.setItem('after-sso-login-url', window.location.href)
    event.preventDefault()
    const redirectUrl = this.props.googleRedirectUrl ? this.props.googleRedirectUrl : `${SynapseClient.getRootURL()}?provider=${SynapseClient.AUTH_PROVIDER}`
    SynapseClient.oAuthUrlRequest(SynapseClient.AUTH_PROVIDER, redirectUrl)
            .then((data: any) => {
              const authUrl = data.authorizationUrl
              window.location = authUrl // ping the url
            })
            .catch((err: any) => {
              console.log('Error on oAuth url ', err)
            })
  }
  public render() {
    const { theme, icon } = this.props
    const swcEndpoint = this.props.swcEndpoint ? this.props.swcEndpoint : SynapseClient.DEFAULT_SWC_ENDPOINT
    const googleTheme = theme === 'dark' ? 'SRC-google-button-dark-color' : 'SRC-google-button-light-color'
    return (
      <div id="loginPage" className="container loginContainer SRC-syn-border-spacing">
        <form>
          <button onClick={this.onSignIn} className={`SRC-google-button ${googleTheme} SRC-marginBottomTen`}>
          <GoogleIcon key={1} active={true} />
          <ButtonContent icon={icon} key={2}>
              Sign in with Google
          </ButtonContent>
          </button>
        </form>
        <div className="SRC-center-text SRC-deemphasized-text SRC-marginBottomTen">or</div>

        <div className="SRC-centerAndJustifyContent SRC-marginBottomTen">
          <img 
            height="20px"
            style={{marginRight: '10px'}}
            alt={'sage bionetworks logo'}
            src="https://s3.amazonaws.com/static.synapse.org/sage-bionetworks-logo.svg" 
          />
          Sign in with your Sage Bionetworks Synapse account
        </div>
        <form onSubmit={this.handleLogin} className="form-group">
          <input
            autoComplete="username"
            placeholder="username or email"
            className="form-control SRC-marginBottomTop"
            id="exampleEmail"
            name="username"
            type="text"
            value={this.state.username}
            onChange={this.handleChange}
          />
          <input
            autoComplete="password"
            placeholder="password"
            className="form-control SRC-marginBottomTop"
            id="examplePassword"
            name="password"
            type="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
          {this.getLoginFailureView()}
          <button
            onSubmit={this.handleLogin}
            type="submit"
            className="btn SRC-primary-background-color SRC-hoverWhiteText
              SRC-whiteText m-1 SRC-google-button SRC-marginBottomTen"
          >
            <ButtonContent icon={icon}>
              Sign in
            </ButtonContent>
          </button>
        </form>
        <div>
          <a
            href={`${swcEndpoint}#!PasswordReset:0`}
            className="SRC-floatLeft SRC-primary-text-color"
          >
            Forgot password?
          </a>
          <span className="SRC-deemphasized-text SRC-floatRight">&nbsp;It's free!</span>
          <a
            href={`${swcEndpoint}#!RegisterAccount:0`}
            className="SRC-floatRight SRC-primary-text-color"
          >
            Register
          </a>
        </div>
      </div>
    )
  }
}
export default Login
