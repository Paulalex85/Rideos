import React, { Component } from 'react';
import { connect } from 'react-redux';

// Components
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// Services and redux action
import { OrderAction } from 'actions';
import { ApiService } from 'services';


class CreateOrder extends Component {
    constructor(props) {
        // Inherit constructor
        super(props);

        // State for form data and error message
        this.state = {
            form: {
                buyer: "",
                seller: "",
                deliver: "",
                priceOrder: "",
                priceDeliver: "",
                details: "",
                delay: "",
                error: '',
            },
        }

        // Bind functions
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        const { form } = this.state;

        this.setState({
            form: {
                ...form,
                [name]: value,
                error: '',
            },
        });
    }

    // Handle form submission to call api
    handleSubmit(event) {
        // Stop the default form submit browser behaviour
        event.preventDefault();
        // Extract `form` state
        const { form } = this.state;
        const { setListOrders, user: { account } } = this.props;

        return ApiService.initializeOrder(form)
            .then(() => {
                ApiService.getOrders(account)
                    .then(list => {
                        setListOrders({ listOrders: list, account: account });
                    })
            })
            .catch(err => {
                this.setState({ error: err.toString() });
            });
    }

    render() {
        const { form, error } = this.state;


        return (
            <div>
                <div className="title">Create Order</div>
                <form name="form" onSubmit={this.handleSubmit}>
                    <TextField
                        name="buyer"
                        value={form.buyer}
                        label="Buyer"
                        onChange={this.handleChange}
                    />
                    <TextField
                        name="seller"
                        value={form.seller}
                        label="Seller"
                        onChange={this.handleChange}
                    />
                    <TextField
                        name="deliver"
                        value={form.deliver}
                        label="Deliver"
                        onChange={this.handleChange}
                    />
                    <TextField
                        name="priceOrder"
                        value={form.priceOrder}
                        label="Price Order"
                        onChange={this.handleChange}
                    />
                    <TextField
                        name="priceDeliver"
                        value={form.priceDeliver}
                        label="Price Deliver"
                        onChange={this.handleChange}
                    />
                    <TextField
                        name="details"
                        value={form.details}
                        label="Details"
                        onChange={this.handleChange}
                    />
                    <TextField
                        name="delay"
                        value={form.delay}
                        label="Delay"
                        onChange={this.handleChange}
                    />
                    <div className="field form-error">
                        {error && <span className="error">{error}</span>}
                    </div>
                    <div className="bottom">
                        <Button
                            type="submit"
                            className="green"
                            variant='contained'
                            color='primary'>
                            CREATE
                    </Button>
                    </div>
                </form>
            </div >
        )
    }
}

// Map all state to component props (for redux to connect)
const mapStateToProps = state => state;

// Map the following action to props
const mapDispatchToProps = {
    setListOrders: OrderAction.setListOrders,
};

// Export a redux connected component
export default connect(mapStateToProps, mapDispatchToProps)(CreateOrder);
