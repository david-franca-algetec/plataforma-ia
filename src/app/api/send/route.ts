export async function POST(request: Request) {
  const res: {answer: string} = await request.json()

  const response = await fetch('http://lastops.pythonanywhere.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      answer: res.answer
    })
  })

  const data = await response.json()

  return Response.json(data)
}