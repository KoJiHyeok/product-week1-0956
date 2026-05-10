import { getCurrentUser, json, publicUser } from "./_shared.js";
import { isAdminUser } from "../images/_shared.js";

export async function onRequestGet(context) {
  const user = await getCurrentUser(context);

  if (!user) {
    return json({
      authenticated: false,
      user: null,
    });
  }

  return json({
    authenticated: true,
    user: {
      ...publicUser(user),
      role: (await isAdminUser(context, user)) ? "admin" : user.role || "user",
    },
  });
}
