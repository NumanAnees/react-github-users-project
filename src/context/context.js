import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

//Provider,Consumer - GithubContext.provider

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, SetRepos] = useState(mockRepos);
  const [followers, SetFollowers] = useState(mockFollowers);
  //Request & Loading
  const [requests, setRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(0);
  //error usestate
  const [error, setError] = useState({ show: false, msg: "" });
  //User Searching Functionality
  const searchGithubUser = async (user) => {
    toggleError();
    setIsLoading(true);
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    );

    if (response) {
      setGithubUser(response.data);
      const { login, followers_url } = response.data;
      //repos and followers part
      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ]).then((results) => {
        const [repos, followers] = results;
        const status = "fulfilled";
        if (repos.status === status) {
          SetRepos(repos.value.data);
        }
        if (followers.status === status) {
          SetFollowers(followers.value.data);
        }
      });
    } else {
      //Toggle Error if user does not exist
      toggleError(1, "There is no user with that username");
    }
    checkRequests();
    setIsLoading(false);
  };

  //check rate:
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;
        setRequests(remaining);
        if (remaining === 0) {
          //throw an error
          toggleError(1, "Sorry, you have exceeded your hourly rate limit!");
        }
      })
      .catch((err) => console.log(err));
  };

  function toggleError(show = false, msg = "") {
    setError({ show, msg });
  }
  //Error

  //useEffect:
  useEffect(checkRequests, []);
  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        isLoading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};
export { GithubProvider, GithubContext };
