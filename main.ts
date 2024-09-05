import { App, Editor, MarkdownView, Notice, Plugin } from "obsidian";

export default class TypographPlugin extends Plugin {
  async onload() {
    // Adding a command to the command palette
    this.addCommand({
      id: "apply-typography",
      name: "Apply Typography to Current File",
      editorCallback: (editor: Editor) => this.applyTypography(editor),
    });

    // Adding a button to the toolbar
    this.addRibbonIcon("pencil", "Apply Typography", () => {
      const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (activeView) {
        this.applyTypography(activeView.editor);
      }
    });

    console.log("Typograph plugin loaded");
  }

  applyTypography(editor: Editor) {
    const text = editor.getValue();
    const lines = text.split("\n");

    let changesCount = 0;
    let formattedText = lines
      .map((line) => {
        const lang = this.detectLanguage(line);
        if (lang === "en") {
          // Now checks for English language first
          const result = this.typographyEnglish(line);
          changesCount += result.changesCount;
          return result.text;
        } else if (lang === "ru") {
          // Then checks for Russian language
          const result = this.typographyRussian(line);
          changesCount += result.changesCount;
          return result.text;
        }
        return line;
      })
      .join("\n");

    if (changesCount > 0) {
      editor.setValue(formattedText);
      new Notice(`${changesCount} changes applied.`);
    } else {
      new Notice("No changes were necessary.");
    }
  }

  // Detect the language of the text based on the presence of Cyrillic characters
  detectLanguage(text: string): string {
    const cyrillic = /[а-яА-ЯЁё]/;
    return cyrillic.test(text) ? "ru" : "en";
  }

  // Function for typography rules specific to English
  typographyEnglish(text: string): { text: string; changesCount: number } {
    let changesCount = 0;

    // Replace spaces after short words (prepositions, articles, conjunctions) with non-breaking spaces
    const prepositionsEnglish = /\b(and|the|a|an|to|at|in|on|by|of|for|from|as|with|but)\s+/gi;
    text = text.replace(prepositionsEnglish, (match, p1) => {
      changesCount++;
      return `${p1}\u00A0`;
    });

    // Replace spaces between numbers and metric units with non-breaking spaces
    text = text.replace(/(\d+)\s+(cm|mm|m|km|kg|g|mg|lb|oz)/g, (match, p1, p2) => {
      changesCount++;
      return `${p1}\u00A0${p2}`;
    });

    // Replace ": " or ", " before direct speech with the appropriate quotation marks
    text = text.replace(/([:,])\s*"([^"]*)"/g, (match, p1, p2) => {
      changesCount++;
      return `${p1} ‘${p2}’`;
    });

    // Replace all double quotation marks with “...”
    text = text.replace(/"([^"]*)"/g, (match, p1) => {
      changesCount++;
      return `“${p1}”`;
    });

    // Replace nested quotation marks inside “...” with ‘...’
    text = text.replace(/“([^“”]*)”/g, (match, p1) => {
      const newText = p1.replace(/'([^']*)'/g, (subMatch, p2) => {
        changesCount++;
        return `‘${p2}’`;
      });
      return `“${newText}”`;
    });

    // Replace >> with » and << with «
    text = text.replace(/>>/g, '»').replace(/<</g, '«');

    // Replace -- and - with —
    text = text.replace(/--/g, '—').replace(/-/g, '—');

    return { text, changesCount };
  }

  // Function for typography rules specific to Russian
  typographyRussian(text: string): { text: string; changesCount: number } {
    let changesCount = 0;

    // Replace ": " or ", " before direct speech with the appropriate quotation marks
    text = text.replace(/([:,])\s*"([^"]*)"/g, (match, p1, p2) => {
      changesCount++;
      return `${p1} «${p2}»`;
    });

    // Replace nested quotation marks inside «...» with „...“
    text = text.replace(/«([^«»][^„“]*)»/g, (match, p1) => {
      changesCount++;
      return `„${p1}“`;
    });

    // Replace all double quotation marks with «...»
    text = text.replace(/"([^"]*)"/g, (match, p1) => {
      changesCount++;
      return `«${p1}»`;
    });


    // Replace >> with » and << with «
    text = text.replace(/>>/g, '»');
    text = text.replace(/<</g, '«');
    changesCount++;

    // Replace spaces after short words (prepositions) with non-breaking spaces
    const prepositionsRussian = /(в|и|к|с|у|о|на|по|за|от|для|до|со)(\s+)/gi;
    text = text.replace(prepositionsRussian, (match, p1, p2) => {
      changesCount++;
      return `${p1}\u00A0`; // Replace only the space after the word
    });

    // Replace spaces between numbers and metric units with non-breaking spaces
    text = text.replace(/(\d+)\s+(см|мм|м|км|кг|г|мг|фунт|унц)/g, (match, p1, p2) => {
      changesCount++;
      return `${p1}\u00A0${p2}`;
    });

    // Replace -- with — (em dash)
    text = text.replace(/--/g, '—');
    changesCount += (text.match(/--/g) || []).length;

    // Replace standalone - with — (em dash), but preserve:
    // 1. Dashes at the beginning of a line (for lists)
    // 2. Dashes in number ranges (e.g., 1-5)
    // 3. Dashes in compound words (e.g., что-то)
    text = text.replace(/(?<!^|\d|[а-яА-ЯёЁ])-(?!\d|[а-яА-ЯёЁ])/gm, '—');
    changesCount += (text.match(/(?<!^|\d|[а-яА-ЯёЁ])-(?!\d|[а-яА-ЯёЁ])/gm) || []).length;

    return { text, changesCount };
  }

  onunload() {
    console.log("Typograph plugin unloaded");
  }
}