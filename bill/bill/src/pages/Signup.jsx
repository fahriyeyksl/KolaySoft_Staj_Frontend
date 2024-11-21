import React, {useState} from 'react';
import {Button, Divider, Form, FormInput, Grid, GridColumn, Segment} from "semantic-ui-react";
import {CompanyServices} from "../services/companyServices.js";
import "../assets/style/main.css";

function Signup({onLoginClick}) {

    const [companyName,setCompanyName] = useState('');
    const [companyEmail,setCompanyEmail] = useState('');
    const [companyPhone,setCompanyPhone] = useState('');
    const [companyPassword,setCompanyPassword] = useState('');

   const  handleSignup = async () =>{
       const  companyServices = new CompanyServices();
       try {
           const result = await  companyServices.postCompanyAdd({
               companyName,
               companyEmail,
               companyPhone,
               companyPassword
           });
           console.log("Signup succesful:",result.data);

       } catch (error){
           console.log("Signup error: ",error);
       }
   }
    return (
        <>
            <Segment placeholder className="segments" >
                <Grid columns={2} relaxed='very' stackable>
                    <GridColumn>
                        <Form className="form">
                            <FormInput
                                icon='user'
                                iconPosition='left'
                                label={{ children: 'Company Name', className:'title__form'}}
                                placeholder='Company Name'
                                value={companyName}
                                onChange={(e) =>setCompanyName(e.target.value)}
                            />
                            <FormInput
                                icon='mail'
                                iconPosition='left'
                                label={{ children: 'Compan Email', className:'title__form'}}
                                placeholder='Company Email'
                                value={companyEmail}
                                onChange={(e) =>setCompanyEmail(e.target.value)}
                            />
                            <FormInput
                                icon='phone'
                                iconPosition='left'
                                label={{ children: 'Company Phone', className:'title__form'}}
                                placeholder='Company Phone'
                                value={companyPhone}
                                onChange={(e) =>setCompanyPhone(e.target.value)}
                            />
                            <FormInput
                                icon='lock'
                                iconPosition='left'
                                label={{ children: 'Password', className:'title__form'}}
                                type='Password'
                                value={companyPassword}
                                onChange={(e) =>setCompanyPassword(e.target.value)}
                            />

                            <Button content='Signup' size='medium' icon="signup" onClick={handleSignup} className="buttonform"/>
                        </Form>
                    </GridColumn>

                    <GridColumn verticalAlign='middle'>
                        <Button content='Login' icon='sign-in' size='big' onClick={onLoginClick} className="buttonform" />
                    </GridColumn>
                </Grid>

                <Divider vertical>Or</Divider>
            </Segment>
        </>
    );
}

export default Signup;