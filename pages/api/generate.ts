import { ClaudeStream, ClaudeStreamPayload } from "../../utils/ClaudeStream";
import validateTokenLimit from "../../utils/validateTokenLimit";

export const config = {
  runtime: "edge",
};

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("Missing env var from Anthropic");
}

const createPrompt = (
  user_question: string,
  preprocessed_data: string
): string => {
  const prompt = `\n\nHuman: ${user_question}\nPreprocessed Trello data: ${JSON.stringify(
    preprocessed_data
  )}\n\nPlease provide the answer in Markdown format.\n\nAssistant: `;
  // if (!validateTokenLimit(prompt).valid) {
  //   throw new Error("Too many tokens");
  // }
  return prompt;
};

const handler = async (req: Request): Promise<Response> => {
  const { user_question, preprocessed_data } = (await req.json()) as any;

  if (!user_question) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const payload: ClaudeStreamPayload = {
    model: "claude-v1", //claude-v1.3-100k
    prompt: createPrompt(user_question, preprocessed_data),
    max_tokens_to_sample: 3000,
    temperature: 0.1,
    stop_sequences: ["\n\nHuman:"],
    stream: true,
  };

  const stream = await ClaudeStream(payload);
  return new Response(stream);
};

export default handler;
