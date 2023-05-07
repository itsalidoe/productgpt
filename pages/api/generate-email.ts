import GPT3NodeTokenizer from "gpt3-tokenizer";
import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

export const config = {
  runtime: "edge",
};

const max_tokens = 6000;

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}
console.log(process.env.OPENAI_API_KEY);

const createPrompt = (preprocessed_data: string): string => {
  const prompt = `Summarize this Trello board as a overall project summary for an email. Include info a CEO would want to know about a project and a timeline/delivery date. Be direct like you're talking to a CEO.  Project data:\n${JSON.stringify(
    preprocessed_data
  )}\n Answer: `;
  const tokenizer = new GPT3NodeTokenizer({ type: "gpt3" });
  const encoded: { bpe: number[]; text: string[] } = tokenizer.encode(prompt);
  console.log("TOKENS", encoded.text.length);
  if (encoded.text.length > max_tokens) {
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
    max_tokens: max_tokens,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  console.log(stream);
  return new Response(stream);
};

export default handler;
