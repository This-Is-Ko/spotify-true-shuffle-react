import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import {getAccessTokenCall} from "../utils/SpotifyAuthService";

const Main = () => {
  const [auth, setAuth] = React.useState(localStorage.getItem("accessToken") != null);


  function useQuery() {
    return new URLSearchParams(window.location.search);
  }

  useEffect(() => {
    getAccessTokenCall(useQuery().get('code'), setAuth);
  });

  return (
    <>
      <main>
        <nav>
          {auth ?
            <Link to="/playlists">Playlists</Link>
            :
            <div>
              <div style={{
                display: "block",
                backgroundImage: "linear-gradient(-45deg, rgb(86, 11, 179) -5%, rgb(167, 13, 105)",
                height: "500px"
              }}>
                <h1 className={"textOnBackground"}>True Shuffle</h1>
              </div>
              <h1>Get started</h1>
              <div className={"homepageIconHolder"}>
                <div>
                  <img className={"homepageIcon"}
                       src={"https://4197r62cmrjs32n9dndpi2o1-wpengine.netdna-ssl.com/wp-content/uploads/2020/07/square-placeholder.jpg"} alt={"login image"}/>
                  <h2>Login to Spotify</h2>
                  <p></p>
                </div>
                <div>
                  <img className={"homepageIcon"}
                       src={"https://4197r62cmrjs32n9dndpi2o1-wpengine.netdna-ssl.com/wp-content/uploads/2020/07/square-placeholder.jpg"} alt={"shuffle image"}/>
                  <h2>Select playlist to shuffle</h2>
                  <p></p>
                </div>
                <div>
                  <img className={"homepageIcon"}
                       src={"https://4197r62cmrjs32n9dndpi2o1-wpengine.netdna-ssl.com/wp-content/uploads/2020/07/square-placeholder.jpg"} alt={"music image"}/>
                  <h2>Start listening</h2>
                  <p></p>
                </div>
              </div>
            </div>
          }
        </nav>
      </main>

    </>
  );
}

export default Main;
