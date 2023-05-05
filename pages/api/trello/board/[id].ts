import { NextApiRequest, NextApiResponse } from "next";

if (!process.env.NEXT_PUBLIC_TRELLO_API_KEY && !process.env.TRELLO_API_TOKEN) {
  throw new Error("Missing env var from Trello");
}

export default async function GetTrelloBoard(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (!req.cookies['trello-token']) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!req.query.id) {
    return res.status(400).json({ message: "Missing board id" });
  }

  const accessToken = req.cookies['trello-token'];
  const id = req.query.id;

  try {
    const boardMetadata = await fetch(
      `https://api.trello.com/1/boards/${id}?key=${process.env.NEXT_PUBLIC_TRELLO_API_KEY}&token=${accessToken}`
    );
    const boardLists = await fetch(
      `https://api.trello.com/1/boards/${id}/lists?key=${process.env.NEXT_PUBLIC_TRELLO_API_KEY}&token=${accessToken}`
    );
    const boardCards = await fetch(
      `https://api.trello.com/1/boards/${id}/cards?key=${process.env.NEXT_PUBLIC_TRELLO_API_KEY}&token=${accessToken}`
    );

    const boardMembers = await fetch(
      `https://api.trello.com/1/boards/${id}/members?key=${process.env.NEXT_PUBLIC_TRELLO_API_KEY}&token=${accessToken}`
    );

    const cards = await boardCards.json()
    const lists = await boardLists.json()
    const members = await boardMembers.json()
    const cardsWithListName = cards.map((card: any) => {
      const list = lists.find((list: any) => list.id === card.idList);
      // find if card idMembers has id that matches a member object inside the boardMembers array
      const cardMembers = members.filter((member: any) => card.idMembers.includes(member.id))
      return { name: card.name, members: cardMembers, due: card.due, listName: list.name, url: card.url, listId: card.idList, description: card.desc, dateLastActivity: card.dateLastActivity, dueReminder: card.dueReminder, id: card.id };
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
      .status(500)
      .json({ message: "Something went wrong on the API!", error: error });
  }
}
