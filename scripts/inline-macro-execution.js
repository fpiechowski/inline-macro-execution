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
    const rgx = /\[\[(\/macroExec)\s*(?:"([^"]*)"|(\S+))\s*(.*?)\s*(]{2,3})(?:{([^}]+)})?/gi;
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
        const macroName = match[2];
        const argsString = match[4];
        const flavor = match[6];

        InlineMacroExecution.log(false, "macroName", macroName, "argsString", argsString, "flavor", flavor);

        const macro = game.macros.getName(macroName);
        const title = `${macro.name}(${argsString})`;

        InlineMacroExecution.log(false, "title", title, "flavor", flavor);
        return macroExecutionButton(macroName, argsString, title, flavor);
    } catch (e) {
        InlineMacroExecution.log(`ERROR: ${e}`);
    }
}

function macroExecutionButton(macroName, argsString, title, flavor) {
    const a = document.createElement("a");
    a.classList.add("inline-macro-execution");
    a.dataset.macroName = macroName;
    a.dataset.args = argsString;
    a.innerHTML = `<i class="fas fa-dice-d20"></i> ${flavor ?? title}`;
    return a;
}

async function onClick(event) {
    try {
        event.preventDefault();
        const a = event.currentTarget;
        InlineMacroExecution.log(false, "a.dataset", a.dataset);

        const macroName = a.dataset.macroName;
        const argsString = a.dataset.args;
        const argsRgx = /(\w+)=\s*(?:"([^"]*)"|(\S+))/g;

        const args = {};
        let match;
        while ((match = argsRgx.exec(argsString)) !== null) {
            match
            const key = match[1];
            const value = match[2] ?? match[3];
            args[key] = value;
        }

        game.macros.getName(macroName).execute(args);
    } catch (e) {
        InlineMacroExecution.log(false, "error", e);
        ui.notifications.error(e.error);
        throw e;
    }
}
