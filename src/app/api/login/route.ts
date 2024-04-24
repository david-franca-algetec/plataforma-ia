import {signJWT} from "@/lib/token";
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const body = await request.json();
  const {username, password} = body;
  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_PASS = process.env.ADMIN_PASS;
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

  if (!ADMIN_USER || !ADMIN_PASS || !JWT_EXPIRES_IN) {
    return Response.json({
      success: false
    });
  }

  if (!username || !password) {
    return Response.json({
      success: false
    });
  }

  if (ADMIN_USER === username && ADMIN_PASS === password) {
    const token = await signJWT(
      { sub: username },
      { exp: `${JWT_EXPIRES_IN}m` }
    );

    const tokenMaxAge = parseInt(JWT_EXPIRES_IN) * 60;
    const cookieOptions = {
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV !== "development",
      maxAge: tokenMaxAge,
    };

    const cookieStore = cookies()
    await Promise.all([
      cookieStore.set(cookieOptions),
      cookieStore.set({
        name: "logged-in",
        value: "true",
        maxAge: tokenMaxAge,
      }),
    ]);

    return Response.json({
      success: true,
      token,
    }, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  return Response.json({
    success: false
  }, {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}