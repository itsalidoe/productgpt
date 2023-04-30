import { NextApiRequest, NextApiResponse } from "next";

if (!process.env.TRELLO_API_KEY && !process.env.TRELLO_API_TOKEN) {
  throw new Error("Missing env var from Trello");
}

interface IBoards {
  results: { id: string; nodeId: string; name: string; [key: string]: any };
}

export default async function GetTrelloBoards(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const response = await fetch(
      `https://api.trello.com/1/members/me/boards?key=${process.env.TRELLO_API_KEY}&token=${accessToken}`
    );
    let boards: any = await response.json()
    boards = boards.map((board: any) => {
      return { id: board.id, nodeId: board.nodeId, name: board.name, url: board.url };
    });
    return res.status(200).json({ result: boards });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token", error: error });
  }
}

