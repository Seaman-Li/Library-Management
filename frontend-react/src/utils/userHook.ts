import { UserType } from "@/type";
import { useEffect, useState } from "react";

export const useCurrentUser = () => {
  const [user, setUser] = useState<UserType | null>(null);
  useEffect(() => {
    const userObj = localStorage.getItem("user");
    if (userObj) {
      console.log(
        "%c [ obj ]-9",
        "font-size:13px; background:pink; color:#bf2c9f;",
        userObj
      );
      setUser(JSON.parse(userObj));
    }
  }, []);

  return user;
};