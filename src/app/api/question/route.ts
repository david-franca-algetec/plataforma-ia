import { Question } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  const res = await request.json();

  console.log(res);

  const response = await fetch(`${API_URL}/question/create`, {
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

export async function GET(request: Request, { params }: { params: any }) {
  console.log("GET", params);

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  console.log("id", id);

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
    const response = await fetch(`${API_URL}/question/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "api-key": "your_api_key",
      },
    });

    const data = await response.json();

    return Response.json(data);
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const response = await fetch(`${API_URL}/question/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "api-key": "your_api_key",
      },
    });

    const data = await response.json();

    return Response.json(data);
  }
}
