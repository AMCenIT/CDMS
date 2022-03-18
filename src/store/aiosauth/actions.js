import { aiosapi } from "boot/axios";

// set localstorage
function setAxiosHeaders(token) {
  aiosapi.defaults.headers.common["Authorization"] = "Bearer " + token;
  localStorage.setItem("accessToken", token);
}

// pass the payload
export async function setUserStore({ commit }, credential) {
  commit("setUserProfile", credential);
}

//logged in true
export async function setLoggedIn({ commit }, flag) {
  if (flag == 1) {
    commit("setLoginApiStatus", "success");
  } else {
    commit("setLoginApiStatus", "failed");
  }
}

// post credentials
export async function loginApiAIOS({ commit }, credential) {
  const response = await aiosapi
    .post("/authentication", credential)
    .catch((err) => {
      // console.log(response);
    });

  // console.log(response.data);

  if (response && response.data && response.data.user) {
    if (response.data.user.system_user_type == "Admin") {
      commit("setLoginApiStatus", "success");
      localStorage.setItem("isAuthenticatedAios", "true");
      localStorage.setItem("isLoggedInAios", "success");
      commit("setUserProfile", response.data);
      localStorage.setItem("aiosuser", JSON.stringify(response.data.user));
      // console.log(response.data, session.claim.auth)
      //    commit('login', { token: response.data.token, refeshToken: response.data.refesh_token, user: response.data.user, authorization: session.claim.auth })
      setAxiosHeaders(response.data.accessToken);
    } else {
      commit("setLoginApiStatus", "usernotaccess");
    }
  } else {
    commit("setLoginApiStatus", "failed");
  }
}
export async function logout({ commit }) {
  commit("setLoginApiStatus", "failed");
  // reset user
  let data = {
    _id: "",
    email: "",
  };
  commit("logoutUserProfile", data);
  localStorage.removeItem("accessToken");
  localStorage.removeItem("isAuthenticatedAios");
  localStorage.removeItem("-jwt");
  localStorage.removeItem("aiosuser");
  localStorage.removeItem("isLoggedInAios");
  aiosapi.defaults.headers.common["Authorization"] = "";
}
