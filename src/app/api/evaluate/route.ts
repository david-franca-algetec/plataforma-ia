export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const model = formData.get('model') as string | null

  if (!file || !model) {
    return new Response('Bad request', {status: 400})
  }

  const API_URL = process.env.API_URL
  const API_KEY = process.env.API_KEY
  if (!API_URL || !API_KEY) {
    return new Response('API_URL or API_KEY is not defined', {status: 500})
  }

  const newFormData = new FormData();
  newFormData.append('data', JSON.stringify({
    type: model
  }));
  newFormData.append('file', file);

  const url = `${API_URL}/grades`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY
      },
      body: newFormData
    })

    if (!res.ok) {
      return new Response(JSON.stringify(res.json()), {status: 500})
    }
    const json = await res.json()
    return Response.json(json, {status: 200})
  } catch (error) {
    return new Response('Something went wrong' + JSON.stringify(error), {status: 500})
  }
}