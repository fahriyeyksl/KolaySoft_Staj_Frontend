import React, {useState} from 'react';
import 'semantic-ui-css/semantic.min.css';
import {
    GridColumn,
    FormInput,
    Button,
    Divider,
    Form,
    Grid,
    Segment,
} from 'semantic-ui-react'
import "../assets/style/main.css";
import {useNavigate} from "react-router-dom";
import {CompanyServices} from "../services/companyServices.js";


function Login({onSignupClick}) {
    const  navigate = useNavigate();
    const [CompanyEmail,setCompanyEmail] = useState('');
    const [CompanyPassword,setCompanyPassword] = useState('');

    const handleLogin = async () => {
        const companyService = new CompanyServices();
        try {
            const result = await companyService.postCompanyLogin({
                CompanyEmail,
                CompanyPassword
            });
            console.log("Giriş işlemi başarılı", result.data);
            navigate('/bill');
        }catch (error){
            console.log("Login error: " ,error.result?.data ||error.message);
        }
    }
    return (
        <>
            <Segment placeholder className="segments" >
                <Grid columns={2} relaxed='very' stackable>
                    <GridColumn>
                        <Form className="form">
                            <FormInput
                                icon='mail'
                                iconPosition='left'
                                label={{ children: 'CompanyEmail', className:'title__form'}}
                                placeholder='CompanyEmail'
                                value={CompanyEmail}
                                onChange={(e) => setCompanyEmail(e.target.value)}
                            />
                            <FormInput
                                icon='lock'
                                iconPosition='left'
                                label={{ children: 'Password', className:'title__form'}}
                                type='password'
                                value={CompanyPassword}
                                onChange={(e)=>setCompanyPassword(e.target.value)}
                            />

                            <Button content='Login' size='medium' icon = "lock " className="buttonform" onClick={handleLogin}/>
                        </Form>
                    </GridColumn>

                    <GridColumn verticalAlign='middle'>
                        <Button content='Sign up' icon='signup' size='big'  className="buttonform" onClick={onSignupClick}/>
                    </GridColumn>
                </Grid>

                <Divider vertical >Or</Divider>
            </Segment>
        </>
    );
}

export default Login;