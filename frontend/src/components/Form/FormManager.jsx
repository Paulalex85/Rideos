import React, { Component } from 'react';
import CreateUser from '../Form/Users/CreateUser';
import UpdateUser from '../Form/Users/UpdateUser';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DepositUser from './Users/DepositUser';
import Account from './Users/Account';

class FormManager extends Component {
    constructor(props){
      super(props)

      this.handleChange = this.handleChange.bind(this);
      this.handleEosChange = this.handleEosChange.bind(this);
    }

    state = {
        formToShow: 'add',
        privateKey: '',
        account: '',
        publicKey:'',
    };

    handleChange(event) {
        this.setState({formToShow: event.target.value});
    }

    handleEosChange(name,value) {
        this.setState({
            [name]:value
        });
    }
    
    render() {
        let formAPI;
        const formToShow = this.state.formToShow;

        switch (formToShow) {
            case 'add':
                formAPI = <CreateUser privateKey={this.state.privateKey} account={this.state.account} publicKey={this.state.publicKey}/>
                break;

            case 'update':
                formAPI = <UpdateUser privateKey={this.state.privateKey} account={this.state.account} publicKey={this.state.publicKey}/>
                break;

            case 'deposit':
                formAPI = <DepositUser privateKey={this.state.privateKey} account={this.state.account} publicKey={this.state.publicKey}/>
                break;
        
            default:
                break;
        }

        return (
            <div>
                <FormControl>
                    <Account 
                        name='account'
                        label='Account'
                        onChange={this.handleEosChange}/>
                    <Account 
                        name='privateKey'
                        label='Private Key'
                        onChange={this.handleEosChange}/>
                    <Account 
                        name='publicKey'
                        label='Public Key'
                        onChange={this.handleEosChange}/>
                </FormControl>
                <FormControl>
                    <InputLabel>Send to EOS</InputLabel>
                    <Select
                        value={this.state.formToShow}
                        onChange={this.handleChange}
                    >
                        <MenuItem value={'add'}>Add</MenuItem>
                        <MenuItem value={'update'}>Update</MenuItem>
                        <MenuItem value={'deposit'}>Deposit</MenuItem>
                    </Select>
                </FormControl>
                <FormControl>
                    {formAPI}
                </FormControl>
            </div>
        );
    }
}

export default FormManager;