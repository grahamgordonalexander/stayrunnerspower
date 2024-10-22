

// utils/storage.ts
export const setIdInLocalStorage = (id: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userId", id);
  }
};





export const getIdFromLocalStorage = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userId");
  }
  return null;
};

// utils/storage.ts
export const setUserDataInLocalStorage = (userData: {
  name: string;
  email: string;
  city: string;
  id: string;
  code_verified: boolean;
  password: string;
}) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userData", JSON.stringify(userData));
  }
};

export const getUserDataFromLocalStorage = (): {
  name: string;
  email: string;
  city: string;
  id: string;
  code_verified: boolean;
  password: string;
} | null => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("userData");
    return data ? JSON.parse(data) : null;
  }
  return null;
};

export const saveToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwtToken", token);
  }
};

// export  const getToken = () => {
//   //const token = localStorage.getItem("jwtToken");
//   //console.log("ttoiiiikkken",token);
//   //console.log("window", window);
//   //return token;

// };
// export const getTokenLogout = () => {

//   const [token, setToken] = useState(localStorage.getItem("jwtToken"));
// console.log("get Token form LS",token);

export const getTokenn = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("jwtToken");
  }
  return null;
};

//   const LogoutUser = () => {
//    setToken("");
//   return localStorage.removeItem("jwtToken")

//   };

// };

export const LogoutUser = () => {


  return localStorage.removeItem("jwtToken")
};

