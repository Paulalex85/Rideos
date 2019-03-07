import React, { Component } from "react";
import { connect } from 'react-redux';
import {
    Route,
    NavLink,
    BrowserRouter
} from "react-router-dom";

import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs2';

import { UserAction, ScatterAction } from 'actions';
import { ApiService } from 'services';

import AssignPlace from '../AssignPlace';
import OrderDashboard from '../OrderDashboard';
import UserProfile from '../UserProfile';
import CreateOrder from '../CreateOrder';
import OfferDashboard from '../OfferDashboard';
import KeyGenerator from '../KeyGenerator';
import Logout from '../Logout';
import Scatter from '../Scatter';

import "./Main.css";

class Main extends Component {
    constructor(props) {
        super(props);

        this.getCurrentUser = this.getCurrentUser.bind(this);
        this.getCurrentUser();
    }

    getCurrentUser() {
        const { setUser, setScatter, scatter: { scatter } } = this.props;

        const network = ScatterJS.Network.fromJson({
            blockchain: 'eos',
            host: '127.0.0.1',
            port: 8888,
            protocol: 'http',
            chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
        });

        ScatterJS.plugins(new ScatterEOS());

        if (scatter !== undefined) {
            console.log("scatter ok")
            const account = scatter.identity.accounts.find(x => x.blockchain === 'eos');

            ApiService.getUserByAccount(account.name).then(user => {
                setUser({ account: user.account, username: user.username, balance: user.balance });
            }).catch((err) => { console.error(err) });
        }
        else {
            ScatterJS.connect('Rideos', { network }).then(connected => {
                if (connected) {
                    console.log("connected")

                    const account = ScatterJS.scatter.identity.accounts.find(x => x.blockchain === 'eos');
                    setScatter({ scatter: ScatterJS.scatter });
                    console.log(account)

                    ApiService.getUserByAccount(account.name).then(user => {
                        setUser({ account: user.account, username: user.username, balance: user.balance });
                    }).catch((err) => { console.error(err) });
                }
            });
        }
    }

    render() {
        const { user: { account } } = this.props;
        let router = null;


        if (account) {
            router =
                <div className="body">
                    <ul className="header">
                        <li><NavLink exact to="/">Home</NavLink></li>
                        <li><NavLink to="/profile">Profile</NavLink></li>
                        <li><NavLink to="/createOrder">Create Order</NavLink></li>
                        <li><NavLink to="/orders">Orders</NavLink></li>
                        <li><NavLink to="/assign">Assign Place</NavLink></li>
                        <li><NavLink to="/offers">Offers</NavLink></li>
                        <li><NavLink to="/logout">Logout</NavLink></li>
                    </ul>
                    <div className="content">
                        <Route exact path="/" component={KeyGenerator} />
                        <Route path="/profile" component={UserProfile} />
                        <Route path="/createOrder" component={CreateOrder} />
                        <Route path="/orders" component={OrderDashboard} />
                        <Route path="/assign" component={AssignPlace} />
                        <Route path="/offers" component={OfferDashboard} />
                        <Route path="/logout" component={Logout} />
                    </div>
                </div>
        }
        else {
            router =
                <div className="body">
                    <ul className="header">
                        <li><NavLink exact to="/">Home</NavLink></li>
                        <li><NavLink to="/login">Login with Scatter</NavLink></li>
                    </ul>
                    <div className="content">
                        <Route exact path="/" component={KeyGenerator} />
                        <Route path="/login" component={Scatter} />
                    </div>
                </div>
        }

        return (
            <BrowserRouter>
                {router}
            </BrowserRouter>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    setScatter: ScatterAction.setScatter,
    setUser: UserAction.setUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);