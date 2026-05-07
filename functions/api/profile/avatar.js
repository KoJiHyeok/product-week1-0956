import { getCurrentUser, getDb, json } from "../auth/_shared.js";

const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp"]);
const maxAvatarBytes = 5 * 1024 * 1024;

export async function onRequestPost(context) {
  try {
    const user = await getCurrentUser(context);

    if (!user) {
      return json({ message: "로그인이 필요합니다." }, 401);
    }

    if (!context.env.AVATARS) {
      return json({ message: "R2 AVATARS 바인딩이 필요합니다." }, 500);
    }

    const form = await context.request.formData();
    const file = form.get("avatar");

    if (!(file instanceof File)) {
      return json({ message: "이미지 파일을 선택하세요." }, 400);
    }

    if (!allowedTypes.has(file.type)) {
      return json({ message: "PNG, JPEG, WEBP 이미지만 업로드할 수 있습니다." }, 400);
    }

    if (file.size > maxAvatarBytes) {
      return json({ message: "이미지는 5MB 이하만 업로드할 수 있습니다." }, 400);
    }

    const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const key = `avatar-${user.id}-${crypto.randomUUID()}.${extension}`;
    await context.env.AVATARS.put(key, await file.arrayBuffer(), {
      httpMetadata: {
        contentType: file.type,
      },
    });

    const avatarUrl = `/api/profile/avatar/${key}`;
    const db = getDb(context);
    await db.prepare("UPDATE users SET profile_image_url = ? WHERE id = ?").bind(avatarUrl, user.id).run();

    return json({
      user: {
        id: user.id,
        loginId: user.login_id,
        username: user.username,
        profileImageUrl: avatarUrl,
      },
    });
  } catch {
    return json({ message: "프로필 이미지를 저장하지 못했습니다." }, 500);
  }
}
