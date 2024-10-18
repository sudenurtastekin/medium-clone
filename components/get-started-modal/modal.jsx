"use client";

import { useState } from "react";
import Link from "next/link";
import SignUpForm from "../signup-fom";
import LoginForm from "../login-form";
import '@/css/get-started-cont.css';

export default function GetStartedModal() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(false);

  const handleGetStartedClick = () => {
    setModalOpen(true);
    setIsLoginForm(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSignInClick = () => {
    setIsLoginForm(true);
  };

  return (
    <div className="GetStartedModal">
      <div className="header-nav">
        <div className="desktop-nav">
          <li>Our Story</li>
          <li>Membership</li>
          <li>Write</li>
          <li>Sign in</li>
        </div>
        <li>
          <button className="get-started-btn" onClick={handleGetStartedClick}>Get Started</button>
        </li>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="close-btn">
              <button onClick={handleCloseModal}>X</button>
            </div>
            
            {isLoginForm ? (
              <>
                <h1>Welcome back.</h1>
                <LoginForm />
                <p>
                  Don&apos;t have an account?{" "}
                  <button onClick={() => setIsLoginForm(false)} style={{ color: "#008000" }}>
                    Sign up
                  </button>
                </p>
              </>
            ) : (
              <>
                <h1>Join Medium.</h1>
                <SignUpForm />
                <p>
                  Already have an account?{" "}
                  <button onClick={handleSignInClick} style={{ color: "#008000" }}>
                    Login in
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
