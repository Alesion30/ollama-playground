import { Ollama } from "ollama";

const ollama = new Ollama({ host: "http://127.0.0.1:11434" });

const { models } = await ollama.list();
console.log("========================================");
console.log("available models:");
console.log("========================================");
console.log(models);

const response = await ollama.chat({
  model: "llama3.2",
  messages: [{ role: "user", content: "なぜ空は青いのですか？" }],
  stream: true,
});

console.log("========================================");
console.log("chat response:");
console.log("========================================");
for await (const part of response) {
  process.stdout.write(part.message.content);
}
