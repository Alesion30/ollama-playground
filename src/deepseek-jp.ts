/**
 * deepseek r1 の軽量モデルは日本語に弱い（中国語と英語を学習に使用する）モデルであるため、
 * 翻訳モデルと組み合わせて日本語でも十分な精度を出せるようにするサンプル
 */
import { Ollama } from "ollama";

const ollama = new Ollama({ host: "http://127.0.0.1:11434" });

/** 推論モデル https://ollama.com/library/deepseek-r1:1.5b */
const DEEPSEEK_R1_1_5B = "deepseek-r1:1.5b";

/** 翻訳モデル https://ollama.com/7shi/gemma-2-jpn-translate:2b-instruct-q8_0 */
const GEMMA_2_JPN_TRANSLATE_2B_INSTRUCT_Q8_0 =
  "7shi/gemma-2-jpn-translate:2b-instruct-q8_0";

/**
 * モデルのロード
 */
const loadModel = async () => {
  console.log("Loading models...");

  try {
    // 推論モデル
    await ollama.pull({
      model: DEEPSEEK_R1_1_5B,
    });

    // 翻訳モデル
    await ollama.pull({
      model: GEMMA_2_JPN_TRANSLATE_2B_INSTRUCT_Q8_0,
    });
  } catch (error) {
    console.error("Failed to load models.");
    console.error(error);
    process.exit(1);
  }

  console.log("Models loaded.");
};

/**
 * 日本語から英語への翻訳
 */
const translateToEnglish = async (message: string) => {
  const response = await ollama.chat({
    model: GEMMA_2_JPN_TRANSLATE_2B_INSTRUCT_Q8_0,
    messages: [
      { role: "system", content: "Translate Japanese to English:" },
      { role: "assistant", content: "OK" },
      { role: "user", content: message },
    ],
    stream: true,
    options: {
      temperature: 0.0,
    }
  });
  return response;
};

/**
 * 英語から日本語への翻訳
 */
const translateToJapanese = async (message: string) => {
  const response = await ollama.chat({
    model: GEMMA_2_JPN_TRANSLATE_2B_INSTRUCT_Q8_0,
    messages: [
      { role: "system", content: "Translate English to Japanese:" },
      { role: "assistant", content: "OK" },
      { role: "user", content: message },
    ],
    stream: true,
    options: {
      temperature: 0.0,
    }
  });
  return response;
};

/**
 * 推論する
 */
const think = async (message: string) => {
  const response = await ollama.chat({
    model: DEEPSEEK_R1_1_5B,
    messages: [{ role: "user", content: message }],
    stream: true,
    options: {
      temperature: 0.7,
    }
  });
  return response;
};

const main = async () => {
  await loadModel();

  const MESSAGE = "なぜ空は青いのですか？";

  console.log("========================================");
  console.log("1. translateToEnglish");
  console.log("========================================");
  const englishMessageStream = await translateToEnglish(MESSAGE);
  let englishMessage = "";
  for await (const part of englishMessageStream) {
    englishMessage += part.message.content;
    process.stdout.write(part.message.content);
  }

  console.log("\n");

  console.log("========================================");
  console.log("2. think");
  console.log("========================================");
  const thinkMessageStream = await think(englishMessage);
  let thinkMessage = "";
  for await (const part of thinkMessageStream) {
    thinkMessage += part.message.content;
    process.stdout.write(part.message.content);
  }
  thinkMessage = thinkMessage.replace(/<\/?think>/g, "").trim();

  console.log("\n");

  console.log("========================================");
  console.log("3. translateToJapanese");
  console.log("========================================");
  const japaneseMessageStream = await translateToJapanese(thinkMessage);
  let japaneseMessage = "";
  for await (const part of japaneseMessageStream) {
    japaneseMessage += part.message.content;
    process.stdout.write(part.message.content);
  }
};
main();
