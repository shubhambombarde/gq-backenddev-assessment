import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import useAuthentication from "../src/hooks/useAuthentication.js";
import useCookie from "../src/hooks/useCookie.js";

// import "./styles.css";

function MemeGallery() {
  const [userLogin, setUserLogin] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [memesData, setMemesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cookieConsent, setCookieConsent] = useState(null);
  const [cookie, updateCookie] = useCookie("username", null);
  const [showCookieInfo, setShowCookieInfo] = useState(false);


  useEffect(() => {
    fetch(
      `https://api.imgflip.com/get_memes`,
      {
        method: "GET",
        headers: new Headers({
          Accept: "application/json"
        })
      }
    )
      .then(res => res.json())
      .then(response => {
        setMemesData(response.data.memes.map((item) => { return item.url }));
        setIsLoading(false);
      })
      .catch(error => console.log(error));
  }, []);
  const handleLogout = () => {
    alert("Sorry, I'll have to log you out.");
    setUserLogin(null);
  };
  const showGallery = () => {
    setCookieConsent(null);
    setShowCookieInfo(true);
    setTimeout(() => setShowCookieInfo(false), 5000);
  };
  const handleLogin = () => {
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const user = useAuthentication({username, password});
    if (user) {
      setUserLogin(user);
      updateCookie("username", user.username);
      setCookieConsent(true);
      setShowCookieInfo(true);
    }
    else {
      alert("Wrong Credentials");
      setUsername(null);
      setPassword(null);
    }
  };

  return (
    !userLogin ? (
      <div>
        <h1> Meme Login </h1>
        <div>
          <input type={"text"} value={username} placeholder={"username"} onChange={(e) => setUsername(e.target.value)}/>
          {"    "}
          <input  type={"password"} value={password} placeholder={"password"} onChange={(e) => setPassword(e.target.value)}/>
          {"    "}
          <button type={"submit"} onClick={handleLogin}>Log In</button>
        </div>
        <br /><br />
        <div>
          <div>Developed by {" "}
            <a href={"https://www.linkedin.com/in/shubham-bombarde-b1891650/"} target={"_blank"}>
              Shubham Bombarde
            </a>
          </div>
          <div>shubhambombarde4@gmail.com</div>
          <div>(+91 8149136545)</div>
        </div>
      </div>
    ) : (
      <div>
        {cookieConsent ? (
          <div>
            <h1> This site collects cookies in the browser session. Do you want to continue?</h1>
            <button onClick={handleLogout}>No</button>
            <button onClick={showGallery}>Yes</button>
          </div>
        ) : (
          <div>
            <h1> Meme Gallery </h1>
            {isLoading && <p>Wait I'm loading memes for you</p>}

            {memesData.map((item, index) => (
              <img key={index} height={100} src={item} />
            ))}
            {showCookieInfo ? (
              <div style={{ background: "black", color: "white"}}>
                Cookie in use: <b>{cookie}</b> (this banner will disappear after 5 seconds)
              </div>
            ) : null}
          </div>
        )
        }
      </div>
      )
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<MemeGallery />, rootElement);
