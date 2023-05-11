import GPT3NodeTokenizer from "gpt3-tokenizer";
import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";
import validateTokenLimit from "../../utils/validateTokenLimit";

export const config = {
  runtime: "edge",
};

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

const createPrompt = (preprocessed_data: string): string => {
  const prompt = `Summarize this Trello board as a overall project summary for an email. Include info a CEO would want to know about a project and a timeline/delivery date. Be direct like you're talking to a CEO.  Project data:\n${JSON.stringify(
    preprocessed_data
  )}\n Answer: `;
  if (!validateTokenLimit(prompt).valid) {
    throw new Error("Too many tokens");
  }
  return prompt;
};

const handler = async (req: Request): Promise<Response> => {
  const { preprocessed_data } = (await req.json()) as any;

  const contentPrompt = createPrompt(preprocessed_data);
  //console.log(contentPrompt);
  const payload: OpenAIStreamPayload = {
    model: "gpt-4",
    messages: [{ role: "user", content: contentPrompt }],
    temperature: 0.1,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: process.env.NEXT_PUBLIC_OPENAI_MAX_TOKENS ? parseInt(process.env.NEXT_PUBLIC_OPENAI_MAX_TOKENS) : 2048,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  console.log(stream);
  return new Response(stream);
};

export default handler;
