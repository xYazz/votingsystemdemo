import React, { Component } from "react";
import { Container } from "@mui/material";
import { Typography } from "@material-ui/core";
import { Box } from "@material-ui/core";
import { Paper } from "@mui/material";
export default class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>
            <Container maxWidth="md" component="main">
                <Box mt={5}>
                    <Paper elevation={16} sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                        <Typography component="h1" variant="h5">
                            Witaj w VotingSystemProject.
                        </Typography>
                        <Typography component="h7" variant="h7">
                            Aplikacja została stworzona na Politechnice Białostockiej, umożliwia ona utworzenie oraz przeprowadzenie e-wyborów. Aby skorzystać z aplikacji musisz utworzyć konto i się zalogować.
                        </Typography>
                        
                    </Paper>
                    <Paper elevation={8} sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                        <Typography component="h1" variant="h5">
                            Utworzenie głosowania.
                        </Typography>
                        <Typography component="h7" variant="h7">
                            Po zalogowaniu do aplikacji możesz utworzyć głosowanie, wybierając z menu pozycję "Utwórz głosowanie", po wypełnieniu formularza, użytkownik zostanie przekierowany do strony, gdzie może dodawać kandydatów. Po zakończeniu dodawania kandydatów, opcja ta będzie dostępna do czasu rozpoczęcia wyborów - aby dodać kolejnych kandydatów przejdź do profilu, następnie kliknij na ikonę osoby z krzyżykiem.
                        </Typography>
                        
                    </Paper>
                    <Paper elevation={16} sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                        <Typography component="h1" variant="h5">
                            Prywatne głosowania.
                        </Typography>
                        <Typography component="h7" variant="h7">
                            System umożliwia utworzenie prywatnych wyborów. Po wybraniu tej opcji głosowanie nie będzie publicznie widoczne. Aby użytkownik miał dostęp do wyborów, musi otrzymać od właściciela głosowania kod dostępu, wysłać prośbę o dołączenie, którą twórca wyborów może zaakceptować.
                        </Typography>
                        
                    </Paper>
                </Box>
            </Container></div>;
    }
}