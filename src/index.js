const searchForm = document.querySelector("#searchForm");
const wordInput = document.querySelector("#wordInput");
const status = document.querySelector("#status");
const results = document.querySelector("#results");

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const validation = validateWord(wordInput.value);
  if (!validation.valid) {
    status.textContent = validation.message;
    status.className = "text-danger";
    return;
  }
  const word = validation.word;

  status.textContent = "Searching...";
  status.className = "text-secondary";
  results.replaceChildren();

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
    );

    if (!response.ok) {
      throw new Error("Word not found. Check the spelling and try again.");
    }

    const entries = await response.json();
    if (!Array.isArray(entries) || entries.length === 0) {
      throw new Error("No results found for that word.");
    }

    status.textContent = "";
    entries.forEach((entry) => displayEntry(entry));
  } catch (error) {
    status.textContent =
      error.message === "Failed to fetch"
        ? "Could not reach the dictionary. Check your internet connection and try again."
        : error.message;
    status.className = "text-danger";
  }
});

function displayEntry(entry) {
  const card = document.createElement("article");
  card.className = "entry";

  const heading = document.createElement("h2");
  heading.className = "h3";
  heading.textContent = entry.word;
  card.append(heading);

  const phonetic =
    entry.phonetic || entry.phonetics?.find((item) => item.text)?.text;
  const pronunciationAudio = entry.phonetics?.find((item) => item.audio)?.audio;
  if (phonetic || pronunciationAudio) {
    const pronunciation = document.createElement("p");
    pronunciation.className = "pronunciation";
    pronunciation.textContent = phonetic || "";

    if (pronunciationAudio) {
      const audio = document.createElement("audio");
      audio.controls = true;
      audio.src = pronunciationAudio;
      audio.setAttribute("aria-label", `Pronunciation of ${entry.word}`);
      pronunciation.append(" ", audio);
    }
    card.append(pronunciation);
  }

  entry.meanings?.forEach((meaning) => {
    const partOfSpeech = document.createElement("h3");
    partOfSpeech.className = "h6 text-success text-capitalize mt-3";
    partOfSpeech.textContent = meaning.partOfSpeech || "Meaning";
    card.append(partOfSpeech);

    meaning.definitions?.forEach((definition) => {
      const definitionBlock = document.createElement("div");
      definitionBlock.className = "definition";

      const text = document.createElement("p");
      text.className = "mb-1";
      text.textContent = definition.definition;
      definitionBlock.append(text);

      if (definition.example) {
        const example = document.createElement("p");
        example.className = "example mb-1";
        example.textContent = `Example: “${definition.example}”`;
        definitionBlock.append(example);
      }

      const synonyms = [
        ...new Set([
          ...(meaning.synonyms || []),
          ...(definition.synonyms || []),
        ]),
      ];
      if (synonyms.length) {
        const synonymText = document.createElement("p");
        synonymText.className = "mb-1";
        synonymText.textContent = `Synonyms: ${synonyms.join(", ")}`;
        definitionBlock.append(synonymText);
      }

      card.append(definitionBlock);
    });
  });

  entry.sourceUrls?.forEach((source) => {
    const sourceLink = document.createElement("a");
    sourceLink.className = "source-link d-block mt-3";
    sourceLink.href = source;
    sourceLink.target = "_blank";
    sourceLink.rel = "noopener noreferrer";
    sourceLink.textContent = `Source: ${source}`;
    card.append(sourceLink);
  });

  results.append(card);
}