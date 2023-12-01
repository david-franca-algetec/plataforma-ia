import { Question } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (id) {
    const response = await fetch(`${API_URL}/question/show/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "api-key": "your_api_key",
      },
    });

    const data = await response.json();

    return Response.json(data);
  } else {
    return Response.json({ message: "No id provided" });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const body: Question = await request.json();

  if (id) {
    const response = await fetch(`${API_URL}/question/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "api-key": "your_api_key",
      },
      body: JSON.stringify({
        question: body.question,
        answers: body.question,
      }),
    });

    const data = await response.json();

    return Response.json(data);
  }
}
