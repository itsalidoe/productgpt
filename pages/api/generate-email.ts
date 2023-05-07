import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

// export const config = {
//   runtime: "edge",
// };

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

const createPrompt = (preprocessed_data: string): string => {
  return `Preprocessed Trello data:\n${JSON.stringify(preprocessed_data)}\nPlease provide a high-level, executive summary of the info. Don't go into item by item detail. Make your best guest as to when the project will be done and what a timeline could look like. Be direct like you're writing to the CEO. \n Answer: `;
};

const handler = async (req: Request): Promise<Response> => {

  const { preprocessed_data }= await req.json() as any;
  
  console.log(createPrompt(preprocessed_data))
  const payload: OpenAIStreamPayload = {
    model: "gpt-4",
    messages: [{ role: "user", content: createPrompt(preprocessed_data) }],
    temperature: 0.1,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 4000,
    stream: false,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  console.log(stream)
  return new Response(stream);
};

export default handler;
