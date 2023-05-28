import { API_KEY } from "./key.js";

const submitButton = document.querySelector("#submit");
const outputElement = document.querySelector("#output");
const inputElement = document.querySelector("input");
const inputValue = document.querySelector("#inputValue");
const historyElement = document.querySelector(".history");
const buttonElement = document.querySelector("button");
const hrElement = document.querySelector("hr");
const contentElement = document.querySelector("#content");
const customersElement = document.querySelector(".customers");

function changeInput(value) {
    inputElement.value = value;
}; 

async function getMessage() {
    customersElement.classList.add("remove");
    const input = inputElement.value;
    const newInput = document.createElement("p");
    newInput.classList.add("question");
    newInput.textContent = "Q: " + input;
    contentElement.append(newInput);
    const newOutput = document.createElement("p");
    const blink = document.createElement("span");
    blink.classList.add("blink");
    blink.textContent = "_";
    newOutput.classList.add("answer");
    newOutput.textContent = "A: ";
    contentElement.append(newOutput);
    newOutput.append(blink);
    inputElement.value = "";
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "Whenever the assistant is asked a question, when you provide a response make a Star Wars reference."
                },
                {
                    role: "user",
                    content: input
                }
            ],
            max_tokens: 100
        })
    };

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", options);
        const data = await response.json();
        if (data.choices[0].message.content) {
            const response = data.choices[0].message.content;
            const words = response.split(" ");
            if (words) {
                    newOutput.removeChild(blink);
                    words.map((word, index) => {
                        setTimeout(() => {
                        newOutput.textContent += `${word} `;
                        }, 150 * index);
                    });
            const pElement = document.createElement("p");
            pElement.textContent = input;
            pElement.addEventListener("click", () => changeInput(pElement.textContent));
            historyElement.append(pElement);
        }}
    } catch (error) {
        console.error(error);

    }
}

submitButton.addEventListener("click", getMessage);
inputElement.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        getMessage();
    }
});

function clearInput() {
    inputElement.value = "";
    outputElement.textContent = "";
    inputValue.textContent = "";
    hrElement.classList.remove("show");
};

buttonElement.addEventListener("click", clearInput);