import React, { Component, Suspense, lazy } from "react";
import { render } from "react-dom";
import CreateVotePage from "./CreateVotePage";
import Register from "./Register";
import { Header } from "./Header";
import Footer from "./Footer";
import Login from "./Login";
import './App.css';
import Logout from "./Logout";
import AddCandidate from "./AddCandidates"
import { BrowserRouter as Router, Route, } from "react-router-dom";
import HomePage from "./HomePage";
import { StyledEngineProvider } from '@mui/material/styles';
import { SnackbarProvider } from "notistack";
import ManageSitting from "./ManageSitting";
const Results = lazy(() => import("./Results"));
const Votes = lazy(() => import("./Votes"));
const Profile = lazy(() => import("./Profile"));
const Vote = lazy(() => import("./Vote"));
const PendingRequests = lazy(() => import("./PendingRequests"));
import JoinVote from "./JoinVote";
import LoadingPage from "./LoadingPage";
import Sitting from "./Sitting";
import LiveSitting from "./LiveSitting";
import LiveSittingFinished from "./LiveSittingFinished";

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
                            <Header />
                            <Route exact path='/' component={HomePage} />
                            <Route path='/register' component={Register} />
                            <Route path='/add_candidate' component={AddCandidate} />
                            <Suspense fallback={<div>{<LoadingPage/>}</div>}>
                                <Route path='/results' component={Results} />
                                <Route path='/profile' component={Profile} />
                                <Route path='/votes' component={Votes} />
                                <Route path='/pending' component={PendingRequests} />
                                <Route path='/vote' component={Vote} />
                            </Suspense>
                            <Route path='/login' component={Login} />
                            <Route path='/join' component={JoinVote} />
                            <Route path='/Logout' component={Logout} />
                            <Route path='/create' component={CreateVotePage} />
                            <Route exact path='/sitting' component={Sitting} />
                            <Route exact path='/sittings' component={ManageSitting} />
                            <Route exact path='/live_sitting' component={LiveSitting} />
                            <Route exact path='/finished_sitting' component={LiveSittingFinished} />
                        </Router>
                        <Footer />
                    </SnackbarProvider>
                </StyledEngineProvider>
            </div>
        )
    }
}


const appDiv = document.getElementById("app");
render(<App />, appDiv);
