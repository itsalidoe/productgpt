import { NextApiRequest, NextApiResponse } from "next";

if (!process.env.NEXT_PUBLIC_TRELLO_API_KEY) {
  throw new Error("Missing env var from Trello");
}

export default async function GetTrelloOrganizations(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (!req.cookies['trello-token']) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const accessToken = req.cookies['trello-token'];

  try {
    const response = await fetch(
      `https://api.trello.com/1/members/me/organizations?key=${process.env.NEXT_PUBLIC_TRELLO_API_KEY}&token=${accessToken}`
    );
    const organizations: any = await response.json()
    return res.status(200).json({ result: organizations });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong on the API!", error: error });
  }
}

