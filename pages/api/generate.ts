import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const createPrompt = (user_question: string, preprocessed_data: string): string => {
  return `User question: ${user_question}\nPreprocessed Trello data:\n${preprocessed_data}\nPlease provide the answer in Markdown format.\nAnswer: `;
};

const handler = async (req: Request): Promise<Response> => {

  const { user_question, preprocessed_data } = (await req.json()) as {
    user_question?: string;
    preprocessed_data?: any;
  };

  if (!user_question || !preprocessed_data) {
    return new Response("No user_question or preprocessed_data in the request", { status: 400 });
  }

  const prompt = createPrompt(user_question, JSON.stringify(preprocessed_data));
  console.log(prompt)
  const payload: OpenAIStreamPayload = {
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 4000,
    stream: false,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
