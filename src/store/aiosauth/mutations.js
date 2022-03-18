import JWT from "jwt-client";
export function setLoginApiStatus(state, data) {
  state.loginApiStatus = data;
}

export function setUserProfile(state, data) {
  // console.log("data mutations", data)
  // console.log("data mutations", data.role)
  const userProfile = {
    _id: data._id,
    email: data.email,
    system_user_type: data.system_user_type,
    email_confirmed: data.email_confirmed,
  };
  state.userProfile = userProfile;
}

export function logoutUserProfile(state, data) {
  const userProfile = {
    _id: data._id,
    email: data.email,
    system_user_type: data.system_user_type,
    email_confirmed: data.email_confirmed,
  };
  state.userProfile = userProfile;
}
