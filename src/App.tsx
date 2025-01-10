import React from "react";
import "./App.css";
import {
  SignedIn,
  SignIn,
  SignedOut,
  RedirectToSignIn,
  UserButton,
  useClerk,
} from "@clerk/clerk-react";
import Call from "./components/call/Call";

const App: React.FC = () => {
  const { signOut } = useClerk();

  return (
    <div className='App'>
      <header className='App-header'>
        {/* If the user is signed in */}
        <SignedIn>
          <div className='user'>
            <button
              type='submit'
              className='sign-out-btn'
              onClick={() => signOut()}>
              Sign Out
            </button>
            <UserButton />
          </div>
          <Call />
          <button
            onClick={() => signOut()}>
            Sign Out
          </button>
        </SignedIn>

        {/* If the user is signed out, redirect to the sign-in page */}
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </header>
    </div>
  );
};

export default App;
