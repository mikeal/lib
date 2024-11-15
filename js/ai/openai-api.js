const COMPLETION_URL = "https://api.openai.com/v1/chat/completions";

export async function openai_request (apikey, messages, model, uri) {
  const body = {
    model: "gpt-4o",
    messages: messages
  };

  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apikey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
      const errorData = await response.json();
      console.error("Error details:", errorData);
      return;
    }

    // Parse the JSON response
    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      // Log the assistant's reply
      console.log("Assistant reply:", data.choices[0].message.content);
    } else {
      console.error("Unexpected response format:", data);
    }
  } catch (error) {
    console.error("Error fetching chat completion:", error);
  }
}

export async function openai_completion (apikey, msg, sysmsg=null, model="gpt-4o", uri=COMPLETION_URL) {
  const messages = []
  if (sysmsg) {
    messages.push({ role: "system", content: sysmsg })
  }
  messages.push({ role: "user", content: msg })
  return openai_request(apikey, messages, model, uri)
}


// Make the API request
export async function fetchChatCompletion(apiKey, userMessage, systemMessage) {
  const messages = [
    { role: "user", content: userMessage }
  ];

  if (systemMessage) {
    messages.unshift({ role: "system", content: systemMessage });
  }
}
