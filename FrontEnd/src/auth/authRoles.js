export const authRoles = {
  SA: ["SA"], // Only Super Admin has access
  Moderator: ["SA", "MODERATOR"], // Only SA & Admin has access
  Tutor: ["SA", "MODERATOR","TUTOR"], // Only SA & Admin & Editor has access
  Student: ["SA", "MODERATOR","STUDENT"],
  Guest: ["SA", "ADMIN", "MODERATOR", "GUEST","TUTOR","STUDENT"] // Everyone has access
};
