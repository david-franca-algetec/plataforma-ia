import {genSalt, hash} from 'bcrypt'

export async function GET() {
  const API_URL = process.env.API_URL
  const API_KEY = process.env.API_KEY

  if (!API_URL || !API_KEY) {
    return new Response('API_URL or API_KEY is not defined', {status: 500})
  }

  try {
    const saltRounds = process.env.SALT_ROUNDS || '10'
    const salt = await genSalt(Number(saltRounds))
    const hashedKey = await hash(API_KEY, salt)

    return Response.json({key: hashedKey, url: API_URL}, {status: 200})
  } catch (e) {
    return new Response('Something went wrong' + JSON.stringify(e), {status: 500})
  }
}