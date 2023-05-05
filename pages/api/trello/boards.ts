import { NextApiRequest, NextApiResponse } from "next";

if (!process.env.NEXT_PUBLIC_TRELLO_API_KEY) {
  throw new Error("Missing env var from Trello");
}

interface IBoards {
  results: { id: string; nodeId: string; name: string; [key: string]: any };
}

export default async function GetTrelloBoards(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (!req.cookies['trello-token']) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const accessToken = req.cookies['trello-token'];
  const { organizationId } = req.query;


  try {
    const response = await fetch(
      `https://api.trello.com/1/members/me/boards?key=${process.env.NEXT_PUBLIC_TRELLO_API_KEY}&token=${accessToken}`
    );
    let boards: any = await response.json();
    if (organizationId) {

      boards = boards
        .filter((board: any) => board.idOrganization === organizationId)
        .map((board: any) => {
          return { id: board.id, nodeId: board.nodeId, name: board.name, url: board.url };
        });
    }
    return res.status(200).json({ result: boards });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong on the API!", error: error });
  }
}

