import GPT3NodeTokenizer from "gpt3-tokenizer";
import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

export const config = {
  runtime: "edge",
};

const max_tokens = 4096;

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

const createPrompt = (
  user_question: string,
  preprocessed_data: string
): string => {
  const prompt = `User question: ${user_question}\nPreprocessed Trello data:\n${JSON.stringify(
    preprocessed_data
  )}\nPlease provide the answer in Markdown format.\nAnswer: `;

  const tokenizer = new GPT3NodeTokenizer({ type: "gpt3" });
  const encoded: { bpe: number[]; text: string[] } = tokenizer.encode(prompt);
  console.log("TOKENS", encoded.text.length);
  if (encoded.text.length > max_tokens) {
    throw new Error("Too many tokens");
  }
  return prompt;
};

const handler = async (req: Request): Promise<Response> => {
  const { user_question, preprocessed_data } = (await req.json()) as any;

  if (!user_question) {
    return new Response("No prompt in the request", { status: 400 });
  }
  console.log(createPrompt(user_question, preprocessed_data));
  const payload: OpenAIStreamPayload = {
    model: "gpt-4",
    messages: [
      { role: "user", content: createPrompt(user_question, preprocessed_data) },
    ],
    temperature: 0.1,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: max_tokens,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
