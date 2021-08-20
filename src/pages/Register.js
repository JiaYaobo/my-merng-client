import React, {useContext,useState}from 'react';
import {Form, Button} from 'semantic-ui-react';
import {gql,useMutation} from '@apollo/client'
import {useForm } from '../util/hooks';
import {AuthContext} from '../context/auth';

function Register(props){
    const context = useContext(AuthContext)
    const [errors, setErrors] = useState({});

    const {onChange, onSubmit, values} = useForm(registerUser, {
        username:'',
        email:'',
        password:'',
        confirmPassword:'',
    });

    const [addUser, {loading}] = useMutation(REGISTER_USER, {
        update(_, {data: {register:userData}}){
            context.login(userData);
            props.history.push('/');
        },
        onError(err){
            console.log(err.graphQLErrors[0].extensions.errors);
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables:values
    });

    function registerUser(){
        addUser();
    }
    
    return(
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading":""}>
                <h1>Register</h1>
                <Form.Input
                    label="Username"
                    placeholder="Username"
                    name="username"
                    type="text"
                    value={values.username}
                    onChange={onChange}
                    />
                    <Form.Input
                    label="Email"
                    placeholder="Email"
                    name="email"
                    value={values.email}
                    onChange={onChange}
                    />
                    <Form.Input
                    label="Password"
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={onChange}
                    />
                    <Form.Input
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={values.confirmPassword}
                    onChange={onChange}
                    />
                    <Button type="submit" primary>
                        register
                    </Button>
            </Form>
            {Object.keys(errors).length>0 && (
                <div className="ui error message">
                <ul className="list">
                    {Object.values(errors).map(value=>(
                        <li key={value}>
                            {value}
                        </li>
                    ))}
                </ul>
            </div>
            )}
            
        </div>
    );
}

const REGISTER_USER = gql`
    mutation registerUser(
    $username:String!,
    $email:String!,
    $password: String!,
    $confirmPassword:String!, 
    ){
        register(
            registerInput:{
                username:$username
                email:$email
                password:$password
                confirmPassword:$confirmPassword
                }
            ){
                id
                email
                username
                createdAt
                token
            }
    }
`;

export default Register;