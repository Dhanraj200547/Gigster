import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectBasedOnRole = async () => {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.role === "student") navigate("/dashboard-student");
        else if (data.role === "employer") navigate("/dashboard-employer");
      }
    };

    redirectBasedOnRole();
  }, []);

  return <div>Loading...</div>; // optional: spinner
}
