import { Ollama } from "ollama";

const ollama = new Ollama({ host: "http://127.0.0.1:11434" });

const response = await ollama.chat({
  model: "llama3.2",
  messages: [{ role: "user", content: "なぜ空は青いのですか？" }],
});
console.log("ollama response: \n");
console.log(response.message.content);
