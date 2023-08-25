Hooks.once('devModeReady', ({registerPackageDebugFlag}) => {
    registerPackageDebugFlag(InlineMacroExecution.ID);
});

class InlineMacroExecution {
    static ID = "inline-macro-execution";

    static log(force, ...args) {
        const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);
        if (shouldLog) {
            console.log(this.ID, '|', ...args);
        }
    }
}

Hooks.on("init", function () {
    const rgx = /\[\[(\/macroExec\s)?(.*?)(]{2,3})(?:{([^}]+)})?/gi;
    CONFIG.TextEditor.enrichers.push({
        pattern: rgx,
        enricher: macroExecutionEnricher,
    });

    InlineMacroExecution.log(true, "enricher pushed");

    const body = $("body");
    body.on("click", "a.inline-macro-execution", onClick);
});

function macroExecutionEnricher(match, options) {
    InlineMacroExecution.log(false, "match", match);

    try {
        const macroIdPlusArgs = match[2];
        const flavor = match[4];

        InlineMacroExecution.log(false, "macroIdPlusArgs", macroIdPlusArgs, "flavor", flavor);

        const title = macroIdPlusArgs;

        InlineMacroExecution.log(false, "title", title, "flavor", flavor);
        return macroExecutionButton(macroIdPlusArgs, title, flavor);
    } catch (e) {
        InlineMacroExecution.log(`ERROR: ${e}`);
    }
}

function macroExecutionButton(macroIdPlusArgs, title, flavor) {
    const a = document.createElement("a");
    a.classList.add("inline-macro-execution");
    a.dataset.macroIdPlusArgs = macroIdPlusArgs;
    a.innerHTML = `<i class="fas fa-dice-d20"></i> ${flavor ?? title}`;
    return a;
}

async function onClick(event) {
    event.preventDefault();
    const a = event.currentTarget;
    InlineMacroExecution.log(false, "a.dataset", a.dataset);

    const macroIdPlusArgs = a.dataset.macroIdPlusArgs.split(" ");
    const macroId = macroIdPlusArgs[0];
    const args = macroIdPlusArgs.slice(1)
        .map((s) => s.split("="))
        .reduce(function (acc, entry) {
            acc[entry[0]] = entry[1];
            return acc;
        }, {});

    game.macros.get(macroId).execute(args);
}
