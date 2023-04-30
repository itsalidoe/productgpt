import { NextApiRequest, NextApiResponse } from "next";

if (!process.env.TRELLO_API_KEY && !process.env.TRELLO_API_TOKEN) {
  throw new Error("Missing env var from Trello");
}

export default async function GetTrelloBoard(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!req.query.id) {
    return res.status(400).json({ message: "Missing board id" });
  }

  const accessToken = authHeader.split(" ")[1];
  const id = req.query.id;
  console.log(id);

  try {
    const boardMetadata = await fetch(
      `https://api.trello.com/1/boards/${id}?key=${process.env.TRELLO_API_KEY}&token=${accessToken}`
    );
    const boardLists = await fetch(
      `https://api.trello.com/1/boards/${id}/lists?key=${process.env.TRELLO_API_KEY}&token=${accessToken}`
    );
    const boardCards = await fetch(
      `https://api.trello.com/1/boards/${id}/cards?key=${process.env.TRELLO_API_KEY}&token=${accessToken}`
    );

    const cards = await boardCards.json()
    const lists = await boardLists.json()
    const cardsWithListName = cards.map((card: any) => {
      const list = lists.find((list: any) => list.id === card.idList);
      return { name: card.name, due: card.due, listName: list.name, url: card.url, listId: card.idList, description: card.desc, dateLastActivity: card.dateLastActivity, dueReminder: card.dueReminder, id: card.id };
    });


    return res
      .status(200)
      .json({
        cards: cardsWithListName
        // board: await boardMetadata.json(),
        // lists: await boardLists.json(),
        // cards: await boardCards.json(),
      });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token", error: error });
  }
}
