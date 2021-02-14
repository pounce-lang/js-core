# Pounce-lang Docs
Syntax: the Pounce language is a concatinative language with a classically minimal syntax:
 * Clear Space is defined as space, tab, or new-line
 * Words are any series of visible characters, not including code comments, list delimiters or clear space
 * a Phrase is a series of words or lists separated by clear space
 * Code Comments are started with a `#` character and end with a new-line
 * Lists are delimited by square brackets `[` and `]` and contain any number of words or lists
 
Only the word `compose` is reserved and cannot be redefined.

## Core Words: definitions, usage and meaning
Each core word is categorized and discussed in context of usage.

Categories: Arithmetic, String, Stack, List, Flow and Introspection

### words `[Introspection]`
This word lists all words in the core dictionary with the exception of `compose`.
[words word dup swap drop round + - / % * & | ^ ~ && || ! E LN10 LN2 LOG10E LOG2E PI SQRT1_2 SQRT2 abs acos acosh asin asinh atan atan2 atanh cbrt ceil cos cosh exp expm1 floor hypot log log10 log1p log2 max min pow random sign sin sinh sqrt tan tanh trunc play pounce dip dip2 rotate rollup rolldown if-else ifte = == != > < >= <= concat cons uncons push pop constrec linrec linrec5 binrec dup2 times map filter reduce split size depth stack-copy]

### word `[Introspection]`

### dup `[Stack]`

### swap `[Stack]`

### drop `[Stack]`

### round `[Arithmetic]`

### + `[Arithmetic]`

### - `[Arithmetic]`

### / [Arithmetic]

### % [Arithmetic]

### * [Arithmetic]

### & [Arithmetic]

### | [Arithmetic]

### ^ [Arithmetic]

### ~ [Arithmetic]

### && [Arithmetic]

### || [Arithmetic]

### ! [Arithmetic]

### E [Arithmetic]

### LN10 [Arithmetic]

### LN2 [Arithmetic]

### LOG10E [Arithmetic]

### LOG2E [Arithmetic]

### PI [Arithmetic]

### SQRT1_2 [Arithmetic]

### SQRT2 [Arithmetic]

### abs [Arithmetic]

### acos [Arithmetic]

### acosh [Arithmetic]

### asin [Arithmetic]

### asinh [Arithmetic]

### atan [Arithmetic]

### atan2 [Arithmetic]

### atanh [Arithmetic]

### cbrt [Arithmetic]

### ceil [Arithmetic]

### cos [Arithmetic]

### cosh [Arithmetic]

### exp [Arithmetic]

### expm1 [Arithmetic]

### floor [Arithmetic]

### hypot [Arithmetic]

### log [Arithmetic]

### log10 [Arithmetic]

### log1p [Arithmetic]

### log2 [Arithmetic]

### max [Arithmetic]

### min [Arithmetic]

### pow [Arithmetic]

### random [Arithmetic]

### sign [Arithmetic]

### sin [Arithmetic]

### sinh [Arithmetic]

### sqrt [Arithmetic]

### tan [Arithmetic]

### tanh [Arithmetic]

### trunc [Arithmetic]

### compose [Flow]
The only reserved word in Pounce, `compose` is processed before runtime. It affects the word dictionary and it consumes its stack arguments. It can not be used in a list, so it must be used at the outer most (base) level of a program. 
> [a phrase of words] [name-of-word] compose

> [1 +] [increment-by-one] compose

`compose`, stores a phrase of words as a named-word in the runtime word dictionary

### play [Flow]
The word 'play' concatinates words onto the running program. A list containing a phrase is dequoted prepended at the beginning of the program.
> [a phrase of words] play

> [1 1 +] play # Yeilds `2` on the stack

`play` is equivalent to the Joy language word `i`

### pounce [Flow]
The word `pounce` first moves stack values into the phrase and then concatinates the modified words onto the running program. A list of named stack references and a list containing a phrase to be dequoted and prepended at the beginning of the program.
> [a etc] [a phrase of words] pounce

> 3 2 [a b] [b a -] pounce # Yeilds `-1` on the stack


### dip [Flow] 

### dip2 [Flow] 

### rotate [Stack]

### rollup [Stack]

### rolldown [Stack]

### if-else [Flow] 

### ifte [Flow] 

### = [Arithmetic]

### == [Arithmetic]

### != [Arithmetic]

### > [Arithmetic]

### < [Arithmetic]

### >= [Arithmetic]

### <= [Arithmetic]

### concat [List] 

### cons [List] 

### uncons [List] 

### push [List] 

### pop [List] 

### constrec [Flow] 

### linrec [Flow] 

### linrec5 [Flow] 

### binrec [Flow] 

### dup2 `[Stack]`

### times [Flow] 

### map [List]

### filter [List] 

### reduce [List] 

### split [List] 

### size [List]

### depth [Stack]

### stack-copy [Stack]
