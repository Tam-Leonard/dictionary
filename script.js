const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");

btn.addEventListener("click", () => {
    let inpWord = document.getElementById("inp-word").value;
    fetch(`${url}${inpWord}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);

            if (data && data.length > 0) {
                const wordData = data[0];

                result.innerHTML = `
                    <div class="word">
                        <h3>${inpWord}</h3>
                        <button onclick="playSound()">
                            <i class="fas fa-volume-up"></i>
                        </button>
                    </div>
                    <div class="details">
                        <p>${wordData.meanings[0].partOfSpeech}</p>
                        <p>/${wordData.phonetic || ""}/</p>
                    </div>
                    <p class="word-meaning">
                        ${wordData.meanings[0].definitions[0].definition}
                    </p>
                    <p class="word-example">
                        ${wordData.meanings[0].definitions[0].example || ""}
                    </p>`;

                if (wordData.phonetics && wordData.phonetics.length > 0) {
                    sound.setAttribute("src", `${wordData.phonetics[0].audio || ""}`);
                } else {
                    sound.removeAttribute("src");
                    displayError("No audio available for the word.");
                }

                console.log(sound);
            } else {
                result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
                sound.removeAttribute("src");
            }
        })
        .catch(() => {
            result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
            sound.removeAttribute("src");
        });
});

function playSound() {
    if (sound.src) {
        sound.play()
            .catch((error) => {
                console.error("Error playing audio:", error);
                displayError("No audio available for the current word.");
            });
    } else {
        displayError("No audio available for the current word.");
    }
}


function displayError(errorMessage) {
    const errorContainer = document.getElementById("error-message");
    errorContainer.textContent = errorMessage;

    // CSS styles
    errorContainer.style.color = "green";
    errorContainer.style.fontWeight = "bold";
    errorContainer.style.marginTop = "10px";
    errorContainer.style.display = "block"; 

    //Clear error message after a delay
    setTimeout(() => {
        errorContainer.textContent = "";
        errorContainer.style.display = "none"; // Hide the container
    }, 5000);
}