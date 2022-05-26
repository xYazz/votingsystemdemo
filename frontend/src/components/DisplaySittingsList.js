import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import makeStyles from '@material-ui/core/styles/makeStyles';
import axiosInstance from "../axios";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import ListCreateSitting from "./ListCreateSitting";
const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 1000,
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
        zIndex: 1200,
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    textfield: {
        zIndex: 1300,
    }
}));


const vote_type = [
    {
        value: '1',
        label: 'Wybory prezydenckie',
    },
    {
        value: '2',
        label: 'Wybory parlamentarne',
    },
    {
        value: '3',
        label: 'Wybory starosty roku',
    },
    {
        value: '4',
        label: 'Wybory dziekana wydziału',
    },
    {
        value: '5',
        label: 'Wybory ogólne',
    },

]

const DisplaySittingsList = (props) => {
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [question, setQuestion] = useState('');

    const changeSittingName = (event) => {
        props.setSittingName(event.target.value
        )
    };
    const handleSubmit = () => {
        axiosInstance.post("sitting/create/", {
            name: props.sittingName
        }).catch(error => {
            console.log(error)
        })
            .then(response => {
                if (response.status == 201) {
                    props.setSittingsList([...props.sittingsList, response.data.room])
                }
            });
    }


    const getSittingsList = () => {
        axiosInstance.get("sitting/list/").catch(error => {
            console.log(error)
        })
            .then(response => {
                if (response.status == 200) {
                    props.setSittingsList(response.data.room_list)
                }
                console.log(response.data.room_list)
            });
    }

    useEffect(() => {
        getSittingsList();
    }, []);

    const selectedSittingFromList = (e) => {
        if (e.target.value) {
            props.setSelectedSitting(
                e.target.value,
            )
        }
    }

    const classes = useStyles();

    return <div>

        <ListCreateSitting setRoomQuestions={props.setRoomQuestions}
            options={props.sittingsList}
            setAllowedUsers={props.setAllowedUsers}
            setSittingsList={props.setSittingsList}
            selectedSitting={props.selectedSitting}
            setSelectedSitting={props.setSelectedSitting}
            label="Posiedzenia" />

    </div >;
};

export default DisplaySittingsList;
