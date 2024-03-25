import {genSalt, hash} from 'bcrypt'

export async function GET() {
  const API_URL = process.env.API_URL
  const API_KEY = process.env.API_KEY
  const SALT_ROUNDS = process.env.SALT_ROUNDS || '10'

  if (!API_URL || !API_KEY || !SALT_ROUNDS) {
    return new Response('API_URL, API_KEY or SALT_ROUNDS is not defined', {status: 500})
  }

  try {
    const salt = await genSalt(Number(SALT_ROUNDS))
    const hashedKey = await hash(API_KEY, salt)

    return Response.json({key: hashedKey, url: API_URL}, {status: 200})
  } catch (e) {
    return new Response('Something went wrong' + JSON.stringify(e), {status: 500})
  }
}