import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface GoogleUser {
  name: string;
  email: string;
  picture: string;
}

export default function App() {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const navigate = useNavigate();

  useEffect(()=>{
    const storedUser=localStorage.getItem("user")
    if(storedUser){
        setUser(JSON.parse(storedUser))
    }
  },[])

  return (
    <GoogleOAuthProvider clientId="972843840466-spcf9v9tqfdqindkos651rklc9anr542.apps.googleusercontent.com">
      <div>
        {user ? (
          <div>
            <p>Welcome, {user.name}</p>
            <img
              src={user.picture}
              alt="profile"
              className="w-10 h-auto rounded-full"
            />
            <button
              onClick={() => {
                setUser(null);
                localStorage.removeItem("user");
              }}
              className="bg-red-500 hover:cursor-pointer hover:bg-red-600 py-1 px-4 rounded-md"
            >
              Logout
            </button>
          </div>
        ) : (
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const token = credentialResponse.credential;
              const decoded = jwtDecode<GoogleUser>(
                credentialResponse.credential!
              );
              setUser(decoded);
              localStorage.setItem("user", JSON.stringify(decoded));
              navigate("/dashboard");
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        )}
      </div>
    </GoogleOAuthProvider>
  );
}
