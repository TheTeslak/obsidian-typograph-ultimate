import { App, Editor, MarkdownView, Notice, Plugin } from "obsidian";

export default class TypographPlugin extends Plugin {
    async onload() {
        this.addCommand({
            id: "apply-typography",
            name: "Apply Typography to Current File",
            editorCallback: (editor: Editor) => this.applyTypography(editor),
        });

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
        const originalText = text;
        const { formattedText, changesCount } = this.applyTypographyRules(text);
        if (formattedText !== originalText) {
            editor.setValue(formattedText);
            new Notice(`Typography applied. ${changesCount} changes made.`);
        } else {
            editor.setValue(formattedText);
            new Notice("No typography changes were necessary.");
        }
    }

    applyTypographyRules(text: string): { formattedText: string, changesCount: number } {
        let formattedText = text;
        let changesCount = 0;
        let oldText;

        let quoteRegex = new RegExp('«|»|"|„|“|”|’|‘', "g");
        oldText = formattedText;
        formattedText = formattedText.replace(quoteRegex, "»");
        if (formattedText !== oldText) changesCount++;

        let singleQuoteRegex = new RegExp("'", "g");
        oldText = formattedText;
        formattedText = formattedText.replace(singleQuoteRegex, "»");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/( *)»(\S(?=[А-я]))/gi, "$1«$2");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/( *)»(\S(?=[A-z]))/gi, "$1«$2");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/( *)»(\S(?=[0-9]))/gi, "$1«$2");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/«»/g, "««");
        if (formattedText !== oldText) changesCount++;

        let quoteIterationCount = 0;
        while (quoteIterationCount < 30) {
            oldText = formattedText;
            formattedText = formattedText.replace(/«([^«»]*)«([^«»]*)»/g, "«$1„$2“");
            if (formattedText !== oldText) changesCount++;
            quoteIterationCount++;
        }

        oldText = formattedText;
        formattedText = formattedText.replace(/„([A-z])/g, "‘$1");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/([A-z](.*))“/g, "$1’");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/«([A-z])/g, "“$1");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/([A-z])( |\xA0)«‘/g, "$1$2“‘");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/«‘([A-z])/g, "“‘$1");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/([A-z])»/g, "$1”");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/([A-z])’»/g, "$1’”");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/’»( |\xA0)([A-z])/g, "’”$1$2");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/([A-z])”([A-z])/g, "$1’$2");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/«(\d+( |\xA0)[A-z])/g, "“$1");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/([A-z]( |\xA0)\d+)»/g, "$1”");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/\.»/g, "».");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/-|-/g, "-");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/–/g, "—");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/-( |\xA0)/g, "—$1");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/( |\xA0)-/g, "$1—");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/([^ \xA0])—( |\xA0)(и|да|либо)/g, "$1-$2$3");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/([^ |\xA0])( |\xA0)?—( |\xA0)?([^ ])/g, "$1$2—$3$4");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/(\n)( |\xA0)*—( |\xA0)*([A-ZА-ЯЁ])/g, "$1—\xA0$4");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/([A-ZА-ЯЁ])( |\xA0)—/g, "$1\xA0—");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/^-([^ |\xA0])/g, "— $1");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/<!\xA0—\xA0(—|-)/g, "<!--");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/— (—|-)+>/g, "-->");
        if (formattedText !== oldText) changesCount++;

        const prepositions = ["без", "безо", "в", "во", "вне", "для", "до", "за", "из", "изо", "из-за", "из-под", "к", "ко", "на", "над", "надо", "о", "об", "обо", "около", "от", "ото", "по", "по-над", "под", "подо", "при", "про", "с", "со", "сквозь", "у", "через", "а", "но", "и", "да", "или", "иль", "либо", "не", "ни", "a", "the", "at", "to", "or"];
        for (const prep of prepositions) {
            const prepRegex = new RegExp("( |^|\\(|«|„|\xA0)(" + prep + ") ", "ig");
            oldText = formattedText;
            formattedText = formattedText.replace(prepRegex, "$1$2\xA0");
            if (formattedText !== oldText) changesCount++;
        }

        oldText = formattedText;
        formattedText = formattedText.replace(/(\s)([A-ZА-ЯЁ]) ([A-ZА-ЯЁ])/ig, "$1$2\xA0$3");
        if (formattedText !== oldText) changesCount++;

        let particleRegex = new RegExp(" (бы|ли|же|б|ль|ж)( |\xA0|\\.|,|!|\\?|:|;)", "ig");
        oldText = formattedText;
        formattedText = formattedText.replace(particleRegex, "\xA0$1$2");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/(т)\.( *)(д|п|ч|наз|к|г|е|обр)\./ig, "$1.\xA0$3.");
        if (formattedText !== oldText) changesCount++;

        let abbreviationRegex = new RegExp("(рис\\.|илл\\.|№|§|п\\.|гл\\.|ч\\.|стр\\.)( *)([0-9]|I|V|X|L|C|D|M)", "ig");
        oldText = formattedText;
        formattedText = formattedText.replace(abbreviationRegex, "$1\xA0$3");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/№([^ ])/g, "№\xA0$1");
        if (formattedText !== oldText) changesCount++;

        let cmRegex = new RegExp("(см\\.|им\\.)( *)", "ig");
        oldText = formattedText;
        formattedText = formattedText.replace(cmRegex, "$1\xA0");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/([^^>\.]) (.{1,4})$/g, "$1\xA0$2");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/( |\xA0)( |\xA0)/g, "\xA0");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/\.\s\u0029/g, ".\u0029");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/(\d+) ?(%|\$|€|₽|°)/g, "$1\xA0$2");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/(\$|€) ?(\d+)/g, "$1$2");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/( |\xA0)(\w+)(\.|!|\?)( |\xA0)?\n/g, "\xA0$2$3\n");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/( |\xA0)(\w+)(\.|!|\?)$/g, "\xA0$2$3");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/( |\xA0|^|\n|\u2028|\u2029|$|€|₽)(\d{1,3}) ?(\d{3}) ?(\d{3}) ?(\d{3}) ?(\d{3}) ?(\d{3}) ?(\d{3}) ?(\d{3})/g, "$1$2\xA0$3\xA0$4\xA0$5\xA0$6\xA0$7\xA0$8\xA0$9");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/( |\xA0|^|\n|\u2028|\u2029|$|€|₽)(\d{1,3}) ?(\d{3}) ?(\d{3}) ?(\d{3}) ?(\d{3}) ?(\d{3}) ?(\d{3})/g, "$1$2\xA0$3\xA0$4\xA0$5\xA0$6\xA0$7\xA0$8");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/( |\xA0|^|\n|\u2028|\u2029|$|€|₽)(\d{1,3}) ?(\d{3}) ?(\d{3}) ?(\d{3}) ?(\d{3}) ?(\d{3})/g, "$1$2\xA0$3\xA0$4\xA0$5\xA0$6\xA0$7");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/( |\xA0|^|\n|\u2028|\u2029|$|€|₽)(\d{1,3}) ?(\d{3}) ?(\d{3}) ?(\d{3}) ?(\d{3})/g, "$1$2\xA0$3\xA0$4\xA0$5\xA0$6");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/( |\xA0|^|\n|\u2028|\u2029|$|€|₽)(\d{1,3}) ?(\d{3}) ?(\d{3}) ?(\d{3})/g, "$1$2\xA0$3\xA0$4\xA0$5");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/( |\xA0|^|\n|\u2028|\u2029|$|€|₽)(\d{1,3}) ?(\d{3}) ?(\d{3}) ?(\d{3})/g, "$1$2\xA0$3\xA0$4\xA0$5");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/( |\xA0|^|\n|\u2028|\u2029|$|€|₽)(\d{2,3}) ?(\d{3})/g, "$1$2\xA0$3");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/(\d ?)((руб)|(Руб)|(РУБ))\. *([0-9А-ЯЁ])/g, "$1\xA0₽. $7");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/(\d ?)((руб)|(Руб)|(РУБ))\. *([0-9A-Z])/g, "$1\xA0₽. $7");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/(\d ?)((руб)|(Руб)|(РУБ))\./g, "$1\xA0₽");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/(\d ?)(р|Р)\. *([0-9А-ЯЁ])/g, "$1\xA0₽. $3");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/(\d ?)(р|Р)\. *([0-9A-Z])/g, "$1\xA0₽. $3");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/(\d ?)(р|Р)\./g, "$1\xA0₽");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/\s?(\(c\))|\s?(\(с\))/gi, "\xA0©");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/\s?\(r\)/gi, "\xA0®");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/\s?\(d\)/gi, "\xA0°");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/\s?(\(tm\))|\s?(\(тм\))/gi, "™");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/\s?(\s)--(\s)\s?/g, "\xA0$1—$2 ");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/<-/g, "←");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/->/g, "→");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/(\S)( |\xA0)?(\+-)|(\+\/-)\s?(\d|\(|\))/g, "$1 ±\xA0$5");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/(\S)( |\xA0)?\!\=\s?(\d|\(|\))/g, "$1 ≠\xA0$3");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/(\S)( |\xA0)?(\+|\-|\=|\*|\/|≈|×)\s?(\d|\(|\))/g, "$1 $3 $4");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/(\S)( |\xA0)?\-\s?(\d|\(|\))/g, "$1 − $3");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/(\!|\?){2,}/g, "$1");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/\s?(мкм|мм|см|дм|м|км|µm|mm|cm|m|km)\^?2/gi, "\xA0$1²");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/\s?(мкм|мм|см|дм|м|км|µm|mm|cm|m|km)\^?3/gi, "\xA0$1³");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/(\\|\/)\xA0(мкм|мм|см|дм|м|км|µm|mm|cm|m|km)(²|³)/gi, "\/$2$3");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/\+( |\xA0)?([0-9]{1,4})( |\xA0)?( |\xA0|-|−|–|—)?(\()?( |\xA0)?([0-9]{1,4})( |\xA0)?(\))?( |\xA0|-|−|–|—)?( |\xA0)?([0-9]{1,3})( |\xA0)?( |\xA0|−|–|—)?( |\xA0)?([0-9]{2})( |\xA0)?( |\xA0|−|–|—)?( |\xA0)?([0-9]{2})/g, "+$2\xA0$5$7$9\xA0$12–$16–$20");
        if (formattedText !== oldText) changesCount++;

        oldText = formattedText;
        formattedText = formattedText.replace(/(^8|[^\d]8)( |\xA0)?( |\xA0|−|–|—)?(\()?( |\xA0)?([0-9]{1,4})( |\xA0)?(\))?( |\xA0|-|−|–|—)?( |\xA0)?([0-9]{1,3})( |\xA0)?( |\xA0|−|–|—)?( |\xA0)?([0-9]{2})( |\xA0)?( |\xA0|−|–|—)?( |\xA0)?([0-9]{2})/g, "$1\xA0$4$6$8\xA0$11–$15–$19");
        if (formattedText !== oldText) changesCount++;

        const phoneCodes = ["495", "499", "903", "905", "906", "909", "951", "953", "960", "961", "962", "963", "964", "965", "966", "967", "968", "910", "911", "912", "913", "914", "915", "916", "917", "918", "919", "980", "981", "982", "983", "984", "985", "987", "988", "989", "920", "921", "922", "923", "924", "925", "926", "927", "928", "929", "999"];
        for (const code of phoneCodes) {
            const phoneRegex = new RegExp("[(](" + code + ")[)]", "g");
            oldText = formattedText;
            formattedText = formattedText.replace(phoneRegex, "$1");
            if (formattedText !== oldText) changesCount++;
        }

        return { formattedText, changesCount };
    }

    onunload() {
        console.log("Typograph plugin unloaded");
    }
}