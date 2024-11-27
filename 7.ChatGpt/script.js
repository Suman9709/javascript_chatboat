
const API_KEY = "AIzaSyCc0dHlFVzCEdDuJMgaYUqScB55Vilm7wI"; 
const Api_url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

let prompt = document.querySelector(".prompt");
let container = document.querySelector(".container");
let chatContainer = document.querySelector(".chat-container");
let btn = document.querySelector(".btn");
let userMessage = null;

function createChatBox(html, className) {
  const div = document.createElement("div");
  div.classList.add(className);
  div.innerHTML = html;
  return div;
}

async function generateApiResponse(aiChatBox) {
  const textElement = aiChatBox.querySelector(".text");
  try {
    console.log("Sending request with user message:", userMessage);  

    const response = await fetch(Api_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: userMessage },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data); 

    if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      const apiResponse = data.candidates[0].content.parts[0].text.trim();
      textElement.innerText = apiResponse || "No response from AI.";
    } else {
      textElement.innerText = "No valid content in response.";
    }

  } catch (error) {
    console.error("Error:", error);
    textElement.innerText = "Error fetching response from API.";
  } finally {
    aiChatBox.querySelector(".loading").style.display = "none";
  }
}

function showLoading() {
  const html = `
    <div id="img">
      <img src="ai.png" alt="AI Icon">
    </div>
    <div class="text"></div>
    <img src="loading.gif" alt="Loading..." height="50" class="loading">
  `;
  let aiChatBox = createChatBox(html, "ai-chat-box");
  chatContainer.appendChild(aiChatBox);
  generateApiResponse(aiChatBox);
}

btn.addEventListener("click", () => {
  userMessage = prompt.value.trim();
  if (prompt.value === "") {
    container.style.display = "flex";
  } else {
    container.style.display = "none";
  }

  if (!userMessage) return;

  const html = `
    <div id="img">
      <img src="user.png" alt="User Icon">
    </div>
    <div class="text">${userMessage}</div>
  `;
  let userChatBox = createChatBox(html, "user-chat-box");
  chatContainer.appendChild(userChatBox);
  prompt.value = "";  

  setTimeout(showLoading, 500);
});
