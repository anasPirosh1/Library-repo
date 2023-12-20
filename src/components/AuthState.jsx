// import { onAuthStateChanged } from "firebase/auth";
// import { useEffect, useState } from "react";

// export const AuthState = () => {
//   const [loggedIn, setLoggedIn] = useState(null);

//   useEffect(() => {
//     const listen = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setLoggedIn(user);
//       } else {
//         setLoggedIn(null);
//       }
//     });
//   }, []);
//   return <div>{loggedIn ? <Profile /> : <Header />}</div>;
// };
