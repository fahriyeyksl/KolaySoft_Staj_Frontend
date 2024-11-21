
import React, {useState} from "react";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";

function Dashboard() {

    const [isLogin,setIsLogin] = useState(true);
    const handleSignupClick = () => setIsLogin(false);
    const  handleLoginClick = () => setIsLogin(true);
    return (
        <div>
            {isLogin ? <Login onSignupClick={handleSignupClick} /> : <Signup onLoginClick={handleLoginClick} />}

        </div>
    );

}

export default Dashboard;