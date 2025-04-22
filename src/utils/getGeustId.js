import { v4 as uuidv4 } from "uuid";

export const getGuestId = () => {
  if (typeof window !== "undefined") {
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId = uuidv4();
      localStorage.setItem("guestId", guestId);
    }
    return guestId;
  }
  return null;
};
