declare module "pTypes" {
    type Word = string | number;
    type ValueStack = Array<Word>;
    type ProgramList = Array<Word>;
    interface WordDictionary {
        [key: string]: ProgramList | ((s: ValueStack) => ValueStack);
    }
}
