import { NextApiRequest } from "next";
import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

export const config = {
  runtime: "edge",
};

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

const createPrompt = (user_question: string, preprocessed_data: string): string => {
  return `User question: ${user_question}\nPreprocessed Trello data:\n${preprocessed_data}\nPlease provide the answer in Markdown format.\nAnswer: `;
};

const handler = async (req: Request): Promise<Response> => {
  const  { user_question, preprocessed_data }= req.body as any;

  if (!user_question) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
    model: "gpt-4",
    messages: [{ role: "user", content: createPrompt(user_question, preprocessed_data) }],
    temperature: 0.1,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 8000,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
