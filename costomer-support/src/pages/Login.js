import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../Firebase';
import { Input, Button } from '@nextui-org/react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();

    const handleLogin = async () => {
        try {
            await auth.signInWithEmailAndPassword(email, password);
            history.push('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <Input
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input.Password
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleLogin}>Login</Button>
            {error && <div>{error}</div>}
        </div>
    );
};

export default Login;
