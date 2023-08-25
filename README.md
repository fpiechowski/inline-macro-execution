# inline-macro-execution

## Usage
In any document add:
```
[[/macroExec <macroId> <args>]]{flavor}
```
to inline a link for macro execution with arguments, eg.
```
[[/macroExec tImUWV1n6XbTcsyV actorId=7H3u64HL8HuefXJP skill=ste]]
```
where
`tImUWV1n6XbTcsyV` is a macro ID for a macro with the following command:
```
game.actors.get(scope.actorId).rollSkill(scope.skill);
```
`7H3u64HL8HuefXJP` is an actor ID for some actor that can roll a skill check

`actorId` and `skill` are argument names that can be passed to the macro using `scope` object

`flavor` is the link's label