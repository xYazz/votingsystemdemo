import React, { Component, Suspense, lazy } from "react";
import { render } from "react-dom";
import CreateVotePage from "./CreateVotePage";
import Register from "./Register";
import Vote from "./Vote";
import Header from "./Header";
import Footer from "./Footer";
import Login from "./Login";
import './App.css';
import Logout from "./Logout";
import AddCandidate from "./AddCandidates"
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import HomePage from "./HomePage";
import { StyledEngineProvider } from '@mui/material/styles';
import { SnackbarProvider } from "notistack";
const Results = lazy(() => import("./Results"));
const Votes = lazy(() => import("./Votes"));
const Profile = lazy(() => import("./Profile"));
import JoinVote from "./JoinVote";
import PendingRequests from "./PendingRequests";
import LoadingPage from "./LoadingPage";

export default class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {

        return (
            <div className="center">
                <StyledEngineProvider injectFirst>
                    <SnackbarProvider maxSnack={3}>
                            <Router forceRefresh={true}>
                                <Suspense fallback={<div>loading..</div>}>
                                <Header />
                                <Route exact path='/' component={HomePage} />
                                <Route path='/register' component={Register} />
                                <Route path='/add_candidate' component={AddCandidate} />
                                <Route path='/results' component={Results} />
                                <Route path='/login' component={Login} />
                                <Route path='/join' component={JoinVote} />
                                <Route path='/pending' component={PendingRequests} />
                                <Route path='/results' component={Profile} />
                                <Route path='/results' component={Votes} />
                                <Route path='/Logout' component={Logout} />
                                <Route path='/create' component={CreateVotePage} />
                                <Route path='/vote' component={Vote} />
                                <Footer />
                                </Suspense>
                            </Router>
                    </SnackbarProvider>
                </StyledEngineProvider>
            </div>
        )
    }
}


const appDiv = document.getElementById("app");
render(<App />, appDiv);
