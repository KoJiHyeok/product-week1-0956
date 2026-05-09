import { getDb, json } from "../auth/_shared.js";

export async function onRequestGet(context) {
  try {
    const userId = Number(context.params.id);

    if (!Number.isInteger(userId)) {
      return json({ message: "사용자 정보가 올바르지 않습니다." }, 400);
    }

    const user = await getDb(context)
      .prepare(
        `SELECT id, username, bio, is_profile_public, profile_image_url
         FROM users
         WHERE id = ?
         LIMIT 1`
      )
      .bind(userId)
      .first();

    if (!user) {
      return json({ message: "사용자를 찾을 수 없습니다." }, 404);
    }

    const isProfilePublic = user.is_profile_public !== 0;

    return json({
      user: {
        id: String(user.id),
        username: user.username,
        memberType: "회원",
        isProfilePublic,
        bio: isProfilePublic ? user.bio || "" : "",
        profileImageUrl: isProfilePublic ? user.profile_image_url || "" : "",
        canReceiveMessages: true,
      },
    });
  } catch {
    return json({ message: "사용자 정보를 불러오지 못했습니다." }, 500);
  }
}
