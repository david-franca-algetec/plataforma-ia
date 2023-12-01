const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  const res: { answer: string; id: number } = await request.json();

  const response = await fetch(`${API_URL}/grade/${res.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": "your_api_key",
    },
    body: JSON.stringify(res),
  });

  const data = await response.json();

  return Response.json(data);
}
