// Created By Ryan Davidovics

const CAPTCHA_PUB_KEY = '6LfjLn8aAAAAAK4fpnkWF8D_BbpXF8GrjAZpbttH';
const CAPTCHA_ID = '_grecaptcha.element.id';
const CALLBACK_NAME = '_grecaptcha.data-callback';
const EXPIRED_CALLBACK_NAME = '_grecaptcha.data-expired-callback';

class Recaptcha extends React.Component {
	// Based on: https://github.com/evenchange4/react-grecaptcha
	// MIT Liscense: http://michaelhsu.mit-license.org
	
	static defaultProps = {
		locale: 'en',
		invisible: false,
	};
	
	componentDidMount() {
		const { locale, callback, expiredCallback} = this.props;
		const script = document.createElement('script');
		script.id = CAPTCHA_ID;
		script.src = `https://www.google.com/recaptcha/api.js?hl=${locale}`;
		script.type = 'text/javascript';
		script.async = true;
		script.defer = true;
		script.onerror = oError => {throw new URIError(`The script ${oError.target.src} is not accessible.`);};
		document.head.appendChild(script);
		// Expose callback function to window objects
		window[CALLBACK_NAME] = callback;
		window[EXPIRED_CALLBACK_NAME] = expiredCallback;
	}
	
	componentWillUnmount() {
		let elem = document.getElementById(CAPTCHA_ID);
		elem.parentNode.removeChild(elem);
	}
	
	render() {
		const { sitekey, invisible, ...otherProps } = this.props;
		const props = {
			className: 'g-recaptcha',
			'data-sitekey': sitekey,
			'data-callback': CALLBACK_NAME,
			'data-expired-callback': EXPIRED_CALLBACK_NAME,
			...(invisible && { 'data-size': 'invisible' }),
		};
		return <div {...props} />;
	}
}

async function dddSiteApiCall(client, data) {
	let response = await fetch('/api/', {
							method: 'POST',
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
							},
							body: JSON.stringify(data)});
	if (response.ok) {
		let json = await response.json();
		client(json);
	} else {
		client(false);
	}
}

function UserDataForms_0(props) {
	return (
			<form method="POST" id="user-address-form">
			  <label className="user-submit-app-form-label">
				Full Name:</label>
				<input id="name" type="text" className="user-submit-app-form-input" value={props.form["name"]} onChange={props.handleChange} />
			  
			  <br /><br />
			  <label className="user-submit-app-form-label">
				Street:</label>
				<input id="street" type="text" className="user-submit-app-form-input" value={props.form["street"]} onChange={props.handleChange} />
			  
			  <br /><br />
			  <label className="user-submit-app-form-label">
				City:</label>
				<input id="city" type="text" className="user-submit-app-form-input" value={props.form["city"]} onChange={props.handleChange} />
			  
			  <br /><br />
			  <label className="user-submit-app-form-label">
				State:</label>
				<input id="state" type="text" className="user-submit-app-form-input" value={props.form["state"]} onChange={props.handleChange} />
			  
			  <br /><br />
			  <label className="user-submit-app-form-label">
				Zip Code:</label>	
				<input id="zip" type="text" className="user-submit-app-form-input" value={props.form["zip"]} onChange={props.handleChange} />
			  	  
			  <button className="user-submit-app-button" id="forward" type="button" onClick={props.handleSubmit}>Check My Address</button>
			</form>
	);
}

function UserDataForms_1(props) {
	return (
			<form method="POST" id="user-address-form">
			  <label className="user-submit-app-form-label">
				Full Name:</label>
				<input id="name" type="text" className="user-submit-app-form-input"value={props.name} onChange={props.handleChange} />
			  
			  <br /><br />
			  <label className="user-submit-app-form-label">
				Street:</label>
				<input id="street" type="text" className="user-submit-app-form-input" value={props.addr["street"]} onChange={props.handleChange} />
			  
			  <br /><br />
			  <label className="user-submit-app-form-label">
				City:</label>
				<input id="city" type="text" className="user-submit-app-form-input" value={props.addr["city"]} onChange={props.handleChange} />
			  
			  <br /><br />
			  <label className="user-submit-app-form-label">
				State:</label>
				<input id="state" type="text" className="user-submit-app-form-input" value={props.addr["state"]} onChange={props.handleChange} />
			  
			  <br /><br />
			  <label className="user-submit-app-form-label">
				Zip Code:</label>
				<input id="zip" type="text" className="user-submit-app-form-input" value={props.addr["zip"]} onChange={props.handleChange} />
			  
			  <br /><br />
			  <label className="user-submit-app-form-label">
				Longitude:</label>
				<input id="lon" type="text" className="user-submit-app-form-input" value={props.addr["geo"]["lon"]} readOnly/>
			  
			  <br /><br />
			  <label className="user-submit-app-form-label">
				Latitude:</label>
				<input id="lat" type="text" className="user-submit-app-form-input" value={props.addr["geo"]["lat"]} readOnly/>
			  
			  <br /><br />
			  <Recaptcha 
				sitekey={CAPTCHA_PUB_KEY} 
				callback={response => props.captchaState(response)} 
				expiredCallback={() => props.captchaState(false)}
			  />			  
			  <button className="user-submit-app-button" id="forward" type="button" onClick={props.handleSubmit}>Register Me!</button>
			</form>
	);
}

function UserDataForms_2(props) {
	let users = '';
	for (let i in props.users) {
		users = users + ' > ' + props.users[i] + '\r\n';
	}
	return (
		<div className="user-submit-app-final">
			<p>You're all set! See who else has signed up: </p>
			<br />
			<div className="user-submit-app-users-list">
				<React.Fragment>
					<ul className="list-users">
					  {props.users.map(user => (
						<li key={user} className="list-users-item list-users-item-primary">
						{user}
						</li>))}
					</ul>
				</React.Fragment>
			</div>
		</div>
	);
}

class UserSubmitApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			form: {
				name: '',
				street: '',
				city: '',
				state: '',
				zip: '',
			},
			addr: {
				street: '',
				city: '',
				state: '',
				zip: '',
				geo: {lon: '', lat: ''},
			},
			captcha: "",
			warning: "",
			context: 0,
			users: [],
		};
		
		// Do this to bind the scope of this to the class and not the function
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.geocodeAddress = this.geocodeAddress.bind(this);
		this.captchaState = this.captchaState.bind(this);
		this.renderContents = this.renderContents.bind(this);
		this.renderWarning = this.renderWarning.bind(this);
		this.handleApiResponse = this.handleApiResponse.bind(this);
	}
	
	geocodeAddress() {
		let address = this.state.form['street'] + ', ' + this.state.form['city'] + ', ' + this.state.form['state'] + ' ' + this.state.form['zip'];
		let data = {name: this.state.form['name'],address: address, user: 'user', cmd: 'geocode'};
		dddSiteApiCall(this.handleApiResponse,data);
	}
	
	submitNewUser() {
		let address = this.state.addr['street'] + ', ' + this.state.addr['city'] + ', ' + this.state.addr['state'] + ' ' + this.state.addr['zip'];
		let geocode = this.state.addr['geo']['lat'] + ',' + this.state.addr['geo']['lon'];
		let data = {name: this.state.form['name'],
					address: address, 
					user: 'user', 
					cmd: 'adduser', 
					geocode: geocode,
					['g-recaptcha-response']: this.state.captcha};
		dddSiteApiCall(this.handleApiResponse,data);
	}
	
	getUsers() {
		let address = this.state.addr['street'] + ', ' + this.state.addr['city'] + ', ' + this.state.addr['state'] + ' ' + this.state.addr['zip'];
		let data = {name: this.state.form['name'],address: address, user: 'user', cmd: 'users'};
		dddSiteApiCall(this.handleApiResponse,data);
	}
	
	handleApiResponse(result) {
		console.log(result);
		switch(this.state.context) {
			case 0:
				if (result['status']) {
					this.setState({warning: "", 
								   context: 1,
								   addr: {street: result['result']['name'], 
											city: result['result']['locality'], 
										   state: result['result']['region_code'],
											 zip: result['result']['postal_code'],
											 geo: {lon: result['result']['longitude'],
												   lat: result['result']['latitude']}}});
				} else {
					this.setState({warning: "Error: " + result['error']});
				}
				break;
			case 1:
				if (result['status']) {
					this.setState({context: 2, warning: "Loading..."});
					this.getUsers();
				} else {
					this.setState({context: 0, warning: "Error: " + result['error']});
				}
				break;
			case 2:
				if (result['status']) {
					this.setState({context: 2, warning: "", users: JSON.parse(result['users'])});
				} else {
					this.setState({context: 0, warning: "Error: " + result['error']});
				}
				break;
			case 3:
				
				break;
			default:
		}
	}
	
	handleSubmit(event) {
		//TODO: Add format checks
		switch(this.state.context) {
			case 0:
				// Initial stage, user can enter data. 
				if (event.target.id == "forward") {
					let a = this.state.form;
					if (a['name'].length < 1 || a['street'].length < 1 || a['city'].length < 1 || a['state'].length < 1 || a['zip'] < 1) {
						this.setState({warning: "Please fill out all forms before submitting."});
					} else {
						this.setState({warning: "Loading..."});
						this.geocodeAddress();
					}
				} else {
					
				}
				break;
			case 1:
				if (event.target.id == "forward") {
					let a = this.state.form;
					if (a['name'].length < 1 || a['street'].length < 1 || a['city'].length < 1 || a['state'].length < 1 || a['zip'] < 1) {
						this.setState({warning: "Please fill out all forms before submitting."});
					} else if (this.state.captcha.length < 1){
						this.setState({warning: "Please prove you are not a robot using the captcha below."});
					} else {
						this.submitNewUser();
					}
				} else {
					
				}
				break;
			case 2:
			
				break;
			default:
		}
		
		event.preventDefault();
	}
	
	handleChange(event) {
		var form = {...this.state.form};
		let good = false
		switch (event.target.id) {
			case "name":
				good = (event.target.value.length < 128 && event.target.value.match(/\d+/) == null);
				break;
			case "street":
				good = (event.target.value.length < 128);
				break;
			case "city":
				good = (event.target.value.length < 56 && event.target.value.match(/\d+/) == null);
				break;
			case "state":
				good = (event.target.value.length < 24 && event.target.value.match(/\d+/) == null);
				break;
			case "zip":
				good = (event.target.value.length < 6 && (!isNaN(parseInt(event.target.value)) || event.target.value.length < 1));
				break;
			default:

		}
		if (good) {		
			form[event.target.id] = event.target.value;
			this.setState({form: form});
		}
	}
	
	captchaState(resp) {
		if (resp) {
			this.setState({captcha: resp});
		} else {
			this.setState({captcha: ""});
		}
	}
	
	renderWarning() {
		if (this.state.warning.length > 0) {
			return (<p id="user-submit-app-warning">{this.state.warning}</p>);
		} else {
			return (<p id="user-submit-app-warning">{' '}</p>);
		}
	}
	
	renderContents() {
		switch(this.state.context) {
			case 0:
				return (<UserDataForms_0 form={this.state.form}
							   handleChange={this.handleChange}
							   handleSubmit={this.handleSubmit}
							   captchaState={this.captchaState} />);
			case 1:
				return (<UserDataForms_1 name={this.state.form['name']}
							   addr={this.state.addr}
							   handleChange={this.handleChange}
							   handleSubmit={this.handleSubmit}
							   captchaState={this.captchaState} />);
				break;
			case 2:
				return (<UserDataForms_2 name={this.state.form['name']}
								users={this.state.users} />);
				break;
			default:
		}
	}
	
	render() {
		return (
			<div className="user-submit-app-container">
				<p className="user-submit-app-heading">Register for Drone Drop Delivery</p>
				<br /><hr /><br />
				{this.renderWarning()}
				{this.renderContents()}
			</div>
		);
	}
}

const domContainer = document.querySelector('#user_submit_app');
ReactDOM.render(<UserSubmitApp />,domContainer);
