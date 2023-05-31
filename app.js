import { API_KEY } from "./key.js";

const submitButton = document.querySelector("#submit");
const outputElement = document.querySelector("#output");
const inputElement = document.querySelector("input");
const inputValue = document.querySelector("#inputValue");
const historyElement = document.querySelector(".history");
const buttonElement = document.querySelector("button");
const contentElement = document.querySelector("#content");
const customersElement = document.querySelector(".customers");

function changeInput(value) {
    inputElement.value = value;
}; 

// add new chat in the side bar only if new chat was clicked 

const today = new Date().toLocaleString('fr-FR').slice(0, 10);
let limit = {
    date: today,
    question: 0
};
async function getMessage() {
    // add limit on calls with local storage
    const currentLimit = JSON.parse(window.localStorage.getItem("limit"));
    customersElement.classList.add("remove");
    const input = inputElement.value;
    const newInput = document.createElement("p");
    newInput.classList.add("question");
    newInput.textContent = "Q: " + input;
    contentElement.append(newInput);
    const newOutput = document.createElement("p");
    newOutput.classList.add("answer");
    newOutput.textContent = "A: ";
    contentElement.append(newOutput);
    // make conversation scroll down to newest added message
    newOutput.scrollIntoView({behavior: "smooth"});
    inputElement.value = "";
    if (currentLimit && currentLimit.question >= 5 && currentLimit.date === today) {
        newOutput.textContent += "Sorry, you have reached your limit for today, come back tomorrow young padawan!";
    } else {
    const blink = document.createElement("span");
    blink.classList.add("blink");
    blink.textContent = "_";
    newOutput.append(blink);
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
            if (currentLimit && currentLimit.date === today) {
                limit.question++;
            } else {
                limit.date = today;
                limit.question = 1;
            };
            window.localStorage.setItem("limit", JSON.stringify(limit));
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
};

buttonElement.addEventListener("click", clearInput);