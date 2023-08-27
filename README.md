# inline-macro-execution

## Usage
In any document add:
```
[[/macroExec <macroName> <args>]]{flavor}
```
to inline a link for macro execution with arguments, eg.
```
[[/macroExec "Roll Actor Skill" actorName="Test Actor" skill=ste]]
```
where
`Roll Actor Skill` is a macro name (must be quoted) for a macro with the following command:
```
game.actors.get(scope.actorName).rollSkill(scope.skill);
```
`Test Actor` is an actor ID for some actor that can roll a skill check

`actorName` and `skill` are argument names that can be passed to the macro using `scope` object

`flavor` is the link's label

If argument value contains whitespaces, wrap it in quotes `" "`.