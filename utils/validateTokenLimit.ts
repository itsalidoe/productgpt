import GPT3NodeTokenizer from "gpt3-tokenizer";

export default (prompt: string) => {
  console.time("Total Execution Time");

  if (!process.env.NEXT_PUBLIC_OPENAI_MAX_TOKENS) {
    throw new Error("Missing env var NEXT_PUBLIC_OPENAI_MAX_TOKENS");
  }

  const max_tokens = parseInt(process.env.NEXT_PUBLIC_OPENAI_MAX_TOKENS);

  console.time("Tokenizer Initialization");
  const tokenizer = new GPT3NodeTokenizer({ type: "gpt3" });
  console.timeEnd("Tokenizer Initialization");

  console.time("Encoding");
  const encoded: { bpe: number[]; text: string[] } = tokenizer.encode(prompt);
  console.timeEnd("Encoding");

  console.log("TOKENS", encoded.text.length);
  if (encoded.text.length > max_tokens) {
    console.timeEnd("Total Execution Time");
    return { valid: false, tokens: encoded.text.length };
  }
  console.timeEnd("Total Execution Time");
  return { valid: true, tokens: encoded.text.length };
};
